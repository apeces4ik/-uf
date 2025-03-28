import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertBlogPostSchema, InsertBlogPost } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
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
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface BlogFormProps {
  post?: InsertBlogPost & { id?: number };
  onSuccess?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ post, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!post?.id;
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  // Initialize form with default values
  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      authorId: post?.authorId || (user?.id || 1),
      authorName: post?.authorName || (user?.username || ''),
      authorAvatar: post?.authorAvatar || '',
      date: post?.date || currentDate,
      imageUrl: post?.imageUrl || '',
      views: post?.views || 0,
      comments: post?.comments || 0,
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  // Handle form submission
  const onSubmit = async (data: InsertBlogPost) => {
    try {
      if (isEditing && post?.id) {
        // Update existing blog post
        await apiRequest('PUT', `/api/blog-posts/${post.id}`, data);
        toast({
          title: 'Статья обновлена',
          description: 'Данные статьи успешно обновлены',
        });
      } else {
        // Create new blog post
        await apiRequest('POST', '/api/blog-posts', data);
        toast({
          title: 'Статья добавлена',
          description: 'Статья успешно добавлена в блог',
        });
        form.reset({
          title: '',
          content: '',
          excerpt: '',
          authorId: user?.id || 1,
          authorName: user?.username || '',
          authorAvatar: '',
          date: currentDate,
          imageUrl: '',
          views: 0,
          comments: 0,
        });
      }
      
      // Invalidate and refetch blog posts data
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить статью',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">{isEditing ? 'Редактирование статьи' : 'Добавление новой статьи'}</h3>
      
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
                  <Input placeholder="Введите заголовок статьи" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Author Name */}
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя автора</FormLabel>
                  <FormControl>
                    <Input placeholder="Андрей Шевченко" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Author Avatar */}
            <FormField
              control={form.control}
              name="authorAvatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL аватара автора</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
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
                <FormLabel>URL изображения для статьи</FormLabel>
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
                    placeholder="Короткое описание статьи для предпросмотра..." 
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
                <FormLabel>Содержание статьи</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Полный текст статьи..." 
                    className="min-h-[300px]" 
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
          
          {/* Hidden Author ID field */}
          <input type="hidden" {...form.register('authorId')} />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Сохранить изменения' : 'Опубликовать статью'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlogForm;
