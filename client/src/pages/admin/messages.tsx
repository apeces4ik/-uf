import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ContactMessage } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2, Search, Eye, Trash2, Check, Mail } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch messages
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact']
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/contact/${id}/read`, {});
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Сообщение прочитано",
        description: "Сообщение помечено как прочитанное"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось пометить сообщение как прочитанное: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/contact/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Сообщение удалено",
        description: "Сообщение успешно удалено"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      setIsDeleteDialogOpen(false);
      setMessageToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить сообщение: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle view message
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // If the message was unread, mark it as read
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Handle delete message
  const handleDeleteMessage = (id: number) => {
    setMessageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (messageToDelete !== null) {
      deleteMessageMutation.mutate(messageToDelete);
    }
  };

  // Filter messages
  const filteredMessages = messages
    ? messages.filter(message => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          message.name.toLowerCase().includes(searchLower) ||
          message.email.toLowerCase().includes(searchLower) ||
          message.subject?.toLowerCase().includes(searchLower) ||
          message.message.toLowerCase().includes(searchLower);
        
        const matchesTab = 
          activeTab === 'all' ||
          (activeTab === 'unread' && !message.read) ||
          (activeTab === 'read' && message.read);
        
        return matchesSearch && matchesTab;
      })
    : [];

  // Count stats
  const unreadCount = messages?.filter(m => !m.read).length || 0;
  const totalCount = messages?.length || 0;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Сообщения</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Всего сообщений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{totalCount}</div>
                <Mail className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Непрочитанные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{unreadCount}</div>
                <Mail className="h-8 w-8 text-primary-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Прочитанные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{totalCount - unreadCount}</div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="unread">Непрочитанные {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
              <TabsTrigger value="read">Прочитанные</TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск по сообщениям..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Tabs>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Статус</TableHead>
                  <TableHead>Отправитель</TableHead>
                  <TableHead>Тема</TableHead>
                  <TableHead className="hidden md:table-cell">Дата</TableHead>
                  <TableHead className="text-right w-[120px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <TableRow key={message.id} className={message.read ? "" : "bg-blue-50"}>
                      <TableCell>
                        <Badge variant={message.read ? "outline" : "default"}>
                          {message.read ? "Прочитано" : "Новое"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-gray-500">{message.email}</div>
                      </TableCell>
                      <TableCell>{message.subject || "Без темы"}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(message.date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      {searchQuery
                        ? "Нет сообщений, соответствующих критериям поиска"
                        : "Сообщений нет"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedMessage?.subject || "Без темы"}</DialogTitle>
              <DialogDescription>
                От: {selectedMessage?.name} ({selectedMessage?.email})
                <br />
                Дата: {selectedMessage && formatDate(selectedMessage.date)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-[300px] overflow-y-auto whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Закрыть
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (selectedMessage) {
                    setIsViewDialogOpen(false);
                    handleDeleteMessage(selectedMessage.id);
                  }
                }}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Удалить сообщение</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить это сообщение? Это действие невозможно отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Отмена
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteMessageMutation.isPending}
              >
                {deleteMessageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}