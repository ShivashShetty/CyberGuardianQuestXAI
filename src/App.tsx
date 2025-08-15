import React, { useState, useEffect } from 'react';
import { PlayerNameInput } from '@/components/PlayerNameInput';
import { GameService } from '@/services/gameService';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    // Check if player name exists in localStorage
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  const handleNameSubmit = async (name: string) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
    // Create or fetch player and store playerId
    try {
      const player = await GameService.createPlayer(name);
      localStorage.setItem('playerId', player.id);
    } catch (err) {
      // fallback: clear playerId if error
      localStorage.removeItem('playerId');
    }
    setShowNameInput(false);
  };

  // Listen for custom event to open player name modal
  useEffect(() => {
    const openModalHandler = () => {
      setShowNameInput(true);
    };
    
    window.addEventListener('openPlayerNameModal', openModalHandler);
    
    return () => {
      window.removeEventListener('openPlayerNameModal', openModalHandler);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <div className="flex-1 flex flex-col">
            <BrowserRouter>
              {/* Player Name Input Modal */}
              {showNameInput && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
                  <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">Player Name</h2>
                      <button 
                        className="text-2xl text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNameInput(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <PlayerNameInput onSubmit={handleNameSubmit} />
                  </div>
                </div>
              )}
              <Routes>
                <Route path="/" element={<Index playerName={playerName || undefined} />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
          {/* Footer with Admin Link */}
          <footer className="w-full py-4 bg-background/80 border-t border-border text-center text-xs text-muted-foreground mt-12">
            <span>CyberGuardianQuestXAI &copy; 2025</span>
            <span className="mx-2">|</span>
            <a href="/admin" className="underline hover:text-cyber-orange transition-colors">Admin Login</a>
          </footer>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
