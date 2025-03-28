import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Media, Album, InsertMedia, InsertAlbum, insertMediaSchema, insertAlbumSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Edit, Trash2, Search, Image, Film, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AdminMedia() {
  const [activeTab, setActiveTab] = useState<string>('photos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [isEditMediaOpen, setIsEditMediaOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch media
  const { data: mediaItems, isLoading: isLoadingMedia } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    queryFn: async () => {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Не удалось загрузить медиа');
      return response.json();
    }
  });

  // Fetch albums
  const { data: albums, isLoading: isLoadingAlbums } = useQuery<Album[]>({
    queryKey: ['/api/albums'],
    queryFn: async () => {
      const response = await fetch('/api/albums');
      if (!response.ok) throw new Error('Не удалось загрузить альбомы');
      return response.json();
    }
  });

  // Create media mutation
  const addMediaMutation = useMutation({
    mutationFn: async (media: InsertMedia) => {
      const res = await apiRequest('POST', '/api/admin/media', media);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно добавлено',
      });
      setIsAddMediaOpen(false);
      mediaForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Create album mutation
  const addAlbumMutation = useMutation({
    mutationFn: async (album: InsertAlbum) => {
      const res = await apiRequest('POST', '/api/admin/albums', album);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/albums'] });
      toast({
        title: 'Успешно',
        description: 'Альбом успешно создан',
      });
      setIsAddAlbumOpen(false);
      albumForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update media mutation
  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertMedia> }) => {
      const res = await apiRequest('PUT', `/api/admin/media/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно обновлено',
      });
      setIsEditMediaOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete media mutation
  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно удалено',
      });
      setIsDeleteDialogOpen(false);
      setMediaToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Forms
  const mediaForm = useForm<InsertMedia>({
    resolver: zodResolver(insertMediaSchema),
    defaultValues: {
      title: '',
      type: 'photo',
      url: '',
      albumId: undefined,
    }
  });

  const albumForm = useForm<InsertAlbum>({
    resolver: zodResolver(insertAlbumSchema),
    defaultValues: {
      title: '',
      description: '',
      coverUrl: '',
    }
  });

  const editMediaForm = useForm<InsertMedia>({
    resolver: zodResolver(insertMediaSchema),
    defaultValues: {
      title: '',
      type: 'photo',
      url: '',
      albumId: undefined,
    }
  });

  // Form submission handlers
  const onAddMediaSubmit = (data: InsertMedia) => {
    addMediaMutation.mutate({
      ...data,
      albumId: data.albumId ? parseInt(data.albumId.toString()) : undefined
    });
  };

  const onAddAlbumSubmit = (data: InsertAlbum) => {
    addAlbumMutation.mutate(data);
  };

  const onEditMediaSubmit = (data: InsertMedia) => {
    if (selectedMedia) {
      updateMediaMutation.mutate({ 
        id: selectedMedia.id, 
        data: {
          ...data,
          albumId: data.albumId ? parseInt(data.albumId.toString()) : undefined
        }
      });
    }
  };

  // Edit media handler
  const handleEditMedia = (media: Media) => {
    setSelectedMedia(media);
    editMediaForm.reset({
      title: media.title,
      type: media.type,
      url: media.url,
      albumId: media.albumId,
    });
    setIsEditMediaOpen(true);
  };

  // Delete media handler
  const handleDeleteMedia = (id: number) => {
    setMediaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Format date nicely
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Неизвестно';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch (error) {
      console.error('Invalid date format:', dateString, error);
      return 'Неизвестно';
    }
  };

  // Filter media based on type, search query and album
  const filteredMedia = mediaItems
    ?.filter(item => 
      item.type === activeTab && 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Безопасная сортировка с проверкой на null/undefined
      const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
      const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
      return dateB - dateA;
    });

  // YouTube embed code helper
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Get album title by ID
  const getAlbumTitle = (albumId?: number) => {
    if (!albumId) return 'Без альбома';
    const album = albums?.find(a => a.id === albumId);
    return album ? album.title : 'Неизвестный альбом';
  };

  const isLoading = isLoadingMedia || isLoadingAlbums;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление медиа</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="photo">
                <Image className="h-4 w-4 mr-2" />
                Фотографии
              </TabsTrigger>
              <TabsTrigger value="video">
                <Film className="h-4 w-4 mr-2" />
                Видео
              </TabsTrigger>
            </TabsList>
            
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
              
              <Button variant="outline" onClick={() => setIsAddAlbumOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Создать альбом
              </Button>
              
              <Button onClick={() => {
                mediaForm.reset({
                  title: '',
                  type: activeTab,
                  url: '',
                  albumId: undefined,
                });
                setIsAddMediaOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Добавить {activeTab === 'photo' ? 'фото' : 'видео'}
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <>
              <TabsContent value="photo">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia && filteredMedia.length > 0 ? (
                    filteredMedia.map((media) => (
                      <Card key={media.id} className="overflow-hidden">
                        <div className="relative aspect-square group overflow-hidden">
                          <img 
                            src={media.url} 
                            alt={media.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white"
                              onClick={() => handleEditMedia(media)}
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white"
                              onClick={() => handleDeleteMedia(media.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <p className="text-sm font-medium line-clamp-1">{media.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{getAlbumTitle(media.albumId)}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {searchQuery ? 'Нет фотографий, соответствующих поиску' : 'Нет фотографий в базе данных'}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="video">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedia && filteredMedia.length > 0 ? (
                    filteredMedia.map((media) => (
                      <Card key={media.id} className="overflow-hidden">
                        <div className="relative aspect-video bg-black">
                          <iframe
                            src={getYouTubeEmbedUrl(media.url)}
                            title={media.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <CardContent className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-base">{media.title}</h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Загружено: {formatDate(media.uploadDate)} • Просмотры: {media.views}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditMedia(media)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMedia(media.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      {searchQuery ? 'Нет видео, соответствующих поиску' : 'Нет видео в базе данных'}
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      
      {/* Add Media Dialog */}
      <Dialog open={isAddMediaOpen} onOpenChange={setIsAddMediaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить {activeTab === 'photo' ? 'фото' : 'видео'}</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового медиа-контента
            </DialogDescription>
          </DialogHeader>
          <Form {...mediaForm}>
            <form onSubmit={mediaForm.handleSubmit(onAddMediaSubmit)} className="space-y-4">
              <FormField
                control={mediaForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={mediaForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={activeTab}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип медиа" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="photo">Фото</SelectItem>
                        <SelectItem value="video">Видео</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={mediaForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL {mediaForm.watch('type') === 'photo' ? 'изображения' : 'видео'}</FormLabel>
                    <FormControl>
                      <Input placeholder={mediaForm.watch('type') === 'photo' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'} {...field} />
                    </FormControl>
                    {mediaForm.watch('type') === 'video' && (
                      <p className="text-xs text-gray-500">Поддерживаются ссылки YouTube</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={mediaForm.control}
                name="albumId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Альбом</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? undefined : parseInt(value))} 
                      defaultValue={field.value?.toString() || 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите альбом" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Без альбома</SelectItem>
                        {albums?.map((album) => (
                          <SelectItem key={album.id} value={album.id.toString()}>
                            {album.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddMediaOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addMediaMutation.isPending}>
                  {addMediaMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка...
                    </>
                  ) : (
                    'Добавить'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Album Dialog */}
      <Dialog open={isAddAlbumOpen} onOpenChange={setIsAddAlbumOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Создать альбом</DialogTitle>
            <DialogDescription>
              Заполните форму для создания нового альбома
            </DialogDescription>
          </DialogHeader>
          <Form {...albumForm}>
            <form onSubmit={albumForm.handleSubmit(onAddAlbumSubmit)} className="space-y-4">
              <FormField
                control={albumForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название альбома" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={albumForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите описание альбома" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={albumForm.control}
                name="coverUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL обложки</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/cover.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddAlbumOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addAlbumMutation.isPending}>
                  {addAlbumMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Создание...
                    </>
                  ) : (
                    'Создать альбом'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Media Dialog */}
      <Dialog open={isEditMediaOpen} onOpenChange={setIsEditMediaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать медиа</DialogTitle>
            <DialogDescription>
              Внесите изменения в медиа-файл
            </DialogDescription>
          </DialogHeader>
          <Form {...editMediaForm}>
            <form onSubmit={editMediaForm.handleSubmit(onEditMediaSubmit)} className="space-y-4">
              <FormField
                control={editMediaForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMediaForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип медиа" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="photo">Фото</SelectItem>
                        <SelectItem value="video">Видео</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMediaForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL {editMediaForm.watch('type') === 'photo' ? 'изображения' : 'видео'}</FormLabel>
                    <FormControl>
                      <Input placeholder={editMediaForm.watch('type') === 'photo' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'} {...field} />
                    </FormControl>
                    {editMediaForm.watch('type') === 'video' && (
                      <p className="text-xs text-gray-500">Поддерживаются ссылки YouTube</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editMediaForm.control}
                name="albumId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Альбом</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'none' ? undefined : parseInt(value))} 
                      defaultValue={field.value?.toString() || 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите альбом" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Без альбома</SelectItem>
                        {albums?.map((album) => (
                          <SelectItem key={album.id} value={album.id.toString()}>
                            {album.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditMediaOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateMediaMutation.isPending}>
                  {updateMediaMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Media Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот медиа-файл? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => mediaToDelete && deleteMediaMutation.mutate(mediaToDelete)}
              disabled={deleteMediaMutation.isPending}
            >
              {deleteMediaMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
