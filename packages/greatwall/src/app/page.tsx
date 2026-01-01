'use client';

import { useState } from 'react';

const missions = [
  { id: 1, name: 'Street Race', reward: '$5,000', difficulty: 'Easy', status: 'available' },
  { id: 2, name: 'Bank Heist', reward: '$50,000', difficulty: 'Hard', status: 'locked' },
  { id: 3, name: 'Drug Deal', reward: '$15,000', difficulty: 'Medium', status: 'available' },
  { id: 4, name: 'Assassination', reward: '$25,000', difficulty: 'Hard', status: 'locked' },
  { id: 5, name: 'Car Theft', reward: '$8,000', difficulty: 'Easy', status: 'available' },
];

export default function MissionTracker() {
  const [selectedMission, setSelectedMission] = useState(missions[0]);
  const [stats] = useState({
    cash: 12500,
    respect: 45,
    wanted: 2,
    health: 85,
  });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      {/* Dark city background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900/30" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Main HUD Container */}
      <div className="relative z-10 h-full p-4 md:p-6 flex flex-col gap-4">
        
        {/* Top Stats Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-black/60 backdrop-blur-sm border border-yellow-500/30 p-4 rounded">
          <div className="flex gap-6">
            <div>
              <div className="text-yellow-500 text-xs uppercase tracking-wider">Cash</div>
              <div className="text-2xl font-bold text-green-400">${stats.cash.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-yellow-500 text-xs uppercase tracking-wider">Respect</div>
              <div className="text-2xl font-bold">{stats.respect}%</div>
            </div>
            <div>
              <div className="text-yellow-500 text-xs uppercase tracking-wider">Wanted</div>
              <div className="text-2xl font-bold text-red-500">{'★'.repeat(stats.wanted)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-yellow-500 text-xs uppercase tracking-wider">Health</div>
            <div className="w-32 h-4 bg-gray-800 border border-yellow-500/30 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                style={{ width: `${stats.health}%` }}
              />
            </div>
            <div className="text-sm font-bold">{stats.health}%</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          
          {/* Mission List */}
          <div className="bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded p-4 overflow-y-auto">
            <h2 className="text-yellow-500 text-xl font-bold mb-4 uppercase tracking-wider">Available Missions</h2>
            <div className="space-y-2">
              {missions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => mission.status === 'available' && setSelectedMission(mission)}
                  disabled={mission.status === 'locked'}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    selectedMission.id === mission.id
                      ? 'bg-yellow-500/20 border-yellow-500'
                      : mission.status === 'locked'
                      ? 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
                      : 'bg-gray-900/50 border-gray-700 hover:border-yellow-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{mission.name}</div>
                      <div className="text-sm text-gray-400">{mission.difficulty}</div>
                    </div>
                    <div className="text-green-400 font-bold">{mission.reward}</div>
                  </div>
                  {mission.status === 'locked' && (
                    <div className="text-xs text-red-400 mt-1">🔒 LOCKED</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded p-4 flex flex-col">
            <h2 className="text-yellow-500 text-xl font-bold mb-4 uppercase tracking-wider">Mission Details</h2>
            
            {/* Mission Info */}
            <div className="mb-4 p-4 bg-gray-900/50 border border-yellow-500/20 rounded">
              <h3 className="text-2xl font-bold mb-2">{selectedMission.name}</h3>
              <div className="flex gap-4 text-sm mb-3">
                <span className="text-gray-400">Difficulty: <span className={
                  selectedMission.difficulty === 'Easy' ? 'text-green-400' :
                  selectedMission.difficulty === 'Medium' ? 'text-yellow-400' :
                  'text-red-400'
                }>{selectedMission.difficulty}</span></span>
                <span className="text-gray-400">Reward: <span className="text-green-400 font-bold">{selectedMission.reward}</span></span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {selectedMission.name === 'Street Race' && 'Race through downtown. First place wins the cash. Watch out for cops.'}
                {selectedMission.name === 'Drug Deal' && 'Meet the contact at the docks. Deliver the package without getting caught.'}
                {selectedMission.name === 'Car Theft' && 'Steal the luxury car from the parking garage. Deliver it to the chop shop.'}
              </p>
              <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded uppercase tracking-wider transition-colors">
                Start Mission
              </button>
            </div>

            {/* Mini Map */}
            <div className="flex-1 bg-gray-900/80 border border-yellow-500/20 rounded relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Simple city grid map */}
                <div className="w-full h-full p-4">
                  <div className="w-full h-full border-2 border-yellow-500/30 rounded relative">
                    {/* Streets */}
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-600" />
                    <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-600" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-600" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-gray-600" />
                    
                    {/* Mission marker */}
                    <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                    
                    {/* Player marker */}
                    <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-blue-500 rounded-full" />
                    
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      🟡 Mission | 🔵 You
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

