import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { History } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, Loader2, Trash2, Plus } from "lucide-react";
import { HistoryForm } from "@/components/admin/history-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function HistoryAdmin() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<History | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const { data: historyItems, isLoading } = useQuery<History[]>({
    queryKey: ["/api/history"],
  });
  
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/history/${deleteId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Запись удалена",
        description: "Запись истории была успешно удалена.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };
  
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditItem(null);
  };
  
  const handleEdit = (item: History) => {
    setEditItem(item);
    setShowForm(true);
  };
  
  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление историей клуба</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить запись
        </Button>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <HistoryForm item={editItem || undefined} onSuccess={handleFormSuccess} />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Отмена
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid gap-4">
        {historyItems?.sort((a, b) => b.year - a.year).map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl">{item.year}</span>
                    <span className="text-lg">{item.title}</span>
                    {item.importance === 3 && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Очень важное
                      </span>
                    )}
                    {item.importance === 2 && (
                      <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-1 text-xs font-medium text-primary/80">
                        Важное
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {historyItems?.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-background">
            <p className="text-muted-foreground">Нет записей в истории клуба</p>
            <Button onClick={handleAdd} className="mt-4" variant="outline">
              Добавить первую запись
            </Button>
          </div>
        )}
      </div>
      
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту запись из истории клуба? Это действие невозможно отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}