import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Play, Pause, RotateCcw, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ThreatScenario {
  id: string;
  type: 'phishing' | 'malware' | 'social-engineering' | 'password-attack';
  description: string;
  severity: 'low' | 'medium' | 'high';
  actions: string[];
  correctAction: number;
  aiExplanation: string;
  reinforcementFeedback: string;
}

const threatScenarios: ThreatScenario[] = [
  {
    id: 'phishing-1',
    type: 'phishing',
    description: 'You receive an email claiming to be from your bank asking you to verify your account by clicking a link.',
    severity: 'high',
    actions: ['Click the link immediately', 'Call your bank to verify', 'Reply with your credentials', 'Forward to colleagues'],
    correctAction: 1,
    aiExplanation: 'Banks never request sensitive information via email. Always verify independently through official channels.',
    reinforcementFeedback: 'Excellent! You demonstrated proper verification behavior. This strengthens your threat detection patterns.'
  },
  {
    id: 'malware-1',
    type: 'malware',
    description: 'A pop-up appears claiming your computer is infected and offers a "Free Security Scan" download.',
    severity: 'high',
    actions: ['Download the security scan', 'Close the pop-up and run official antivirus', 'Call the number provided', 'Share the warning with friends'],
    correctAction: 1,
    aiExplanation: 'Legitimate antivirus software doesn’t advertise through pop-ups. Always use trusted security tools.',
    reinforcementFeedback: 'Perfect response! You avoided malware by using official security tools. Your defense patterns are improving.'
  },
  {
    id: 'social-1',
    type: 'social-engineering',
    description: 'A caller claims to be from IT support and asks for your login credentials to "fix a security issue".',
    severity: 'medium',
    actions: ['Provide credentials immediately', 'Ask for employee ID and verify through official channels', 'Hang up and ignore', 'Give partial information'],
    correctAction: 1,
    aiExplanation: 'IT support should never ask for passwords. Always verify identity through official channels first.',
    reinforcementFeedback: 'Great critical thinking! You properly verified the caller’s identity. This reinforces good security habits.'
  },
  {
    id: 'phishing-2',
    type: 'phishing',
    description: 'You get a WhatsApp message saying you won a phone, with a suspicious shortened link.',
    severity: 'medium',
    actions: ['Click and claim it', 'Report and block the sender', 'Forward it to others', 'Reply with personal info'],
    correctAction: 1,
    aiExplanation: 'Scam messages often use urgency and fake prizes. Never engage.',
    reinforcementFeedback: 'You reported the scam correctly. Well done!'
  },
  {
    id: 'malware-2',
    type: 'malware',
    description: 'You download a free software crack to avoid paying for a licensed app.',
    severity: 'high',
    actions: ['Use it anyway', 'Scan it before using', 'Delete it immediately', 'Ask a friend to check'],
    correctAction: 2,
    aiExplanation: 'Cracked software often contains malware. Don’t take the risk.',
    reinforcementFeedback: 'You avoided a dangerous download. Smart decision!'
  },
  {
    id: 'social-2',
    type: 'social-engineering',
    description: 'Someone poses as your manager on email, asking for urgent gift card purchases.',
    severity: 'high',
    actions: ['Buy and send codes', 'Ignore', 'Verify by calling them', 'Reply asking why'],
    correctAction: 2,
    aiExplanation: 'Email spoofing is common. Always verify through voice or internal channels.',
    reinforcementFeedback: 'You avoided a financial scam. Strong awareness!'
  },
  {
    id: 'password-1',
    type: 'password-attack',
    description: 'Your coworker uses “password123” for all their accounts and tells you the same.',
    severity: 'medium',
    actions: ['Advise them to change it', 'Ignore', 'Share it with someone else', 'Use it yourself'],
    correctAction: 0,
    aiExplanation: 'Reused or weak passwords are major risks. Encourage using a password manager.',
    reinforcementFeedback: 'You helped prevent a password-based breach. Good thinking!'
  },
  {
    id: 'password-2',
    type: 'password-attack',
    description: 'Your account gets locked out after multiple login failures from unknown devices.',
    severity: 'medium',
    actions: ['Do nothing', 'Change your password and enable MFA', 'Ignore alerts', 'Only change username'],
    correctAction: 1,
    aiExplanation: 'Unusual login activity signals an attempted breach. Act fast.',
    reinforcementFeedback: 'You secured your account just in time. Nice move!'
  },
  {
    id: 'phishing-3',
    type: 'phishing',
    description: 'An email claims your tax refund is pending and asks for your bank login.',
    severity: 'high',
    actions: ['Click and enter details', 'Mark it as spam', 'Forward to tax office', 'Ignore it'],
    correctAction: 1,
    aiExplanation: 'Govt bodies don’t request login details via email. Stay alert.',
    reinforcementFeedback: 'You correctly flagged a financial scam. Stay sharp!'
  },
  {
    id: 'malware-3',
    type: 'malware',
    description: 'You find a USB drive on the office floor and plug it in out of curiosity.',
    severity: 'high',
    actions: ['Explore the contents', 'Hand it to IT', 'Use it on your laptop', 'Take it home'],
    correctAction: 1,
    aiExplanation: 'Unknown USBs may be infected. Only IT should handle them.',
    reinforcementFeedback: 'You prevented a possible device-based breach. Awesome!'
  }
];


