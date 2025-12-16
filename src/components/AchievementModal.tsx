import { X, Check, Lock, Sparkles } from "lucide-react";
import type { AchievementDef, GameStats } from "@/data/achievements";

interface AchievementModalProps {
  achievement: AchievementDef | null;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlock?: (id: string) => void;
  stats?: GameStats;
}

export const AchievementModal = ({ achievement, isUnlocked, onClose, onUnlock, stats }: AchievementModalProps) => {
  if (!achievement) return null;

  const canUnlockManually = !isUnlocked && achievement.manualUnlockResourceSpent;
  
  // Get required resources and check if player has enough
  const requiredResources = achievement.manualUnlockResourceSpent?.() || {};
  const hasEnoughResources = stats ? Object.entries(requiredResources).every(([resource, amount]) => {
    if (resource === 'rolls') {
      return stats.inventory.rolls >= amount;
    } else {
      return (stats.inventory.colors[resource] || 0) >= amount;
    }
  }) : false;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-card border border-border rounded-xl p-6 max-w-sm w-full pointer-events-auto shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isUnlocked 
                ? "bg-primary text-primary-foreground" 
                : canUnlockManually
                  ? "bg-amber-500/20"
                  : "bg-muted"
            }`}>
              {isUnlocked ? (
                <Check className="w-8 h-8" />
              ) : canUnlockManually ? (
                <Sparkles className="w-8 h-8 text-amber-500" />
              ) : (
                <Lock className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold text-center mb-2">
            {achievement.name}
          </h3>

          {/* Status badge */}
          <div className="flex justify-center mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isUnlocked 
                ? "bg-primary/20 text-primary" 
                : canUnlockManually
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-muted text-muted-foreground"
            }`}>
              {isUnlocked ? "Unlocked" : canUnlockManually ? "Can Unlock" : "Locked"
            // fixme not needed, remove
              }
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-center leading-relaxed">
            {achievement.description}
          </p>

          {/* Resource requirements */}
          {canUnlockManually && stats && Object.keys(requiredResources).length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-sm font-medium text-amber-500 mb-2">with:</div>
              <div className="space-y-1">
                {Object.entries(requiredResources).map(([resource, amount]) => {
                  const current = resource === 'rolls' 
                    ? stats.inventory.rolls 
                    : (stats.inventory.colors[resource] || 0);
                  const hasEnough = current >= amount;
                  const missing = Math.max(0, amount - current);
                  
                  return (
                    <div key={resource} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {resource === 'rolls' ? (
                          <div className="w-3 h-3 rounded bg-gray-500" />
                        ) : (
                          <div 
                            className="w-3 h-3 rounded-full border border-white/20" 
                            style={{ backgroundColor: resource }} 
                          />
                        )}
                        <span className={hasEnough ? "text-foreground" : "text-destructive"}>
                          {resource === 'rolls' ? 'Rolls' : resource}: {amount}
                        </span>
                      </div>
                      {!hasEnough && (
                        <span className="text-destructive">
                          (need {missing} more)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unlock button */}
          {canUnlockManually && onUnlock && (
            <button
              onClick={() => {
                if (hasEnoughResources) {
                  onUnlock(achievement.id);
                  onClose();
                }
              }}
              disabled={!hasEnoughResources}
              className={`mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                hasEnoughResources 
                  ? "bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:bg-amber-500/30"
                  : "bg-muted/20 border border-muted/30 text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {hasEnoughResources ? "Unlock" : "Insufficient Resources"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
