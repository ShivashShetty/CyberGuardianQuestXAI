import React, { useState } from 'react';
import { Brain, Eye, Target, Zap, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AIExplanation {
  id: string;
  topic: string;
  userQuery: string;
  explanation: string;
  confidence: number;
  reasoning: string[];
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const sampleExplanations: AIExplanation[] = [
  {
    id: 'phishing-detection',
    topic: 'Phishing Detection',
    userQuery: 'How can I identify phishing emails?',
    explanation:
      'Phishing emails often contain urgent language, suspicious links, and requests for sensitive information. Look for generic greetings, spelling errors, and mismatched sender domains.',
    confidence: 95,
    reasoning: [
      'Pattern analysis of known phishing campaigns',
      'Linguistic analysis of email content',
      'Domain reputation and authenticity checks',
      'Behavioral indicators from user interactions',
    ],
    relatedConcepts: ['Email Security', 'Social Engineering', 'Domain Spoofing'],
    difficulty: 'beginner',
  },
  {
    id: 'password-strength',
    topic: 'Password Security',
    userQuery: 'What makes a password strong?',
    explanation:
      'Strong passwords combine length, complexity, and uniqueness. Use 12+ characters with mixed case, numbers, and symbols. Avoid dictionary words and personal information.',
    confidence: 98,
    reasoning: [
      'Entropy calculations for password strength',
      'Analysis of common password patterns',
      'Brute force resistance metrics',
      'Dictionary attack vulnerability assessment',
    ],
    relatedConcepts: ['Cryptography', 'Authentication', 'Multi-factor Authentication'],
    difficulty: 'beginner',
  },
  {
    id: 'zero-trust',
    topic: 'Zero Trust Architecture',
    userQuery: 'Explain zero trust security model',
    explanation:
      'Zero Trust assumes no implicit trust within the network. Every access request is verified regardless of location, requiring continuous authentication and authorization.',
    confidence: 92,
    reasoning: [
      'Network segmentation analysis',
      'Identity and access management principles',
      'Continuous monitoring requirements',
      'Least privilege access controls',
    ],
    relatedConcepts: ['Network Security', 'Identity Management', 'Micro-segmentation'],
    difficulty: 'advanced',
  },
];

export const AIExplainer = () => {
  const [currentExplanation, setCurrentExplanation] = useState<AIExplanation>(sampleExplanations[0]);
  const [userQuery, setUserQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanationHistory, setExplanationHistory] = useState<AIExplanation[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQuerySubmit = async () => {
    if (!userQuery.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          response.status === 429 || data?.error?.message?.includes('rate-limited')
            ? 'Too many requests — please try again shortly.'
            : data?.error || 'AI backend returned an error.';

        toast({
          title: 'AI Error',
          description: errorMsg,
          variant: 'destructive',
        });

        setIsGenerating(false);
        return;
      }

      const aiResponse = data.answer || 'No answer received.';

      const aiExplanation: AIExplanation = {
        id: Date.now().toString(),
        topic: 'AI Generated Response',
        userQuery,
        explanation: aiResponse,
        confidence: 93,
        reasoning: [
          'Kimi (OpenRouter) response from backend',
          'Contextual understanding of cybersecurity terms',
          'Secure AI backend processing',
          'Cyber-relevant knowledge synthesis',
        ],
        relatedConcepts: ['Cybersecurity', 'AI Reasoning', 'Kimi AI'],
        difficulty: 'intermediate',
      };

      setCurrentExplanation(aiExplanation);
      setExplanationHistory(prev => [aiExplanation, ...prev.slice(0, 4)]);
      setUserQuery('');
      toast({ title: 'AI Explanation Ready ✅' });
    } catch (error: any) {
      console.error('Request failed:', error);
      toast({
        title: 'Network Error',
        description: 'Could not connect to AI backend.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPredefinedExplanation = (explanation: AIExplanation) => {
    setCurrentExplanation(explanation);
    setExplanationHistory(prev => {
      const filtered = prev.filter(e => e.id !== explanation.id);
      return [explanation, ...filtered.slice(0, 4)];
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-cyber-green text-black';
      case 'intermediate':
        return 'bg-cyber-orange text-black';
      case 'advanced':
        return 'bg-threat-red text-white';
      default:
        return 'bg-muted';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-cyber-green';
    if (confidence >= 70) return 'text-cyber-orange';
    return 'text-threat-red';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Explainer (XAI)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get transparent, explainable AI insights into cybersecurity concepts
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Query Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Ask the AI
            </h4>
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Ask about any cybersecurity concept..."
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              className="min-h-20"
            />
            <Button
              onClick={handleQuerySubmit}
              disabled={!userQuery.trim() || isGenerating}
              className="w-full bg-gradient-cyber hover:shadow-cyber"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Generating Explanation...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Get AI Explanation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Topics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Quick Topics</h4>
          <div className="grid grid-cols-1 gap-2">
            {sampleExplanations.map(explanation => (
              <Button
                key={explanation.id}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3"
                onClick={() => loadPredefinedExplanation(explanation)}
              >
                <div className="text-left">
                  <div className="font-medium">{explanation.topic}</div>
                  <div className="text-xs text-muted-foreground">{explanation.userQuery}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Explanation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Current Explanation</h4>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(currentExplanation.difficulty)}>
                {currentExplanation.difficulty}
              </Badge>
              <Badge variant="outline" className={getConfidenceColor(currentExplanation.confidence)}>
                {currentExplanation.confidence}% confident
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h5 className="font-medium mb-2">{currentExplanation.topic}</h5>
            <p className="text-sm text-muted-foreground mb-3">
              <em>"{currentExplanation.userQuery}"</em>
            </p>
            <p className="text-sm leading-relaxed">{currentExplanation.explanation}</p>
          </div>
        </div>

        {/* AI Reasoning (XAI) */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            AI Reasoning Process
          </h4>
          <div className="space-y-2">
            {currentExplanation.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-card/50 rounded text-sm">
                <span className="text-primary font-mono">{index + 1}.</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Concepts */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Related Concepts
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentExplanation.relatedConcepts.map(concept => (
              <Badge
                key={concept}
                variant="outline"
                className={`cursor-pointer hover:bg-primary/10 ${
                  selectedConcept === concept ? 'bg-primary/20' : ''
                }`}
                onClick={() => setSelectedConcept(concept)}
              >
                {concept}
              </Badge>
            ))}
          </div>
        </div>

        {/* Explanation History */}
        {explanationHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Recent Explanations</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {explanationHistory.map(explanation => (
                <Button
                  key={explanation.id}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto p-2 w-full"
                  onClick={() => setCurrentExplanation(explanation)}
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">{explanation.topic}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {explanation.userQuery}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
