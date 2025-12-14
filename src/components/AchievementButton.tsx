import { Trophy, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { AchievementDef } from "@/data/achievements";

interface AchievementButtonProps {
  onClick: () => void;
  onInfoClick?: () => void;
  unlockedCount: number;
  totalCount: number;
  latestUnlocked?: AchievementDef;
}

export const AchievementButton = ({ onClick, onInfoClick, unlockedCount, totalCount, latestUnlocked }: AchievementButtonProps) => {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onClick}
        className={cn(
          "p-3 rounded-lg glass",
          "hover:bg-secondary/80 transition-colors flex items-center gap-2"
        )}
        title="View Achievements"
      >
        <span className="text-sm font-medium mono">
          {unlockedCount}/{totalCount}
        </span>
        <Trophy className="w-5 h-5 text-primary" />
        {latestUnlocked && (
          <div className="flex flex-col items-start max-w-32">
            <span className="text-xs truncate w-full">
              {latestUnlocked.name}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {latestUnlocked.description}
            </span>
          </div>
        )}
      </button>
      {latestUnlocked && onInfoClick && (
        <button
          onClick={onInfoClick}
          className="p-3 rounded-lg glass hover:bg-secondary/80 transition-colors self-stretch flex items-center"
          title="View latest achievement"
        >
          <Info className="w-6 h-6 text-lg text-primary" />
        </button>
      )}
    </div>
  );
};
