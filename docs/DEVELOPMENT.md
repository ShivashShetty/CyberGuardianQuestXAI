# CyberGuard Academy - Development Guide

## 🚀 Getting Started

### Prerequisites

Before you begin development, ensure you have the following installed:

```bash
# Node.js (version 18 or higher)
node --version

# npm (comes with Node.js)
npm --version

# Git (for version control)
git --version
```

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd cyberguard-academy

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to
# http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🏗️ Development Environment

### VS Code Configuration

Recommended VS Code extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

Workspace settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### TypeScript Configuration

The project uses strict TypeScript configuration for type safety:

```typescript
// tsconfig.json highlights
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx"
  }
}
```

## 📁 Project Structure and Conventions

### File Naming Conventions

```
Components:          PascalCase.tsx     (GameComponent.tsx)
Hooks:              camelCase.ts       (useGameState.ts)
Utilities:          camelCase.ts       (formatScore.ts)
Constants:          SCREAMING_SNAKE    (GAME_CONSTANTS.ts)
Types:              camelCase.ts       (gameTypes.ts)
Styles:             kebab-case.css     (game-styles.css)
```

### Component Structure

Standard component file structure:

```typescript
// Imports (grouped and sorted)
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Types and interfaces
interface ComponentProps {
  title: string;
  onAction?: (data: any) => void;
}

// Component implementation
export const ComponentName: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Hooks
  const { toast } = useToast();
  
  // Event handlers
  const handleAction = useCallback((data: any) => {
    // Implementation
    onAction?.(data);
  }, [onAction]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Render
  return (
    <Card>
      <CardContent>
        <h2>{title}</h2>
        {/* Component JSX */}
      </CardContent>
    </Card>
  );
};
```

### Import Organization

```typescript
// 1. React and React-related imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { clsx } from 'clsx';

// 3. Internal components (UI first, then feature components)
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/GameBoard';

// 4. Hooks
import { useGameState } from '@/hooks/useGameState';

// 5. Utilities and constants
import { cn } from '@/lib/utils';
import { GAME_CONSTANTS } from '@/constants/game';

// 6. Types
import type { GameState, Threat } from '@/types/game';
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

#### Use Semantic Tokens
```typescript
// ❌ Don't use direct colors
<div className="bg-blue-500 text-white">

// ✅ Use semantic tokens
<div className="bg-primary text-primary-foreground">
```

#### Responsive Design Patterns
```typescript
// Mobile-first responsive design
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  md:p-6 
  lg:p-8
">
```

#### Component Variants with CVA
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

### CSS Custom Properties

Extend the design system with custom properties:

```css
/* index.css */
:root {
  /* Game-specific colors */
  --color-threat-virus: 220 100% 60%;
  --color-threat-malware: 280 100% 60%;
  --color-defense-firewall: 120 100% 40%;
  
  /* Animation timings */
  --animation-fast: 0.15s;
  --animation-normal: 0.3s;
  --animation-slow: 0.5s;
  
  /* Game dimensions */
  --canvas-width: 800px;
  --canvas-height: 600px;
}
```

## 🔧 Component Development

### Custom Hooks Pattern

```typescript
// hooks/useGameState.ts
import { useState, useCallback, useRef } from 'react';

interface UseGameStateReturn {
  gameState: GameState;
  actions: {
    startGame: () => void;
    pauseGame: () => void;
    resetGame: () => void;
    updateScore: (points: number) => void;
  };
}

export const useGameState = (initialState: GameState): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const gameLoopRef = useRef<number>();
  
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
    // Start game loop
  }, []);
  
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);
  
  const resetGame = useCallback(() => {
    setGameState(initialState);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, [initialState]);
  
  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({ 
      ...prev, 
      score: prev.score + points 
    }));
  }, []);
  
  return {
    gameState,
    actions: {
      startGame,
      pauseGame,
      resetGame,
      updateScore,
    },
  };
};
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground">
              The game encountered an error. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## 🎮 Game Development Patterns

### Canvas Management

```typescript
// hooks/useCanvas.ts
import { useRef, useEffect, useCallback } from 'react';

interface UseCanvasOptions {
  width: number;
  height: number;
  onRender: (ctx: CanvasRenderingContext2D) => void;
}

export const useCanvas = ({ width, height, onRender }: UseCanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Custom render function
    onRender(ctx);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(render);
  }, [width, height, onRender]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      render();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, render]);
  
  return canvasRef;
};
```

### Game Entity Management

