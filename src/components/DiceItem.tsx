import { cn } from "@/lib/utils";

interface DiceItemProps {
  hasDot: boolean;
  index: number;
  phase: "random" | "sorting" | "sorted" | "modifying" | "skilling";
  sortedIndex: number;
  intensity?: number;
  highlighted?: boolean;
  modifierColor?: string;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex, highlighted, modifierColor }: DiceItemProps) => {
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
        order: phase === "sorted" || phase === "sorting" || phase === "modifying" || phase === "skilling" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-100",
            (phase === "sorted" || phase === "modifying" || phase === "skilling"),
            highlighted && hasDot && "scale-110",
            !modifierColor && "bg-primary"
          )}
          style={{
            animationDelay: `${sortedIndex * 20}ms`,
            backgroundColor: modifierColor,
          }}
        />
      )}
    </div>
  );
};
