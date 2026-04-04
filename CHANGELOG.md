# Changelog

## v4.0 Build 7 (April 2026)

### Added
- **22 humanoid races** from Complete Book of Humanoids (PHBR10)
- **⚡ Special Abilities card** on HUD showing race + class abilities
- **Slot swap popup** — tap any equipment slot to see REMOVE + qualifying inventory
- **Predefined gem list** — 35+ D&D gems organized by value tier (10gp → 5000gp)
- **Quantity field** for gems, jewels, art objects
- **Quick Loot popup** — ⚡LOOT button on HUD with smart search
- **Draggable mascot** — Grak can be moved anywhere, hidden via "?" toggle
- **Tappable ability scores** — tap any ability for draggable detail popup
- **Combined Gold & XP card** — merged into single HUD widget
- **`detectItemType()` shared function** — 60+ item patterns with proper icons
- **Character details** in EQUIP panel (class, level, XP to next, abilities, race specials)
- **Race/class/sex-accurate portrait** in EQUIP screen (replaces generic silhouette)
- **13 icon sizes** for PWA (16px through 512px + favicon.ico + apple-touch-icon)

### Changed
- STATS tab removed (content merged into HUD + EQUIP)
- GEAR tab removed (content merged into EQUIP sub-tabs)
- Tab order: HUD → EQUIP → COMBAT → SPELLS → JOURNAL
- Armor icons: 🦺 light, ⛓️ medium, 🔩 heavy (no longer all 🛡️)
- Items auto-categorized: candles/torches → Consumables, rope/tools → Materials
- AC auto-syncs when equipping/unequipping armor via EQUIP screen

### Fixed
- AC reversed by DEX (was subtracting negative adjustment)
- STR hit/damage bonuses not applied to combat
- Hit table stopped at AC 0 (now extends to AC -10)
- Abilities didn't refresh on attribute edit
- Armor showed shield icon for all body armor types
- Non-equipment items (candle, torch, rope) appeared in Equipment tab
- Mascot blocked interactive elements
- Autocomplete dropdown clipped by overflow container

## v3.0 (March 2026)
- Initial release with character creator, HUD, combat, spells, gear
- 485 spells, procedural portraits, animated dice roller
- PWA with offline support via service worker
