extends Node

const TestSuiteScript = preload("res://tests/test_game_logic.gd")

func _ready() -> void:
	var suite = TestSuiteScript.new()
	var failures: int = suite.run()
	if failures == 0:
		print("TEST_RESULT:PASS")
		get_tree().quit(0)
		return
	print("TEST_RESULT:FAIL failures=%d" % failures)
	get_tree().quit(1)
