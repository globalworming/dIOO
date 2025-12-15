import { Button } from "./ui/button";
import { Edit2, X } from "lucide-react";
import { useState } from "react";
import { MODIFIER_BACKGROUNDS, getModifierColor } from "@/data/modifiers";

export interface Modifier {
  id: string;
  active: boolean;
  zones: number[]; // indices 0-99 that score bonus
}

export interface ModifierDef {
  id: string;
  zones: number[];
  color: string;
}

export interface SlotState {
  modifierId: string | null;
  active: boolean;
}

/**
 * Pre-build a 100-element color map from active modifiers.
 * First modifier to claim an index wins (same priority as getModifierColor).
 */
export const buildModifierColorMap = (activeModifiers: Modifier[]): (string | undefined)[] => {
  const colors: (string | undefined)[] = new Array(100).fill(undefined);
  for (const mod of activeModifiers) {
    const color = getModifierColor(mod.id);
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
            title={slot.modifierId ? `${allModifiers.find(m => m.id === slot.modifierId)?.id} (click to toggle)` : "Empty slot"}
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
            
            <div className="grid grid-cols-9 gap-2">
              {allModifiers.map(mod => {
                const isSelected = slots.some(s => s.modifierId === mod.id);
                const canSelect = isSelected || selectedCount < 5;
                
                return (
                  <Button
                    key={mod.id}
                    variant="link"
                    className={`border-2  w-10 h-10 p-0 hover:border-primary transition-all ease-in-out ${
                      isSelected ? "border-primary" : ""
                    } ${!canSelect ? "border-primary/30" : ""}`}
                    onClick={() => canSelect && handleModifierToggle(mod.id)}
                    disabled={!canSelect}
                    title={mod.id}
                    style={{
                      backgroundImage: `url("${MODIFIER_BACKGROUNDS[mod.id]}")`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      opacity: isSelected ? 1 : 0.5,
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

// Default slot configuration (5 empty slots)
export const DEFAULT_SLOTS: SlotState[] = [
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
  { modifierId: null, active: false },
];
