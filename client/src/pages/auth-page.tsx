import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

type LoginFormData = z.infer<typeof loginSchema>;

const AuthPage = () => {
  const [location, navigate] = useLocation();
  const { user, loginMutation, isLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Auth Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-4">
              <div className="font-roboto-condensed font-bold text-xl text-primary">ФК Александрия</div>
            </div>
            <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
            <CardDescription>Войдите в свой аккаунт для доступа к системе</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя пользователя</FormLabel>
                      <FormControl>
                        <Input placeholder="имя_пользователя" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Войти
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-primary hover:underline">
                Вернуться на главную страницу
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero Section Column */}
      <div className="w-full lg:w-1/2 hidden lg:flex flex-col bg-primary text-white">
        <div 
          className="flex-1 bg-center bg-cover bg-no-repeat flex items-center justify-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" }}
        >
          <div className="p-8 max-w-lg text-center bg-primary/60 backdrop-blur-sm rounded-lg">
            <h1 className="text-4xl font-bold mb-4 font-roboto-condensed">
              ФК "Александрия"
            </h1>
            <p className="text-xl mb-6">
              Добро пожаловать на официальный сайт футбольного клуба "Александрия"
            </p>
            <p className="text-lg">
              Войдите в систему, чтобы получить доступ к закрытым разделам сайта.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;