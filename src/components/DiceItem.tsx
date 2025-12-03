import { cn } from "@/lib/utils";

interface DiceItemProps {
  hasDot: boolean;
  index: number;
  phase: "random" | "sorting" | "sorted" | "applying-effects" | "effects-complete";
  sortedIndex: number;
  isPatternMatch?: boolean;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex, isPatternMatch = false }: DiceItemProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center transition-all duration-700 ease-out",
        "bg-secondary/50 border border-2 border-border/30",
        phase === "sorting" && ""
      )}
      style={{
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" || phase === "applying-effects" || phase === "effects-complete" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-primary dot-glow border border-2 border-black  transition-all duration-100 ease-in",
            phase === "sorted" && "animate-pulse-dot",
            phase === "applying-effects" && isPatternMatch && "w-6 h-6 animate-pulse-dot"
          )}
          style={{
            animationDelay: `${sortedIndex * 20}ms`,
          }}
        />
      )}
    </div>
  );
};
