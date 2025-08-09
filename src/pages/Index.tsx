import React, { useState, useEffect } from 'react';
import { Shield, Brain, Target, Trophy, Zap, Eye, Lock, AlertTriangle, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-cybersecurity.jpg';
import { ThreatSimulator } from '@/components/ThreatSimulator';
import { AIExplainer } from '@/components/AIExplainer';
import { LearningModule } from '@/components/LearningModule';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { CyberDefenseGame } from '@/components/CyberDefenseGame';
import { WordPuzzleGame } from '@/components/WordGame'; // --- IMPORT THE NEW COMPONENT ---

const Index = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [currentModule, setCurrentModule] = useState('phishing');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [gameStats, setGameStats] = useState({ highScore: 0, gamesPlayed: 0, totalScore: 0 });
  const { toast } = useToast();

  const safeNumber = (key: string) => {
    const val = localStorage.getItem(key);
    return val && !isNaN(Number(val)) ? Number(val) : 0;
  };

  const finalGameStats = {
    highScore: safeNumber("cyberGameHighScore"),
    gamesPlayed: safeNumber("cyberGameTotalGames"),
    totalScore: safeNumber("cyberGameTotalScore"),
  };

  const modules = [
    {
      id: 'phishing',
      title: 'Phishing Detection',
      description: 'Learn to identify and prevent phishing attacks',
      icon: Shield,
      difficulty: 'Beginner',
      xpReward: 100,
      color: 'cyber-blue'
    },
    {
      id: 'password',
      title: 'Password Security',
      description: 'Master password creation and management',
      icon: Lock,
      difficulty: 'Beginner',
      xpReward: 150,
      color: 'cyber-green'
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering',
      description: 'Understand psychological manipulation tactics',
      icon: Brain,
      difficulty: 'Intermediate',
      xpReward: 200,
      color: 'cyber-purple'
    },
    {
      id: 'malware',
      title: 'Malware Defense',
      description: 'Detect and prevent malicious software',
      icon: AlertTriangle,
      difficulty: 'Advanced',
      xpReward: 300,
      color: 'threat-red'
    }
  ];

  const achievements = [
    { id: 'first-module', name: 'First Steps', description: 'Complete your first module', unlocked: completedModules.length >= 1 },
    { id: 'phishing-master', name: 'Phishing Master', description: 'Complete phishing detection module', unlocked: completedModules.includes('phishing') },
    { id: 'security-champion', name: 'Security Champion', description: 'Complete all beginner modules', unlocked: completedModules.filter(m => ['phishing', 'password'].includes(m)).length === 2 },
    { id: 'ai-student', name: 'AI Student', description: 'Use AI explanations 10 times', unlocked: userXP >= 500 },
    { id: 'first-game', name: 'First Defense', description: 'Play the cyber defense game', unlocked: gameStats.gamesPlayed >= 1 },
    { id: 'game-master', name: 'Game Master', description: 'Score 1000+ points in the defense game', unlocked: gameStats.highScore >= 1000 },
    { id: 'defender', name: 'Network Defender', description: 'Play 10 defense games', unlocked: gameStats.gamesPlayed >= 10 },
    { id: 'cyber-expert', name: 'Cyber Expert', description: 'Complete all modules and achieve high game score', unlocked: completedModules.length === 4 && gameStats.highScore >= 2000 }
  ];

  const handleGameComplete = (score: number, level: number, wave: number) => {
    const newStats = {
      gamesPlayed: gameStats.gamesPlayed + 1,
      highScore: Math.max(gameStats.highScore, score),
      totalScore: gameStats.totalScore + score
    };
    setGameStats(newStats);
    
    const gameXP = Math.floor(score / 10) + (level * 50) + (wave * 25);
    setUserXP(prev => prev + gameXP);
    
    const newLevel = Math.floor((userXP + gameXP) / 500) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
      toast({
        title: "Level Up! 🎉",
        description: `You've reached level ${newLevel}!`,
      });
    }

    toast({
      title: "Game Complete! 🎮",
      description: `You earned ${gameXP} XP! Score: ${score}`,
    });
  };

  const handleModuleComplete = (moduleId: string, xpGained: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
      setUserXP(prev => prev + xpGained);
      
      const newLevel = Math.floor((userXP + xpGained) / 500) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast({
          title: "Level Up! 🎉",
          description: `You've reached level ${newLevel}!`,
        });
      }

      toast({
        title: "Module Completed! ✅",
        description: `You earned ${xpGained} XP!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-background/70" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-primary mr-4 animate-glow" />
            <h1 className="text-6xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              CyberGuard Academy
            </h1>
          </div>
          
          <p className="text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
            Master cybersecurity through AI-powered gamification. Learn, practice, and defend with explainable AI guidance.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-gradient-cyber hover:shadow-cyber transition-all duration-300"
              onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Learning
              <Target className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary hover:bg-primary/10 hover:shadow-glow"
              onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Play Game
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary hover:bg-primary/10 hover:shadow-glow"
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Progress
              <Trophy className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* User Progress Header */}
      <div className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-gradient-cyber text-black">
              Level {userLevel}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">XP:</span>
              <Progress value={(userXP % 500) / 500 * 100} className="w-32" />
              <span className="text-sm font-mono">{userXP}/{(userLevel * 500)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyber-orange" />
            <span className="text-sm font-medium">{completedModules.length}/{modules.length} Modules</span>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-20 px-4">
        <div className="container mx-auto">
          <ProgressDashboard 
            userLevel={userLevel}
            userXP={userXP}
            completedModules={completedModules}
            achievements={achievements}
            gameStats={gameStats}
          />
        </div>
      </section>

      {/* Learning Modules */}
      <section id="modules" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
              Learning Modules
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive cybersecurity training with AI-powered explanations and real-world scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {modules.map((module) => (
              <Card 
                key={module.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-cyber hover:scale-105 ${
                  currentModule === module.id ? 'ring-2 ring-primary' : ''
                } ${completedModules.includes(module.id) ? 'bg-gradient-safe/10' : ''}`}
                onClick={() => setCurrentModule(module.id)}
              >
                <CardHeader className="text-center">
                  <module.icon className={`h-12 w-12 mx-auto mb-2 ${
                    completedModules.includes(module.id) ? 'text-cyber-green' : 'text-primary'
                  }`} />
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Badge variant="outline" className={`${
                    module.difficulty === 'Beginner' ? 'border-cyber-green' :
                    module.difficulty === 'Intermediate' ? 'border-cyber-orange' :
                    'border-threat-red'
                  }`}>
                    {module.difficulty}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-cyber-orange">+{module.xpReward} XP</span>
                    {completedModules.includes(module.id) && (
                      <Badge className="bg-gradient-safe text-black">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <LearningModule 
            module={modules.find(m => m.id === currentModule) || modules[0]}
            onComplete={handleModuleComplete}
            isCompleted={completedModules.includes(currentModule)}
          />
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
              AI-Powered Learning
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience cutting-edge AI explanations and reinforcement learning in cybersecurity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ThreatSimulator />
            <AIExplainer />
          </div>
        </div>
      </section>

      {/* 2D Game Section */}
      <section id="game" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
              Cyber Defense Game
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Test your skills in real-time! Defend your network from cyber attacks in this interactive 2D game
            </p>
          </div>

          <CyberDefenseGame onGameComplete={handleGameComplete} />
        </div>
      </section>
      
      {/* --- NEW: WORD PUZZLE GAME SECTION --- */}
      <section id="word-puzzle" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
              Vocabulary Challenge
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sharpen your mind and test your knowledge of key cybersecurity terms.
            </p>
          </div>
          
          <WordPuzzleGame />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
              Achievements
            </h2>
            <p className="text-xl text-muted-foreground">
              Track your progress and unlock new milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`text-center ${
                  achievement.unlocked 
                    ? 'bg-gradient-safe/10 border-cyber-green' 
                    : 'opacity-50 border-muted'
                }`}
              >
                <CardHeader>
                  <Trophy className={`h-8 w-8 mx-auto mb-2 ${
                    achievement.unlocked ? 'text-cyber-green' : 'text-muted-foreground'
                  }`} />
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-2 bg-gradient-safe text-black">
                      Unlocked!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
