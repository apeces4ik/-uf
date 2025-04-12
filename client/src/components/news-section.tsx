
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function NewsSection() {
  const { data: news, isLoading } = useQuery<News[]>({
    queryKey: ['/api/news', 6],
    queryFn: async () => {
      const response = await fetch('/api/news?limit=6');
      if (!response.ok) throw new Error('Не удалось загрузить новости');
      return response.json();
    }
  });

  const featuredNews = news && news.length > 0 ? news[0] : null;
  const secondaryNews = news && news.length > 1 ? news.slice(1, 3) : [];
  const regularNews = news && news.length > 3 ? news.slice(3, 6) : [];

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    return format(parsedDate, 'd MMM yyyy', { locale: ru });
  };

  return (
    <section id="news" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-roboto-condensed text-3xl font-bold text-primary-blue">Новости</h2>
          <Button variant="link" className="text-secondary-blue">
            Все новости <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {featuredNews && (
                <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-80">
                    <img 
                      src={featuredNews.imageUrl || "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80"} 
                      alt={featuredNews.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <div className="bg-secondary-blue inline-block px-3 py-1 text-sm font-medium rounded-md mb-3">
                        {featuredNews.category}
                      </div>
                      <h3 className="font-roboto-condensed text-2xl font-bold mb-2">{featuredNews.title}</h3>
                      <div className="flex items-center text-sm">
                        <Calendar className="inline-block mr-1 h-4 w-4" /> {formatDate(featuredNews.publishDate)}
                      </div>
                      <Link to={`/news/${featuredNews.id}`} className="mt-4 inline-block text-white hover:underline">
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {secondaryNews.map(newsItem => (
                  <div key={newsItem.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                    <div className="relative h-36">
                      <img 
                        src={newsItem.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80`} 
                        alt={newsItem.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <div className="bg-primary-blue inline-block px-3 py-1 text-sm font-medium rounded-md mb-2">
                          {newsItem.category}
                        </div>
                        <h3 className="font-roboto-condensed text-lg font-bold">{newsItem.title}</h3>
                        <Link to={`/news/${newsItem.id}`} className="mt-2 inline-block text-white hover:underline">
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map(newsItem => (
                <Card key={newsItem.id} className="bg-gray-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48">
                    <img 
                      src={newsItem.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80`} 
                      alt={newsItem.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="inline-block mr-1 h-4 w-4" /> {formatDate(newsItem.publishDate)}
                    </div>
                    <h3 className="font-roboto-condensed text-lg font-bold mb-2">{newsItem.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {newsItem.content.length > 100 
                        ? `${newsItem.content.substring(0, 100)}...` 
                        : newsItem.content
                      }
                    </p>
                    <Link to={`/news/${newsItem.id}`} className="text-secondary-blue font-medium hover:underline">
                      Подробнее
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
