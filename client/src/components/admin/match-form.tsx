import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertMatchSchema, InsertMatch } from '@shared/schema';
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

interface MatchFormProps {
  match?: InsertMatch & { id?: number };
  onSuccess?: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ match, onSuccess }) => {
  const { toast } = useToast();
  const isEditing = !!match?.id;

  // Initialize form with default values
  const form = useForm<InsertMatch>({
    resolver: zodResolver(insertMatchSchema),
    defaultValues: {
      date: match?.date || '',
      time: match?.time || '',
      competition: match?.competition || '',
      homeTeam: match?.homeTeam || '',
      awayTeam: match?.awayTeam || '',
      homeTeamLogo: match?.homeTeamLogo || '',
      awayTeamLogo: match?.awayTeamLogo || '',
      homeScore: match?.homeScore || undefined,
      awayScore: match?.awayScore || undefined,
      stadium: match?.stadium || '',
      status: match?.status || 'upcoming',
      round: match?.round || '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  // Get match status for conditional fields
  const status = form.watch('status');
  const isCompleted = status === 'completed';

  // Handle form submission
  const onSubmit = async (data: InsertMatch) => {
    try {
      if (isEditing && match?.id) {
        // Update existing match
        await apiRequest('PUT', `/api/matches/${match.id}`, data);
        toast({
          title: 'Матч обновлен',
          description: 'Данные матча успешно обновлены',
        });
      } else {
        // Create new match
        await apiRequest('POST', '/api/matches', data);
        toast({
          title: 'Матч добавлен',
          description: 'Новый матч успешно добавлен в календарь',
        });
        form.reset({
          date: '',
          time: '',
          competition: '',
          homeTeam: '',
          awayTeam: '',
          homeTeamLogo: '',
          awayTeamLogo: '',
          homeScore: undefined,
          awayScore: undefined,
          stadium: '',
          status: 'upcoming',
          round: '',
        });
      }
      
      // Invalidate and refetch matches data
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches/completed'] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving match:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить данные матча',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">{isEditing ? 'Редактирование матча' : 'Добавление нового матча'}</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Match Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус матча</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Предстоящий</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                        <SelectItem value="canceled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Competition */}
            <FormField
              control={form.control}
              name="competition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Турнир</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите турнир" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Чемпионат">Чемпионат</SelectItem>
                        <SelectItem value="Кубок страны">Кубок страны</SelectItem>
                        <SelectItem value="Товарищеский матч">Товарищеский матч</SelectItem>
                        <SelectItem value="Еврокубки">Еврокубки</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата (формат: гггг-мм-дд)</FormLabel>
                  <FormControl>
                    <Input placeholder="2023-05-15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Время</FormLabel>
                  <FormControl>
                    <Input placeholder="19:30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Home Team */}
            <FormField
              control={form.control}
              name="homeTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Хозяева</FormLabel>
                  <FormControl>
                    <Input placeholder="Александрия" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Away Team */}
            <FormField
              control={form.control}
              name="awayTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Гости</FormLabel>
                  <FormControl>
                    <Input placeholder="Спартак" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Home Team Logo */}
            <FormField
              control={form.control}
              name="homeTeamLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логотип хозяев (одна буква)</FormLabel>
                  <FormControl>
                    <Input placeholder="А" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Away Team Logo */}
            <FormField
              control={form.control}
              name="awayTeamLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логотип гостей (одна буква)</FormLabel>
                  <FormControl>
                    <Input placeholder="С" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Show Score fields if match is completed */}
            {isCompleted && (
              <>
                <FormField
                  control={form.control}
                  name="homeScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Голы хозяев</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          placeholder="0" 
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="awayScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Голы гостей</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          placeholder="0" 
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Stadium */}
            <FormField
              control={form.control}
              name="stadium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Стадион</FormLabel>
                  <FormControl>
                    <Input placeholder="Центральный" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Round */}
            <FormField
              control={form.control}
              name="round"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тур / Стадия</FormLabel>
                  <FormControl>
                    <Input placeholder="Тур 24" {...field} />
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
              {isEditing ? 'Сохранить изменения' : 'Добавить матч'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MatchForm;
