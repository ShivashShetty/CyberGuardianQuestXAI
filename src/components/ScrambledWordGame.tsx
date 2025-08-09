import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Trophy, RotateCcw, Flag, Clock, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Interfaces and Types ---
interface Cell {
  letter: string;
  r: number;
  c: number;
}

interface Word {
  text: string;
  found: boolean;
  cells: Cell[];
}

interface GameState {
  grid: string[][];
  words: Word[];
  score: number;
  timeLeft: number;
  isGameOver: boolean;
  isPaused: boolean;
}

// --- Constants ---
const GRID_SIZE = 20;
const GAME_DURATION = 300; // 5 minutes in seconds

// --- Word Bank ---
const CYBERSECURITY_WORDS = [
  'FIREWALL', 'MALWARE', 'PHISHING', 'ENCRYPTION', 'ANTIVIRUS', 'RANSOMWARE', 
  'TROJAN', 'SPYWARE', 'BOTNET', 'EXPLOIT', 'KEYLOGGER', 'ROOTKIT', 'ADWARE', 
  'BACKDOOR', 'BRUTEFORCE', 'DDOS', 'PATCH', 'VPN', 'WORM', 'SPOOFING', 
  'VULNERABILITY', 'AUTHENTICATION', 'HACKTIVISM', 'PENETRATION', 
  'CRYPTOGRAPHY', 'CLICKJACKING', 'DATABREACH', 'HACKER', 'SECURITY', 
  'PASSWORD', 'SPAM', 'COOKIE', 'VIRUS', 'DATA', 'NETWORK', 'SERVER', 'CLIENT',
  'PROTOCOL', 'ROUTER', 'SWITCH', 'DOMAIN', 'PROXY', 'THREAT', 'ATTACK'
];

// --- Word Search Generation Logic ---
const generatePuzzle = (wordList: string[], gridSize: number, numWords: number): { grid: string[][]; words: { text: string; cells: Cell[] }[] } | null => {
    let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placedWords: { text: string; cells: Cell[] }[] = [];
    
    const shuffledWords = [...wordList].sort(() => 0.5 - Math.random());
    const wordsToPlace = shuffledWords.slice(0, numWords).filter(w => w.length <= gridSize);

    const directions = [
        { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 },
        { r: 0, c: -1 }, { r: -1, c: 0 }, { r: -1, c: -1 }, { r: -1, c: 1 }
    ];

    for (const word of wordsToPlace) {
        let placed = false;
        for (let i = 0; i < 100; i++) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const startR = Math.floor(Math.random() * gridSize);
            const startC = Math.floor(Math.random() * gridSize);

            let r = startR;
            let c = startC;
            let canPlace = true;
            const wordCells: Cell[] = [];

            for (let j = 0; j < word.length; j++) {
                if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] !== '' && grid[r][c] !== word[j])) {
                    canPlace = false;
                    break;
                }
                wordCells.push({ letter: word[j], r, c });
                r += dir.r;
                c += dir.c;
            }

            if (canPlace) {
                wordCells.forEach(cell => {
                    grid[cell.r][cell.c] = cell.letter;
                });
                placedWords.push({ text: word, cells: wordCells });
                placed = true;
                break;
            }
        }
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }

    return { grid, words: placedWords };
};


