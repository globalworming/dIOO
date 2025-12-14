import { X, Check, Lock, Sparkles } from "lucide-react";
import type { AchievementDef } from "@/data/achievements";

interface AchievementModalProps {
  achievement: AchievementDef | null;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlock?: (id: string) => void;
}

export const AchievementModal = ({ achievement, isUnlocked, onClose, onUnlock }: AchievementModalProps) => {
  if (!achievement) return null;

  const canUnlockManually = !isUnlocked && achievement.unlock;

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
              {isUnlocked ? "Unlocked" : canUnlockManually ? "Can Unlock" : "Locked"}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-center leading-relaxed">
            {achievement.description}
          </p>

          {/* Unlock button */}
          {canUnlockManually && onUnlock && (
            <button
              onClick={() => {
                onUnlock(achievement.id);
                onClose();
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:bg-amber-500/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Unlock
            </button>
          )}
        </div>
      </div>
    </>
  );
};
