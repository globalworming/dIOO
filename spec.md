# dIOO Gameplay Spec (BDD, Player Perspective)

Scope: define the main gameplay loops and player interactions in current `dIOO` as implemented, with behavior-driven stories across session stages.

Version: current repository snapshot.

## Core Gameplay Model

`dIOO` is an incremental clicker loop built on repeated D100-style rolls rendered as a 10x10 dot grid. The player repeatedly triggers rolls, receives immediate numeric outcomes, and then uses pattern modifiers plus achievement-driven unlocks to convert random outcomes into targeted progression.

Primary progression value is not raw score. Primary value is achievement unlock momentum. Score, roll count, modifier bonuses, and inventory resources are intermediate currencies used to unlock the next useful branch of progression.

The game currently expresses five interacting loops:

1. Roll loop: click grid (or press Enter), animate, reveal natural result, then reveal modified result when active patterns apply.
2. Achievement loop: unlock tree defines what is reachable now, what is visible as “available,” and what remains hidden.
3. Modifier loop: player equips and toggles pattern slots to bias bonus color/resource generation.
4. Resource loop: natural rolls and color bonuses accumulate in inventory, with caps and overflow pressure.
5. Keystone loop: later progression adds board control by fixing selected cells as persistent dots, reducing variance for targeted outcomes.
6. Skills loop: player equips and toggles skill slots to support resource collection with percentage increases

## Global Success Criteria

A player session is considered healthy when achievement reward cadence is steady under near-optimal play.

Cadence targets:

- Early stage target: about 1 achievement every 2 to 5 rolls.
- Mid stage target: about 1 achievement every 10 to 20 rolls.

Near-optimal play definition:

- The player checks available achievements.
- The player spends for manual unlocks that open stronger pattern options.
- The player equips/toggles modifiers to generate bottleneck resources, not surplus resources.

Design stance on friction:

- Resource waste from overflow is intentional pacing pressure.
- RNG plus player selection should create tension, not perfect conversion.
- The goal is mitigation through better choices, not full prevention of waste.

## Stage Pack 1: New Session

### Player Loop Summary

The player enters with almost no systems visible. The immediate loop teaches one behavior: interact with the grid, observe clear response, and discover achievements as the framing progression system.

### Scenario 1.1: First Action Creates Progress Context

Given a fresh state with no prior progress,
When the player clicks the grid once,
Then a roll is recorded,
And first-session progression starts (`init` path already reachable, `start` can unlock through rolling),
And the player receives direct feedback from visible result changes.

### Scenario 1.2: Achievements Are Discoverable, Not Hidden Meta

Given the player has started rolling,
When the player opens the achievements panel,
Then available and unlocked achievements are visible as separate groups,
And the panel provides direction on what is unlockable now,
And this interaction itself is progression-relevant (`open-achievements` branch).

### Scenario 1.3: Guidance Is Lightweight and Actionable

Given the player has not yet internalized controls,
When hints are shown (grid interaction prompt, achievement prompt),
Then hints point to immediate high-value actions,
And hints do not require reading a long tutorial,
And player can continue progressing without leaving the main loop.

### Scenario 1.4: First Milestones Establish Momentum

Given a player continues rolling in the first session,
When `start`, `five-rolls`, and `ten-rolls` thresholds are reached,
Then new systems become visible in a paced sequence,
And each unlock changes available decisions,
And the player perceives progression as expanding agency, not just increasing numbers.

## Stage Pack 2: Early Game (Pattern Discovery and Resource Direction)

### Player Loop Summary

Early game begins when modifier interaction matters. The player transitions from pure rolling to intentional pattern selection. The main objective is to unlock and use manual branches that increase future earning efficiency.

### Scenario 2.1: Modifier Panel Activation Introduces Agency

Given `ten-rolls` is unlocked,
When the player opens modifier edit and assigns available patterns to slots,
Then future rolls can produce color-specific bonuses,
And slot active/inactive toggles allow quick adaptation,
And modifier usage becomes a core source of progression speed.

### Scenario 2.2: Targeted Selection Outperforms Random Selection

