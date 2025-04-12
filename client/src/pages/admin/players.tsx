import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Player, InsertPlayer } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import PlayerForm from '@/components/admin/player-form';

export default function AdminPlayers() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isEditPlayerOpen, setIsEditPlayerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null);

  const { toast } = useToast();

  // Fetch players
  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/players');
      if (!response.ok) throw new Error('Не удалось загрузить игроков');
      return response.json();
    }
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({
        title: 'Успешно',
        description: 'Игрок успешно удален',
      });
      setIsDeleteDialogOpen(false);
      setPlayerToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Edit handler
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditPlayerOpen(true);
  };

  // Delete handler
  const handleDeletePlayer = (id: number) => {
    setPlayerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter players based on search query
  const filteredPlayers = players?.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Управление игроками</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Поиск по имени или позиции..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddPlayerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Добавить игрока
          </Button>
        </div>

        <div className="bg-white rounded-md border shadow-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Позиция</TableHead>
                  <TableHead>Возраст</TableHead>
                  <TableHead>Матчи</TableHead>
                  <TableHead>Голы</TableHead>
                  <TableHead>Передачи</TableHead>
                  <TableHead className="w-[120px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers && filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.number}</TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>{player.age}</TableCell>
                      <TableCell>{player.matches}</TableCell>
                      <TableCell>{player.goals}</TableCell>
                      <TableCell>{player.assists}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlayer(player)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      {searchQuery ? 'Нет игроков, соответствующих поиску' : 'Нет игроков'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Player Dialog */}
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Добавить игрока</DialogTitle>
          </DialogHeader>
          <PlayerForm onSuccess={() => setIsAddPlayerOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={isEditPlayerOpen} onOpenChange={setIsEditPlayerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать игрока</DialogTitle>
          </DialogHeader>
          <PlayerForm player={selectedPlayer} onSuccess={() => setIsEditPlayerOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этого игрока? Это действие нельзя отменить.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => playerToDelete && deletePlayerMutation.mutate(playerToDelete)}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? (
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