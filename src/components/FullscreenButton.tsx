import { cn } from "@/lib/utils";
import { Maximize, Minimize } from "lucide-react";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenButton = ({ isFullscreen, onToggle }: FullscreenButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-3 rounded-lg glass",
        "hover:bg-secondary/80 transition-colors"
      )}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5" />
      ) : (
        <Maximize className="w-5 h-5" />
      )}
    </button>
  );
};
