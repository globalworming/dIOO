import { ModifierDef } from "@/components/ModifierPanel";


// Helper to create zone indices
const createCorners1Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Top-left corner (2x2)
      if (i < 2 && j < 2) zones.push(i * 10 + j);
      // Top-right corner (2x2)
      if (i < 2 && j >= 8) zones.push(i * 10 + j);
      // Bottom-left corner (2x2)
      if (i >= 8 && j < 2) zones.push(i * 10 + j);
      // Bottom-right corner (2x2)
      if (i >= 8 && j >= 8) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCorners2Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Top-left corner (3x3)
      if (i < 3 && j < 3) zones.push(i * 10 + j);
      // Bottom-left corner (3x3)
      if (i >= 7 && j < 3) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCorners3Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Top-left corner (4x4)
      if (i < 4 && j < 4) zones.push(i * 10 + j);
      // Top-right corner (4x4)
      if (i < 4 && j >= 6) zones.push(i * 10 + j);
      // Bottom-left corner (4x4)
      if (i >= 6 && j < 4) zones.push(i * 10 + j);
      // Bottom-right corner (4x4)
      if (i >= 6 && j >= 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCorners4Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Top-left corner (4x4)
      if (i < 4 && j < 4) zones.push(i * 10 + j);
      // Top-right corner (4x4)
      if (i < 4 && j >= 6) zones.push(i * 10 + j);
      // Bottom-left corner (4x4)
      if (i >= 6 && j < 4) zones.push(i * 10 + j);
      // Bottom-right corner (4x4)
      if (i >= 6 && j >= 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCorners5Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Top-left corner (5x5)
      if (i < 5 && j < 5) zones.push(i * 10 + j);
      // Top-right corner (5x5)
      if (i < 5 && j >= 5) zones.push(i * 10 + j);
      // Bottom-left corner (5x5)
      if (i >= 5 && j < 5) zones.push(i * 10 + j);
      // Bottom-right corner (5x5)
      if (i >= 5 && j >= 5) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createBullseye1Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Center 2x2
      if (i >= 4 && i < 6 && j >= 4 && j < 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createBullseye2Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Center 3x3
      if (i >= 3 && i < 6 && j >= 3 && j < 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createBullseye3Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Center 4x4
      if (i >= 3 && i < 7 && j >= 3 && j < 7) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createBullseye4Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Center 6x6
      if (i >= 2 && i < 8 && j >= 2 && j < 8) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createBullseye5Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Center 8x8
      if (i >= 1 && i < 9 && j >= 1 && j < 9) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createDiagonals1Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 6; i++) {
    // Main diagonal
    zones.push(i * 10 + i - 6);
  }
  return zones;
};

const createDiagonals2Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Anti-diagonal
    zones.push(i * 10 + (9 - i));
  }
  return zones;
};

const createDiagonals3Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Main diagonal
    zones.push(i * 10 + i);
    // Anti-diagonal
    zones.push(i * 10 + (9 - i));
  }
  return zones;
};

const createDiagonals4Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Both diagonals (medium)
      if (Math.abs(i - j) <= 1 || Math.abs(i + j - 9) <= 1) {
        zones.push(i * 10 + j);
      }
    }
  }
  return zones;
};

const createDiagonals5Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Both diagonals (wide)
      if (Math.abs(i - j) <= 2 || Math.abs(i + j - 9) <= 2) {
        zones.push(i * 10 + j);
      }
    }
  }
  return zones;
};

const createCross1Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Vertical line
      if (j >= 4 && j < 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCross2Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Horizontal line
      if (i >= 4 && i < 6) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCross3Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Thin cross
      if ((j >= 4 && j < 6) || (i >= 4 && i < 6)) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCross4Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Medium cross
      if ((j >= 3 && j < 7) || (i >= 3 && i < 7)) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createCross5Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Wide cross
      if ((j >= 2 && j < 8) || (i >= 2 && i < 8)) zones.push(i * 10 + j);
    }
  }
  return zones;
};

// Dots variants
const createDots1Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Column 0
    zones.push(i * 10 + 0);
  }
  return zones;
};

const createDots2Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Column 9
    zones.push(i * 10 + 9);
  }
  return zones;
};

