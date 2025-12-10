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

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "reach-100", name: "Perfect Roll", description: "Roll a natural 100", unlocked: false, requiresNatural: true },
  { id: "reach-1", name: "Snake Eyes", description: "Roll a natural 1", unlocked: false, requiresNatural: true },
  { id: "modified-100", name: "Boosted Century", description: "Reach 100+ with modifiers", unlocked: false },
  { id: "ten-rolls", name: "Getting Started", description: "Roll 10 times", unlocked: false },
  { id: "fifty-rolls", name: "Dedicated Roller", description: "Roll 50 times", unlocked: false },
  { id: "hundred-rolls", name: "Century Club", description: "Roll 100 times", unlocked: false },
  { id: "sum-100", name: "First Hundred", description: "Total sum of 100", unlocked: false },
  { id: "sum-1000", name: "Thousandaire", description: "Total sum of 1000", unlocked: false },
  { id: "sum-10000", name: "Googol Seeker", description: "Total sum of 10000", unlocked: false },
  { id: "first-mod", name: "Modifier Rookie", description: "Use a modifier for the first time", unlocked: false },
  { id: "mixer", name: "Mixer", description: "Collect 100+ points with 3 different colors", unlocked: false },
];

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

  const checkAchievements = useCallback(
    (naturalRoll: number, modifiedRoll: number, hasModifiers: boolean, newStats: GameStats) => {
      const newlyUnlocked: string[] = [];

      // Natural roll achievements
      if (naturalRoll === 100 && !achievements.find((a) => a.id === "reach-100")?.unlocked) {
        unlockAchievement("reach-100");
        newlyUnlocked.push("Perfect Roll");
      }
      if (naturalRoll === 1 && !achievements.find((a) => a.id === "reach-1")?.unlocked) {
        unlockAchievement("reach-1");
        newlyUnlocked.push("Snake Eyes");
      }

      // Modified roll achievements
      if (hasModifiers && modifiedRoll >= 100 && !achievements.find((a) => a.id === "modified-100")?.unlocked) {
        unlockAchievement("modified-100");
        newlyUnlocked.push("Boosted Century");
      }

      // First modifier use
      if (hasModifiers && !achievements.find((a) => a.id === "first-mod")?.unlocked) {
        unlockAchievement("first-mod");
        newlyUnlocked.push("Modifier Rookie");
      }

      // Check roll count achievements
      if (newStats.totalRolls >= 10 && !achievements.find((a) => a.id === "ten-rolls")?.unlocked) {
        unlockAchievement("ten-rolls");
        newlyUnlocked.push("Getting Started");
      }
      if (newStats.totalRolls >= 50 && !achievements.find((a) => a.id === "fifty-rolls")?.unlocked) {
        unlockAchievement("fifty-rolls");
        newlyUnlocked.push("Dedicated Roller");
      }
      if (newStats.totalRolls >= 100 && !achievements.find((a) => a.id === "hundred-rolls")?.unlocked) {
        unlockAchievement("hundred-rolls");
        newlyUnlocked.push("Century Club");
      }

      // Check sum achievements (using total sum including modifiers)
      if (newStats.totalSum >= 100 && !achievements.find((a) => a.id === "sum-100")?.unlocked) {
        unlockAchievement("sum-100");
        newlyUnlocked.push("First Hundred");
      }
      if (newStats.totalSum >= 1000 && !achievements.find((a) => a.id === "sum-1000")?.unlocked) {
        unlockAchievement("sum-1000");
        newlyUnlocked.push("Thousandaire");
      }
      if (newStats.totalSum >= 10000 && !achievements.find((a) => a.id === "sum-10000")?.unlocked) {
        unlockAchievement("sum-10000");
        newlyUnlocked.push("Googol Seeker");
      }
      
      // Check mixer achievement
      const qualifyingColors = Object.values(newStats.colorTotals || {}).filter(total => total >= 100).length;
      if (qualifyingColors >= 3 && !achievements.find((a) => a.id === "mixer")?.unlocked) {
        unlockAchievement("mixer");
        newlyUnlocked.push("Mixer");
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
      console.log("new stats", newStats);
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
