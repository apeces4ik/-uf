
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import NewsForm from '@/components/admin/news-form';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function NewsAdminPage() {
  const { toast } = useToast();
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: news = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => apiRequest('GET', '/api/news'),
    staleTime: 5000,
    cacheTime: 10000
  });

  const categories = ['Клуб', 'Матч', 'Трансфер', 'Интервью', 'Тренировка', 'Болельщикам'];

  const filteredNews = Array.isArray(news) ? news.filter((item: News) => {
    const titleMatch = item.title ? 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) : 
      true;
    const categoryMatch = activeCategory ? 
      item.category === activeCategory : 
      true;
    return titleMatch && categoryMatch;
  }) : [];

  // Delete news handler
  const handleDeleteNews = (id: number) => {
    setNewsToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Edit news handler
  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    setIsEditNewsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управление новостями</h1>
          <Button onClick={() => setIsAddNewsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить новость
          </Button>
        </div>

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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
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
                      <TableCell>{news.date}</TableCell>
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

        {/* Add News Dialog */}
        <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить новость</DialogTitle>
              <DialogDescription>
                Заполните форму для публикации новой новости
              </DialogDescription>
            </DialogHeader>
            <NewsForm
              onSuccess={() => {
                setIsAddNewsOpen(false);
                refetch();
              }}
            />
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
            <NewsForm
              news={selectedNews}
              onSuccess={() => {
                setIsEditNewsOpen(false);
                refetch();
              }}
            />
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
                onClick={async () => {
                  if (newsToDelete) {
                    try {
                      await apiRequest('DELETE', `/api/news/${newsToDelete}`);
                      toast({
                        title: 'Успешно',
                        description: 'Новость успешно удалена',
                      });
                      refetch();
                    } catch (error) {
                      toast({
                        title: 'Ошибка',
                        description: 'Не удалось удалить новость',
                        variant: 'destructive',
                      });
                    }
                    setIsDeleteDialogOpen(false);
                    setNewsToDelete(null);
                  }
                }}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
