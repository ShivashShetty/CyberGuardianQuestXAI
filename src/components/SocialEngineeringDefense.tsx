// Example phrases for randomization
const EXAMPLE_PHRASES = [
  // Bad (phishing/social engineering)
  "Your account has been suspended. Please click here to verify your information immediately.",
  "Congratulations! You've won a $1000 gift card. Provide your bank details to claim.",
  "We detected unusual activity. Reset your password now to avoid being locked out.",
  "Dear user, your tax refund is ready. Submit your login credentials to receive it.",
  "Urgent: Your PayPal account will be closed unless you confirm your billing information.",
  // Good (ham/legit)
  "Hey, are we still on for lunch tomorrow at 1pm?",
  "Please find attached the meeting agenda for next week.",
  "Happy birthday! Hope you have a wonderful day.",
  "Let me know if you need any help with the project.",
  "Thanks for your payment. Your order has been shipped."
];
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Sparkles, Lock, Eye, AlertCircle, Info } from "lucide-react";

interface AnalysisResult {
  risk_score: number;
  detected_tactics: string[];
  tactic_scores: Record<string, number>;
}

const API_URL = "http://localhost:8082/analyze-email";

export default function SocialEngineeringDefense() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Decrease sensitivity: use risk score as-is, with minimal adjustment for demo
  const fudgeRisk = (risk: number) => {
    // Only add a tiny bit of noise for demo, but keep close to model output
    return Math.max(0, Math.min(1, risk + (Math.random() - 0.5) * 0.04));
  };

  const analyzeEmail = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setShowHelp(false);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: email }),
      });
      if (!res.ok) throw new Error("Sorry, the AI backend is not responding.");
      const data = await res.json();
      data.risk_score = fudgeRisk(data.risk_score);
      setResult(data);
    } catch (e: any) {
      setError("Unable to analyze. Please check your internet connection or try again later.");
      setShowHelp(true);
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  // 0-0.39: green, 0.4-0.69: yellow, 0.7-1: red
  const getThreatLevel = (risk: number) => {
    if (risk >= 0.7) return { label: "High", color: "bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 animate-gradient-x", icon: <AlertTriangle className="inline w-6 h-6 text-red-600 animate-bounce mr-1" /> };
    if (risk >= 0.4) return { label: "Medium", color: "bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 animate-gradient-x", icon: <Sparkles className="inline w-6 h-6 text-yellow-500 animate-pulse mr-1" /> };
    return { label: "Low", color: "bg-gradient-to-r from-green-500 via-cyan-400 to-blue-400 animate-gradient-x", icon: <ShieldCheck className="inline w-6 h-6 text-green-600 animate-spin-slow mr-1" /> };
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6 text-cyber-green" />
          <h2 className="text-xl font-bold text-cyber-orange">Social Engineering Defense</h2>
          <span className="text-xs text-muted-foreground">(Local LLM)</span>
        </div>
        <div className="flex gap-2 mb-4">
          <Textarea
            className="flex-1 text-base p-3 rounded-lg border border-cyber-orange focus:ring-2 focus:ring-cyber-orange/40 transition-all duration-200"
            rows={5}
            placeholder="Paste an email or message to analyze..."
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            type="button"
            className="h-fit px-3 py-2 bg-cyber-orange hover:bg-orange-500 rounded-lg font-semibold shadow-sm transition-transform duration-200 hover:scale-105"
            onClick={() => setEmail(EXAMPLE_PHRASES[Math.floor(Math.random() * EXAMPLE_PHRASES.length)])}
          >
            Randomize
          </Button>
        </div>
        <Button
          onClick={analyzeEmail}
          disabled={loading || !email.trim()}
          className="w-full mb-2 px-6 py-2 text-base font-bold bg-cyber-orange hover:bg-orange-500 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" /> Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Analyze
            </span>
          )}
        </Button>
        {error && (
          <div className="text-red-600 mt-2 text-sm animate-fade-in">
            {error}
            {showHelp && (
              <div className="mt-2 p-3 bg-orange-50 border-l-4 border-orange-400 rounded text-orange-800 text-xs animate-fade-in">
                <b>Troubleshooting tips:</b>
                <ul className="list-disc ml-4 mt-1">
                  <li>Make sure the AI backend is running (<code>npm start</code>).</li>
                  <li>Check your internet connection.</li>
                  <li>Wait a few seconds after starting the backend.</li>
                  <li>If the problem persists, check backend logs.</li>
                </ul>
              </div>
            )}
          </div>
        )}
        {result && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-base">Threat Level:</span>
              <span className={`px-3 py-1 rounded-lg text-white text-sm font-bold flex items-center gap-2 shadow-sm border border-white/30 ${getThreatLevel(result.risk_score).color}`}
              >
                {getThreatLevel(result.risk_score).icon}
                {getThreatLevel(result.risk_score).label}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">({(result.risk_score * 100).toFixed(0)}%)</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-4 transition-all duration-500 ${
                  result.risk_score >= 0.7
                    ? 'bg-red-600'
                    : result.risk_score >= 0.4
                      ? 'bg-yellow-400'
                      : 'bg-green-500'
                }`}
                style={{ width: `${Math.max(5, result.risk_score * 100)}%` }}
              />
            </div>
            <div className="mt-4">
              <span className="font-semibold text-sm">Detected Tactics:</span>
              {result.detected_tactics.length ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.detected_tactics.map(t => (
                    <Badge key={t} variant="outline" className="text-xs px-3 py-1 border-cyber-orange bg-orange-100/60 hover:bg-orange-200 transition-colors duration-200 cursor-pointer">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="ml-2 text-xs">None</span>
              )}
            </div>
            <div className="mt-3">
              <span className="font-semibold text-sm">Tactic Scores:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.entries(result.tactic_scores).map(([t, s]) => (
                  <Badge key={t} variant="secondary" className="text-xs px-3 py-1 bg-cyan-100/60 border-cyber-orange hover:bg-cyan-200 transition-colors duration-200 cursor-pointer">
                    {t}: {s.toFixed(2)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-6">
              {result.risk_score >= 0.7 && (
                <div className="text-red-700 text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  Highly suspicious message!
                </div>
              )}
              {result.risk_score < 0.7 && result.risk_score >= 0.4 && (
                <div className="text-yellow-700 text-base font-semibold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  Some phishing tactics detected.
                </div>
              )}
              {result.risk_score < 0.4 && (
                <div className="text-green-700 text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 animate-spin-slow" />
                  Looks safe, but stay vigilant.
                </div>
              )}
            </div>

            {/* Safety Tips Section */}
            {result.risk_score >= 0.4 && (
              <Card className="mt-6 p-4 border-l-4 border-cyber-orange bg-card/90 animate-fade-in shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-cyber-orange" />
                  <h3 className="font-bold text-lg text-cyber-orange">Safety Tips</h3>
                </div>
                
                {result.risk_score >= 0.7 ? (
                  // High risk tips
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 mt-1 text-red-400" />
                      <p className="text-sm text-foreground">Never provide sensitive information (passwords, bank details, SSN) through email links.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-1 text-red-400" />
                      <p className="text-sm text-foreground">Report this message to your IT department or email provider's phishing team.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 mt-1 text-red-400" />
                      <p className="text-sm text-foreground">Check sender emails carefully - legitimate companies won't use public email domains.</p>
                    </div>
                    <div className="mt-4 p-3 bg-red-950/20 rounded-lg border border-red-400/30">
                      <p className="text-xs text-red-400 font-medium">🚨 This message shows strong signs of being a phishing attempt. Do not interact with any links or attachments.</p>
                    </div>
                  </div>
                ) : (
                  // Medium risk tips
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 mt-1 text-yellow-400" />
                      <p className="text-sm text-foreground">Verify the sender's email address and check for spelling mistakes or unusual domains.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 mt-1 text-yellow-400" />
                      <p className="text-sm text-foreground">If unsure, contact the sender through a known, verified channel instead of replying to this email.</p>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-950/20 rounded-lg border border-yellow-400/30">
                      <p className="text-xs text-yellow-400 font-medium">⚠️ Exercise caution with this message. When in doubt, verify through official channels.</p>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,2,.3,1) both; }
        @keyframes spin-slow { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        .animate-spin-slow { animation: spin-slow 2.5s linear infinite; }
      `}</style>
    </div>
  );
}
