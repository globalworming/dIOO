import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { RollHistory } from "./RollHistory";
import { FullscreenButton } from "./FullscreenButton";

type Phase = "idle" | "random" | "sorting" | "sorted";

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

export const D100Roller = () => {
  const initialResult = rollD100();
  const [items, setItems] = useState<boolean[]>(() => generateItemsWithDots(initialResult));
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(initialResult);
  const [history, setHistory] = useState<number[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const roll = useCallback(() => {
    if (phase !== "idle" && phase !== "sorted") return;

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
        
        // Step 5: Complete - show result
        setTimeout(() => {
          setResult(rolledResult);
          setHistory((prev) => [rolledResult, ...prev]);
          setPhase("sorted");
        }, 1200 - 10 * rolledResult);
      }
    }, 140);
  }, [phase]);

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


  const isRolling = phase === "random" || phase === "sorting";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <RollHistory
        history={history}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      <div className="w-full max-w-2xl mx-auto">
        <ResultDisplay result={result} phase={phase} />
        <DiceGrid items={items} phase={phase} onClick={roll} />
      </div>
    </div>
  );
};
