# ⚔️ Grimoire HUD v4.0 — AD&D 2nd Edition Player Companion

A mobile-first, offline-capable character manager and player HUD for Advanced Dungeons & Dragons 2nd Edition. Features a Diablo-style equipment screen, 485 searchable spells, 28 playable races (PHB + Complete Book of Humanoids), and persistent local storage. Zero dependencies. Free on GitHub Pages.

## ✨ Features

### 28 Playable Races
- **PHB (6):** Human, Elf, Half-Elf, Dwarf, Gnome, Halfling
- **PHBR10 Complete Book of Humanoids (22):** Aarakocra, Alaghi, Beastman, Bugbear, Bullywug, Centaur, Firbolg, Voadkyn, Flind, Fremlin, Gnoll, Goblin, Half-Ogre, Half-Orc, Hobgoblin, Kobold, Lizard Man, Minotaur, Mongrelman, Ogre, Ogre Mage, Orc
- Full ability adjustments, class restrictions, level limits, special abilities per race

### Diablo-Style Equipment Screen
- 11 equipment slots with tap-to-equip workflow
- Race/class/sex-accurate procedural SVG portrait
- Slot swap popup with qualifying inventory items
- Live stat updates (THAC0, AC, HP, Movement) on gear changes
- 6 sub-tabs: Equipment, Consumables, Quest, Materials, Coins, Gems

### Complete Rules Engine
- All 6 ability score tables with every sub-attribute
- Dual-class (Humans) and Multi-class (Demihumans) support
- THAC0, saving throws, spell slots per class and level
- 15 PHB armor types with auto AC calculation
- Tappable ability scores with draggable detail popups

### 485 Searchable Spells
- 310 wizard spells (levels 1-9) + 175 priest spells (levels 1-7)
- Search by name, filter by level
- Spellbook management with memorization tracking
- Spell detail modal with all PHB attributes

### Inventory & Treasure
- Smart item detection (60+ name patterns → correct icon and category)
- 35+ predefined D&D gem types by value tier
- Quick Loot popup for rapid item acquisition
- Encumbrance tracking (weight vs STR allowance)

### Special Abilities Card
- Race-specific: natural AC, size, movement, advantages, disadvantages, languages
- Class-specific: up to 12 class abilities per class
- Level limits for humanoid races

## 🚀 Setup

1. **Fork** this repository
2. **Settings → Pages → Source → main / root → Save**
3. Live at `https://YOUR-USERNAME.github.io/grimoire-hud/`
4. On phone: **Share → Add to Home Screen**

## 📁 Repository Structure

```
grimoire-hud/
├── index.html          ← The entire app (253KB, zero dependencies)
├── 404.html            ← SPA fallback (identical copy)
├── manifest.json       ← PWA manifest (13 icon sizes)
├── sw.js               ← Service Worker v7 (offline caching)
├── favicon.ico         ← Browser tab icon
├── .nojekyll           ← Skip Jekyll processing
├── icons/
│   ├── icon-16.png     ← Favicon
│   ├── icon-32.png
│   ├── icon-48.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-167.png
│   ├── icon-180.png
│   ├── icon-192.png    ← Android home screen
│   ├── icon-384.png
│   ├── icon-512.png    ← Splash screen
│   └── apple-touch-icon.png
├── PROGRESS.md         ← Development history & completed loops
├── NEXT_STEPS.md       ← Roadmap & architecture notes
├── CHANGELOG.md        ← Version history
├── README.md           ← This file
└── LICENSE             ← MIT
```

## 📋 Tabs

| Tab | Content |
|-----|---------|
| **HUD** | HP, Combat, Abilities (tappable), Saves, Special Abilities, Gold & XP, Spell Slots |
| **EQUIP** | Diablo-style equipment slots + portrait + character details + inventory grid |
| **COMBAT** | Effective THAC0, AC breakdown, to-hit table (AC 10 to -10), saving throws, dice roller |
| **SPELLS** | Spell slot tracker, searchable spell browser, spellbook management |
| **JOURNAL** | Adventure chronicle with timestamped entries |

## 📜 Data Sources

- **Player's Handbook** (AD&D 2E) — Abilities, races, classes, equipment, spells
- **PHBR10: Complete Book of Humanoids** — 22 humanoid races with full stat blocks
- All data extracted and structured as canonical JSON in the project knowledge files

## 📄 License

MIT License. See LICENSE file.
AD&D is a trademark of Wizards of the Coast. This is an unofficial fan utility.
