
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
        body: data
      });

      toast({
        title: "Сообщение отправлено",
        description: "Благодарим за обращение! Мы свяжемся с вами в ближайшее время.",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending contact message:", error);
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-roboto-condensed text-2xl font-bold mb-6">Контактная информация</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p>ул. Спортивная, 1, Москва, 123456</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <p>+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p>info@example.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-roboto-condensed text-xl font-bold mb-4 text-primary">Написать нам</h3>
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
                    {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                  </Button>
                </form>
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
