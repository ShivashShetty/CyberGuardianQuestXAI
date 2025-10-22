# CyberGuard Academy - Game Mechanics Documentation

## 🎮 Game Overview

The Cyber Defense Game is an educational tower defense game that teaches cybersecurity concepts through interactive gameplay. Players deploy various defense mechanisms to protect their network from different types of cyber threats.

## 🎯 Core Game Loop

### Game Flow Diagram
```
Start Game → Spawn Wave → Place Defenses → Threats Attack → Defenses Respond → Wave Complete → Next Wave
     ↓                                                                                    ↑
  Reset Game ← Game Over ← Health Depleted ← Threats Reach End ← Continue Loop ←────────┘
```

### Game States
```typescript
enum GameState {
  MENU = 'menu',           // Pre-game state
  PLAYING = 'playing',     // Active gameplay
  PAUSED = 'paused',       // Game paused
  GAME_OVER = 'gameOver',  // Game ended
  WAVE_COMPLETE = 'waveComplete' // Between waves
}
```

## 🛡️ Defense System

### Defense Types and Characteristics

#### 🔥 Firewall
- **Role**: Basic perimeter defense
- **Cost**: 50 money
- **Damage**: 25 per attack
- **Range**: 80 pixels
- **Attack Speed**: Every 30 frames (0.5 seconds)
- **Special**: Balanced stats, good starting defense
- **Real-world Analogy**: Network firewall filtering traffic

#### 🦠 Antivirus
- **Role**: High-damage threat elimination
- **Cost**: 75 money
- **Damage**: 35 per attack
- **Range**: 60 pixels
- **Attack Speed**: Every 45 frames (0.75 seconds)
- **Special**: High single-target damage
- **Real-world Analogy**: Antivirus software detecting malware

#### 🔐 Encryption
- **Role**: Long-range area protection
- **Cost**: 100 money
- **Damage**: 20 per attack
- **Range**: 100 pixels
- **Attack Speed**: Every 20 frames (0.33 seconds)
- **Special**: Longest range, fastest attack speed
- **Real-world Analogy**: Data encryption protecting information

#### 💾 Backup
- **Role**: Fast, low-cost defense
- **Cost**: 30 money
- **Damage**: 15 per attack
- **Range**: 50 pixels
- **Attack Speed**: Every 15 frames (0.25 seconds)
- **Special**: Cheapest option, very fast attacks
- **Real-world Analogy**: Backup systems providing redundancy

#### 🔍 Scanner
- **Role**: Area-of-effect damage dealer
- **Cost**: 90 money
- **Damage**: 30 per attack (+ 30% splash to nearby threats)
- **Range**: 70 pixels
- **Attack Speed**: Every 35 frames (0.58 seconds)
- **Special**: Damages multiple threats simultaneously
- **Real-world Analogy**: Network scanning tools

#### 🍯 Honeypot
- **Role**: Crowd control and slowing
- **Cost**: 120 money
- **Damage**: 40 per attack
- **Range**: 90 pixels
- **Attack Speed**: Every 60 frames (1 second)
- **Special**: Stuns threats for 30 frames (0.5 seconds)
- **Real-world Analogy**: Honeypot traps for attackers

### Defense Upgrade System

```typescript
interface DefenseUpgrade {
  level: number;           // Current upgrade level
  killsRequired: number;   // Kills needed for next level
  damageBonus: number;     // Additional damage per level
  rangeBonus: number;      // Additional range per level
  specialUnlock?: string;  // Special ability at certain levels
}

// Upgrade calculations
const upgradeDefense = (defense: Defense) => {
  if (defense.kills >= (defense.level * 10)) {
    defense.level += 1;
    defense.damage += 5;      // +5 damage per level
    defense.range += 10;      // +10 range per level
    
    // Special upgrades
    if (defense.level === 3 && defense.type === 'scanner') {
      defense.specialEffect = 'chain_lightning'; // Hits 3 targets
    }
    if (defense.level === 5 && defense.type === 'honeypot') {
      defense.specialEffect = 'area_slow'; // Slows all nearby threats
    }
  }
};
```

### Defense Placement Rules

```typescript
const canPlaceDefense = (x: number, y: number, defenseType: string): boolean => {
  // Check minimum distance from other defenses
  const minDistance = 50;
  const tooClose = existingDefenses.some(defense => {
    const distance = Math.sqrt(Math.pow(defense.x - x, 2) + Math.pow(defense.y - y, 2));
    return distance < minDistance;
  });
  
  // Check cost requirements
  const canAfford = gameState.money >= defenseTypes[defenseType].cost;
  
  // Check canvas bounds
  const inBounds = x >= 0 && x <= CANVAS_WIDTH && y >= 0 && y <= CANVAS_HEIGHT;
  
  return !tooClose && canAfford && inBounds;
};
```