Given the player has multiple available achievements with different resource requirements,
When the player equips patterns that match the current bottleneck resource,
Then manual unlock requirements are met sooner,
And achievement cadence stays near early target,
And surplus in irrelevant colors grows slower than in non-targeted play.

### Scenario 2.3: Inventory Is Planning Surface, Not Passive Counter

Given inventory accumulation has started,
When the player checks result and inventory bars regularly,
Then the player can adjust pattern choice before committing more rolls,
And the player can avoid extreme overinvestment in already-satisfied resources,
And inventory visibility supports short planning loops.

### Scenario 2.4: Suboptimal Play Produces Waste by Design

Given finite inventory caps and random roll outcomes,
When the player keeps farming easy surplus colors while bottlenecks persist,
Then overflow or low-value accumulation occurs,
And achievement progression slows,
And this slowdown is expected behavior, not failure of core loop.

### Scenario 2.5: Manual Unlocks Function as a Skill Tree

Given available manual unlock achievements exist,
When the player spends inventory resources to unlock a branch,
Then new modifier variants become reachable or stronger,
And future resource generation options expand,
And unlock order becomes a strategic decision with opportunity cost.

### Scenario 2.6: Early Reward Pacing Feels Frequent

Given near-optimal early play,
When the player cycles between rolling, checking availability, and spending resources,
Then achievement unlocks occur every few rolls on average,
And the player receives frequent reinforcement,
And loop abandonment risk stays low.

## Stage Pack 3: Mid Game (Optimization Under Constraints)

### Player Loop Summary

Mid game shifts from discovery to routing. The player already knows core controls and now optimizes around bottlenecks, branch choices, and randomness. Progress remains steady but intentionally less frequent than early stage.

### Scenario 3.1: Achievement Cadence Slows but Remains Predictable

Given the player reached mid-stage branches,
When they continue near-optimal routing,
Then unlock cadence slows to roughly 10 to 20 rolls per unlock,
And gaps between rewards create tension,
And the player still sees clear next targets in available achievements.

### Scenario 3.2: Branch Decisions Carry Real Tradeoffs

Given multiple manual unlock options are simultaneously available,
When the player spends on one branch,
Then short-term progression accelerates for that branch,
And other branches are deferred,
And tradeoff is explicit through resource spend and delayed alternatives.

### Scenario 3.3: Bottleneck Management Is the Dominant Skill

Given random outcomes continue to inject variance,
When the player updates modifier loadout based on current shortages,
Then progress is materially faster than static loadouts,
And waste from capped resources is reduced but not eliminated,
And player skill is expressed as adaptation, not deterministic control.

### Scenario 3.4: Achievement Panel Acts as Progress Router

Given the player is unsure which objective to pursue next,
When they review available achievements in panel,
Then they can identify immediate unlock candidates,
And they can align current modifier choices with those requirements,
And the panel closes the loop between intent and action.

### Scenario 3.5: High Roll Events Are Valuable but Not Sufficient

Given occasional strong natural or modified rolls occur,
When the player relies only on lucky spikes,
Then progression can still stall on missing resources,
And systematic pattern targeting remains required,
And game identity stays incremental-strategic rather than pure chance.

### Scenario 3.6: Resource Overflow Remains Intentional Pressure

Given the player operates in longer farming windows,
When non-bottleneck resources approach cap,
Then further gains in those channels have diminishing progression value,
And the player is forced to reconfigure,
And tension between “keep rolling” and “re-route now” remains active.

## Stage Pack 4: Late Game (Variance Control with Keystones)

### Player Loop Summary

Late-stage interaction adds keystone editing as explicit board control. Player still cannot remove randomness, but can shape distributions by pinning persistent dots in selected cells and combining this with modifier strategy.

### Scenario 4.1: Keystone Unlock Changes Session Planning

Given keystone feature is manually unlocked and available,
When the player enters keystone edit mode and sets key cells,
Then those cells persist as dots across subsequent rolls,
And the player obtains a controllable baseline,
And planning horizon extends beyond single-roll decisions.

