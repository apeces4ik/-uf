import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Media } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, Clock, Eye, Play } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function MediaSection() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  
  const { data: mediaItems, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media', activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/media?type=${activeTab}`);
      if (!response.ok) throw new Error(`Не удалось загрузить ${activeTab === 'photos' ? 'фото' : 'видео'}`);
      return response.json();
    }
  });

  const formatDate = (date: string) => {
    return format(new Date(date), 'd MMMM yyyy', { locale: ru });
  };

  return (
    <section id="media" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-roboto-condensed text-3xl font-bold text-primary-blue">Медиа</h2>
          <div className="flex space-x-4">
            <Button 
              variant="link" 
              className={`font-medium ${activeTab === 'photos' ? 'text-primary-blue' : 'text-gray-500'}`}
              onClick={() => setActiveTab('photos')}
            >
              Фото
            </Button>
            <Button 
              variant="link" 
              className={`font-medium ${activeTab === 'videos' ? 'text-primary-blue' : 'text-gray-500'}`}
              onClick={() => setActiveTab('videos')}
            >
              Видео
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <>
            {/* Photos Grid */}
            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaItems?.filter(item => item.type === 'photo').slice(0, 8).map(photo => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md group cursor-pointer">
                    <img 
                      src={photo.url || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80`} 
                      alt={photo.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white">
                        <Search className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Videos Grid */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems?.filter(item => item.type === 'video').slice(0, 3).map(video => (
                  <Card key={video.id} className="bg-white overflow-hidden shadow-md">
                    <div className="relative aspect-video bg-black">
                      <img 
                        src={`https://img.youtube.com/vi/${video.url.split('v=')[1]}/maxresdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary-blue/80 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-roboto-condensed text-lg font-bold mb-2">{video.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">
                          <Clock className="inline-block mr-1 h-4 w-4" /> 
                          {formatDate(video.uploadDate)}
                        </span>
                        <span>
                          <Eye className="inline-block mr-1 h-4 w-4" /> {video.views}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Button>Смотреть больше</Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
