class_name ModifierData
extends RefCounted

static var _modifiers_cache: Dictionary = {}

static func has_modifier(id: String) -> bool:
	_ensure_cache()
	return _modifiers_cache.has(id)

static func get_modifier(id: String) -> Dictionary:
	_ensure_cache()
	if not _modifiers_cache.has(id):
		return {}
	return _modifiers_cache[id]

static func _ensure_cache() -> void:
	if not _modifiers_cache.is_empty():
		return
	_modifiers_cache = {
		"corners1": {
			"id": "corners1",
			"name": "Corners I",
			"zones": _create_corners1_zones()
		}

	}

static func _create_corners1_zones() -> Array[int]:
	var zones: Array[int] = []
	for i in range(10):
		for j in range(10):
			if i < 2 and j < 2:
				zones.append(i * 10 + j)
			if i < 2 and j >= 8:
				zones.append(i * 10 + j)
			if i >= 8 and j < 2:
				zones.append(i * 10 + j)
			if i >= 8 and j >= 8:
				zones.append(i * 10 + j)
	return zones
