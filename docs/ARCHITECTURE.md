# CyberGuard Academy - Technical Architecture

## 🏗️ System Architecture Overview

CyberGuard Academy follows a modern React-based single-page application (SPA) architecture with a component-driven design approach.

## 📋 Architecture Principles

### 1. Component-Driven Architecture
- **Atomic Design**: Components built from atoms → molecules → organisms → templates → pages
- **Single Responsibility**: Each component has one clear purpose
- **Composition Over Inheritance**: Complex UIs built by composing simpler components
- **Reusability**: Shared components across different parts of the application

### 2. State Management Strategy
- **Local State**: Component-specific state using React hooks
- **Prop Drilling**: Direct parent-to-child communication for simple cases
- **Context API**: Avoided in favor of explicit prop passing for better performance
- **Game State**: Centralized in main game component with controlled updates

### 3. Performance Architecture
- **Virtual DOM**: React's efficient rendering system
- **Memoization**: Strategic use of useMemo and useCallback
- **Canvas Optimization**: 60 FPS game loop with optimized drawing operations
- **Code Splitting**: Dynamic imports for improved loading performance

## 🔧 Core Technologies

### Frontend Stack
```
React 18.3.1          # UI Framework
TypeScript 5.x        # Type Safety
Vite 5.x              # Build Tool & Dev Server
Tailwind CSS 3.x      # Utility-First Styling
```

### Component Library
```
shadcn/ui             # Accessible UI Components
Radix UI              # Unstyled Accessible Primitives
Lucide React          # Icon System
class-variance-authority # Component Variants
```

### Development Tools
```
ESLint                # Code Linting
TypeScript            # Static Type Checking
Vite HMR              # Hot Module Replacement
```

## 📁 Directory Structure

```
src/
├── components/                 # React Components
│   ├── ui/                    # Base UI Components (shadcn/ui)
│   │   ├── button.tsx         # Button component with variants
│   │   ├── card.tsx           # Card layout component
│   │   ├── progress.tsx       # Progress bar component
│   │   └── ...                # Other UI primitives
│   ├── AIExplainer.tsx        # AI-powered explanation system
│   ├── CyberDefenseGame.tsx   # Main game component
│   ├── LearningModule.tsx     # Educational content delivery
│   ├── ProgressDashboard.tsx  # Analytics and progress tracking
│   └── ThreatSimulator.tsx    # Interactive threat demonstrations
├── pages/                     # Page-Level Components
│   ├── Index.tsx              # Homepage with all sections
│   └── NotFound.tsx           # 404 error page
├── hooks/                     # Custom React Hooks
│   ├── use-mobile.tsx         # Mobile device detection
│   └── use-toast.ts           # Toast notification system
├── lib/                       # Utility Functions
│   └── utils.ts               # Common utility functions
├── assets/                    # Static Assets
│   └── hero-cybersecurity.jpg # Hero section background
├── main.tsx                   # Application entry point
├── App.tsx                    # Root application component
├── App.css                    # Global CSS overrides
├── index.css                  # Tailwind imports & custom CSS
└── vite-env.d.ts             # Vite type definitions
```

## 🎮 Game Architecture

### Canvas-Based Rendering System

```typescript
// Game Loop Architecture
const gameLoop = useCallback((timestamp: number) => {
  if (timestamp - lastTimeRef.current >= 1000 / GAME_SPEED) {
    updateGame();
    lastTimeRef.current = timestamp;
  }
  if (gameState.gameRunning && !gameState.gameOver) {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }
}, [updateGame, gameState.gameRunning, gameState.gameOver]);
```

### Game State Management

```typescript
interface GameState {
  // Core game metrics
  score: number;
  level: number;
  health: number;
  maxHealth: number;
  
  // Game entities
  threats: Threat[];
  defenses: Defense[];
  powerUps: PowerUp[];
  
  // Game flow control
  gameRunning: boolean;
  gameOver: boolean;
  wave: number;
  nextWaveIn: number;
  
  // Advanced metrics
  money: number;
  threatsKilled: number;
  accuracy: number;
  comboMultiplier: number;
  lastKillTime: number;
}
```

### Entity System Architecture

