import { cn } from "@/lib/utils";
import { ModifierBonus } from "./ModifierPanel";
import { useState } from "react";
import { Hint } from "./Hint";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted" | "modifying" | "skilling";
  modifiedResult?: number | null;
  modifierBonuses?: ModifierBonus[];
  /** Inventory for progress bars */
  inventory?: {
    colors: Record<string, number>;
    rolls: number;
  };
  onUnlockInventory?: () => void;
  showInventoryHint?: boolean;
}

const INVENTORY_CAP = 1000;

export const ResultDisplay = ({ result, phase, modifiedResult, modifierBonuses = [], inventory, onUnlockInventory, showInventoryHint }: ResultDisplayProps) => {
  const [showInventory, setShowInventory] = useState(false);
  const showModified = modifierBonuses.length > 0 && result !== null;
  const displayValue = showModified ? modifiedResult : result;

  // Get all colors from inventory for progress bars
  const colorEntries = inventory ? Object.entries(inventory.colors) : [];
  
  const hasInventory = colorEntries.length > 0 || (inventory?.rolls ?? 0) > 0;

  const handleClick = () => {
    setShowInventory(!showInventory);
    if (onUnlockInventory) {
      onUnlockInventory();
    }
  };

  return (
    <div 
      className={cn("text-center relative", hasInventory && "z-20 cursor-pointer")}
      aria-label={displayValue !== null ? `Result: ${displayValue}` : "Result display"}
      onClick={handleClick}
    >
      {showInventoryHint && hasInventory && (
        <Hint position="center">click to show inventory</Hint>
      )}
      {/* Inventory progress bars behind result - vertical, full height */}
      {hasInventory && (
        <div className={cn("absolute inset-0 flex justify-center items-end gap-2", showInventory ? "z-20" : "-z-10")}>
          {/* Rolls progress bar */}
          <div className="w-10 h-full rounded-b-full overflow-hidden flex flex-col justify-end relative">
            <div 
              className="w-full transition-all duration-500 bg-muted-foreground"
              style={{ 
                height: `${inventory ? (inventory.rolls / INVENTORY_CAP) * 100 : 0}%`,
                boxShadow: 'inset 0px -6px 10px rgba(0, 0, 0, 1), inset -6px 6px 10px rgba(255, 255, 255, 0.5)',
              }}
            />
            {showInventory && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-background/60 text-white px-3 font-mono pointer-events-none">
                {inventory.rolls}
              </div>
            )}
          </div>
          {/* Color progress bars */}
          {colorEntries.map(([color, amount]) => (
            <div key={color} className="w-10 h-full rounded-b-full overflow-hidden flex flex-col justify-end relative">
              <div 
                className="w-full transition-all duration-500"
                style={{ 
                  height: `${(amount / INVENTORY_CAP) * 100}%`,
                  backgroundColor: color,
                  boxShadow: 'inset 0 -6px 10px rgba(0, 0, 0, 1), inset -6px 6px 10px rgba(255, 255, 255, 0.5)',
                }}
              />
              {showInventory && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-background/60 text-white px-3 font-mono pointer-events-none">
                  {amount}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground h-5">
        {showModified ? (
          <div className="flex items-center gap-1 animate-fade-in-up">
            <span className="text-white">{result}</span>
            {modifierBonuses.map((bonus, idx) => (
              <span key={`${bonus.color}-${idx}`} style={{ color: bonus.color }}>+{bonus.bonus}</span>
            ))}
          </div>
        ) : (
          <span className="invisible">—</span>
        )}
      </div>
      <div
        className={cn(
          "result-display text-primary text-glow duration-500",
          phase === "random" && "opacity-30 blur-sm text-muted-foreground duration-1000 [scale:0.8]",
          phase === "sorting" && "opacity-30 blur-sm text-muted-foreground [scale:0.8]",
          phase === "modifying" && "opacity-80 [scale:0.9]",
          phase === "sorted" && "opacity-100 animate-fade-in-up duration-100"
        )}
      >
        {displayValue !== null ? displayValue : "..."}
      </div>
    </div>
  );
};
