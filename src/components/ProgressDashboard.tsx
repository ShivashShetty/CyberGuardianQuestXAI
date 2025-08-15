import React from 'react';
import { Trophy, Target, Zap, TrendingUp, Award, Shield, Brain, Lock, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface Props {
  userLevel: number;
  userXP: number;
  completedModules: string[];
  achievements: Achievement[];
  gameStats?: {
    highScore: number;
    gamesPlayed: number;
    totalScore: number;
  };
  playerName?: string;
}

const moduleIcons: Record<string, React.ComponentType<any>> = {
  'phishing': Shield,
  'password': Lock,
  'social-engineering': Brain,
  'malware': AlertTriangle,
};

const moduleNames: Record<string, string> = {
  'phishing': 'Phishing Detection',
  'password': 'Password Security',
  'social-engineering': 'Social Engineering',
  'malware': 'Malware Defense',
};

export const ProgressDashboard: React.FC<Props> = ({ 
  userLevel, 
  userXP, 
  completedModules, 
  achievements,
  gameStats,
  playerName
}) => {
  const nextLevelXP = userLevel * 500;
  const currentLevelXP = userXP % 500;
  const progressToNextLevel = (currentLevelXP / 500) * 100;
  
  const totalModules = 4;
  const completionRate = (completedModules.length / totalModules) * 100;
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const achievementRate = (unlockedAchievements.length / achievements.length) * 100;

  const getXPForLevel = (level: number) => {
    return Array.from({ length: level }, (_, i) => (i + 1) * 500).reduce((a, b) => a + b, 0);
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-cyber-purple';
    if (level >= 3) return 'text-cyber-orange';
    return 'text-cyber-green';
  };
// Load game stats from localStorage if not provided as props
const localHighScore = Number(localStorage.getItem("cyberGameHighScore") || 0);
const localGamesPlayed = Number(localStorage.getItem("cyberGameTotalGames") || 0);
const localTotalScore = Number(localStorage.getItem("cyberGameTotalScore") || 0);

const finalGameStats = gameStats || {
  highScore: localHighScore,
  gamesPlayed: localGamesPlayed,
  totalScore: localTotalScore,
};

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-cyber bg-clip-text text-transparent">
          Your Progress Dashboard
        </h2>
        <p className="text-muted-foreground">
          Track your cybersecurity learning journey and achievements
        </p>
      </div>

      {/* Player Info Section */}
      {playerName && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Player Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{playerName}</h3>
                <p className="text-muted-foreground">Current player</p>
              </div>
              <Badge variant="outline">Online</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level and XP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <Trophy className={`h-8 w-8 mx-auto mb-2 ${getLevelColor(userLevel)}`} />
            <CardTitle className="text-2xl">Level {userLevel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progressToNextLevel} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {currentLevelXP}/{nextLevelXP} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Zap className="h-8 w-8 mx-auto mb-2 text-cyber-orange" />
            <CardTitle className="text-2xl">{userXP.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Experience Points</p>
            <Badge variant="outline" className="mt-2">
              Rank: {userLevel >= 5 ? 'Expert' : userLevel >= 3 ? 'Intermediate' : 'Beginner'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-2xl">{completionRate.toFixed(0)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Modules Completed</p>
            <p className="text-sm text-cyber-green font-medium">
              {completedModules.length} of {totalModules}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(moduleNames).map(([moduleId, moduleName]) => {
              const Icon = moduleIcons[moduleId];
              const isCompleted = completedModules.includes(moduleId);
              
              return (
                <div key={moduleId} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isCompleted ? 'text-cyber-green' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">{moduleName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted ? 'Completed' : 'Not started'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <Badge className="bg-gradient-safe text-black">
                        ✓ Done
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {unlockedAchievements.length} of {achievements.length} unlocked ({achievementRate.toFixed(0)}%)
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'border-cyber-green bg-gradient-safe/10'
                    : 'border-border opacity-60'
                }`}
              >
                <Trophy className={`h-5 w-5 mt-0.5 ${
                  achievement.unlocked ? 'text-cyber-green' : 'text-muted-foreground'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge className="bg-gradient-safe text-black">
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Game Stats */}
        {gameStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Game Statistics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your cyber defense game performance
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gradient-cyber/10 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{finalGameStats.highScore}</div>
                  <div className="text-sm text-muted-foreground">High Score</div>
                </div>
                <div className="text-center p-3 bg-gradient-safe/10 rounded-lg border border-cyber-green/20">
                  <div className="text-2xl font-bold text-cyber-green">{finalGameStats.gamesPlayed}</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
                <div className="text-center p-3 bg-gradient-threat/10 rounded-lg border border-cyber-orange/20">
                  <div className="text-2xl font-bold text-cyber-orange">{finalGameStats.totalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>
              
              {finalGameStats.gamesPlayed > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">{Math.round(finalGameStats.totalScore / finalGameStats.gamesPlayed)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Game Mastery</span>
                    <span className="font-medium">
                      {finalGameStats.highScore >= 2000 ? 'Expert' : 
                       finalGameStats.highScore >= 1000 ? 'Advanced' : 
                       finalGameStats.highScore >= 500 ? 'Intermediate' : 'Beginner'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Learning Path
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your personalized cybersecurity learning journey
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-cyber/10 rounded-lg border border-primary/20">
              <div>
                <h4 className="font-medium text-primary">Current Focus</h4>
                <p className="text-sm text-muted-foreground">
                  {completedModules.length === 0 ? 'Start with Phishing Detection' :
                   completedModules.length === 1 ? 'Continue with Password Security' :
                   completedModules.length === 2 ? 'Progress to Social Engineering' :
                   completedModules.length === 3 ? 'Master Malware Defense' :
                   'All modules completed! Keep practicing.'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  {completedModules.length < 4 ? 'Next Module' : 'Complete!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedModules.length < 4 ? 'Recommended' : 'All done'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card/50 rounded-lg border border-border">
                <h4 className="font-medium mb-2">Strengths</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {completedModules.includes('phishing') && (
                    <li>• Phishing detection skills</li>
                  )}
                  {completedModules.includes('password') && (
                    <li>• Password security practices</li>
                  )}
                  {completedModules.includes('social-engineering') && (
                    <li>• Social engineering awareness</li>
                  )}
                  {completedModules.includes('malware') && (
                    <li>• Malware defense knowledge</li>
                  )}
                  {completedModules.length === 0 && (
                    <li className="text-muted-foreground">Complete modules to see your strengths</li>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-card/50 rounded-lg border border-border">
                <h4 className="font-medium mb-2">Areas to Improve</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {!completedModules.includes('phishing') && (
                    <li>• Phishing email recognition</li>
                  )}
                  {!completedModules.includes('password') && (
                    <li>• Password management</li>
                  )}
                  {!completedModules.includes('social-engineering') && (
                    <li>• Social engineering defenses</li>
                  )}
                  {!completedModules.includes('malware') && (
                    <li>• Malware identification</li>
                  )}
                  {completedModules.length === 4 && (
                    <li className="text-cyber-green">All areas mastered! Keep practicing.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};