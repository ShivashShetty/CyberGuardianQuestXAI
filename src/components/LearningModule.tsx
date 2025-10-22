import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Lightbulb, Target, Timer, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  icon: React.ComponentType<any>;
}

interface Props {
  module: Module;
  onComplete: (moduleId: string, xpGained: number) => void;
  isCompleted: boolean;
}

const moduleQuestions: Record<string, Question[]> = {
  'phishing': [
    {
      id: 'phishing-1',
      question: 'Which of these is a common sign of a phishing email?',
      options: [
        'Personalized greeting with your full name',
        'Urgent language demanding immediate action',
        'Email from a known contact',
        'No attachments or links'
      ],
      correctAnswer: 1,
      explanation: 'Phishing emails often use urgent language to pressure victims into acting quickly without thinking carefully.',
      difficulty: 'easy'
    },
    {
      id: 'phishing-2',
      question: 'What should you do if you receive a suspicious email asking for your password?',
      options: [
        'Reply with your password',
        'Click the link to verify',
        'Delete the email and contact the organization directly',
        'Forward it to colleagues'
      ],
      correctAnswer: 2,
      explanation: 'Never provide credentials through email. Always verify requests through official channels.',
      difficulty: 'easy'
    },
    {
      id: 'phishing-3',
      question: 'How can you verify if a link in an email is legitimate?',
      options: [
        'Click it to see where it goes',
        'Hover over it to see the actual URL',
        'Trust the sender',
        'Check if it has https://'
      ],
      correctAnswer: 1,
      explanation: 'Hovering over links reveals the actual destination URL, helping you spot suspicious domains.',
      difficulty: 'medium'
    },
    {
      id: 'phishing-4',
      question: 'Which action increases the chance of falling for phishing?',
      options: [
      'Using a password manager',
      'Ignoring spam emails',
      'Clicking unknown links quickly',
      'Reporting suspicious emails'
    ],
      correctAnswer: 2,
      explanation: 'Quickly clicking links without verifying is risky.',
      difficulty: 'medium'
    },
    {
      id: 'phishing-5',
      question: 'What technique do attackers use to make emails look genuine?',
      options: [
      'Email spoofing',
      'Brute force attacks',
      'Keylogging',
      'Pharming'
    ],
      correctAnswer: 0,
      explanation: 'Spoofing mimics trusted sources in the "From" address.',
      difficulty: 'hard'
    },
    {
      id: 'phishing-6',
      question: 'Why are phishing attacks hard to detect?',
      options: [
      'They use DDoS methods',
      'They exploit human psychology',
      'They rely on malware injections',
      'They can’t be blocked by filters'
    ],
      correctAnswer: 1,
      explanation: 'Phishing tricks rely on manipulating human behavior.',
      difficulty: 'medium'
    },
    {
      id: 'phishing-7',
      question: 'Which of the following is a spear-phishing attempt?',
      options: [
      'Mass email from a bank',
      'Personalized email using your job role and name',
      'Ad popup on a website',
      'Spam email with no content'
    ],
      correctAnswer: 1,
      explanation: 'Spear phishing is highly targeted and personalized.',
      difficulty: 'hard'
    },
  ],
  'password': [
    {
      id: 'password-1',
      question: 'What makes a password strong?',
      options: [
        'Using your name and birthday',
        'At least 8 characters with mixed case, numbers, and symbols',
        'Using the same password everywhere',
        'Using dictionary words'
      ],
      correctAnswer: 1,
      explanation: 'Strong passwords combine length, complexity, and uniqueness to resist attacks.',
      difficulty: 'easy'
    },
    {
      id: 'password-2',
      question: 'What is the primary benefit of using a password manager?',
      options: [
        'Remembering passwords for you',
        'Generating and storing unique passwords',
        'Sharing passwords with colleagues',
        'Backing up passwords online'
      ],
      correctAnswer: 1,
      explanation: 'Password managers generate unique, strong passwords for each account and store them securely.',
      difficulty: 'medium'
    },
    {
      id: 'password-3',
      question: 'How often should you update passwords?',
      options: [
        'Only if hacked',
        'Never, if it’s strong',
        'Periodically, especially for sensitive accounts',
        'Every day'
      ],
      correctAnswer: 2,
      explanation: 'Regular changes help prevent unauthorized access.',
      difficulty: 'medium'
    },
    {
      id: 'password-4',
      question: 'Which is the weakest password below?',
      options: [
        'P@ssw0rd2021!',
        '12345678',
        'IloveCoffee88!',
        'K0p!Um$'
      ],
      correctAnswer: 1,
      explanation: 'Simple number sequences are easily cracked.',
      difficulty: 'easy'
    },
    {
      id: 'password-5',
      question: 'What is credential stuffing?',
      options: [
        'Creating random passwords',
        'Guessing passwords',
        'Using stolen credentials across sites',
        'Encrypting passwords'
      ],
      correctAnswer: 2,
      explanation: 'It involves using leaked credentials on multiple services.',
      difficulty: 'hard'
    },
    {
      id: 'password-6',
      question: 'Why is reusing passwords dangerous?',
      options: [
        'It’s not dangerous',
        'One breach compromises multiple accounts',
        'It’s hard to remember',
        'They expire quickly'
      ],
      correctAnswer: 1,
      explanation: 'Reuse opens you to cross-site attacks.',
      difficulty: 'medium'
    },
    {
      id: 'password-7',
      question: 'Which method offers the best password protection?',
      options: [
        'Two-factor authentication',
        'Changing it every day',
        'Avoiding long passwords',
        'Using the same one on all devices'
      ],
      correctAnswer: 0,
      explanation: '2FA adds an extra security layer.',
      difficulty: 'hard'
    }
  ],
  'social-engineering': [
    {
      id: 'social-1',
      question: 'What is social engineering in cybersecurity?',
      options: [
        'Technical hacking methods',
        'Manipulating people to divulge confidential information',
        'Network security protocols',
        'Software development practices'
      ],
      correctAnswer: 1,
      explanation: 'Social engineering exploits human psychology rather than technical vulnerabilities.',
      difficulty: 'easy'
    },
    {
      id: 'social-2',
      question: 'Which technique do social engineers commonly use?',
      options: [
        'SQL injection',
        'Creating a sense of urgency',
        'Buffer overflow',
        'Cross-site scripting'
      ],
      correctAnswer: 1,
      explanation: 'Creating urgency prevents victims from thinking critically about requests.',
      difficulty: 'medium'
    },
    {
      id: 'social-3',
      question: 'Which of the following is *not* social engineering?',
      options: [
        'Phishing call',
        'Tailgating',
        'DDoS attack',
        'Baiting with USB drives'
      ],
      correctAnswer: 2,
      explanation: 'DDoS is a technical attack, not psychological.',
      difficulty: 'medium'
    },
    {
      id: 'social-4',
      question: 'What is pretexting?',
      options: [
        'Creating a fake scenario to extract data',
        'Predicting user passwords',
        'Guessing email addresses',
        'Encrypting messages'
      ],
      correctAnswer: 0,
      explanation: 'Pretexting uses fake identities to gain trust.',
      difficulty: 'hard'
    },
    {
      id: 'social-5',
      question: 'How do attackers use baiting?',
      options: [
        'Threatening users',
        'Offering fake rewards or USBs',
        'Spoofing identities',
        'Flooding networks'
      ],
      correctAnswer: 1,
      explanation: 'Victims are lured with something enticing.',
      difficulty: 'easy'
    },
    {
      id: 'social-6',
      question: 'What’s the best way to resist social engineering?',
      options: [
        'Using a firewall',
        'Being alert and verifying identities',
        'Ignoring emails',
        'Using a password manager'
      ],
      correctAnswer: 1,
      explanation: 'Awareness and verification are key defenses.',
      difficulty: 'easy'
    },
    {
      id: 'social-7',
      question: 'What’s tailgating in cybersecurity?',
      options: [
        'Flooding a server',
        'Sending multiple emails',
        'Using fake antivirus alerts',
        'Following someone into a restricted area'
      ],
      correctAnswer: 3,
      explanation: 'It’s a physical breach technique.',
      difficulty: 'hard'
    }
  ],
  'malware': [
    {
      id: 'malware-1',
      question: 'What is the best defense against malware?',
      options: [
        'Using antivirus software only',
        'Layered security approach with multiple defenses',
        'Avoiding the internet',
        'Using only mobile devices'
      ],
      correctAnswer: 1,
      explanation: 'Effective malware defense requires multiple layers including antivirus, firewalls, and safe browsing practices.',
      difficulty: 'medium'
    },
    {
      id: 'malware-2',
      question: 'What should you do if you suspect malware infection?',
      options: [
        'Continue using the system normally',
        'Disconnect from network and run security scans',
        'Delete all files',
        'Restart the computer'
      ],
      correctAnswer: 1,
      explanation: 'Isolating the infected system prevents malware spread while security tools can assess and clean the threat.',
      difficulty: 'hard'
    },
    {
      id: 'malware-3',
      question: 'Which of these is a type of malware?',
      options: [
        'Phishing',
        'Spyware',
        '2FA',
        'VPN'
      ],
      correctAnswer: 1,
      explanation: 'Spyware secretly monitors and steals data.',
      difficulty: 'easy'
    },
    {
      id: 'malware-4',
      question: 'What is a zero-day vulnerability?',
      options: [
        'An outdated antivirus',
        'Unknown flaw exploited before a patch',
        'Virus lasting zero days',
        'Expired certificate'
      ],
      correctAnswer: 1,
      explanation: 'Zero-day = no time to patch before attack.',
      difficulty: 'hard'
    },
    {
      id: 'malware-5',
      question: 'What should you do if you suspect malware?',
      options: [
        'Keep using the system',
        'Disconnect and scan',
        'Restart the device',
        'Restart the device'
      ],
      correctAnswer: 1,
      explanation: 'Isolate, analyze, then remediate.',
      difficulty: 'medium'
    },
    {
      id: 'malware-6',
      question: 'Which malware encrypts files for ransom?',
      options: [
        'Trojan',
        'Spyware',
        'Ransomware',
        'Adware'
      ],
      correctAnswer: 2,
      explanation: 'Ransomware demands payment to unlock data.',
      difficulty: 'hard'
    },
    {
      id: 'malware-7',
      question: 'How does a Trojan horse attack work?',
      options: [
        'Through brute force',
        'By pretending to be useful software',
        'Via email links',
        'Over WiFi'
      ],
      correctAnswer: 1,
      explanation: 'Trojans disguise themselves as legitimate programs.',
      difficulty: 'medium'
    },
  ]
};

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const LearningModule: React.FC<Props> = ({ module, onComplete, isCompleted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const { toast } = useToast();

  const questions = shuffledQuestions.length > 0 ? shuffledQuestions : moduleQuestions[module.id] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleModuleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startModule = () => {
    // Shuffle questions and their options
    const originalQuestions = moduleQuestions[module.id] || [];
    const shuffled = originalQuestions.map(question => {
      const correctAnswer = question.options[question.correctAnswer];
      const shuffledOptions = shuffleArray(question.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
      
      return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex
      };
    });
    
    setShuffledQuestions(shuffleArray(shuffled));
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(300);
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const answerIndex = parseInt(selectedAnswer);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer('');
        setShowResult(false);
      } else {
        handleModuleComplete();
      }
    }, 4000);
  };

  const handleModuleComplete = () => {
    setIsActive(false);
    const percentage = (score / questions.length) * 100;
    const xpGained = Math.floor((percentage / 100) * module.xpReward);
    
    onComplete(module.id, xpGained);
    
    toast({
      title: `Module Complete! ${percentage >= 80 ? '🎉' : '📚'}`,
      description: `Score: ${score}/${questions.length} (${percentage.toFixed(0)}%)`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-cyber-green';
      case 'medium': return 'text-cyber-orange';
      case 'hard': return 'text-threat-red';
      default: return 'text-muted-foreground';
    }
  };

  if (isCompleted) {
    return (
      <Card className="border-cyber-green bg-gradient-safe/10">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-cyber-green mx-auto mb-2" />
          <CardTitle className="text-cyber-green">Module Completed!</CardTitle>
          <p className="text-sm text-muted-foreground">
            You've mastered {module.title}. Great work!
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Badge className="bg-gradient-safe text-black">
            <Award className="h-4 w-4 mr-1" />
            +{module.xpReward} XP Earned
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (!isActive) {
    return (
      <Card>
        <CardHeader className="text-center">
          <module.icon className="h-12 w-12 text-primary mx-auto mb-2" />
          <CardTitle>{module.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyber-orange">{module.xpReward}</div>
              <div className="text-sm text-muted-foreground">Max XP</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Difficulty:</span>
              <Badge variant="outline" className={`${
                module.difficulty === 'Beginner' ? 'border-cyber-green' :
                module.difficulty === 'Intermediate' ? 'border-cyber-orange' :
                'border-threat-red'
              }`}>
                {module.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Limit:</span>
              <span className="font-mono">5:00</span>
            </div>
          </div>

          <Button
            onClick={startModule}
            className="w-full bg-gradient-cyber hover:shadow-cyber"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Module
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{module.title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-cyber-orange" />
              <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {currentQuestion && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1}</span>
              </div>

              <h3 className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
              </h3>

              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg border ${
                parseInt(selectedAnswer) === currentQuestion.correctAnswer
                  ? 'bg-gradient-safe/10 border-cyber-green'
                  : 'bg-gradient-threat/10 border-threat-red'
              }`}>
                <div className="flex items-start gap-2 mb-2">
                  {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-cyber-green mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-threat-red mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || showResult}
              className="w-full bg-gradient-cyber hover:shadow-cyber"
            >
              {showResult ? 'Loading next question...' : 'Submit Answer'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};