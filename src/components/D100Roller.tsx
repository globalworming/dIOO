import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { RollHistory } from "./RollHistory";
import { AchievementsPanel } from "./AchievementsPanel";
import { FullscreenButton } from "./FullscreenButton";
import { useGameState } from "@/hooks/useGameState";
import { gridPatterns } from "@/data/gridPatterns";
import { toast } from "sonner";

type Phase = "idle" | "random" | "sorting" | "sorted" | "applying-effects" | "effects-complete";

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

// Apply grid pattern effects to modify the roll result and add dots to grid
const applyGridEffects = (baseResult: number, items: boolean[], thirdColumnEnabled: boolean): { modifiedResult: number; modifiedItems: boolean[] } => {
  let modifiedResult = baseResult;
  const modifiedItems = [...items]; // Create a copy to modify
  
  if (!thirdColumnEnabled) {
    console.log(`Grid Effects: No effects applied (thirdColumn disabled)`);
    return { modifiedResult, modifiedItems };
  }
  
  // Create sorted indices to get the visual order as seen by user
  const sortedIndices = items
    .map((hasDot, originalIndex) => ({ hasDot, originalIndex }))
    .sort((a, b) => {
      if (a.hasDot === b.hasDot) return a.originalIndex - b.originalIndex;
      return a.hasDot ? 1 : -1;
    })
    .map((item, sortedPosition) => ({
      originalIndex: item.originalIndex,
      sortedPosition,
    }));

  // Apply thirdColumn pattern: add 1 for each dot in column 7 (index 7)
  // Check based on sorted position (visual order) not original index
  const thirdColumnPattern = gridPatterns.thirdColumn;
  const matchingDots = items.filter((hasDot, originalIndex) => {
    if (!hasDot) return false;
    const sortedPosition = sortedIndices.find(s => s.originalIndex === originalIndex)?.sortedPosition ?? originalIndex;
    return thirdColumnPattern.mask[sortedPosition] === 1;
  }).length;
  modifiedResult += matchingDots;
  
  // Add additional dots to random empty grid items
  const emptyIndices = items.map((hasDot, index) => hasDot ? -1 : index).filter(index => index !== -1);
  const dotsToAdd = matchingDots;
  
  if (dotsToAdd > 0 && emptyIndices.length > 0) {
    // Fisher-Yates shuffle the empty indices
    for (let i = emptyIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emptyIndices[i], emptyIndices[j]] = [emptyIndices[j], emptyIndices[i]];
    }
    
    // Add dots to the first 'dotsToAdd' empty positions
    for (let i = 0; i < Math.min(dotsToAdd, emptyIndices.length); i++) {
      modifiedItems[emptyIndices[i]] = true;
    }
  }
  
  console.log(`Grid Effects: Base result ${baseResult} -> Modified result ${modifiedResult} (+${matchingDots} from pattern)`);
  
  return { modifiedResult, modifiedItems };
};

export const D100Roller = () => {
  const { history, stats, achievements, newlyUnlocked, addRoll, clearNewlyUnlocked, resetProgress } = useGameState();
  
  const initialResult = history.length > 0 ? history[0] : rollD100();
  const [items, setItems] = useState<boolean[]>(() => generateItemsWithDots(initialResult));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(initialResult);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thirdColumnEnabled, setThirdColumnEnabled] = useState(false);

  // Show toast for newly unlocked achievements
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(ach => {
        toast.success(`🏆 Achievement Unlocked!`, {
          description: `${ach.name}: ${ach.description}`,
        });
      });
      clearNewlyUnlocked();
    }
  }, [newlyUnlocked, clearNewlyUnlocked]);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted" && phase !== "effects-complete") return;

    // Step 1: Roll D100 to determine the result
    const rolledResult = rollD100();
    setResult(null); // Hide result during animation
    setPhase("random");
    
    // Step 2: Converging animation from 50% to rolled result
    let randomCount = 0;
    const randomInterval = setInterval(() => {
      const iterations = 6;
      const progress = randomCount / iterations; // 0 to 1 over 10 frames
      setItems(generateConvergingItems(rolledResult, progress));
      randomCount++;
      if (randomCount >= iterations) {
        clearInterval(randomInterval);
        
        // Step 3: Generate items with exactly `rolledResult` dots, randomly placed
        const finalItems = generateItemsWithDots(rolledResult);
        setItems(finalItems);
        
        // Step 4: Start sorting animation
        setPhase("sorting");
        
        // Step 5: Complete sorting, then apply effects
        setTimeout(() => {
          setPhase("applying-effects");
          
          // Show the original rolled result during effects
          setResult(rolledResult);
          
          // Apply grid pattern effects to calculate the result
          const { modifiedResult, modifiedItems } = applyGridEffects(rolledResult, finalItems, thirdColumnEnabled);
          
          // Brief pause to show effects, then add dots and show final result
          setTimeout(() => {
            // Update the grid items to show the new dots
            setItems(modifiedItems);
            
            // Show the modified result
            setResult(modifiedResult);
            addRoll(modifiedResult);
            setPhase("effects-complete");
            setTimeout(() => {
              setPhase("sorted");
            }, 500);
          }, 800);
        }, 1200 - 10 * rolledResult);
      }
    }, 140);
  }, [phase, thirdColumnEnabled]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <AchievementsPanel
        achievements={achievements}
        stats={stats}
        isOpen={achievementsOpen}
        onToggle={() => setAchievementsOpen(!achievementsOpen)}
        onReset={resetProgress}
      />
      <RollHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      <div className="w-full max-w-2xl mx-auto">
        <ResultDisplay result={result} phase={phase} />
        <DiceGrid items={items} phase={phase} onClick={roll} thirdColumnEnabled={thirdColumnEnabled} />
        
        {/* Third Column Toggle Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setThirdColumnEnabled(!thirdColumnEnabled)}
            className={`w-12 h-12 rounded-lg border transition-all flex items-center justify-center ${
              thirdColumnEnabled
                ? "bg-primary/20 border-primary"
                : "bg-secondary/50 border-border hover:bg-secondary/80"
            }`}
          >
            <div className="w-6 h-6">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <line x1="75" y1="4" x2="75" y2="96" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
