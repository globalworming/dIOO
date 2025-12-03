import { useState, useEffect, useCallback } from "react";

interface GameStats {
  totalRolls: number;
  highestRoll: number;
  sumOfRolls: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface GameState {
  history: number[];
  stats: GameStats;
  achievements: Achievement[];
}

const STORAGE_KEY = "d100-roller-state";

const DEFAULT_STATS: GameStats = {
  totalRolls: 0,
  highestRoll: 0,
  sumOfRolls: 0,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "reach-100", name: "Perfect Roll", description: "Roll a 100", unlocked: false },
  { id: "reach-1", name: "Snake Eyes", description: "Roll a 1", unlocked: false },
  { id: "ten-rolls", name: "Getting Started", description: "Roll 10 times", unlocked: false },
  { id: "fifty-rolls", name: "Dedicated Roller", description: "Roll 50 times", unlocked: false },
  { id: "hundred-rolls", name: "Century Club", description: "Roll 100 times", unlocked: false },
  { id: "sum-100", name: "First Hundred", description: "Total sum of 100", unlocked: false },
  { id: "sum-1000", name: "Thousandaire", description: "Total sum of 1000", unlocked: false },
  { id: "sum-10000", name: "Googol Seeker", description: "Total 1^100", unlocked: false },
];

const loadState = (): GameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle new achievements
      return {
        history: parsed.history || [],
        stats: { ...DEFAULT_STATS, ...parsed.stats },
        achievements: DEFAULT_ACHIEVEMENTS.map(def => {
          const saved = parsed.achievements?.find((a: Achievement) => a.id === def.id);
          return saved || def;
        }),
      };
    }
  } catch (e) {
    console.error("Failed to load game state", e);
  }
  return { history: [], stats: DEFAULT_STATS, achievements: [...DEFAULT_ACHIEVEMENTS] };
};

const saveState = (state: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state", e);
  }
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(loadState);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addRoll = useCallback((roll: number) => {
    setState(prev => {
      const newHistory = [roll, ...prev.history];
      const newStats: GameStats = {
        totalRolls: prev.stats.totalRolls + 1,
        highestRoll: Math.max(prev.stats.highestRoll, roll),
        sumOfRolls: prev.stats.sumOfRolls + roll,
      };

      const unlocked: Achievement[] = [];
      const newAchievements = prev.achievements.map(ach => {
        if (ach.unlocked) return ach;
        
        let shouldUnlock = false;
        if (ach.id === "reach-100" && roll === 100) shouldUnlock = true;
        if (ach.id === "reach-1" && roll === 1) shouldUnlock = true;
        if (ach.id === "ten-rolls" && newStats.totalRolls >= 10) shouldUnlock = true;
        if (ach.id === "fifty-rolls" && newStats.totalRolls >= 50) shouldUnlock = true;
        if (ach.id === "hundred-rolls" && newStats.totalRolls >= 100) shouldUnlock = true;
        if (ach.id === "sum-100" && newStats.sumOfRolls >= 100) shouldUnlock = true;
        if (ach.id === "sum-1000" && newStats.sumOfRolls >= 1000) shouldUnlock = true;
        if (ach.id === "sum-10000" && newStats.sumOfRolls >= 10000) shouldUnlock = true;

        if (shouldUnlock) {
          const unlockedAch = { ...ach, unlocked: true, unlockedAt: Date.now() };
          unlocked.push(unlockedAch);
          return unlockedAch;
        }
        return ach;
      });

      if (unlocked.length > 0) {
        setNewlyUnlocked(unlocked);
      }

      return { history: newHistory, stats: newStats, achievements: newAchievements };
    });
  }, []);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ history: [], stats: DEFAULT_STATS, achievements: [...DEFAULT_ACHIEVEMENTS] });
    setNewlyUnlocked([]);
  }, []);

  return {
    history: state.history,
    stats: state.stats,
    achievements: state.achievements,
    newlyUnlocked,
    addRoll,
    clearNewlyUnlocked,
    resetProgress,
  };
};
