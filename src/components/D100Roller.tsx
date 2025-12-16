import { useState, useCallback, useMemo, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { FullscreenButton } from "./FullscreenButton";
import { AchievementButton } from "./AchievementButton";
import { AchievementPanel } from "./AchievementPanel";
import { AchievementModal } from "./AchievementModal";
import { ModifierPanel, DEFAULT_SLOTS, slotsToModifiers, type SlotState } from "./ModifierPanel";
import { ALL_MODIFIERS } from "@/data/modifiers";
import { SkillsPanel, DEFAULT_SKILLS, Skill } from "./SkillsPanel";
import { Hint } from "./Hint";
import { useAchievements } from "@/hooks/useAchievements";
import { useRollAnimation } from "@/hooks/useRollAnimation";
import type { AchievementDef } from "@/data/achievements";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { Button } from "./ui/button";
import { Locate } from "lucide-react";

const MAX_KEYSTONES = 10;

export const D100Roller = () => {
  const { stats, recordRoll, resetGame, setTotalRolls, addInventoryResources, unlockAchievement, unlockedDefs, unlockedDefsSorted, availableDefs, totalAchievementCount, latestUnlockedDef } = useAchievements();

  // Filter modifiers based on unlocked achievements
  const availableModifiers = useMemo(() => {
    const unlockedIds = new Set(unlockedDefs.map(d => d.id));
    
    return ALL_MODIFIERS.filter(modifier => {      
      // Corners progression: corners2 when corners-1 unlocked, corners3 when corners-2 unlocked
      if (modifier.id === 'corners2' && unlockedIds.has('corners-1')) return true;
      if (modifier.id === 'corners1' && unlockedIds.has('corners-2')) return true;
      // bullseye progression: bullseye2 when bullseye-1 unlocked, bullseye3 when bullseye-2 unlocked
      if (modifier.id === 'bullseye1' && unlockedIds.has('bullseye-1')) return true;
      if (modifier.id === 'bullseye2' && unlockedIds.has('bullseye-2')) return true;
      // Waves progression: waves2 when waves-1 unlocked, waves3 when waves-2 unlocked
      if (modifier.id === 'waves3' && unlockedIds.has('waves-1')) return true;
      if (modifier.id === 'waves1' && unlockedIds.has('waves-2')) return true;
      if (modifier.id === 'waves5' && unlockedIds.has('waves-3')) return true;
      // Diagonal progression: diagonal2 when diagonal-1 unlocked, diagonal3 when diagonal-2 unlocked
      if (modifier.id === 'diagonals1' && unlockedIds.has('diagonals-1')) return true;
      if (modifier.id === 'diagonals2' && unlockedIds.has('diagonals-2')) return true;
      
      return false;
    });
  }, [unlockedDefs]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [slots, setSlots] = useState<SlotState[]>(DEFAULT_SLOTS);

  // Sync slots with maxSlots
  useEffect(() => {
    setSlots(current => {
      if (current.length === stats.maxSlots) return current;
      if (current.length < stats.maxSlots) {
        return [
          ...current,
          ...Array(stats.maxSlots - current.length).fill({ modifierId: null, active: false })
        ];
      } else {
        return current.slice(0, stats.maxSlots);
      }
    });
  }, [stats.maxSlots]);

  const modifiers = slotsToModifiers(slots, availableModifiers);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDef | null>(null);
  const { clearVersion } = useVersionCheck();
  
  // Keystones: indices that always stay in place and are enabled
  const [keystones, setKeystones] = useState<Set<number>>(new Set());
  const [keystoneEditMode, setKeystoneEditMode] = useState(false);
  
  const toggleKeystone = useCallback((index: number) => {
    setKeystones(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else if (next.size < MAX_KEYSTONES) {
        next.add(index);
      }
      return next;
    });
  }, []);

  // Reset all progress including modifiers and skills
  const handleResetGame = useCallback(() => {
    resetGame();
    setSlots(DEFAULT_SLOTS);
    setSkills(DEFAULT_SKILLS.map(s => ({ ...s, active: false })));
    clearVersion();
    window.location.reload();
  }, [resetGame, clearVersion]);

  // Handle skill trigger animations
  const handleSkillsTriggered = useCallback((triggeredIds: Set<string>) => {
    setSkills(prev => prev.map(s => ({
      ...s,
      triggered: triggeredIds.has(s.id)
    })));
    setTimeout(() => {
      setSkills(prev => prev.map(s => ({ ...s, triggered: false })));
    }, 1000);
  }, []);

  const {
    items,
    phase,
    result,
    modifiedResult,
    modifierBonuses,
    consumedIndices,
    roll,
    debugRoll,
    isRolling,
  } = useRollAnimation({
    modifiers,
    skills,
    recordRoll,
    onSkillsTriggered: handleSkillsTriggered,
    keystones,
  });

  const handleSlotsChange = useCallback((newSlots: SlotState[]) => {
    setSlots(newSlots);
  }, []);

  const toggleSkill = useCallback((id: string) => {
    setSkills(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && !e.repeat) {
        roll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roll]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div 
      aria-label="D100 Dice Roller Game"
    >
      <AchievementPanel
        isOpen={achievementPanelOpen}
        onClose={() => setAchievementPanelOpen(false)}
        stats={stats}
        onReset={handleResetGame}
        unlockedDefs={unlockedDefsSorted}
        availableDefs={availableDefs}
        totalCount={totalAchievementCount}
        onDebugRoll={debugRoll}
        onSetTotalRolls={setTotalRolls}
        onAddInventoryResources={addInventoryResources}
        onUnlockAchievement={unlockAchievement}
      />

      <div className="mx-auto max-w-[min(100vw,calc(100vh-25rem))] max-h-[calc(100vh-25rem)] select-none">
        <ResultDisplay 
          result={result} 
          phase={phase} 
          modifiedResult={modifiedResult}
          modifierBonuses={modifierBonuses}
          inventory={stats.inventory}
          onUnlockInventory={() => unlockAchievement("inventory-1")}
          showInventoryHint={unlockedDefs.some(d => d.id === "ten-rolls") && !unlockedDefs.some(d => d.id === "inventory-1")}
        />
        <div className="relative">
          <DiceGrid 
            items={items} 
            phase={keystoneEditMode ? "idle" : phase} 
            onClick={keystoneEditMode ? undefined : roll} 
            result={result}
            modifiers={modifiers}
            modifiedResult={modifiedResult}
            consumedIndices={consumedIndices}
            keystones={keystones}
            keystoneEditMode={keystoneEditMode}
            onToggleKeystone={toggleKeystone}
          />
          {!unlockedDefs.some(d => d.id === "start") && (
            <Hint position="center">press grid to play</Hint>
          )}
        </div>
        
        {/* Modifier panel below grid - unlocked after ten-rolls */}
        {/* TODO later: show when available modifiers > 0 */}
        <div className="flex flex-col justify-center mt-4 gap-4">
          {unlockedDefs.some(d => d.id === "ten-rolls") && (
            <div className="relative flex justify-center">
              <ModifierPanel 
                slots={slots}
                allModifiers={availableModifiers}
                onSlotsChange={handleSlotsChange}
                disabled={isRolling}
                maxSlots={stats.maxSlots}
              />
              {unlockedDefs.some(d => d.id === "ten-rolls") && !unlockedDefs.some(d => d.id === "first-mod") && availableModifiers.length > 0 && (
                <Hint>set patterns, click to toggle</Hint>
              )}
            </div>
          )}
          {/* Skills panel - unlocked after fifty-rolls */}
          {unlockedDefs.some(d => d.id === "fifty-rolls") && (
            <div className="flex justify-center">
              <SkillsPanel 
                skills={skills} 
                onToggle={toggleSkill}
                disabled={isRolling}
              />
            </div>
          )}
          {/* Controls row: fullscreen and achievements */}
          <div className="flex justify-center gap-2">
            <Button
              variant={keystoneEditMode ? "default" : "ghost"}
              className="w-14 h-14"
              onClick={() => setKeystoneEditMode(!keystoneEditMode)}
              disabled={isRolling}
              title={`Set keystones (${keystones.size}/${MAX_KEYSTONES})`}
            >
              <Locate className="w-5 h-5" />
            </Button>
            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
            <div className="relative">
              <AchievementButton
                onClick={() => {
                  setAchievementPanelOpen(true);
                  setTimeout(() => unlockAchievement("open-achievements"), 500);
                }}
                onInfoClick={() => setSelectedAchievement(latestUnlockedDef)}
                unlockedCount={unlockedDefs.length}
                totalCount={totalAchievementCount}
                latestUnlocked={latestUnlockedDef ?? undefined}
              />
              {!unlockedDefs.some(d => d.id === "open-achievements") && (
                <Hint>click for achievements and statistics</Hint>
              )}
              {unlockedDefs.some(d => d.id === "ten-rolls") && !unlockedDefs.some(d => d.id === "first-mod") && availableModifiers.length === 0 && (
                <Hint>unlock patterns</Hint>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isUnlocked={true}
        onClose={() => setSelectedAchievement(null)}
        onUnlock={unlockAchievement}
      />
    </div>
  );
};
