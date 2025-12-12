# Refactoring TODO

## TODO now

### 7. Fix render-time side effects in DiceGrid

**File:** `src/components/DiceGrid.tsx` lines 50-52  
**Problem:** `shuffleX/Y/R` computed with `Math.random()` on every render.  
**Solution:** Use `useMemo` or move to state initialized once per roll.

### 8. Clarify SkillsPanel hidden state

**File:** `src/components/D100Roller.tsx` line 132  
**Problem:** Skills panel wrapped in `hidden={true}` - unclear if WIP or deprecated.  
**Solution:** Add comment or remove dead code.

---

## TODO later

### 9. Consolidate zone creation functions

**File:** `src/components/ModifierPanel.tsx` lines 98-134  
**Problem:** Zone creation functions at bottom of file, far from `DEFAULT_MODIFIERS`.  
**Solution:** Move to separate `modifierZones.ts` or inline into `DEFAULT_MODIFIERS`.
