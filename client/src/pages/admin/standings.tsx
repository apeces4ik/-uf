import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Standing } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const standingFormSchema = z.object({
  team: z.string().min(1, 'Введите название команды'),
  position: z.coerce.number().min(1, 'Позиция должна быть не меньше 1'),
  played: z.coerce.number().min(0, 'Количество игр должно быть не меньше 0'),
  won: z.coerce.number().min(0, 'Количество побед должно быть не меньше 0'),
  drawn: z.coerce.number().min(0, 'Количество ничьих должно быть не меньше 0'),
  lost: z.coerce.number().min(0, 'Количество поражений должно быть не меньше 0'),
  goalsFor: z.coerce.number().min(0, 'Количество забитых мячей должно быть не меньше 0'),
  goalsAgainst: z.coerce.number().min(0, 'Количество пропущенных мячей должно быть не меньше 0'),
  points: z.coerce.number().min(0, 'Количество очков должно быть не меньше 0'),
});

type StandingFormValues = z.infer<typeof standingFormSchema>;

export default function AdminStandings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Standing | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  const form = useForm<StandingFormValues>({
    resolver: zodResolver(standingFormSchema),
    defaultValues: {
      team: '',
      position: 1,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }
  });

  const { data: standings = [], isLoading } = useQuery<Standing[]>({
    queryKey: ['/api/standings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/standings');
      if (!response.ok) throw new Error('Не удалось загрузить турнирную таблицу');
      return response.json();
    }
  });

  const addStandingMutation = useMutation({
    mutationFn: async (data: StandingFormValues) => {
      const response = await apiRequest('POST', '/api/standings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
      toast({
        title: "Команда добавлена",
        description: "Команда успешно добавлена в турнирную таблицу",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось добавить команду: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateStandingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: StandingFormValues }) => {
      const response = await apiRequest('PUT', `/api/standings/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
      toast({
        title: "Команда обновлена",
        description: "Данные команды успешно обновлены",
      });
      setIsDialogOpen(false);
      setSelectedTeam(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить данные команды: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteStandingMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/standings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
      toast({
        title: "Команда удалена",
        description: "Команда успешно удалена из турнирной таблицы",
      });
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить команду: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleEdit = (team: Standing) => {
    setSelectedTeam(team);
    form.reset({
      team: team.team,
      position: team.position,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      points: team.points
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTeamToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: StandingFormValues) => {
    if (selectedTeam?.id) {
      updateStandingMutation.mutate({ id: selectedTeam.id, data });
    } else {
      addStandingMutation.mutate(data);
    }
  };

  const sortedStandings = [...standings].sort((a, b) => a.position - b.position);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управление турнирной таблицей</h1>
          <Button onClick={() => {
            setSelectedTeam(null);
            form.reset();
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить команду
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Позиция</TableHead>
                  <TableHead>Команда</TableHead>
                  <TableHead className="text-center">И</TableHead>
                  <TableHead className="text-center">В</TableHead>
                  <TableHead className="text-center">Н</TableHead>
                  <TableHead className="text-center">П</TableHead>
                  <TableHead className="text-center">ГЗ-ГП</TableHead>
                  <TableHead className="text-center">О</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStandings.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="text-center">{team.position}</TableCell>
                    <TableCell>{team.team}</TableCell>
                    <TableCell className="text-center">{team.played}</TableCell>
                    <TableCell className="text-center">{team.won}</TableCell>
                    <TableCell className="text-center">{team.drawn}</TableCell>
                    <TableCell className="text-center">{team.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}-{team.goalsAgainst}</TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(team)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => team.id && handleDelete(team.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedStandings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      Турнирная таблица пуста. Добавьте команды.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTeam ? 'Редактировать команду' : 'Добавить команду'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название команды</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Позиция</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="played"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Игры</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Очки</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="won"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Победы</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="drawn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ничьи</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Поражения</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="goalsFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Забитые мячи</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goalsAgainst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пропущенные мячи</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={addStandingMutation.isPending || updateStandingMutation.isPending}>
                    {addStandingMutation.isPending || updateStandingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {selectedTeam ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить команду</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить команду из турнирной таблицы? Это действие невозможно отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => teamToDelete && deleteStandingMutation.mutate(teamToDelete)}
                disabled={deleteStandingMutation.isPending}
              >
                {deleteStandingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}