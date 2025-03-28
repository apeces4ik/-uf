import { useQuery } from '@tanstack/react-query';
import { News, Player, Match, ContactMessage } from '@shared/schema';
import AdminLayout from './layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MessageSquare, PenTool, Newspaper, Film, Award, Settings } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminDashboard() {
  const { data: players } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Не удалось загрузить игроков');
      return response.json();
    }
  });

  const { data: matches } = useQuery<Match[]>({
    queryKey: ['/api/matches'],
    queryFn: async () => {
      const response = await fetch('/api/matches');
      if (!response.ok) throw new Error('Не удалось загрузить матчи');
      return response.json();
    }
  });

  const { data: news } = useQuery<News[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Не удалось загрузить новости');
      return response.json();
    }
  });

  const { data: messages } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact'],
    queryFn: async () => {
      const response = await fetch('/api/admin/contact');
      if (!response.ok) throw new Error('Не удалось загрузить сообщения');
      return response.json();
    }
  });

  const newMessages = messages?.filter(msg => msg.status === 'new') || [];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Игроки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{players?.length || 0}</div>
                <Users className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Матчи</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{matches?.length || 0}</div>
                <Calendar className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Новости</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{news?.length || 0}</div>
                <Newspaper className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Новые сообщения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{newMessages.length}</div>
                <MessageSquare className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Управление контентом</CardTitle>
              <CardDescription>Добавляйте и редактируйте различные типы контента</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/players">
                    <Users className="mr-2 h-4 w-4" /> Игроки и тренеры
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/matches">
                    <Calendar className="mr-2 h-4 w-4" /> Календарь матчей
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/news">
                    <Newspaper className="mr-2 h-4 w-4" /> Новости
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Мультимедиа</CardTitle>
              <CardDescription>Управляйте фотографиями, видео и блогом</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/media">
                    <Film className="mr-2 h-4 w-4" /> Медиа галерея
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/blog">
                    <PenTool className="mr-2 h-4 w-4" /> Блог
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/media?type=photo">
                    <Award className="mr-2 h-4 w-4" /> Альбомы
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
              <CardDescription>Конфигурация и дополнительные функции</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" /> Настройки сайта
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <a href="/" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg> Открыть сайт
                  </a>
                </Button>
                {newMessages.length > 0 && (
                  <Button className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" /> 
                    Просмотреть сообщения ({newMessages.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <h2 className="text-xl font-bold mb-4">Последняя активность</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {news?.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="bg-primary-blue/10 p-2 rounded mr-3">
                    <Newspaper className="h-5 w-5 text-primary-blue" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.publishDate).toLocaleDateString('ru-RU', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {(!news || news.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  Нет недавней активности
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
