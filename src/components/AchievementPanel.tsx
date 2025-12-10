import { Trophy, X, RotateCcw, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement, GameStats } from "@/hooks/useAchievements";

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  stats: GameStats;
  onReset: () => void;
}

export const AchievementPanel = ({
  isOpen,
  onClose,
  achievements,
  stats,
  onReset,
}: AchievementPanelProps) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass rounded-xl p-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-4 h-4 text-primary" />
          <h2 className="text-l font-semibold">Achievements</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mono text-primary">
            {unlockedCount}/{achievements.length}
            </div>
            <div className="text-xs">Unlocked</div>
          </div>
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.highestRoll}</div>
            <div className="text-xs">Highest Roll</div>
          </div>
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.totalSum.toLocaleString()}</div>
            <div className="text-xs">Total Sum</div>
          </div>
          <div className="glass rounded-lg p-3 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.totalRolls}</div>
            <div className="text-xs">Total Rolls</div>
          </div>
        </div>

        {/* Color Stats */}
        {stats.colorTotals && Object.keys(stats.colorTotals).length > 0 && (
          <div className="mb-2">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(stats.colorTotals).map(([color, total]) => (
                <div key={color} className="glass rounded-lg p-2 flex flex-col items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                    style={{ backgroundColor: color }} 
                  />
                  <div className="text-sm font-bold mono">{total}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievement List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                achievement.unlocked
                  ? "bg-primary/10 border-primary/30"
                  : "bg-secondary/30 border-border/30 opacity-60"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                {achievement.unlocked ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className={cn("font-medium text-sm", !achievement.unlocked && "text-muted-foreground")}>
                  {achievement.name}
                </div>
                <div className="text-xs">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset all progress?")) {
              onReset();
            }
          }}
          className="mt-6 w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Progress
        </button>
      </div>
    </div>
  );
};
