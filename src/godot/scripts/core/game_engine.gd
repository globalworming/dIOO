class_name DiooGameEngine
extends RefCounted

const GameStateScript = preload("res://scripts/core/game_state.gd")

var state
var rng := RandomNumberGenerator.new()

func _init() -> void:
	state = GameStateScript.new()
	rng.randomize()

func roll_once(forced_roll: int = -1, forced_grid: Array = []) -> Dictionary:
	var natural_roll := forced_roll
	if natural_roll < 1 or natural_roll > 100:
		natural_roll = rng.randi_range(1, 100)
	var newly_unlocked: Array[String] = state.record_roll(natural_roll)
	var grid: Array[bool] = build_grid_for_roll(natural_roll)
	if forced_grid.size() == 100:
		grid = _cast_to_bool_grid(forced_grid)
	var modifier_bonus := _calculate_modifier_bonus(grid)
	var modified_roll := natural_roll + modifier_bonus
	return {
		"natural_roll": natural_roll,
		"modified_roll": modified_roll,
		"modifier_bonus": modifier_bonus,
		"grid": grid,
		"newly_unlocked": newly_unlocked
	}

func build_grid_for_roll(roll: int) -> Array[bool]:
	var dot_count := clampi(roll, 0, 100)
	var items: Array[bool] = []
	items.resize(100)
	for i in range(100):
		items[i] = i < dot_count
	for i in range(items.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var tmp := items[i]
		items[i] = items[j]
		items[j] = tmp
	return items

func _cast_to_bool_grid(untyped_grid: Array) -> Array[bool]:
	var out: Array[bool] = []
	out.resize(100)
	for i in range(100):
		out[i] = bool(untyped_grid[i])
	return out

func _calculate_modifier_bonus(grid: Array[bool]) -> int:
	var modifier: Dictionary = state.get_active_modifier()
	if modifier.is_empty():
		return 0
	var zones: Array = modifier.get("zones", [])
	var bonus := 0
	for idx_untyped in zones:
		var idx := int(idx_untyped)
		if idx >= 0 and idx < grid.size() and grid[idx]:
			bonus += 1
	return bonus
