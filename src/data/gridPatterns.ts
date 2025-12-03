export interface GridPattern {
  name: string;
  svg: string;
  description: string;
  mask: number[];
}

export const gridPatterns: Record<string, GridPattern> = {
  thirdColumn: {
    name: "thirdColumn",
    svg: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <line x1="75" y1="4" x2="75" y2="96" stroke="hsla(120, 84%, 35%, 0.40)" stroke-width="6.0" stroke-linecap="round"/>
      </svg>
    `)}`,
    description: "Vertical line at column 7 (index 6)",
    mask: [
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0
    ]
  }
};
