import { Trophy, X, RotateCcw, Lock, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameStats } from "@/hooks/useAchievements";
import type { AchievementDef } from "@/data/achievements";

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onReset: () => void;
  /** Achievements that have been unlocked (from tree walk) */
  unlockedDefs: AchievementDef[];
  /** Achievements available to unlock next */
  availableDefs: AchievementDef[];
  /** Total number of achievements */
  totalCount: number;
}

export const AchievementPanel = ({
  isOpen,
  onClose,
  stats,
  onReset,
  unlockedDefs,
  availableDefs,
  totalCount,
}: AchievementPanelProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-black/60 backdrop-blur-lg p-2">
        <button
          onClick={onClose}
          className="absolute glass right-4 rounded-lg hover:bg-black hover:outline hover:outline-primary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-4 h-4 text-primary" />
          <h2 className="text-l font-semibold">Achievements</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1 mb-2">
          <div className="glass rounded-lg px-4 py-1 text-center">
            <div className="text-2xl font-bold mono text-primary">
              {unlockedDefs.length}/{totalCount}
            </div>
            <div className="text-xs">Unlocked</div>
          </div>
          <div className="glass rounded-lg px-4 py-1 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.highestRoll}</div>
            <div className="text-xs">Highest Roll</div>
          </div>
          <div className="glass rounded-lg px-4 py-1 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.totalSum.toLocaleString()}</div>
            <div className="text-xs">Total Sum</div>
          </div>
          <div className="glass rounded-lg px-4 py-1 text-center">
            <div className="text-2xl font-bold mono text-primary">{stats.totalRolls}</div>
            <div className="text-xs">Total Rolls</div>
          </div>
        </div>

        {/* Color Stats */}
        {stats.colorTotals && Object.keys(stats.colorTotals).length > 0 && (
          <div className="mb-2">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(stats.colorTotals).map(([color, total]) => (
                <div key={color} className="glass rounded-lg px-4 py-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: color }} 
                  />
                  <div className="text-sm font-bold mono">{total}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Next */}
        {availableDefs.length > 0 && (
          <div className="mb-2">
            <div className="space-y-1">
              {availableDefs.map((def) => (
                <div
                  key={def.id}
                  className="flex items-center gap-3 px-4 py-1 rounded-lg border bg-secondary/50 border-primary/30"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg">{def.name}</div>
                    <div className="text-sm">{def.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Achievements */}
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {unlockedDefs.map((def) => (
            <div
              key={def.id}
              className="flex items-center gap-3 px-4 py-1rounded-lg border bg-primary/10 border-primary/30"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-lg">{def.name}</div>
                <div className="text-sm">{def.description}</div>
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
