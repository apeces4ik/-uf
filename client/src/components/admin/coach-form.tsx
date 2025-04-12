
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CoachFormProps {
  coach?: Coach;
  onSuccess?: () => void;
}

export default function CoachForm({ coach, onSuccess }: CoachFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: coach || {
      name: '',
      position: '',
      imageUrl: '',
      joinYear: '',
      achievements: ''
    }
  });

  const { toast } = useToast();

  const createCoachMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/coaches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create coach');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Тренер был добавлен",
      });
      onSuccess?.();
    },
  });

  const updateCoachMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/coaches/${coach?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update coach');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Данные тренера обновлены",
      });
      onSuccess?.();
    },
  });

  const onSubmit = (data: any) => {
    if (coach) {
      updateCoachMutation.mutate(data);
    } else {
      createCoachMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('name', { required: 'Имя обязательно' })}
          placeholder="Имя тренера"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('position', { required: 'Должность обязательна' })}
          placeholder="Должность"
        />
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('imageUrl')}
          placeholder="URL фотографии"
        />
      </div>

      <div>
        <Input
          {...register('joinYear')}
          placeholder="Год начала работы"
        />
      </div>

      <div>
        <Input
          {...register('achievements')}
          placeholder="Достижения"
        />
      </div>

      <Button type="submit" disabled={createCoachMutation.isPending || updateCoachMutation.isPending}>
        {createCoachMutation.isPending || updateCoachMutation.isPending ? (
          "Сохранение..."
        ) : coach ? (
          "Обновить"
        ) : (
          "Добавить"
        )}
      </Button>
    </form>
  );
}
