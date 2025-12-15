import { Button } from "./ui/button";

export interface Skill {
  id: string;
  name: string;
  active: boolean;
  svg: string;
  triggered?: boolean;
}

interface SkillsPanelProps {
  skills: Skill[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

// Reuse colors from ModifierPanel as requested
export const SKILL_COLORS = {
  bullseye: "hsl(0, 85%, 55%)",
  cross: "hsl(180, 85%, 45%)",
  corners: "hsl(38, 95%, 55%)",
  diagonals: "hsl(280, 85%, 55%)",
};

export const SKILL_PATTERNS: Record<string, { width: number; height: number; offsets: { r: number; c: number }[]; color: string }> = {
  skill_small_x: {
    width: 3,
    height: 3,
    offsets: [
      { r: 0, c: 0 }, { r: 0, c: 2 },
      { r: 1, c: 1 },
      { r: 2, c: 0 }, { r: 2, c: 2 },
    ],
    color: SKILL_COLORS.bullseye,
  },
  skill_h_line: {
    width: 10,
    height: 1,
    offsets: Array.from({ length: 10 }, (_, i) => ({ r: 0, c: i })),
    color: SKILL_COLORS.cross,
  },
  skill_2x2: {
    width: 2,
    height: 2,
    offsets: [
      { r: 0, c: 0 }, { r: 0, c: 1 },
      { r: 1, c: 0 }, { r: 1, c: 1 },
    ],
    color: SKILL_COLORS.corners,
  },
  skill_1x2: {
    width: 1,
    height: 2,
    offsets: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
    ],
    color: SKILL_COLORS.diagonals,
  },
};

// SVGs based on 10x10 grid (viewBox 0 0 100 100)
// Using 10x10 units for grid cells since the grid is 10x10
const SKILL_SVGS: Record<string, string> = {
  smallX: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="35" y1="35" x2="65" y2="65" stroke="${SKILL_COLORS.bullseye}" stroke-width="5" stroke-linecap="round"/>
      <line x1="65" y1="35" x2="35" y2="65" stroke="${SKILL_COLORS.bullseye}" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `)}`,
  
  horizontalLine: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line x1="0" y1="50" x2="100" y2="50" stroke="${SKILL_COLORS.cross}" stroke-width="10"/>
    </svg>
  `)}`,
  
  block2x2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="40" y="40" width="20" height="20" fill="${SKILL_COLORS.corners}" />
    </svg>
  `)}`,
  
  block1x2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="40" y="45" width="10" height="20" fill="${SKILL_COLORS.diagonals}" />
    </svg>
  `)}`,
};

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: "skill_small_x",
    name: "Small X",
    active: false,
    svg: SKILL_SVGS.smallX,
  },
  {
    id: "skill_h_line",
    name: "Horizontal Line",
    active: false,
    svg: SKILL_SVGS.horizontalLine,
  },
  {
    id: "skill_2x2",
    name: "Block 2x2",
    active: false,
    svg: SKILL_SVGS.block2x2,
  },
  {
    id: "skill_1x2",
    name: "Block 1x2",
    active: false,
    svg: SKILL_SVGS.block1x2,
  },
];

export const SkillsPanel = ({ skills, onToggle, disabled }: SkillsPanelProps) => {
  return (
    <div className="flex flex-row gap-2 justify-center mt-2" aria-label="Skills Panel">
      {skills.map((skill) => (
        <Button
          key={skill.id}
          variant={"link"}
          size="sm"
          className={`w-14 h-14 transition-all hover:border-white/50 ease-in-out duration-200 relative overflow-hidden ${
            skill.active 
              ? "border-2 border-primary bg-white/5" 
              : "border-2 border-primary/50"
          } ${skill.triggered ? "border-4 border-primary bg-primary/10" : ""}`}
          onClick={() => onToggle(skill.id)}
          disabled={disabled}
          title={skill.name}
          style={{
            backgroundImage: `url("${skill.svg}")`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
          }}
        >
          <span className="relative z-10"></span>
        </Button>
      ))}
    </div>
  );
};
