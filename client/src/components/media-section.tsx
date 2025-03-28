import React, { useState } from 'react';
import { Media } from '@shared/schema';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaSectionProps {
  mediaItems?: Media[];
  limit?: number;
}

const MediaSection: React.FC<MediaSectionProps> = ({ mediaItems, limit = 8 }) => {
  const [activeTab, setActiveTab] = useState<string>('photos');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  // Filter media by type and limit the results
  const photos = mediaItems 
    ? mediaItems.filter(item => item.type === 'photo').slice(0, limit)
    : [];

  const videos = mediaItems 
    ? mediaItems.filter(item => item.type === 'video').slice(0, Math.floor(limit / 2))
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <button 
            className={`${activeTab === 'photos' ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors font-medium`}
            onClick={() => setActiveTab('photos')}
          >
            Фото
          </button>
          <button 
            className={`${activeTab === 'videos' ? 'text-primary' : 'text-gray-500 hover:text-primary'} transition-colors font-medium`}
            onClick={() => setActiveTab('videos')}
          >
            Видео
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      <div id="photos-content" className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${activeTab !== 'photos' ? 'hidden' : ''}`}>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg shadow-md group">
              <img 
                src={photo.url} 
                alt={photo.title || "Фото"} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setSelectedMedia(photo)}
                  className="p-2 bg-white rounded-full"
                >
                  <Search className="h-5 w-5 text-gray-800" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Фотографии не найдены</p>
          </div>
        )}
      </div>

      <Dialog open={selectedMedia !== null} onOpenChange={setSelectedMedia}>
        <DialogContent className="max-w-3xl">
          <div className="flex flex-col items-center gap-4">
            <img
              src={selectedMedia?.url}
              alt={selectedMedia?.title}
              className="w-full max-h-[60vh] object-contain rounded-lg"
            />
            <h3 className="text-xl font-bold">{selectedMedia?.title}</h3>
            <p className="text-gray-600 text-center whitespace-pre-wrap">{selectedMedia?.description}</p>
            <div className="text-sm text-gray-500">
              {selectedMedia?.date ? new Date(selectedMedia.date).toLocaleDateString('ru-RU') : ''}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Videos Grid */}
      <div id="videos-content" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${activeTab !== 'videos' ? 'hidden' : ''}`}>
        {videos.length > 0 ? (
          videos.map((video) => (
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
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {video.duration}
                  </span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {video.views}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Видео не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSection;