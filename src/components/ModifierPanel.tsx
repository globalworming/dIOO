import { Button } from "./ui/button";
import { Edit2, X } from "lucide-react";
import { useState } from "react";

export interface Modifier {
  id: string;
  name: string;
  description: string;
  active: boolean;
  zones: number[]; // indices 0-99 that score bonus
}

export interface ModifierDef {
  id: string;
  name: string;
  description: string;
  zones: number[];
  color: string;
  backgroundKey: string;
}

export interface SlotState {
  modifierId: string | null;
  active: boolean;
}

// Modifier colors for dots and result display
export const MODIFIER_COLORS: Record<string, string> = {
  corners1: "hsl(38, 95%, 55%)",
  corners2: "hsl(38, 95%, 55%)",
  corners3: "hsl(38, 95%, 55%)",
  corners4: "hsl(38, 95%, 55%)",
  corners5: "hsl(38, 95%, 55%)",
  bullseye1: "hsl(0, 85%, 55%)",
  bullseye2: "hsl(0, 85%, 55%)",
  bullseye3: "hsl(0, 85%, 55%)",
  bullseye4: "hsl(0, 85%, 55%)",
  bullseye5: "hsl(0, 85%, 55%)",
  diagonals1: "hsl(280, 85%, 55%)",
  diagonals2: "hsl(280, 85%, 55%)",
  diagonals3: "hsl(280, 85%, 55%)",
  diagonals4: "hsl(280, 85%, 55%)",
  diagonals5: "hsl(280, 85%, 55%)",
  cross1: "hsl(180, 85%, 45%)",
  cross2: "hsl(180, 85%, 45%)",
  cross3: "hsl(180, 85%, 45%)",
  cross4: "hsl(180, 85%, 45%)",
  cross5: "hsl(180, 85%, 45%)",
};


/**
 * Pre-build a 100-element color map from active modifiers.
 * First modifier to claim an index wins (same priority as getModifierColor).
 */
export const buildModifierColorMap = (activeModifiers: Modifier[]): (string | undefined)[] => {
  const colors: (string | undefined)[] = new Array(100).fill(undefined);
  for (const mod of activeModifiers) {
    const color = MODIFIER_COLORS[mod.id];
    for (const idx of mod.zones) {
      if (colors[idx] === undefined) {
        colors[idx] = color;
      }
    }
  }
  return colors;
};

/**
 * Convert slot states to Modifier array for game logic
 */
export const slotsToModifiers = (slots: SlotState[], allModifiers: ModifierDef[]): Modifier[] => {
  return slots
    .filter(slot => slot.modifierId && slot.active)
    .map(slot => {
      const def = allModifiers.find(m => m.id === slot.modifierId);
      if (!def) return null;
      return {
        id: def.id,
        name: def.name,
        description: def.description,
        active: true,
        zones: def.zones,
      };
    })
    .filter((m): m is Modifier => m !== null);
};

export interface ModifierBonus {
  color: string;
  bonus: number;
}

interface ModifierPanelProps {
  slots: SlotState[];
  allModifiers: ModifierDef[];
  onSlotsChange: (slots: SlotState[]) => void;
  disabled?: boolean;
}

