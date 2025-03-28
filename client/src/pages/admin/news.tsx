import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { News, InsertNews, insertNewsSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Edit, Trash2, Search, Eye, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AdminNews() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Fetch news
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Не удалось загрузить новости');
      return response.json();
    }
  });

  // Create news mutation
  const addNewsMutation = useMutation({
    mutationFn: async (newsItem: InsertNews) => {
      const res = await apiRequest('POST', '/api/admin/news', newsItem);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Успешно',
        description: 'Новость успешно добавлена',
      });
      setIsAddNewsOpen(false);
      newsForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertNews> }) => {
      const res = await apiRequest('PUT', `/api/admin/news/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Успешно',
        description: 'Новость успешно обновлена',
      });
      setIsEditNewsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Успешно',
        description: 'Новость успешно удалена',
      });
      setIsDeleteDialogOpen(false);
      setNewsToDelete(null);
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
  const newsForm = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Клуб',
      imageUrl: '',
    }
  });

  const editNewsForm = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Клуб',
      imageUrl: '',
    }
  });

  // Form submission handlers
  const onAddNewsSubmit = (data: InsertNews) => {
    addNewsMutation.mutate(data);
  };

  const onEditNewsSubmit = (data: InsertNews) => {
    if (selectedNews) {
      updateNewsMutation.mutate({ id: selectedNews.id, data });
    }
  };

  // Edit news handler
  const handleEditNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    editNewsForm.reset({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      imageUrl: newsItem.imageUrl || '',
    });
    setIsEditNewsOpen(true);
  };

  // Delete news handler
  const handleDeleteNews = (id: number) => {
    setNewsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Format date nicely
  const formatNewsDate = (dateString: string) => {
    try {
      if (!dateString) return 'Дата не указана';
      // Форматирование только даты, без времени, т.к. в данных только date без time
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Некорректная дата';
    }
  };

  // Get available categories from news items
  const categories = news 
    ? Array.from(new Set(news.map(item => item.category)))
    : [];

  // Filter news based on search query and active category
  const filteredNews = news
    ?.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item => !activeCategory || item.category === activeCategory)
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление новостями</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => setActiveCategory(null)}
            >
              Все новости
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
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
            
            <Button onClick={() => {
              newsForm.reset();
              setIsAddNewsOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Добавить новость
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews && filteredNews.length > 0 ? (
              filteredNews.map((newsItem) => (
                <Card key={newsItem.id} className="overflow-hidden">
                  {newsItem.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={newsItem.imageUrl} 
                        alt={newsItem.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-secondary-blue text-white text-xs rounded-md px-2 py-1">
                        {newsItem.category}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditNews(newsItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNews(newsItem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{newsItem.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {newsItem.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatNewsDate(newsItem.date)}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> {newsItem.views}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" /> {newsItem.comments}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery ? 'Нет новостей, соответствующих поиску' : 'Нет новостей в базе данных'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add News Dialog */}
      <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить новость</DialogTitle>
            <DialogDescription>
              Заполните форму для создания новой новости
            </DialogDescription>
          </DialogHeader>
          <Form {...newsForm}>
            <form onSubmit={newsForm.handleSubmit(onAddNewsSubmit)} className="space-y-4">
              <FormField
                control={newsForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите заголовок новости" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newsForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Клуб">Клуб</SelectItem>
                        <SelectItem value="Матч">Матч</SelectItem>
                        <SelectItem value="Трансфер">Трансфер</SelectItem>
                        <SelectItem value="Интервью">Интервью</SelectItem>
                        <SelectItem value="Тренировка">Тренировка</SelectItem>
                        <SelectItem value="Болельщикам">Болельщикам</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newsForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Содержание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите текст новости" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={newsForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        value={field.value || ''} 
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddNewsOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addNewsMutation.isPending}>
                  {addNewsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Опубликовать новость'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit News Dialog */}
      <Dialog open={isEditNewsOpen} onOpenChange={setIsEditNewsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
            <DialogDescription>
              Внесите изменения в новость
            </DialogDescription>
          </DialogHeader>
          <Form {...editNewsForm}>
            <form onSubmit={editNewsForm.handleSubmit(onEditNewsSubmit)} className="space-y-4">
              <FormField
                control={editNewsForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите заголовок новости" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editNewsForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Клуб">Клуб</SelectItem>
                        <SelectItem value="Матч">Матч</SelectItem>
                        <SelectItem value="Трансфер">Трансфер</SelectItem>
                        <SelectItem value="Интервью">Интервью</SelectItem>
                        <SelectItem value="Тренировка">Тренировка</SelectItem>
                        <SelectItem value="Болельщикам">Болельщикам</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editNewsForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Содержание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите текст новости" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editNewsForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        value={field.value || ''} 
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditNewsOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateNewsMutation.isPending}>
                  {updateNewsMutation.isPending ? (
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
      
      {/* Delete News Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => newsToDelete && deleteNewsMutation.mutate(newsToDelete)}
              disabled={deleteNewsMutation.isPending}
            >
              {deleteNewsMutation.isPending ? (
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
