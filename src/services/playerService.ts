import { API_BASE_URL } from './gameService';

export async function updatePlayerStats(playerId: string, score: number, xpEarned: number) {
  const response = await fetch(`${API_BASE_URL}/players/${playerId}/stats`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score, xpEarned }),
  });
  if (!response.ok) {
    throw new Error('Failed to update player stats');
  }
  return response.json();
}
