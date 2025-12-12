import { useState, useCallback, useEffect } from "react";
import { DiceGrid } from "./DiceGrid";
import { ResultDisplay } from "./ResultDisplay";
import { FullscreenButton } from "./FullscreenButton";
import { AchievementButton } from "./AchievementButton";
import { AchievementPanel } from "./AchievementPanel";
import { ModifierPanel, DEFAULT_MODIFIERS, Modifier } from "./ModifierPanel";
import { SkillsPanel, DEFAULT_SKILLS, Skill } from "./SkillsPanel";
import { useAchievements } from "@/hooks/useAchievements";
import { useRollAnimation } from "@/hooks/useRollAnimation";

export const D100Roller = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [modifiers, setModifiers] = useState<Modifier[]>(DEFAULT_MODIFIERS);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  
  const { stats, recordRoll, resetGame, unlockedDefs, availableDefs, totalAchievementCount } = useAchievements();

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
    roll,
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
      />

      <div className="mx-auto max-w-[min(100vw,calc(100vh-25rem))] max-h-[calc(100vh-25rem)]">
        <ResultDisplay 
          result={result} 
          phase={phase} 
          modifiedResult={modifiedResult}
          modifierBonuses={modifierBonuses}
        />
        <DiceGrid 
          items={items} 
          phase={phase} 
          onClick={roll} 
          result={result}
          modifiers={modifiers}
          modifiedResult={modifiedResult}
        />
        
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
            <AchievementButton
              onClick={() => setAchievementPanelOpen(true)}
              unlockedCount={unlockedDefs.length}
              totalCount={totalAchievementCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
