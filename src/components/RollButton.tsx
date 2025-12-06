import { cn } from "@/lib/utils";
import { Dices } from "lucide-react";

interface RollButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const RollButton = ({ onClick, disabled }: RollButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative px-8 py-4 rounded-xl font-semibold text-lg",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center gap-3",
        "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        "active:scale-95"
      )}
    >
      <Dices className={cn(
        "w-6 h-6 transition-transform duration-300",
        "group-hover:rotate-12",
        disabled && "animate-spin"
      )} />
      <span>{disabled ? "Rolling..." : "Roll D100"}</span>
    </button>
  );
};
