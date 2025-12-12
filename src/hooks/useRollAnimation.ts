import { useState, useCallback, useRef } from "react";
import { Modifier, ModifierBonus } from "@/components/ModifierPanel";
import { Skill } from "@/components/SkillsPanel";
import { calculateModifierBonuses, calculateSkillBonuses, handleAchievements, aggregateBonuses, buildSortedColors } from "@/utils/gameLogic";

/**
 * Animation phases for the dice roll sequence:
 * - idle: Waiting for user to roll
 * - random: Converging animation showing random dots
 * - sorting: Dots animate into sorted positions
 * - sorted: Final result displayed
 * - modifying: Modifier bonuses being calculated/displayed
 * - skilling: Skill pattern bonuses being calculated/displayed
 */
export type Phase = "idle" | "random" | "sorting" | "sorted" | "modifying" | "skilling";

/** Generate items with exactly `count` dots randomly distributed using Fisher-Yates shuffle */
const generateItemsWithDots = (count: number): boolean[] => {
  const items = Array.from({ length: 100 }, (_, i) => i < count);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

/** Generate items with probability that converges from 50% to the target result */
const generateConvergingItems = (targetResult: number, progress: number): boolean[] => {
  const targetProbability = targetResult / 100;
  const currentProbability = 0.5 + (targetProbability - 0.5) * progress;
  return Array.from({ length: 100 }, () => Math.random() < currentProbability);
};

/** Roll D100 (1-100) */
const rollD100 = (): number => Math.floor(Math.random() * 100) + 1;

interface UseRollAnimationOptions {
  modifiers: Modifier[];
  skills: Skill[];
  recordRoll: (result: number, finalResult: number, hasModifiers: boolean, bonuses?: ModifierBonus[]) => string[];
  onSkillsTriggered?: (triggeredIds: Set<string>) => void;
}

interface UseRollAnimationReturn {
  items: boolean[];
  phase: Phase;
  result: number | null;
  modifiedResult: number | null;
  modifierBonuses: ModifierBonus[];
  roll: () => void;
  isRolling: boolean;
}

/**
 * Hook that encapsulates the D100 roll animation state machine.
 * 
 * Animation sequence:
 * 1. Roll D100 to determine result
 * 2. Converging animation (6 iterations, 140ms each)
 * 3. Generate final items with exact dot count
 * 4. Sorting animation (duration based on result)
 * 5. If modifiers active: calculate bonuses (600ms delay)
 * 6. If skills active: calculate skill bonuses (600ms delay)
 * 7. Record roll for achievements
 */
export const useRollAnimation = ({
  modifiers,
  skills,
  recordRoll,
  onSkillsTriggered,
}: UseRollAnimationOptions): UseRollAnimationReturn => {
  const [items, setItems] = useState<boolean[]>(() => generateItemsWithDots(0));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(0);
  const [modifiedResult, setModifiedResult] = useState<number | null>(null);
  const [modifierBonuses, setModifierBonuses] = useState<ModifierBonus[]>([]);
  
  // Track active intervals/timeouts for cleanup
  const animationRef = useRef<{ interval?: NodeJS.Timeout; timeouts: NodeJS.Timeout[] }>({
    timeouts: [],
  });

  const hasActiveModifiers = modifiers.some(m => m.active);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted") return;

    // Clear any pending animations
    if (animationRef.current.interval) {
      clearInterval(animationRef.current.interval);
    }
    animationRef.current.timeouts.forEach(clearTimeout);
    animationRef.current.timeouts = [];

    const rolledResult = rollD100();
    setResult(null);
    setModifiedResult(null);
    setModifierBonuses([]);
    setPhase("random");

    // Phase 1: Converging animation
    let randomCount = 0;
    const iterations = 6;
    
    animationRef.current.interval = setInterval(() => {
      const progress = randomCount / iterations;
      setItems(generateConvergingItems(rolledResult, progress));
      randomCount++;
      
      if (randomCount >= iterations) {
        clearInterval(animationRef.current.interval!);
        
        // Phase 2: Generate final items and start sorting
        const finalItems = generateItemsWithDots(rolledResult);
        setItems(finalItems);
        setPhase("sorting");

        // Phase 3: Complete sorting - duration inversely proportional to result
        const sortingDuration = 1200 - 10 * rolledResult;
        const sortTimeout = setTimeout(() => {
          setResult(rolledResult);

          if (hasActiveModifiers) {
            // Phase 4: Calculate modifier bonuses
            setPhase("modifying");

            const modifyTimeout = setTimeout(() => {
              const bonuses = calculateModifierBonuses(finalItems, modifiers);
              const totalBonus = bonuses.reduce((sum, b) => sum + b.bonus, 0);
              
              setModifierBonuses(bonuses);
              setModifiedResult(rolledResult + totalBonus);

              // Phase 5: Check for skill bonuses
              const activeSkills = skills.filter(s => s.active);
              if (activeSkills.length > 0) {
                setPhase("skilling");

                const skillTimeout = setTimeout(() => {
                  const activeMods = modifiers.filter(m => m.active);
                  const sortedColors = buildSortedColors(finalItems, activeMods);
                  const { skillBonuses, totalSkillBonus, triggeredSkills } = calculateSkillBonuses(
                    sortedColors,
                    skills
                  );

                  if (triggeredSkills.size > 0) {
                    onSkillsTriggered?.(triggeredSkills);
                  }

                  const allBonuses = [...bonuses, ...skillBonuses];
                  const finalBonuses = aggregateBonuses(allBonuses);
                  const finalTotalResult = rolledResult + totalBonus + totalSkillBonus;

                  setModifierBonuses(finalBonuses);
                  setModifiedResult(finalTotalResult);
                  setPhase("sorted");

                  handleAchievements(rolledResult, finalTotalResult, true, finalBonuses, recordRoll);
                }, 600);
                animationRef.current.timeouts.push(skillTimeout);
              } else {
                setPhase("sorted");
                handleAchievements(rolledResult, rolledResult + totalBonus, true, bonuses, recordRoll);
              }
            }, 600);
            animationRef.current.timeouts.push(modifyTimeout);
          } else {
            setPhase("sorted");
            handleAchievements(rolledResult, rolledResult, false, [], recordRoll);
          }
        }, sortingDuration);
        animationRef.current.timeouts.push(sortTimeout);
      }
    }, 140);
  }, [phase, hasActiveModifiers, modifiers, skills, recordRoll, onSkillsTriggered]);

  const isRolling = phase === "random" || phase === "sorting" || phase === "modifying";

  return {
    items,
    phase,
    result,
    modifiedResult,
    modifierBonuses,
    roll,
    isRolling,
  };
};
