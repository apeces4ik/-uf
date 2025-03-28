import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { BlogPost } from '@shared/schema';
import { Calendar, Eye, MessageSquare, ArrowLeft } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { Button } from '@/components/ui/button';

const BlogPostPage = () => {
  // Get blog post ID from URL params
  const params = useParams();
  const id = params?.id ? parseInt(params.id) : null;

  // Logs for debugging
  console.log("BlogPostPage - params:", params);
  console.log("BlogPostPage - id:", id);
  
  // Fetch blog post data
  const { 
    data: post, 
    isLoading, 
    isError 
  } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${id}`],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
            <p className="mb-6">Запрашиваемая статья не существует или была удалена.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к блогу
              </Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner with Image */}
        {post.imageUrl && (
          <div className="w-full h-96 relative">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="container mx-auto px-4 pb-12">
                <h1 className="text-4xl font-roboto-condensed font-bold text-white mb-2">{post.title}</h1>
                <div className="flex items-center text-white text-sm">
                  {post.authorAvatar && (
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                  )}
                  <span className="font-medium mr-4">{post.authorName}</span>
                  <span className="flex items-center mr-4">
                    <Calendar className="mr-1 h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center mr-4">
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
        )}
        
        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
              {/* Back to Blog */}
              <Link href="/blog" className="inline-flex items-center text-secondary-blue mb-6 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к блогу
              </Link>
              
              {/* If no image in hero, show title here */}
              {!post.imageUrl && (
                <div className="mb-8">
                  <h1 className="text-3xl font-roboto-condensed font-bold mb-3">{post.title}</h1>
                  <div className="flex items-center text-sm text-gray-500">
                    {post.authorAvatar && (
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-6 h-6 rounded-full object-cover mr-2"
                      />
                    )}
                    <span className="font-medium mr-3">{post.authorName}</span>
                    <span className="flex items-center mr-3">
                      <Calendar className="mr-1 h-4 w-4" />
                      {post.date}
                    </span>
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
              )}
              
              {/* Content */}
              <div className="prose prose-blue max-w-none">
                <p>{post.content}</p>
              </div>
            </div>
          </div>
        </article>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default BlogPostPage;