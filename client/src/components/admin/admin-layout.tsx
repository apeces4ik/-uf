import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import AdminSidebar from './admin-sidebar';
import SiteHeader from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // Redirect if user is not logged in or not an admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
        <p className="mb-6">У вас нет прав администратора для доступа к этой странице.</p>
        <a href="/" className="bg-primary text-white px-4 py-2 rounded-md">Вернуться на главную</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for medium and larger screens */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <AdminSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-4 md:hidden">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>
          </div>
          
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden mb-6">
            <AdminSidebar />
          </div>
          
          {/* Page Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
