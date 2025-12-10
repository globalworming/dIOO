import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { FullscreenButton } from "./FullscreenButton";
import { AchievementButton } from "./AchievementButton";
import { AchievementPanel } from "./AchievementPanel";
import { ModifierPanel, DEFAULT_MODIFIERS, Modifier, ModifierBonus, MODIFIER_COLORS, getModifierColor } from "./ModifierPanel";
import { SkillsPanel, DEFAULT_SKILLS, Skill, SKILL_PATTERNS } from "./SkillsPanel";
import { useAchievements } from "@/hooks/useAchievements";
import { calculateSkillBonuses, handleAchievements, aggregateBonuses } from "@/utils/gameLogic";
import { toast } from "sonner";

type Phase = "idle" | "random" | "sorting" | "sorted" | "modifying" | "skilling";

// Generate items with exactly `count` dots randomly distributed
const generateItemsWithDots = (count: number): boolean[] => {
  const items = Array.from({ length: 100 }, (_, i) => i < count);
  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

// Generate items with probability that converges from 50% to the target result
const generateConvergingItems = (targetResult: number, progress: number): boolean[] => {
  // progress: 0 (start) to 1 (end)
  // Start at 50% probability, converge to targetResult/100
  const targetProbability = targetResult / 100;
  const currentProbability = 0.5 + (targetProbability - 0.5) * progress;
  
  return Array.from({ length: 100 }, () => Math.random() < currentProbability);
};

// Roll D100 (1-100)
const rollD100 = (): number => {
  return Math.floor(Math.random() * 100) + 1;
};

// Calculate bonus breakdown by modifier
const calculateModifierBonuses = (
  items: boolean[],
  modifiers: Modifier[]
): ModifierBonus[] => {
  const activeModifiers = modifiers.filter(m => m.active);
  const countedIndices = new Set<number>();
  
  return activeModifiers.map(mod => {
    // Count dots in this modifier's zone that haven't been counted yet
    let bonus = 0;
    for (const zoneIndex of mod.zones) {
      if (items[zoneIndex] && !countedIndices.has(zoneIndex)) {
        bonus++;
        countedIndices.add(zoneIndex);
      }
    }
    return {
      color: MODIFIER_COLORS[mod.id],
      bonus,
    };
  }).filter(b => b.bonus > 0);
};

export const D100Roller = () => {
  const initialResult = 0;
  const [items, setItems] = useState<boolean[]>(() => generateItemsWithDots(initialResult));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(initialResult);
  const [modifiedResult, setModifiedResult] = useState<number | null>(null);
  const [modifierBonuses, setModifierBonuses] = useState<ModifierBonus[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [modifiers, setModifiers] = useState<Modifier[]>(DEFAULT_MODIFIERS);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  
  const { achievements, stats, recordRoll, resetGame } = useAchievements();

  const hasActiveModifiers = modifiers.some(m => m.active);

  const toggleModifier = useCallback((id: string) => {
    setModifiers(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
  }, []);

  const toggleSkill = useCallback((id: string) => {
    setSkills(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  }, []);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted") return;

    // Step 1: Roll D100 to determine the result
    const rolledResult = rollD100();
    setResult(null);
    setModifiedResult(null);
    setModifierBonuses([]);
    setPhase("random");
    
    // Step 2: Converging animation from 50% to rolled result
    let randomCount = 0;
    const randomInterval = setInterval(() => {
      const iterations = 6;
      const progress = randomCount / iterations;
      setItems(generateConvergingItems(rolledResult, progress));
      randomCount++;
      if (randomCount >= iterations) {
        clearInterval(randomInterval);
        
        // Step 3: Generate items with exactly `rolledResult` dots, randomly placed
        const finalItems = generateItemsWithDots(rolledResult);
        setItems(finalItems);
        
        // Step 4: Start sorting animation
        setPhase("sorting");
        
        // Step 5: Complete sorting - show natural result
        setTimeout(() => {
          setResult(rolledResult);
          
          // Step 6: If modifiers active, enter modifying phase
          if (hasActiveModifiers) {
            setPhase("modifying");
            
            // Calculate and show modified result after brief delay
            setTimeout(() => {
              const bonuses = calculateModifierBonuses(finalItems, modifiers);
              let totalBonus = bonuses.reduce((sum, b) => sum + b.bonus, 0);
              
              // Apply modifier bonuses first
              setModifierBonuses(bonuses);
              setModifiedResult(rolledResult + totalBonus);
              
              // Check for skills
              const activeSkills = skills.filter(s => s.active);
              if (activeSkills.length > 0) {
                setPhase("skilling");
                
                // Delay for skill processing visualization
                setTimeout(() => {
                  const activeMods = modifiers.filter(m => m.active);
                  
                  const { skillBonuses, totalSkillBonus, triggeredSkills } = calculateSkillBonuses(
                    finalItems, 
                    skills, 
                    activeMods
                  );
                  
                  // Update skills triggered state
                  if (triggeredSkills.size > 0) {
                    setSkills(prev => prev.map(s => ({
                      ...s,
                      triggered: triggeredSkills.has(s.id)
                    })));
                    setTimeout(() => {
                      setSkills(prev => prev.map(s => ({ ...s, triggered: false })));
                    }, 1000);
                  }
                  
                  const allBonuses = [...bonuses, ...skillBonuses];
                  const finalBonuses = aggregateBonuses(allBonuses);
                  const finalTotalResult = rolledResult + totalBonus + totalSkillBonus;
                  
                  setModifierBonuses(finalBonuses);
                  setModifiedResult(finalTotalResult);
                  setPhase("sorted");
                  
                  // Record roll
                  handleAchievements(rolledResult, finalTotalResult, true, finalBonuses, recordRoll);
                }, 600); // Wait in skilling phase
              } else {
                setPhase("sorted");
                // Record with modifiers only
                handleAchievements(rolledResult, rolledResult + totalBonus, true, bonuses, recordRoll);
              }
            }, 600);
          } else {
            setPhase("sorted");
            
            // Record without modifiers
            handleAchievements(rolledResult, rolledResult, false, [], recordRoll);
          }
        }, 1200 - 10 * rolledResult);
      }
    }, 140);
  }, [phase, hasActiveModifiers, modifiers, recordRoll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && !e.repeat) {
        roll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roll]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const isRolling = phase === "random" || phase === "sorting" || phase === "modifying";

  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      aria-label="D100 Dice Roller Game"
    >
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <AchievementButton
        onClick={() => setAchievementPanelOpen(true)}
        unlockedCount={achievements.filter((a) => a.unlocked).length}
        totalCount={achievements.length}
      />
      <AchievementPanel
        isOpen={achievementPanelOpen}
        onClose={() => setAchievementPanelOpen(false)}
        achievements={achievements}
        stats={stats}
        onReset={resetGame}
      />

      <div className="w-full max-w-2xl mx-auto">
        <ResultDisplay 
          result={result} 
          phase={phase} 
          modifiedResult={modifiedResult}
          modifierBonuses={modifierBonuses}
        />
        <DiceGrid 
          items={items} 
          phase={phase} 
          onClick={roll} 
          result={result}
          modifiers={modifiers}
          modifiedResult={modifiedResult}
        />
        
        {/* Modifier panel below grid */}
        <div className="flex flex-col justify-center mt-4 gap-4">
          <div className="flex justify-center">
            <ModifierPanel 
              modifiers={modifiers} 
              onToggle={toggleModifier}
              disabled={isRolling}
            />
          </div>
          <div hidden={true}>
            <div className="flex justify-center">
              <SkillsPanel 
                skills={skills} 
                onToggle={toggleSkill}
                disabled={isRolling}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
