import { Button } from "./ui/button";

export interface Modifier {
  id: string;
  name: string;
  description: string;
  active: boolean;
  zones: number[]; // indices 0-99 that score bonus
}

// Modifier colors for dots and result display
export const MODIFIER_COLORS: Record<string, string> = {
  corners: "hsl(38, 95%, 55%)",
  bullseye: "hsl(0, 85%, 55%)",
  diagonals: "hsl(280, 85%, 55%)",
  cross: "hsl(180, 85%, 45%)",
};

export interface ModifierBonus {
  id: string;
  color: string;
  bonus: number;
}

interface ModifierPanelProps {
  modifiers: Modifier[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

// SVG backgrounds for each modifier button
const MODIFIER_BACKGROUNDS: Record<string, string> = {
  corners: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="70" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="70" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="70" y="70" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="30" y="30" width="40" height="40" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  diagonals: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="12"/>
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="12"/>
    </svg>
  `)}`,
  cross: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="40" width="100" height="20" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="40" y="0" width="20" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
};

export const ModifierPanel = ({ modifiers, onToggle, disabled }: ModifierPanelProps) => {
  return (
    <div className="flex flex-row gap-2" aria-label="Modifier Panel - Convictions">
      {modifiers.map((mod) => (
        <Button
          key={mod.id}
          variant={"link"}
          size="sm"
          className={`w-10 h-10 p-0 transition-all duration-100 relative overflow-hidden ${
            mod.active 
              ? "ring-2 ring-primary" 
              : "ring-1 ring-background hover:ring-4 hover:ring-primary/20"
          }`}
          onClick={() => onToggle(mod.id)}
          disabled={disabled}
          title={`${mod.name}: ${mod.description}`}
          style={{
            backgroundImage: `url("${MODIFIER_BACKGROUNDS[mod.id]}")`,
            backgroundSize: '100% 100%',
          }}
        >
          <span className="relative z-10"></span>
        </Button>
      ))}
    </div>
  );
};

// Helper to create zone indices
const createCornerZones = (): number[] => {
  const zones: number[] = [];
  // Top-left 3x3
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) zones.push(r * 10 + c);
  // Top-right 3x3
  for (let r = 0; r < 3; r++) for (let c = 7; c < 10; c++) zones.push(r * 10 + c);
  // Bottom-left 3x3
  for (let r = 7; r < 10; r++) for (let c = 0; c < 3; c++) zones.push(r * 10 + c);
  // Bottom-right 3x3
  for (let r = 7; r < 10; r++) for (let c = 7; c < 10; c++) zones.push(r * 10 + c);
  return zones;
};

const createCenterZones = (): number[] => {
  const zones: number[] = [];
  // Center 4x4
  for (let r = 3; r < 7; r++) for (let c = 3; c < 7; c++) zones.push(r * 10 + c);
  return zones;
};

const createDiagonalZones = (): number[] => {
  const zones: number[] = [];
  for (let i = 0; i < 10; i++) {
    zones.push(i * 10 + i); // Main diagonal
    zones.push(i * 10 + (9 - i)); // Anti-diagonal
  }
  return [...new Set(zones)];
};

const createCrossZones = (): number[] => {
  const zones: number[] = [];
  // Middle row
  for (let c = 0; c < 10; c++) zones.push(4 * 10 + c, 5 * 10 + c);
  // Middle column
  for (let r = 0; r < 10; r++) zones.push(r * 10 + 4, r * 10 + 5);
  return [...new Set(zones)];
};

export const DEFAULT_MODIFIERS: Modifier[] = [
  {
    id: "corners",
    name: "Corners",
    description: "Dots in corners score +1",
    active: false,
    zones: createCornerZones(),
  },
  {
    id: "bullseye",
    name: "Bullseye",
    description: "Dots in center score +1",
    active: false,
    zones: createCenterZones(),
  },
  {
    id: "diagonals",
    name: "Diagonals",
    description: "Dots on diagonals score +1",
    active: false,
    zones: createDiagonalZones(),
  },
  {
    id: "cross",
    name: "Cross",
    description: "Dots on cross score +1",
    active: false,
    zones: createCrossZones(),
  },
];
