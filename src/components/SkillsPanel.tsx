import { Button } from "./ui/button";

export interface Skill {
  id: string;
  name: string;
  active: boolean;
  svg: string;
}

interface SkillsPanelProps {
  skills: Skill[];
  onToggle: (id: string) => void;
  disabled?: boolean;
}

// Reuse colors from ModifierPanel as requested
const COLORS = {
  bullseye: "hsl(0, 85%, 55%)",
  cross: "hsl(180, 85%, 45%)",
  corners: "hsl(38, 95%, 55%)",
  diagonals: "hsl(280, 85%, 55%)",
};

// SVGs based on 10x10 grid (viewBox 0 0 100 100)
// Using 10x10 units for grid cells since the grid is 10x10
const SKILL_SVGS: Record<string, string> = {
  smallX: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- 3x3 small x in center? user asked for small x, 3x3, color like bullseye -->
      <!-- Let's center it: 3x3 grid means 30x30 units. Center is at 35,35 to 65,65 -->
      <line x1="35" y1="35" x2="65" y2="65" stroke="${COLORS.bullseye}" stroke-width="5" stroke-linecap="round"/>
      <line x1="65" y1="35" x2="35" y2="65" stroke="${COLORS.bullseye}" stroke-width="5" stroke-linecap="round"/>
    </svg>
  `)}`,
  
  horizontalLine: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- horizontal line colored like cross -->
      <!-- Centered horizontal line across the grid -->
      <line x1="0" y1="50" x2="100" y2="50" stroke="${COLORS.cross}" stroke-width="10"/>
    </svg>
  `)}`,
  
  block2x2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- 2x2 block colored like corners -->
      <!-- 2x2 is 20x20 units. Centered: 40,40 to 60,60 -->
      <rect x="40" y="40" width="20" height="20" fill="${COLORS.corners}" />
    </svg>
  `)}`,
  
  block1x2: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="40" y="45" width="10" height="20" fill="${COLORS.diagonals}" />
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
          className={`w-10 h-10 p-0 transition-all duration-100 relative overflow-hidden ${
            skill.active 
              ? "ring-2 ring-primary" 
              : "ring-1 ring-background hover:ring-4 hover:ring-primary/20"
          }`}
          onClick={() => onToggle(skill.id)}
          disabled={disabled}
          title={skill.name}
          style={{
            backgroundImage: `url("${skill.svg}")`,
            backgroundSize: '100% 100%',
          }}
        >
          <span className="relative z-10"></span>
        </Button>
      ))}
    </div>
  );
};
