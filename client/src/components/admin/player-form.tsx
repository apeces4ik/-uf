import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertPlayerSchema, InsertPlayer } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface PlayerFormProps {
  player?: InsertPlayer & { id?: number };
  onSuccess?: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!player?.id;

  // Initialize form with default values
  const form = useForm<InsertPlayer>({
    resolver: zodResolver(insertPlayerSchema),
    defaultValues: {
      name: player?.name || '',
      position: player?.position || '',
      number: player?.number || 0,
      age: player?.age || 0,
      matches: player?.matches || 0,
      goals: player?.goals || 0,
      assists: player?.assists || 0,
      cleanSheets: player?.cleanSheets || 0,
      imageUrl: player?.imageUrl || '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  // Handle form submission
  const onSubmit = async (data: InsertPlayer) => {
    try {
      if (isEditing && player?.id) {
        // Update existing player
        await apiRequest('PUT', `/api/players/${player.id}`, data);
        toast({
          title: 'Игрок обновлен',
          description: 'Данные игрока успешно обновлены',
        });
      } else {
        // Create new player
        await apiRequest('POST', '/api/players', data);
        toast({
          title: 'Игрок добавлен',
          description: 'Новый игрок успешно добавлен в состав команды',
        });
        form.reset({
          name: '',
          position: '',
          number: 0,
          age: 0,
          matches: 0,
          goals: 0,
          assists: 0,
          cleanSheets: 0,
          imageUrl: '',
        });
      }
      
      // Invalidate and refetch players data
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving player:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные игрока',
        variant: 'destructive',
      });
    }
  };

  // Get field value for conditional rendering
  const position = form.watch('position');
  const isGoalkeeper = position === 'Вратарь';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">{isEditing ? 'Редактирование игрока' : 'Добавление нового игрока'}</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО игрока</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Петров" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Position */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Позиция</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите позицию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Вратарь">Вратарь</SelectItem>
                        <SelectItem value="Защитник">Защитник</SelectItem>
                        <SelectItem value="Полузащитник">Полузащитник</SelectItem>
                        <SelectItem value="Нападающий">Нападающий</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Number */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      max={99}
                      placeholder="10" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Возраст</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={16}
                      max={50}
                      placeholder="25" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Matches */}
            <FormField
              control={form.control}
              name="matches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество матчей</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Based on position: Goals/Assists or Clean Sheets */}
            {isGoalkeeper ? (
              <FormField
                control={form.control}
                name="cleanSheets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сухие матчи</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Голы</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="assists"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Голевые передачи</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>URL фотографии</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/player.jpg" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Сохранить изменения' : 'Добавить игрока'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PlayerForm;
