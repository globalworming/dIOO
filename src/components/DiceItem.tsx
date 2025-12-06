import { cn } from "@/lib/utils";

interface DiceItemProps {
  hasDot: boolean;
  index: number;
  phase: "random" | "sorting" | "sorted" | "modifying";
  sortedIndex: number;
  intensity?: number;
  highlighted?: boolean;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex, highlighted }: DiceItemProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center transition-all duration-500",
        "bg-secondary/50 border border-border/30",
        phase === "sorting" && "transition-all duration-700 ease-out",
        highlighted && "ring-1 ring-primary/40 bg-secondary/70"
      )}
      style={{
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" || phase === "modifying" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary dot-glow",
            (phase === "sorted" || phase === "modifying") && "animate-pulse-dot",
            highlighted && hasDot && "scale-110"
          )}
          style={{
            animationDelay: `${sortedIndex * 20}ms`,
          }}
        />
      )}
    </div>
  );
};
