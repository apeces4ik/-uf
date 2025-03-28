import React, { useState } from 'react';
import { Player, Coach } from '@shared/schema';

interface TeamShowcaseProps {
  players?: Player[];
  coaches?: Coach[];
  limit?: number;
}

const TeamShowcase: React.FC<TeamShowcaseProps> = ({ players, coaches, limit = 5 }) => {
  const [positionFilter, setPositionFilter] = useState('all');

  // Filter and limit players based on position
  const filteredPlayers = players
    ? players.filter(player => {
        if (positionFilter === 'all') return true;
        if (positionFilter === 'goalkeepers') return player.position === 'Вратарь';
        if (positionFilter === 'defenders') return player.position === 'Защитник';
        if (positionFilter === 'midfielders') return player.position === 'Полузащитник';
        if (positionFilter === 'forwards') return player.position === 'Нападающий';
        return true;
      }).slice(0, limit)
    : [];

  // Limited coaches list
  const limitedCoaches = coaches?.slice(0, 3) || [];

  return (
    <>
      {/* Position Filter */}
      <div className="flex overflow-x-auto py-2 mb-6 gap-2">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredPlayers.length > 0 ? (
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
          <div className="col-span-full text-center py-6">
            <p className="text-gray-500">Игроки не найдены</p>
          </div>
        )}
      </div>
      
      {/* Coaching Staff (Preview) */}
      <div className="mt-12">
        <h3 className="font-roboto-condensed text-2xl font-bold text-primary mb-6">Тренерский штаб</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {limitedCoaches.length > 0 ? (
            limitedCoaches.map((coach) => (
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
            <div className="col-span-full text-center py-6">
              <p className="text-gray-500">Тренерский штаб не найден</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamShowcase;