```typescript
// utils/entityManager.ts
export class EntityManager<T extends { id: string }> {
  private entities: Map<string, T> = new Map();
  
  add(entity: T): void {
    this.entities.set(entity.id, entity);
  }
  
  remove(id: string): boolean {
    return this.entities.delete(id);
  }
  
  get(id: string): T | undefined {
    return this.entities.get(id);
  }
  
  getAll(): T[] {
    return Array.from(this.entities.values());
  }
  
  update(updateFn: (entity: T) => T): void {
    for (const [id, entity] of this.entities) {
      this.entities.set(id, updateFn(entity));
    }
  }
  
  filter(predicate: (entity: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }
  
  clear(): void {
    this.entities.clear();
  }
}

// Usage
const threatManager = new EntityManager<Threat>();
const defenseManager = new EntityManager<Defense>();
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// __tests__/GameBoard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '@/components/GameBoard';

describe('GameBoard', () => {
  it('renders game canvas', () => {
    render(<GameBoard />);
    const canvas = screen.getByRole('application');
    expect(canvas).toBeInTheDocument();
  });
  
  it('handles defense placement', () => {
    const onDefensePlaced = jest.fn();
    render(<GameBoard onDefensePlaced={onDefensePlaced} />);
    
    const canvas = screen.getByRole('application');
    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    
    expect(onDefensePlaced).toHaveBeenCalledWith({
      x: expect.any(Number),
      y: expect.any(Number),
      type: expect.any(String),
    });
  });
});
```

### Game Logic Testing

```typescript
// __tests__/gameLogic.test.ts
import { calculateDamage, checkCollision } from '@/utils/gameLogic';

describe('Game Logic', () => {
  describe('calculateDamage', () => {
    it('calculates basic damage correctly', () => {
      const defense = { damage: 25, level: 1, type: 'firewall' };
      const threat = { type: 'virus', health: 30 };
      
      const damage = calculateDamage(defense, threat);
      expect(damage).toBe(25);
    });
    
    it('applies type effectiveness bonuses', () => {
      const defense = { damage: 25, level: 1, type: 'antivirus' };
      const threat = { type: 'virus', health: 30 };
      
      const damage = calculateDamage(defense, threat);
      expect(damage).toBeGreaterThan(25); // Antivirus effective vs virus
    });
  });
});
```

## 📊 Performance Guidelines

### React Performance

```typescript
// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(props);
}, [props.dependency1, props.dependency2]);

// Callback memoization for stable references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// Component memoization
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return prevProps.criticalProp === nextProps.criticalProp;
});
```

### Canvas Performance

```typescript
// Efficient canvas rendering
const renderGame = (ctx: CanvasRenderingContext2D) => {
  // Use layers for different elements
  renderBackground(ctx);
  renderEntities(ctx);
  renderUI(ctx);
};

// Object pooling for frequently created/destroyed objects
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  
  constructor(createFn: () => T, initialSize = 10) {
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  get(): T {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj: T): void {
    this.pool.push(obj);
  }
}
```

## 🔧 Debugging Tools

### Development Utilities

```typescript
// utils/debugUtils.ts
export const debugTools = {
  // Log game state changes
  logGameState: (state: GameState) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Game State:', state);
    }
  },
  
  // Visual debug overlay
  drawDebugInfo: (ctx: CanvasRenderingContext2D, entities: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      ctx.strokeStyle = 'red';
      entities.forEach(entity => {
        ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
      });
    }
  },
  
  // Performance monitoring
  measurePerformance: <T extends (...args: any[]) => any>(
    fn: T, 
    label: string
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      console.log(`${label}: ${end - start}ms`);
      return result;
    }) as T;
  },
};
```

### Browser DevTools Integration

```typescript
// Expose game state to window for debugging
if (process.env.NODE_ENV === 'development') {
  (window as any).gameDebug = {
    state: gameState,
    actions: gameActions,
    entities: { threats, defenses },
    utils: debugTools,
  };
}
```

## 📝 Code Quality

### ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Git Workflow

```bash
# Feature development workflow
git checkout -b feature/new-defense-type
git add .
git commit -m "feat: add honeypot defense with stun effect"
git push origin feature/new-defense-type

# Commit message format
# type(scope): description
#
# Types: feat, fix, docs, style, refactor, test, chore
# Scope: component, game, ui, docs, etc.
```

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components follow single responsibility principle
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified
- [ ] Error handling implemented
- [ ] Tests written for new functionality
- [ ] Documentation updated

## 🚀 Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Test production build locally
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### Environment Configuration

```typescript
// config/environment.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  game: {
    debugMode: process.env.NODE_ENV === 'development',
    targetFPS: 60,
    maxEntities: 100,
  },
  
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
  },
};
```

This development guide provides the foundation for contributing to and extending the CyberGuard Academy project while maintaining code quality and performance standards.