export const ThreatSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState<ThreatScenario>(threatScenarios[0]);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const { toast } = useToast();

  const handleActionSelect = (actionIndex: number) => {
    setSelectedAction(actionIndex);
    setShowResult(true);
    
    const isCorrect = actionIndex === currentScenario.correctAction;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: `+10 points! Streak: ${streak + 1}`,
      });
    } else {
      setStreak(0);
      toast({
        title: "Incorrect ❌",
        description: "Study the AI explanation to improve!",
        variant: "destructive",
      });
    }
  };

  const nextScenario = () => {
    const nextIndex = (scenarioIndex + 1) % threatScenarios.length;
    setScenarioIndex(nextIndex);
    setCurrentScenario(threatScenarios[nextIndex]);
    setSelectedAction(null);
    setShowResult(false);
  };

  const resetSimulation = () => {
    setScenarioIndex(0);
    setCurrentScenario(threatScenarios[0]);
    setSelectedAction(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setIsRunning(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-cyber-green';
      case 'medium': return 'border-cyber-orange';
      case 'high': return 'border-threat-red';
      default: return 'border-muted';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phishing': return 'bg-gradient-threat text-black';
      case 'malware': return 'bg-gradient-threat text-black';
      case 'social-engineering': return 'bg-gradient-cyber text-black';
      case 'password-attack': return 'bg-gradient-safe text-black';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Threat Simulator
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gradient-cyber text-black">
              Score: {score}
            </Badge>
            <Badge variant="outline" className={streak >= 3 ? 'bg-gradient-safe text-black' : ''}>
              Streak: {streak}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Scenario Info */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className={getTypeColor(currentScenario.type)}>
            {currentScenario.type.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={getSeverityColor(currentScenario.severity)}>
            {currentScenario.severity} severity
          </Badge>
        </div>

        {/* Scenario Description */}
        <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-cyber-orange">
          <p className="text-sm leading-relaxed">{currentScenario.description}</p>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">How would you respond?</h4>
          {currentScenario.actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start p-4 h-auto text-left ${
                selectedAction === index
                  ? index === currentScenario.correctAction
                    ? 'border-cyber-green bg-gradient-safe/10'
                    : 'border-threat-red bg-gradient-threat/10'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleActionSelect(index)}
              disabled={showResult}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              {action}
            </Button>
          ))}
        </div>

        {/* AI Explanation */}
{showResult && (
  <div className="space-y-4">
    <div className="p-4 bg-card/50 rounded-lg border border-border">
      <div className="flex items-start gap-2 mb-2">
        <Brain className="h-4 w-4 text-primary mt-0.5" />
        <span className="text-sm font-medium">AI Explanation:</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {currentScenario.aiExplanation}
      </p>
    </div>

    {selectedAction === currentScenario.correctAction && (
      <div className="p-4 bg-gradient-safe/10 rounded-lg border border-cyber-green">
        <div className="flex items-start gap-2 mb-2">
          <Shield className="h-4 w-4 text-cyber-green mt-0.5" />
          <span className="text-sm font-medium text-cyber-green">Reinforcement Learning:</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {currentScenario.reinforcementFeedback}
        </p>
      </div>
    )}
  </div>
)}


        {/* Controls */}
        <div className="flex gap-2">
          {showResult ? (
            <Button 
              onClick={nextScenario}
              className="flex-1 bg-gradient-cyber hover:shadow-cyber"
            >
              Next Scenario
            </Button>
          ) : (
            <div className="flex-1 opacity-50">
              <Button disabled className="w-full">
                Select an action above
              </Button>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={resetSimulation}
            className="border-muted hover:bg-muted/50"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Scenario Progress</span>
            <span>{scenarioIndex + 1} / {threatScenarios.length}</span>
          </div>
          <Progress value={(scenarioIndex + 1) / threatScenarios.length * 100} />
        </div>
      </CardContent>
    </Card>
  );
};