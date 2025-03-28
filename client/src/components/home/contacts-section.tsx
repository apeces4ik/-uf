import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertContactMessageSchema, InsertContactMessage } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Send
} from 'lucide-react';

export default function ContactsSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });
  
  const onSubmit = async (data: InsertContactMessage) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/contact', data);
      toast({
        title: "Сообщение отправлено",
        description: "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить сообщение",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="py-12 bg-primary-blue text-white">
      <div className="container mx-auto px-4">
        <h2 className="font-roboto-condensed text-3xl font-bold mb-10 text-center">Контакты</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <div className="bg-white/10 p-6 rounded-lg mb-6">
              <h3 className="font-roboto-condensed text-xl font-bold mb-4">Информация о клубе</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="mt-1 mr-3 text-secondary-blue h-5 w-5" />
                  <div>
                    <div className="font-bold mb-1">Адрес стадиона:</div>
                    <address className="not-italic">Центральный стадион, ул. Спортивная 15, г. Александрия</address>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="mt-1 mr-3 text-secondary-blue h-5 w-5" />
                  <div>
                    <div className="font-bold mb-1">Телефон:</div>
                    <a href="tel:+78001234567" className="hover:text-secondary-blue transition-colors">+7 (800) 123-45-67</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="mt-1 mr-3 text-secondary-blue h-5 w-5" />
                  <div>
                    <div className="font-bold mb-1">Email:</div>
                    <a href="mailto:info@fcalexandria.ru" className="hover:text-secondary-blue transition-colors">info@fcalexandria.ru</a>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="mt-1 mr-3 text-secondary-blue h-5 w-5" />
                  <div>
                    <div className="font-bold mb-1">Время работы билетных касс:</div>
                    <div>Понедельник - Пятница: 10:00 - 19:00</div>
                    <div>Суббота: 10:00 - 17:00</div>
                    <div>Воскресенье: Только в дни матчей</div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-roboto-condensed text-xl font-bold mb-4">Социальные сети</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="bg-white/20 hover:bg-secondary-blue border-0 w-12 h-12 rounded-full">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/20 hover:bg-secondary-blue border-0 w-12 h-12 rounded-full">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/20 hover:bg-secondary-blue border-0 w-12 h-12 rounded-full">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/20 hover:bg-secondary-blue border-0 w-12 h-12 rounded-full">
                  <Youtube className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/20 hover:bg-secondary-blue border-0 w-12 h-12 rounded-full">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Map & Contact Form */}
          <div>
            {/* Map */}
            <div className="bg-white/10 p-3 rounded-lg mb-6">
              <div className="h-64 bg-white/5 rounded overflow-hidden relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.0!2d30.9!3d50.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI0JzAwLjAiTiAzMMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Карта расположения стадиона"
                />
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-roboto-condensed text-xl font-bold mb-4">Обратная связь</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ваше имя</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Иван Петров" 
                              className="bg-white/20 border-white/10 focus:border-secondary-blue text-white placeholder:text-white/60"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="ivan@example.com" 
                              type="email"
                              className="bg-white/20 border-white/10 focus:border-secondary-blue text-white placeholder:text-white/60"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тема</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Билеты на матч" 
                            className="bg-white/20 border-white/10 focus:border-secondary-blue text-white placeholder:text-white/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сообщение</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ваше сообщение..." 
                            rows={4}
                            className="bg-white/20 border-white/10 focus:border-secondary-blue text-white placeholder:text-white/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary-blue hover:bg-blue-600" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Отправка...
                      </>
                    ) : (
                      'Отправить'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
