import { cn } from "@/lib/utils";
import { Trophy, X, Lock, Check, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface Stats {
  totalRolls: number;
  highestRoll: number;
  lowestRoll: number;
  sumOfRolls: number;
}

interface AchievementsPanelProps {
  achievements: Achievement[];
  stats: Stats;
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const AchievementsPanel = ({
  achievements,
  stats,
  isOpen,
  onToggle,
  onReset,
}: AchievementsPanelProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const avgRoll = stats.totalRolls > 0 ? Math.round(stats.sumOfRolls / stats.totalRolls) : 0;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed top-4 left-4 z-50 p-3 rounded-lg glass",
          "hover:bg-secondary/80 transition-colors",
          "flex items-center gap-2"
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
        {!isOpen && unlockedCount > 0 && (
          <span className="text-sm font-mono text-muted-foreground">
            ({unlockedCount}/{achievements.length})
          </span>
        )}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 glass z-40",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 pt-20 flex flex-col h-full">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
              <div className="text-xs text-muted-foreground">Total Rolls</div>
              <div className="font-mono text-lg font-bold">{stats.totalRolls}</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
              <div className="text-xs text-muted-foreground">Average</div>
              <div className="font-mono text-lg font-bold">{avgRoll || "-"}</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
              <div className="text-xs text-muted-foreground">Highest</div>
              <div className="font-mono text-lg font-bold text-green-500">
                {stats.highestRoll > 0 ? stats.highestRoll : "-"}
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
              <div className="text-xs text-muted-foreground">Lowest</div>
              <div className="font-mono text-lg font-bold text-red-500">
                {stats.lowestRoll < 101 ? stats.lowestRoll : "-"}
              </div>
            </div>
          </div>

          {/* Achievement list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  ach.unlocked
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/30 border-border/30 opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    ach.unlocked ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {ach.unlocked ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("font-medium text-sm", !ach.unlocked && "text-muted-foreground")}>
                    {ach.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{ach.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Reset button */}
          <Button
            variant="destructive"
            size="sm"
            className="mt-4"
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) {
                onReset();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
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
