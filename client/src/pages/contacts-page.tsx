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
        variant: "destructive",
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <main className="flex-grow">
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Контакты</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Свяжитесь с нами, чтобы получить дополнительную информацию о клубе
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="font-roboto-condensed text-xl font-bold mb-4 text-primary">Информация о клубе</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <MapPin className="mt-1 mr-3 text-secondary-blue h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-bold mb-1">Адрес стадиона:</div>
                        <address className="not-italic">Центральный стадион, ул. Спортивная 15, г. Александрия</address>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="mt-1 mr-3 text-secondary-blue h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-bold mb-1">Телефон:</div>
                        <a href="tel:+78001234567" className="hover:text-secondary-blue transition-colors">+7 (800) 123-45-67</a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail className="mt-1 mr-3 text-secondary-blue h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-bold mb-1">Email:</div>
                        <a href="mailto:info@fckdemo.com" className="hover:text-secondary-blue transition-colors">info@fckdemo.com</a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-roboto-condensed text-xl font-bold mb-4 text-primary">Социальные сети</h3>
                  <div className="flex space-x-4">
                    <a href="https://t.me/fckdemo" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-secondary-blue transition-colors">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.5 6.618-.5 6.618l-.012.04c-.44.332-.171.439-.318.505-.178.082-.373.086-.575.04-.13-.028-.262-.088-.4-.178-.458-.293-.956-.586-1.256-.762a.057.057 0 0 1-.026-.031.2.2 0 0 1 0-.055c.02-.036.93-.716 1.731-1.472l.11-.093a.118.118 0 0 0 0-.174 4.997 4.997 0 0 0-.622-.438.115.115 0 0 0-.143.022 68.115 68.115 0 0 0-2.06 1.372.978.978 0 0 1-.535.16c-.16-.018-.697-.307-1.073-.466a1.27 1.27 0 0 1-.47-.257 1.91 1.91 0 0 1-.17-.162c.018-.032.082-.15.483-.466.681-.53 1.225-.884 1.812-1.194.986-.522 2.013-.91 2.111-.934.045-.011.102-.032.127-.068a.232.232 0 0 0 .017-.087.154.154 0 0 0-.05-.106 1.4 1.4 0 0 0-.193-.108 2.35 2.35 0 0 0-.724-.145c-.214-.01-.424.009-.578.046a.325.325 0 0 0-.131.073.555.555 0 0 0-.09.131.5.5 0 0 0-.052.227c.01.111.037.29.062.401.096.416.157.631.19.709a.135.135 0 0 1-.019.12.136.136 0 0 1-.112.05c-.053 0-.131-.023-.18-.044-.54-.236-1.33-.968-1.741-1.315a.63.63 0 0 1-.084-.1 2.5 2.5 0 0 0 .037-.49.43.43 0 0 0-.057-.258 2.263 2.263 0 0 0-.205-.256c-.353-.354-.818-.442-1.046-.448-.045 0-.082.002-.085.002-.046.004-.138.008-.233.044a.525.525 0 0 0-.184.102c-.148.111-.278.275-.353.436-.118.28-.056.81.156 1.198.07.13.19.31.334.481.117.14.248.274.403.401.193.159.345.26.407.3.02.014.038.029.045.052a.114.114 0 0 1-.016.089c-.184.308-1.07 1.713-1.477 2.246a.164.164 0 0 1-.046.043c-.43.34-1.017.834-1.322 1.138a28.978 28.978 0 0 0-.865.88c-.085.093-.156.22-.152.314a.31.31 0 0 0 .14.157c.153.149.354.228.545.307.3.126.626.209.751.225.06.009.116.014.157.016.055.005.116.008.18.008.367 0 .732-.158.89-.306l.016-.017a.733.733 0 0 0 .12-.146c.073-.105.153-.25.233-.419.067-.14.566-1.186 1.084-2.278.12-.255.225-.47.286-.592a.223.223 0 0 1 .182-.112.207.207 0 0 1 .075.015c.067.025.08.044.3.243l.056.504c.092.856.291 2.7.3 2.796.013.137.072.304.228.394.155.09.336.086.458.07.224-.031.358-.064.451-.106.161-.072.245-.171.304-.266.078-.125.109-.296.13-.413.011-.076.038-.334.038-.334.023-.212.043-.386.058-.522.057-.512.084-.775.086-.8.003-.048.019-.137.022-.158.003-.019.023-.133.034-.19.034-.186.222-.446.356-.597.13-.145.262-.271.396-.395.05-.047.103-.09.153-.138.08-.08.16-.167.163-.173a.35.35 0 0 1 .034-.061.615.615 0 0 0 .03-.606.468.468 0 0 0-.178-.237 1.057 1.057 0 0 0-.305-.127c-.12-.029-.252-.044-.38-.046-.217-.005-.487.034-.68.138a1.36 1.36 0 0 0-.454.407c-.09.13-.15.274-.18.344a.478.478 0 0 1-.043.075.18.18 0 0 1-.053.06.5.5 0 0 1-.203.047.68.68 0 0 1-.189-.025 2.55 2.55 0 0 1-.195-.075 4.853 4.853 0 0 1-.305-.15c-.123-.066-.24-.138-.344-.211-.3-.207-.532-.403-.764-.626a.23.23 0 0 1-.063-.24c.125-.236.939-1.43 1.33-1.986.14-.2.266-.38.36-.516.035-.05.065-.09.09-.12.066-.079.126-.15.142-.198a.282.282 0 0 0-.009-.191.226.226 0 0 0-.09-.1c-.076-.046-.197-.068-.35-.068l-.097.002c-.02 0-.039 0-.058.002a3.42 3.42 0 0 0-.475.068c-.244.05-.3.069-.602.188l-.03.012c-.111.047-.218.097-.327.148-.272.128-.545.278-.77.447a1.322 1.322 0 0 0-.34.422.622.622 0 0 0-.055.387.788.788 0 0 0 .202.331 2.14 2.14 0 0 0 .126.115c.244.205.78.523 1.25.769.34.177.692.333.994.446.112.042.216.079.309.112" />
                        </svg>
                      </div>
                    </a>
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
                        error={form.formState.errors.name?.message}
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...form.register("email")}
                        error={form.formState.errors.email?.message}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Тема сообщения"
                        {...form.register("subject")}
                        error={form.formState.errors.subject?.message}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Ваше сообщение"
                        className="min-h-[150px]"
                        {...form.register("message")}
                        error={form.formState.errors.message?.message}
                      />
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
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContactsPage;