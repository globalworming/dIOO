import { cn } from "@/lib/utils";
import { ModifierBonus } from "./ModifierPanel";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted" | "modifying" | "skilling";
  modifiedResult?: number | null;
  modifierBonuses?: ModifierBonus[];
}

export const ResultDisplay = ({ result, phase, modifiedResult, modifierBonuses = [] }: ResultDisplayProps) => {
  const showModified = modifierBonuses.length > 0 && result !== null;
  const displayValue = showModified ? modifiedResult : result;
  
  return (
    <div 
      className="text-center  relative"
      aria-label={displayValue !== null ? `Result: ${displayValue}` : "Result display"}
    >
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
