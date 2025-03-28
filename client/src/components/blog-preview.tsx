import React from 'react';
import { BlogPost } from '@shared/schema';
import { Calendar, Eye, MessageSquare } from 'lucide-react';

interface BlogPreviewProps {
  posts?: BlogPost[];
  limit?: number;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ posts, limit = 3 }) => {
  // Limit the number of posts to show
  const limitedPosts = posts?.slice(0, limit) || [];

  if (limitedPosts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Блог-статьи отсутствуют</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {limitedPosts.map((post) => (
        <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md flex flex-col h-full">
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
              <a href={`/blog/${post.id}`} className="text-secondary-blue font-medium hover:underline">
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
  );
};

export default BlogPreview;
