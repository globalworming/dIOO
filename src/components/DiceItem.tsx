import { cn } from "@/lib/utils";

interface DiceItemProps {
  hasDot: boolean;
  index: number;
  phase: "random" | "sorting" | "sorted" | "modifying" | "skilling";
  sortedIndex: number;
  intensity?: number;
  highlighted?: boolean;
  modifierColor?: string;
  /** Whether this cell was consumed by a skill pattern match */
  consumed?: boolean;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex, highlighted, modifierColor, consumed }: DiceItemProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center",
        "bg-secondary/50  ",
        " overflow-hidden",
        phase === "sorting" ? "duration-700" : "",
        highlighted && hasDot && "",
        highlighted && !hasDot && "bg-background/100",
        consumed && "rounded-full [scale:0.3]"
      )}
      style={{
        borderColor: modifierColor,
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" || phase === "modifying" || phase === "skilling" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500",
            highlighted && hasDot && "[scale:2]",
            !modifierColor && "bg-primary",
            consumed && "[scale:1]" 
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
