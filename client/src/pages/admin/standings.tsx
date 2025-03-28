import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Standing, InsertStanding, insertStandingSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Loader2, Edit, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { z } from 'zod';

export default function AdminStandings() {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Standing | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Data fetching
  const { data: standings, isLoading } = useQuery<Standing[]>({
    queryKey: ['/api/standings'],
    queryFn: async () => {
      const response = await fetch('/api/standings');
      if (!response.ok) throw new Error('Не удалось загрузить турнирную таблицу');
      return response.json();
    }
  });

  // Define the validation schema with Zod
  const standingFormSchema = insertStandingSchema.extend({
    goalsFor: z.coerce.number().min(0, 'Количество забитых мячей должно быть не меньше 0'),
    goalsAgainst: z.coerce.number().min(0, 'Количество пропущенных мячей должно быть не меньше 0'),
    points: z.coerce.number().min(0, 'Количество очков должно быть не меньше 0'),
    played: z.coerce.number().min(0, 'Количество игр должно быть не меньше 0'),
    won: z.coerce.number().min(0, 'Количество побед должно быть не меньше 0'),
    drawn: z.coerce.number().min(0, 'Количество ничьих должно быть не меньше 0'),
    lost: z.coerce.number().min(0, 'Количество поражений должно быть не меньше 0'),
    position: z.coerce.number().min(1, 'Позиция должна быть не меньше 1'),
  });

  // Form for adding teams
  const form = useForm<z.infer<typeof standingFormSchema>>({
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

  // Add team mutation
  const addTeamMutation = useMutation({
    mutationFn: async (data: InsertStanding) => {
      const response = await apiRequest('POST', '/api/standings', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Команда добавлена",
        description: "Команда успешно добавлена в турнирную таблицу",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
      setIsAddTeamOpen(false);
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

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertStanding> }) => {
      const response = await apiRequest('PUT', `/api/standings/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Команда обновлена",
        description: "Данные команды успешно обновлены",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
      setIsEditTeamOpen(false);
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

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/standings/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Команда удалена",
        description: "Команда успешно удалена из турнирной таблицы",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/standings'] });
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

  // Handle form submissions
  const onAddSubmit = (data: z.infer<typeof standingFormSchema>) => {
    addTeamMutation.mutate(data);
  };

  const onEditSubmit = (data: z.infer<typeof standingFormSchema>) => {
    if (selectedTeam) {
      updateTeamMutation.mutate({ id: selectedTeam.id, data });
    }
  };

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
    setIsEditTeamOpen(true);
  };

  const handleDelete = (id: number) => {
    setTeamToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teamToDelete !== null) {
      deleteTeamMutation.mutate(teamToDelete);
    }
  };

  // Sort standings by position
  const sortedStandings = standings ? [...standings].sort((a, b) => a.position - b.position) : [];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление турнирной таблицей</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">Всего команд: {standings?.length || 0}</p>
          </div>
          
          <Button onClick={() => {
            form.reset({
              team: '',
              position: (sortedStandings.length > 0 ? sortedStandings[sortedStandings.length - 1].position + 1 : 1),
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              points: 0
            });
            setIsAddTeamOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Добавить команду
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
                  <TableHead className="text-center">Игры</TableHead>
                  <TableHead className="text-center">В</TableHead>
                  <TableHead className="text-center">Н</TableHead>
                  <TableHead className="text-center">П</TableHead>
                  <TableHead className="text-center">Мячи</TableHead>
                  <TableHead className="text-center">Очки</TableHead>
                  <TableHead className="text-right w-[120px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStandings.length > 0 ? (
                  sortedStandings.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="text-center">{team.position}</TableCell>
                      <TableCell className="font-medium">{team.team}</TableCell>
                      <TableCell className="text-center">{team.played}</TableCell>
                      <TableCell className="text-center">{team.won}</TableCell>
                      <TableCell className="text-center">{team.drawn}</TableCell>
                      <TableCell className="text-center">{team.lost}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}-{team.goalsAgainst}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
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
                            onClick={() => handleDelete(team.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
        
        {/* Add Team Dialog */}
        <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Добавить команду</DialogTitle>
              <DialogDescription>
                Заполните данные команды для турнирной таблицы
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название команды</FormLabel>
                      <FormControl>
                        <Input placeholder="Динамо" {...field} />
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
                          <Input type="number" min="1" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddTeamOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={addTeamMutation.isPending}>
                    {addTeamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Добавить
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Team Dialog */}
        <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Редактировать команду</DialogTitle>
              <DialogDescription>
                Измените данные команды в турнирной таблице
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название команды</FormLabel>
                      <FormControl>
                        <Input placeholder="Динамо" {...field} />
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
                          <Input type="number" min="1" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditTeamOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={updateTeamMutation.isPending}>
                    {updateTeamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Сохранить
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
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
                onClick={confirmDelete}
                disabled={deleteTeamMutation.isPending}
              >
                {deleteTeamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}