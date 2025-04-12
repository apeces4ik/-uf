
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { News } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar, Eye, MessageSquare } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  
  const { data: news, isLoading } = useQuery<News>({
    queryKey: [`/api/news/${id}`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!news) {
    return <div>Новость не найдена</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-grow py-8">
        <article className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-secondary-blue text-white px-3 py-1 text-sm rounded-md">
                {news.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">
              {news.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {news.publishDate ? format(new Date(news.publishDate), 'd MMMM yyyy', { locale: ru }) : ''}
              </span>
              <span className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {news.views}
              </span>
              <span className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                {news.comments} комментариев
              </span>
            </div>
            
            {news.imageUrl && (
              <div className="mb-8">
                <img 
                  src={news.imageUrl} 
                  alt={news.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-4">{news.excerpt}</p>
              <div className="text-gray-800">{news.content}</div>
            </div>
          </div>
        </article>
      </main>
      
      <SiteFooter />
    </div>
  );
}
