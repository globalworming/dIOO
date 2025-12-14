import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { FullscreenButton } from "./FullscreenButton";
import { AchievementButton } from "./AchievementButton";
import { AchievementPanel } from "./AchievementPanel";
import { AchievementModal } from "./AchievementModal";
import { ModifierPanel, DEFAULT_MODIFIERS, Modifier } from "./ModifierPanel";
import { SkillsPanel, DEFAULT_SKILLS, Skill } from "./SkillsPanel";
import { useAchievements } from "@/hooks/useAchievements";
import { useRollAnimation } from "@/hooks/useRollAnimation";
import type { AchievementDef } from "@/data/achievements";

export const D100Roller = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [modifiers, setModifiers] = useState<Modifier[]>(DEFAULT_MODIFIERS);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDef | null>(null);
  
  const { stats, recordRoll, resetGame, setTotalRolls, unlockAchievement, unlockedDefs, availableDefs, totalAchievementCount } = useAchievements();

  // Reset all progress including modifiers and skills
  const handleResetGame = useCallback(() => {
    resetGame();
    setModifiers(DEFAULT_MODIFIERS.map(m => ({ ...m, active: false })));
    setSkills(DEFAULT_SKILLS.map(s => ({ ...s, active: false })));
  }, [resetGame]);

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
  });

  const toggleModifier = useCallback((id: string) => {
    setModifiers(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
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
        unlockedDefs={unlockedDefs}
        availableDefs={availableDefs}
        totalCount={totalAchievementCount}
        onDebugRoll={debugRoll}
        onSetTotalRolls={setTotalRolls}
        onUnlockAchievement={unlockAchievement}
      />

      <div className="mx-auto max-w-[min(100vw,calc(100vh-25rem))] max-h-[calc(100vh-25rem)] select-none">
        <ResultDisplay 
          result={result} 
          phase={phase} 
          modifiedResult={modifiedResult}
          modifierBonuses={modifierBonuses}
          inventory={stats.inventory}
        />
        <div className="relative">
          <DiceGrid 
            items={items} 
            phase={phase} 
            onClick={roll} 
            result={result}
            modifiers={modifiers}
            modifiedResult={modifiedResult}
            consumedIndices={consumedIndices}
          />
          {!unlockedDefs.some(d => d.id === "start") && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-xl font-scribble text-muted-foreground animate-pulse duration-10s">
                  press grid to play
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Modifier panel below grid - unlocked after ten-rolls */}
        <div className="flex flex-col justify-center mt-4 gap-4">
          {unlockedDefs.some(d => d.id === "ten-rolls") && (
            <div className="flex justify-center">
              <ModifierPanel 
                modifiers={modifiers} 
                onToggle={toggleModifier}
                disabled={isRolling}
              />
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
            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
            <div className="relative">
              <AchievementButton
                onClick={() => {
                  setAchievementPanelOpen(true);
                  setTimeout(() => unlockAchievement("open-achievements"), 500);
                }}
                onInfoClick={() => setSelectedAchievement(unlockedDefs[unlockedDefs.length - 1] ?? null)}
                unlockedCount={unlockedDefs.length}
                totalCount={totalAchievementCount}
                latestUnlocked={unlockedDefs[unlockedDefs.length - 1]}
              />
              {!unlockedDefs.some(d => d.id === "open-achievements") && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-base font-scribble text-muted-foreground animate-pulse duration-10s">
                    click to open achievements
                  </span>
                </div>
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
