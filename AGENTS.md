# Repository Guidelines

## Project
- App source lives in `src/` and are currently migrated to `src/godot` with focus on `spec.md` adherence and test driven development
- static data like achievements names, unlock order, patterns and colors can be used as is. data structure is allowed to change
- godot mcp is available

## TODO 

### now

-  [ ] the generic dictionary achievements are hard to maintain. plan two likely but different implementation paths

### next

- [ ] only some achievements can be unlocked manually, currently all show a "unlock"
- [ ] where we have classes (e.g. engine state) we need to put proper types on the variables


### later

- [ ] let automated run check "clicks till achievement" and "rolls till achievement" 
- [ ] display "rolls till achievement" that for each achievement unlockable
- polish
