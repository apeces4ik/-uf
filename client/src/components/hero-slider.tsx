import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { News } from '@shared/schema';

interface HeroSliderProps {
  news?: News[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ news }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use top news as slides or use fallback data
  const slides = news?.slice(0, 3).map(item => ({
    title: item.title,
    description: item.excerpt || '',
    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    link: `/news/${item.id}`,
    linkText: 'Подробнее',
    category: item.category
  })) || [
    {
      title: 'Важная победа в чемпионате',
      description: 'ФК "Александрия" обыграла соперника со счетом 2:0',
      imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      link: '#',
      linkText: 'Подробнее',
      category: 'Матч'
    },
    {
      title: 'Полуфинал кубка страны',
      description: '15 мая состоится важнейший матч сезона',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      link: '#',
      linkText: 'Купить билеты',
      category: 'Анонс'
    },
    {
      title: 'Новое пополнение команды',
      description: 'Встречайте нового нападающего Александра Петрова',
      imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
      link: '#',
      linkText: 'Об игроке',
      category: 'Трансфер'
    }
  ];

  // Auto-rotate slides
  useEffect(() => {
    const startAutoRotation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    };

    const stopAutoRotation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startAutoRotation();

    // Pause auto-rotation when hovering over the slider
    const sliderElement = slidesRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', stopAutoRotation);
      sliderElement.addEventListener('mouseleave', startAutoRotation);
    }

    return () => {
      stopAutoRotation();
      if (sliderElement) {
        sliderElement.removeEventListener('mouseenter', stopAutoRotation);
        sliderElement.removeEventListener('mouseleave', startAutoRotation);
      }
    };
  }, [slides.length]);

  // Navigation handlers
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-primary overflow-hidden">
      <div id="hero-slider" ref={slidesRef} className="relative h-[500px] md:h-[600px]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 text-white">
              <div className="container mx-auto">
                <h2 className="font-roboto-condensed text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                <p className="font-roboto text-xl md:text-2xl mb-6">{slide.description}</p>
                <a 
                  href={slide.link} 
                  className="inline-block bg-white text-primary font-bold py-2 px-6 rounded-md hover:bg-secondary-blue hover:text-white transition-colors"
                >
                  {slide.linkText}
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute inset-y-0 left-4 flex items-center z-30">
          <button 
            onClick={prevSlide}
            className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center z-30">
          <button 
            onClick={nextSlide}
            className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full bg-white transition-opacity ${
                index === currentSlide ? 'opacity-100' : 'opacity-50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
