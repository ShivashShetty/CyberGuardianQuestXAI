# CyberGuard Academy 🛡️

**An interactive cybersecurity education platform combining gamified learning with AI-powered assistance.**

## 🎯 Project Overview

CyberGuard Academy is a comprehensive educational platform designed to make cybersecurity learning engaging and accessible. The platform combines traditional learning modules with an interactive tower defense game and AI-powered explanations to create an immersive learning experience.


### Key Features

- **📚 Interactive Learning Modules**: Structured cybersecurity curriculum with progressive difficulty
- **🎮 Cyber Defense Game**: Real-time tower defense game with cybersecurity themes
- **🏆 Arcade-Style Scoreboard**: Every game session (even with the same player name) is a unique entry. Scoreboard displays all sessions, sorted by score, with the highest at the top.
- **🔒 Admin Dashboard**: Password-protected admin page (`/admin`, password: `admin123`) for managing scoreboard entries and monitoring backend status.
- **🤖 AI Learning Assistant (Gemini)**: Uses Google Gemini API for intelligent threat explanations and interactive Q&A. API key is stored in `.env`.
- **📊 Progress Tracking**: Comprehensive dashboard with statistics and achievements
- **🏆 Gamification System**: XP, levels, achievements, and combo multipliers

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/ShivashShetty/CyberGuardianQuestXAI.git
cd CyberGuardianQuestXAI

# Install dependencies
npm install

