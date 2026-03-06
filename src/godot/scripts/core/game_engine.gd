class_name DiooGameEngine
extends RefCounted

const GameStateScript = preload("res://scripts/core/game_state.gd")

var state
var rng := RandomNumberGenerator.new()

func _init() -> void:
	state = GameStateScript.new()
	rng.randomize()

func roll_once(forced_roll: int = -1) -> Dictionary:
	var natural_roll := forced_roll
	if natural_roll < 1 or natural_roll > 100:
		natural_roll = rng.randi_range(1, 100)
	var newly_unlocked: Array[String] = state.record_roll(natural_roll)
	return {
		"natural_roll": natural_roll,
		"grid": build_grid_for_roll(natural_roll),
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
