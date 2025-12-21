import { MODIFIER_THEME_COLORS } from "./modifiers";

export interface GameStats {
  highestRoll: number;
  totalSum: number;
  totalNaturalSum: number;
  totalRolls: number;
  totalModifiedRolls: number;
  colorTotals: Record<string, number>;
  /** Number of available modifier slots */
  maxSlots: number;
  /** Track which natural numbers (1-100) have been rolled */
  rolledNumbers: Set<number>;
  /** Track last 3 natural rolls for consecutive roll achievements */
  recentRolls: number[];
  /** Accumulated resources (capped at 1000 each) */
  inventory: {
    /** Accumulated color points by color */
    colors: Record<string, number>;
    /** Accumulated normal roll points */
    rolls: number;
  };
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
  /** Spend resources from inventory to unlock this achievement manually */
  manualUnlockResourceSpent?: () => Record<string, number>;
}

/** The starting achievement - unlocked by default */
export const START_ACHIEVEMENT_ID = "init";

/**
 * Achievement definitions with their unlock conditions.
 * Forms a tree via `next` relations. 
 */
export const ACHIEVEMENT_DEFS: AchievementDef[] = [

  {
    id: "init",
    name: "Participation Trophy",
    description: `You showed up! I bet the developers are very appreciative of that. You should tell them! 
    Really, go and demand some recognition, you deserve it, without a doubt!`,
    condition: () => true,
    next: ["start", "open-achievements"]
  },
  {
    id: "open-achievements",
    name: "There is potential in this one",
    description: "Open the achievements panel",
    condition: () => false,
    next: ["first-unlock"]
  },
  {
    id: "first-unlock",
    name: "Ugh, you gave it free will?",
    description: "Unlock me. Or don't. Nobody is forcing you to anything here.",
    condition: () => false,
    next: [],
    manualUnlockResourceSpent: () => {
      // This achievement has no further requirements for unlocking manually
      return {}
    }
  },
  {
    id: "start",
    name: "First Roll",
    description: "Roll the dice for the first time",
    condition: ({ stats }) => stats.totalRolls >= 1,
    next: ["five-rolls", "sum-100"],
  },
  {
    id: "five-rolls",
    name: "That's how they get you",
    description: "Roll 5 times",
    condition: ({ stats }) => stats.totalRolls >= 5,
    next: ["inventory-1", "ten-rolls"],
  },
  {
    id: "inventory-1",
    name: "Numbers go up",
    description: "Seize the means of accumulation",
    condition: () => false,
    next: [],
  },
  {
    id: "ten-rolls",
    name: "Getting Started",
    description: "Roll 10 times",
    condition: ({ stats }) => stats.totalRolls >= 10,
    next: ["fifty-rolls", "reach-1", "corners-1", "bullseye-1", "diagonals-1", "waves-1", "dots-1"],
  },
  {
    id: "fifty-rolls",
    name: "Dedicated Roller",
    description: "Roll 50 times",
    condition: ({ stats }) => stats.totalRolls >= 50,
    next: ["hundred-rolls", "keystone-unlockable"],
  },
  {
    id: "keystone-unlockable",
    name: "Keystones",
    description: "Use keystones to lock in results",
    condition: () => false,
    next: ["first-keystone"],
    manualUnlockResourceSpent: () => {
      // This achievement has no further requirements for unlocking manually
      return {}
    }
  },
  {
    id: "first-keystone",
    name: "First Keystone",
    description: "Punching rocks, punching rocks, punching rocks, ...",
    condition: () => false,
    next: [],
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
    next: ["reach-100"],
  },
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
  {
    id: "corners-1",
    name: "Stability",
    description: "No need to be on edge. Everything will eventually settle,",
    condition: ({ }) => false,
    next: ["corners-2"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400};
    }
  },
  {
    id: "corners-2",
    name: "Spread",
    description: `Give me enough shoulders to rest on, and no lever will be big
    enough to tip me over.`,
    condition: ({ }) => false,
    next: ["corners-3"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
        [MODIFIER_THEME_COLORS.corners]: 100,
      };
    }
  },
  {
    id: "bullseye-1",
    name: "Mediocrity",
    description: "There is safety in numbers",
    condition: ({ }) => false,
    next: ["bullseye-2"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
      };
    }
  },
  {
    id: "dots-1",
    name: "Grass Roots",
    description: "1 + 1 + 1 makes a community",
    condition: ({ }) => false,
    next: ["dots-2"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
      };
    }
  },
  {
    id: "dots-2",
    name: "Grass Roots",
    description: "1 + 1 + 1 makes a community",
    condition: ({ }) => false,
    next: ["dots-3"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
        [MODIFIER_THEME_COLORS.dots]: 15,
      };
    }
  },
  {
    id: "dots-3",
    name: "Grass Roots",
    description: "1 + 1 + 1 makes a community",
    condition: ({ }) => false,
    next: ["dots-4"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
        [MODIFIER_THEME_COLORS.dots]: 25,
      };
    }
  },
  {
    id: "dots-4",
    name: "Grass Roots",
    description: "1 + 1 + 1 makes a community",
    condition: ({ }) => false,
    next: ["dots-5"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
        [MODIFIER_THEME_COLORS.dots]: 50,
        [MODIFIER_THEME_COLORS.bullseye]: 500,
      };
    }
  },
  {
    id: "dots-5",
    name: "Grass Roots",
    description: "Communities support each other",
    condition: ({ }) => false,
    next: [],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
        [MODIFIER_THEME_COLORS.dots]: 250,
      };
    }
  },
    
  {
    id: "diagonals-1",
    name: "Righteousness",
    description: "Do not sway",
    condition: ({ }) => false,
    next: ["diagonals-2"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
      };
    }
  },
  {
    id: "diagonals-2",
    name: "Righteousness",
    description: "We are legion",
    condition: ({ }) => false,
    next: ["diagonals-3"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400,
        [MODIFIER_THEME_COLORS.diagonals]: 100, 
      };
    }
  },
  {
    id: "waves-1",
    name: "Sustainability",
    description: "What goes up must come down",
    condition: ({ }) => false,
    next: ["waves-2"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400, 
      };
    }
  },
  {
    id: "waves-2",
    name: "Sustainability",
    description: "Bring balance",
    condition: ({ }) => false,
    next: ["waves-3"],
    manualUnlockResourceSpent: () => {
      return  {rolls: 400,
        [MODIFIER_THEME_COLORS.waves]: 100, 
      };
    }
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
