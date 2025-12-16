import { useState, useCallback, useEffect, useMemo } from "react";
import { ACHIEVEMENT_DEFS, AchievementContext, GameStats, getAvailableAchievements, AchievementDef, START_ACHIEVEMENT_ID } from "@/data/achievements";
import { toast } from "sonner";

export type { GameStats };

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  /** Timestamp when unlocked, used for sorting */
  unlockedAt?: number;
}

/** Convert achievement definitions to initial state (all locked) */
const DEFAULT_ACHIEVEMENTS: Achievement[] = ACHIEVEMENT_DEFS.map(def => ({
  id: def.id,
  name: def.name,
  description: def.description,
  unlocked: false,
  unlockedAt: undefined,
}));

const STORAGE_KEY = "dioo-game-state";

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

  // Track the most recently unlocked achievement ID
  const [latestUnlockedId, setLatestUnlockedId] = useState<string | null>(null);

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
    const achievementDef = ACHIEVEMENT_DEFS.find(d => d.id === id);
    if (achievement && !achievement.unlocked && achievementDef) {
      // Check if achievement requires resources and deduct them
      if (achievementDef.manualUnlockResourceSpent) {
        const requiredResources = achievementDef.manualUnlockResourceSpent();
        const newInventory = { ...stats.inventory };
        
        // Deduct rolls
        if (requiredResources.rolls) {
          newInventory.rolls = Math.max(0, newInventory.rolls - requiredResources.rolls);
        }
        
        // Deduct colors
        Object.entries(requiredResources).forEach(([resource, amount]) => {
          if (resource !== 'rolls' && typeof amount === 'number') {
            newInventory.colors[resource] = Math.max(0, (newInventory.colors[resource] || 0) - amount);
          }
        });
        
        // Update stats with new inventory
        setStats(prev => ({ ...prev, inventory: newInventory }));
      }
      
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a))
      );
      setLatestUnlockedId(id);
      toast.success(`Achievement Unlocked: ${achievement.name}!`, { duration: 3000 });
    }
  }, [achievements, stats.inventory]);

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

  // Sort unlocked achievements by unlock time (most recent first)
  const unlockedDefsSorted = useMemo(() => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    // Sort by unlockedAt descending (most recent first), fallback to 0 for old data
    unlockedAchievements.sort((a, b) => (b.unlockedAt ?? 0) - (a.unlockedAt ?? 0));
    // Map to definitions
    return unlockedAchievements
      .map(a => ACHIEVEMENT_DEFS.find(d => d.id === a.id))
      .filter((d): d is AchievementDef => d !== undefined);
  }, [achievements]);

  // Get the latest unlocked achievement definition
  const latestUnlockedDef = useMemo(
    () => latestUnlockedId ? ACHIEVEMENT_DEFS.find(d => d.id === latestUnlockedId) ?? null : null,
    [latestUnlockedId]
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

      const newInventory = { ...stats.inventory };
      if (achievements.find(a => a.id === "five-rolls")?.unlocked ?? false) {
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

  const addInventoryResources = useCallback((resources: { rolls?: number; colors?: Record<string, number> }) => {
    setStats(prev => {
      const newInventory = { ...prev.inventory };
      
      // Add rolls
      if (resources.rolls) {
        newInventory.rolls = Math.min(INVENTORY_CAP, newInventory.rolls + resources.rolls);
      }
      
      // Add colors
      if (resources.colors) {
        const newColors = { ...newInventory.colors };
        Object.entries(resources.colors).forEach(([color, amount]) => {
          newColors[color] = Math.min(INVENTORY_CAP, (newColors[color] || 0) + amount);
        });
        newInventory.colors = newColors;
      }
      
      return { ...prev, inventory: newInventory };
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newlyUnlocked = checkAchievements(0, 0, false, stats);
      newlyUnlocked.forEach((name) => {
        toast.success(`Achievement Unlocked: ${name}!`, { duration: 3000 });
      });
    }, 400);
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
    /** Debug: add inventory resources */
    addInventoryResources,
    /** Manually unlock an achievement by ID */
    unlockAchievement,
    /** Achievements that are unlocked (walked from start) */
    unlockedDefs,
    /** Unlocked achievements sorted by unlock time (most recent first) */
    unlockedDefsSorted,
    /** Achievements available to unlock next (parent unlocked, not yet achieved) */
    availableDefs,
    /** Total number of achievements in the game */
    totalAchievementCount: ACHIEVEMENT_DEFS.length,
    /** The most recently unlocked achievement */
    latestUnlockedDef,
  };
};
