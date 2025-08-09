import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, CheckCircle, XCircle, Trophy, Lightbulb, RotateCcw, ArrowRight, HelpCircle, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Interfaces and Types ---
interface Puzzle {
  scrambled: string;
  answer: string;
  hint: string;
}

interface ScoreState {
  currentScore: number;
  totalPuzzlesSolved: number;
  highScore: number;
}

// --- Simplified Game Data ---
const allPuzzles: Puzzle[] = [
  { scrambled: "ifrewlla", answer: "firewall", hint: "A digital barrier that protects a network from unauthorized access." },
  { scrambled: "alwamer", answer: "malware", hint: "A general term for harmful software on a computer." },
  { scrambled: "hpsihign", answer: "phishing", hint: "Fake emails or messages sent to trick you into giving up personal information." },
  { scrambled: "yprnecoitn", answer: "encryption", hint: "Scrambling data so only authorized parties can understand the information." },
  { scrambled: "sovriatniu", answer: "antivirus", hint: "Software that protects your computer from viruses." },
  { scrambled: "swnareroma", answer: "ransomware", hint: "A type of attack that locks your files until you pay money." },
  { scrambled: "jrtnoa", answer: "trojan", hint: "A virus that hides inside a seemingly harmless program." },
  { scrambled: "pywersa", answer: "spyware", hint: "Software that secretly watches and records what you do on your computer." },
  { scrambled: "tnoetb", answer: "botnet", hint: "A group of infected computers controlled by a hacker." },
  { scrambled: "pxetilo", answer: "exploit", hint: "A way for attackers to use a security flaw." },
  { scrambled: "gokeygler", answer: "keylogger", hint: "A tool that secretly records every key you press." },
  { scrambled: "okotitr", answer: "rootkit", hint: "A type of malware that is very difficult to detect and remove." },
  { scrambled: "dearwa", answer: "adware", hint: "Software that shows you unwanted pop-up ads." },
  { scrambled: "kocdabor", answer: "backdoor", hint: "A secret way to get into a computer system." },
  { scrambled: "sdod", answer: "ddos", hint: "An attack that floods a website with traffic to make it crash." },
  { scrambled: "hacpt", answer: "patch", hint: "A software update to fix a security hole or bug." },
  { scrambled: "npv", answer: "vpn", hint: "A tool that hides your online activity for privacy." },
  { scrambled: "morw", answer: "worm", hint: "A virus that spreads by itself across a network." },
  { scrambled: "gofinops", answer: "spoofing", hint: "When a hacker pretends to be someone or something else." },
  { scrambled: "yutitlivlnaerb", answer: "vulnerability", hint: "A weakness in a system that can be attacked." },
  { scrambled: "tneuoiacttianh", answer: "authentication", hint: "The process of proving you are who you say you are, like with a password." },
  { scrambled: "karehc", answer: "hacker", hint: "A person who uses computers to gain unauthorized access to data." },
  { scrambled: "dtaaebrhc", answer: "data breach", hint: "When sensitive information is stolen or exposed." },
  { scrambled: "kiclc-karfj", answer: "click-fraud", hint: "Artificially inflating the number of clicks on a pay-per-click ad." },
  { scrambled: "yrscueit", answer: "security", hint: "The practice of protecting computer systems and networks." },
  { scrambled: "drowssap", answer: "password", hint: "A secret word or phrase used to gain access to a computer system." },
  { scrambled: "pamS", answer: "spam", hint: "Unsolicited junk email sent in bulk." },
  { scrambled: "oocike", answer: "cookie", hint: "A small piece of data stored on the user's computer by the web browser." },
  { scrambled: "yrsuiv", answer: "virus", hint: "A piece of code that is capable of copying itself and typically has a detrimental effect." },
  { scrambled: "tdaa", answer: "data", hint: "Facts and statistics collected together for reference or analysis." }
];

const PUZZLES_PER_ROUND = 10;
const TIME_PER_PUZZLE = 30;

