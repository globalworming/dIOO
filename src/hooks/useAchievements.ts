import { useState, useCallback, useEffect } from "react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  requiresNatural?: boolean; // If true, only natural rolls count
}

export interface GameStats {
  highestRoll: number;
  totalSum: number;
  totalNaturalSum: number;
  totalRolls: number;
  totalModifiedRolls: number;
  colorTotals: Record<string, number>;
}

/** Context passed to achievement condition functions */
interface AchievementContext {
  naturalRoll: number;
  modifiedRoll: number;
  hasModifiers: boolean;
  stats: GameStats;
}

/** Achievement definition with condition function */
interface AchievementDef {
  id: string;
  name: string;
  description: string;
  /** Returns true if achievement should be unlocked */
  condition: (ctx: AchievementContext) => boolean;
}

/**
 * Achievement definitions with their unlock conditions.
 * Each achievement has a condition function that receives the current roll context.
 */
const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "reach-100",
    name: "Perfect Roll",
    description: "Roll a natural 100",
    condition: ({ naturalRoll }) => naturalRoll === 100,
  },
  {
    id: "reach-1",
    name: "Snake Eyes",
    description: "Roll a natural 1",
    condition: ({ naturalRoll }) => naturalRoll === 1,
  },
  {
    id: "modified-100",
    name: "Boosted Century",
    description: "Reach 100+ with modifiers",
    condition: ({ modifiedRoll, hasModifiers }) => hasModifiers && modifiedRoll >= 100,
  },
  {
    id: "ten-rolls",
    name: "Getting Started",
    description: "Roll 10 times",
    condition: ({ stats }) => stats.totalRolls >= 10,
  },
  {
    id: "fifty-rolls",
    name: "Dedicated Roller",
    description: "Roll 50 times",
    condition: ({ stats }) => stats.totalRolls >= 50,
  },
  {
    id: "hundred-rolls",
    name: "Century Club",
    description: "Roll 100 times",
    condition: ({ stats }) => stats.totalRolls >= 100,
  },
  {
    id: "sum-100",
    name: "First Hundred",
    description: "Total sum of 100",
    condition: ({ stats }) => stats.totalSum >= 100,
  },
  {
    id: "sum-1000",
    name: "Thousandaire",
    description: "Total sum of 1000",
    condition: ({ stats }) => stats.totalSum >= 1000,
  },
  {
    id: "sum-10000",
    name: "Googol Seeker",
    description: "Total sum of 10000",
    condition: ({ stats }) => stats.totalSum >= 10000,
  },
  {
    id: "first-mod",
    name: "Modifier Rookie",
    description: "Use a modifier for the first time",
    condition: ({ hasModifiers }) => hasModifiers,
  },
  {
    id: "mixer",
    name: "Mixer",
    description: "Collect 100+ points with 3 different colors",
    condition: ({ stats }) => {
      const qualifyingColors = Object.values(stats.colorTotals || {}).filter(total => total >= 100).length;
      return qualifyingColors >= 3;
    },
  },
];

/** Convert achievement definitions to initial state (all locked) */
const DEFAULT_ACHIEVEMENTS: Achievement[] = ACHIEVEMENT_DEFS.map(def => ({
  id: def.id,
  name: def.name,
  description: def.description,
  unlocked: false,
}));

const STORAGE_KEY = "d100-game-state";

interface StoredState {
  achievements: Achievement[];
  stats: GameStats;
}

const DEFAULT_STATS: GameStats = {
  highestRoll: 0,
  totalSum: 0,
  totalNaturalSum: 0,
  totalRolls: 0,
  totalModifiedRolls: 0,
  colorTotals: {},
};

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredState = JSON.parse(stored);
      // Merge with defaults to pick up any new achievements
      const storedMap = new Map(parsed.achievements.map(a => [a.id, a]));
      return DEFAULT_ACHIEVEMENTS.map(def => storedMap.get(def.id) || def);
    }
    return DEFAULT_ACHIEVEMENTS;
  });

  const [stats, setStats] = useState<GameStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredState = JSON.parse(stored);
      return { ...DEFAULT_STATS, ...parsed.stats };
    }
    return DEFAULT_STATS;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ achievements, stats }));
  }, [achievements, stats]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
    );
  }, []);

  /**
   * Check all achievement conditions and unlock any that are newly satisfied.
   * Uses data-driven approach: iterates through ACHIEVEMENT_DEFS and evaluates each condition.
   */
  const checkAchievements = useCallback(
    (naturalRoll: number, modifiedRoll: number, hasModifiers: boolean, newStats: GameStats) => {
      const newlyUnlocked: string[] = [];
      const ctx: AchievementContext = { naturalRoll, modifiedRoll, hasModifiers, stats: newStats };

      for (const def of ACHIEVEMENT_DEFS) {
        const achievement = achievements.find(a => a.id === def.id);
        if (!achievement?.unlocked && def.condition(ctx)) {
          unlockAchievement(def.id);
          newlyUnlocked.push(def.name);
        }
      }

      return newlyUnlocked;
    },
    [achievements, unlockAchievement]
  );

  const recordRoll = useCallback(
    (naturalRoll: number, modifiedRoll: number, hasModifiers: boolean, bonuses: { color: string; bonus: number }[] = []) => {
      
      const newColorTotals = { ...stats.colorTotals };
      bonuses.forEach(({ color, bonus }) => {
        newColorTotals[color] = (newColorTotals[color] || 0) + bonus;
      });
      
      const newStats: GameStats = {
        highestRoll: Math.max(stats.highestRoll, modifiedRoll),
        totalSum: stats.totalSum + modifiedRoll,
        totalNaturalSum: stats.totalNaturalSum + naturalRoll,
        totalRolls: stats.totalRolls + 1,
        totalModifiedRolls: hasModifiers ? stats.totalModifiedRolls + 1 : stats.totalModifiedRolls,
        colorTotals: newColorTotals,
      };
      setStats(newStats);
      return checkAchievements(naturalRoll, modifiedRoll, hasModifiers, newStats);
    },
    [stats, checkAchievements]
  );

  const resetGame = useCallback(() => {
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStats(DEFAULT_STATS);
  }, []);

  return { achievements, stats, recordRoll, resetGame };
};