const createDots3Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Columns 0 and 9
    zones.push(i * 10 + 0);
    zones.push(i * 10 + 9);
  }
  return zones;
};

const createDots4Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Columns 2 and 7
    zones.push(i * 10 + 2);
    zones.push(i * 10 + 7);
  }
  return zones;
};

const createDots5Zones = (): number[] => {
  const zones = [];
  for (let i = 0; i < 10; i++) {
    // Columns 4 and 5 (center columns)
    zones.push(i * 10 + 4);
    zones.push(i * 10 + 5);
  }
  return zones;
};

// Waves variants
const createWaves1Zones = (): number[] => {
  const zones = [];
  // Sine wave: y = 4.5 + 3.5 * sin(x/9 * 2*PI)
  for (let j = 0; j < 10; j++) {
    const y = 4.5 + 3.5 * Math.sin((j / 9) * 2 * Math.PI);
    const i = Math.round(y);
    if (i >= 0 && i < 10) zones.push(i * 10 + j);
  }
  return zones;
};

const createWaves2Zones = (): number[] => {
  const zones = [];
  // Cosine wave: y = 4.5 + 3.5 * cos(x/9 * 2*PI)
  for (let j = 0; j < 10; j++) {
    const y = 4.5 + 3.5 * Math.cos((j / 9) * 2 * Math.PI);
    const i = Math.round(y);
    if (i >= 0 && i < 10) zones.push(i * 10 + j);
  }
  return zones;
};

const createWaves3Zones = (): number[] => {
  const zones = [];
  // High freq wave: y = 4.5 + 3.5 * sin(x/9 * 4*PI)
  for (let j = 0; j < 10; j++) {
    const y = 4.5 + 3.5 * Math.sin((j / 9) * 4 * Math.PI);
    const i = Math.round(y);
    if (i >= 0 && i < 10) zones.push(i * 10 + j);
  }
  return zones;
};

const createWaves4Zones = (): number[] => {
  const zones = [];
  // Thick sine wave
  for (let j = 0; j < 10; j++) {
    const yCenter = 4.5 + 3.5 * Math.sin((j / 9) * 2 * Math.PI);
    for (let i = 0; i < 10; i++) {
        if (Math.abs(i - yCenter) <= 1.5) zones.push(i * 10 + j);
    }
  }
  return zones;
};

const createWaves5Zones = (): number[] => {
  const zones = [];
  // Double wave
  for (let j = 0; j < 10; j++) {
    const y1 = 2 + 1.5 * Math.sin((j / 9) * 2 * Math.PI);
    const y2 = 7 + 1.5 * Math.sin((j / 9) * 2 * Math.PI);
    const i1 = Math.round(y1);
    const i2 = Math.round(y2);
    if (i1 >= 0 && i1 < 10) zones.push(i1 * 10 + j);
    if (i2 >= 0 && i2 < 10) zones.push(i2 * 10 + j);
  }
  return zones;
};

// Modifier Color Themes
export const MODIFIER_THEME_COLORS = {
  corners: "hsl(38, 95%, 55%)",
  bullseye: "hsl(0, 85%, 55%)",
  diagonals: "hsl(280, 85%, 55%)",
  cross: "hsl(180, 85%, 45%)",
  dots: "hsl(100, 85%, 55%)",
  waves: "hsl(100, 85%, 55%)",
} as const;

export const getModifierColor = (id: string): string => {
  if (id.startsWith("corners")) return MODIFIER_THEME_COLORS.corners;
  if (id.startsWith("bullseye")) return MODIFIER_THEME_COLORS.bullseye;
  if (id.startsWith("diagonals")) return MODIFIER_THEME_COLORS.diagonals;
  if (id.startsWith("cross")) return MODIFIER_THEME_COLORS.cross;
  if (id.startsWith("dots")) return MODIFIER_THEME_COLORS.dots;
  if (id.startsWith("waves")) return MODIFIER_THEME_COLORS.waves;
  return "hsl(0, 0%, 50%)";
};

