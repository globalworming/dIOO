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
  /** Whether this cell is a keystone */
  isKeystone?: boolean;
  /** Callback for clicking in edit mode */
  onClick?: () => void;
}

export const DiceItem = ({ hasDot, index, phase, sortedIndex, highlighted, modifierColor, consumed, isKeystone, onClick }: DiceItemProps) => {
  return (
    <div
      className={cn(
        "w-full aspect-square rounded-sm flex items-center justify-center",
        "bg-secondary/50  ",
        " overflow-hidden",
        phase === "sorting" ? "duration-700" : "",
        highlighted && hasDot && "",
        highlighted && !hasDot && "bg-background/100",
        consumed && "rounded-full [scale:0.3]",
        onClick && "cursor-pointer hover:bg-secondary/80"
      )}
      style={{
        borderColor: modifierColor,
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" || phase === "modifying" || phase === "skilling" ? sortedIndex : index,
        background: isKeystone ? "linear-gradient(10deg, transparent 20%, rgba(128, 128, 128, 0.4) 100%)" : undefined,
      } as React.CSSProperties}
      onClick={onClick}
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
