import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertNewsSchema, InsertNews } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface NewsFormProps {
  news?: InsertNews & { id?: number };
  onSuccess?: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ news, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!news?.id;
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  // Initialize form with default values
  const form = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      title: news?.title || '',
      content: news?.content || '',
      excerpt: news?.excerpt || '',
      imageUrl: news?.imageUrl || '',
      category: news?.category || '',
      date: news?.date || currentDate,
      views: news?.views || 0,
      comments: news?.comments || 0,
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  // Handle form submission
  const onSubmit = async (data: InsertNews) => {
    try {
      if (isEditing && news?.id) {
        // Update existing news
        await apiRequest('PUT', `/api/news/${news.id}`, data);
        toast({
          title: 'Новость обновлена',
          description: 'Данные новости успешно обновлены',
        });
      } else {
        // Create new news
        await apiRequest('POST', '/api/news', data);
        toast({
          title: 'Новость добавлена',
          description: 'Новость успешно добавлена на сайт',
        });
        form.reset({
          title: '',
          content: '',
          excerpt: '',
          imageUrl: '',
          category: '',
          date: currentDate,
          views: 0,
          comments: 0,
        });
      }
      
      // Invalidate and refetch news data
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить новость',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">{isEditing ? 'Редактирование новости' : 'Добавление новой новости'}</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок</FormLabel>
                <FormControl>
                  <Input placeholder="Введите заголовок новости" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Матч">Матч</SelectItem>
                        <SelectItem value="Трансфер">Трансфер</SelectItem>
                        <SelectItem value="Интервью">Интервью</SelectItem>
                        <SelectItem value="Тренировка">Тренировка</SelectItem>
                        <SelectItem value="Клуб">Клуб</SelectItem>
                        <SelectItem value="Анонс">Анонс</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата публикации</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Image URL */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL изображения</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Excerpt */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Краткое описание</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Короткое описание новости для предпросмотра..." 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Содержание новости</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Полный текст новости..." 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Views */}
            <FormField
              control={form.control}
              name="views"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Просмотры</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Comments */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарии</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Сохранить изменения' : 'Опубликовать новость'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewsForm;
