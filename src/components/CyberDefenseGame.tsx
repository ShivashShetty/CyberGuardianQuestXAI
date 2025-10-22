import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap, AlertTriangle, Trophy, Play, Pause, RotateCcw, Coins, Target, Flame, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GameService } from '@/services/gameService';
import { updatePlayerStats } from '@/services/playerService';

// Interfaces
interface GameState {
  score: number;
  level: number;
  health: number;
  maxHealth: number;
  threats: Threat[];
  defenses: Defense[];
  powerUps: PowerUp[];
  gameRunning: boolean;
  gameOver: boolean;
  wave: number;
  nextWaveIn: number;
  money: number;
  threatsKilled: number;
  accuracy: number;
  comboMultiplier: number;
  lastKillTime: number;
}
interface Threat {
  id: string;
  type: 'virus' | 'phishing' | 'malware' | 'ddos' | 'ransomware' | 'trojan';
  x: number;
  y: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;
  size: number;
  direction: number;
  reward: number;
  stunned: number;
}
// MODIFIED: Added createdAt to track tower lifespan
interface Defense {
  id: string;
  type: 'firewall' | 'antivirus' | 'encryption' | 'backup' | 'scanner' | 'honeypot';
  x: number;
  y: number;
  range: number;
  damage: number;
  cooldown: number;
  maxCooldown: number;
  color: string;
  size: number;
  level: number;
  kills: number;
  specialEffect?: string;
  createdAt: number; // Timestamp for when the tower was created
}
interface PowerUp {
  id: string;
  type: 'shield' | 'speed' | 'damage' | 'health';
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 500;
const GAME_SPEED = 60; // FPS
const TOWER_LIFESPAN = 25000; // 25 seconds in milliseconds

interface Props {
  onGameComplete?: (score: number, level: number, wave: number) => void;
  playerName?: string;
}

export const CyberDefenseGame: React.FC<Props> = ({ onGameComplete, playerName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    health: 100,
    maxHealth: 100,
    threats: [],
    defenses: [],
    powerUps: [],
    gameRunning: false,
    gameOver: false,
    wave: 1,
    nextWaveIn: 0,
    money: 100,
    threatsKilled: 0,
    accuracy: 100,
    comboMultiplier: 1,
    lastKillTime: 0,
  });
  