```typescript
// Threat Entity Structure
interface Threat {
  id: string;                    // Unique identifier
  type: ThreatType;             // Threat category
  position: { x: number; y: number }; // Screen coordinates
  movement: {                   // Movement properties
    speed: number;
    direction: number;
  };
  combat: {                     // Combat statistics
    health: number;
    maxHealth: number;
    damage: number;
    reward: number;
  };
  effects: {                    // Status effects
    stunned: number;
  };
  rendering: {                  // Visual properties
    color: string;
    size: number;
  };
}

// Defense Entity Structure
interface Defense {
  id: string;
  type: DefenseType;
  position: { x: number; y: number };
  combat: {
    range: number;
    damage: number;
    cooldown: number;
    maxCooldown: number;
  };
  progression: {
    level: number;
    kills: number;
  };
  rendering: {
    color: string;
    size: number;
  };
  specialEffect?: string;
}
```

## 🎨 Design System Architecture

### CSS Architecture
```css
/* Layer Structure */
@layer base, components, utilities;

/* Base Layer: Reset and fundamental styles */
@layer base {
  :root {
    /* Design tokens */
    --primary: 220 90% 56%;
    --secondary: 220 14.3% 95.9%;
    /* ... */
  }
}

/* Component Layer: Reusable component styles */
@layer components {
  .story-link { /* ... */ }
  .hover-scale { /* ... */ }
}

/* Utilities Layer: Tailwind utilities */
@layer utilities {
  /* Custom utilities extend Tailwind */
}
```

### Component Variant System
```typescript
// Using class-variance-authority for component variants
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
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## 🔄 Data Flow Architecture

### Unidirectional Data Flow
```
User Action → Event Handler → State Update → Component Re-render → UI Update
```

### Game Update Cycle
```
Game Loop → Update Entities → Check Collisions → Update UI → Render Canvas
```

### Learning Progress Flow
```
Module Interaction → Progress Calculation → State Update → Achievement Check → UI Feedback
```

## 🚀 Performance Architecture

### Rendering Optimizations
1. **Canvas Optimization**: Custom drawing functions optimized for 60 FPS
2. **Component Memoization**: Strategic use of React.memo and hooks
3. **Event Handler Optimization**: useCallback for stable references
4. **State Update Batching**: Efficient state updates to minimize re-renders

### Memory Management
```typescript
// Cleanup in useEffect
useEffect(() => {
  const canvas = canvasRef.current;
  // ... canvas setup
  
  return () => {
    // Cleanup canvas resources
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };
}, []);
```

### Bundle Optimization
- **Tree Shaking**: Only used Lucide icons are included
- **Code Splitting**: Dynamic imports for large components
- **Asset Optimization**: Optimized images and minimal dependencies

## 🎯 Educational Content Architecture

### Modular Learning System
```typescript
interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: {
    theory: string;
    examples: Example[];
    quiz: QuizQuestion[];
  };
  prerequisites: string[];
  xpReward: number;
  estimatedTime: number;
}
```

### Progress Tracking System
```typescript
interface UserProgress {
  completedModules: Set<string>;
  currentXP: number;
  currentLevel: number;
  achievements: Achievement[];
  learningPath: string[];
  timeSpent: Map<string, number>;
  quizScores: Map<string, number>;
}
```

## 🔐 Security Architecture

### Client-Side Security
- **Input Sanitization**: All user inputs are validated
- **XSS Prevention**: Content Security Policy headers
- **State Protection**: Immutable state updates
- **Error Boundaries**: Graceful error handling

### Educational Data Privacy
- **No Personal Data**: Only learning progress stored locally
- **Anonymous Analytics**: No personally identifiable information
- **Local Storage**: Secure client-side progress persistence

## 📱 Responsive Architecture

### Breakpoint System
```typescript
// Tailwind CSS breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
};
```

### Adaptive Canvas Rendering
```typescript
// Canvas scaling for different screen sizes
const getCanvasScale = () => {
  const container = canvasRef.current?.parentElement;
  if (!container) return 1;
  
  const containerWidth = container.clientWidth;
  const scale = Math.min(1, containerWidth / CANVAS_WIDTH);
  return scale;
};
```

## 🔧 Build Architecture

### Vite Configuration
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast'],
          game: ['src/components/CyberDefenseGame.tsx'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🚀 Deployment Architecture

### Static Site Generation
- **Build Output**: Optimized static files
- **Asset Optimization**: Compressed images and minified code
- **CDN Ready**: Cache-friendly asset naming
- **Progressive Enhancement**: Works without JavaScript for basic content

### Hosting Considerations
- **Static Hosting**: Compatible with any static file server
- **SPA Routing**: Requires server configuration for client-side routing
- **Asset Caching**: Optimized cache headers for performance
- **Security Headers**: Content Security Policy and security headers

This architecture provides a scalable, maintainable, and performant foundation for the CyberGuard Academy educational platform.