## 👾 Threat System

### Threat Types and Behaviors

#### 🦠 Virus
- **Health**: 30 HP
- **Speed**: 2 pixels/frame
- **Damage**: 15 to player health
- **Reward**: 25 money
- **Behavior**: Direct movement with slight random deviation
- **Educational Concept**: Computer viruses spreading through systems

#### 🎣 Phishing
- **Health**: 20 HP
- **Speed**: 1.5 pixels/frame
- **Damage**: 10 to player health
- **Reward**: 20 money
- **Behavior**: Slower movement, tries to avoid defenses
- **Educational Concept**: Social engineering attacks

#### 👾 Malware
- **Health**: 50 HP
- **Speed**: 1 pixel/frame
- **Damage**: 25 to player health
- **Reward**: 40 money
- **Behavior**: Slow but resilient, high damage
- **Educational Concept**: Persistent malicious software

#### ⚡ DDoS
- **Health**: 40 HP
- **Speed**: 3 pixels/frame
- **Damage**: 20 to player health
- **Reward**: 35 money
- **Behavior**: Fast movement, comes in groups
- **Educational Concept**: Distributed denial of service attacks

#### 🔒 Ransomware
- **Health**: 80 HP
- **Speed**: 0.8 pixels/frame
- **Damage**: 35 to player health
- **Reward**: 60 money
- **Behavior**: Very slow but extremely dangerous
- **Educational Concept**: Data encryption attacks

#### 🐴 Trojan
- **Health**: 15 HP
- **Speed**: 4 pixels/frame
- **Damage**: 8 to player health
- **Reward**: 15 money
- **Behavior**: Fastest movement, low health
- **Educational Concept**: Disguised malicious programs

### Threat Spawning Algorithm

```typescript
const spawnWave = (waveNumber: number) => {
  // Calculate threat count based on wave
  const baseThreats = 3;
  const additionalThreats = Math.floor(waveNumber * 2);
  const maxThreats = 15;
  const threatCount = Math.min(baseThreats + additionalThreats, maxThreats);
  
  // Determine threat type distribution
  const threatDistribution = calculateThreatDistribution(waveNumber);
  
  // Spawn threats with staggered timing
  for (let i = 0; i < threatCount; i++) {
    setTimeout(() => {
      const threatType = selectThreatType(threatDistribution);
      const threat = createThreat(threatType, waveNumber);
      addThreatToGame(threat);
    }, i * 500); // 0.5 second intervals
  }
};

const calculateThreatDistribution = (waveNumber: number) => {
  const distributions = {
    early: { virus: 0.4, phishing: 0.3, trojan: 0.3 },           // Waves 1-3
    mid: { virus: 0.2, phishing: 0.2, malware: 0.3, ddos: 0.3 }, // Waves 4-7
    late: { malware: 0.2, ddos: 0.2, ransomware: 0.3, trojan: 0.3 } // Waves 8+
  };
  
  if (waveNumber <= 3) return distributions.early;
  if (waveNumber <= 7) return distributions.mid;
  return distributions.late;
};
```

### Threat Movement and AI

```typescript
const updateThreatMovement = (threat: Threat) => {
  // Basic movement toward goal
  threat.y += threat.speed;
  threat.x += threat.direction; // Slight horizontal drift
  
  // Advanced AI behaviors
  switch (threat.type) {
    case 'phishing':
      // Try to avoid heavily defended areas
      avoidDefenses(threat);
      break;
      
    case 'ddos':
      // Move in coordinated groups
      followNearbyThreats(threat);
      break;
      
    case 'ransomware':
      // Slow but persistent movement
      threat.speed = Math.max(0.5, threat.speed * 0.99);
      break;
      
    case 'trojan':
      // Erratic movement to avoid targeting
      threat.direction += (Math.random() - 0.5) * 0.5;
      break;
  }
  
  // Apply status effects
  if (threat.stunned > 0) {
    threat.speed *= 0.1; // Significantly slower when stunned
    threat.stunned--;
  }
};
```

## ⚔️ Combat System

### Damage Calculation

```typescript
const calculateDamage = (defense: Defense, threat: Threat): number => {
  let baseDamage = defense.damage;
  
  // Level-based damage bonus
  const levelBonus = (defense.level - 1) * 5;
  baseDamage += levelBonus;
  
  // Type effectiveness bonuses
  const effectiveness = getTypeEffectiveness(defense.type, threat.type);
  baseDamage *= effectiveness;
  
  // Critical hit chance (5% base)
  const criticalChance = 0.05 + (defense.level * 0.01);
  if (Math.random() < criticalChance) {
    baseDamage *= 2;
    showCriticalHitEffect(defense.x, defense.y);
  }
  
  return Math.floor(baseDamage);
};

const getTypeEffectiveness = (defenseType: string, threatType: string): number => {
  const effectiveness = {
    // Antivirus is extra effective against malware and viruses
    antivirus: { virus: 1.5, malware: 1.5 },
    // Firewalls are effective against network attacks
    firewall: { ddos: 1.3, phishing: 1.2 },
    // Encryption counters ransomware
    encryption: { ransomware: 1.4 },
    // Honeypots are great against trojans
    honeypot: { trojan: 1.6 }
  };
  
  return effectiveness[defenseType]?.[threatType] || 1.0;
};
```

