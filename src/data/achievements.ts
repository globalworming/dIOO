export interface GameStats {
  highestRoll: number;
  totalSum: number;
  totalNaturalSum: number;
  totalRolls: number;
  totalModifiedRolls: number;
  colorTotals: Record<string, number>;
  /** Track which natural numbers (1-100) have been rolled */
  rolledNumbers: Set<number>;
  /** Track last 3 natural rolls for consecutive roll achievements */
  recentRolls: number[];
}

/** Context passed to achievement condition functions */
export interface AchievementContext {
  naturalRoll: number;
  modifiedRoll: number;
  hasModifiers: boolean;
  stats: GameStats;
}

/** Achievement definition with condition function and unlock tree */
export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  /** Returns true if achievement should be unlocked */
  condition: (ctx: AchievementContext) => boolean;
  /** IDs of achievements that become available after this one is unlocked */
  next?: string[];
}

/** The starting achievement - unlocked by default */
export const START_ACHIEVEMENT_ID = "start";

/**
 * Achievement definitions with their unlock conditions.
 * Forms a tree via `next` relations. Start from "start" which is unlocked by default.
 */
export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "start",
    name: "First Roll",
    description: "Roll the dice for the first time",
    condition: ({ stats }) => stats.totalRolls >= 1,
    next: ["ten-rolls", "sum-100"],
  },
  {
    id: "ten-rolls",
    name: "Getting Started",
    description: "Roll 10 times",
    condition: ({ stats }) => stats.totalRolls >= 10,
    next: ["fifty-rolls", "reach-1"],
  },
  {
    id: "fifty-rolls",
    name: "Dedicated Roller",
    description: "Roll 50 times",
    condition: ({ stats }) => stats.totalRolls >= 50,
    next: ["hundred-rolls"],
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
    next: ["sum-1000", "first-mod"],
  },
  {
    id: "sum-1000",
    name: "Thousandaire",
    description: "Total sum of 1000",
    condition: ({ stats }) => stats.totalSum >= 1000,
    next: ["sum-10000"],
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
    next: ["modified-100", "mixer"],
  },
  {
    id: "modified-100",
    name: "Boosted Century",
    description: "Reach 100+ with modifiers",
    condition: ({ modifiedRoll, hasModifiers }) => hasModifiers && modifiedRoll >= 100,
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
  {
    id: "reach-1",
    name: "Snake Eyes",
    description: "Roll a natural 1",
    condition: ({ naturalRoll }) => naturalRoll === 1,
    next: ["reach-100", "reach-2"],
  },
  {
    id: "reach-2",
    name: "Open your third eye",
    description: "Roll a natural 2",
    condition: ({ naturalRoll }) => naturalRoll === 2,
    next: ["reach-3"],
  },
  {
    id: "reach-3",
    name: "Now see",
    description: "Roll a natural 3",
    condition: ({ naturalRoll }) => naturalRoll === 3,
    next: Array.from({ length: 100 }, (_, i) => `reach-${i + 1}`).slice(3, -1),
  },
  // Generate reach-4 through reach-99
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `reach-${i + 1}`,
    name: `Roll ${i + 1}`,
    description: `Roll a natural ${i + 1}`,
    condition: ({ naturalRoll }: AchievementContext) => naturalRoll === i + 1,
    next: ["reach-all"],
  })).slice(3, -1),
  {
    id: "reach-100",
    name: "Perfect Roll",
    description: "Roll a natural 100",
    condition: ({ naturalRoll }) => naturalRoll === 100,
    next: ["reach-all", "one-in-a-million"],
  },
  {
    id: "reach-all",
    name: "Master of the Dice",
    description: "Rolled all numbers 1-100",
    condition: ({ stats }) => stats.rolledNumbers.size >= 100,
  },
  {
    id: "one-in-a-million",
    name: "One in a Million",
    description: "Or something close, pretty unlikely to roll two consecutive 100s",
    condition: ({ stats }) => stats.recentRolls.length >= 2 && stats.recentRolls[0] === 100 && stats.recentRolls[1] === 100,
    next: ["one-in-a-billion"]
  },
  {
    id: "one-in-a-billion",
    name: "One in a Billion",
    description: "Or something close, pretty unlikely to roll three consecutive 100s",
    condition: ({ stats }) => stats.recentRolls.length >= 3 && stats.recentRolls.every(r => r === 100),
    next: []
  },
];

/** Lookup map for quick access by ID */
export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENT_DEFS.map(def => [def.id, def]));

/**
 * Get all achievements that are available to unlock (their parent is unlocked).
 * Walks the tree from start, collecting unlocked achievements and their available next.
 */
export const getAvailableAchievements = (
  unlockedIds: Set<string>
): { unlocked: AchievementDef[]; available: AchievementDef[] } => {
  const unlocked: AchievementDef[] = [];
  const available: AchievementDef[] = [];
  const visited = new Set<string>();

  const walk = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);

    const def = ACHIEVEMENT_MAP.get(id);
    if (!def) return;

    if (unlockedIds.has(id)) {
      unlocked.push(def);
      // Check next achievements
      for (const nextId of def.next ?? []) {
        if (unlockedIds.has(nextId)) {
          walk(nextId);
        } else {
          const nextDef = ACHIEVEMENT_MAP.get(nextId);
          if (nextDef && !available.includes(nextDef)) {
            available.push(nextDef);
          }
        }
      }
    }
  };

  walk(START_ACHIEVEMENT_ID);
  return { unlocked, available };
};
