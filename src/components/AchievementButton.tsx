import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementButtonProps {
  onClick: () => void;
  unlockedCount: number;
  totalCount: number;
}

export const AchievementButton = ({ onClick, unlockedCount, totalCount }: AchievementButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg glass",
        "hover:bg-secondary/80 transition-colors flex items-center gap-2"
      )}
      title="View Achievements"
    >
      <Trophy className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium mono">
        {unlockedCount}/{totalCount}
      </span>
    </button>
  );
};
