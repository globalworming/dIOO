extends Control

const EngineScript = preload("res://scripts/core/game_engine.gd")
const AchievementDataScript = preload("res://scripts/core/achievement_data.gd")
const UiFormatterScript = preload("res://scripts/ui/ui_state_formatter.gd")

const CELL_SIZE := Vector2(24, 24)
const CELL_EMPTY_COLOR := Color(0.10, 0.10, 0.10, 1.0)
const CELL_DOT_COLOR := Color(0.94, 0.94, 0.94, 1.0)

@onready var main_split: HBoxContainer = $MainSplit
@onready var game_panel: VBoxContainer = $MainSplit/GamePanel
@onready var result_label: Label = $MainSplit/GamePanel/ResultLabel
@onready var modified_label: Label = $MainSplit/GamePanel/ModifiedLabel
@onready var hint_label: Label = $MainSplit/GamePanel/HintLabel
@onready var milestone_label: Label = $MainSplit/GamePanel/MilestoneLabel
@onready var grid: GridContainer = $MainSplit/GamePanel/Grid
@onready var roll_button: Button = $MainSplit/GamePanel/Controls/RollButton
@onready var modifier_controls: HBoxContainer = $MainSplit/GamePanel/ModifierControls
@onready var modifier_toggle_button: Button = $MainSplit/GamePanel/ModifierControls/ModifierToggleButton
@onready var achievements_panel: PanelContainer = $MainSplit/AchievementsPanel
@onready var panel_vbox: VBoxContainer = $MainSplit/AchievementsPanel/PanelVBox
@onready var unlocked_list: Label = $MainSplit/AchievementsPanel/PanelVBox/UnlockedList
@onready var available_list: VBoxContainer = $MainSplit/AchievementsPanel/PanelVBox/AvailableList

var engine: DiooGameEngine
var grid_cells: Array[ColorRect] = []

func _ready() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	main_split.set_anchors_preset(Control.PRESET_FULL_RECT)
	main_split.offset_left = 24.0
	main_split.offset_top = 24.0
	main_split.offset_right = -24.0
	main_split.offset_bottom = -24.0
	game_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	achievements_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	unlocked_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	available_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_update_split_layout()
	engine = EngineScript.new()
	_build_grid()
	roll_button.pressed.connect(_on_roll_pressed)
	modifier_toggle_button.pressed.connect(_on_modifier_toggle_pressed)
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
	var modified_roll := int(roll_out["modified_roll"])
	var modifier_bonus := int(roll_out["modifier_bonus"])
	var items: Array = roll_out["grid"]
	result_label.text = "Roll: %d" % natural_roll
	modified_label.text = "Modified: %d (+%d)" % [modified_roll, modifier_bonus]
	_apply_grid(items)
	_refresh_ui()

func _on_modifier_toggle_pressed() -> void:
	var next_active: bool = not engine.state.modifier_active
	engine.state.set_modifier_active("corners1", next_active)
	_refresh_ui()

func _apply_grid(items: Array) -> void:
	for i in range(mini(items.size(), grid_cells.size())):
		grid_cells[i].color = CELL_DOT_COLOR if bool(items[i]) else CELL_EMPTY_COLOR

func _update_split_layout() -> void:
	var viewport_width: float = get_viewport_rect().size.x
	var target_right_width := clampf(viewport_width * 0.48, 700.0, 980.0)
	achievements_panel.custom_minimum_size.x = target_right_width
	game_panel.size_flags_stretch_ratio = 1.0
	achievements_panel.size_flags_stretch_ratio = 1.0

func _refresh_ui() -> void:
	var state = engine.state
	var total_rolls := int(state.stats["total_rolls"])
	var unlocked_defs: Array[Dictionary] = state.get_unlocked_defs()
	var available_defs: Array[Dictionary] = state.get_available_defs()

	var unlocked_lines: Array[String] = UiFormatterScript.format_achievement_lines(unlocked_defs)
	unlocked_list.text = "\n".join(unlocked_lines)
	_rebuild_available_rows(available_defs)

	modifier_controls.visible = state.can_use_modifiers()
	modifier_toggle_button.text = "Corners I: %s" % ("ON" if state.modifier_active else "OFF")
	milestone_label.text = "Milestones: start=%s  five=%s  ten=%s" % [
		"yes" if state.is_unlocked("start") else "no",
		"yes" if state.is_unlocked("five-rolls") else "no",
		"yes" if state.is_unlocked("ten-rolls") else "no"
	]
	hint_label.text = UiFormatterScript.build_hint_text(
		total_rolls,
		state.is_unlocked("ten-rolls")
	)

func _rebuild_available_rows(available_defs: Array[Dictionary]) -> void:
	for child in available_list.get_children():
		available_list.remove_child(child)
		child.queue_free()

	if available_defs.is_empty():
		var placeholder := Label.new()
		placeholder.text = "(none)"
		available_list.add_child(placeholder)
		return

	for def in available_defs:
		var achievement_id := String(def["id"])
		var row := HBoxContainer.new()
		row.size_flags_horizontal = Control.SIZE_EXPAND_FILL

		var entry_label := Label.new()
		entry_label.text = "%s: %s" % [achievement_id, String(def["name"])]
		entry_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		entry_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		row.add_child(entry_label)

		if _is_manual_unlockable(achievement_id):
			var unlock_button := Button.new()
			unlock_button.text = "Unlock"
			unlock_button.pressed.connect(_on_manual_unlock_pressed.bind(achievement_id))
			row.add_child(unlock_button)

		available_list.add_child(row)

func _is_manual_unlockable(achievement_id: String) -> bool:
	return not AchievementDataScript.is_auto_unlockable(achievement_id, engine.state.stats, {})

func _on_manual_unlock_pressed(achievement_id: String) -> void:
	engine.state.unlock_manually(achievement_id)
	_refresh_ui()