// --- Component ---
export const WordPuzzleGame: React.FC = () => {
  const [shuffledPuzzles, setShuffledPuzzles] = useState<Puzzle[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [puzzleInRound, setPuzzleInRound] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [score, setScore] = useState<ScoreState>({
    currentScore: 100,
    totalPuzzlesSolved: 0,
    highScore: 0,
  });
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PUZZLE);
  const [letterHint, setLetterHint] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState({ definition: false, letters: false });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOverByScore, setIsGameOverByScore] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const shufflePuzzles = useCallback(() => {
    const shuffled = [...allPuzzles].sort(() => Math.random() - 0.5);
    setShuffledPuzzles(shuffled);
  }, []);

  const resetForNextPuzzle = useCallback(() => {
    setIsGameActive(false);
    setUserInput("");
    setFeedback(null);
    setTimeLeft(TIME_PER_PUZZLE);
    setLetterHint(null);
    setHintsUsed({ definition: false, letters: false });
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startNewGame = useCallback(() => {
    shufflePuzzles();
    setCurrentRound(0);
    setPuzzleInRound(0);
    setIsRoundComplete(false);
    setIsGameComplete(false);
    setIsGameOverByScore(false);
    setScore({ // --- CHANGED: Reset all scores on new game ---
      currentScore: 100,
      totalPuzzlesSolved: 0,
      highScore: 0,
    });
    resetForNextPuzzle();
  }, [shufflePuzzles, resetForNextPuzzle]);

  const currentPuzzle = shuffledPuzzles[currentRound * PUZZLES_PER_ROUND + puzzleInRound];

  const moveToNextPuzzle = useCallback(() => {
    resetForNextPuzzle();
    if (puzzleInRound < PUZZLES_PER_ROUND - 1) {
      setPuzzleInRound(prev => prev + 1);
      setIsGameActive(true);
    } else {
      if ((currentRound + 1) * PUZZLES_PER_ROUND >= shuffledPuzzles.length) {
        setIsGameComplete(true);
        setFeedback({ message: "Congratulations! You've completed all puzzles!", type: 'correct' });
      } else {
        setIsRoundComplete(true);
        setFeedback({ message: "Round Complete!", type: 'correct' });
      }
    }
  }, [puzzleInRound, currentRound, shuffledPuzzles.length, resetForNextPuzzle]);

  const handleTimeUp = useCallback(() => {
    toast({
      title: "⏰ Time's Up!",
      description: `The answer was: ${currentPuzzle.answer}`,
      variant: "destructive",
    });
    moveToNextPuzzle();
  }, [currentPuzzle, moveToNextPuzzle, toast]);
  
  // --- REMOVED: useEffect that loaded high score from localStorage ---
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isGameActive || isRoundComplete || isGameComplete || !currentPuzzle || isGameOverByScore) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, currentPuzzle, isRoundComplete, isGameComplete, isGameOverByScore, handleTimeUp]);

  const showResumeToast = () => {
    toast({
      title: "Game Paused ⏸️",
      description: "Resume the game to continue playing.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive) {
      showResumeToast();
      return;
    }
    if (!userInput || isRoundComplete || isGameComplete || isGameOverByScore) return;

    if (userInput.toLowerCase() === currentPuzzle.answer) {
      setIsGameActive(false);
      setFeedback({ message: "Correct! Well done.", type: 'correct' });
      const points = 50 + Math.ceil(timeLeft * 1.66);
      const newScore = score.currentScore + points;
      const newTotalSolved = score.totalPuzzlesSolved + 1;

      setScore(prev => {
        const updatedScore = {
          ...prev,
          currentScore: newScore,
          totalPuzzlesSolved: newTotalSolved,
          highScore: Math.max(prev.highScore, newScore),
        };
        // --- REMOVED: localStorage.setItem for high score ---
        return updatedScore;
      });

      toast({
        title: "✅ Correct!",
        description: `+${points} points! You solved the puzzle.`,
      });

      setTimeout(() => moveToNextPuzzle(), 1500);

    } else {
      setFeedback({ message: "Incorrect. Try again!", type: 'incorrect' });
      toast({
        title: "❌ Incorrect",
        description: "That's not the right word. (-15 points)",
        variant: "destructive",
      });
      setUserInput("");
      
      const newScore = score.currentScore - 15;
      if (newScore <= 0) {
        setScore(prev => ({...prev, currentScore: 0}));
        setIsGameOverByScore(true);
        toast({ title: "Game Over!", description: "Your score reached zero.", variant: "destructive" });
      } else {
        setScore(prev => ({...prev, currentScore: newScore}));
      }
    }
  };
  
  const handleNextRound = () => {
      setCurrentRound(prev => prev + 1);
      setPuzzleInRound(0);
      setIsRoundComplete(false);
      resetForNextPuzzle();
      setIsGameActive(true);
  };

  const togglePause = () => {
    if (isRoundComplete || isGameComplete || isGameOverByScore) return;
    setIsGameActive(prev => !prev);
  };

  const showDefinitionHint = () => {
    if (!isGameActive) {
      showResumeToast();
      return;
    }
    if (currentPuzzle && !hintsUsed.definition) {
        toast({
            title: "💡 Definition Hint",
            description: currentPuzzle.hint,
        });
        setHintsUsed(prev => ({ ...prev, definition: true }));
    }
  };

  const generateLetterHint = (answer: string): string => {
    const letters = answer.split('');
    const revealedIndices = new Set([0]);
    if (letters.length > 2) {
      revealedIndices.add(letters.length - 1);
    }
    if (letters.length > 4) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * (letters.length - 2)) + 1;
      } while (revealedIndices.has(randomIndex));
      revealedIndices.add(randomIndex);
    }
    return letters.map((char, index) => (revealedIndices.has(index) ? char : '_')).join(' ');
  };

  const showLetterHint = () => {
    if (!isGameActive) {
      showResumeToast();
      return;
    }
    if (currentPuzzle && !hintsUsed.letters) {
      const hint = generateLetterHint(currentPuzzle.answer);
      setLetterHint(hint);
      setHintsUsed(prev => ({ ...prev, letters: true }));
      
      const newScore = score.currentScore - 25;
      if (newScore <= 0) {
        setScore(prev => ({...prev, currentScore: 0}));
        setIsGameOverByScore(true);
        toast({ title: "Game Over!", description: "Your score reached zero.", variant: "destructive" });
      } else {
        setScore(prev => ({...prev, currentScore: newScore}));
        toast({
            title: "💡 Letter Hint Unlocked!",
            description: "Some letters revealed. (-25 points)",
        });
      }
    }
  };
  
  if (!currentPuzzle) {
      return <Card className="w-full max-w-2xl mx-auto p-4 text-center">Loading Puzzles...</Card>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary">
                <BrainCircuit className="h-6 w-6" />
                Cybersecurity Word Puzzle
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={togglePause} disabled={isRoundComplete || isGameComplete || isGameOverByScore}>
                    {isGameActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isGameActive ? 'Pause' : 'Start'}
                </Button>
                <Button variant="ghost" size="sm" onClick={startNewGame}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                </Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary">{score.currentScore}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{score.totalPuzzlesSolved} / {allPuzzles.length}</div>
            <div className="text-sm text-muted-foreground">Total Solved</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
              <Trophy className="h-5 w-5" />
              {score.highScore}
            </div>
            <div className="text-sm text-muted-foreground">High Score</div>
          </div>
        </div>

        <div className="space-y-2">
            <Progress value={(timeLeft / TIME_PER_PUZZLE) * 100} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">Time Left: {timeLeft}s</p>
        </div>

        <div className="text-center space-y-4 p-6 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Round {currentRound + 1} - Puzzle {puzzleInRound + 1} of {PUZZLES_PER_ROUND}</p>
          <p className="text-4xl font-bold tracking-widest text-primary font-mono">
            {currentPuzzle.scrambled.toUpperCase()}
          </p>
          {letterHint && (
            <p className="text-2xl font-bold tracking-widest text-yellow-500 font-mono">{letterHint}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your answer..."
            className="flex-grow text-center sm:text-left"
            disabled={isRoundComplete || isGameComplete || isGameOverByScore || !isGameActive}
          />
          <Button type="submit" className="w-full sm:w-auto" disabled={isRoundComplete || isGameComplete || !isGameActive || isGameOverByScore}>
            Submit Answer
          </Button>
        </form>
        
        <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" onClick={showDefinitionHint} disabled={isRoundComplete || isGameComplete || hintsUsed.definition || isGameOverByScore || !isGameActive}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Definition Hint
            </Button>
            <Button variant="outline" size="sm" onClick={showLetterHint} disabled={isRoundComplete || isGameComplete || hintsUsed.letters || isGameOverByScore || !isGameActive}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Letter Hint (-25)
            </Button>
        </div>

        {feedback && (
          <div className={`flex items-center justify-center gap-2 p-3 rounded-md text-sm font-medium ${
            feedback.type === 'correct'
              ? 'bg-green-500/10 text-green-500'
              : 'bg-red-500/10 text-red-500'
          }`}>
            {feedback.type === 'correct' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            {feedback.message}
          </div>
        )}
        
        {isGameOverByScore && (
            <div className="text-center p-4 bg-red-500/20 rounded-lg text-red-500 font-semibold">
                Game Over! Your score ran out.
            </div>
        )}

        {isRoundComplete && !isGameComplete && (
            <Button onClick={handleNextRound} className="w-full bg-gradient-cyber hover:shadow-cyber">
                Start Next Round
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        )}
        {isGameComplete && (
            <div className="text-center p-4 bg-gradient-cyber rounded-lg text-black font-semibold">
                Congratulations! You have mastered the cybersecurity vocabulary!
            </div>
        )}
      </CardContent>
    </Card>
  );
};
