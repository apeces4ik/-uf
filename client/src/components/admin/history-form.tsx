import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { History, insertHistorySchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface HistoryFormProps {
  item?: History;
  onSuccess?: () => void;
}

// Extend the schema for form validation
const historyFormSchema = insertHistorySchema.extend({
  imageUrl: z.string().url({ message: "Введите корректный URL изображения" }).nullable().optional(),
});

type HistoryFormData = z.infer<typeof historyFormSchema>;

export function HistoryForm({ item, onSuccess }: HistoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<HistoryFormData>({
    resolver: zodResolver(historyFormSchema),
    defaultValues: {
      title: item?.title || "",
      year: item?.year || new Date().getFullYear(),
      description: item?.description || "",
      imageUrl: item?.imageUrl || "",
      importance: item?.importance || 1,
    },
  });
  
  const onSubmit = async (data: HistoryFormData) => {
    setIsSubmitting(true);
    
    try {
      if (item) {
        // Update
        await apiRequest("PUT", `/api/history/${item.id}`, data);
        toast({
          title: "Запись обновлена",
          description: "Информация об истории клуба была успешно обновлена.",
        });
      } else {
        // Create
        await apiRequest("POST", "/api/history", data);
        form.reset({
          title: "",
          year: new Date().getFullYear(),
          description: "",
          imageUrl: "",
          importance: 1,
        });
        toast({
          title: "Запись создана",
          description: "Новая запись в истории клуба была успешно создана.",
        });
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить информацию. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Редактировать запись истории" : "Добавить новую запись истории"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Название события" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Год</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1900"
                      max="2100"
                      placeholder="Год события"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Важность</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите уровень важности" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Обычное</SelectItem>
                      <SelectItem value="2">Важное</SelectItem>
                      <SelectItem value="3">Очень важное</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Подробное описание события" 
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://example.com/image.jpg" 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}