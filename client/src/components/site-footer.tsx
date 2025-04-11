import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              
              <div className="font-roboto-condensed font-bold text-xl">ФК Александрия</div>
            </div>
            <p className="text-gray-400 text-sm mb-4">Официальный сайт футбольного клуба "Александрия". Основан в 1965 году.</p>
            
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Разделы сайта</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Главная</a></li>
              <li><a href="/team" className="text-gray-400 hover:text-white transition-colors">Команда</a></li>
              <li><a href="/matches" className="text-gray-400 hover:text-white transition-colors">Матчи</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-white transition-colors">Новости</a></li>
              <li><a href="/media" className="text-gray-400 hover:text-white transition-colors">Медиа</a></li>
              <li><a href="/contacts" className="text-gray-400 hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Дополнительно</h3>
            <ul className="space-y-2">
              <li><a href="/history" className="text-gray-400 hover:text-white transition-colors">История клуба</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Академия</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Партнеры</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-roboto-condensed text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-2 text-secondary-blue h-4 w-4" />
                <span className="text-gray-400">ул. Спортивная 15, г. Александрия</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-2 text-secondary-blue h-4 w-4" />
                <a href="tel:+78001234567" className="text-gray-400 hover:text-white transition-colors">+7 (800) 123-45-67</a>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-2 text-secondary-blue h-4 w-4" />
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
    </footer>
  );
};

export default SiteFooter;
