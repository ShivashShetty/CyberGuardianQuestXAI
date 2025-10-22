# CyberGuard Academy - Component Documentation

## 📋 Component Overview

This document provides comprehensive documentation for all components in the CyberGuard Academy application, including their props, state management, and usage patterns.

## 🎯 Main Application Components

### Index (src/pages/Index.tsx)

The main page component that orchestrates the entire application experience.

**Purpose**: Serves as the primary application page, managing user progress and coordinating all major sections.

**State Management**:
```typescript
interface IndexState {
  userLevel: number;           // Current user level
  userXP: number;              // Experience points
  currentModule: string | null; // Active learning module
  completedModules: Set<string>; // Completed modules
  gameStats: {                 // Game performance statistics
    highScore: number;
    wavesCompleted: number;
    threatsEliminated: number;
  };
}
```

**Key Features**:
- User progress tracking across all activities
- Module management and progression
- Achievement system integration
- Game statistics aggregation

**Event Handlers**:
```typescript
// Game completion handler
const handleGameComplete = (score: number, level: number, wave: number) => {
  setGameStats(prev => ({
    ...prev,
    highScore: Math.max(prev.highScore, score),
    wavesCompleted: Math.max(prev.wavesCompleted, wave),
  }));
  // Award XP based on performance
  const xpGained = score / 10 + wave * 5;
  setUserXP(prev => prev + xpGained);
  // Level up logic
  checkLevelUp();
};

// Module completion handler
const handleModuleComplete = (moduleId: string, xpGained: number) => {
  setCompletedModules(prev => new Set([...prev, moduleId]));
  setUserXP(prev => prev + xpGained);
  setCurrentModule(null);
  checkLevelUp();
};
```

## 🎮 Game Components

### CyberDefenseGame (src/components/CyberDefenseGame.tsx)

The main interactive tower defense game component.

**Props Interface**:
```typescript
interface CyberDefenseGameProps {
  onGameComplete?: (score: number, level: number, wave: number) => void;
}
```

**State Management**:
```typescript
interface GameState {
  // Core metrics
  score: number;
  level: number;
  health: number;
  maxHealth: number;
  
  // Game entities
  threats: Threat[];
  defenses: Defense[];
  powerUps: PowerUp[];
  
  // Game control
  gameRunning: boolean;
  gameOver: boolean;
  wave: number;
  nextWaveIn: number;
  
  // Advanced features
  money: number;
  threatsKilled: number;
  accuracy: number;
  comboMultiplier: number;
  lastKillTime: number;
}
```

**Core Game Entities**:

#### Threat Interface
```typescript
interface Threat {
  id: string;
  type: 'virus' | 'phishing' | 'malware' | 'ddos' | 'ransomware' | 'trojan';
  x: number;
  y: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;
  size: number;
  direction: number;
  reward: number;
  stunned: number;  // Stun effect duration
}
```

#### Defense Interface
```typescript
interface Defense {
  id: string;
  type: 'firewall' | 'antivirus' | 'encryption' | 'backup' | 'scanner' | 'honeypot';
  x: number;
  y: number;
  range: number;
  damage: number;
  cooldown: number;
  maxCooldown: number;
  color: string;
  size: number;
  level: number;      // Defense upgrade level
  kills: number;      // Kills for this defense
  specialEffect?: string; // Special abilities
}
```

**Game Configuration**:
```typescript
const threatTypes = {
  virus: { color: '#ff4444', size: 20, speed: 2, health: 30, damage: 15, reward: 25 },
  phishing: { color: '#ff8800', size: 25, speed: 1.5, health: 20, damage: 10, reward: 20 },
  malware: { color: '#aa44ff', size: 30, speed: 1, health: 50, damage: 25, reward: 40 },
  ddos: { color: '#4444ff', size: 35, speed: 3, health: 40, damage: 20, reward: 35 },
  ransomware: { color: '#ff0080', size: 40, speed: 0.8, health: 80, damage: 35, reward: 60 },
  trojan: { color: '#008080', size: 15, speed: 4, health: 15, damage: 8, reward: 15 },
};

const defenseTypes = {
  firewall: { color: '#00ff00', size: 40, range: 80, damage: 25, cooldown: 30, cost: 50 },
  antivirus: { color: '#00ffff', size: 35, range: 60, damage: 35, cooldown: 45, cost: 75 },
  encryption: { color: '#ffff00', size: 30, range: 100, damage: 20, cooldown: 20, cost: 100 },
  backup: { color: '#ff00ff', size: 25, range: 50, damage: 15, cooldown: 15, cost: 30 },
  scanner: { color: '#ff6600', size: 32, range: 70, damage: 30, cooldown: 35, cost: 90 },
  honeypot: { color: '#9966ff', size: 28, range: 90, damage: 40, cooldown: 60, cost: 120 },
};
```

