import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import AdminLayout from '@/components/admin/admin-layout';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import PlayerForm from '@/components/admin/player-form';
import MatchForm from '@/components/admin/match-form';
import NewsForm from '@/components/admin/news-form';
import BlogForm from '@/components/admin/blog-form';
import CoachForm from '@/components/admin/coach-form';
import HistoryAdmin from '@/pages/admin/history-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Pencil, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';

const AdminPage = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const params = useParams();
  const section = params.section || 'dashboard';

  // Check admin permissions
  const { isLoading: isCheckingAdmin, error: adminError } = useQuery({
    queryKey: ['/api/admin/check'],
    queryFn: async () => {
      const res = await fetch('/api/admin/check', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Недостаточно прав для доступа к панели администратора');
      }
      return true;
    },
  });

  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (adminError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
        <p className="mb-6">У вас нет прав администратора для доступа к этой странице.</p>
        <a href="/" className="bg-primary text-white px-4 py-2 rounded-md">Вернуться на главную</a>
      </div>
    );
  }

  // Load data for the selected section
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <DashboardContent />;
      case 'players':
        return <PlayersContent />;
      case 'coaches':
        return <CoachesContent />;
      case 'matches':
        return <MatchesContent />;
      case 'news':
        return <NewsContent />;
      case 'blog':
        return <BlogContent />;
      case 'history':
        return <HistoryAdmin />;
      case 'media':
        return <MediaContent />;
      case 'standings':
        return <StandingsContent />;
      case 'messages':
        return <MessagesContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

