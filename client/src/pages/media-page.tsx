import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Media } from '@shared/schema';
import { Calendar, Clock, Eye, Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const MediaPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  // Fetch media data
  const { 
    data: mediaItems, 
    isLoading 
  } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Separate photos and videos
  const photos = mediaItems?.filter(item => item.type === 'photo') || [];
  const videos = mediaItems?.filter(item => item.type === 'video') || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Медиагалерея</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Фотографии и видео с матчей, тренировок и мероприятий ФК "Александрия"
            </p>
          </div>
        </section>
        
        {/* Media Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="photos" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="photos" className="text-lg px-6 py-3">Фото</TabsTrigger>
                  <TabsTrigger value="videos" className="text-lg px-6 py-3">Видео</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Photos Tab */}
              <TabsContent value="photos">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                          <Dialog key={photo.id}>
                            <DialogTrigger asChild>
                              <div 
                                className="relative aspect-square overflow-hidden rounded-lg shadow-md group cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                              >
                                <img 
                                  src={photo.url} 
                                  alt={photo.title || "Фото"} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="text-white">
                                    <Search className="h-8 w-8" />
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <div>
                                <img 
                                  src={photo.url} 
                                  alt={photo.title || "Фото"} 
                                  className="w-full max-h-[80vh] object-contain"
                                />
                                {photo.title && (
                                  <div className="mt-2 text-center text-lg font-medium">{photo.title}</div>
                                )}
                                <div className="mt-1 text-sm text-gray-500 text-center">{photo.date}</div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Фотографии не найдены</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              {/* Videos Tab */}
              <TabsContent value="videos">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {videos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                          <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                            <div className="relative aspect-video bg-black">
                              {video.thumbnailUrl ? (
                                <img 
                                  src={video.thumbnailUrl} 
                                  alt={video.title || "Видео"} 
                                  className="w-full h-full object-cover opacity-80"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-800"></div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="bg-primary/80 rounded-full w-16 h-16 flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-roboto-condensed text-lg font-bold mb-2">{video.title}</h3>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  <span className="mr-4">{video.duration}</span>
                                  <Eye className="mr-1 h-4 w-4" />
                                  <span>{video.views}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  <span>{video.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Видео не найдены</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default MediaPage;
