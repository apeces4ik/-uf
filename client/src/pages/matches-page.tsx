import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Match, Standing } from '@shared/schema';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const MatchesPage = () => {
  // Fetch matches data
  const { 
    data: upcomingMatches, 
    isLoading: upcomingLoading 
  } = useQuery<Match[]>({
    queryKey: ['/api/matches/upcoming'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { 
    data: completedMatches, 
    isLoading: completedLoading 
  } = useQuery<Match[]>({
    queryKey: ['/api/matches/completed'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch standings data
  const { 
    data: standings, 
    isLoading: standingsLoading 
  } = useQuery<Standing[]>({
    queryKey: ['/api/standings'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-roboto-condensed font-bold mb-4">Матчи</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Календарь игр, результаты матчей и турнирная таблица ФК "Александрия"
            </p>
          </div>
        </section>
        
        {/* Matches Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="upcoming" className="text-lg px-6 py-3">Предстоящие матчи</TabsTrigger>
                  <TabsTrigger value="completed" className="text-lg px-6 py-3">Прошедшие матчи</TabsTrigger>
                  <TabsTrigger value="standings" className="text-lg px-6 py-3">Турнирная таблица</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Upcoming Matches Tab */}
              <TabsContent value="upcoming">
                {upcomingLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingMatches && upcomingMatches.length > 0 ? (
                      upcomingMatches.map((match) => (
                        <div key={match.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
                          <div className="bg-primary text-white p-3 text-center font-roboto-condensed">
                            <div className="text-lg">{match.date} • {match.time} • {match.competition}</div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col items-center w-5/12">
                                <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                                  <div className={`bg-primary rounded-full w-16 h-16 flex items-center justify-center`}>
                                    <span className="text-white font-oswald font-bold text-2xl">{match.homeTeamLogo || match.homeTeam.charAt(0)}</span>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-roboto-condensed font-bold">{match.homeTeam}</div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center w-2/12">
                                <div className="text-3xl font-oswald font-bold text-gray-400 mb-2">VS</div>
                                <div className="bg-secondary-blue text-white text-xs rounded-full px-3 py-1">{match.round || 'Матч'}</div>
                              </div>
                              
                              <div className="flex flex-col items-center w-5/12">
                                <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                                  <div className={`bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center`}>
                                    <span className="text-white font-oswald font-bold text-2xl">{match.awayTeamLogo || match.awayTeam.charAt(0)}</span>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-roboto-condensed font-bold">{match.awayTeam}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-between">
                              <div className="text-center bg-white px-3 py-2 rounded-md shadow-sm flex-1 mr-2">
                                <div className="text-sm text-gray-500">Стадион</div>
                                <div className="font-medium">{match.stadium}</div>
                              </div>
                              <a href="#" className="bg-primary hover:bg-secondary-blue text-white text-center px-3 py-2 rounded-md shadow-sm transition-colors flex-1 ml-2">
                                <Ticket className="inline-block mr-2 h-4 w-4" /> Билеты
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Предстоящих матчей нет</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Completed Matches Tab */}
              <TabsContent value="completed">
                {completedLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedMatches && completedMatches.length > 0 ? (
                      completedMatches.map((match) => (
                        <div key={match.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                          <div className="bg-primary text-white p-3 text-center font-roboto-condensed">
                            <div className="text-lg">{match.date} • {match.competition}</div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col items-center w-5/12">
                                <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                                  <div className={`bg-primary rounded-full w-16 h-16 flex items-center justify-center`}>
                                    <span className="text-white font-oswald font-bold text-2xl">{match.homeTeamLogo || match.homeTeam.charAt(0)}</span>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-roboto-condensed font-bold">{match.homeTeam}</div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center w-2/12">
                                <div className="text-3xl font-oswald font-bold mb-2">
                                  {match.homeScore} : {match.awayScore}
                                </div>
                                <div className="bg-secondary-blue text-white text-xs rounded-full px-3 py-1">{match.round || 'Матч'}</div>
                              </div>
                              
                              <div className="flex flex-col items-center w-5/12">
                                <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                                  <div className={`bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center`}>
                                    <span className="text-white font-oswald font-bold text-2xl">{match.awayTeamLogo || match.awayTeam.charAt(0)}</span>
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="font-roboto-condensed font-bold">{match.awayTeam}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-center p-2 bg-gray-50 rounded-md">
                              <div className="text-sm">
                                <MapPin className="inline-block mr-1 h-4 w-4" />
                                <span className="text-gray-500">Стадион:</span> {match.stadium}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Прошедших матчей нет</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              {/* Standings Tab */}
              <TabsContent value="standings">
                {standingsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="bg-primary text-white p-3">
                      <h3 className="font-roboto-condensed text-xl">Турнирная таблица</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr className="text-gray-600">
                            <th className="p-3 text-left font-roboto">#</th>
                            <th className="p-3 text-left font-roboto">Команда</th>
                            <th className="p-3 text-center font-roboto">И</th>
                            <th className="p-3 text-center font-roboto">В</th>
                            <th className="p-3 text-center font-roboto">Н</th>
                            <th className="p-3 text-center font-roboto">П</th>
                            <th className="p-3 text-center font-roboto">Г</th>
                            <th className="p-3 text-center font-roboto">О</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standings && standings.length > 0 ? (
                            standings.map((team) => (
                              <tr 
                                key={team.id} 
                                className={`border-b border-gray-200 ${team.team === 'Александрия' ? 'bg-primary/5' : 'bg-white'}`}
                              >
                                <td className="p-3 font-medium">{team.position}</td>
                                <td className="p-3 font-medium">{team.team}</td>
                                <td className="p-3 text-center">{team.played}</td>
                                <td className="p-3 text-center">{team.won}</td>
                                <td className="p-3 text-center">{team.drawn}</td>
                                <td className="p-3 text-center">{team.lost}</td>
                                <td className="p-3 text-center">{team.goalsFor}-{team.goalsAgainst}</td>
                                <td className="p-3 text-center font-bold">{team.points}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="p-6 text-center text-gray-500">
                                Данные турнирной таблицы отсутствуют
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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

export default MatchesPage;
