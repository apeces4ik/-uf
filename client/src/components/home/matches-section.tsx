import { useQuery } from '@tanstack/react-query';
import { Match, Team, Standings } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function MatchesSection() {
  const { data: upcomingMatches, isLoading: isLoadingMatches } = useQuery<Match[]>({
    queryKey: ['/api/matches/upcoming', 3],
    queryFn: async () => {
      const response = await fetch('/api/matches/upcoming?limit=3');
      if (!response.ok) throw new Error('Не удалось загрузить данные матчей');
      return response.json();
    }
  });

  const { data: teams, isLoading: isLoadingTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Не удалось загрузить данные команд');
      return response.json();
    }
  });

  const { data: standings, isLoading: isLoadingStandings } = useQuery<Standings[]>({
    queryKey: ['/api/standings'],
    queryFn: async () => {
      const response = await fetch('/api/standings');
      if (!response.ok) throw new Error('Не удалось загрузить турнирную таблицу');
      return response.json();
    }
  });

  const getTeamById = (id: number) => {
    return teams?.find(team => team.id === id);
  };

  const formatMatchDate = (date: string) => {
    const matchDate = new Date(date);
    
    if (isToday(matchDate)) {
      return `Сегодня • ${format(matchDate, 'HH:mm', { locale: ru })}`;
    } else if (isTomorrow(matchDate)) {
      return `Завтра • ${format(matchDate, 'HH:mm', { locale: ru })}`;
    } else {
      return `${format(matchDate, 'd MMMM • HH:mm', { locale: ru })}`;
    }
  };

  const isLoading = isLoadingMatches || isLoadingTeams || isLoadingStandings;

  return (
    <section id="matches" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-roboto-condensed text-3xl font-bold text-primary-blue">Ближайшие матчи</h2>
          <Button variant="link" className="text-secondary-blue">
            Календарь игр <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches?.map(match => {
                const homeTeam = match.isHome 
                  ? teams?.find(t => t.name === "Александрия")
                  : getTeamById(match.opponentId);
                
                const awayTeam = match.isHome 
                  ? getTeamById(match.opponentId)
                  : teams?.find(t => t.name === "Александрия");
                
                return (
                  <Card key={match.id} className="bg-gray-50 overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
                    <div className="bg-primary-blue text-white p-3 text-center font-roboto-condensed">
                      <div className="text-lg">{formatMatchDate(match.date)} • {match.competitionType}</div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center w-5/12">
                          <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                            <div className={`${homeTeam?.name === "Александрия" ? "bg-primary-blue" : "bg-gray-700"} rounded-full w-16 h-16 flex items-center justify-center`}>
                              <span className="text-white font-oswald font-bold text-2xl">
                                {homeTeam?.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-roboto-condensed font-bold">{homeTeam?.name || "Неизвестно"}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center w-2/12">
                          <div className="text-3xl font-oswald font-bold text-gray-400 mb-2">VS</div>
                          <div className="bg-secondary-blue text-white text-xs rounded-full px-3 py-1">{match.competitionRound || "Матч"}</div>
                        </div>
                        
                        <div className="flex flex-col items-center w-5/12">
                          <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                            <div className={`${awayTeam?.name === "Александрия" ? "bg-primary-blue" : "bg-gray-700"} rounded-full w-16 h-16 flex items-center justify-center`}>
                              <span className="text-white font-oswald font-bold text-2xl">
                                {awayTeam?.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-roboto-condensed font-bold">{awayTeam?.name || "Неизвестно"}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <div className="text-center bg-white px-3 py-2 rounded-md shadow-sm flex-1 mr-2">
                          <div className="text-sm text-gray-500">Стадион</div>
                          <div className="font-medium">{match.stadium}</div>
                        </div>
                        <Button className="flex-1 ml-2">
                          <Ticket className="mr-2 h-4 w-4" /> Билеты
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Tournament Table Mini */}
            <div className="mt-12 bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="bg-primary-blue text-white p-3 flex justify-between items-center">
                <h3 className="font-roboto-condensed text-xl">Турнирная таблица</h3>
                <Button variant="link" className="text-white text-sm p-0">Полная таблица</Button>
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
                    {standings?.slice(0, 5).map((team) => {
                      const teamData = getTeamById(team.teamId);
                      const goalDiff = `${team.goalsFor}-${team.goalsAgainst}`;
                      const isAlexandria = teamData?.name === "Александрия";
                      
                      return (
                        <tr key={team.id} className={`border-b border-gray-200 ${isAlexandria ? 'bg-primary-blue/5' : 'bg-white'}`}>
                          <td className="p-3 font-medium">{team.position}</td>
                          <td className="p-3 font-medium">{teamData?.name || "Неизвестно"}</td>
                          <td className="p-3 text-center">{team.played}</td>
                          <td className="p-3 text-center">{team.won}</td>
                          <td className="p-3 text-center">{team.drawn}</td>
                          <td className="p-3 text-center">{team.lost}</td>
                          <td className="p-3 text-center">{goalDiff}</td>
                          <td className="p-3 text-center font-bold">{team.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
