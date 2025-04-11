import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
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
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>

        <div className="bg-white rounded-lg shadow">
          <NewsTable
            news={filteredNews}
            onRefresh={refetch}
          />
        </div>
      </div>
    </AdminLayout>
  );
}