# Set up your .env file (see below)

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── AIExplainer.tsx # AI-powered explanation component
│   ├── CyberDefenseGame.tsx # Main game component
│   ├── LearningModule.tsx   # Learning module component
│   ├── ProgressDashboard.tsx # Progress tracking
│   └── ThreatSimulator.tsx  # Threat simulation component
├── pages/              # Page components
│   ├── Index.tsx       # Main homepage
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets
└── styles/             # CSS and styling
```

## 🎮 Game Mechanics

### Defense Types
- **🔥 Firewall**: Basic perimeter defense with balanced stats (Cost: 50, Damage: 25, Range: 80)
- **🦠 Antivirus**: High damage scanner for eliminating threats (Cost: 75, Damage: 35, Range: 60)
- **🔐 Encryption**: Long-range protector with area coverage (Cost: 100, Damage: 20, Range: 100)
- **💾 Backup**: Fast attack speed with low cost (Cost: 30, Damage: 15, Range: 50)
- **🔍 Scanner**: Area effect damage for multiple threats (Cost: 90, Damage: 30, Range: 70)
- **🍯 Honeypot**: Traps and slows enemies with special effects (Cost: 120, Damage: 40, Range: 90)

### Threat Types
- **🦠 Virus**: Fast-spreading basic threat (Speed: 2, Health: 30, Damage: 15, Reward: 25)
- **🎣 Phishing**: Social engineering attack (Speed: 1.5, Health: 20, Damage: 10, Reward: 20)
- **👾 Malware**: High-damage persistent threat (Speed: 1, Health: 50, Damage: 25, Reward: 40)
- **⚡ DDoS**: Fast-moving network attack (Speed: 3, Health: 40, Damage: 20, Reward: 35)
- **🔒 Ransomware**: Slow but devastating encryption attack (Speed: 0.8, Health: 80, Damage: 35, Reward: 60)
- **🐴 Trojan**: Fast, low-health deceptive threat (Speed: 4, Health: 15, Damage: 8, Reward: 15)

### Progression System
- **Levels**: Advance every 3 waves with health and money bonuses
- **Money System**: Earn money from eliminated threats to buy defenses
- **Combo Multipliers**: Chain kills within 2 seconds for up to 5x bonus points
- **Defense Upgrades**: Defenses level up every 10 kills (increased damage and range)
- **Achievements**: Unlock rewards for various milestones

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Animation**: Custom CSS keyframes and Tailwind animations
- **Toast Notifications**: Sonner
- **Canvas Rendering**: HTML5 Canvas for game graphics

## 🎨 Design System

The project uses a comprehensive design system built with Tailwind CSS:

### Color Tokens
- **Primary Colors**: HSL-based semantic tokens for consistent theming
- **Cyber Theme Colors**: Custom gradients for cybersecurity aesthetics
- **Status Colors**: Success, warning, error, and info states
- **Interactive States**: Hover, focus, and active states

### Typography
- **Font Scales**: Responsive typography with proper contrast ratios
- **Hierarchy**: Clear heading and body text distinctions
- **Accessibility**: WCAG compliant contrast ratios

### Components
- **Button Variants**: Multiple styles for different contexts
- **Card Layouts**: Consistent spacing and elevation
- **Form Elements**: Accessible input and control components
- **Navigation**: Responsive navigation patterns

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices (320px+)
- **Tablet Support**: Enhanced layouts for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Game Canvas**: Responsive scaling with maintained aspect ratio
- **Touch Interactions**: Optimized for touch devices

## 🔧 Development Guidelines

### Code Organization
- **Component Structure**: Single responsibility principle with clear prop interfaces
- **Custom Hooks**: Reusable logic extracted into custom hooks
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Error Handling**: Graceful error states and user feedback

### Performance Optimizations
- **Canvas Rendering**: 60 FPS game loop with optimized drawing operations
- **State Management**: Efficient re-renders with useCallback and useMemo
- **Asset Loading**: Lazy loading and code splitting where appropriate
- **Memory Management**: Proper cleanup of game resources and event listeners

### Testing Strategy
- **Component Testing**: Unit tests for individual components
- **Game Logic Testing**: Isolated testing of game mechanics
- **Integration Testing**: End-to-end user workflows
- **Performance Testing**: Frame rate and memory usage monitoring

## 🎯 Educational Objectives

### Cybersecurity Fundamentals
- **Network Security**: Understanding layered defense strategies
- **Threat Landscape**: Recognition of different attack vectors
- **Risk Assessment**: Evaluating security investments and trade-offs
- **Incident Response**: Developing quick decision-making skills

### Practical Skills Development
- **Strategic Planning**: Long-term security architecture design
- **Resource Management**: Budget allocation for security tools
- **Threat Analysis**: Pattern recognition and attack prediction
- **Crisis Management**: Handling security breaches under pressure

### Learning Outcomes
- **Knowledge Retention**: Interactive reinforcement of concepts
- **Skill Application**: Practical application in game scenarios
- **Critical Thinking**: Analysis of complex security situations
- **Decision Making**: Quick, informed choices under time pressure

## 📊 Analytics and Progress Tracking

### Metrics Collected
- **Learning Progress**: Module completion rates and time spent
- **Game Performance**: Scores, waves completed, accuracy percentages
- **Engagement**: Session duration and return visit frequency
- **Skill Development**: Improvement in strategy and decision-making

### Achievement System
- **Learning Milestones**: Module completion achievements
- **Game Mastery**: Wave completion and scoring achievements
- **Skill Recognition**: Strategic play and efficiency rewards
- **Progress Tracking**: Visual indicators of advancement

## 🚀 Deployment and Hosting

### Production Build
```bash
npm run build        # Create optimized production build
npm run preview      # Preview production build locally
```

### Deployment Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **CDN Integration**: Optimized global content delivery
- **Custom Domains**: Full custom domain support


### Environment Configuration
- **.env file**: Required variables:
	- `MONGODB_URI` - Your MongoDB connection string
	- `MONGODB_DB_NAME` - Your MongoDB database name
	- `PORT` - Port for backend server (default: 5000)
	- `GEMINI_API_KEY` - Your Google Gemini API key (for AI assistant)
- **Build Optimizations**: Tree shaking and code splitting
- **Asset Optimization**: Image compression and lazy loading
- **Security Headers**: Content Security Policy and HTTPS enforcement
## 🏆 Arcade-Style Scoreboard

- Each game session is a unique entry, even for the same player name.
- Scoreboard displays all sessions, sorted by score (highest first).
- Admins can add or delete entries via the admin dashboard.

## 🔒 Admin Dashboard

- Accessible at `/admin` (link in footer).
- Password: `admin123`
- Features:
	- View, add, and delete scoreboard entries
	- See backend status (MongoDB and AI)
	- Modern cyber-themed UI matching the main site

## 🤖 AI Assistant (Google Gemini)

- `/ask` endpoint uses Google Gemini API for cybersecurity Q&A.
- API key is stored in `.env` as `GEMINI_API_KEY`.
- No AI key is hardcoded in the codebase.

## 🖥️ Frontend Improvements

- Footer is always at the bottom using flexbox layout.
- Admin dashboard is accessible via a subtle footer link.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper documentation
4. Test thoroughly across different devices
5. Submit a pull request with detailed description

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Consistent code formatting and best practices
- **Accessibility**: WCAG 2.1 compliance for all components
- **Documentation**: Inline comments and README updates

### Component Development
- **Props Interface**: Clear TypeScript interfaces for all props
- **Default Props**: Sensible defaults for optional properties
- **Error Boundaries**: Graceful error handling and user feedback
- **Responsive Design**: Mobile-first responsive implementations

## 📋 API Documentation

### Component Interfaces
- **GameState**: Complete game state management
- **Threat/Defense Types**: Entity definitions and configurations
- **Event Handlers**: User interaction and game event processing
- **Progress Tracking**: Learning analytics and achievement systems

### Game Configuration
- **Canvas Settings**: Rendering dimensions and performance settings
- **Game Balance**: Threat difficulty scaling and reward calculations
- **UI Configuration**: Layout responsive breakpoints and theming

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation**: Sanitization of user inputs
- **XSS Prevention**: Content Security Policy implementation
- **State Protection**: Secure state management practices

### Educational Security
- **Privacy**: No personal data collection beyond learning progress
- **Accessibility**: Inclusive design for all learners
- **Content Safety**: Age-appropriate cybersecurity education

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui**: Excellent accessible component library
- **Lucide**: Comprehensive and consistent icon system
- **Tailwind CSS**: Utility-first CSS framework enabling rapid development
- **React Team**: Powerful and flexible frontend framework
- **Cybersecurity Community**: Inspiration for educational content and game mechanics

---

**🔐 Securing the future, one game at a time**


