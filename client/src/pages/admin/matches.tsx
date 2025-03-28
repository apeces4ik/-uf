import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Match, Team, InsertMatch, insertMatchSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CalendarIcon, 
  Clock, 
  Home, 
  ExternalLink 
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AdminMatches() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [isEditMatchOpen, setIsEditMatchOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch matches
  const { data: matches, isLoading: isLoadingMatches } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
    queryFn: async () => {
      const response = await fetch('/api/matches');
      if (!response.ok) throw new Error('Не удалось загрузить матчи');
      return response.json();
    }
  });

  // Fetch teams for dropdowns
  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Не удалось загрузить команды');
      return response.json();
    }
  });

  // Create match mutation
  const addMatchMutation = useMutation({
    mutationFn: async (match: InsertMatch) => {
      const res = await apiRequest('POST', '/api/admin/matches', match);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: 'Успешно',
        description: 'Матч успешно добавлен',
      });
      setIsAddMatchOpen(false);
      matchForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update match mutation
  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertMatch> }) => {
      const res = await apiRequest('PUT', `/api/admin/matches/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: 'Успешно',
        description: 'Матч успешно обновлен',
      });
      setIsEditMatchOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete match mutation
  const deleteMatchMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/matches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: 'Успешно',
        description: 'Матч успешно удален',
      });
      setIsDeleteDialogOpen(false);
      setMatchToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Forms
  const matchForm = useForm<InsertMatch>({
    resolver: zodResolver(insertMatchSchema),
    defaultValues: {
      date: new Date().toISOString(),
      opponentId: 1,
      isHome: true,
      competitionType: 'Чемпионат',
      competitionRound: 'Тур 1',
      score: '',
      stadium: 'Центральный',
      status: 'upcoming'
    }
  });

  const editMatchForm = useForm<InsertMatch>({
    resolver: zodResolver(insertMatchSchema),
    defaultValues: {
      date: new Date().toISOString(),
      opponentId: 1,
      isHome: true,
      competitionType: 'Чемпионат',
      competitionRound: 'Тур 1',
      score: '',
      stadium: 'Центральный',
      status: 'upcoming'
    }
  });

  // Form submission handlers
  const onAddMatchSubmit = (data: InsertMatch) => {
    addMatchMutation.mutate(data);
  };

  const onEditMatchSubmit = (data: InsertMatch) => {
    if (selectedMatch) {
      updateMatchMutation.mutate({ id: selectedMatch.id, data });
    }
  };

  // Edit match handler
  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    editMatchForm.reset({
      date: match.date,
      opponentId: match.opponentId,
      isHome: match.isHome,
      competitionType: match.competitionType,
      competitionRound: match.competitionRound || '',
      score: match.score || '',
      stadium: match.stadium,
      status: match.status
    });
    setIsEditMatchOpen(true);
  };

  // Delete match handler
  const handleDeleteMatch = (id: number) => {
    setMatchToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter and separate matches
  const now = new Date();
  
  const upcomingMatches = matches
    ?.filter(match => 
      match.status === 'upcoming' && 
      match.competitionType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastMatches = matches
    ?.filter(match => 
      match.status === 'finished' && 
      match.competitionType.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Helper function to get team name by ID
  const getTeamName = (id: number) => {
    return teams?.find(team => team.id === id)?.name || 'Неизвестно';
  };

  // Format date nicely
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const isLoading = isLoadingMatches || isLoadingTeams;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление матчами</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="upcoming">Предстоящие матчи</TabsTrigger>
              <TabsTrigger value="past">Прошедшие матчи</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Поиск по турниру..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button onClick={() => {
                matchForm.reset({
                  date: new Date().toISOString(),
                  opponentId: teams?.[0]?.id || 1,
                  isHome: true,
                  competitionType: 'Чемпионат',
                  competitionRound: 'Тур 1',
                  score: '',
                  stadium: 'Центральный',
                  status: 'upcoming'
                });
                setIsAddMatchOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Добавить матч
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-md border shadow-sm">
            <TabsContent value="upcoming">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата и время</TableHead>
                      <TableHead>Соперник</TableHead>
                      <TableHead>Место</TableHead>
                      <TableHead>Турнир</TableHead>
                      <TableHead>Стадия/тур</TableHead>
                      <TableHead>Стадион</TableHead>
                      <TableHead className="w-[120px] text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingMatches && upcomingMatches.length > 0 ? (
                      upcomingMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{formatMatchDate(match.date)}</TableCell>
                          <TableCell>{getTeamName(match.opponentId)}</TableCell>
                          <TableCell>{match.isHome ? 'Дома' : 'В гостях'}</TableCell>
                          <TableCell>{match.competitionType}</TableCell>
                          <TableCell>{match.competitionRound || '-'}</TableCell>
                          <TableCell>{match.stadium}</TableCell>
                          <TableCell className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMatch(match)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMatch(match.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          {searchQuery ? 'Нет матчей, соответствующих поиску' : 'Нет предстоящих матчей'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата и время</TableHead>
                      <TableHead>Соперник</TableHead>
                      <TableHead>Место</TableHead>
                      <TableHead>Турнир</TableHead>
                      <TableHead>Счет</TableHead>
                      <TableHead>Стадион</TableHead>
                      <TableHead className="w-[120px] text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastMatches && pastMatches.length > 0 ? (
                      pastMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{formatMatchDate(match.date)}</TableCell>
                          <TableCell>{getTeamName(match.opponentId)}</TableCell>
                          <TableCell>{match.isHome ? 'Дома' : 'В гостях'}</TableCell>
                          <TableCell>{match.competitionType}</TableCell>
                          <TableCell className="font-medium">{match.score || '-'}</TableCell>
                          <TableCell>{match.stadium}</TableCell>
                          <TableCell className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMatch(match)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMatch(match.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          {searchQuery ? 'Нет матчей, соответствующих поиску' : 'Нет прошедших матчей'}
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
      
      {/* Add Match Dialog */}
      <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить матч</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового матча
            </DialogDescription>
          </DialogHeader>
          <Form {...matchForm}>
            <form onSubmit={matchForm.handleSubmit(onAddMatchSubmit)} className="space-y-4">
              {/* Date field */}
              <FormField
                control={matchForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата и время</FormLabel>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PP', { locale: ru }) : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const current = field.value ? new Date(field.value) : new Date();
                                date.setHours(current.getHours());
                                date.setMinutes(current.getMinutes());
                                field.onChange(date.toISOString());
                              }
                            }}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Input
                        type="time"
                        className="w-32"
                        value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const date = new Date(field.value || new Date());
                          date.setHours(hours || 0);
                          date.setMinutes(minutes || 0);
                          field.onChange(date.toISOString());
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Opponent field */}
              <FormField
                control={matchForm.control}
                name="opponentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Соперник</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите соперника" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams?.filter(team => team.name !== "Александрия").map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Home/Away field */}
              <FormField
                control={matchForm.control}
                name="isHome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Место проведения</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'true')} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите место" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Домашний матч</SelectItem>
                        <SelectItem value="false">Выездной матч</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Competition fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={matchForm.control}
                  name="competitionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Турнир</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите турнир" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Чемпионат">Чемпионат</SelectItem>
                          <SelectItem value="Кубок">Кубок</SelectItem>
                          <SelectItem value="Суперкубок">Суперкубок</SelectItem>
                          <SelectItem value="Товарищеский">Товарищеский</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={matchForm.control}
                  name="competitionRound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Стадия/тур</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: Тур 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Stadium field */}
              <FormField
                control={matchForm.control}
                name="stadium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стадион</FormLabel>
                    <FormControl>
                      <Input placeholder="Название стадиона" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status field */}
              <FormField
                control={matchForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус матча</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Предстоящий</SelectItem>
                        <SelectItem value="finished">Завершенный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Score field (only for finished matches) */}
              {matchForm.watch('status') === 'finished' && (
                <FormField
                  control={matchForm.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Счет</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: 2:0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddMatchOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addMatchMutation.isPending}>
                  {addMatchMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Добавить матч'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Match Dialog */}
      <Dialog open={isEditMatchOpen} onOpenChange={setIsEditMatchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать матч</DialogTitle>
            <DialogDescription>
              Измените данные матча
            </DialogDescription>
          </DialogHeader>
          <Form {...editMatchForm}>
            <form onSubmit={editMatchForm.handleSubmit(onEditMatchSubmit)} className="space-y-4">
              {/* Same form fields as Add Match */}
              <FormField
                control={editMatchForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Дата и время</FormLabel>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'PP', { locale: ru }) : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const current = field.value ? new Date(field.value) : new Date();
                                date.setHours(current.getHours());
                                date.setMinutes(current.getMinutes());
                                field.onChange(date.toISOString());
                              }
                            }}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Input
                        type="time"
                        className="w-32"
                        value={field.value ? format(new Date(field.value), 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const date = new Date(field.value || new Date());
                          date.setHours(hours || 0);
                          date.setMinutes(minutes || 0);
                          field.onChange(date.toISOString());
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMatchForm.control}
                name="opponentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Соперник</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите соперника" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams?.filter(team => team.name !== "Александрия").map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMatchForm.control}
                name="isHome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Место проведения</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'true')} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите место" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Домашний матч</SelectItem>
                        <SelectItem value="false">Выездной матч</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editMatchForm.control}
                  name="competitionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Турнир</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите турнир" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Чемпионат">Чемпионат</SelectItem>
                          <SelectItem value="Кубок">Кубок</SelectItem>
                          <SelectItem value="Суперкубок">Суперкубок</SelectItem>
                          <SelectItem value="Товарищеский">Товарищеский</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editMatchForm.control}
                  name="competitionRound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Стадия/тур</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: Тур 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editMatchForm.control}
                name="stadium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стадион</FormLabel>
                    <FormControl>
                      <Input placeholder="Название стадиона" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMatchForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус матча</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Предстоящий</SelectItem>
                        <SelectItem value="finished">Завершенный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editMatchForm.watch('status') === 'finished' && (
                <FormField
                  control={editMatchForm.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Счет</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: 2:0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditMatchOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateMatchMutation.isPending}>
                  {updateMatchMutation.isPending ? (
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
      
      {/* Delete Match Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот матч? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => matchToDelete && deleteMatchMutation.mutate(matchToDelete)}
              disabled={deleteMatchMutation.isPending}
            >
              {deleteMatchMutation.isPending ? (
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
