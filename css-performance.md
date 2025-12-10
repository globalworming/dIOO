# CSS & Tailwind Performance Analysis

## Key Findings

**Good practices identified:**
- **Content scanning**: Tailwind config properly scans `./src/**/*.{ts,tsx}` for class detection
- **Purging**: Unused styles will be removed in production builds via Tailwind's default JIT compiler
- **CSS-in-JS avoidance**: Uses utility classes instead of runtime style generation (except inline styles where necessary)
- **Utility-first approach**: Leverages Tailwind's pre-compiled classes rather than custom CSS

**Performance concerns:**

1. **Excessive inline styles** (DiceGrid, DiceItem, ResultDisplay)
   - Dynamic `boxShadow` with computed values on every render
   - Custom CSS variables (`--shuffle-x`, `--shuffle-y`, `--shuffle-r`) recalculated per frame during animations
   - `animationDelay` set inline per item (100 items = 100 style recalculations)

2. **Animation performance issues**
   - `animate-shuffle`, `animate-pulse-dot`, `animate-perfect-glow`, `animate-high-roll-pulse` likely trigger repaints
   - No indication of `will-change` hints or `transform`/`opacity`-only animations
   - Staggered delays (`sortedIndex * 8ms`, `sortedIndex * 20ms`) force sequential reflows

3. **SVG data URI generation**
   - `crosshairSvg` created on every render with `btoa()` encoding
   - Should be memoized or moved to a constant

4. **Potential unused Radix UI components**
   - Package includes 20+ Radix UI components; unclear which are actually used
   - Each adds CSS overhead even if unused


## TODO 
### NOW

- [x] clean up packages (remove 23 unused Radix UI packages + unused dependencies)
- [ ] remove box shadow effects, maybe replace with border effects?
- [ ] ensure shuffle is not per frame but once per random phase
  - animation should still be a bit random, like x,y,r changing every time
  - animation should shake back and forth a bit, like 0, 110, 10,90, 0, 120, 20, 0, 80, 0
- [ ] check CSS bundle size


### LATER
- [ ] **Rendering frequency**: How often does DiceGrid re-render during animations?
- [ ] **CSS-in-JS libraries**: Is `tailwind-merge` or `clsx` used for conditional class merging? (affects specificity)


Would you like me to:
- Search for custom CSS/keyframe definitions?
- Audit actual component imports to identify unused dependencies?
- Profile render performance during animations?