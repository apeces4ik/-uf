
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { News, InsertNews, insertNewsSchema } from '@shared/schema';
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
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function NewsAdminPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch news
  const { data: news, isLoading: isLoadingNews } = useQuery<News[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Не удалось загрузить новости');
      return response.json();
    }
  });

  // Create news mutation
  const addNewsMutation = useMutation({
    mutationFn: async (news: InsertNews) => {
      const res = await apiRequest('POST', '/api/news', news);
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
      const res = await apiRequest('PUT', `/api/news/${id}`, data);
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
      await apiRequest('DELETE', `/api/news/${id}`);
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
      excerpt: '',
      imageUrl: '',
      category: 'Клуб',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const editNewsForm = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: 'Клуб',
      date: format(new Date(), 'yyyy-MM-dd'),
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

  // Filter news
  const filteredNews = news?.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Edit news handler
  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    editNewsForm.reset({
      title: news.title,
      content: news.content,
      excerpt: news.excerpt,
      imageUrl: news.imageUrl,
      category: news.category,
      date: news.date
    });
    setIsEditNewsOpen(true);
  };

  // Delete news handler
  const handleDeleteNews = (id: number) => {
    setNewsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление новостями</h1>
        
        <div className="flex justify-between items-center mb-6">
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
        
        <div className="bg-white rounded-md border shadow-sm">
          {isLoadingNews ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead className="w-[120px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews && filteredNews.length > 0 ? (
                  filteredNews.map((news) => (
                    <TableRow key={news.id}>
                      <TableCell>{format(new Date(news.date), 'dd.MM.yyyy')}</TableCell>
                      <TableCell>{news.title}</TableCell>
                      <TableCell>{news.category}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditNews(news)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNews(news.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      {searchQuery ? 'Нет новостей, соответствующих поиску' : 'Нет новостей'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add News Dialog */}
      <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить новость</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления новой новости
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
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newsForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Краткое описание</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата публикации</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    'Добавить новость'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditNewsOpen} onOpenChange={setIsEditNewsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
            <DialogDescription>
              Измените данные новости
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
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editNewsForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Краткое описание</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата публикации</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
