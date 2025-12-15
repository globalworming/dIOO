import { ModifierDef } from "@/components/ModifierPanel";

// SVG backgrounds for each modifier button
export const MODIFIER_BACKGROUNDS: Record<string, string> = {
  empty: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="hsla(0, 0%, 50%, 0.2)" stroke-width="1" stroke-dasharray="5,5"/>
    </svg>
  `)}`,

  corners1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="80" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="80" y="0" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="80" y="80" width="20" height="20" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="70" width="30" height="30" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  corners3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="60" y="0" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="0" y="60" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
      <rect x="60" y="60" width="40" height="40" fill="hsla(38, 95%, 55%, 1)" stroke="hsla(38, 95%, 55%, 1)" stroke-width="1"/>
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
      <circle cx="50" cy="50" r="20" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  bullseye5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="hsla(0, 85%, 55%, 1)" stroke="hsla(0, 85%, 55%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  diagonals1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="5" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(45 50 50)"/>
    </svg>
  `)}`,
  diagonals2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="5" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(-45 50 50)"/>
    </svg>
  `)}`,
  diagonals3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="5" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(45 50 50)"/>
      <rect x="0" y="0" width="5" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(-45 50 50)"/>
    </svg>
  `)}`,
  diagonals4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="10" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(45 50 50)"/>
      <rect x="0" y="0" width="10" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(-45 50 50)"/>
    </svg>
  `)}`,
  diagonals5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="0" width="15" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(45 50 50)"/>
      <rect x="0" y="0" width="15" height="100" fill="hsla(280, 85%, 55%, 1)" stroke="hsla(280, 85%, 55%, 1)" stroke-width="1" transform="rotate(-45 50 50)"/>
    </svg>
  `)}`,
  cross1: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="40" y="0" width="20" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="40" width="100" height="20" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross3: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="40" width="100" height="20" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="40" y="0" width="20" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross4: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="35" width="100" height="30" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="35" y="0" width="30" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
  cross5: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="0" y="30" width="100" height="40" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
      <rect x="30" y="0" width="40" height="100" fill="hsla(180, 85%, 45%, 1)" stroke="hsla(180, 85%, 45%, 1)" stroke-width="1"/>
    </svg>
  `)}`,
};

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
  for (let i = 0; i < 10; i++) {
    // Main diagonal
    zones.push(i * 10 + i);
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
