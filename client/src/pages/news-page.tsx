import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { News } from '@shared/schema';
import { Calendar, Eye, MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch news data
  const { 
    data: news, 
    isLoading 
  } = useQuery<News[]>({
    queryKey: ['/api/news'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Get all unique categories
  const categories = Array.isArray(news) ? 
    ['all', ...new Set(news.map(item => item.category))] : 
    ['all'];

  // Filter news by search query and category
  const filteredNews = (Array.isArray(news) ? news : []).filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Новости клуба</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Следите за последними новостями и событиями ФК "Александрия"
            </p>
          </div>
        </section>
        
        {/* News Search and Filters */}
        <section className="py-8 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <Input
                  type="text"
                  placeholder="Поиск новостей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    onClick={() => setCategoryFilter(category)}
                    className="text-sm"
                  >
                    {category === 'all' ? 'Все категории' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* News Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {filteredNews && filteredNews.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    {filteredNews.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {item.imageUrl && (
                            <div className="md:w-1/3 h-64 md:h-auto">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`p-6 ${item.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="bg-secondary-blue text-white text-sm font-medium rounded-md px-3 py-1">
                                {item.category}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="inline-block mr-1 h-4 w-4" />
                                {item.date}
                              </span>
                            </div>
                            
                            <h2 className="font-roboto-condensed text-2xl font-bold mb-3">{item.title}</h2>
                            
                            <p className="text-gray-600 mb-4">
                              {item.excerpt || item.content.substring(0, 200) + '...'}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <a href="#" className="text-secondary-blue font-medium hover:underline">
                                Читать полностью
                              </a>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Eye className="mr-1 h-4 w-4" />
                                  {item.views}
                                </span>
                                <span className="flex items-center">
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  {item.comments}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-500 mb-2">Новости не найдены</p>
                    {searchQuery || categoryFilter !== 'all' ? (
                      <Button 
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('all');
                        }}
                      >
                        Сбросить фильтры
                      </Button>
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default NewsPage;