### Attack Range and Targeting

```typescript
const findTargets = (defense: Defense, threats: Threat[]): Threat[] => {
  return threats.filter(threat => {
    const distance = Math.sqrt(
      Math.pow(threat.x - defense.x, 2) + 
      Math.pow(threat.y - defense.y, 2)
    );
    return distance <= defense.range && threat.health > 0;
  }).sort((a, b) => {
    // Prioritize by threat distance to goal
    const aProgress = a.y / CANVAS_HEIGHT;
    const bProgress = b.y / CANVAS_HEIGHT;
    return bProgress - aProgress; // Closest to goal first
  });
};

const executeAttack = (defense: Defense, target: Threat) => {
  if (defense.cooldown > 0) return;
  
  const damage = calculateDamage(defense, target);
  target.health -= damage;
  
  // Apply special effects
  applySpecialEffects(defense, target);
  
  // Set cooldown
  defense.cooldown = defense.maxCooldown;
  
  // Create visual effects
  createAttackEffect(defense, target);
  
  // Check for kill
  if (target.health <= 0) {
    handleThreatKilled(defense, target);
  }
};
```

## 💰 Economy System

### Money Management

```typescript
interface EconomyState {
  money: number;           // Current money
  totalEarned: number;     // Lifetime earnings
  totalSpent: number;      // Lifetime spending
  efficiency: number;      // Money spent vs score ratio
}

const calculateReward = (threat: Threat, level: number, comboMultiplier: number): number => {
  let baseReward = threat.reward;
  
  // Level scaling
  baseReward *= level;
  
  // Combo multiplier
  baseReward *= comboMultiplier;
  
  // Bonus for quick elimination
  const timeBonus = threat.maxHealth === threat.health ? 1.2 : 1.0;
  baseReward *= timeBonus;
  
  return Math.floor(baseReward);
};
```

### Cost Balancing

```typescript
const defenseCosts = {
  // Early game defenses (affordable)
  backup: 30,     // Cheap, basic option
  firewall: 50,   // Standard first defense
  
  // Mid game defenses (moderate cost)
  antivirus: 75,  // Specialized anti-malware
  scanner: 90,    // Area effect capability
  
  // Late game defenses (expensive)
  encryption: 100,  // Long-range protection
  honeypot: 120,    // Advanced crowd control
};

// Dynamic pricing based on game progression
const getAdjustedCost = (defenseType: string, wave: number): number => {
  const baseCost = defenseCosts[defenseType];
  const inflationRate = 1 + (wave * 0.05); // 5% increase per wave
  return Math.floor(baseCost * inflationRate);
};
```

## 🎯 Scoring and Progression

### Score Calculation

```typescript
const calculateScore = (
  threat: Threat, 
  level: number, 
  comboMultiplier: number,
  accuracy: number
): number => {
  let baseScore = threat.reward * 10;
  
  // Level multiplier
  baseScore *= level;
  
  // Combo multiplier (chains kills within 2 seconds)
  baseScore *= comboMultiplier;
  
  // Accuracy bonus
  const accuracyBonus = 1 + (accuracy / 100);
  baseScore *= accuracyBonus;
  
  // Time bonus (faster kills = more points)
  const healthPercentage = threat.health / threat.maxHealth;
  const timeBonus = 2 - healthPercentage; // Up to 2x for instant kills
  baseScore *= timeBonus;
  
  return Math.floor(baseScore);
};
```

### Combo System

```typescript
interface ComboSystem {
  multiplier: number;      // Current combo multiplier
  lastKillTime: number;    // Timestamp of last kill
  comboWindow: number;     // Time window for combos (2000ms)
  maxMultiplier: number;   // Maximum combo multiplier (5x)
}

const updateComboMultiplier = (currentTime: number) => {
  const timeSinceLastKill = currentTime - comboSystem.lastKillTime;
  
  if (timeSinceLastKill <= comboSystem.comboWindow) {
    // Extend combo
    comboSystem.multiplier = Math.min(
      comboSystem.maxMultiplier,
      comboSystem.multiplier + 0.5
    );
  } else {
    // Reset combo
    comboSystem.multiplier = 1.0;
  }
  
  comboSystem.lastKillTime = currentTime;
  
  // Visual feedback for high combos
  if (comboSystem.multiplier >= 3.0) {
    showComboEffect(comboSystem.multiplier);
  }
};
```

