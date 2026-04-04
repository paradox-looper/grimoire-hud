# Grimoire HUD — Development Progress

## Version: 4.0 (Build 7)
**Date:** April 2026  
**Status:** Feature-complete through RALPH Loop 4.5+  
**File:** `index.html` (253KB, 2402 lines, zero dependencies)

---

## Completed Loops

### Loop 4.1 — Critical Bug Fixes ✅
- [x] **B1:** AC formula fixed (`base + dex_adj`, not `base - dex_adj`)
- [x] **B2:** STR hit/damage bonuses wired into combat tab and to-hit table
- [x] **B3:** Hit table extended from AC 0 to AC -10 (21 columns)
- [x] **B4:** Ability scores refresh on character save; auto-level from XP

### Loop 4.2 — PHB Data Library Integration ✅
- [x] 15 armor types + 4 shields inlined from `armor.json`
- [x] Race→class filtering from `races.json` (Dwarf can't pick Mage, etc.)
- [x] Racial ability adjustments displayed in creator
- [x] Armor/shield dropdowns with class restrictions
- [x] WIS table (magical defense, bonus spells, spell failure)
- [x] CHR table (max henchmen, loyalty, reaction)
- [x] `getArmorAC()` — AC computed from equipped armor + shield + DEX + magic

### Loop 4.3 — Dual-Class & Multi-Class ✅
- [x] Dual-class engine for Humans (prime req 15+/17+, unlock logic)
- [x] Multi-class engine for Demihumans (valid combos per race, XP split)
- [x] `multiThac0()`, `multiSaves()`, `multiSlots()` — best-of calculations
- [x] `dualThac0()`, `dualSaves()` — new-vs-old class resolution
- [x] `classLabel()` utility — displays "Fighter/Mage (5/4)" or "Fighter 5 → Mage 3"

### Loop 4.4 — Treasure System & Bug Reporting ✅
- [x] Gems, Jewels, Art Objects with name/value/qty
- [x] 35+ predefined D&D gem types organized by value tier
- [x] Total treasure value banner (coins + gems + jewels + art)
- [x] In-app bug report form with auto-context and clipboard copy
- [x] Version bumped to v4.0 in settings

### Loop 4.5 — Spell Database ✅
- [x] 310 wizard spells (levels 1-9) inlined as compact arrays
- [x] 175 priest spells (levels 1-7) inlined as compact arrays
- [x] Searchable browser with name search + level filter
- [x] Spell detail modal with all PHB attributes
- [x] Spellbook management (add/remove spells for wizards)
- [x] Auto-detect wizard vs priest based on character class

### Loop 4.5+ — Diablo-Style Equipment Screen ✅
- [x] 11 equipment slots in two columns flanking character portrait
- [x] Tap-to-select → tap-to-move state machine
- [x] Slot validation (items only equip to matching slots)
- [x] Auto-swap on occupied slots
- [x] Slot tap popup with REMOVE + qualifying inventory items for quick swap
- [x] Race/class/sex-accurate procedural SVG portrait (not generic silhouette)
- [x] Equipped item icon overlays on portrait (weapon, shield, helm)
- [x] Live stats bar (THAC0, AC, HP, MV) updating on gear changes
- [x] AC auto-syncs with PHB_ARMOR when chest/shield equipped
- [x] 6 inventory sub-tabs: Equipment, Consumables, Quest, Materials, Coins, Gems
- [x] "+" add button per sub-tab with smart equipment search
- [x] Character details panel (class, level, XP to next, abilities, race specials)

### Loop 4.6 — Complete Book of Humanoids Integration ✅
- [x] 22 humanoid races from PHBR10 added (28 total playable races)
- [x] Full ability adjustments, class restrictions, level limits per race
- [x] `RACE_SPECIALS` — natural AC, size, movement, advantages, disadvantages, languages
- [x] `CLASS_SPECIALS` — all 9 class ability lists from PHB
- [x] New ⚡ Special Abilities HUD card showing race + class abilities
- [x] EQUIP details panel shows race specials summary

### UX Polish ✅
- [x] Tappable ability scores → draggable detail popup (all 6 abilities)
- [x] Auto-close popups on new open or tab switch
- [x] Combined Gold & XP card with ⚡ Quick Loot button
- [x] Quick Loot popup with smart search (100+ PHB items)
- [x] Mascot (Grak) — starts hidden, "?" toggle button, click-draggable
- [x] `detectItemType()` — shared function for 60+ item name patterns
- [x] Proper icons per item type (🕯️ candle, 🔥 torch, 🏮 lantern, etc.)
- [x] Auto-fix stale icons on existing inventory items
- [x] STATS and GEAR tabs removed (content merged into HUD and EQUIP)

---

## Technical Stats

| Metric | Value |
|--------|-------|
| Total file size | 253 KB |
| Total lines | 2,402 |
| JS braces | 1,506/1,506 (balanced) |
| Dependencies | 0 (vanilla JS) |
| Playable races | 28 (6 PHB + 22 PHBR10) |
| Spells | 485 (310 wizard + 175 priest) |
| Equipment items | 100+ in autocomplete |
| Gem presets | 35+ by value tier |
| Ability tables | All 6 with full sub-attributes |
| Armor types | 15 + 4 shields |
| Icon sizes | 13 (16px through 512px) |
| Storage | Dual-write IndexedDB + localStorage |

## Data Sources

| Source | Files Used | Content |
|--------|-----------|---------|
| PHB Ch 1-6 | `abilities.json`, `races.json`, `classes.json`, `armor.json`, `weapons.json`, `gear.json`, `alignments.json` | Core rules engine |
| PHB Ch 7+ | `wizard_spells.json`, `priest_spells.json`, `spell_schools.json`, `spell_spheres.json` | Spell database |
| PHBR10 | `humanoid_races.json`, `humanoid_kits.json`, `humanoid_proficiencies.json`, `humanoid_weapons.json`, `humanoid_traits.json` | 22 humanoid races |