// --- Component ---
export const WordSearchGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        grid: [],
        words: [],
        score: 0,
        timeLeft: GAME_DURATION,
        isGameOver: true,
        isPaused: true,
    });
    const [selection, setSelection] = useState<Cell[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [clickSelectionStart, setClickSelectionStart] = useState<Cell | null>(null);
    const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    const startNewGame = useCallback(() => {
        const puzzle = generatePuzzle(CYBERSECURITY_WORDS, GRID_SIZE, 10);
        if (puzzle) {
            setGameState({
                grid: puzzle.grid,
                words: puzzle.words.map(w => ({ ...w, found: false })),
                score: 0,
                timeLeft: GAME_DURATION,
                isGameOver: false,
                isPaused: true, // --- CHANGED: Game starts in a paused state ---
            });
            setSelection([]);
            setClickSelectionStart(null);
            setFoundCells(new Set());
        }
    }, []);

    const endGame = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        const missedWords = gameState.words.filter(w => !w.found);
        const penalty = missedWords.length * 15;
        const finalScore = gameState.score - penalty;

        setGameState(prev => ({ ...prev, isGameOver: true, isPaused: true, score: finalScore }));
        
        toast({
            title: "Game Over! 🏁",
            description: `You missed ${missedWords.length} words. Final Score: ${finalScore}`,
        });
    }, [gameState.words, gameState.score, toast]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    useEffect(() => {
        if (gameState.isGameOver || gameState.isPaused || gameState.timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if(gameState.timeLeft <= 0 && !gameState.isGameOver) endGame();
            return;
        }

        timerRef.current = setInterval(() => {
            setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState.isGameOver, gameState.isPaused, gameState.timeLeft, endGame]);

    const checkWord = (wordToCheck: string) => {
        const reversedWord = [...wordToCheck].reverse().join('');
        const wordToFind = gameState.words.find(w => !w.found && (w.text === wordToCheck || w.text === reversedWord));

        if (wordToFind) {
            const newFoundCells = new Set(foundCells);
            wordToFind.cells.forEach(cell => newFoundCells.add(`${cell.r}-${cell.c}`));
            setFoundCells(newFoundCells);

            setGameState(prev => ({
                ...prev,
                score: prev.score + 25,
                words: prev.words.map(w => w.text === wordToFind.text ? { ...w, found: true } : w)
            }));
            toast({
                title: "✅ Word Found!",
                description: `+25 points for finding "${wordToFind.text}"`,
            });
            return true;
        }
        return false;
    };

    const handleSelectionEnd = () => {
        if (!isSelecting || selection.length < 2) {
            setIsSelecting(false);
            setSelection([]);
            return;
        };
        setIsSelecting(false);
        checkWord(selection.map(cell => cell.letter).join(''));
        setSelection([]);
        setClickSelectionStart(null);
    };

    const handleCellInteraction = (interaction: () => void) => {
        if (gameState.isGameOver || gameState.isPaused) {
            if (!gameState.isGameOver) {
                toast({ title: "Game Paused ⏸️", description: "Click Start to resume." });
            }
            return;
        }
        interaction();
    };

    const handleCellEnter = (cell: Cell) => {
        handleCellInteraction(() => {
            if (isSelecting && !selection.some(s => s.r === cell.r && s.c === cell.c)) {
                const start = selection[0];
                const end = cell;
                const newSelection: Cell[] = [start];
                const dr = end.r - start.r;
                const dc = end.c - start.c;

                if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
                    const len = Math.max(Math.abs(dr), Math.abs(dc));
                    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
                    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
                    
                    for (let i = 1; i <= len; i++) {
                        const r = start.r + i * stepR;
                        const c = start.c + i * stepC;
                        newSelection.push({ letter: gameState.grid[r][c], r, c });
                    }
                    setSelection(newSelection);
                }
            }
        });
    };

    const handleCellClick = (cell: Cell) => {
        handleCellInteraction(() => {
            if (isSelecting) return;

            if (!clickSelectionStart) {
                setClickSelectionStart(cell);
                setSelection([cell]);
                toast({ title: "First letter selected!", description: "Click the last letter to form a word." });
            } else {
                const start = clickSelectionStart;
                const end = cell;
                const dr = end.r - start.r;
                const dc = end.c - start.c;

                if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
                    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
                    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
                    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
                    
                    let currentWord = '';
                    for (let i = 0; i < len; i++) {
                        currentWord += gameState.grid[start.r + i * stepR][start.c + i * stepC];
                    }
                    checkWord(currentWord);
                }
                setClickSelectionStart(null);
                setSelection([]);
            }
        });
    };

    const unfoundCells = new Set<string>();
    if (gameState.isGameOver) {
        gameState.words.forEach(word => {
            if (!word.found) {
                word.cells.forEach(cell => {
                    unfoundCells.add(`${cell.r}-${cell.c}`);
                });
            }
        });
    }

    return (
        <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary">
                        <Search className="h-6 w-6" />
                        Cybersecurity Word Search
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setGameState(p => ({...p, isPaused: !p.isPaused}))} disabled={gameState.isGameOver}>
                            {gameState.isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                            {gameState.isPaused ? 'Start' : 'Pause'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={startNewGame}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            New Game
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{gameState.score}</div>
                        <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-2">
                            <Clock className="h-5 w-5" />
                            {`${Math.floor(gameState.timeLeft / 60)}:${(gameState.timeLeft % 60).toString().padStart(2, '0')}`}
                        </div>
                        <div className="text-sm text-muted-foreground">Time Left</div>
                    </div>
                </div>
                <Progress value={(gameState.timeLeft / GAME_DURATION) * 100} className="h-2" />

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div
                        className="grid select-none border border-border p-2 rounded-lg bg-muted/20"
                        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                        onMouseUp={() => handleCellInteraction(handleSelectionEnd)}
                        onMouseLeave={() => handleCellInteraction(handleSelectionEnd)}
                    >
                        {gameState.grid.map((row, r) =>
                            row.map((letter, c) => {
                                const isSelected = selection.some(s => s.r === r && s.c === c);
                                const isClickStart = clickSelectionStart?.r === r && clickSelectionStart?.c === c;
                                const isUnfound = gameState.isGameOver && unfoundCells.has(`${r}-${c}`);
                                const isFound = foundCells.has(`${r}-${c}`);
                                
                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`flex items-center justify-center aspect-square text-xs md:text-sm font-mono cursor-pointer transition-colors duration-200
                                            ${isSelected ? 'bg-primary/80 text-primary-foreground rounded-md' : ''}
                                            ${isClickStart ? 'bg-yellow-500/80 text-black rounded-md' : ''}
                                            ${isUnfound ? 'bg-red-500/50 text-white' : ''}
                                            ${isFound ? 'bg-green-500/50 text-white' : ''}
                                            ${!isSelected && !isUnfound && !isClickStart && !isFound ? 'hover:bg-primary/20' : ''}`
                                        }
                                        onMouseDown={() => handleCellInteraction(() => { setIsSelecting(true); setClickSelectionStart(null); setSelection([{ letter, r, c }]) })}
                                        onMouseEnter={() => handleCellEnter({ letter, r, c })}
                                        onClick={() => handleCellClick({ letter, r, c })}
                                    >
                                        {letter}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="w-full md:w-1/3 space-y-2">
                        <h3 className="font-semibold text-center md:text-left">Words to Find:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {gameState.words.map(word => (
                                <span
                                    key={word.text}
                                    className={`text-sm transition-all duration-300 ${
                                        word.found ? 'line-through opacity-50 text-green-500' : 'text-muted-foreground'
                                    }`}
                                >
                                    {word.text}
                                </span>
                            ))}
                        </div>
                        <Button
                            variant="destructive"
                            className="w-full mt-4"
                            onClick={endGame}
                            disabled={gameState.isGameOver}
                        >
                            <Flag className="h-4 w-4 mr-2" />
                            Give Up
                        </Button>
                    </div>
                </div>
                
                {gameState.isGameOver && (
                    <div className="text-center p-4 bg-red-500/20 rounded-lg text-red-500 font-semibold">
                        Game Over! Click "New Game" to play again.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