### Level Progression

```typescript
const checkLevelUp = () => {
  if (gameState.wave % 3 === 0) { // Level up every 3 waves
    gameState.level++;
    
    // Health benefits
    const healthRestore = 30;
    const maxHealthIncrease = 20;
    gameState.health = Math.min(
      gameState.maxHealth + maxHealthIncrease, 
      gameState.health + healthRestore
    );
    gameState.maxHealth += maxHealthIncrease;
    
    // Economic benefits
    const moneyBonus = 50;
    gameState.money += moneyBonus;
    
    // Unlock new content
    unlockNewDefenses(gameState.level);
    unlockNewThreats(gameState.level);
    
    // Notification
    showLevelUpEffect(gameState.level);
  }
};
```

## 🏆 Achievement System

### Achievement Types

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'kill_count' | 'score' | 'survival' | 'efficiency' | 'special';
  requirement: any;
  reward: {
    xp: number;
    money?: number;
    unlock?: string;
  };
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const achievements: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Line of Defense',
    description: 'Place your first defense',
    type: 'special',
    requirement: { defensesPlaced: 1 },
    reward: { xp: 50 },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'threat_hunter',
    name: 'Threat Hunter',
    description: 'Eliminate 100 threats',
    type: 'kill_count',
    requirement: { threatsKilled: 100 },
    reward: { xp: 200, money: 100 },
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'wave_master',
    name: 'Wave Master',
    description: 'Complete 10 waves without losing health',
    type: 'survival',
    requirement: { perfectWaves: 10 },
    reward: { xp: 500, unlock: 'expert_mode' },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  }
];
```

### Achievement Tracking

```typescript
const checkAchievements = (gameState: GameState) => {
  achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    
    let currentProgress = 0;
    
    switch (achievement.type) {
      case 'kill_count':
        currentProgress = gameState.threatsKilled;
        break;
      case 'score':
        currentProgress = gameState.score;
        break;
      case 'survival':
        currentProgress = gameState.perfectWaves || 0;
        break;
      case 'efficiency':
        currentProgress = calculateEfficiency(gameState);
        break;
      case 'special':
        currentProgress = checkSpecialRequirement(achievement, gameState);
        break;
    }
    
    achievement.progress = currentProgress;
    
    if (currentProgress >= achievement.maxProgress) {
      unlockAchievement(achievement);
    }
  });
};
```

## 🎨 Visual Effects System

### Particle Effects

```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;          // Velocity X
  vy: number;          // Velocity Y
  life: number;        // Remaining life frames
  maxLife: number;     // Initial life
  color: string;
  size: number;
  type: 'explosion' | 'attack' | 'upgrade' | 'combo';
}

const createExplosionEffect = (x: number, y: number, threatType: string) => {
  const particleCount = 12;
  const colors = threatColors[threatType];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 25,
      maxLife: 25,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 2,
      type: 'explosion'
    });
  }
};
```

### Animation System

```typescript
const updateAnimations = () => {
  // Update particles
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life--;
    
    // Fade effect
    const alpha = particle.life / particle.maxLife;
    particle.color = particle.color.replace(/[\d.]+\)$/g, `${alpha})`);
  });
  
  // Remove dead particles
  particles = particles.filter(p => p.life > 0);
  
  // Update defense animations
  defenses.forEach(defense => {
    if (defense.cooldown > 0) {
      defense.cooldown--;
      updateDefenseAnimation(defense);
    }
  });
};
```

## 📊 Performance Optimization

### Game Loop Optimization

```typescript
const GAME_SPEED = 60; // Target 60 FPS
let lastFrameTime = 0;

const gameLoop = (currentTime: number) => {
  const deltaTime = currentTime - lastFrameTime;
  
  // Maintain consistent frame rate
  if (deltaTime >= 1000 / GAME_SPEED) {
    updateGame();
    renderGame();
    lastFrameTime = currentTime;
  }
  
  if (gameState.running) {
    requestAnimationFrame(gameLoop);
  }
};

// Efficient collision detection
const checkCollisions = () => {
  // Use spatial partitioning for large numbers of entities
  const grid = createSpatialGrid(CANVAS_WIDTH, CANVAS_HEIGHT, 100);
  
  // Add entities to grid
  threats.forEach(threat => grid.add(threat));
  defenses.forEach(defense => grid.add(defense));
  
  // Check only nearby entities
  defenses.forEach(defense => {
    const nearbyThreats = grid.getNearby(defense, defense.range);
    processDefenseAttack(defense, nearbyThreats);
  });
};
```

This comprehensive game mechanics documentation provides a complete understanding of how the Cyber Defense Game operates, from basic gameplay to advanced systems and optimizations.