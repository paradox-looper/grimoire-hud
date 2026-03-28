# ⚔️ Grimoire HUD — AD&D 2nd Edition Player Companion

A mobile-first, offline-capable character manager and player HUD for Advanced Dungeons & Dragons 2nd Edition. Built as a single-page PWA with zero dependencies, hosted free on GitHub Pages.

## ✨ Features

**Full 2E Rules Engine** — All six ability score tables (STR with exceptional strength, DEX, CON, INT, WIS, CHR), THAC0 by class/level, saving throws for all class groups, XP tables for all 9 classes, and spell slot tables for wizards, priests, paladins, rangers, and bards.

**Widget Dashboard** — iOS-style widget grid with HP tracker, combat stats, ability scores, saving throws, XP with auto-level-up, gold per coin type, and spell slot management. Touch-optimized +/- controls for everything.

**Procedural Portraits** — Every character gets a unique SVG bust portrait generated from their race, class, and sex with proper armor, weapons, headgear, racial features, and facial details.

**Auto-Generated Appearance** — Prose character descriptions generated from stats, race, class, level, and physical characteristics. "A seasoned shadow-walker whose eyes constantly assess every room for exits..."

**Equipment Autocomplete** — 100+ items from the PHB equipment lists with weight and GP cost, searchable as you type.

**Adventure Journal** — Timestamped entries to chronicle your character's deeds.

**Tutorial Mascot** — "Grak the Adequate," a cartoony orc wizard who offers context-aware tips based on what you're doing, plus rotating D&D puns.

**Animated Dice Roller** — Full-screen overlay with correct polyhedra shapes (d4 triangle through d100 double-d10), spinning animation, sparks, and bouncing results.

**Bulletproof Storage** — Dual-write to both IndexedDB and localStorage on every save. If either fails, the other catches it. JSON export/import for backups.

## 🚀 Quick Start

### Use It Right Now
Visit: `https://YOUR-USERNAME.github.io/grimoire-hud/`

### Install on Your Phone
1. Open the link in Safari (iOS) or Chrome (Android)
2. Tap **Share → Add to Home Screen**
3. It installs as a standalone app with offline support

### Host Your Own Copy
1. **Fork** this repository
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**
6. Your site will be live at `https://YOUR-USERNAME.github.io/grimoire-hud/` within minutes

## 📁 Repository Structure

```
grimoire-hud/
├── index.html          ← The entire app (single file, zero dependencies)
├── 404.html            ← Copy of index.html (GitHub Pages SPA fallback)
├── manifest.json       ← PWA manifest for home screen install
├── sw.js               ← Service Worker for offline caching
├── icons/
│   ├── icon-192.png    ← PWA icon (192×192)
│   └── icon-512.png    ← PWA icon (512×512)
├── PROGRESS.md         ← Development progress tracker
├── NEXT_STEPS.md       ← Roadmap for future development
└── README.md           ← This file
```

## 🎮 How to Use

1. **Create a Character** — Tap "Forge New Character", fill in name/race/class/sex, roll abilities with 4d6-drop-lowest, set HP and level
2. **Use the HUD** — Tap +/- buttons to track HP, XP, and gold during play
3. **Manage Spells** — Tap spell slot dots to mark as cast, use Long Rest to restore all
4. **Track Inventory** — Start typing an item name to search the equipment database
5. **Write Your Chronicle** — Use the Journal tab to record session events
6. **Roll Dice** — Use the Combat tab's dice buttons for animated rolls
7. **Ask Grak** — Tap the orc wizard in the bottom-right for context-aware tips

## 🔧 Technical Details

- **Zero frameworks** — Vanilla JavaScript, CSS, and HTML
- **Zero build step** — Just open `index.html`
- **~90KB total** — Loads instantly on any connection
- **Hash routing** — Works perfectly on GitHub Pages without server config
- **Offline-first** — Service Worker caches all assets
- **PWA installable** — Add to home screen on iOS/Android
- **Dual-write storage** — IndexedDB primary + localStorage fallback

## 📊 AD&D 2E Rules Coverage

| System | Status |
|--------|--------|
| Ability Score Tables (all 6) | ✅ Complete |
| Exceptional Strength (18/01-18/00) | ✅ Complete |
| THAC0 (all class groups, levels 1-20+) | ✅ Complete |
| Saving Throws (all categories & class groups) | ✅ Complete |
| XP Tables (all 9 classes) | ✅ Complete |
| Spell Slots (Wizard, Priest, Paladin, Ranger, Bard) | ✅ Complete |
| Equipment Database (100+ items) | ✅ Complete |
| Encumbrance Tracking | ✅ Complete |
| Race/Class Restrictions | 🔲 Planned |
| Full Spell Database | 🔲 Planned |
| Proficiency System | 🔲 Planned |

## 📜 Credits

- **Portraits**: Procedurally generated SVG (original work)
- **Game Icons**: [game-icons.net](https://game-icons.net) (CC BY 3.0) by Lorc, Delapouite, and contributors
- **Fonts**: [Google Fonts](https://fonts.google.com/) — Cinzel, MedievalSharp, Crimson Text, Press Start 2P
- **AD&D 2nd Edition**: Trademark of Wizards of the Coast. This is an unofficial fan-made utility.

## 📄 License

This project is released under the [MIT License](LICENSE). The AD&D rules system is the intellectual property of Wizards of the Coast. This tool is a non-commercial fan utility and does not reproduce copyrighted text.
