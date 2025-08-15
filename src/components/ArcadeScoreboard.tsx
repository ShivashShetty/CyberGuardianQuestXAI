import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreboardEntry {
  playerName: string;
  score: number;
  recordedAt?: string;
}

export const ArcadeScoreboard: React.FC = () => {
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/scoreboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScoreboard(data.scoreboard);
        } else {
          setError('Failed to load scoreboard');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load scoreboard');
        setLoading(false);
      });
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-3xl text-center bg-gradient-cyber bg-clip-text text-transparent">
          Arcade Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Player Name</th>
                  <th className="px-4 py-2 text-left">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {scoreboard.map((entry, idx) => (
                  <tr key={idx + entry.playerName + entry.score} className={idx === 0 ? 'bg-gradient-cyber/10 font-bold' : ''}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{entry.playerName}</td>
                    <td className="px-4 py-2">
                      <Badge className="bg-cyber-orange text-black text-lg px-4 py-1">
                        {entry.score}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
