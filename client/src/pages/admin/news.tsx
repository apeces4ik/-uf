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
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import NewsForm from '@/components/admin/news-form';

export default function AdminNews() {
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
      const response = await apiRequest('GET', '/api/news');
      if (!response.ok) throw new Error('Не удалось загрузить новости');
      return response.json();
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

  // Edit news handler
  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    setIsEditNewsOpen(true);
  };

  // Delete news handler
  const handleDeleteNews = (id: number) => {
    setNewsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter news based on search query
  const filteredNews = news?.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление новостями</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Поиск по заголовку..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddNewsOpen(true)}>
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
                  <TableHead>Дата публикации</TableHead>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead className="w-[120px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews && filteredNews.length > 0 ? (
                  filteredNews.map((newsItem) => (
                    <TableRow key={newsItem.id}>
                      <TableCell>
                        {newsItem.publishDate ? format(new Date(newsItem.publishDate), 'dd.MM.yyyy HH:mm', { locale: ru }) : '-'}
                      </TableCell>
                      <TableCell>{newsItem.title}</TableCell>
                      <TableCell>{newsItem.category}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить новость</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления новой новости
            </DialogDescription>
          </DialogHeader>
          <NewsForm onSuccess={() => setIsAddNewsOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog open={isEditNewsOpen} onOpenChange={setIsEditNewsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
            <DialogDescription>
              Измените данные новости
            </DialogDescription>
          </DialogHeader>
          <NewsForm news={selectedNews} onSuccess={() => setIsEditNewsOpen(false)} />
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