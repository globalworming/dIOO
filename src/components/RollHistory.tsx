import { cn } from "@/lib/utils";
import { History, X } from "lucide-react";

interface RollHistoryProps {
  history: number[];
  isOpen: boolean;
  onToggle: () => void;
}

export const RollHistory = ({ history, isOpen, onToggle }: RollHistoryProps) => {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-4 right-4 z-50 p-3 rounded-lg glass",
          "hover:bg-secondary/80 transition-colors",
          "flex items-center gap-2"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <History className="w-5 h-5" />}
        {!isOpen && history.length > 0 && (
          <span className="text-sm font-mono text-muted-foreground">
            ({history.length})
          </span>
        )}
      </button>

      {/* History panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 glass z-40",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 pt-20">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Roll History
          </h2>

          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No rolls yet</p>
          ) : (
            <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-y-auto">
              {history.map((roll, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    "bg-secondary/50 border border-border/30",
                    index === 0 && "animate-fade-in-up border-primary/30"
                  )}
                >
                  <span className="text-muted-foreground text-sm">
                    #{history.length - index}
                  </span>
                  <span className={cn(
                    "font-mono text-xl font-bold",
                    index === 0 && "text-primary text-glow"
                  )}>
                    {roll}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};
