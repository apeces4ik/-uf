import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Home,
  Users,
  Calendar,
  Newspaper,
  Film,
  PenTool,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

const SidebarLink = ({ href, icon, active, children, onClick }: SidebarLinkProps) => (
  <Link href={href}>
    <a
      className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${
        active
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </a>
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/admin">
            <a className="flex items-center">
              <div className="bg-primary-blue p-1.5 rounded-full mr-2">
                <div className="text-white font-oswald font-bold text-lg">A</div>
              </div>
              <span className="font-roboto-condensed font-bold hidden md:inline">
                ФК Александрия - Админ панель
              </span>
              <span className="font-roboto-condensed font-bold md:hidden">
                Админ панель
              </span>
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="text-gray-600 text-sm">
              Перейти на сайт
            </a>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Выйти
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="w-64 bg-white border-r p-4 hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="space-y-1">
            <SidebarLink
              href="/admin"
              icon={<Home className="h-5 w-5" />}
              active={location === '/admin'}
            >
              Главная
            </SidebarLink>
            <SidebarLink
              href="/admin/players"
              icon={<Users className="h-5 w-5" />}
              active={location === '/admin/players'}
            >
              Игроки и тренеры
            </SidebarLink>
            <SidebarLink
              href="/admin/matches"
              icon={<Calendar className="h-5 w-5" />}
              active={location === '/admin/matches'}
            >
              Матчи
            </SidebarLink>
            <SidebarLink
              href="/admin/news"
              icon={<Newspaper className="h-5 w-5" />}
              active={location === '/admin/news'}
            >
              Новости
            </SidebarLink>
            <SidebarLink
              href="/admin/blog"
              icon={<PenTool className="h-5 w-5" />}
              active={location === '/admin/blog'}
            >
              Блог
            </SidebarLink>
            <SidebarLink
              href="/admin/media"
              icon={<Film className="h-5 w-5" />}
              active={location === '/admin/media'}
            >
              Медиа
            </SidebarLink>
            <SidebarLink
              href="/admin/settings"
              icon={<Settings className="h-5 w-5" />}
              active={location === '/admin/settings'}
            >
              Настройки
            </SidebarLink>
          </nav>
        </aside>
        
        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <Card className="w-64 h-full bg-white rounded-none animate-in slide-in-from-left">
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-primary-blue p-1.5 rounded-full mr-2">
                      <div className="text-white font-oswald font-bold text-lg">A</div>
                    </div>
                    <span className="font-roboto-condensed font-bold">
                      ФК Александрия
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-1">
                  <SidebarLink
                    href="/admin"
                    icon={<Home className="h-5 w-5" />}
                    active={location === '/admin'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Главная
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/players"
                    icon={<Users className="h-5 w-5" />}
                    active={location === '/admin/players'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Игроки и тренеры
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/matches"
                    icon={<Calendar className="h-5 w-5" />}
                    active={location === '/admin/matches'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Матчи
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/news"
                    icon={<Newspaper className="h-5 w-5" />}
                    active={location === '/admin/news'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Новости
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/blog"
                    icon={<PenTool className="h-5 w-5" />}
                    active={location === '/admin/blog'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Блог
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/media"
                    icon={<Film className="h-5 w-5" />}
                    active={location === '/admin/media'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Медиа
                  </SidebarLink>
                  <SidebarLink
                    href="/admin/settings"
                    icon={<Settings className="h-5 w-5" />}
                    active={location === '/admin/settings'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Настройки
                  </SidebarLink>
                </nav>
              </div>
            </Card>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
