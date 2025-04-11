import React from 'react';
import { News } from '@shared/schema';
import { Calendar, MessageSquare } from 'lucide-react';

interface NewsSectionProps {
  news?: News[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ news = [] }) => {
  // Check if we have news data
  if (!Array.isArray(news) || news.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Новости отсутствуют</p>
      </div>
    );
  }

  // Get the main featured news (most recent)
  const mainNews = news[0];
  
  // Get the two secondary news items
  const secondaryNews = news.slice(1, 3);
  
  // Get the recent news for the grid
  const recentNews = news.slice(3, 6); news.slice(3, 6);

  return (
    <>
      {/* Featured News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main News */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden shadow-md">
          <div className="relative h-80">
            {mainNews.imageUrl && (
              <img 
                src={mainNews.imageUrl} 
                alt={mainNews.title} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="bg-secondary-blue inline-block px-3 py-1 text-sm font-medium rounded-md mb-3">
                {mainNews.category}
              </div>
              <h3 className="font-roboto-condensed text-2xl font-bold mb-2">{mainNews.title}</h3>
              <div className="flex items-center text-sm">
                <span className="mr-4">
                  <Calendar className="inline-block mr-1 h-4 w-4" /> 
                  {mainNews.date}
                </span>
                <span>
                  <MessageSquare className="inline-block mr-1 h-4 w-4" /> 
                  {mainNews.comments} комментария
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary News */}
        <div className="flex flex-col gap-6">
          {secondaryNews.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="relative h-36">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div className="bg-primary inline-block px-3 py-1 text-sm font-medium rounded-md mb-2">
                    {item.category}
                  </div>
                  <h3 className="font-roboto-condensed text-lg font-bold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentNews.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {item.imageUrl && (
              <div className="h-48">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-4">
                  <Calendar className="inline-block mr-1 h-4 w-4" /> 
                  {item.date}
                </span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0z"/>
                    <path d="M12 7v5l3 3"/>
                  </svg>
                  {item.views}
                </span>
              </div>
              <h3 className="font-roboto-condensed text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {item.excerpt || item.content.substring(0, 100) + '...'}
              </p>
              <a href={`/news/${item.id}`} className="text-secondary-blue font-medium hover:underline">
                Читать далее
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewsSection;
