import { Modifier, ModifierBonus, MODIFIER_COLORS, getModifierColor } from "../components/ModifierPanel";
import { Skill, SKILL_PATTERNS } from "../components/SkillsPanel";
import { toast } from "sonner";

export const calculateSkillBonuses = (
  items: boolean[], 
  skills: Skill[], 
  activeModifiers: Modifier[]
): { skillBonuses: ModifierBonus[], totalSkillBonus: number, triggeredSkills: Set<string> } => {
  const activeSkills = skills.filter(s => s.active);
  const consumedIndices = new Set<number>();
  const skillBonuses: ModifierBonus[] = [];
  const triggeredSkills = new Set<string>();
  let totalSkillBonus = 0;

  for (const skill of activeSkills) {
    const pattern = SKILL_PATTERNS[skill.id];
    if (!pattern) continue;

    let skillCount = 0;

    // Scan grid
    for (let r = 0; r <= 10 - pattern.height; r++) {
      for (let c = 0; c <= 10 - pattern.width; c++) {
        let match = true;
        const matchIndices: number[] = [];

        for (const offset of pattern.offsets) {
          const idx = (r + offset.r) * 10 + (c + offset.c);
          if (!items[idx] || consumedIndices.has(idx)) {
            match = false;
            break;
          }
          const dotColor = getModifierColor(idx, activeModifiers);
          if (dotColor !== pattern.color) {
            match = false;
            break;
          }
          matchIndices.push(idx);
        }

        if (match) {
          skillCount++;
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

  return { skillBonuses, totalSkillBonus, triggeredSkills };
};

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
