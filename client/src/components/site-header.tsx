import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Check if the current route is active
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`bg-white sticky top-0 z-50 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="bg-primary p-2 rounded-full mr-2">
              <div className="text-white font-oswald font-bold text-2xl">A</div>
            </div>
            <div>
              <span className="text-primary font-roboto-condensed font-bold text-xl">ФК Александрия</span>
            </div>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="/" 
              className={`font-roboto-condensed ${isActive('/') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Главная
            </a>
            <a 
              href="/team" 
              className={`font-roboto-condensed ${isActive('/team') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Команда
            </a>
            <a 
              href="/matches" 
              className={`font-roboto-condensed ${isActive('/matches') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Матчи
            </a>
            <a 
              href="/news" 
              className={`font-roboto-condensed ${isActive('/news') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Новости
            </a>
            <a 
              href="/media" 
              className={`font-roboto-condensed ${isActive('/media') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Медиа
            </a>
            <a 
              href="/blog" 
              className={`font-roboto-condensed ${isActive('/blog') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Блог
            </a>
            <a 
              href="/history" 
              className={`font-roboto-condensed ${isActive('/history') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              История
            </a>
            <a 
              href="/contacts" 
              className={`font-roboto-condensed ${isActive('/contacts') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Контакты
            </a>
            
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAdmin && (
                  <a
                    href="/admin"
                    className="text-sm px-3 py-1 bg-secondary-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Админ-панель
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Войти
              </a>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-primary focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white border-t border-gray-200 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-3 space-y-3">
          <a 
            href="/" 
            className={`block font-roboto-condensed ${isActive('/') ? 'text-primary font-bold' : ''}`}
          >
            Главная
          </a>
          <a 
            href="/team" 
            className={`block font-roboto-condensed ${isActive('/team') ? 'text-primary font-bold' : ''}`}
          >
            Команда
          </a>
          <a 
            href="/matches" 
            className={`block font-roboto-condensed ${isActive('/matches') ? 'text-primary font-bold' : ''}`}
          >
            Матчи
          </a>
          <a 
            href="/news" 
            className={`block font-roboto-condensed ${isActive('/news') ? 'text-primary font-bold' : ''}`}
          >
            Новости
          </a>
          <a 
            href="/media" 
            className={`block font-roboto-condensed ${isActive('/media') ? 'text-primary font-bold' : ''}`}
          >
            Медиа
          </a>
          <a 
            href="/blog" 
            className={`block font-roboto-condensed ${isActive('/blog') ? 'text-primary font-bold' : ''}`}
          >
            Блог
          </a>
          <a 
            href="/history" 
            className={`block font-roboto-condensed ${isActive('/history') ? 'text-primary font-bold' : ''}`}
          >
            История
          </a>
          <a 
            href="/contacts" 
            className={`block font-roboto-condensed ${isActive('/contacts') ? 'text-primary font-bold' : ''}`}
          >
            Контакты
          </a>
          
          {/* Mobile Auth Buttons */}
          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col space-y-2">
                {user.isAdmin && (
                  <a
                    href="/admin"
                    className="block w-full text-center px-3 py-2 bg-secondary-blue text-white rounded-md"
                  >
                    Админ-панель
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <a
                href="/auth"
                className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md"
              >
                Войти
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
