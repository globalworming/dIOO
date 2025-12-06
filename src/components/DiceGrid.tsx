import { DiceItem } from "./DiceItem";

interface DiceGridProps {
  items: boolean[];
  phase: "idle" | "random" | "sorting" | "sorted";
  onClick?: () => void;
}

export const DiceGrid = ({ items, phase, onClick }: DiceGridProps) => {
  // Create sorted indices - falses first, then trues
  const sortedIndices = items
    .map((hasDot, originalIndex) => ({ hasDot, originalIndex }))
    .sort((a, b) => {
      if (a.hasDot === b.hasDot) return a.originalIndex - b.originalIndex;
      return a.hasDot ? 1 : -1;
    })
    .map((item, sortedPosition) => ({
      originalIndex: item.originalIndex,
      sortedPosition,
    }));

  const getSortedIndex = (originalIndex: number) => {
    return sortedIndices.find((s) => s.originalIndex === originalIndex)?.sortedPosition ?? originalIndex;
  };

  const shuffleX = (Math.random() - 0.5) * 20;
  const shuffleY = (Math.random() - 0.5) * 20;
  const shuffleR = (Math.random() - 0.5) * 8;

  const crosshairSvg = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="50" y1="0" x2="50" y2="100" stroke="hsla(38, 95%, 55%, 1.00)" stroke-width="0.2"/>
      <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(38 95% 55%)" stroke-width="0.2"/>
    </svg>
  `)}`;

  return (
    <div className="p-2">
      <div 
        className="relative w-full max-w-lg mx-auto cursor-pointer"
        onClick={onClick && (phase === "idle" || phase === "sorted") ? onClick : undefined}
      >
        <div 
          className={`absolute inset-0 ${phase === "random" ? "animate-shuffle" : ""}`}
          style={{
            backgroundImage: `url("${crosshairSvg}")`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            "--shuffle-x": `${-shuffleX}px`,
            "--shuffle-y": `${-shuffleY}px`,
            "--shuffle-r": `${shuffleR}deg`,
          } as React.CSSProperties}
        />
        <div className={`grid grid-cols-10 gap-1 sm:gap-1.5 relative ${phase === "random" ? "animate-shuffle" : ""}`}
               style={{
            "--shuffle-x": `${shuffleX}px`,
            "--shuffle-y": `${shuffleY}px`,
            "--shuffle-r": `0deg`,
          } as React.CSSProperties}
        >
          {items.map((hasDot, index) => (
            <DiceItem
              key={index}
              hasDot={hasDot}
              index={index}
              phase={phase === "idle" ? "sorted" : phase}
              sortedIndex={getSortedIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
