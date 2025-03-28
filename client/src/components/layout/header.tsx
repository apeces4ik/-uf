import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, User, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle window resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-primary-blue p-2 rounded-full mr-2">
              <div className="text-white font-oswald font-bold text-2xl">A</div>
            </div>
            <div>
              <span className="text-primary-blue font-roboto-condensed font-bold text-xl">ФК Александрия</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`font-roboto-condensed ${location === '/' ? 'text-primary-blue font-bold' : 'hover:text-primary-blue'} transition-colors`}>
              Главная
            </Link>
            <Link href="/#team" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Команда
            </Link>
            <Link href="/#matches" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Матчи
            </Link>
            <Link href="/#news" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Новости
            </Link>
            <Link href="/#media" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Медиа
            </Link>
            <Link href="/#blog" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Блог
            </Link>
            <Link href="/#contacts" className="font-roboto-condensed hover:text-primary-blue transition-colors">
              Контакты
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <User size={18} />
                    <span className="ml-1">{user.username}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer w-full">
                        <Settings size={16} className="mr-2" />
                        Панель управления
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="outline" className="font-roboto-condensed">
                  Войти
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer w-full">
                        <Settings size={16} className="mr-2" />
                        Панель управления
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-blue focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link href="/" className={`block font-roboto-condensed ${location === '/' ? 'text-primary-blue font-bold' : ''}`}>
              Главная
            </Link>
            <Link href="/#team" className="block font-roboto-condensed">
              Команда
            </Link>
            <Link href="/#matches" className="block font-roboto-condensed">
              Матчи
            </Link>
            <Link href="/#news" className="block font-roboto-condensed">
              Новости
            </Link>
            <Link href="/#media" className="block font-roboto-condensed">
              Медиа
            </Link>
            <Link href="/#blog" className="block font-roboto-condensed">
              Блог
            </Link>
            <Link href="/#contacts" className="block font-roboto-condensed">
              Контакты
            </Link>
            
            {!user && (
              <Link href="/auth" className="block">
                <Button variant="outline" className="font-roboto-condensed w-full">
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
