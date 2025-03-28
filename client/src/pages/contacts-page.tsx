import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
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
  Clock 
} from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, "Введите ваше имя"),
  email: z.string().email("Введите корректный email адрес"),
  subject: z.string().min(2, "Введите тему сообщения"),
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
      const response = await apiRequest("POST", "/api/contact", data);

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
                        <a href="mailto:info@fcalexandria.ru" className="hover:text-secondary-blue transition-colors">info@fcalexandria.ru</a>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Clock className="mt-1 mr-3 text-secondary-blue h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-bold mb-1">Время работы билетных касс:</div>
                        <div>Понедельник - Пятница: 10:00 - 19:00</div>
                        <div>Суббота: 10:00 - 17:00</div>
                        <div>Воскресенье: Только в дни матчей</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-roboto-condensed text-xl font-bold mb-4 text-primary">Социальные сети</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-secondary-blue hover:text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.5 6.618-.5 6.618l-.012.04c-.44.332-.171.439-.318.505-.178.082-.373.086-.575.04-.13-.028-.262-.088-.4-.178-.458-.293-.956-.586-1.256-.762a.057.057 0 0 1-.026-.031.2.2 0 0 1 0-.055c.02-.036.93-.716 1.731-1.472l.11-.093a.118.118 0 0 0 0-.174 4.997 4.997 0 0 0-.622-.438.115.115 0 0 0-.143.022 68.115 68.115 0 0 0-2.06 1.372.978.978 0 0 1-.535.16c-.16-.018-.697-.307-1.073-.466a1.27 1.27 0 0 1-.47-.257 1.91 1.91 0 0 1-.17-.162c.018-.032.082-.15.483-.466.681-.53 1.225-.884 1.812-1.194.986-.522 2.013-.91 2.111-.934.045-.011.102-.032.127-.068a.232.232 0 0 0 .017-.087.154.154 0 0 0-.05-.106 1.4 1.4 0 0 0-.193-.108 2.35 2.35 0 0 0-.724-.145c-.214-.01-.424.009-.578.046a.325.325 0 0 0-.131.073.555.555 0 0 0-.09.131.5.5 0 0 0-.052.227c.01.111.037.29.062.401.096.416.157.631.19.709a.135.135 0 0 1-.019.12.136.136 0 0 1-.112.05c-.053 0-.131-.023-.18-.044-.54-.236-1.33-.968-1.741-1.315a.63.63 0 0 1-.084-.1 2.5 2.5 0 0 0 .037-.49.43.43 0 0 0-.057-.258 2.263 2.263 0 0 0-.205-.256c-.353-.354-.818-.442-1.046-.448-.045 0-.082.002-.085.002-.046.004-.138.008-.233.044a.525.525 0 0 0-.184.102c-.148.111-.278.275-.353.436-.118.28-.056.81.156 1.198.07.13.19.31.334.481.117.14.248.274.403.401.193.159.345.26.407.3.02.014.038.029.045.052a.114.114 0 0 1-.016.089c-.184.308-1.07 1.713-1.477 2.246a.164.164 0 0 1-.046.043c-.43.34-1.017.834-1.322 1.138a28.978 28.978 0 0 0-.865.88c-.085.093-.156.22-.152.314a.31.31 0 0 0 .14.157c.153.149.354.228.545.307.3.126.626.209.751.225.06.009.116.014.157.016.055.005.116.008.18.008.367 0 .732-.158.89-.306l.016-.017a.733.733 0 0 0 .12-.146c.073-.105.153-.25.233-.419.067-.14.566-1.186 1.084-2.278.12-.255.225-.47.286-.592a.223.223 0 0 1 .182-.112.207.207 0 0 1 .075.015c.067.025.08.044.3.243l.056.504c.092.856.291 2.7.3 2.796.013.137.072.304.228.394.155.09.336.086.458.07.224-.031.358-.064.451-.106.161-.072.245-.171.304-.266.078-.125.109-.296.13-.413.011-.076.038-.334.038-.334.023-.212.043-.386.058-.522.057-.512.084-.775.086-.8.003-.048.019-.137.022-.158.003-.019.023-.133.034-.19.034-.186.222-.446.356-.597.13-.145.262-.271.396-.395.05-.047.103-.09.153-.138.08-.08.16-.167.163-.173a.35.35 0 0 1 .034-.061.615.615 0 0 0 .03-.606.468.468 0 0 0-.178-.237 1.057 1.057 0 0 0-.305-.127c-.12-.029-.252-.044-.38-.046-.217-.005-.487.034-.68.138a1.36 1.36 0 0 0-.454.407c-.09.13-.15.274-.18.344a.478.478 0 0 1-.043.075.18.18 0 0 1-.053.06.5.5 0 0 1-.203.047.68.68 0 0 1-.189-.025 2.55 2.55 0 0 1-.195-.075 4.853 4.853 0 0 1-.305-.15c-.123-.066-.24-.138-.344-.211-.3-.207-.532-.403-.764-.626a.23.23 0 0 1-.063-.24c.125-.236.939-1.43 1.33-1.986.14-.2.266-.38.36-.516.035-.05.065-.09.09-.12.066-.079.126-.15.142-.198a.282.282 0 0 0-.009-.191.226.226 0 0 0-.09-.1c-.076-.046-.197-.068-.35-.068l-.097.002c-.02 0-.039 0-.058.002a3.42 3.42 0 0 0-.475.068c-.244.05-.3.069-.602.188l-.03.012c-.111.047-.218.097-.327.148-.272.128-.545.278-.77.447a1.322 1.322 0 0 0-.34.422.622.622 0 0 0-.055.387.788.788 0 0 0 .202.331 2.14 2.14 0 0 0 .126.115c.244.205.78.523 1.25.769.34.177.692.333.994.446.112.042.216.079.309.112a.42.42 0 0 1 .06.023c.008.005.015.01.023.018a.3.3 0 0 1 .042.052.424.424 0 0 1 .047.117c.005.028.004.063-.01.147l-.001.006c-.14.083-.076.488-.108.763-.023.207-.04.376-.05.5-.016.205-.03.627-.035.878a.196.196 0 0 1-.024.09.213.213 0 0 1-.086.075c-.05.027-.126.053-.188.05a.345.345 0 0 1-.124-.026 2.184 2.184 0 0 1-.263-.125 11.84 11.84 0 0 1-.822-.5 10.04 10.04 0 0 1-.833-.605 4.3 4.3 0 0 1-.246-.208 1.252 1.252 0 0 1-.185-.2.366.366 0 0 1-.059-.09c-.023-.052-.03-.117-.02-.185.016-.088.06-.19.104-.28.097-.188.245-.49.357-.738.167-.37.267-.616.3-.741a.455.455 0 0 0-.009-.325.35.35 0 0 0-.12-.142c-.082-.058-.216-.068-.32-.06-.103.004-.204.03-.283.064a3.286 3.286 0 0 0-.344.17c-.121.07-.236.146-.33.218-.193.145-.372.308-.526.458a1.205 1.205 0 0 0-.255.363.82.82 0 0 0-.075.336.577.577 0 0 0 .057.26 2.163 2.163 0 0 0 .242.382c.097.128.208.254.33.384.26.28.575.581.914.866.337.283.697.55 1.067.796l.085.056c.044.028.307.208.647.409.43.253.891.49 1.01.549.77.036.155.06.228.078.065.017.133.024.201.025.10.001.197-.013.285-.046.05-.018.098-.039.147-.063a.5.5 0 0 0 .2-.185c.066-.1.124-.214.165-.321.048-.125.087-.261.12-.384.03-.112.053-.217.072-.304.04-.178.07-.356.096-.523l.17-1.028c.008-.055.025-.08.039-.084l.02-.003c.015 0 .037.002.078.026.117.069.237.135.371.198.249.118.508.22.777.311.87.029.173.055.242.076.025.007.078.025.163.025a.5.5 0 0 0 .169-.03.379.379 0 0 0 .13-.082c.08-.076.192-.208.297-.372.215-.333.376-.717.303-.917a.446.446 0 0 0-.093-.13 1.455 1.455 0 0 0-.342-.214 4.978 4.978 0 0 0-.522-.206 4.242 4.242 0 0 1-.457-.18c-.055-.028-.117-.059-.176-.098a.405.405 0 0 1-.142-.152.34.34 0 0 1-.017-.232c.057-.227.166-.43.285-.645.15-.272.324-.554.372-.627a.65.65 0 0 1 .06-.081c.036-.043.08-.091.126-.134.08-.078.164-.15.232-.208a1.43 1.43 0 0 0 .133-.122 1.917 1.917 0 0 0 .328-.493.407.407 0 0 0 .031-.284.293.293 0 0 0-.148-.177 1.24 1.24 0 0 0-.245-.09c-.09-.022-.18-.037-.282-.041a1.07 1.07 0 0 0-.366.055c-.195.055-.412.152-.574.274-.17.128-.325.28-.45.433a1.95 1.95 0 0 0-.4.712c-.01.035-.015.078-.02.133-.007.1-.013.232-.04.387a.809.809 0 0 1-.051.17.195.195 0 0 1-.07.08.297.297 0 0 1-.066.025.632.632 0 0 1-.13.01c-.05 0-.106-.005-.16-.016a1.407 1.407 0 0 1-.265-.08 5.617 5.617 0 0 1-.543-.27 7.146 7.146 0 0 1-.708-.451.296.296 0 0 1-.104-.274c.023-.065.069-.118.107-.162a.845.845 0 0 0 .095-.128c.011-.02.027-.052.04-.096.052-.171.114-.435.114-.649 0-.09-.016-.168-.047-.234a.373.373 0 0 0-.104-.12c-.075-.057-.168-.087-.247-.102a1.058 1.058 0 0 0-.322-.019c-.076.006-.16.023-.28.056-.272.076-.51.196-.66.316a1.262 1.262 0 0 0-.25.33c-.075.14-.125.313-.126.48 0 .165.044.323.13.435.013.018.03.034.04.051l.023.03a.506.506 0 0 0 .015.018c.116.126.283.234.462.33.288.155.61.284.962.378.17.047.34.062.5.082l.025.003c.017.002.037.005.056.01a.32.32 0 0 1 .15.066.288.288 0 0 1 .077.16.36.36 0 0 1-.004.19.82.82 0 0 1-.53.114 5.87 5.87 0 0 1-.066.089c-.09.118-.184.241-.27.392a2.346 2.346 0 0 0-.19.514.704.704 0 0 0 .01.333.447.447 0 0 0 .153.216c.09.064.205.1.332.117.064.009.131.012.2.012l.14-.002a1.6 1.6 0 0 0 .229-.033c.176-.044.389-.14.525-.29.133-.15.228-.338.3-.48a1.94 1.94 0 0 0 .142-.5c.016-.103.027-.206.031-.31a2.344 2.344 0 0 0-.035-.678c-.019-.09-.046-.178-.085-.267a1.549 1.549 0 0 0-.137-.242 2.267 2.267 0 0 0-.358-.397 4.783 4.783 0 0 0-.453-.368c-.03-.021-.052-.043-.064-.075a.207.207 0 0 1-.002-.137c.014-.043.035-.078.053-.107.019-.03.035-.057.047-.084.03-.065.054-.137.077-.216.053-.177.089-.39.086-.599a.86.86 0 0 0-.037-.252.45.45 0 0 0-.105-.183.329.329 0 0 0-.125-.08 1.126 1.126 0 0 0-.306-.056c-.126-.008-.272.007-.416.56.002 0 .004 0 .007 0z"/>
                      </svg>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white p-3 rounded-lg shadow-md mb-6">
                  <div className="h-64 bg-gray-200 rounded overflow-hidden relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.0!2d30.9!3d50.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI0JzAwLjAiTiAzMMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-roboto-condensed text-xl font-bold mb-4 text-primary">Обратная связь</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ваше имя</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Петров" {...field} />
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
                              <Input type="email" placeholder="ivan@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Тема</FormLabel>
                            <FormControl>
                              <Input placeholder="Тема сообщения" {...field} />
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
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Отправка...' : 'Отправить'}
                      </Button>
                    </form>
                  </Form>
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