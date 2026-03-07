class_name DiooGameState
extends RefCounted

const AchievementDataScript = preload("res://scripts/core/achievement_data.gd")
const ModifierDataScript = preload("res://scripts/core/modifier_data.gd")

var achievements_by_id: Dictionary = {}
var unlocked_ids: Dictionary = {}
var unlock_order: Array[String] = []

var stats := {
	"total_rolls": 0,
	"total_sum": 0,
	"highest_roll": 0
}

var last_roll: int = 0
var active_modifier_id: String = ""
var modifier_active: bool = false

func _init() -> void:
	achievements_by_id = AchievementDataScript.build_map()
	_unlock_internal(AchievementDataScript.START_ID)

func record_roll(natural_roll: int) -> Array[String]:
	last_roll = natural_roll
	stats["total_rolls"] = int(stats["total_rolls"]) + 1
	stats["total_sum"] = int(stats["total_sum"]) + natural_roll
	stats["highest_roll"] = maxi(int(stats["highest_roll"]), natural_roll)
	return _check_auto_unlocks({"natural_roll": natural_roll})

func unlock_manually(id: String) -> bool:
	if is_unlocked(id):
		return false
	if not get_available_ids().has(id):
		return false
	return _unlock_internal(id)

func can_use_modifiers() -> bool:
	return is_unlocked("ten-rolls")

func get_available_modifier_ids() -> Array[String]:
	if not can_use_modifiers():
		return []
	return ["corners1"]

func set_modifier_active(modifier_id: String, active: bool) -> bool:
	if not can_use_modifiers():
		return false
	if not get_available_modifier_ids().has(modifier_id):
		return false
	active_modifier_id = modifier_id
	modifier_active = active
	return true

func get_active_modifier() -> Dictionary:
	if not modifier_active:
		return {}
	if active_modifier_id == "":
		return {}
	if not ModifierDataScript.has_modifier(active_modifier_id):
		return {}
	return ModifierDataScript.get_modifier(active_modifier_id)

func is_unlocked(id: String) -> bool:
	return unlocked_ids.has(id)

func get_available_ids() -> Array[String]:
	var available: Array[String] = []
	var visited: Dictionary = {}
	_walk_available(AchievementDataScript.START_ID, visited, available)
	return available

func get_unlocked_defs() -> Array[Dictionary]:
	var reachable: Array[String] = []
	var visited: Dictionary = {}
	_walk_unlocked(AchievementDataScript.START_ID, visited, reachable)
	var out: Array[Dictionary] = []
	for id in unlock_order:
		if reachable.has(id):
			out.append(achievements_by_id[id])
	return out

func get_available_defs() -> Array[Dictionary]:
	var out: Array[Dictionary] = []
	for id in get_available_ids():
		out.append(achievements_by_id[id])
	return out

func get_total_achievement_count() -> int:
	return achievements_by_id.size()

func _check_auto_unlocks(context: Dictionary) -> Array[String]:
	var newly_unlocked: Array[String] = []
	var progressed := true
	while progressed:
		progressed = false
		for id in get_available_ids():
			if AchievementDataScript.is_auto_unlockable(id, stats, context):
				if _unlock_internal(id):
					newly_unlocked.append(id)
					progressed = true
	return newly_unlocked

func _unlock_internal(id: String) -> bool:
	if not achievements_by_id.has(id):
		return false
	if unlocked_ids.has(id):
		return false
	unlocked_ids[id] = true
	unlock_order.append(id)
	return true

func _walk_available(id: String, visited: Dictionary, available: Array[String]) -> void:
	if visited.has(id):
		return
	visited[id] = true
	if not unlocked_ids.has(id):
		return
	var def: Dictionary = achievements_by_id[id]
	var next_ids: Array = def.get("next", [])
	for next_id_untyped in next_ids:
		var next_id := String(next_id_untyped)
		if unlocked_ids.has(next_id):
			_walk_available(next_id, visited, available)
		elif not available.has(next_id):
			available.append(next_id)

func _walk_unlocked(id: String, visited: Dictionary, unlocked_reachable: Array[String]) -> void:
	if visited.has(id):
		return
	visited[id] = true
	if not unlocked_ids.has(id):
		return
	unlocked_reachable.append(id)
	var def: Dictionary = achievements_by_id[id]
	var next_ids: Array = def.get("next", [])
	for next_id_untyped in next_ids:
		var next_id := String(next_id_untyped)
		_walk_unlocked(next_id, visited, unlocked_reachable)
