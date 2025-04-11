import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { News, InsertNews } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import NewsForm from '@/components/admin/news-form';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import NewsTable from '@/components/admin/news-table';

export default function NewsAdminPage() {
  const { toast } = useToast();
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => apiRequest('GET', '/api/news'),
  });

  const addNewsMutation = useMutation({
    mutationFn: async (data: InsertNews) => {
      return await apiRequest('POST', '/api/news', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Успешно',
        description: 'Новость успешно опубликована',
      });
      setIsAddNewsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const categories = ['Клуб', 'Матч', 'Трансфер', 'Интервью', 'Тренировка', 'Болельщикам'];

  const filteredNews = news
    .filter((item: News) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item: News) => !activeCategory || item.category === activeCategory);

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
                queryClient.invalidateQueries({ queryKey: ['/api/news'] });
              }}
              addNewsMutation={addNewsMutation} // Pass the mutation
            />
          </DialogContent>
        </Dialog>

        <div className="bg-white rounded-lg shadow">
          <NewsTable
            news={filteredNews}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ['/api/news'] })}
          />
        </div>
      </div>
    </AdminLayout>
  );
}