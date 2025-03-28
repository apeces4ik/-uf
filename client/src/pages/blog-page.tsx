import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { BlogPost } from '@shared/schema';
import { Calendar, Eye, MessageSquare } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const BlogPage = () => {
  // Fetch blog posts data
  const { 
    data: posts, 
    isLoading 
  } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Блог</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Статьи, аналитика и колонки от тренеров и экспертов ФК "Александрия"
            </p>
          </div>
        </section>
        
        {/* Blog Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {posts && posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                        {post.imageUrl && (
                          <div className="h-48">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-5 flex-grow flex flex-col">
                          <div className="flex items-center mb-3">
                            {post.authorAvatar && (
                              <img 
                                src={post.authorAvatar} 
                                alt={post.authorName} 
                                className="w-8 h-8 rounded-full object-cover mr-2"
                              />
                            )}
                            <span className="text-sm font-medium">{post.authorName}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="inline-block mr-1 h-4 w-4" />
                              {post.date}
                            </span>
                          </div>
                          <h3 className="font-roboto-condensed text-xl font-bold mb-3">{post.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 flex-grow">
                            {post.excerpt || post.content.substring(0, 150) + '...'}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <a href="#" className="text-secondary-blue font-medium hover:underline">
                              Читать полностью
                            </a>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="flex items-center mr-3">
                                <Eye className="mr-1 h-4 w-4" />
                                {post.views}
                              </span>
                              <span className="flex items-center">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                {post.comments}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Статьи не найдены</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default BlogPage;
