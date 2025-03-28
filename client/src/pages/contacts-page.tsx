
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/apiRequest';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MapPin, Mail } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  subject: z.string().min(5, "Тема должна содержать минимум 5 символов"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactsPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      toast({
        title: "Сообщение отправлено",
        description: "Благодарим за обращение! Мы свяжемся с вами в ближайшее время.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Контакты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="order-2 md:order-1">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Написать нам</h2>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Ваше имя"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Тема сообщения"
                    {...form.register("subject")}
                  />
                  {form.formState.errors.subject && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <Textarea
                    placeholder="Ваше сообщение"
                    className="min-h-[150px]"
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.message.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="order-1 md:order-2">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6">Контактная информация</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium">Адрес</h3>
                    <p>ул. Спортивная, 1, Москва, 123456</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium">Телефон</h3>
                    <p>+7 (495) 123-45-67</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>info@example.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.5862603096586!2d37.55193731590654!3d55.78234098056431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b549fce4e6e6e7%3A0x7c2b2b2b2b2b2b2b!2z0KHQv9C-0YDRgtC40LLQvdCw0Y8g0YPQuy4sIDEsINCc0L7RgdC60LLQsCwg0KDQvtGB0YHQuNGP!5e0!3m2!1sru!2sru!4v1616836837636!5m2!1sru!2sru"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default ContactsPage;
