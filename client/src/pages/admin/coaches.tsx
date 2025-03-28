import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Coach, InsertCoach, insertCoachSchema } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Edit, Trash2, Plus, Search } from 'lucide-react';
import { z } from 'zod';

// Переопределим схему для лучшей совместимости с формами
const coachFormSchema = insertCoachSchema.extend({
  achievements: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
});

export default function AdminCoaches() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false);
  const [isEditCoachOpen, setIsEditCoachOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Data fetching
  const { data: coaches, isLoading } = useQuery<Coach[]>({
    queryKey: ['/api/coaches'],
    queryFn: async () => {
      const response = await fetch('/api/coaches');
      if (!response.ok) throw new Error('Не удалось загрузить тренеров');
      return response.json();
    }
  });

  // Forms for adding and editing coaches
  type CoachFormValues = z.infer<typeof coachFormSchema>;
  
  const addCoachForm = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: '',
      position: '',
      joinYear: new Date().getFullYear(),
      imageUrl: '',
      achievements: ''
    }
  });

  const editCoachForm = useForm<CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: {
      name: '',
      position: '',
      joinYear: new Date().getFullYear(),
      imageUrl: '',
      achievements: ''
    }
  });

  // Mutations
  const addCoachMutation = useMutation({
    mutationFn: async (coach: CoachFormValues) => {
      const res = await apiRequest('POST', '/api/coaches', coach);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно добавлен',
      });
      setIsAddCoachOpen(false);
      addCoachForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const updateCoachMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<CoachFormValues> }) => {
      const res = await apiRequest('PUT', `/api/coaches/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно обновлен',
      });
      setIsEditCoachOpen(false);
      setSelectedCoach(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const deleteCoachMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/coaches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coaches'] });
      toast({
        title: 'Успешно',
        description: 'Тренер успешно удален',
      });
      setIsDeleteDialogOpen(false);
      setCoachToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Form submissions
  const onAddCoachSubmit = (data: CoachFormValues) => {
    addCoachMutation.mutate(data);
  };

  const onEditCoachSubmit = (data: CoachFormValues) => {
    if (selectedCoach) {
      updateCoachMutation.mutate({ id: selectedCoach.id, data });
    }
  };

  // Edit handler
  const handleEditCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    editCoachForm.reset({
      name: coach.name,
      position: coach.position,
      joinYear: coach.joinYear,
      achievements: coach.achievements || '',
      imageUrl: coach.imageUrl || ''
    });
    setIsEditCoachOpen(true);
  };

  // Delete handler
  const handleDeleteCoach = (id: number) => {
    setCoachToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCoach = () => {
    if (coachToDelete !== null) {
      deleteCoachMutation.mutate(coachToDelete);
    }
  };

  // Filter coaches based on search query
  const filteredCoaches = coaches?.filter(coach => 
    coach.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coach.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление тренерским штабом</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-500">Всего тренеров: {coaches?.length || 0}</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={() => {
              addCoachForm.reset();
              setIsAddCoachOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Добавить тренера
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-md border shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead className="text-center">В клубе с</TableHead>
                  <TableHead>Достижения</TableHead>
                  <TableHead className="w-[120px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoaches && filteredCoaches.length > 0 ? (
                  filteredCoaches.map((coach) => (
                    <TableRow key={coach.id}>
                      <TableCell className="font-medium">{coach.name}</TableCell>
                      <TableCell>{coach.position}</TableCell>
                      <TableCell className="text-center">{coach.joinYear}</TableCell>
                      <TableCell>{coach.achievements || '—'}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCoach(coach)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCoach(coach.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      {searchQuery ? 'Нет тренеров, соответствующих поиску' : 'Нет тренеров в базе данных'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {/* Add Coach Dialog */}
      <Dialog open={isAddCoachOpen} onOpenChange={setIsAddCoachOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить тренера</DialogTitle>
            <DialogDescription>
              Заполните форму для добавления нового тренера в команду
            </DialogDescription>
          </DialogHeader>
          <Form {...addCoachForm}>
            <form onSubmit={addCoachForm.handleSubmit(onAddCoachSubmit)} className="space-y-4">
              <FormField
                control={addCoachForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя тренера</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCoachForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Должность</FormLabel>
                    <FormControl>
                      <Input placeholder="Главный тренер" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCoachForm.control}
                name="joinYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В клубе с (год)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCoachForm.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Достижения</FormLabel>
                    <FormControl>
                      <Input placeholder="Кубок 2022" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addCoachForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL фотографии</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddCoachOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={addCoachMutation.isPending}>
                  {addCoachMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Добавить тренера'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Coach Dialog */}
      <Dialog open={isEditCoachOpen} onOpenChange={setIsEditCoachOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать тренера</DialogTitle>
            <DialogDescription>
              Измените данные тренера
            </DialogDescription>
          </DialogHeader>
          <Form {...editCoachForm}>
            <form onSubmit={editCoachForm.handleSubmit(onEditCoachSubmit)} className="space-y-4">
              <FormField
                control={editCoachForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя тренера</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Петров" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Должность</FormLabel>
                    <FormControl>
                      <Input placeholder="Главный тренер" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="joinYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В клубе с (год)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Достижения</FormLabel>
                    <FormControl>
                      <Input placeholder="Кубок 2022" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCoachForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL фотографии</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCoachOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateCoachMutation.isPending}>
                  {updateCoachMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого тренера? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCoach}
              disabled={deleteCoachMutation.isPending}
            >
              {deleteCoachMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}