class_name AchievementData
extends RefCounted

const START_ID := "init"

const ACHIEVEMENTS: Array[Dictionary] = [
	{
		"id": "init",
		"name": "Participation Trophy",
		"description": "Session initialized.",
		"next": ["start", "open-achievements"],
		"manual_cost": {}
	},
	{
		"id": "open-achievements",
		"name": "There is potential in this one",
		"description": "Open the achievements panel.",
		"next": ["first-unlock"],
		"manual_cost": {}
	},
	{
		"id": "first-unlock",
		"name": "Ugh, you gave it free will?",
		"description": "Manual unlock branch starter.",
		"next": [],
		"manual_cost": {}
	},
	{
		"id": "start",
		"name": "First Roll",
		"description": "Roll the dice once.",
		"next": ["five-rolls"],
		"manual_cost": {}
	},
	{
		"id": "five-rolls",
		"name": "That's how they get you",
		"description": "Roll five times.",
		"next": ["ten-rolls"],
		"manual_cost": {}
	},
	{
		"id": "ten-rolls",
		"name": "Getting Started",
		"description": "Roll ten times.",
		"next": [],
		"manual_cost": {}
	}
]

static func build_map() -> Dictionary:
	var defs: Dictionary = {}
	for def in ACHIEVEMENTS:
		defs[def["id"]] = def
	return defs

static func is_auto_unlockable(id: String, stats: Dictionary, context: Dictionary = {}) -> bool:
	match id:
		"init":
			return true
		"start":
			return int(stats.get("total_rolls", 0)) >= 1
		"five-rolls":
			return int(stats.get("total_rolls", 0)) >= 5
		"ten-rolls":
			return int(stats.get("total_rolls", 0)) >= 10
		_:
			return false
