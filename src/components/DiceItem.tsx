import { cn } from "@/lib/utils";

interface DiceItemProps {
  hasDot: boolean;
  index: number;
  phase: "random" | "sorting" | "sorted";
  sortedIndex: number;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex }: DiceItemProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center transition-all duration-500",
        "bg-secondary/50 border border-border/30",
        phase === "sorting" && "transition-all duration-700 ease-out"
      )}
      style={{
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary dot-glow",
            phase === "sorted" && "animate-pulse-dot"
          )}
          style={{
            animationDelay: `${sortedIndex * 20}ms`,
          }}
        />
      )}
    </div>
  );
};
