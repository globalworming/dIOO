import { DiceItem } from "./DiceItem";
import { Modifier } from "./ModifierPanel";

interface DiceGridProps {
  items: boolean[];
  phase: "idle" | "random" | "sorting" | "sorted" | "modifying";
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
  
  // Get active modifier zones
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

  // Generate modifier overlay SVGs
  const modifierOverlays = [
    {
      id: "corners",
      svg: modifiers.find(m => m.id === "corners")?.active ? `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 0.15)" stroke="hsla(38, 95%, 55%, 0.4)" stroke-width="0.3"/>
      <rect x="70" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 0.15)" stroke="hsla(38, 95%, 55%, 0.4)" stroke-width="0.3"/>
      <rect x="0" y="70" width="30" height="30" fill="hsla(38, 95%, 55%, 0.15)" stroke="hsla(38, 95%, 55%, 0.4)" stroke-width="0.3"/>
      <rect x="70" y="70" width="30" height="30" fill="hsla(38, 95%, 55%, 0.15)" stroke="hsla(38, 95%, 55%, 0.4)" stroke-width="0.3"/>
    </svg>
  `)}` : null,
    },
    {
      id: "bullseye",
      svg: modifiers.find(m => m.id === "bullseye")?.active ? `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="30" y="30" width="40" height="40" fill="hsla(0, 85%, 55%, 0.15)" stroke="hsla(0, 85%, 55%, 0.5)" stroke-width="0.4"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="hsla(0, 85%, 55%, 0.3)" stroke-width="0.3"/>
    </svg>
  `)}` : null,
    },
    {
      id: "diagonals",
      svg: modifiers.find(m => m.id === "diagonals")?.active ? `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 0.5)" stroke-width="10"/>
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 0.5)" stroke-width="10"/>
    </svg>
  `)}` : null,
    },
    {
      id: "cross",
      svg: modifiers.find(m => m.id === "cross")?.active ? `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="40" width="100" height="20" fill="hsla(180, 85%, 45%, 0.15)" stroke="hsla(180, 85%, 45%, 0.4)" stroke-width="0.3"/>
      <rect x="40" y="0" width="20" height="100" fill="hsla(180, 85%, 45%, 0.15)" stroke="hsla(180, 85%, 45%, 0.4)" stroke-width="0.3"/>
    </svg>
  `)}` : null,
    },
  ];

  // Dynamic glow style based on result
  const isResultPhase = phase === "sorted" || phase === "modifying";
  const gridGlowStyle = isResultPhase && displayResult ? {
    boxShadow: isPerfect 
      ? `0 0 60px hsl(var(--primary) / 0.8), 0 0 120px hsl(var(--primary) / 0.4), 0 0 180px hsl(var(--primary) / 0.2)`
      : isHighRoll
        ? `0 0 ${30 * intensity}px hsl(var(--primary) / ${0.4 * intensity}), 0 0 ${60 * intensity}px hsl(var(--primary) / ${0.2 * intensity})`
        : isLowRoll
          ? `0 0 20px hsl(var(--muted) / 0.3)`
          : undefined,
  } : {};

  return (
    <div className="p-2">
      <div 
        className={`relative w-full max-w-lg mx-auto cursor-pointer transition-all duration-700 rounded-lg ${
          isPerfect ? "animate-perfect-glow" : ""
        } ${isHighRoll && !isPerfect ? "animate-high-roll-pulse" : ""}`}
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
        {/* Modifier overlays */}
        {false && modifierOverlays.map(({ id, svg }) => (
          svg && (
            <div 
              key={id}
              className="absolute inset-0 pointer-events-none animate-fade-in transition-opacity duration-300"
              style={{
                backgroundImage: `url("${svg}")`,
                backgroundSize: '100% 100%',
              }}
            />
          )
        ))}
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
              highlighted={highlightedZones.has(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
