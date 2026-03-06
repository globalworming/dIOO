extends Control

const EngineScript = preload("res://scripts/core/game_engine.gd")

const CELL_SIZE := Vector2(24, 24)
const CELL_EMPTY_COLOR := Color(0.10, 0.10, 0.10, 1.0)
const CELL_DOT_COLOR := Color(0.94, 0.94, 0.94, 1.0)

@onready var result_label: Label = $VBox/ResultLabel
@onready var hint_label: Label = $VBox/HintLabel
@onready var milestone_label: Label = $VBox/MilestoneLabel
@onready var grid: GridContainer = $VBox/Grid
@onready var roll_button: Button = $VBox/Controls/RollButton
@onready var achievements_button: Button = $VBox/Controls/AchievementsButton
@onready var achievements_panel: PanelContainer = $VBox/AchievementsPanel
@onready var unlocked_list: ItemList = $VBox/AchievementsPanel/PanelVBox/UnlockedList
@onready var available_list: ItemList = $VBox/AchievementsPanel/PanelVBox/AvailableList

var engine
var grid_cells: Array[ColorRect] = []

func _ready() -> void:
	engine = EngineScript.new()
	_build_grid()
	roll_button.pressed.connect(_on_roll_pressed)
	achievements_button.pressed.connect(_on_achievements_pressed)
	_refresh_ui()

func _build_grid() -> void:
	for i in range(100):
		var cell := ColorRect.new()
		cell.custom_minimum_size = CELL_SIZE
		cell.color = CELL_EMPTY_COLOR
		grid.add_child(cell)
		grid_cells.append(cell)

func _on_roll_pressed() -> void:
	var roll_out: Dictionary = engine.roll_once()
	var natural_roll := int(roll_out["natural_roll"])
	var items: Array = roll_out["grid"]
	result_label.text = "Roll: %d" % natural_roll
	_apply_grid(items)
	_refresh_ui()

func _on_achievements_pressed() -> void:
	achievements_panel.visible = not achievements_panel.visible
	if achievements_panel.visible:
		engine.state.open_achievements_panel()
	_refresh_ui()

func _apply_grid(items: Array) -> void:
	for i in range(mini(items.size(), grid_cells.size())):
		grid_cells[i].color = CELL_DOT_COLOR if bool(items[i]) else CELL_EMPTY_COLOR

func _refresh_ui() -> void:
	var state = engine.state
	var total_rolls := int(state.stats["total_rolls"])
	var unlocked_defs: Array[Dictionary] = state.get_unlocked_defs()
	var available_defs: Array[Dictionary] = state.get_available_defs()

	unlocked_list.clear()
	for def in unlocked_defs:
		unlocked_list.add_item("%s: %s" % [def["id"], def["name"]])

	available_list.clear()
	for def in available_defs:
		available_list.add_item("%s: %s" % [def["id"], def["name"]])

	achievements_button.text = "Achievements (%d/%d)" % [unlocked_defs.size(), state.get_total_achievement_count()]
	milestone_label.text = "Milestones: start=%s  five=%s  ten=%s" % [
		"yes" if state.is_unlocked("start") else "no",
		"yes" if state.is_unlocked("five-rolls") else "no",
		"yes" if state.is_unlocked("ten-rolls") else "no"
	]

	if total_rolls == 0:
		hint_label.text = "Press Roll to play."
	elif not state.is_unlocked("open-achievements"):
		hint_label.text = "Open achievements for direction."
	elif not state.is_unlocked("ten-rolls"):
		hint_label.text = "Keep rolling to reach the next milestone."
	else:
		hint_label.text = "Stage Pack 1 baseline reached."
