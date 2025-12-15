import { useState } from "react";
import { Trophy, X, RotateCcw, Lock, Check, Sparkles } from "lucide-react";
import type { GameStats } from "@/hooks/useAchievements";
import type { AchievementDef } from "@/data/achievements";
import { AchievementModal } from "./AchievementModal";
import { Hint } from "./Hint";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { cn } from "@/lib/utils";

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
  /** Debug: trigger a roll with a specific natural result */
  onDebugRoll?: (naturalRoll: number) => void;
  /** Debug: set total rolls stat directly */
  onSetTotalRolls?: (value: number) => void;
  /** Manually unlock an achievement */
  onUnlockAchievement?: (id: string) => void;
}

export const AchievementPanel = ({
  isOpen,
  onClose,
  stats,
  onReset,
  unlockedDefs,
  availableDefs,
  totalCount,
  onDebugRoll,
  onSetTotalRolls,
  onUnlockAchievement,
}: AchievementPanelProps) => {
  const [debugClicks, setDebugClicks] = useState(0);
  const showDebug = debugClicks >= 5;
  const [selectedAchievement, setSelectedAchievement] = useState<{ def: AchievementDef; unlocked: boolean } | null>(null);
  const { hasUpdate, latestVersion } = useVersionCheck();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-background/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} 
      />
      
      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-black/80 backdrop-blur-lg 
          transform transition-transform duration-300 ease-out select-none
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setDebugClicks(c => c + 1)}
            >
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Achievements</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold mono text-primary">
                  {unlockedDefs.length}/{totalCount}
                </div>
                <div className="text-xs">Unlocked</div>
              </div>
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold mono text-primary">{stats.highestRoll}</div>
                <div className="text-xs">Highest Roll</div>
              </div>
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold mono text-primary">{stats.totalSum.toLocaleString()}</div>
                <div className="text-xs">Total Sum</div>
              </div>
              <div className="glass rounded-lg px-4 py-2 text-center">
                {showDebug ? (
                  <input
                    type="number"
                    value={stats.totalRolls}
                    onChange={(e) => onSetTotalRolls?.(parseInt(e.target.value) || 0)}
                    className="w-full text-2xl font-bold mono text-primary bg-transparent text-center outline-none border-b border-yellow-500/50"
                    min={1}
                    max={1000000}
                  />
                ) : (
                  <div className="text-2xl font-bold mono text-primary">{stats.totalRolls}</div>
                )}
                <div className="text-xs">Total Rolls</div>
              </div>
            </div>

            {/* Color Stats */}
            {stats.colorTotals && Object.keys(stats.colorTotals).length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(stats.colorTotals).map(([color, total]) => (
                  <div key={color} className="glass rounded-lg px-4 py-2 flex flex-col items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: color }} 
                    />
                    <div className="text-sm font-bold mono">{total}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Available Next */}
            {availableDefs.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Available to unlock</div>
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {availableDefs.map((def) => (
                    <button
                      key={def.id}
                      onClick={() => setSelectedAchievement({ def, unlocked: false })}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg border hover:bg-secondary/70 transition-colors text-left`}
                    >
                      <div className={cn(
                        `w-8 h-8 rounded-full flex items-center justify-center shrink-0`,
                        def.unlock ? 'ring-1 ring-amber-500' : '')}>
                        {def.unlock ? (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium truncate">{def.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{def.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Unlocked Achievements */}
            {unlockedDefs.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-2">Unlocked</div>
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {unlockedDefs.map((def) => (
                    <button
                      key={def.id}
                      onClick={() => setSelectedAchievement({ def, unlocked: true })}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium truncate">{def.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{def.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Debug Roll Buttons */}
            {showDebug && onDebugRoll && (
              <div className="p-2 border border-yellow-500/50 rounded-lg">
                <div className="text-xs text-yellow-500 mb-2">Debug: Trigger specific rolls</div>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => onDebugRoll(n)}
                      className="w-full aspect-square text-xs rounded bg-yellow-500/20 hover:bg-yellow-500/40 transition-colors"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Button - Fixed at bottom */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset all progress?")) {
                onReset();
              }
            }}
            className="mt-4 w-full relative flex items-center justify-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 transition-colors shrink-0"
          >
            {hasUpdate && (
                <Hint>new version {latestVersion}, click to update</Hint>
            )}

            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement?.def ?? null}
        isUnlocked={selectedAchievement?.unlocked ?? false}
        onClose={() => setSelectedAchievement(null)}
        onUnlock={onUnlockAchievement}
      />
    </>
  );
};