### Scenario 4.2: Keystone + Modifier Synergy Improves Targeting

Given keystones are active and modifier slots are configured,
When the player places keystones in zones aligned with desired bonuses,
Then bottleneck resource progress improves relative to no-keystone baseline,
And randomness remains present in non-keystone cells,
And outcome variance decreases without becoming deterministic.

### Scenario 4.3: Keystone Limits Preserve Tradeoff

Given there is a finite keystone cap,
When the player overcommits keystones to one objective,
Then flexibility for alternate objectives drops,
And the player may need reconfiguration cycles,
And late-game optimization remains a constrained planning problem.

### Scenario 4.4: Late-Stage Loop Keeps Achievement Focus

Given advanced tools are unlocked,
When the player executes repeated optimization cycles,
Then progression value is still measured by achievement advancement,
And scores/resources remain means to this end,
And loop identity stays consistent with early and mid game.

### Scenario 4.5: Complexity Maps to Resource Multiplier

Given active skills have defined complexity tiers (simple, medium, complex) with configured multipliers,
When a roll triggers a skill match,
Then the awarded resource gain is increased by that skill’s percentage multiplier,
And higher complexity always yields a strictly higher percentage than lower complexity,
And the applied multiplier is shown in result feedback.

### Scenario 4.6: Multiple Skill Matches Resolve Deterministically

Given a roll triggers more than one active skill,
When resource bonuses are calculated,
Then percentage increases are combined using one explicit rule (for example additive, with a hard cap),
And the same inputs always produce the same final bonus,
And the UI breakdown lists each contributing skill and total percentage applied.

### Scenario 4.7: Complexity Creates a Real Strategic Tradeoff

Given simple skills trigger more often and complex skills trigger less often,
When a player optimizes over many rolls,
Then complex skills produce larger per-trigger resource spikes,
And simple skills produce steadier baseline income,
And optimal late-game play depends on choosing a portfolio of skills aligned to current bottleneck resources.

## Cross-Stage Interaction Rules

1. Every major player action should feed at least one visible feedback channel (result number, bonus breakdown, achievement state, inventory bars, or hint).
2. Each stage must preserve a clear “next best action” discoverable from UI.
3. Manual unlock spending is a progression decision, not cosmetic action.
4. RNG should produce uncertainty, not strategic irrelevance.
5. Waste and overflow should be explainable by player decisions plus randomness, never by opaque hidden systems.

## Known Friction Patterns (Player Perspective)

- Farming familiar patterns too long after their branch stops being bottlenecked.
- Ignoring available manual unlocks and hoarding resources with no conversion plan.
- Treating high-roll events as progression strategy instead of variance events.
- Leaving inefficient modifier combinations active through multiple cycles.
- using keystones without tying placement to a specific achievement target.
- priotitizing pleasing patterns over progression

## Test Scenarios for Product/Design Validation

### Cadence Validation

Given a near-optimal early session,
When 30 rolls are simulated with active routing,
Then observed unlock cadence should remain near early target window.

Given a near-optimal mid session,
When 100 rolls are simulated with branch-aware routing,
Then observed cadence should cluster around mid target window.

### Agency Validation

Given two players with equal roll count,
When one uses bottleneck-driven modifier/branch planning and one uses random choices,
Then planner should unlock materially more achievements in the same window.

### Friction Validation

Given capped inventory behavior,
When players prioritize non-bottleneck resources,
Then measurable overflow/waste should appear,
And progression delay should be observable.

### Discoverability Validation

Given a new player session,
When first 10 rolls are completed,
Then player should be able to identify the next high-value action from current UI without external documentation.

## Acceptance Checklist

- Covers `New`, `Early`, `Mid`, `Late` stages with player-facing loops.
- Uses hybrid BDD format with concise Given/When/Then scenarios.
- Treats achievements as primary progression metric.
- Treats manual unlocks as core skill-tree behavior.
- Documents early (2-5 rolls) and mid (10-20 rolls) cadence targets.
- Explicitly marks overflow/waste as intentional pacing pressure.
- Reflects current implementation scope, including late keystone and active skills loops.
