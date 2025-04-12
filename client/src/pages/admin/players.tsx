import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Player, InsertPlayer, insertPlayerSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminPlayers() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isEditPlayerOpen, setIsEditPlayerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  // Fetch players
  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/players');
      if (!response.ok) throw new Error('Не удалось загрузить игроков');
      return response.json();
    }
  });

  // Add player mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (player: InsertPlayer) => {
      const res = await apiRequest('POST', '/api/players', player);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({
        title: 'Успешно',
        description: 'Игрок успешно добавлен',
      });
      setIsAddPlayerOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertPlayer> }) => {
      const res = await apiRequest('PUT', `/api/players/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({
        title: 'Успешно',
        description: 'Игрок успешно обновлен',
      });
      setIsEditPlayerOpen(false);
      setSelectedPlayer(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({
        title: 'Успешно',
        description: 'Игрок успешно удален',
      });
      setIsDeleteDialogOpen(false);
      setPlayerToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Form setup
  const playerForm = useForm<InsertPlayer>({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: '',
      number: 1,
      position: 'goalkeeper',
      age: 18,
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      photoUrl: ''
    }
  });

  // Form submissions
  const onAddPlayerSubmit = (data: InsertPlayer) => {
    addPlayerMutation.mutate(data);
  };

  const onEditPlayerSubmit = (data: InsertPlayer) => {
    if (selectedPlayer) {
      updatePlayerMutation.mutate({ id: selectedPlayer.id, data });
    }
  };

  // Edit handler
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    playerForm.reset({
      name: player.name,
      number: player.number,
      position: player.position,
      age: player.age,
      matches: player.matches,
      goals: player.goals,
      assists: player.assists,
      cleanSheets: player.cleanSheets,
      photoUrl: player.photoUrl || ''
    });
    setIsEditPlayerOpen(true);
  };

  // Delete handler
  const handleDeletePlayer = (id: number) => {
    setPlayerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter players based on search query
  const filteredPlayers = players?.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление игроками</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Поиск по имени или позиции..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddPlayerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить игрока
          </Button>
        </div>

        <div className="bg-white rounded-md border shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Позиция</TableHead>
                  <TableHead>Возраст</TableHead>
                  <TableHead>Матчи</TableHead>
                  <TableHead>Голы</TableHead>
                  <TableHead>Передачи</TableHead>
                  <TableHead className="w-[120px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers && filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.number}</TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>{player.age}</TableCell>
                      <TableCell>{player.matches}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlayer(player)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      {searchQuery ? 'Нет игроков, соответствующих поиску' : 'Нет игроков'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить игрока</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового игрока
            </DialogDescription>
          </DialogHeader>
          <Form {...playerForm}>
            <form onSubmit={playerForm.handleSubmit(onAddPlayerSubmit)} className="space-y-4">
              {/* Form fields */}
              <FormField
                control={playerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя игрока</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Позиция</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите позицию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="goalkeeper">Вратарь</SelectItem>
                        <SelectItem value="defender">Защитник</SelectItem>
                        <SelectItem value="midfielder">Полузащитник</SelectItem>
                        <SelectItem value="forward">Нападающий</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="matches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Матчи</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Голы</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="assists"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Передачи</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {playerForm.watch('position') === 'goalkeeper' && (
                <FormField
                  control={playerForm.control}
                  name="cleanSheets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сухие матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={playerForm.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL фотографии</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPlayerOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addPlayerMutation.isPending}>
                  {addPlayerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Добавить игрока'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={isEditPlayerOpen} onOpenChange={setIsEditPlayerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать игрока</DialogTitle>
            <DialogDescription>
              Измените данные игрока
            </DialogDescription>
          </DialogHeader>
          <Form {...playerForm}>
            <form onSubmit={playerForm.handleSubmit(onEditPlayerSubmit)} className="space-y-4">
              {/* Same form fields as Add Player */}
              <FormField
                control={playerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя игрока</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Возраст</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Позиция</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите позицию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="goalkeeper">Вратарь</SelectItem>
                        <SelectItem value="defender">Защитник</SelectItem>
                        <SelectItem value="midfielder">Полузащитник</SelectItem>
                        <SelectItem value="forward">Нападающий</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="matches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Матчи</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Голы</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name="assists"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Передачи</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {playerForm.watch('position') === 'goalkeeper' && (
                <FormField
                  control={playerForm.control}
                  name="cleanSheets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сухие матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={playerForm.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL фотографии</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPlayerOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updatePlayerMutation.isPending}>
                  {updatePlayerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Player Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого игрока? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => playerToDelete && deletePlayerMutation.mutate(playerToDelete)}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}