// All available modifiers (flat list)
export const ALL_MODIFIERS: ModifierDef[] = [
  { id: "corners1", zones: createCorners1Zones(), color: MODIFIER_THEME_COLORS.corners },
  { id: "corners2", zones: createCorners2Zones(), color: MODIFIER_THEME_COLORS.corners },
  { id: "corners3", zones: createCorners3Zones(), color: MODIFIER_THEME_COLORS.corners },
  { id: "corners4", zones: createCorners4Zones(), color: MODIFIER_THEME_COLORS.corners },
  { id: "corners5", zones: createCorners5Zones(), color: MODIFIER_THEME_COLORS.corners },
  { id: "bullseye1", zones: createBullseye1Zones(), color: MODIFIER_THEME_COLORS.bullseye },
  { id: "bullseye2", zones: createBullseye2Zones(), color: MODIFIER_THEME_COLORS.bullseye },
  { id: "bullseye3", zones: createBullseye3Zones(), color: MODIFIER_THEME_COLORS.bullseye },
  { id: "bullseye4", zones: createBullseye4Zones(), color: MODIFIER_THEME_COLORS.bullseye },
  { id: "bullseye5", zones: createBullseye5Zones(), color: MODIFIER_THEME_COLORS.bullseye },
  { id: "diagonals1", zones: createDiagonals1Zones(), color: MODIFIER_THEME_COLORS.diagonals },
  { id: "diagonals2", zones: createDiagonals2Zones(), color: MODIFIER_THEME_COLORS.diagonals },
  { id: "diagonals3", zones: createDiagonals3Zones(), color: MODIFIER_THEME_COLORS.diagonals },
  { id: "diagonals4", zones: createDiagonals4Zones(), color: MODIFIER_THEME_COLORS.diagonals },
  { id: "diagonals5", zones: createDiagonals5Zones(), color: MODIFIER_THEME_COLORS.diagonals },
  { id: "cross1", zones: createCross1Zones(), color: MODIFIER_THEME_COLORS.cross },
  { id: "cross2", zones: createCross2Zones(), color: MODIFIER_THEME_COLORS.cross },
  { id: "cross3", zones: createCross3Zones(), color: MODIFIER_THEME_COLORS.cross },
  { id: "cross4", zones: createCross4Zones(), color: MODIFIER_THEME_COLORS.cross },
  { id: "cross5", zones: createCross5Zones(), color: MODIFIER_THEME_COLORS.cross },
  { id: "dots1", zones: createDots1Zones(), color: MODIFIER_THEME_COLORS.dots },
  { id: "dots2", zones: createDots2Zones(), color: MODIFIER_THEME_COLORS.dots },
  { id: "dots3", zones: createDots3Zones(), color: MODIFIER_THEME_COLORS.dots },
  { id: "dots4", zones: createDots4Zones(), color: MODIFIER_THEME_COLORS.dots },
  { id: "dots5", zones: createDots5Zones(), color: MODIFIER_THEME_COLORS.dots },
  { id: "waves1", zones: createWaves1Zones(), color: MODIFIER_THEME_COLORS.waves },
  { id: "waves2", zones: createWaves2Zones(), color: MODIFIER_THEME_COLORS.waves },
  { id: "waves3", zones: createWaves3Zones(), color: MODIFIER_THEME_COLORS.waves },
  { id: "waves4", zones: createWaves4Zones(), color: MODIFIER_THEME_COLORS.waves },
  { id: "waves5", zones: createWaves5Zones(), color: MODIFIER_THEME_COLORS.waves },
];

// Helper to generate SVG data URI from zones and color
const generateModifierSvg = (zones: number[], color: string): string => {
  const rects = zones.map(zoneIdx => {
    const row = Math.floor(zoneIdx / 10);
    const col = zoneIdx % 10;
    return `<rect x="${col}" y="${row}" width="1" height="1" fill="${color}"/>`;
  }).join('');

  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      ${rects}
    </svg>
  `)}`;
};

// SVG backgrounds map (generated from modifiers)
export const MODIFIER_BACKGROUNDS: Record<string, string> = {
  empty: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="hsla(0, 0%, 50%, 0.2)" stroke-width="1" stroke-dasharray="5,5"/>
    </svg>
  `)}`,
};

// Populate backgrounds from modifiers
ALL_MODIFIERS.forEach(mod => {
  MODIFIER_BACKGROUNDS[mod.id] = generateModifierSvg(mod.zones, mod.color);
});
