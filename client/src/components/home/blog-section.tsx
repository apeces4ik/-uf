import { useQuery } from '@tanstack/react-query';
import { BlogPost, User } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function BlogSection() {
  const { data: blogPosts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog', 3],
    queryFn: async () => {
      const response = await fetch('/api/blog?limit=3');
      if (!response.ok) throw new Error('Не удалось загрузить посты блога');
      return response.json();
    }
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      // In a real app we'd have an endpoint to get all users
      // Here we're working with what we have
      const userData: User[] = [];
      if (blogPosts) {
        for (const post of blogPosts) {
          try {
            const response = await fetch(`/api/user/${post.authorId}`);
            if (response.ok) {
              const user = await response.json();
              if (!userData.find(u => u.id === user.id)) {
                userData.push(user);
              }
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        }
      }
      return userData;
    },
    enabled: !!blogPosts && blogPosts.length > 0
  });

  const isLoading = isLoadingPosts || isLoadingUsers;

  const formatDate = (date: string) => {
    return format(new Date(date), 'd MMMM yyyy', { locale: ru });
  };

  const getAuthorName = (authorId: number) => {
    const author = users?.find(user => user.id === authorId);
    return author?.username || 'Автор';
  };

  return (
    <section id="blog" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-roboto-condensed text-3xl font-bold text-primary-blue">Блог</h2>
          <Button variant="link" className="text-secondary-blue">
            Все статьи <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts?.map(post => (
              <Card key={post.id} className="bg-gray-50 overflow-hidden shadow-md">
                <div className="h-48">
                  <img 
                    src={post.imageUrl || `https://images.unsplash.com/photo-1626248801379-51a0748a5f96?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80`} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold mr-2">
                      {getAuthorName(post.authorId).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{getAuthorName(post.authorId)}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-500">{formatDate(post.publishDate)}</span>
                  </div>
                  <h3 className="font-roboto-condensed text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.content.length > 120 
                      ? `${post.content.substring(0, 120)}...` 
                      : post.content
                    }
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="link" className="p-0 h-auto text-secondary-blue font-medium">
                      Читать полностью
                    </Button>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-3">
                        <Eye className="inline-block mr-1 h-4 w-4" /> {post.views}
                      </span>
                      <span>
                        <MessageSquare className="inline-block mr-1 h-4 w-4" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
