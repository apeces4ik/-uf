import React from 'react';
import { Match } from '@shared/schema';

interface UpcomingMatchesProps {
  matches?: Match[];
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ matches }) => {
  // Use provided matches or show a message if none
  const upcomingMatches = matches || [];

  if (upcomingMatches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">Нет предстоящих матчей</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {upcomingMatches.map((match) => (
        <div key={match.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
          <div className="bg-primary text-white p-3 text-center font-roboto-condensed">
            <div className="text-lg">{match.date} • {match.time} • {match.competition}</div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center w-5/12">
                <div className="bg-white p-2 rounded-full shadow-sm mb-3">
                  <div className={`${match.homeTeam === 'Александрия' ? 'bg-primary' : 'bg-gray-700'} rounded-full w-16 h-16 flex items-center justify-center`}>
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
                  <div className={`${match.awayTeam === 'Александрия' ? 'bg-primary' : 'bg-gray-700'} rounded-full w-16 h-16 flex items-center justify-center`}>
                    <span className="text-white font-oswald font-bold text-2xl">{match.awayTeamLogo || match.awayTeam.charAt(0)}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-roboto-condensed font-bold">{match.awayTeam}</div>
                </div>
              </div>
            </div>
            
            {/* Updated Stadium Information Section */}
            <div className="mt-6 bg-white px-4 py-3 rounded-md shadow-sm text-center">
              <div className="text-sm text-gray-500">Стадион</div>
              <div className="font-medium text-lg">{match.stadium}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatches;