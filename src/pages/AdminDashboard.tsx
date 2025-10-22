import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScoreboardEntry {
  playerName: string;
  score: number;
  recordedAt?: string;
}


const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mongoStatus, setMongoStatus] = useState<'active' | 'inactive'>('inactive');
  const [aiStatus, setAiStatus] = useState<'active' | 'inactive'>('inactive');

  useEffect(() => {
    if (authenticated) {
      fetchScoreboard();
      checkBackendStatus();
    }
    // eslint-disable-next-line
  }, [authenticated]);

  const fetchScoreboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scoreboard');
      const data = await res.json();
      if (data.success) {
        setScoreboard(data.scoreboard);
      } else {
        setError('Failed to load scoreboard');
      }
    } catch {
      setError('Failed to load scoreboard');
    }
    setLoading(false);
  };

  const checkBackendStatus = async () => {
    // Check MongoDB
    try {
      const res = await fetch('/api/admin/status');
      const data = await res.json();
      setMongoStatus(data.mongo === true ? 'active' : 'inactive');
      setAiStatus(data.ai === true ? 'active' : 'inactive');
    } catch {
      setMongoStatus('inactive');
      setAiStatus('inactive');
    }
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      const res = await fetch(`/api/admin/scoreboard/${idx}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchScoreboard();
      } else {
        alert('Failed to delete entry');
      }
    } catch {
      alert('Failed to delete entry');
    }
  };

  const handleAdd = async (entry: ScoreboardEntry) => {
    try {
      const res = await fetch('/api/admin/scoreboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (data.success) {
        fetchScoreboard();
      } else {
        alert('Failed to add entry');
      }
    } catch {
      alert('Failed to add entry');
    }
  };

  // --- DESIGN: Use same cyber background and card style as main page ---
  return (
    <div className="min-h-screen bg-gradient-bg flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-3xl mx-auto">
        {!authenticated ? (
          <Card className="max-w-md mx-auto mt-16 bg-card/90 shadow-cyber border-cyber-orange">
            <CardHeader>
              <CardTitle className="text-3xl text-center bg-gradient-cyber bg-clip-text text-transparent">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mb-4"
              />
              <Button className="w-full bg-gradient-cyber text-black font-bold" onClick={() => setAuthenticated(password === 'admin123')}>Login</Button>
              {password && password !== 'admin123' && (
                <div className="text-red-500 mt-2 text-center">Incorrect password</div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 bg-card/90 shadow-cyber border-cyber-orange">
            <CardHeader>
              <CardTitle className="text-3xl text-center bg-gradient-cyber bg-clip-text text-transparent">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div>MongoDB: <span className={mongoStatus === 'active' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{mongoStatus}</span></div>
                  <div>AI: <span className={aiStatus === 'active' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{aiStatus}</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-cyber-orange" onClick={checkBackendStatus}>Refresh Status</Button>
                  <Button variant="outline" className="border-cyber-orange" onClick={fetchScoreboard}>Refresh Scoreboard</Button>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">Scoreboard Management</h2>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <table className="min-w-full divide-y divide-border mb-8">
                    <thead>
                      <tr>
                        <th>Player Name</th>
                        <th>Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreboard.map((entry, idx) => (
                        <tr key={idx + entry.playerName + entry.score}>
                          <td>{entry.playerName}</td>
                          <td>{entry.score}</td>
                          <td>
                            <Button variant="destructive" onClick={() => handleDelete(idx)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="mt-8">
                  <h3 className="font-bold mb-2">Add Entry</h3>
                  <AddEntryForm onAdd={handleAdd} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AddEntryForm: React.FC<{ onAdd: (entry: ScoreboardEntry) => void }> = ({ onAdd }) => {
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!playerName || !score) return;
        onAdd({ playerName, score: parseInt(score, 10) });
        setPlayerName('');
        setScore('');
      }}
      className="flex gap-2"
    >
      <Input
        placeholder="Player Name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />
      <Input
        placeholder="Score"
        type="number"
        value={score}
        onChange={e => setScore(e.target.value)}
      />
      <Button type="submit">Add</Button>
    </form>
  );
};

export default AdminDashboard;