**Key Methods**:
```typescript
// Spawn new threats for a wave
const spawnWave = useCallback((waveNumber: number) => {
  const threatCount = Math.min(3 + waveNumber * 2, 15);
  // Staggered spawning logic
});

// Main game update loop
const updateGame = useCallback(() => {
  // Update threat positions and states
  // Process defense attacks
  // Handle collisions and effects
  // Update game progression
});

// Handle canvas click for defense placement
const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  // Validate placement position
  // Check cost requirements
  // Create and place defense
  // Update game state
};
```

**Canvas Rendering**:
```typescript
const draw = useCallback(() => {
  const ctx = canvas.getContext('2d');
  
  // Clear and prepare canvas
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Draw game grid
  // Render defenses with range indicators
  // Render threats with health bars
  // Draw particle effects
  // Show placement preview
  // Display game over screen if needed
});
```

## 📚 Educational Components

### LearningModule (src/components/LearningModule.tsx)

Interactive learning content delivery system.

**Props Interface**:
```typescript
interface LearningModuleProps {
  module: {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    xpReward: number;
    color: string;
    icon: React.ComponentType;
  };
  isCompleted: boolean;
  isLocked: boolean;
  onStart: (moduleId: string) => void;
  onComplete: (moduleId: string, xpGained: number) => void;
}
```

**Features**:
- Progressive content delivery
- Interactive quiz integration
- XP reward system
- Visual progress indicators
- Prerequisite checking

### ProgressDashboard (src/components/ProgressDashboard.tsx)

Comprehensive progress tracking and analytics display.

**Props Interface**:
```typescript
interface ProgressDashboardProps {
  userLevel: number;
  userXP: number;
  completedModules: number;
  totalModules: number;
  gameStats: {
    highScore: number;
    wavesCompleted: number;
    threatsEliminated: number;
  };
  achievements: Achievement[];
}
```

**Visual Components**:
- Circular progress indicators
- XP and level display
- Achievement gallery
- Statistics charts
- Performance trends

### AIExplainer (src/components/AIExplainer.tsx)

AI-powered cybersecurity concept explanation system.

**Props Interface**:
```typescript
interface AIExplainerProps {
  onExplanationRequest?: (topic: string) => void;
}
```

**Features**:
- Interactive Q&A interface
- Cybersecurity concept explanations
- Context-aware responses
- Visual explanation aids

### ThreatSimulator (src/components/ThreatSimulator.tsx)

Interactive demonstration of cybersecurity threats.

**Props Interface**:
```typescript
interface ThreatSimulatorProps {
  onSimulationComplete?: (threatType: string, success: boolean) => void;
}
```

**Simulation Types**:
- Phishing email detection
- Malware behavior patterns
- Network intrusion scenarios
- Social engineering attempts

## 🎨 UI Components (shadcn/ui)

### Button (src/components/ui/button.tsx)

Flexible button component with multiple variants.

**Props Interface**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Variants**:
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
  }
);
```

### Card (src/components/ui/card.tsx)

Container component for content organization.

**Sub-components**:
```typescript
// Card container
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
);

// Card header section
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(...);

// Card title
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(...);

// Card description
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(...);

// Card content area
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(...);

// Card footer section
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(...);
```

### Progress (src/components/ui/progress.tsx)

Visual progress indicator component.

**Props Interface**:
```typescript
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;        // Progress value (0-100)
  max?: number;          // Maximum value
  getValueLabel?: (value: number, max: number) => string;
}
```

**Usage Examples**:
```typescript
// Basic progress bar
<Progress value={75} className="h-2" />

