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
        "bg-secondary/50  ring ring-4 ring-inset ring-secondary/10",
        phase === "sorting" && "transition-all duration-700 ease-out",
        highlighted && "ring-primary/10 bg-secondary/60"
      )}
      style={{
        transitionDelay: phase === "sorting" ? `${sortedIndex * 8}ms` : "0ms",
        order: phase === "sorted" || phase === "sorting" || phase === "modifying" || phase === "skilling" ? sortedIndex : index,
      } as React.CSSProperties}
    >
      {hasDot && (
        <div
          className={cn(
            "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-background transition-scale duration-500",
            highlighted && hasDot && "[scale:1.7]",
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