// Dashboard Content
const DashboardContent = () => {
  const { data: players } = useQuery({
    queryKey: ['/api/players'],
  });

  const { data: matches } = useQuery({
    queryKey: ['/api/matches'],
  });

  const { data: news } = useQuery({
    queryKey: ['/api/news'],
  });

  const { data: messages } = useQuery({
    queryKey: ['/api/contact'],
  });

  const unreadMessages = messages?.filter(msg => !msg.read).length || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Игроки</CardTitle>
            <CardDescription>Всего игроков в команде</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{players?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Матчи</CardTitle>
            <CardDescription>Всего матчей</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{matches?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Новости</CardTitle>
            <CardDescription>Всего новостей</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{news?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Сообщения</CardTitle>
            <CardDescription>Непрочитанные сообщения</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{unreadMessages}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние сообщения</CardTitle>
          </CardHeader>
          <CardContent>
            {messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className={`p-4 border rounded-md ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{message.name}</span>
                      <span className="text-sm text-gray-500">{message.date}</span>
                    </div>
                    <div className="text-sm mb-1">{message.email}</div>
                    <div className="font-medium">{message.subject}</div>
                    <p className="text-sm mt-2 text-gray-700 line-clamp-2">{message.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет сообщений</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Предстоящие матчи</CardTitle>
          </CardHeader>
          <CardContent>
            {matches && matches.filter(m => m.status === 'upcoming').length > 0 ? (
              <div className="space-y-4">
                {matches
                  .filter(m => m.status === 'upcoming')
                  .slice(0, 5)
                  .map((match) => (
                    <div key={match.id} className="p-4 border rounded-md bg-white">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{match.competition}</span>
                        <span className="text-sm text-gray-500">{match.date} • {match.time}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{match.homeTeam}</span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded mx-2">{match.round || 'Матч'}</span>
                        <span>{match.awayTeam}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет предстоящих матчей</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Players Content
const PlayersContent = () => {
  const { data: players, isLoading, refetch } = useQuery({
    queryKey: ['/api/players'],
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/players/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete player');
    },
    onSuccess: () => {
      refetch();
      setIsDeleteOpen(false);
      toast({
        title: "Успешно",
        description: "Игрок был удален",
      });
    },
  });

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditOpen(true);
  };

  const handleDelete = (player: Player) => {
    setSelectedPlayer(player);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление игроками</h1>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Список игроков</TabsTrigger>
          <TabsTrigger value="add">Добавить игрока</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players && players.map((player) => (
                <Card key={player.id}>
                  <div className="relative h-64 bg-primary">
                    {player.imageUrl && (
                      <img 
                        src={player.imageUrl} 
                        alt={player.name} 
                        className="w-full h-full object-cover object-top"
                      />
                    )}
                    <div className="absolute top-0 left-0 bg-primary text-white font-oswald text-2xl font-bold w-10 h-10 flex items-center justify-center">
                      {player.number}
                    </div>
                    <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-white font-medium">{player.position}</div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-roboto-condensed font-bold text-lg text-center mb-2">{player.name}</h3>
                    <div className="flex justify-center items-center mt-2 space-x-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Возраст</div>
                        <div className="font-medium">{player.age}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Матчи</div>
                        <div className="font-medium">{player.matches}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">
                          {player.position === 'Вратарь' ? 'Сухие матчи' : 'Голы / Пас'}
                        </div>
                        <div className="font-medium">
                          {player.position === 'Вратарь' ? 
                            player.cleanSheets : 
                            `${player.goals} / ${player.assists}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(player)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Изменить
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(player)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <PlayerForm onSuccess={() => refetch()} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать игрока</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <PlayerForm 
              player={selectedPlayer} 
              onSuccess={() => {
                refetch();
                setIsEditOpen(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить игрока</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этого игрока? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedPlayer && deletePlayerMutation.mutate(selectedPlayer.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlayerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Coaches Content
const CoachesContent = () => {
  const { data: coaches, isLoading, refetch } = useQuery({
    queryKey: ['/api/coaches'],
  });

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  const deleteCoachMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/coaches/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete coach');
    },
    onSuccess: () => {
      refetch();
      setIsDeleteOpen(false);
      toast({
        title: "Успешно",
        description: "Тренер был удален",
      });
    },
  });

  const handleEdit = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsEditOpen(true);
  };

  const handleDelete = (coach: Coach) => {
    setSelectedCoach(coach);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление тренерским штабом</h1>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Список тренеров</TabsTrigger>
          <TabsTrigger value="add">Добавить тренера</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches && coaches.map((coach) => (
                <Card key={coach.id} className="flex flex-col h-full">
                  <div className="h-48 bg-gray-200">
                    {coach.imageUrl && (
                      <img 
                        src={coach.imageUrl} 
                        alt={coach.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="text-xs text-secondary-blue font-bold mb-1">{coach.position}</div>
                    <h4 className="font-roboto-condensed font-bold text-lg mb-2">{coach.name}</h4>
                    <div className="text-sm mt-auto">
                      <div className="mb-1"><span className="text-gray-500">В клубе с:</span> {coach.joinYear}</div>
                      {coach.achievements && (
                        <div><span className="text-gray-500">Достижения:</span> {coach.achievements}</div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coach)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Изменить
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coach)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <CoachForm onSuccess={() => refetch()} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать тренера</DialogTitle>
          </DialogHeader>
          {selectedCoach && (
            <CoachForm 
              coach={selectedCoach} 
              onSuccess={() => {
                refetch();
                setIsEditOpen(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить тренера</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этого тренера? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCoach && deleteCoachMutation.mutate(selectedCoach.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCoachMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Matches Content
const MatchesContent = () => {
  const { data: matches, isLoading, refetch } = useQuery({
    queryKey: ['/api/matches'],
  });

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  const deleteMatchMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete match');
    },
    onSuccess: () => {
      refetch();
      setIsDeleteOpen(false);
      toast({
        title: "Успешно",
        description: "Матч был удален",
      });
    },
  });

  const handleEdit = (match: Match) => {
    setSelectedMatch(match);
    setIsEditOpen(true);
  };

  const handleDelete = (match: Match) => {
    setSelectedMatch(match);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление матчами</h1>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Список матчей</TabsTrigger>
          <TabsTrigger value="add">Добавить матч</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {matches && matches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">
                        {match.date} • {match.time} • {match.competition}
                      </div>
                      <div className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100">
                        {match.status === 'upcoming' ? 'Предстоящий' : 
                         match.status === 'completed' ? 'Завершен' : 'Отменен'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-center w-5/12">
                        <div className="font-bold text-lg">{match.homeTeam}</div>
                      </div>
                      
                      <div className="text-center w-2/12">
                        {match.status === 'completed' ? (
                          <div className="text-2xl font-bold">
                            {match.homeScore} : {match.awayScore}
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-gray-400">VS</div>
                        )}
                        <div className="text-xs bg-secondary-blue text-white rounded-full px-2 py-1 mt-1">
                          {match.round || 'Матч'}
                        </div>
                      </div>
                      
                      <div className="text-center w-5/12">
                        <div className="font-bold text-lg">{match.awayTeam}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Стадион:</span> {match.stadium}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(match)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Изменить
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(match)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <MatchForm onSuccess={() => refetch()} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать матч</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <MatchForm 
              match={selectedMatch} 
              onSuccess={() => {
                refetch();
                setIsEditOpen(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить матч</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот матч? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMatch && deleteMatchMutation.mutate(selectedMatch.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMatchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// News Content
const NewsContent = () => {
  const { data: news, isLoading, refetch } = useQuery({
    queryKey: ['/api/news'],
  });

  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { toast } = useToast();

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete news');
    },
    onSuccess: () => {
      refetch();
      setIsDeleteOpen(false);
      toast({
        title: "Успешно",
        description: "Новость была удалена",
      });
    },
  });

  const handleEdit = (item: News) => {
    setSelectedNews(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item: News) => {
    setSelectedNews(item);
    setIsDeleteOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление новостями</h1>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Список новостей</TabsTrigger>
          <TabsTrigger value="add">Добавить новость</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {news && news.map((item) => (
                <Card key={item.id}>
                  <div className="flex flex-col md:flex-row">
                    {item.imageUrl && (
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className={`p-4 ${item.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                      <div className="flex justify-between mb-2">
                        <span className="inline-block bg-secondary-blue text-white px-2 py-1 text-xs rounded">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="font-roboto-condensed text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.excerpt || item.content}</p>
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4"><i className="far fa-eye mr-1"></i> {item.views}</span>
                          <span><i className="far fa-comment mr-1"></i> {item.comments}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Изменить
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <NewsForm onSuccess={() => refetch()} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <NewsForm 
              news={selectedNews} 
              onSuccess={() => {
                refetch();
                setIsEditOpen(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedNews && deleteNewsMutation.mutate(selectedNews.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteNewsMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Blog Content
const BlogContent = () => {
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление блогом</h1>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Список статей</TabsTrigger>
          <TabsTrigger value="add">Добавить статью</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {posts && posts.map((post) => (
                <Card key={post.id}>
                  <div className="flex flex-col md:flex-row">
                    {post.imageUrl && (
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className={`p-4 ${post.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                      <div className="flex items-center mb-3">
                        {post.authorAvatar && (
                          <img 
                            src={post.authorAvatar} 
                            alt={post.authorName} 
                            className="w-8 h-8 rounded-full object-cover mr-2"
                          />
                        )}
                        <span className="text-sm font-medium">{post.authorName}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      <h3 className="font-roboto-condensed text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt || post.content}</p>
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3"><i className="far fa-eye mr-1"></i> {post.views}</span>
                          <span><i className="far fa-comment mr-1"></i> {post.comments}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <BlogForm onSuccess={() => refetch()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Media Content
const MediaContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление медиа</h1>
      {/* Media management content */}
    </div>
  );
};

// Standings Content
const StandingsContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление турнирной таблицей</h1>
      {/* Standings management content */}
    </div>
  );
};

// Messages Content
const MessagesContent = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Сообщения от пользователей</h1>
      {/* Messages management content */}
    </div>
  );
};

export default AdminPage;
