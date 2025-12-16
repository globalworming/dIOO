import { Modifier, ModifierBonus, buildModifierColorMap } from "../components/ModifierPanel";
import { getModifierColor } from "../data/modifiers";
import { Skill, SKILL_PATTERNS } from "../components/SkillsPanel";
import { toast } from "sonner";

/**
 * Build a sorted colors array for skill pattern matching.
 * Sorts empty cells first, then dots. Keystones stay at their original positions.
 * 
 * @param items - 100-element boolean array (original grid order)
 * @param activeModifiers - Active modifiers for color lookup
 * @param keystones - Set of indices that are keystones (stay in place)
 * @returns 100-element array in sorted order: undefined for empty cells, color string for dots
 */
export const buildSortedColors = (
  items: boolean[],
  activeModifiers: Modifier[],
  keystones: Set<number> = new Set()
): (string | undefined)[] => {
  // Pre-build color map for O(1) lookups
  const colorMap = buildModifierColorMap(activeModifiers);

  // Build array of { hasDot, originalIndex, color }
  const cells = items.map((hasDot, originalIndex) => ({
    hasDot,
    originalIndex,
    color: hasDot ? (colorMap[originalIndex] ?? "default") : undefined,
  }));

  // Separate keystones from non-keystones
  const keystoneCells = cells.filter(c => keystones.has(c.originalIndex));
  const nonKeystoneCells = cells.filter(c => !keystones.has(c.originalIndex));

  // Sort non-keystones: empty cells first, then dots
  nonKeystoneCells.sort((a, b) => {
    if (a.hasDot === b.hasDot) return a.originalIndex - b.originalIndex;
    return a.hasDot ? 1 : -1;
  });

  // Build result array with keystones at their original positions
  const result: (string | undefined)[] = new Array(100);
  
  // Place keystones at their original positions
  for (const cell of keystoneCells) {
    result[cell.originalIndex] = cell.color;
  }
  
  // Fill remaining positions with sorted non-keystones
  let nonKeystoneIdx = 0;
  for (let pos = 0; pos < 100; pos++) {
    if (!keystones.has(pos)) {
      if (nonKeystoneIdx < nonKeystoneCells.length) {
        result[pos] = nonKeystoneCells[nonKeystoneIdx].color;
        nonKeystoneIdx++;
      }
    }
  }

  return result;
};

/**
 * Calculate bonus points from active modifiers based on dot positions.
 * Each dot can only be counted once (first matching modifier wins).
 * 
 * @param items - 100-element boolean array representing the 10x10 grid (true = dot present)
 * @param modifiers - Array of modifier configurations
 * @returns Array of bonuses per modifier color
 */
export const calculateModifierBonuses = (
  items: boolean[],
  modifiers: Modifier[]
): ModifierBonus[] => {
  const activeModifiers = modifiers.filter(m => m.active);
  const countedIndices = new Set<number>();
  
  return activeModifiers.map(mod => {
    let bonus = 0;
    for (const zoneIndex of mod.zones) {
      if (items[zoneIndex] && !countedIndices.has(zoneIndex)) {
        bonus++;
        countedIndices.add(zoneIndex);
      }
    }
    return { color: getModifierColor(mod.id), bonus };
  });
};

/**
 * Calculate bonus points from skill pattern matching on the sorted grid.
 * Scans the sorted grid for patterns that match active skills, consuming matched cells.
 * 
 * @param sortedColors - 100-element array of colors (or undefined) in sorted grid order.
 *                       Empty cells are undefined, dots have their modifier color (or undefined if no modifier).
 * @param skills - Array of skill configurations
 * @returns Skill bonuses, total bonus, and set of triggered skill IDs
 */
export const calculateSkillBonuses = (
  sortedColors: (string | undefined)[],
  skills: Skill[]
): { skillBonuses: ModifierBonus[], totalSkillBonus: number, triggeredSkills: Set<string>, consumedIndices: Set<number> } => {
  const activeSkills = skills.filter(s => s.active);
  const consumedIndices = new Set<number>();
  const skillBonuses: ModifierBonus[] = [];
  const triggeredSkills = new Set<string>();
  let totalSkillBonus = 0;

  for (const skill of activeSkills) {
    const pattern = SKILL_PATTERNS[skill.id];
    if (!pattern) continue;

    let skillCount = 0;

    // Scan sorted grid: slide pattern window across all valid positions
    // Pattern matching requires:
    // 1. All pattern cells have a dot (sortedColors[idx] !== undefined means dot present)
    // 2. No cell has been consumed by a previous pattern match
    // 3. All dots match the pattern's required color
    for (let r = 0; r <= 10 - pattern.height; r++) {
      for (let c = 0; c <= 10 - pattern.width; c++) {
        let match = true;
        const matchIndices: number[] = [];

        // Check each cell in the pattern
        for (const offset of pattern.offsets) {
          const idx = (r + offset.r) * 10 + (c + offset.c);
          const cellColor = sortedColors[idx];
          
          // Cell must have a dot and not be consumed
          if (cellColor === undefined || consumedIndices.has(idx)) {
            match = false;
            break;
          }
          // Verify dot color matches pattern requirement
          if (cellColor !== pattern.color) {
            match = false;
            break;
          }
          matchIndices.push(idx);
        }

        if (match) {
          skillCount++;
          // Mark matched cells as consumed so they can't be reused
          matchIndices.forEach(idx => consumedIndices.add(idx));
          triggeredSkills.add(skill.id);
        }
      }
    }

    if (skillCount > 0) {
      skillBonuses.push({
        color: pattern.color,
        bonus: skillCount
      });
      totalSkillBonus += skillCount;
    }
  }

  return { skillBonuses, totalSkillBonus, triggeredSkills, consumedIndices };
};

/**
 * Combine bonuses of the same color into single entries.
 * Used when both modifiers and skills contribute bonuses of the same color.
 * 
 * @param bonuses - Array of bonuses (may have duplicate colors)
 * @returns Array with bonuses aggregated by color
 */
export const aggregateBonuses = (bonuses: ModifierBonus[]): ModifierBonus[] => {
  const aggregated = bonuses.reduce((acc, curr) => {
    const existing = acc.find(b => b.color === curr.color);
    if (existing) {
      existing.bonus += curr.bonus;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as ModifierBonus[]);
  return aggregated;
};

/**
 * Record a roll for achievement tracking and show toast notifications for newly unlocked achievements.
 * 
 * @param rolledResult - The natural D100 roll (1-100)
 * @param finalResult - The final result after all bonuses
 * @param hasModifiers - Whether any modifiers were active
 * @param bonuses - Array of bonuses applied
 * @param recordRoll - Function from useAchievements hook to record the roll
 */
export const handleAchievements = (
  rolledResult: number,
  finalResult: number,
  hasModifiers: boolean,
  bonuses: ModifierBonus[] = [],
  recordRoll: (result: number, finalResult: number, hasModifiers: boolean, bonuses?: ModifierBonus[]) => string[]
) => {
  const newlyUnlocked = recordRoll(rolledResult, finalResult, hasModifiers, bonuses);
  newlyUnlocked.forEach((name) => {
    toast.success(`Achievement Unlocked: ${name}!`, { duration: 3000 });
  });
};