// SVG backgrounds for each modifier button
const MODIFIER_BACKGROUNDS: Record<string, string> = {

  corners1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="80" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="70" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="60" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="60" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="70" width="40" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="80" y="80" width="40" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="60" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="60" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="60" y="60" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="50" height="50" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="50" y="0" width="50" height="50" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="50" width="50" height="50" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="50" y="50" width="50" height="50" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="10" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="15" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="30" y="30" width="40" height="40" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="20" y="20" width="60" height="60" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="10" y="10" width="80" height="80" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  diagonals1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="8"/>
    </svg>
  `)}`,
  diagonals2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="8"/>
    </svg>
  `)}`,
  diagonals3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="12"/>
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="12"/>
    </svg>
  `)}`,
  diagonals4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="16"/>
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="16"/>
    </svg>
  `)}`,
  diagonals5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="0" x2="100" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="20"/>
      <line x1="100" y1="0" x2="0" y2="100" stroke="hsla(280, 85%, 55%, 1)" stroke-width="20"/>
    </svg>
  `)}`,
  cross1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="45" y="0" width="10" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="45" width="100" height="10" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="45" width="100" height="10" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="45" y="0" width="10" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="40" width="100" height="20" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="40" y="0" width="20" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="30" width="100" height="40" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="30" y="0" width="40" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  empty: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="hsla(0, 0%, 50%, 0.3)" stroke-width="2" stroke-dasharray="5,5"/>
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

export const ModifierPanel = ({ slots, allModifiers, onSlotsChange, disabled }: ModifierPanelProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Toggle slot active state
  const handleSlotClick = (index: number) => {
    if (disabled) return;
    const slot = slots[index];
    if (!slot.modifierId) return; // Empty slot, do nothing
    
    const newSlots = [...slots];
    newSlots[index] = { ...slot, active: !slot.active };
    onSlotsChange(newSlots);
  };

  // Select/deselect modifier in modal
  const handleModifierToggle = (modifierId: string) => {
    const currentIds = slots.map(s => s.modifierId).filter(Boolean);
    const isSelected = currentIds.includes(modifierId);
    
    if (isSelected) {
      // Remove from slots
      const newSlots = slots.map(s => 
        s.modifierId === modifierId ? { modifierId: null, active: false } : s
      );
      onSlotsChange(newSlots);
    } else {
      // Add to first empty slot (if under 4)
      const emptyIndex = slots.findIndex(s => !s.modifierId);
      if (emptyIndex !== -1) {
        const newSlots = [...slots];
        newSlots[emptyIndex] = { modifierId, active: true };
        onSlotsChange(newSlots);
      }
    }
  };

  const getSlotBackground = (slot: SlotState): string => {
    if (!slot.modifierId) return MODIFIER_BACKGROUNDS.empty;
    return MODIFIER_BACKGROUNDS[slot.modifierId] || MODIFIER_BACKGROUNDS.empty;
  };

  const selectedCount = slots.filter(s => s.modifierId).length;

  return (
    <div className="flex flex-col gap-2" aria-label="Modifier Panel">
      {/* Slots row */}
      <div className="flex flex-row gap-2">
        {slots.map((slot, index) => (
          <Button
            key={index}
            variant="link"
            size="sm"
            className={`border-2 w-14 h-14 transition-all hover:border-white/50 ease-in-out relative overflow-hidden bg-background ${
              slot.modifierId && slot.active
                ? "border-2 border-primary bg-white/5" 
                : ""
            }`}
            onClick={() => handleSlotClick(index)}
            disabled={disabled || !slot.modifierId}
            title={slot.modifierId ? `${allModifiers.find(m => m.id === slot.modifierId)?.name} (click to toggle)` : "Empty slot"}
            style={{
              backgroundImage: `url("${getSlotBackground(slot)}")`,
              backgroundSize: '100% 100%',
            }}
          >
            <span className="relative z-10"></span>
          </Button>
        ))}
        
        {/* Edit button */}
        <Button
          variant="ghost"
          className="w-14 h-14"
          onClick={() => setModalOpen(true)}
          disabled={disabled}
          title="Edit modifiers"
        >
          <Edit2/>
        </Button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
          <div 
            className="bg-background border rounded-lg p-4 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Select Modifiers ({selectedCount}/5)</h3>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {allModifiers.map(mod => {
                const isSelected = slots.some(s => s.modifierId === mod.id);
                const canSelect = isSelected || selectedCount < 5;
                
                return (
                  <Button
                    key={mod.id}
                    variant="outline"
                    className={`w-12 h-12 p-0 ${
                      isSelected ? "border-2 border-primary" : ""
                    } ${!canSelect ? "border-primary/30" : ""}`}
                    onClick={() => canSelect && handleModifierToggle(mod.id)}
                    disabled={!canSelect}
                    title={`${mod.name}: ${mod.description}`}
                    style={{
                      backgroundImage: `url("${MODIFIER_BACKGROUNDS[mod.id]}")`,
                      backgroundSize: '100% 100%',
                      opacity: isSelected ? 1 : 0.7,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to create zone indices

// Corners variants
const createCorners1Zones = (): number[] => {
  const zones: number[] = [];
  // Top-left 2x2, Bottom-left 2x2
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) zones.push(r * 10 + c);
  for (let r = 8; r < 10; r++) for (let c = 0; c < 2; c++) zones.push(r * 10 + c);
  return zones;
};

const createCorners2Zones = (): number[] => {
  const zones: number[] = [];
  // Top-left 2x2, Top-right 3x3, Bottom-left 4x4
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) zones.push(r * 10 + c);
  for (let r = 0; r < 3; r++) for (let c = 7; c < 10; c++) zones.push(r * 10 + c);
  for (let r = 6; r < 10; r++) for (let c = 0; c < 4; c++) zones.push(r * 10 + c);
  return zones;
};

const createCorners3Zones = (): number[] => {
  const zones: number[] = [];
  // All four corners 4x4
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) zones.push(r * 10 + c);
  for (let r = 0; r < 4; r++) for (let c = 6; c < 10; c++) zones.push(r * 10 + c);
  for (let r = 7; r < 10; r++) for (let c = 0; c < 4; c++) zones.push(r * 10 + c);
  for (let r = 8; r < 10; r++) for (let c = 8; c < 10; c++) zones.push(r * 10 + c);
  return zones;
};

const createCorners4Zones = (): number[] => {
  const zones: number[] = [];
  // All four corners 4x4
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) zones.push(r * 10 + c);
  for (let r = 0; r < 4; r++) for (let c = 6; c < 10; c++) zones.push(r * 10 + c);
  for (let r = 6; r < 10; r++) for (let c = 0; c < 4; c++) zones.push(r * 10 + c);
  for (let r = 6; r < 10; r++) for (let c = 6; c < 10; c++) zones.push(r * 10 + c);
  return zones;
};

const createCorners5Zones = (): number[] => {
  const zones: number[] = [];
  // All four corners 5x5
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) zones.push(r * 10 + c);
  for (let r = 0; r < 5; r++) for (let c = 5; c < 10; c++) zones.push(r * 10 + c);
  for (let r = 5; r < 10; r++) for (let c = 0; c < 5; c++) zones.push(r * 10 + c);
  for (let r = 5; r < 10; r++) for (let c = 5; c < 10; c++) zones.push(r * 10 + c);
  return zones;
};

// Bullseye variants
const createBullseye1Zones = (): number[] => {
  const zones: number[] = [];
  // Center 1x1
  zones.push(44, 45, 54, 55);
  return zones;
};

const createBullseye2Zones = (): number[] => {
  const zones: number[] = [];
  // Center 3x3
  for (let r = 4; r < 7; r++) for (let c = 4; c < 7; c++) zones.push(r * 10 + c);
  return zones;
};

const createBullseye3Zones = (): number[] => {
  const zones: number[] = [];
  // Center 4x4
  for (let r = 3; r < 7; r++) for (let c = 3; c < 7; c++) zones.push(r * 10 + c);
  return zones;
};

const createBullseye4Zones = (): number[] => {
  const zones: number[] = [];
  // Center 6x6
  for (let r = 2; r < 8; r++) for (let c = 2; c < 8; c++) zones.push(r * 10 + c);
  return zones;
};

const createBullseye5Zones = (): number[] => {
  const zones: number[] = [];
  // Center 8x8
  for (let r = 1; r < 9; r++) for (let c = 1; c < 9; c++) zones.push(r * 10 + c);
  return zones;
};

// Diagonals variants
const createDiagonals1Zones = (): number[] => {
  const zones: number[] = [];
  // Main diagonal only
  for (let i = 0; i < 10; i++) zones.push(i * 10 + i);
  return zones;
};

const createDiagonals2Zones = (): number[] => {
  const zones: number[] = [];
  // Anti-diagonal only
  for (let i = 0; i < 10; i++) zones.push(i * 10 + (9 - i));
  return zones;
};

const createDiagonals3Zones = (): number[] => {
  const zones: number[] = [];
  // Both diagonals
  for (let i = 0; i < 10; i++) {
    zones.push(i * 10 + i);
    zones.push(i * 10 + (9 - i));
  }
  return [...new Set(zones)];
};

const createDiagonals4Zones = (): number[] => {
  const zones: number[] = [];
  // Both diagonals + adjacent cells
  for (let i = 0; i < 10; i++) {
    zones.push(i * 10 + i);
    if (i > 0) zones.push(i * 10 + (i - 1));
    if (i < 9) zones.push(i * 10 + (i + 1));
    zones.push(i * 10 + (9 - i));
    if (i > 0) zones.push(i * 10 + (10 - i));
    if (i < 9) zones.push(i * 10 + (8 - i));
  }
  return [...new Set(zones)];
};

const createDiagonals5Zones = (): number[] => {
  const zones: number[] = [];
  // Both diagonals + 2 adjacent cells on each side
  for (let i = 0; i < 10; i++) {
    for (let offset = -2; offset <= 2; offset++) {
      const col1 = i + offset;
      const col2 = (9 - i) + offset;
      if (col1 >= 0 && col1 < 10) zones.push(i * 10 + col1);
      if (col2 >= 0 && col2 < 10) zones.push(i * 10 + col2);
    }
  }
  return [...new Set(zones)];
};

// Cross variants
const createCross1Zones = (): number[] => {
  const zones: number[] = [];
  // Vertical center column only
  for (let r = 0; r < 10; r++) zones.push(r * 10 + 4, r * 10 + 5);
  return [...new Set(zones)];
};

const createCross2Zones = (): number[] => {
  const zones: number[] = [];
  // Horizontal center row only
  for (let c = 0; c < 10; c++) zones.push(4 * 10 + c, 5 * 10 + c);
  return [...new Set(zones)];
};

const createCross3Zones = (): number[] => {
  const zones: number[] = [];
  // Both center row and column (thin cross)
  for (let c = 0; c < 10; c++) zones.push(4 * 10 + c, 5 * 10 + c);
  for (let r = 0; r < 10; r++) zones.push(r * 10 + 4, r * 10 + 5);
  return [...new Set(zones)];
};

const createCross4Zones = (): number[] => {
  const zones: number[] = [];
  // Medium cross (2 cells wide)
  for (let c = 0; c < 10; c++) zones.push(4 * 10 + c, 5 * 10 + c);
  for (let r = 0; r < 10; r++) zones.push(r * 10 + 4, r * 10 + 5);
  return [...new Set(zones)];
};

const createCross5Zones = (): number[] => {
  const zones: number[] = [];
  // Wide cross (4 cells wide)
  for (let c = 0; c < 10; c++) {
    zones.push(3 * 10 + c, 4 * 10 + c, 5 * 10 + c, 6 * 10 + c);
  }
  for (let r = 0; r < 10; r++) {
    zones.push(r * 10 + 3, r * 10 + 4, r * 10 + 5, r * 10 + 6);
  }
  return [...new Set(zones)];
};

// Legacy zone creators for backward compatibility
const createCornerZones = createCorners3Zones;
const createCenterZones = createBullseye3Zones;
const createDiagonalZones = createDiagonals3Zones;
const createCrossZones = createCross3Zones;

// All available modifiers (flat list)
export const ALL_MODIFIERS: ModifierDef[] = [
  // Corners
  { id: "corners1", name: "Corners 1", description: "Small corners (2x2)", zones: createCorners1Zones(), color: "hsl(38, 95%, 55%)", backgroundKey: "corners1" },
  { id: "corners2", name: "Corners 2", description: "Asymmetric corners", zones: createCorners2Zones(), color: "hsl(38, 95%, 55%)", backgroundKey: "corners2" },
  { id: "corners3", name: "Corners 3", description: "Medium corners", zones: createCorners3Zones(), color: "hsl(38, 95%, 55%)", backgroundKey: "corners3" },
  { id: "corners4", name: "Corners 4", description: "Large corners", zones: createCorners4Zones(), color: "hsl(38, 95%, 55%)", backgroundKey: "corners4" },
  { id: "corners5", name: "Corners 5", description: "Full corners", zones: createCorners5Zones(), color: "hsl(38, 95%, 55%)", backgroundKey: "corners5" },
  // Bullseye
  { id: "bullseye1", name: "Bullseye 1", description: "Tiny center (2x2)", zones: createBullseye1Zones(), color: "hsl(0, 85%, 55%)", backgroundKey: "bullseye1" },
  { id: "bullseye2", name: "Bullseye 2", description: "Small center (3x3)", zones: createBullseye2Zones(), color: "hsl(0, 85%, 55%)", backgroundKey: "bullseye2" },
  { id: "bullseye3", name: "Bullseye 3", description: "Medium center (4x4)", zones: createBullseye3Zones(), color: "hsl(0, 85%, 55%)", backgroundKey: "bullseye3" },
  { id: "bullseye4", name: "Bullseye 4", description: "Large center (6x6)", zones: createBullseye4Zones(), color: "hsl(0, 85%, 55%)", backgroundKey: "bullseye4" },
  { id: "bullseye5", name: "Bullseye 5", description: "Huge center (8x8)", zones: createBullseye5Zones(), color: "hsl(0, 85%, 55%)", backgroundKey: "bullseye5" },
  // Diagonals
  { id: "diagonals1", name: "Diagonals 1", description: "Main diagonal", zones: createDiagonals1Zones(), color: "hsl(280, 85%, 55%)", backgroundKey: "diagonals1" },
  { id: "diagonals2", name: "Diagonals 2", description: "Anti-diagonal", zones: createDiagonals2Zones(), color: "hsl(280, 85%, 55%)", backgroundKey: "diagonals2" },
  { id: "diagonals3", name: "Diagonals 3", description: "Both diagonals (thin)", zones: createDiagonals3Zones(), color: "hsl(280, 85%, 55%)", backgroundKey: "diagonals3" },
  { id: "diagonals4", name: "Diagonals 4", description: "Both diagonals (medium)", zones: createDiagonals4Zones(), color: "hsl(280, 85%, 55%)", backgroundKey: "diagonals4" },
  { id: "diagonals5", name: "Diagonals 5", description: "Both diagonals (wide)", zones: createDiagonals5Zones(), color: "hsl(280, 85%, 55%)", backgroundKey: "diagonals5" },
  // Cross
  { id: "cross1", name: "Cross 1", description: "Vertical line", zones: createCross1Zones(), color: "hsl(180, 85%, 45%)", backgroundKey: "cross1" },
  { id: "cross2", name: "Cross 2", description: "Horizontal line", zones: createCross2Zones(), color: "hsl(180, 85%, 45%)", backgroundKey: "cross2" },
  { id: "cross3", name: "Cross 3", description: "Thin cross", zones: createCross3Zones(), color: "hsl(180, 85%, 45%)", backgroundKey: "cross3" },
  { id: "cross4", name: "Cross 4", description: "Medium cross", zones: createCross4Zones(), color: "hsl(180, 85%, 45%)", backgroundKey: "cross4" },
  { id: "cross5", name: "Cross 5", description: "Wide cross", zones: createCross5Zones(), color: "hsl(180, 85%, 45%)", backgroundKey: "cross5" },
];

// Default slot configuration (5 empty slots)
export const DEFAULT_SLOTS: SlotState[] = [
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
];