  const [highScore, setHighScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedDefense, setSelectedDefense] = useState<'firewall' | 'antivirus' | 'encryption' | 'backup' | 'scanner' | 'honeypot'>('firewall');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [hasStarted, setHasStarted] = useState(false);
  // NEW: State for the oldest tower's lifespan timer
  const [oldestTowerTimeLeft, setOldestTowerTimeLeft] = useState(TOWER_LIFESPAN);
  // NEW: State for game session ID
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const storedHighScore = Number(localStorage.getItem("cyberGameHighScore") || 0);
    setHighScore(storedHighScore);
  }, []);

  const threatTypes = {
    virus: { color: '#ff4444', size: 20, speed: 2, health: 30, damage: 15, reward: 25 },
    phishing: { color: '#ff8800', size: 25, speed: 1.5, health: 20, damage: 10, reward: 20 },
    malware: { color: '#aa44ff', size: 30, speed: 1, health: 50, damage: 25, reward: 40 },
    ddos: { color: '#4444ff', size: 35, speed: 3, health: 40, damage: 20, reward: 35 },
    ransomware: { color: '#ff0080', size: 40, speed: 0.8, health: 80, damage: 35, reward: 60 },
    trojan: { color: '#008080', size: 15, speed: 4, health: 15, damage: 8, reward: 15 },
  };

  const defenseTypes = {
    firewall: { color: '#00ff00', size: 40, range: 80, damage: 25, cooldown: 30, cost: 50, description: "Basic perimeter defense" },
    antivirus: { color: '#00ffff', size: 35, range: 60, damage: 35, cooldown: 45, cost: 75, description: "High damage scanner" },
    encryption: { color: '#ffff00', size: 30, range: 100, damage: 20, cooldown: 20, cost: 100, description: "Long range protector" },
    backup: { color: '#ff00ff', size: 25, range: 50, damage: 15, cooldown: 15, cost: 30, description: "Fast attack speed" },
    scanner: { color: '#ff6600', size: 32, range: 70, damage: 30, cooldown: 35, cost: 90, description: "Area effect damage" },
    honeypot: { color: '#9966ff', size: 28, range: 90, damage: 40, cooldown: 60, cost: 120, description: "Traps and slows enemies" },
  };

  // MODIFIED: spawnThreat now accepts the current wave to increase speed
  const spawnThreat = useCallback((wave: number) => {
    const types = Object.keys(threatTypes) as (keyof typeof threatTypes)[];
    const type = types[Math.floor(Math.random() * types.length)];
    const config = threatTypes[type];
    
    // NEW: Threat speed increases based on the wave number
    const speedMultiplier = 1 + (wave - 1) * 0.05; // 5% speed increase per wave
    
    const threat: Threat = {
      id: Date.now().toString() + Math.random(),
      type,
      x: Math.random() * CANVAS_WIDTH,
      y: -config.size,
      speed: (config.speed + Math.random() * 0.5) * speedMultiplier,
      health: config.health,
      maxHealth: config.health,
      damage: config.damage,
      color: config.color,
      size: config.size,
      direction: Math.random() * 0.5 - 0.25,
      reward: config.reward,
      stunned: 0,
    };
    
    return threat;
  }, []);

  // MODIFIED: spawnWave now passes the wave number to spawnThreat
  const spawnWave = useCallback((waveNumber: number) => {
    const threatCount = Math.min(3 + waveNumber * 2, 15);
    
    for (let i = 0; i < threatCount; i++) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          threats: [...prev.threats, spawnThreat(waveNumber)],
        }));
      }, i * 500);
    }
  }, [spawnThreat]);

  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning || prev.gameOver) return prev;

      const newState = { ...prev };
      const now = Date.now();
      
      newState.threats = prev.threats.map(threat => ({
        ...threat,
        y: threat.stunned > 0 ? threat.y : threat.y + threat.speed,
        x: threat.stunned > 0 ? threat.x : threat.x + threat.direction,
        stunned: Math.max(0, threat.stunned - 1),
      })).filter(threat => {
        if (threat.y > CANVAS_HEIGHT) {
          newState.health -= threat.damage;
          newState.accuracy = Math.max(0, newState.accuracy - 5);
          if (newState.health <= 0) {
            newState.gameOver = true;
            newState.gameRunning = false;
            setHasStarted(false);
            setGamesPlayed(p => p + 1);
            setTotalScore(p => p + newState.score);
            if (newState.score > highScore) {
              setHighScore(newState.score);
              localStorage.setItem("cyberGameHighScore", newState.score.toString());
              // Show toast for new high score in effect
            }
            

            // Send game completion data to backend
            if (sessionId && playerName) {
              GameService.completeGameSession(sessionId, {
                score: newState.score,
                level: newState.level,
                wave: newState.wave,
                xpEarned: Math.floor(newState.score / 10) + (newState.level * 50) + (newState.wave * 25),
                stats: {
                  threatsKilled: newState.threatsKilled,
                  accuracy: newState.accuracy,
                  moneyEarned: newState.money,
                  defensesPlaced: newState.defenses.length
                }
              }).catch(error => {
                console.error("Failed to send game completion data:", error);
              });

              // Update player stats in MongoDB for scoreboard using stored playerId
              const playerId = localStorage.getItem('playerId');
              if (playerId) {
                updatePlayerStats(
                  playerId,
                  newState.score,
                  Math.floor(newState.score / 10) + (newState.level * 50) + (newState.wave * 25)
                ).catch(error => {
                  console.error("Failed to update player stats for scoreboard:", error);
                });
              }
            }
            
            // Show game over toast in effect
            if (onGameComplete) onGameComplete(newState.score, newState.level, newState.wave);
          }
          return false;
        }
        return threat.health > 0;
      });

      // NEW: Filter out towers whose lifespan has expired
      newState.defenses = prev.defenses.filter(defense => {
          return now - defense.createdAt < TOWER_LIFESPAN;
      });

      // NEW: Update the timer for the oldest tower
      if (newState.defenses.length > 0) {
          const oldestTower = newState.defenses[0];
          const timeRemaining = TOWER_LIFESPAN - (now - oldestTower.createdAt);
          setOldestTowerTimeLeft(timeRemaining);
      } else {
          setOldestTowerTimeLeft(TOWER_LIFESPAN);
      }

      newState.defenses = newState.defenses.map(defense => ({
        ...defense,
        cooldown: Math.max(0, defense.cooldown - 1),
      }));

      newState.defenses.forEach(defense => {
        if (defense.cooldown === 0) {
          const nearbyThreats = newState.threats.filter(threat => Math.sqrt(Math.pow(threat.x - defense.x, 2) + Math.pow(threat.y - defense.y, 2)) <= defense.range);
          if (nearbyThreats.length > 0) {
            nearbyThreats.forEach(target => {
              // --- LOGIC RESTORED ---
              const actualDamage = defense.damage;
              target.health -= actualDamage;

              if (defense.type === 'honeypot') {
                target.stunned = 30;
              } else if (defense.type === 'scanner' && nearbyThreats.length > 1) {
                nearbyThreats.slice(1, 3).forEach(secondary => {
                  secondary.health -= Math.floor(actualDamage * 0.3);
                });
              }

              defense.cooldown = defense.maxCooldown;

              setParticles(p => [...p, {
                x: defense.x, y: defense.y, vx: (target.x - defense.x) * 0.1, vy: (target.y - defense.y) * 0.1, life: 30, color: defense.color, size: 5,
              }]);

              if (target.health <= 0) {
                const currentTime = Date.now();
                const timeSinceLastKill = currentTime - newState.lastKillTime;
                if (timeSinceLastKill < 2000) {
                  newState.comboMultiplier = Math.min(5, newState.comboMultiplier + 0.5);
                } else {
                  newState.comboMultiplier = 1;
                }

                const baseReward = target.reward * newState.level;
                const comboReward = Math.floor(baseReward * newState.comboMultiplier);

                newState.score += comboReward;
                newState.money += target.reward;
                newState.threatsKilled++;
                newState.lastKillTime = currentTime;
                newState.accuracy = Math.min(100, newState.accuracy + 1);
                defense.kills = (defense.kills || 0) + 1;

                if (defense.kills % 10 === 0) {
                  defense.level = (defense.level || 1) + 1;
                  defense.damage += 5;
                  defense.range += 10;
                }

                for (let i = 0; i < 12; i++) {
                  setParticles(p => [...p, {
                    x: target.x, y: target.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 25, color: newState.comboMultiplier > 1 ? '#ffaa00' : '#ffff00', size: newState.comboMultiplier > 1 ? 5 : 3,
                  }]);
                }

                // Show combo toast in effect
              }
              // --- END OF RESTORED LOGIC ---
            });
          }
        }
      });

      if (newState.threats.length === 0 && newState.nextWaveIn <= 0) {
        newState.wave++;
        newState.nextWaveIn = 180;
        spawnWave(newState.wave);
        if (newState.wave % 3 === 0) {
            newState.level++;
            newState.health = Math.min(newState.maxHealth, newState.health + 30);
            newState.money += 50;
            newState.maxHealth += 20;
            toast({
              title: `Level ${newState.level}! 🎉`,
              description: `Wave ${newState.wave} completed!`,
            });
        }
      } else if (newState.nextWaveIn > 0) {
        newState.nextWaveIn--;
      }

      return newState;
    });

    setParticles(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 })).filter(p => p.life > 0));

  }, [spawnWave, toast, highScore, onGameComplete, sessionId, playerName]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;

    if (deltaTime >= 1000 / GAME_SPEED) {
        updateGame();
        lastTimeRef.current = timestamp;
    }
    
    if (gameState.gameRunning && !gameState.gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateGame, gameState.gameRunning, gameState.gameOver]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
    }

    gameState.defenses.forEach(defense => {
        ctx.strokeStyle = defense.color + '40';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(defense.x, defense.y, defense.range, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = defense.color;
        ctx.fillRect(defense.x - defense.size / 2, defense.y - defense.size / 2, defense.size, defense.size);

        const lifespanPercent = Math.max(0, (TOWER_LIFESPAN - (Date.now() - defense.createdAt)) / TOWER_LIFESPAN);
        ctx.fillStyle = '#555';
        ctx.fillRect(defense.x - defense.size / 2, defense.y + defense.size / 2 + 5, defense.size, 4);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(defense.x - defense.size / 2, defense.y + defense.size / 2 + 5, defense.size * lifespanPercent, 4);
    });

    gameState.threats.forEach(threat => {
      if (threat.stunned > 0) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(threat.x, threat.y, threat.size / 2 + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = threat.color;
      ctx.beginPath();
      ctx.arc(threat.x, threat.y, threat.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(threat.type.charAt(0).toUpperCase(), threat.x, threat.y + 3);

      const healthPercentage = threat.health / threat.maxHealth;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(threat.x - threat.size / 2, threat.y - threat.size / 2 - 12, threat.size, 4);
      ctx.fillStyle = healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(threat.x - threat.size / 2, threat.y - threat.size / 2 - 12, threat.size * healthPercentage, 4);
    });

    particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.life / 30;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (gameState.gameRunning && !gameState.gameOver) {
      const config = defenseTypes[selectedDefense];
      ctx.strokeStyle = config.color + '80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, config.range, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = config.color + '80';
      ctx.fillRect(mousePos.x - config.size / 2, mousePos.y - config.size / 2, config.size, config.size);
    }

    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#ff0000';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      ctx.fillText(`Wave: ${gameState.wave}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    }

  }, [gameState, particles, selectedDefense, mousePos, defenseTypes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
    draw();
  }, [draw]);

  useEffect(() => {
    if (gameState.gameRunning && !gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameRunning, gameState.gameOver, gameLoop]);

  const startGame = async () => {
    setHasStarted(true);
    
    // Create game session in backend
    if (playerName) {
      try {
        const session = await GameService.recordGameSession({
          playerId: 'temp-player-id', // This would be replaced with actual player ID
          playerName: playerName,
          score: 0,
          level: 1,
          wave: 1,
          xpEarned: 0,
          stats: {
            threatsKilled: 0,
            accuracy: 100,
            moneyEarned: 0,
            defensesPlaced: 0
          }
        });
        setSessionId(session.id);
      } catch (error) {
        console.error("Failed to create game session:", error);
        toast({
          title: "Warning",
          description: "Could not connect to server. Game data will not be saved.",
          variant: "destructive"
        });
      }
    }
    
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      health: 100,
      maxHealth: 100,
      threats: [],
      defenses: [],
      gameRunning: true,
      gameOver: false,
      wave: 1,
      nextWaveIn: 60,
      money: 100,
    }));
    setParticles([]);
    spawnWave(1);
  // Show game start toast in effect
