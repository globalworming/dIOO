import { useState, useCallback, useEffect } from "react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface GameStats {
  highestRoll: number;
  totalSum: number;
  totalRolls: number;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "reach-100", name: "Perfect Roll", description: "Roll a 100", unlocked: false },
  { id: "reach-1", name: "Snake Eyes", description: "Roll a 1", unlocked: false },
  { id: "ten-rolls", name: "Getting Started", description: "Roll 10 times", unlocked: false },
  { id: "fifty-rolls", name: "Dedicated Roller", description: "Roll 50 times", unlocked: false },
  { id: "hundred-rolls", name: "Century Club", description: "Roll 100 times", unlocked: false },
  { id: "sum-100", name: "First Hundred", description: "Total sum of 100", unlocked: false },
  { id: "sum-1000", name: "Thousandaire", description: "Total sum of 1000", unlocked: false },
  { id: "sum-10000", name: "Googol Seeker", description: "Total sum of 10000", unlocked: false },
];

const STORAGE_KEY = "d100-game-state";

interface StoredState {
  achievements: Achievement[];
  stats: GameStats;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredState = JSON.parse(stored);
      return parsed.achievements;
    }
    return DEFAULT_ACHIEVEMENTS;
  });

  const [stats, setStats] = useState<GameStats>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredState = JSON.parse(stored);
      return parsed.stats;
    }
    return { highestRoll: 0, totalSum: 0, totalRolls: 0 };
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
    (roll: number, newStats: GameStats) => {
      const newlyUnlocked: string[] = [];

      // Check roll-based achievements
      if (roll === 100 && !achievements.find((a) => a.id === "reach-100")?.unlocked) {
        unlockAchievement("reach-100");
        newlyUnlocked.push("Perfect Roll");
      }
      if (roll === 1 && !achievements.find((a) => a.id === "reach-1")?.unlocked) {
        unlockAchievement("reach-1");
        newlyUnlocked.push("Snake Eyes");
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

      // Check sum achievements
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

      return newlyUnlocked;
    },
    [achievements, unlockAchievement]
  );

  const recordRoll = useCallback(
    (roll: number) => {
      const newStats: GameStats = {
        highestRoll: Math.max(stats.highestRoll, roll),
        totalSum: stats.totalSum + roll,
        totalRolls: stats.totalRolls + 1,
      };
      setStats(newStats);
      return checkAchievements(roll, newStats);
    },
    [stats, checkAchievements]
  );

  const resetGame = useCallback(() => {
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStats({ highestRoll: 0, totalSum: 0, totalRolls: 0 });
  }, []);

  return { achievements, stats, recordRoll, resetGame };
};
