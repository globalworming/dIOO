import { Button } from "./ui/button";
import { Grid3X3, Target, Layers, Zap } from "lucide-react";

export interface Modifier {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  active: boolean;
  zones: number[]; // indices 0-99 that score bonus
  multiplier: number;
}

interface ModifierPanelProps {
  modifiers: Modifier[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

export const ModifierPanel = ({ modifiers, onToggle, disabled }: ModifierPanelProps) => {
  return (
    <div className="flex flex-row gap-2">
      {modifiers.map((mod) => (
        <Button
          key={mod.id}
          variant={mod.active ? "default" : "outline"}
          size="sm"
          className={`w-10 h-10 p-0 transition-all duration-300 ${
            mod.active 
              ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20" 
              : "opacity-60 hover:opacity-100"
          }`}
          onClick={() => onToggle(mod.id)}
          disabled={disabled}
          title={`${mod.name}: ${mod.description}`}
        >
          {mod.icon}
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
    icon: <Grid3X3 size={18} />,
    description: "Corner zones score +50% bonus",
    active: false,
    zones: createCornerZones(),
    multiplier: 1.5,
  },
  {
    id: "bullseye",
    name: "Bullseye",
    icon: <Target size={18} />,
    description: "Center zone scores +100% bonus",
    active: false,
    zones: createCenterZones(),
    multiplier: 2.0,
  },
  {
    id: "diagonals",
    name: "Diagonals",
    icon: <Layers size={18} />,
    description: "Diagonal zones score +75% bonus",
    active: false,
    zones: createDiagonalZones(),
    multiplier: 1.75,
  },
  {
    id: "cross",
    name: "Cross",
    icon: <Zap size={18} />,
    description: "Cross zones score +60% bonus",
    active: false,
    zones: createCrossZones(),
    multiplier: 1.6,
  },
];
