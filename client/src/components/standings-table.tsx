import React from 'react';
import { Standing } from '@shared/schema';

interface StandingsTableProps {
  standings?: Standing[];
  limit?: number;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, limit = 5 }) => {
  // Filter and sort standings to display top 'limit' teams
  const displayedStandings = standings
    ? [...standings].sort((a, b) => a.position - b.position).slice(0, limit)
    : [];

  return (
    <div className="mt-12 bg-gray-50 rounded-lg overflow-hidden shadow-md">
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <h3 className="font-roboto-condensed text-xl">Турнирная таблица</h3>
        <a href="/matches" className="text-white text-sm hover:underline">Полная таблица</a>
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
            {displayedStandings.length > 0 ? (
              displayedStandings.map((team) => (
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
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Данные турнирной таблицы отсутствуют
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
