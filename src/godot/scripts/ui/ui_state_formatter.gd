class_name UiStateFormatter
extends RefCounted

static func format_achievement_lines(defs: Array[Dictionary]) -> Array[String]:
	var lines: Array[String] = []
	for def in defs:
		lines.append("%s: %s" % [def["id"], def["name"]])
	if lines.is_empty():
		lines.append("(none)")
	return lines

static func build_hint_text(total_rolls: int, ten_rolls_unlocked: bool) -> String:
	if total_rolls == 0:
		return "Press Roll to play."
	if not ten_rolls_unlocked:
		return "Keep rolling to reach the next milestone."
	return "Stage Pack 1 baseline reached."
