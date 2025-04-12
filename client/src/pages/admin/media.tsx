
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Media } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminMedia() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [url, setUrl] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: media = [], isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/media');
      return res.json();
    },
  });

  const addMediaMutation = useMutation({
    mutationFn: async (mediaData: { type: string; title: string; description: string; url: string }) => {
      const res = await apiRequest('POST', '/api/media', mediaData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно добавлено',
      });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Media> }) => {
      const res = await apiRequest('PUT', `/api/media/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно обновлено',
      });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно удалено',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('photo');
    setUrl('');
    setSelectedMedia(null);
    setIsEditMode(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (media: Media) => {
    setSelectedMedia(media);
    setTitle(media.title || '');
    setDescription(media.description || '');
    setType(media.type as 'photo' | 'video');
    setUrl(media.url);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const mediaData = {
      type,
      title,
      description,
      url,
    };

    if (isEditMode && selectedMedia?.id) {
      await updateMediaMutation.mutateAsync({
        id: selectedMedia.id,
        data: mediaData,
      });
    } else {
      await addMediaMutation.mutateAsync(mediaData);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление медиа</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить медиа
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Редактировать медиа' : 'Добавить медиа'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label>Тип</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'photo' | 'video')}
                  >
                    <option value="photo">Фото</option>
                    <option value="video">Видео</option>
                  </select>
                </div>
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите заголовок"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание"
                  />
                </div>
                <div>
                  <Label>URL {type === 'photo' ? 'фото' : 'видео'}</Label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={`Введите ссылку на ${type === 'photo' ? 'фото' : 'видео'}`}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={addMediaMutation.isPending || updateMediaMutation.isPending}
                >
                  {isEditMode ? 'Сохранить' : 'Добавить'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} className="w-full h-48 object-cover mb-4" />
                ) : (
                  <video src={item.url} controls className="w-full h-48 mb-4" />
                )}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap mb-4">{item.description}</p>
                <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('ru-RU')}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => item.id && handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => item.id && deleteMediaMutation.mutate(item.id)}
                  disabled={deleteMediaMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
