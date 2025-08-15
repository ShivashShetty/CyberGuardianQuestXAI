import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onSubmit: (name: string) => void;
}

export const PlayerNameInput: React.FC<Props> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    onSubmit(name.trim());
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to CyberGuard Academy!</h2>
      <p className="text-muted-foreground mb-4">Enter your name to start playing:</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name"
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <Button type="submit" className="w-full">
          Start Playing
        </Button>
      </form>
    </div>
  );
};