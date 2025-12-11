import { DiceItem } from "./DiceItem";
import { Modifier, MODIFIER_COLORS, getModifierColor } from "./ModifierPanel";

interface DiceGridProps {
  items: boolean[];
  phase: "idle" | "random" | "sorting" | "sorted" | "modifying" | "skilling";
  onClick?: () => void;
  result?: number | null;
  modifiers?: Modifier[];
  modifiedResult?: number | null;
}

export const DiceGrid = ({ items, phase, onClick, result, modifiers = [], modifiedResult }: DiceGridProps) => {
  const displayResult = modifiedResult ?? result;
  // Calculate intensity based on result (0-1 scale)
  const intensity = displayResult ? displayResult / 100 : 0;
  const isHighRoll = displayResult && displayResult >= 80;
  const isPerfect = displayResult === 100 || (modifiedResult && modifiedResult >= 100);
  const isLowRoll = displayResult && displayResult <= 20;

  // Get active modifier zones with colors
  const activeModifiers = modifiers.filter(m => m.active);
  const highlightedZones = new Set(activeModifiers.flatMap(m => m.zones));

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

  // Dynamic border style based on result (more performant than box-shadow)
  const isResultPhase = phase === "sorted" || phase === "modifying" || phase === "skilling";
  const gridGlowStyle = isResultPhase && displayResult ? {
    borderWidth: isPerfect
      ? '3px'
      : isHighRoll
        ? `${1 + intensity * 2}px`
        : isLowRoll
          ? '1px'
          : '0px',
    borderColor: isPerfect
      ? 'hsl(var(--primary) / 0.9)'
      : isHighRoll
        ? `hsl(var(--primary) / ${0.5 + 0.3 * intensity})`
        : isLowRoll
          ? 'hsl(var(--muted) / 0.4)'
          : 'transparent',
  } as React.CSSProperties : {};


  const cssScale = (() => {
    switch (phase) {
      case "sorted":
      case "modifying":
      case "skilling":
        if (isPerfect) return "[scale:1.0]";
        if (isHighRoll) return "[scale:0.95]";
        return "[scale:0.90]";
      case "idle":
        return "[scale:0.85]";
      default:
        return "[scale:0.80]";
    }
  })();

  return (
    <div>
      <div
        aria-label={displayResult != null ? `Dice grid with result ${displayResult}` : "Dice grid"}
        className={`relative w-full  mx-auto cursor-pointer rounded-lg ${isPerfect ? "animate-perfect-glow" : ""
          } ${isHighRoll && !isPerfect ? "animate-high-roll-pulse" : ""}
        transition-scale ease-in-out duration-100 ${cssScale}
        `}
        style={gridGlowStyle}
        onClick={onClick && (phase === "idle" || phase === "sorted") ? onClick : undefined}
      >
        {/* Crosshair overlay */}
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
            "--shuffle-x": `${shuffleX * 0.2}px`,
            "--shuffle-y": `${shuffleY * 0.2}px`,
            "--shuffle-r": `${shuffleR}deg`,
          } as React.CSSProperties}
        >
          {/* fixme later, on high rolls, wave effect through offset transform x the rows and columns */}
          {items.map((hasDot, index) => (
            <DiceItem
              key={index}
              hasDot={hasDot}
              index={index}
              phase={phase === "idle" ? "sorted" : phase}
              sortedIndex={getSortedIndex(index)}
              highlighted={highlightedZones.has(index)}
              modifierColor={getModifierColor(index, activeModifiers)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
