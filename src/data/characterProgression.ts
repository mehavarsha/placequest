import { CharacterLevel } from '../types';

export const CHARACTER_LEVELS: CharacterLevel[] = [
  {
    level: 1,
    title: 'Novice Code Apprentice',
    minSparks: 0,
    nextLevelSparks: 150,
    badgeName: 'Apprentice Scroll',
    auraColor: 'from-blue-500/20 to-indigo-500/30 border-blue-500/40 text-blue-400',
    perks: ['Access to Foundations Roadmap', '1x Daily Streak multiplier'],
    gearName: 'Wooden Terminal Wand'
  },
  {
    level: 2,
    title: 'Algorithm Scout',
    minSparks: 150,
    nextLevelSparks: 350,
    badgeName: 'Chrono Chronometer',
    auraColor: 'from-cyan-500/20 to-teal-500/30 border-cyan-500/40 text-cyan-400',
    perks: ['Unlock Two Pointers & Hashing trees', '+15% Bonus Sparks on assessments'],
    gearName: 'Neon Syntax Goggles'
  },
  {
    level: 3,
    title: 'Data Structure Knight',
    minSparks: 350,
    nextLevelSparks: 600,
    badgeName: 'Cyber Armor Crest',
    auraColor: 'from-violet-500/20 to-purple-500/30 border-violet-500/40 text-violet-400',
    perks: ['Unlock Tree & Monotonic Queue tiers', 'Access to Friend Speed Duels'],
    gearName: 'Quantum Algorithm Shield'
  },
  {
    level: 4,
    title: 'System Architect Mage',
    minSparks: 600,
    nextLevelSparks: 900,
    badgeName: 'Distributed Core',
    auraColor: 'from-amber-500/20 to-orange-500/30 border-amber-500/40 text-amber-400',
    perks: ['Unlock System Design microservice flow', '+25% Squad Co-op multiplier'],
    gearName: 'Distributed Cloud Staff'
  },
  {
    level: 5,
    title: 'FAANG Conquering Legend',
    minSparks: 900,
    nextLevelSparks: 1500,
    badgeName: 'Mythical Champion Crown',
    auraColor: 'from-rose-500/20 to-amber-500/30 border-amber-500/60 text-amber-300',
    perks: ['Elite Dream Company Mock Loop', 'Permanent 2x Streak Flame multiplier', 'Day-1 Offer Ready Aura'],
    gearName: 'Golden Monolithic Crown'
  }
];

export function getCharacterLevel(sparks: number): {
  currentLevel: CharacterLevel;
  nextLevel: CharacterLevel | null;
  progressPercent: number;
  sparksInLevel: number;
  sparksNeededForNext: number;
} {
  let currentLevel = CHARACTER_LEVELS[0];
  let nextLevel: CharacterLevel | null = CHARACTER_LEVELS[1];

  for (let i = CHARACTER_LEVELS.length - 1; i >= 0; i--) {
    if (sparks >= CHARACTER_LEVELS[i].minSparks) {
      currentLevel = CHARACTER_LEVELS[i];
      nextLevel = i < CHARACTER_LEVELS.length - 1 ? CHARACTER_LEVELS[i + 1] : null;
      break;
    }
  }

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      sparksInLevel: sparks - currentLevel.minSparks,
      sparksNeededForNext: 0
    };
  }

  const range = nextLevel.minSparks - currentLevel.minSparks;
  const inLevel = Math.max(0, sparks - currentLevel.minSparks);
  const progressPercent = Math.min(100, Math.round((inLevel / range) * 100));
  const sparksNeededForNext = nextLevel.minSparks - sparks;

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    sparksInLevel: inLevel,
    sparksNeededForNext
  };
}