// Health bar with custom styling
<Progress 
  value={(health / maxHealth) * 100} 
  className="h-3 bg-red-100"
  style={{ '--progress-background': 'hsl(var(--destructive))' }}
/>

// XP progress with label
<Progress 
  value={xpProgress} 
  getValueLabel={(value, max) => `${value}/${max} XP`}
/>
```

### Badge (src/components/ui/badge.tsx)

Small status indicators and labels.

**Variants**:
```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
  }
);
```

### Toast (src/components/ui/toast.tsx)

Notification system for user feedback.

**Usage with Hook**:
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// Success notification
toast({
  title: "Defense Deployed! 🛡️",
  description: "Firewall successfully placed",
});

// Error notification
toast({
  title: "Insufficient Funds 💰",
  description: "Need more money to place this defense",
  variant: "destructive",
});

// Achievement notification
toast({
  title: "Achievement Unlocked! 🏆",
  description: "First line of defense established",
});
```

## 🔧 Custom Hooks

### useToast (src/hooks/use-toast.ts)

Toast notification management hook.

**Interface**:
```typescript
interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: 'default' | 'destructive';
}

interface UseToastReturn {
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (toastId?: string) => void;
  toasts: Toast[];
}
```

### useMobile (src/hooks/use-mobile.tsx)

Mobile device detection hook.

**Usage**:
```typescript
const isMobile = useMobile();

// Conditional rendering based on device type
{isMobile ? (
  <MobileGameControls />
) : (
  <DesktopGameControls />
)}
```

## 📱 Responsive Behavior

### Breakpoint Adaptations

**Mobile (< 768px)**:
- Single column layouts
- Touch-optimized controls
- Simplified game interface
- Compact component spacing

**Tablet (768px - 1024px)**:
- Two column layouts where appropriate
- Enhanced touch targets
- Medium complexity interfaces
- Balanced content density

**Desktop (> 1024px)**:
- Multi-column layouts
- Full feature sets
- Hover interactions
- Dense information display

### Component Responsive Patterns

```typescript
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {modules.map(module => (
    <LearningModule key={module.id} {...module} />
  ))}
</div>

// Responsive text sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  CyberGuard Academy
</h1>

// Responsive canvas sizing
<canvas
  style={{ 
    maxWidth: '100%', 
    height: 'auto',
    aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`
  }}
/>
```

## 🎯 Accessibility Features

### ARIA Labels and Roles
```typescript
// Game canvas accessibility
<canvas
  role="application"
  aria-label="Cyber Defense Game - Interactive cybersecurity tower defense"
  aria-describedby="game-instructions"
/>

// Progress indicators
<Progress
  value={75}
  aria-label="Learning progress"
  aria-valuetext="75% complete"
/>

// Interactive buttons
<Button
  aria-label="Place firewall defense"
  aria-describedby="firewall-description"
>
  Firewall
</Button>
```

### Keyboard Navigation
- Tab order optimization
- Focus indicators
- Keyboard shortcuts for game controls
- Screen reader friendly announcements

### Color and Contrast
- WCAG AA compliance
- High contrast mode support
- Color-blind friendly palettes
- Alternative visual indicators

## 🔄 State Management Patterns

### Lifting State Up
```typescript
// Parent component manages shared state
const [userProgress, setUserProgress] = useState(initialProgress);

// Pass down to children
<LearningModule 
  progress={userProgress.modules}
  onProgress={updateModuleProgress}
/>
<ProgressDashboard 
  progress={userProgress}
/>
```

### Controlled vs Uncontrolled Components
```typescript
// Controlled component example
const [selectedDefense, setSelectedDefense] = useState('firewall');

<DefenseSelector
  value={selectedDefense}
  onChange={setSelectedDefense}
/>

// Uncontrolled component with ref
const gameCanvasRef = useRef<HTMLCanvasElement>(null);

<canvas ref={gameCanvasRef} />
```

This comprehensive component documentation provides the foundation for understanding, maintaining, and extending the CyberGuard Academy application.