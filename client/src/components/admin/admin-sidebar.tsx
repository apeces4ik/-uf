import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  FileText,
  Image,
  ListOrdered,
  MessageSquare,
  Settings,
  LogOut,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const AdminSidebar: React.FC = () => {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get the current section from the URL
  const currentSection = location.startsWith('/admin/') 
    ? location.split('/')[2] 
    : location === '/admin' 
      ? 'dashboard' 
      : '';

  // Handle section navigation
  const navigateToSection = (section: string) => {
    if (section === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${section}`);
    }
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Function to check if a section is active
  const isActive = (section: string) => {
    return section === 'dashboard' 
      ? location === '/admin' 
      : currentSection === section;
  };

  // List of sidebar items
  const sidebarItems = [
    { id: 'dashboard', label: 'Панель управления', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { id: 'players', label: 'Игроки', icon: <Users className="h-5 w-5 mr-2" /> },
    { id: 'coaches', label: 'Тренерский штаб', icon: <Users className="h-5 w-5 mr-2" /> },
    { id: 'matches', label: 'Матчи', icon: <Calendar className="h-5 w-5 mr-2" /> },
    { id: 'news', label: 'Новости', icon: <Newspaper className="h-5 w-5 mr-2" /> },
    { id: 'blog', label: 'Блог', icon: <FileText className="h-5 w-5 mr-2" /> },
    { id: 'history', label: 'История клуба', icon: <History className="h-5 w-5 mr-2" /> },
    { id: 'media', label: 'Медиа', icon: <Image className="h-5 w-5 mr-2" /> },
    { id: 'standings', label: 'Турнирная таблица', icon: <ListOrdered className="h-5 w-5 mr-2" /> },
    { id: 'messages', label: 'Сообщения', icon: <MessageSquare className="h-5 w-5 mr-2" /> }
  ];

  // Sidebar content
  const renderSidebarContent = () => (
    <div className="space-y-1 py-2">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigateToSection(item.id)}
          className={cn(
            "flex items-center w-full px-4 py-2 text-left text-sm transition-colors",
            isActive(item.id)
              ? "bg-primary text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Выйти
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full flex justify-between items-center mb-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="font-medium">Меню администратора</span>
          {isMobileMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        
        {/* Mobile sidebar content */}
        {isMobileMenuOpen && (
          <div className="bg-white rounded-md border border-gray-200 mb-6">
            {renderSidebarContent()}
          </div>
        )}
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <div className="py-4 px-2">
          <h2 className="px-4 text-lg font-bold mb-4 text-primary">Панель администратора</h2>
          {renderSidebarContent()}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
