extends RefCounted

const EngineScript = preload("res://scripts/core/game_engine.gd")

var _failures: int = 0

func run() -> int:
	_failures = 0
	_test_initial_tree_state()
	_test_first_roll_unlocks_start()
	_test_open_achievements_unlocks_branch()
	_test_milestones_unlock_at_expected_roll_counts()
	if _failures == 0:
		print("All game logic tests passed.")
	return _failures

func _test_initial_tree_state() -> void:
	var engine = EngineScript.new()
	_assert_true(engine.state.is_unlocked("init"), "init should be unlocked on a fresh state")
	var available_ids: Array[String] = engine.state.get_available_ids()
	_assert_true(available_ids.has("start"), "start should be available at session start")
	_assert_true(available_ids.has("open-achievements"), "open-achievements should be available at session start")

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

func _test_open_achievements_unlocks_branch() -> void:
	var engine = EngineScript.new()
	engine.roll_once(10)
	var newly_unlocked: Array[String] = engine.state.open_achievements_panel()
	_assert_true(newly_unlocked.has("open-achievements"), "opening the panel should unlock open-achievements")
	_assert_true(engine.state.get_available_ids().has("first-unlock"), "first-unlock should become available after open-achievements")

func _test_milestones_unlock_at_expected_roll_counts() -> void:
	var engine = EngineScript.new()
	for i in range(10):
		engine.roll_once(10)
	_assert_true(engine.state.is_unlocked("five-rolls"), "five-rolls should unlock by roll 5")
	_assert_true(engine.state.is_unlocked("ten-rolls"), "ten-rolls should unlock by roll 10")
	_assert_eq(engine.state.stats["total_rolls"], 10, "total_rolls should equal number of rolls performed")

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
