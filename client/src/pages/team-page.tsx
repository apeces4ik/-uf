import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Player, Coach } from '@shared/schema';
import { Loader2 } from 'lucide-react';

const TeamPage = () => {
  // States for filtering
  const [positionFilter, setPositionFilter] = useState('all');

  // Fetch players data
  const { 
    data: players, 
    isLoading: playersLoading 
  } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch coaches data
  const { 
    data: coaches, 
    isLoading: coachesLoading 
  } = useQuery<Coach[]>({
    queryKey: ['/api/coaches'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Filter players by position
  const filteredPlayers = players?.filter(player => {
    if (positionFilter === 'all') return true;
    if (positionFilter === 'goalkeepers') return player.position === 'Вратарь';
    if (positionFilter === 'defenders') return player.position === 'Защитник';
    if (positionFilter === 'midfielders') return player.position === 'Полузащитник';
    if (positionFilter === 'forwards') return player.position === 'Нападающий';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Команда</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Познакомьтесь с игроками и тренерским штабом ФК "Александрия"
            </p>
          </div>
        </section>
        
        {/* Tabs for Players/Coaches */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="players" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="players" className="text-lg px-6 py-3">Игроки</TabsTrigger>
                  <TabsTrigger value="coaches" className="text-lg px-6 py-3">Тренерский штаб</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Players Tab */}
              <TabsContent value="players">
                {/* Position Filter */}
                <div className="flex overflow-x-auto py-2 mb-6 gap-2 justify-center">
                  <button 
                    className={`${positionFilter === 'all' ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} px-4 py-2 rounded-md whitespace-nowrap transition-colors`}
                    onClick={() => setPositionFilter('all')}
                  >
                    Все игроки
                  </button>
                  <button 
                    className={`${positionFilter === 'goalkeepers' ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} px-4 py-2 rounded-md whitespace-nowrap transition-colors`}
                    onClick={() => setPositionFilter('goalkeepers')}
                  >
                    Вратари
                  </button>
                  <button 
                    className={`${positionFilter === 'defenders' ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} px-4 py-2 rounded-md whitespace-nowrap transition-colors`}
                    onClick={() => setPositionFilter('defenders')}
                  >
                    Защитники
                  </button>
                  <button 
                    className={`${positionFilter === 'midfielders' ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} px-4 py-2 rounded-md whitespace-nowrap transition-colors`}
                    onClick={() => setPositionFilter('midfielders')}
                  >
                    Полузащитники
                  </button>
                  <button 
                    className={`${positionFilter === 'forwards' ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100 text-gray-800'} px-4 py-2 rounded-md whitespace-nowrap transition-colors`}
                    onClick={() => setPositionFilter('forwards')}
                  >
                    Нападающие
                  </button>
                </div>
                
                {/* Players Grid */}
                {playersLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {filteredPlayers && filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player) => (
                        <div key={player.id} className="bg-white rounded-lg overflow-hidden shadow-md group">
                          <div className="bg-primary relative overflow-hidden h-64">
                            <div className="absolute top-0 left-0 bg-primary text-white font-oswald text-2xl font-bold w-10 h-10 flex items-center justify-center">
                              {player.number}
                            </div>
                            {player.imageUrl && (
                              <img 
                                src={player.imageUrl} 
                                alt={player.name} 
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                            <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                              <div className="text-white font-medium">{player.position}</div>
                            </div>
                          </div>
                          <div className="p-4 text-center">
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
                              <div className="text-center">
                                <div className="text-sm text-gray-500">
                                  {player.position === 'Вратарь' ? 'Сухие матчи' : 'Голы / Пас'}
                                </div>
                                <div className="font-medium">
                                  {player.position === 'Вратарь' ? 
                                    player.cleanSheets : 
                                    `${player.goals} / ${player.assists}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Игроки не найдены</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Coaches Tab */}
              <TabsContent value="coaches">
                {coachesLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coaches && coaches.length > 0 ? (
                      coaches.map((coach) => (
                        <div key={coach.id} className="bg-white rounded-lg overflow-hidden shadow-md flex">
                          <div className="w-1/3">
                            {coach.imageUrl && (
                              <img 
                                src={coach.imageUrl} 
                                alt={coach.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="w-2/3 p-4">
                            <div className="text-xs text-secondary-blue font-bold mb-1">{coach.position}</div>
                            <h4 className="font-roboto-condensed font-bold text-lg mb-2">{coach.name}</h4>
                            <div className="text-sm">
                              <div className="mb-1"><span className="text-gray-500">В клубе с:</span> {coach.joinYear}</div>
                              {coach.achievements && (
                                <div><span className="text-gray-500">Достижения:</span> {coach.achievements}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Тренерский штаб не найден</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <SiteFooter />
    </div>
  );
};

export default TeamPage;
