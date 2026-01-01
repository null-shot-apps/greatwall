'use client';

import { useState, useEffect, useCallback } from 'react';

export default function GTAGame() {
  const [player, setPlayer] = useState({ x: 400, y: 300, rotation: 0, speed: 0 });
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [cash, setCash] = useState(0);
  const [health, setHealth] = useState(100);
  const [wanted, setWanted] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  const [missions] = useState([
    { id: 1, x: 200, y: 150, name: 'Street Race', reward: 5000, active: false },
    { id: 2, x: 600, y: 400, name: 'Package Pickup', reward: 2500, active: false },
    { id: 3, x: 300, y: 500, name: 'Car Theft', reward: 8000, active: false },
  ]);

  const [activeMission, setActiveMission] = useState<number | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        let newRotation = prev.rotation;
        let newSpeed = prev.speed;

        // Rotation
        if (keys['a'] || keys['arrowleft']) newRotation -= 5;
        if (keys['d'] || keys['arrowright']) newRotation += 5;

        // Speed
        if (keys['w'] || keys['arrowup']) {
          newSpeed = Math.min(newSpeed + 0.5, 8);
        } else if (keys['s'] || keys['arrowdown']) {
          newSpeed = Math.max(newSpeed - 0.5, -4);
        } else {
          newSpeed *= 0.95; // Friction
        }

        // Movement
        const rad = (newRotation * Math.PI) / 180;
        let newX = prev.x + Math.sin(rad) * newSpeed;
        let newY = prev.y - Math.cos(rad) * newSpeed;

        // Boundaries
        newX = Math.max(20, Math.min(780, newX));
        newY = Math.max(20, Math.min(580, newY));

        return { x: newX, y: newY, rotation: newRotation, speed: newSpeed };
      });

      // Check mission proximity
      missions.forEach(mission => {
        const dist = Math.sqrt(
          Math.pow(player.x - mission.x, 2) + Math.pow(player.y - mission.y, 2)
        );
        if (dist < 40 && activeMission === null) {
          setActiveMission(mission.id);
        }
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, keys, player.x, player.y, missions, activeMission]);

  const completeMission = useCallback(() => {
    if (activeMission) {
      const mission = missions.find(m => m.id === activeMission);
      if (mission) {
        setCash(prev => prev + mission.reward);
        setActiveMission(null);
      }
    }
  }, [activeMission, missions]);

  if (!gameStarted) {
    return (
      <div className="h-[100dvh] w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-500 mb-4 uppercase tracking-wider">
            Street Kings
          </h1>
          <p className="text-gray-400 mb-8">Use WASD or Arrow Keys to drive</p>
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xl rounded uppercase tracking-wider transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gray-800">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <div className="bg-black/80 backdrop-blur-sm border border-yellow-500/30 px-4 py-2 rounded">
          <div className="text-yellow-500 text-xs uppercase">Cash</div>
          <div className="text-2xl font-bold text-green-400">${cash.toLocaleString()}</div>
        </div>
        <div className="bg-black/80 backdrop-blur-sm border border-yellow-500/30 px-4 py-2 rounded">
          <div className="text-yellow-500 text-xs uppercase">Health</div>
          <div className="w-32 h-3 bg-gray-700 rounded overflow-hidden">
            <div className="h-full bg-red-500" style={{ width: `${health}%` }} />
          </div>
        </div>
        {wanted > 0 && (
          <div className="bg-black/80 backdrop-blur-sm border border-red-500/50 px-4 py-2 rounded">
            <div className="text-red-500 font-bold">{'★'.repeat(wanted)} WANTED</div>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-sm border border-yellow-500/30 px-4 py-2 rounded text-sm">
        <div className="text-yellow-500 uppercase text-xs mb-1">Controls</div>
        <div className="text-gray-300">WASD / Arrows - Drive</div>
        <div className="text-gray-300">E - Complete Mission</div>
      </div>

      {/* Mission notification */}
      {activeMission && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/90 backdrop-blur-sm border-2 border-yellow-500 px-8 py-6 rounded text-center">
          <div className="text-yellow-500 text-2xl font-bold mb-2">
            {missions.find(m => m.id === activeMission)?.name}
          </div>
          <div className="text-green-400 text-xl mb-4">
            Reward: ${missions.find(m => m.id === activeMission)?.reward.toLocaleString()}
          </div>
          <button
            onClick={completeMission}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded uppercase tracking-wider transition-colors"
          >
            Press E to Complete
          </button>
        </div>
      )}

      {/* Game world */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700">
        {/* City grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.3) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.3) 2px, transparent 2px)',
          backgroundSize: '100px 100px'
        }} />

        {/* Buildings */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gray-800 border-2 border-gray-900"
            style={{
              left: `${(i % 5) * 160 + 50}px`,
              top: `${Math.floor(i / 5) * 180 + 50}px`,
              width: '80px',
              height: '100px',
            }}
          />
        ))}

        {/* Mission markers */}
        {missions.map(mission => (
          <div
            key={mission.id}
            className="absolute"
            style={{
              left: `${mission.x - 20}px`,
              top: `${mission.y - 40}px`,
            }}
          >
            <div className="text-4xl animate-bounce">📍</div>
            <div className="text-xs text-yellow-500 font-bold text-center whitespace-nowrap">
              {mission.name}
            </div>
          </div>
        ))}

        {/* Player car */}
        <div
          className="absolute transition-transform"
          style={{
            left: `${player.x - 15}px`,
            top: `${player.y - 20}px`,
            transform: `rotate(${player.rotation}deg)`,
          }}
        >
          <div className="text-4xl">🚗</div>
        </div>
      </div>

      {/* Keyboard listener for E key */}
      {activeMission && (
        <div
          className="absolute inset-0 z-40"
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'e') {
              completeMission();
            }
          }}
          tabIndex={0}
        />
      )}
    </div>
  );
}


