import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Player, Coach, InsertPlayer, InsertCoach, insertPlayerSchema, insertCoachSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Loader2, Edit, Trash2, Plus, Search } from 'lucide-react';

export default function AdminPlayers() {
  const [activeTab, setActiveTab] = useState<string>('players');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false);
  const [isEditPlayerOpen, setIsEditPlayerOpen] = useState(false);
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'player' | 'coach' } | null>(null);
  
  const { toast } = useToast();

  // Data fetching
  const { data: players, isLoading: isLoadingPlayers } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Не удалось загрузить игроков');
      return response.json();
    }
  });

  const { data: coaches, isLoading: isLoadingCoaches } = useQuery<Coach[]>({
    queryKey: ['/api/coaches'],
    queryFn: async () => {
      const response = await fetch('/api/coaches');
      if (!response.ok) throw new Error('Не удалось загрузить тренеров');
      return response.json();
    }
  });

  // Mutations
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
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

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
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const addCoachMutation = useMutation({
    mutationFn: async (coach: InsertCoach) => {
      const res = await apiRequest('POST', '/api/coaches', coach);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно добавлен',
      });
      setIsAddCoachOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const updateCoachMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertCoach> }) => {
      const res = await apiRequest('PUT', `/api/coaches/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно обновлен',
      });
      setIsEditCoachOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const deleteCoachMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/coaches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно удален',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Form handling
  const playerForm = useForm<InsertPlayer>({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: '',
      number: 0,
      position: 'midfielder',
      age: 20,
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      photoUrl: ''
    }
  });

  const editPlayerForm = useForm<InsertPlayer>({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: '',
      number: 0,
      position: 'midfielder',
      age: 20,
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      photoUrl: ''
    }
  });

  const coachForm = useForm<InsertCoach>({
    resolver: zodResolver(insertCoachSchema),
    defaultValues: {
      name: '',
      role: '',
      joinedYear: new Date().getFullYear(),
      achievements: '',
      photoUrl: ''
    }
  });

  const editCoachForm = useForm<InsertCoach>({
    resolver: zodResolver(insertCoachSchema),
    defaultValues: {
      name: '',
      role: '',
      joinedYear: new Date().getFullYear(),
      achievements: '',
      photoUrl: ''
    }
  });

  // Form submission handlers
  const onAddPlayerSubmit = (data: InsertPlayer) => {
    addPlayerMutation.mutate(data);
  };

  const onEditPlayerSubmit = (data: InsertPlayer) => {
    if (selectedPlayer) {
      updatePlayerMutation.mutate({ id: selectedPlayer.id, data });
    }
  };

  const onAddCoachSubmit = (data: InsertCoach) => {
    addCoachMutation.mutate(data);
  };

  const onEditCoachSubmit = (data: InsertCoach) => {
    if (selectedCoach) {
      updateCoachMutation.mutate({ id: selectedCoach.id, data });
    }
  };

  // Delete handler
  const handleDelete = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'player') {
      deletePlayerMutation.mutate(itemToDelete.id);
    } else {
      deleteCoachMutation.mutate(itemToDelete.id);
    }
  };

  // Edit handlers
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    editPlayerForm.reset({
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

  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    editCoachForm.reset({
      name: coach.name,
      role: coach.role,
      joinedYear: coach.joinedYear,
      achievements: coach.achievements || '',
      photoUrl: coach.photoUrl || ''
    });
    setIsEditCoachOpen(true);
  };

  // Filter data based on search query
  const filteredPlayers = players?.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoaches = coaches?.filter(coach => 
    coach.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positionToRussian = (position: string) => {
    const positions: Record<string, string> = {
      'goalkeeper': 'Вратарь',
      'defender': 'Защитник',
      'midfielder': 'Полузащитник',
      'forward': 'Нападающий'
    };
    return positions[position] || position;
  };

  const isLoading = isLoadingPlayers || isLoadingCoaches;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление составом</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="players">Игроки</TabsTrigger>
              <TabsTrigger value="coaches">Тренерский штаб</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Поиск..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {activeTab === 'players' ? (
                <Button onClick={() => {
                  playerForm.reset();
                  setIsAddPlayerOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить игрока
                </Button>
              ) : (
                <Button onClick={() => {
                  coachForm.reset();
                  setIsAddCoachOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Добавить тренера
                </Button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-md border shadow-sm">
            <TabsContent value="players">
              {isLoadingPlayers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">№</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Позиция</TableHead>
                      <TableHead className="text-center">Возраст</TableHead>
                      <TableHead className="text-center">Матчи</TableHead>
                      <TableHead className="text-center">Голы</TableHead>
                      <TableHead className="text-center">Передачи</TableHead>
                      <TableHead className="w-[120px] text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers && filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">{player.number}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{positionToRussian(player.position)}</TableCell>
                          <TableCell className="text-center">{player.age}</TableCell>
                          <TableCell className="text-center">{player.matches}</TableCell>
                          <TableCell className="text-center">{player.goals}</TableCell>
                          <TableCell className="text-center">{player.assists}</TableCell>
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
                              onClick={() => {
                                setItemToDelete({ id: player.id, type: 'player' });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          {searchQuery ? 'Нет игроков, соответствующих поиску' : 'Нет игроков в базе данных'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="coaches">
              {isLoadingCoaches ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Должность</TableHead>
                      <TableHead className="text-center">В клубе с</TableHead>
                      <TableHead>Достижения</TableHead>
                      <TableHead className="w-[120px] text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoaches && filteredCoaches.length > 0 ? (
                      filteredCoaches.map((coach) => (
                        <TableRow key={coach.id}>
                          <TableCell className="font-medium">{coach.name}</TableCell>
                          <TableCell>{coach.role}</TableCell>
                          <TableCell className="text-center">{coach.joinedYear}</TableCell>
                          <TableCell>{coach.achievements || '—'}</TableCell>
                          <TableCell className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCoach(coach)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setItemToDelete({ id: coach.id, type: 'coach' });
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          {searchQuery ? 'Нет тренеров, соответствующих поиску' : 'Нет тренеров в базе данных'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Add Player Dialog */}
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить игрока</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового игрока в команду
            </DialogDescription>
          </DialogHeader>
          <Form {...playerForm}>
            <form onSubmit={playerForm.handleSubmit(onAddPlayerSubmit)} className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={playerForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={playerForm.control}
                  name="matches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {playerForm.watch('position') === 'goalkeeper' && (
                <FormField
                  control={playerForm.control}
                  name="cleanSheets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сухие матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
          <Form {...editPlayerForm}>
            <form onSubmit={editPlayerForm.handleSubmit(onEditPlayerSubmit)} className="space-y-4">
              {/* Same form fields as Add Player */}
              <FormField
                control={editPlayerForm.control}
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editPlayerForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editPlayerForm.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Возраст</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editPlayerForm.control}
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
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editPlayerForm.control}
                  name="matches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editPlayerForm.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Голы</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editPlayerForm.control}
                  name="assists"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Передачи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {editPlayerForm.watch('position') === 'goalkeeper' && (
                <FormField
                  control={editPlayerForm.control}
                  name="cleanSheets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сухие матчи</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={editPlayerForm.control}
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
      
      {/* Add Coach Dialog */}
      <Dialog open={isAddCoachOpen} onOpenChange={setIsAddCoachOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить тренера</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового тренера в штаб
            </DialogDescription>
          </DialogHeader>
          <Form {...coachForm}>
            <form onSubmit={coachForm.handleSubmit(onAddCoachSubmit)} className="space-y-4">
              <FormField
                control={coachForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя тренера</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={coachForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Должность</FormLabel>
                    <FormControl>
                      <Input placeholder="Главный тренер" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={coachForm.control}
                name="joinedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В клубе с (год)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={coachForm.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Достижения</FormLabel>
                    <FormControl>
                      <Input placeholder="Кубок 2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={coachForm.control}
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
                <Button type="button" variant="outline" onClick={() => setIsAddCoachOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addCoachMutation.isPending}>
                  {addCoachMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Добавить тренера'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Coach Dialog */}
      <Dialog open={isEditCoachOpen} onOpenChange={setIsEditCoachOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать тренера</DialogTitle>
            <DialogDescription>
              Измените данные тренера
            </DialogDescription>
          </DialogHeader>
          <Form {...editCoachForm}>
            <form onSubmit={editCoachForm.handleSubmit(onEditCoachSubmit)} className="space-y-4">
              {/* Same form fields as Add Coach */}
              <FormField
                control={editCoachForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя тренера</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Должность</FormLabel>
                    <FormControl>
                      <Input placeholder="Главный тренер" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="joinedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В клубе с (год)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Достижения</FormLabel>
                    <FormControl>
                      <Input placeholder="Кубок 2022" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
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
                <Button type="button" variant="outline" onClick={() => setIsEditCoachOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateCoachMutation.isPending}>
                  {updateCoachMutation.isPending ? (
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого {itemToDelete?.type === 'player' ? 'игрока' : 'тренера'}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletePlayerMutation.isPending || deleteCoachMutation.isPending}
            >
              {(deletePlayerMutation.isPending || deleteCoachMutation.isPending) ? (
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
