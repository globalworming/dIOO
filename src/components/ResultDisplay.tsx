import { cn } from "@/lib/utils";
import { ModifierBonus } from "./ModifierPanel";

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
}

const INVENTORY_CAP = 1000;

export const ResultDisplay = ({ result, phase, modifiedResult, modifierBonuses = [], inventory }: ResultDisplayProps) => {
  const showModified = modifierBonuses.length > 0 && result !== null;
  const displayValue = showModified ? modifiedResult : result;

  // Get all colors from inventory for progress bars
  const colorEntries = inventory ? Object.entries(inventory.colors) : [];
  
  return (
    <div 
      className="text-center relative"
      aria-label={displayValue !== null ? `Result: ${displayValue}` : "Result display"}
    >
      {/* Inventory progress bars behind result - vertical, full height */}
      {inventory && (colorEntries.length > 0 || (inventory ? (inventory.rolls / INVENTORY_CAP) * 100 : 0) > 0) && (
        <div className="absolute inset-0 flex justify-center items-end gap-2 -z-10">
          {/* Rolls progress bar */}
          <div className="w-10 h-full rounded-b-full overflow-hidden flex flex-col justify-end">
            <div 
              className="w-full transition-all duration-500 bg-white/60"
              style={{ 
                height: `${inventory ? (inventory.rolls / INVENTORY_CAP) * 100 : 0}%`,
                boxShadow: 'inset 0px -6px 10px rgba(0, 0, 0, 1), inset -6px 6px 10px rgba(255, 255, 255, 0.5)',
              }}
            />
          </div>
          {/* Color progress bars */}
          {colorEntries.map(([color, amount]) => (
            <div key={color} className="w-10 h-full rounded-b-full overflow-hidden flex flex-col justify-end">
              <div 
                className="w-full transition-all duration-500"
                style={{ 
                  height: `${(amount / INVENTORY_CAP) * 100}%`,
                  backgroundColor: color,
                  boxShadow: 'inset 0 -6px 10px rgba(0, 0, 0, 1), inset -6 6px 10px rgba(255, 255, 255, 0.3)',
                }}
              />
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
          "result-display text-primary text-glow transition-all duration-500",
          phase === "random" && "opacity-30 blur-sm",
          phase === "sorting" && "opacity-60",
          phase === "modifying" && "opacity-80",
          phase === "sorted" && "opacity-100"
        )}
      >
        {displayValue !== null ? displayValue : "—"}
      </div>
    </div>
  );
};
