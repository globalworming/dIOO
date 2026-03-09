extends RefCounted

const EngineScript = preload("res://scripts/core/game_engine.gd")

var _failures: int = 0

func run() -> int:
	_failures = 0
	_test_initial_tree_state()
	_test_first_roll_unlocks_start()
	_test_manual_unlock_unlocks_achievement()
	_test_milestones_unlock_at_expected_roll_counts()
	_test_modifier_activation_gated_by_ten_rolls()
	_test_modifier_bonus_applies_after_activation()
	if _failures == 0:
		print("All game logic tests passed.")
	return _failures

func _test_initial_tree_state() -> void:
	var engine = EngineScript.new()
	_assert_true(engine.state.is_unlocked("init"), "init should be unlocked on a fresh state")
	var available_ids: Array[String] = engine.state.get_available_ids()
	_assert_true(available_ids.has("start"), "start should be available at session start")
	_assert_true(available_ids.has("first-unlock"), "first-unlock should be available at session start")

func _test_first_roll_unlocks_start() -> void:
	var engine = EngineScript.new()
	var roll_out: Dictionary = engine.roll_once(42)
	_assert_eq(roll_out["natural_roll"], 42, "forced roll should be used")
	_assert_eq(engine.state.stats["total_rolls"], 1, "total_rolls should increment")
	_assert_true(engine.state.is_unlocked("start"), "start should unlock on first roll")
	var grid: Array = roll_out["grid"]
	_assert_eq(grid.size(), 100, "grid should contain 100 cells")
	var dot_count := 0
	for has_dot in grid:
		if bool(has_dot):
			dot_count += 1
	_assert_eq(dot_count, 42, "grid should contain exactly the rolled number of dots")

func _test_manual_unlock_unlocks_achievement() -> void:
	var engine = EngineScript.new()
	var available_before: Array[String] = engine.state.get_available_ids()
	_assert_true(available_before.has("first-unlock"), "first-unlock should be available before manual unlock")
	_assert_true(not engine.state.is_unlocked("first-unlock"), "first-unlock should start locked")

	var unlocked: bool = engine.state.unlock_manually("first-unlock")
	_assert_true(unlocked, "first-unlock should be manually unlockable at session start")
	_assert_true(engine.state.is_unlocked("first-unlock"), "first-unlock should stay unlocked once acquired")
	var available_after: Array[String] = engine.state.get_available_ids()
	_assert_true(not available_after.has("first-unlock"), "first-unlock should leave available list after unlock")

func _test_milestones_unlock_at_expected_roll_counts() -> void:
	var engine = EngineScript.new()
	for i in range(5): engine.roll_once()
	_assert_true(engine.state.is_unlocked("five-rolls"), "five-rolls should unlock by roll 5")
	for i in range(5): engine.roll_once()
	_assert_true(engine.state.is_unlocked("ten-rolls"), "ten-rolls should unlock by roll 10")
	_assert_eq(engine.state.stats["total_rolls"], 10, "total_rolls should equal number of rolls performed")

func _test_modifier_activation_gated_by_ten_rolls() -> void:
	var engine = EngineScript.new()
	_assert_true(not engine.state.can_use_modifiers(), "modifiers should not be usable before ten-rolls")
	var activated_early: bool = engine.state.set_modifier_active("corners1", true)
	_assert_true(not activated_early, "modifier activation should fail before ten-rolls")
	for i in range(10):
		engine.roll_once(10)
	_assert_true(engine.state.can_use_modifiers(), "modifiers should be usable after ten-rolls")
	var activated_after_unlock: bool = engine.state.set_modifier_active("corners1", true)
	_assert_true(activated_after_unlock, "modifier activation should succeed after ten-rolls")

func _test_modifier_bonus_applies_after_activation() -> void:
	var engine = EngineScript.new()
	for i in range(10):
		engine.roll_once(10)
	engine.state.set_modifier_active("corners1", true)

	# Build a deterministic grid with two corner dots and one non-corner dot.
	var forced_grid: Array = []
	for i in range(100):
		forced_grid.append(false)
	forced_grid[0] = true
	forced_grid[99] = true
	forced_grid[55] = true

	var roll_out: Dictionary = engine.roll_once(3, forced_grid)
	_assert_eq(roll_out["natural_roll"], 3, "natural roll should follow forced value")
	_assert_eq(roll_out["modifier_bonus"], 2, "corners1 should count only corner dots")
	_assert_eq(roll_out["modified_roll"], 5, "modified roll should include modifier bonus")

func _assert_true(condition: bool, message: String) -> void:
	if condition:
		return
	_failures += 1
	push_error("ASSERTION FAILED: %s" % message)

func _assert_eq(actual, expected, message: String) -> void:
	if actual == expected:
		return
	_failures += 1
	push_error("ASSERTION FAILED: %s (actual=%s expected=%s)" % [message, str(actual), str(expected)])
