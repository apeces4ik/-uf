import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Media } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminMedia() {
  const [file, setFile] = useState<File | null>(null);
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
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest('POST', '/api/media', formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: 'Успешно',
        description: 'Медиа успешно добавлено',
      });
      setFile(null);
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

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    await addMediaMutation.mutateAsync(formData);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Управление медиа</h1>

        <form onSubmit={handleFileUpload} className="mb-6">
          <div className="flex gap-4">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*,video/*"
            />
            <Button type="submit" disabled={!file || addMediaMutation.isPending}>
              {addMediaMutation.isPending ? (
                <>Загрузка...</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
                ) : (
                  <video src={item.url} controls className="w-full h-48" />
                )}
              </CardContent>
              <CardFooter>
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