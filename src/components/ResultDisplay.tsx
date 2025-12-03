import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: number | null;
  phase: "idle" | "random" | "sorting" | "sorted" | "applying-effects" | "effects-complete";
}

export const ResultDisplay = ({ result, phase }: ResultDisplayProps) => {
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "result-display text-primary text-glow transition-all duration-500",
          phase === "random" && "opacity-30 blur-sm",
          phase === "sorting" && "opacity-60",
          phase === "sorted" && "opacity-100",
          phase === "applying-effects" && "opacity-60 blur-sm",
          phase === "effects-complete" && "opacity-100 animate-fade-in-up"
        )}
      >
        {result !== null ? result : "—"}
      </div>
    </div>
  );
};
