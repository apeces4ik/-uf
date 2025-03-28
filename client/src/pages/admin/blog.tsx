import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BlogPost, User, InsertBlogPost, insertBlogPostSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Loader2, Plus, Edit, Trash2, Search, Eye, MessageSquare, Calendar, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AdminBlog() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch blog posts
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await fetch('/api/blog');
      if (!response.ok) throw new Error('Не удалось загрузить посты блога');
      return response.json();
    }
  });

  // Create blog post mutation
  const addPostMutation = useMutation({
    mutationFn: async (post: InsertBlogPost) => {
      const res = await apiRequest('POST', '/api/admin/blog', post);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: 'Успешно',
        description: 'Пост успешно опубликован',
      });
      setIsAddPostOpen(false);
      postForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertBlogPost> }) => {
      const res = await apiRequest('PUT', `/api/admin/blog/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: 'Успешно',
        description: 'Пост успешно обновлен',
      });
      setIsEditPostOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: 'Успешно',
        description: 'Пост успешно удален',
      });
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
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
  const postForm = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: '',
      content: '',
      authorId: user?.id || 1,
      imageUrl: '',
    }
  });

  const editPostForm = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: '',
      content: '',
      authorId: user?.id || 1,
      imageUrl: '',
    }
  });

  // Form submission handlers
  const onAddPostSubmit = (data: InsertBlogPost) => {
    addPostMutation.mutate(data);
  };

  const onEditPostSubmit = (data: InsertBlogPost) => {
    if (selectedPost) {
      updatePostMutation.mutate({ id: selectedPost.id, data });
    }
  };

  // Edit post handler
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    editPostForm.reset({
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      imageUrl: post.imageUrl || '',
    });
    setIsEditPostOpen(true);
  };

  // Delete post handler
  const handleDeletePost = (id: number) => {
    setPostToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Format date nicely
  const formatPostDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  // Filter posts based on search query
  const filteredPosts = blogPosts
    ?.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление блогом</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold text-gray-600">
            Всего постов: {blogPosts?.length || 0}
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск по заголовку..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => {
              postForm.reset({
                title: '',
                content: '',
                authorId: user?.id || 1,
                imageUrl: '',
              });
              setIsAddPostOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Написать пост
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {user?.id === post.authorId ? "Вы" : `Автор #${post.authorId}`}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatPostDate(post.publishDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs text-gray-500 pt-0">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" /> {post.views}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" /> {post.comments}
                      </span>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto text-secondary-blue">
                      Предпросмотр
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery ? 'Нет постов, соответствующих поиску' : 'Блог пуст. Создайте ваш первый пост!'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add Post Dialog */}
      <Dialog open={isAddPostOpen} onOpenChange={setIsAddPostOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Написать новый пост</DialogTitle>
            <DialogDescription>
              Создайте новую запись для блога
            </DialogDescription>
          </DialogHeader>
          <Form {...postForm}>
            <form onSubmit={postForm.handleSubmit(onAddPostSubmit)} className="space-y-4">
              <FormField
                control={postForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите заголовок поста" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Содержание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите текст поста" 
                        className="min-h-[300px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={postForm.control}
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddPostOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addPostMutation.isPending}>
                  {addPostMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Публикация...
                    </>
                  ) : (
                    'Опубликовать'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Редактировать пост</DialogTitle>
            <DialogDescription>
              Внесите изменения в пост
            </DialogDescription>
          </DialogHeader>
          <Form {...editPostForm}>
            <form onSubmit={editPostForm.handleSubmit(onEditPostSubmit)} className="space-y-4">
              <FormField
                control={editPostForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите заголовок поста" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editPostForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Содержание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Введите текст поста" 
                        className="min-h-[300px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editPostForm.control}
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditPostOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updatePostMutation.isPending}>
                  {updatePostMutation.isPending ? (
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
      
      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => postToDelete && deletePostMutation.mutate(postToDelete)}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? (
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