// Toast side effects
useEffect(() => {
  if (gameState.gameRunning && !gameState.gameOver && hasStarted) {
    toast({
      title: "System Defense Activated! 🚀",
      description: "Protect your network from cyber threats!",
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [hasStarted]);

useEffect(() => {
  if (gameState.gameOver && hasStarted === false) {
    toast({ title: "System Breached! 💀", description: `Final Score: ${gameState.score}`, variant: "destructive" });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState.gameOver, hasStarted]);

const prevHighScore = useRef(highScore);
useEffect(() => {
  if (gameState.score > prevHighScore.current) {
    toast({ title: "🏆 New High Score!", description: `You've set a new record: ${gameState.score}` });
    prevHighScore.current = gameState.score;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState.score]);

const prevCombo = useRef(1);
useEffect(() => {
  if (gameState.comboMultiplier > 2 && gameState.comboMultiplier !== prevCombo.current) {
    toast({
      title: `${gameState.comboMultiplier.toFixed(1)}x COMBO! 🔥`,
      description: `+${Math.floor(gameState.comboMultiplier)} points`,
    });
    prevCombo.current = gameState.comboMultiplier;
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState.comboMultiplier]);
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, gameRunning: !prev.gameRunning }));
  };

  const resetGame = () => {
    setHasStarted(false);
    setGameState({
      score: 0,
      level: 1,
      health: 100,
      maxHealth: 100,
      threats: [],
      defenses: [],
      powerUps: [],
      gameRunning: false,
      gameOver: false,
      wave: 1,
      nextWaveIn: 0,
      money: 100,
      threatsKilled: 0,
      accuracy: 100,
      comboMultiplier: 1,
      lastKillTime: 0,
    });
    setParticles([]);
    setSessionId(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameState.gameRunning || gameState.gameOver) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tooClose = gameState.defenses.some(d => Math.sqrt(Math.pow(d.x - x, 2) + Math.pow(d.y - y, 2)) < 50);
    const canAfford = gameState.money >= defenseTypes[selectedDefense].cost;

    if (!tooClose && canAfford) {
      const newDefense: Defense = {
        id: Date.now().toString(),
        type: selectedDefense,
        x, y,
        range: defenseTypes[selectedDefense].range,
        damage: defenseTypes[selectedDefense].damage,
        cooldown: 0,
        maxCooldown: defenseTypes[selectedDefense].cooldown,
        color: defenseTypes[selectedDefense].color,
        size: defenseTypes[selectedDefense].size,
        level: 1,
        kills: 0,
        createdAt: Date.now(),
      };
      setGameState(prev => ({
        ...prev,
        defenses: [...prev.defenses, newDefense],
        money: prev.money - defenseTypes[selectedDefense].cost,
      }));
      toast({ title: `${selectedDefense.charAt(0).toUpperCase() + selectedDefense.slice(1)} Deployed! 🛡️` });
    } else if (!canAfford) {
      toast({ title: "Insufficient Funds 💰", variant: "destructive" });
    } else {
      toast({ title: "Invalid Position ❌", variant: "destructive" });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Cyber Defense Game
          </CardTitle>
        </div>
        {gameState.defenses.length > 0 && (
            <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> Oldest Tower Lifespan</span>
                    <span>{Math.ceil(oldestTowerTimeLeft / 1000)}s</span>
                </div>
                <Progress value={(oldestTowerTimeLeft / TOWER_LIFESPAN) * 100} className="h-1" />
            </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        
        <div className="border border-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{gameState.score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500 flex items-center justify-center gap-1">
                <Coins className="h-4 w-4" />
                {gameState.money}
              </div>
              <div className="text-sm text-muted-foreground">Money</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{gameState.health}</div>
              <div className="text-sm text-muted-foreground">Health</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{gameState.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">{gameState.wave}</div>
              <div className="text-sm text-muted-foreground">Wave</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
                <Target className="h-4 w-4" />
                {gameState.accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-muted/50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-500">{gameState.threatsKilled}</div>
              <div className="text-xs text-muted-foreground">Threats Eliminated</div>
            </div>
            <div className="text-center bg-muted/50 rounded-lg p-3">
              <div className="text-lg font-bold text-red-500 flex items-center justify-center gap-1">
                {gameState.comboMultiplier > 1 && <Flame className="h-4 w-4" />}
                {gameState.comboMultiplier.toFixed(1)}x
              </div>
              <div className="text-xs text-muted-foreground">Combo Multiplier</div>
            </div>
            <div className="text-center bg-muted/50 rounded-lg p-3">
              <div className="text-lg font-bold text-cyan-500">{gameState.defenses.length}</div>
              <div className="text-xs text-muted-foreground">Active Defenses</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Health</span>
              <span>{gameState.health}/{gameState.maxHealth}</span>
            </div>
            <Progress value={(gameState.health / gameState.maxHealth) * 100} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Select Defense Tool:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(defenseTypes).map(([type, config]) => {
              const canAfford = gameState.money >= config.cost;
              return (
                <Button
                  key={type}
                  variant={selectedDefense === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDefense(type as keyof typeof defenseTypes)}
                  className={`flex flex-col h-auto p-3 relative ${!canAfford ? 'opacity-50' : ''}`}
                  disabled={!canAfford && gameState.gameRunning}
                >
                  <div className="font-medium capitalize">{type}</div>
                  <div className="text-xs text-muted-foreground">
                    💰 {config.cost} | ⚔️ {config.damage} | 📡 {config.range}
                  </div>
                  <div className="text-xs text-muted-foreground italic">
                    {config.description}
                  </div>
                  {!canAfford && gameState.gameRunning && (
                    <div className="absolute top-1 right-1 text-red-500 text-xs">💸</div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="relative border border-border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="cursor-crosshair"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {!hasStarted && !gameState.gameOver ? (
            <Button onClick={startGame} className="bg-gradient-cyber hover:shadow-cyber">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          ) : (
            !gameState.gameOver && (
              <Button onClick={togglePause} variant="outline">
                {gameState.gameRunning ? (
                  <><Pause className="h-4 w-4 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Resume</>
                )}
              </Button>
            )
          )}
          
          {(hasStarted || gameState.gameOver) && (
             <Button onClick={resetGame} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
             </Button>
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>🎮 Click to place defenses • 🛡️ Protect your network from cyber threats</p>
          <p>💡 Towers have a 25-second lifespan! Place them strategically.</p>
        </div>
      </CardContent>
    </Card>
  );
};
