# Grimoire HUD — Next Steps & Roadmap

## Priority 1 — Polish & Bug Fixes
- [ ] **Proficiency system** — Weapon + non-weapon proficiency tracking using `nonweapon_proficiencies.json` and PHBR10 expanded proficiencies
- [ ] **Thief skill percentages** — Pick pockets, open locks, find/remove traps, move silently, hide in shadows, detect noise, climb walls, read languages
- [ ] **Attacks per round** — Warriors get 3/2 at 7th, 2/1 at 13th (data exists in `classes.json`)
- [ ] **Race ability requirement enforcement** — Block character creation if ability scores don't meet race minimums
- [ ] **Demihuman level limits** — Enforce max class levels from `races.json` and `humanoid_races.json`
- [ ] **Humanoid race portraits** — Extend `Portraits.getSvg()` with distinct visual features for Bugbear, Goblin, Orc, Minotaur, Lizard Man, etc.
- [ ] **Natural AC integration** — Humanoid races with natural AC < 10 (Lizard Man AC 5, Centaur AC 5, etc.) should use natural AC as base instead of equipped armor if better

## Priority 2 — New Features
- [ ] **Encounter tracker** — Initiative order, monster HP tracking, round counter
- [ ] **Party management** — Group characters by campaign, shared gold pool, marching order
- [ ] **PDF character sheet export** — Generate printable AD&D 2E character sheet from app data
- [ ] **Humanoid kits** — Integrate Scavenger, Tramp, Tunnel Rat, Shadow, Humanoid Bard from `humanoid_kits.json`
- [ ] **Humanoid weapons** — 22 special weapons (Flindbar, Katana, Tetsubo, etc.) from `humanoid_weapons.json`
- [ ] **Humanoid proficiencies** — 22 new proficiencies (Close-quarter fighting, Danger sense, Wild fighting, etc.)
- [ ] **Superstition system** — 40 superstitions from `humanoid_superstitions.json`
- [ ] **Drag-to-reorder widgets** — iOS jiggle mode for HUD card arrangement
- [ ] **Sound effects** — Optional toggle for dice rolls, equip sounds, level-up fanfare

## Priority 3 — Data Expansion
- [ ] **DMG integration** — Magic items, treasure tables, encounter tables
- [ ] **Monstrous Manual** — Monster stat blocks for encounter tracking
- [ ] **Combat tables** — Initiative modifiers, weapon vs armor type, turning undead
- [ ] **Movement & encumbrance** — Full encumbrance categories from `movement.json`
- [ ] **Aging effects** — Age-based ability modifications from `races.json`

## Priority 4 — Infrastructure
- [ ] **Offline spell detail** — Currently spells show 60-char preview; consider lazy-loading full descriptions
- [ ] **Character sharing** — QR code or link-based character export for party members
- [ ] **Multiple save slots** — Version history per character
- [ ] **Theme customization** — Light mode, high contrast, custom accent colors
- [ ] **Accessibility** — Screen reader labels, keyboard navigation, focus management
- [ ] **Localization** — i18n framework for non-English tables

## Architecture Notes

### Current Tab Structure
```
HUD → EQUIP → COMBAT → SPELLS → JOURNAL
```

### Data Flow
```
Character (IndexedDB + localStorage)
  ├── Abilities → E.gS/gD/gC/gI/gW/gCh lookup tables
  ├── Race → RACE_CLASSES filter, RACE_ADJ adjustments, RACE_SPECIALS card
  ├── Class → E.thac0/saves/slots/xpNxt, CLASS_SPECIALS card
  ├── Equipment → detectItemType(), getArmorAC(), equippedGear{}
  ├── Spells → WIZ_SP/PRI_SP arrays, spellbook[], spellSlotsUsed{}
  └── Treasure → gold{}, gems[], jewels[], art[]
```

### Key Functions
| Function | Purpose |
|----------|---------|
| `detectItemType(name)` | Categorize any item by name → cat/icon/eqSlot |
| `getArmorAC(armor, shield, dex, magic)` | Compute AC from PHB armor data |
| `showAbilityPopup(ab, score, pct)` | Draggable ability detail popup |
| `_showSlotPopup(char, slot)` | Equipment swap popup with qualifying items |
| `classLabel(char)` | Display label for single/dual/multi-class |
| `closeAllPopups()` | Global popup cleanup |
| `_makeDraggable(el, handle)` | Touch+mouse drag system |

### RALPH Loop Methodology
Research → Architect → Loop → Polish → Handoff
Each loop is scoped, validated with automated checks (brace balance, feature verification), and delivered as a checkpoint for user review before proceeding.
