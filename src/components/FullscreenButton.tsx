import { cn } from "@/lib/utils";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenButton = ({ isFullscreen, onToggle }: FullscreenButtonProps) => {
  return (
    <Button
    variant="link"
      onClick={onToggle}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="w-10 h-10" />
      ) : (
        <Maximize className="w-10 h-10" />
      )}
    </Button>
  );
};
