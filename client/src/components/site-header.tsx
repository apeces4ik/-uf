import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
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
          <Link href="/" className="flex items-center">
            {/* Логотип вместо буквы "А" и текста */}
            <img
              src="https://sun9-34.userapi.com/impg/SLyyxmb6UfK4LT3hIQxHswewQdBBLuAKvAl51A/AESKxcVPQyA.jpg?size=1029x1029&quality=95&sign=17ba8496d7a4f3c5b383ec03e941a281&type=album" // Укажите путь к вашему логотипу
              alt="Логотип ФК Александрия"
              className="h-20 w-auto" // Настройте размеры логотипа по необходимости
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-roboto-condensed ${isActive('/') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Главная
            </Link>
            <Link 
              href="/team" 
              className={`font-roboto-condensed ${isActive('/team') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Команда
            </Link>
            <Link 
              href="/matches" 
              className={`font-roboto-condensed ${isActive('/matches') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Матчи
            </Link>
            <Link 
              href="/news" 
              className={`font-roboto-condensed ${isActive('/news') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Новости
            </Link>
            <Link 
              href="/media" 
              className={`font-roboto-condensed ${isActive('/media') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Медиа
            </Link>
            <Link 
              href="/history" 
              className={`font-roboto-condensed ${isActive('/history') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              История
            </Link>
            <Link 
              href="/contacts" 
              className={`font-roboto-condensed ${isActive('/contacts') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
            >
              Контакты
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm px-3 py-1 bg-secondary-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Админ-панель
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Войти
              </Link>
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
          <Link 
            href="/" 
            className={`block font-roboto-condensed ${isActive('/') ? 'text-primary font-bold' : ''}`}
          >
            Главная
          </Link>
          <Link 
            href="/team" 
            className={`block font-roboto-condensed ${isActive('/team') ? 'text-primary font-bold' : ''}`}
          >
            Команда
          </Link>
          <Link 
            href="/matches" 
            className={`block font-roboto-condensed ${isActive('/matches') ? 'text-primary font-bold' : ''}`}
          >
            Матчи
          </Link>
          <Link 
            href="/news" 
            className={`block font-roboto-condensed ${isActive('/news') ? 'text-primary font-bold' : ''}`}
          >
            Новости
          </Link>
          <Link 
            href="/media" 
            className={`block font-roboto-condensed ${isActive('/media') ? 'text-primary font-bold' : ''}`}
          >
            Медиа
          </Link>
          <Link 
            href="/history" 
            className={`block font-roboto-condensed ${isActive('/history') ? 'text-primary font-bold' : ''}`}
          >
            История
          </Link>
          <Link 
            href="/contacts" 
            className={`block font-roboto-condensed ${isActive('/contacts') ? 'text-primary font-bold' : ''}`}
          >
            Контакты
          </Link>

          {/* Mobile Auth Buttons */}
          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col space-y-2">
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="block w-full text-center px-3 py-2 bg-secondary-blue text-white rounded-md"
                  >
                    Админ-панель
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;