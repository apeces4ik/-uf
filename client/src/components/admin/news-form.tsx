import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { News, InsertNews, insertNewsSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsFormProps {
  news?: InsertNews & { id?: number };
  onSuccess?: () => void;
}

const categories = ['Команда', 'Матчи', 'Трансферы', 'Общее'];

export default function NewsForm({ news, onSuccess }: NewsFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      title: news?.title || '',
      content: news?.content || '',
      excerpt: news?.excerpt || '',
      imageUrl: news?.imageUrl || '',
      category: news?.category || 'Общее',
      date: news?.date || format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertNews) => {
      if (news?.id) {
        return apiRequest('PUT', `/api/news/${news.id}`, data);
      }
      return apiRequest('POST', '/api/news', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: 'Успешно',
        description: news?.id ? 'Новость обновлена' : 'Новость опубликована',
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertNews) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Краткое описание</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Публикация...' : news?.id ? 'Обновить' : 'Опубликовать'}
        </Button>
      </form>
    </Form>
  );
}