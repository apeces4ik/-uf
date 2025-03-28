import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Player, Coach } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function TeamSection() {
  const [position, setPosition] = useState<string | null>(null);
  
  const { data: players, isLoading: isLoadingPlayers } = useQuery<Player[]>({
    queryKey: ['/api/players', position],
    queryFn: async () => {
      const url = position ? `/api/players?position=${position}` : '/api/players';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Не удалось загрузить данные игроков');
      return response.json();
    }
  });

  const { data: coaches, isLoading: isLoadingCoaches } = useQuery<Coach[]>({
    queryKey: ['/api/coaches'],
    queryFn: async () => {
      const response = await fetch('/api/coaches');
      if (!response.ok) throw new Error('Не удалось загрузить данные тренеров');
      return response.json();
    }
  });

  const handlePositionChange = (newPosition: string | null) => {
    setPosition(newPosition);
  };

  const positions = [
    { id: null, label: 'Все игроки' },
    { id: 'goalkeeper', label: 'Вратари' },
    { id: 'defender', label: 'Защитники' },
    { id: 'midfielder', label: 'Полузащитники' },
    { id: 'forward', label: 'Нападающие' }
  ];

  return (
    <section id="team" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-roboto-condensed text-3xl font-bold text-primary-blue">Состав команды</h2>
          <Button variant="link" className="text-secondary-blue">
            Все игроки <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Position Filter */}
        <div className="flex overflow-x-auto py-2 mb-6 gap-2">
          {positions.map((pos) => (
            <Button
              key={pos.id || 'all'}
              variant={position === pos.id ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => handlePositionChange(pos.id)}
            >
              {pos.label}
            </Button>
          ))}
        </div>
        
        {/* Players Grid */}
        {isLoadingPlayers ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {players?.map((player) => (
              <Card key={player.id} className="bg-white overflow-hidden shadow-md group">
                <div className="bg-primary-blue relative overflow-hidden h-64">
                  <div className="absolute top-0 left-0 bg-primary-blue text-white font-oswald text-2xl font-bold w-10 h-10 flex items-center justify-center">
                    {player.number}
                  </div>
                  <img 
                    src={player.photoUrl || `https://via.placeholder.com/400x500?text=${player.name}`} 
                    alt={player.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="text-white font-medium">
                      {player.position === 'goalkeeper' && 'Вратарь'}
                      {player.position === 'defender' && 'Защитник'}
                      {player.position === 'midfielder' && 'Полузащитник'}
                      {player.position === 'forward' && 'Нападающий'}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-roboto-condensed font-bold text-lg">{player.name}</h3>
                  <div className="flex justify-center items-center mt-2 space-x-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Возраст</div>
                      <div className="font-medium">{player.age}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Матчи</div>
                      <div className="font-medium">{player.matches}</div>
                    </div>
                    {player.position === 'goalkeeper' ? (
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Сухие матчи</div>
                        <div className="font-medium">{player.cleanSheets}</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Голы / Пас</div>
                        <div className="font-medium">{player.goals} / {player.assists}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Coaching Staff */}
        <div className="mt-12">
          <h3 className="font-roboto-condensed text-2xl font-bold text-primary-blue mb-6">Тренерский штаб</h3>
          
          {isLoadingCoaches ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches?.map((coach) => (
                <Card key={coach.id} className="bg-white overflow-hidden shadow-md flex">
                  <div className="w-1/3">
                    <img 
                      src={coach.photoUrl || `https://via.placeholder.com/300?text=${coach.name}`} 
                      alt={coach.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="w-2/3 p-4">
                    <div className="text-xs text-secondary-blue font-bold mb-1">{coach.role}</div>
                    <h4 className="font-roboto-condensed font-bold text-lg mb-2">{coach.name}</h4>
                    <div className="text-sm">
                      <div className="mb-1"><span className="text-gray-500">В клубе с:</span> {coach.joinedYear}</div>
                      {coach.achievements && (
                        <div><span className="text-gray-500">Трофеи:</span> {coach.achievements}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
