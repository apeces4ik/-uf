import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, Send, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary-blue p-2 rounded-full mr-2">
                <div className="text-white font-oswald font-bold text-2xl">A</div>
              </div>
              <div className="font-roboto-condensed font-bold text-xl">ФК Александрия</div>
            </div>
            <p className="text-gray-400 text-sm mb-4">Официальный сайт футбольного клуба "Александрия". Основан в 1965 году.</p>
            <div className="flex space-x-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Telegram">
                <Send size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Разделы сайта</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Главная</Link></li>
              <li><Link href="/#team" className="text-gray-400 hover:text-white transition-colors">Команда</Link></li>
              <li><Link href="/#matches" className="text-gray-400 hover:text-white transition-colors">Матчи</Link></li>
              <li><Link href="/#news" className="text-gray-400 hover:text-white transition-colors">Новости</Link></li>
              <li><Link href="/#media" className="text-gray-400 hover:text-white transition-colors">Медиа</Link></li>
              <li><Link href="/#blog" className="text-gray-400 hover:text-white transition-colors">Блог</Link></li>
              <li><Link href="/#contacts" className="text-gray-400 hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Дополнительно</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">История клуба</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Стадион</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Академия</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Фан-зона</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Магазин</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Партнеры</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Вакансии</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="text-secondary-blue mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400">ул. Спортивная 15, г. Александрия</span>
              </li>
              <li className="flex items-start">
                <div className="text-secondary-blue mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="tel:+78001234567" className="text-gray-400 hover:text-white transition-colors">+7 (800) 123-45-67</a>
              </li>
              <li className="flex items-start">
                <div className="text-secondary-blue mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:info@fcalexandria.ru" className="text-gray-400 hover:text-white transition-colors">info@fcalexandria.ru</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ФК "Александрия". Все права защищены.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-500 hover:text-gray-400 mx-2 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 mx-2 transition-colors">Пользовательское соглашение</a>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary-blue hover:bg-secondary-blue text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors"
          size="icon"
          aria-label="Вернуться наверх"
        >
          <ChevronUp size={20} />
        </Button>
      )}
    </footer>
  );
}
