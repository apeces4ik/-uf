import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

const initialSlides: Slide[] = [
  {
    id: 1,
    title: 'Важная победа в чемпионате',
    subtitle: 'ФК "Александрия" обыграла соперника со счетом 2:0',
    buttonText: 'Подробнее',
    buttonLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 2,
    title: 'Полуфинал кубка страны',
    subtitle: '15 мая состоится важнейший матч сезона',
    buttonText: 'Купить билеты',
    buttonLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 3,
    title: 'Новое пополнение команды',
    subtitle: 'Встречайте нового нападающего Александра Петрова',
    buttonText: 'Об игроке',
    buttonLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoRotation();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoRotation();
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startAutoRotation();
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
    startAutoRotation();
  };

  return (
    <section className="relative bg-primary-blue overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/80 to-transparent z-10"></div>
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 text-white">
              <div className="container mx-auto">
                <h2 className="font-roboto-condensed text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                <p className="font-roboto text-xl md:text-2xl mb-6">{slide.subtitle}</p>
                <Button asChild variant="secondary">
                  <a href={slide.buttonLink}>{slide.buttonText}</a>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <div className="absolute inset-y-0 left-4 flex items-center z-30">
          <Button 
            onClick={handlePrevSlide}
            variant="ghost" 
            size="icon"
            className="bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center z-30">
          <Button 
            onClick={handleNextSlide}
            variant="ghost" 
            size="icon"
            className="bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full bg-white transition-opacity ${currentSlide === index ? 'opacity-100' : 'opacity-50'}`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
