import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted" | "modifying";
  modifiedResult?: number | null;
}

export const ResultDisplay = ({ result, phase, modifiedResult }: ResultDisplayProps) => {
  const showModified = modifiedResult !== null && modifiedResult !== undefined && modifiedResult !== result;
  const displayValue = showModified ? modifiedResult : result;
  
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "result-display text-primary text-glow transition-all duration-500",
          phase === "random" && "opacity-30 blur-sm",
          phase === "sorting" && "opacity-60",
          phase === "modifying" && "opacity-80",
          phase === "sorted" && "opacity-100 animate-fade-in-up"
        )}
      >
        {displayValue !== null ? displayValue : "—"}
      </div>
      <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground h-5">
        {showModified && result !== null ? (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <span className="opacity-60">{result}</span>
            <span className="text-primary">+{modifiedResult! - result}</span>
          </div>
        ) : (
          <span className="invisible">—</span>
        )}
      </div>
    </div>
  );
};
