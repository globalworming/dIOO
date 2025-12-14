import { useState, useCallback, useEffect, useMemo } from "react";
import { ACHIEVEMENT_DEFS, AchievementContext, GameStats, getAvailableAchievements, AchievementDef, START_ACHIEVEMENT_ID } from "@/data/achievements";
import { toast } from "sonner";

export type { GameStats };

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

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
  rolledNumbers: new Set<number>(),
  recentRolls: [],
  inventory: {
    colors: {},
    rolls: 0,
  },
};

const INVENTORY_CAP = 1000;

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
      // Restore rolledNumbers as a Set (JSON serializes it as array)
      const rolledNumbers = new Set<number>(parsed.stats.rolledNumbers || []);
      const recentRolls = parsed.stats.recentRolls || [];
      const inventory = parsed.stats.inventory || { colors: {}, rolls: 0 };
      return { ...DEFAULT_STATS, ...parsed.stats, rolledNumbers, recentRolls, inventory };
    }
    return DEFAULT_STATS;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    // Convert Set to array for JSON serialization
    const statsForStorage = {
      ...stats,
      rolledNumbers: Array.from(stats.rolledNumbers),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ achievements, stats: statsForStorage }));
  }, [achievements, stats]);

  const unlockAchievement = useCallback((id: string) => {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
      );
      toast.success(`Achievement Unlocked: ${achievement.name}!`, { duration: 3000 });
    }
  }, [achievements]);

  // Build set of unlocked IDs for tree traversal
  const unlockedIds = useMemo(
    () => new Set(achievements.filter(a => a.unlocked).map(a => a.id)),
    [achievements]
  );

  // Get unlocked and available achievements from the tree
  const { unlocked: unlockedDefs, available: availableDefs } = useMemo(
    () => getAvailableAchievements(unlockedIds),
    [unlockedIds]
  );

  /**
   * Check only available achievements (those whose parent is unlocked).
   * Uses tree-based approach: only checks achievements that are reachable.
   */
  const checkAchievements = useCallback(
    (naturalRoll: number, modifiedRoll: number, hasModifiers: boolean, newStats: GameStats) => {
      const newlyUnlocked: string[] = [];
      const ctx: AchievementContext = { naturalRoll, modifiedRoll, hasModifiers, stats: newStats };

      // Check start achievement first (always available)
      const startAchievement = achievements.find(a => a.id === START_ACHIEVEMENT_ID);
      if (!startAchievement?.unlocked) {
        const startDef = ACHIEVEMENT_DEFS.find(d => d.id === START_ACHIEVEMENT_ID);
        if (startDef?.condition(ctx)) {
          unlockAchievement(START_ACHIEVEMENT_ID);
          newlyUnlocked.push(startDef.name);
        }
      }

      // Check available achievements (those whose parent is unlocked)
      for (const def of availableDefs) {
        if (def.condition(ctx)) {
          unlockAchievement(def.id);
          newlyUnlocked.push(def.name);
        }
      }

      return newlyUnlocked;
    },
    [achievements, availableDefs, unlockAchievement]
  );

  const recordRoll = useCallback(
    (naturalRoll: number, modifiedRoll: number, hasModifiers: boolean, bonuses: { color: string; bonus: number }[] = []) => {
      
      const newColorTotals = { ...stats.colorTotals };
      bonuses.forEach(({ color, bonus }) => {
        newColorTotals[color] = (newColorTotals[color] || 0) + bonus;
      });
      
      // Track rolled numbers
      const newRolledNumbers = new Set(stats.rolledNumbers);
      newRolledNumbers.add(naturalRoll);

      // Track recent rolls (keep last 3)
      const newRecentRolls = [naturalRoll, ...stats.recentRolls].slice(0, 3);

      // Update inventory (capped at INVENTORY_CAP) - only after ten-rolls unlocked
      const tenRollsUnlocked = achievements.find(a => a.id === "ten-rolls")?.unlocked ?? false;
      const newInventory = { ...stats.inventory };
      if (tenRollsUnlocked) {
        // Add color bonuses to inventory
        const newInventoryColors = { ...newInventory.colors };
        bonuses.forEach(({ color, bonus }) => {
          newInventoryColors[color] = Math.min(
            INVENTORY_CAP,
            (newInventoryColors[color] || 0) + bonus
          );
        });
        newInventory.colors = newInventoryColors;
        // Add natural roll value to rolls inventory
        newInventory.rolls = Math.min(INVENTORY_CAP, newInventory.rolls + naturalRoll);
      }

      const newStats: GameStats = {
        highestRoll: Math.max(stats.highestRoll, modifiedRoll),
        totalSum: stats.totalSum + modifiedRoll,
        totalNaturalSum: stats.totalNaturalSum + naturalRoll,
        totalRolls: stats.totalRolls + 1,
        totalModifiedRolls: hasModifiers ? stats.totalModifiedRolls + 1 : stats.totalModifiedRolls,
        colorTotals: newColorTotals,
        rolledNumbers: newRolledNumbers,
        recentRolls: newRecentRolls,
        inventory: newInventory,
      };
      setStats(newStats);
      return checkAchievements(naturalRoll, modifiedRoll, hasModifiers, newStats);
    },
    [stats, achievements, checkAchievements]
  );

  const resetGame = useCallback(() => {
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStats(DEFAULT_STATS);
  }, []);

  const setTotalRolls = useCallback((value: number) => {
    setStats(prev => ({ ...prev, totalRolls: value }));
  }, []);

  // Check achievements on page load after 2 seconds (for stat-based achievements like "init")
  useEffect(() => {
    const timer = setTimeout(() => {
      const newlyUnlocked = checkAchievements(0, 0, false, stats);
      newlyUnlocked.forEach((name) => {
        toast.success(`Achievement Unlocked: ${name}!`, { duration: 3000 });
      });
    }, 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { 
    achievements, 
    stats, 
    recordRoll, 
    resetGame,
    /** Debug: set total rolls directly */
    setTotalRolls,
    /** Manually unlock an achievement by ID */
    unlockAchievement,
    /** Achievements that are unlocked (walked from start) */
    unlockedDefs,
    /** Achievements available to unlock next (parent unlocked, not yet achieved) */
    availableDefs,
    /** Total number of achievements in the game */
    totalAchievementCount: ACHIEVEMENT_DEFS.length,
  };
};
