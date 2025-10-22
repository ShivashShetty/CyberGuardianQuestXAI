const API_BASE_URL = 'http://localhost:5000/api';

interface Player {
  id: string;
  playerName: string;
  totalXP: number;
  level: number;
  gameStats: {
    highScore: number;
    gamesPlayed: number;
    totalScore: number;
  };
}

interface GameSession {
  playerId: string;
  playerName: string;
  score: number;
  level: number;
  wave: number;
  xpEarned: number;
  stats: any;
}

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  level: number;
}

export class ApiService {
  static async createPlayer(playerName: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create player');
    }
    
    const data = await response.json();
    return data.player;
  }

  static async getPlayer(playerId: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${playerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch player');
    }
    
    const data = await response.json();
    return data.player;
  }

  static async recordGameSession(sessionData: GameSession): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/games/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start game session');
    }
    
    const data = await response.json();
    return data.session;
  }

  static async completeGameSession(sessionId: string, completionData: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/games/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to complete game session');
    }
    
    return response.json();
  }

  static async getLeaderboard(gameType: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard/${gameType}?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    
    const data = await response.json();
    return data.leaderboard;
  }
}