import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Search } from 'lucide-react';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 1000,
    refetchOnWindowFocus: false
  });

  // Get unique categories
  const categories = Array.isArray(news) ? 
    ['all', ...Array.from(new Set(news.map(item => item.category)))] : 
    ['all'];

  // Filter news
  const filteredNews = news?.filter(item => {
    if (!item) return false;

    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Новости</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск новостей..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 rounded-md border"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Все категории' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                  <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {format(new Date(item.date), 'dd MMMM yyyy', { locale: ru })}
                      </div>
                      <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                      <p className="text-gray-600 mb-4">{item.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary-600">{item.category}</span>
                        <Button variant="outline" size="sm">
                          Читать далее
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-2">Новости не найдены</p>
                {(searchQuery || categoryFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}