import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { RollHistory } from "./RollHistory";
import { FullscreenButton } from "./FullscreenButton";
import { AchievementButton } from "./AchievementButton";
import { AchievementPanel } from "./AchievementPanel";
import { ModifierPanel, DEFAULT_MODIFIERS, Modifier } from "./ModifierPanel";
import { useAchievements } from "@/hooks/useAchievements";
import { toast } from "sonner";

type Phase = "idle" | "random" | "sorting" | "sorted" | "modifying";

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

// Calculate bonus from modifiers
const calculateModifiedResult = (
  naturalRoll: number,
  items: boolean[],
  modifiers: Modifier[]
): number => {
  const activeModifiers = modifiers.filter(m => m.active);
  if (activeModifiers.length === 0) return naturalRoll;

  let bonusPoints = 0;
  
  // Count dots in each modifier zone
  activeModifiers.forEach(mod => {
    const dotsInZone = mod.zones.filter(zoneIndex => items[zoneIndex]).length;
    // Bonus = dots in zone * (multiplier - 1) to add extra points
    bonusPoints += Math.floor(dotsInZone * (mod.multiplier - 1));
  });

  return naturalRoll + bonusPoints;
};

export const D100Roller = () => {
  const initialResult = 0;
  const [items, setItems] = useState<boolean[]>(() => generateItemsWithDots(initialResult));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(initialResult);
  const [modifiedResult, setModifiedResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [modifiers, setModifiers] = useState<Modifier[]>(DEFAULT_MODIFIERS);
  
  const { achievements, stats, recordRoll, resetGame } = useAchievements();

  const hasActiveModifiers = modifiers.some(m => m.active);

  const toggleModifier = useCallback((id: string) => {
    setModifiers(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
  }, []);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted") return;

    // Step 1: Roll D100 to determine the result
    const rolledResult = rollD100();
    setResult(null);
    setModifiedResult(null);
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
          setHistory((prev) => [rolledResult, ...prev]);
          
          // Step 6: If modifiers active, enter modifying phase
          if (hasActiveModifiers) {
            setPhase("modifying");
            
            // Calculate and show modified result after brief delay
            setTimeout(() => {
              const modified = calculateModifiedResult(rolledResult, finalItems, modifiers);
              setModifiedResult(modified);
              setPhase("sorted");
              
              // Record with modifiers
              const newlyUnlocked = recordRoll(rolledResult, modified, true);
              newlyUnlocked.forEach((name) => {
                toast.success(`Achievement Unlocked: ${name}!`, { duration: 3000 });
              });
            }, 600);
          } else {
            setPhase("sorted");
            
            // Record without modifiers
            const newlyUnlocked = recordRoll(rolledResult, rolledResult, false);
            newlyUnlocked.forEach((name) => {
              toast.success(`Achievement Unlocked: ${name}!`, { duration: 3000 });
            });
          }
        }, 1200 - 10 * rolledResult);
      }
    }, 140);
  }, [phase, hasActiveModifiers, modifiers, recordRoll]);

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <RollHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />
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
        <div className="flex justify-center mt-4">
          <ModifierPanel 
            modifiers={modifiers} 
            onToggle={toggleModifier}
            disabled={isRolling}
          />
        </div>
      </div>
    </div>
  );
};
