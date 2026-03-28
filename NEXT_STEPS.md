# GRIMOIRE HUD — Next Steps

## Immediate Next Phase: Phase 4 — Spell Database & Advanced Features

### Priority 1: Spell Database
- [ ] Build complete PHB wizard spell database (levels 1-9, all schools)
- [ ] Build complete PHB priest spell database (levels 1-7, all spheres)
- [ ] Spell detail view with all attributes (casting time, range, duration, AoE, save, description)
- [ ] Spellbook manager (add/remove spells, learn spell check vs INT)
- [ ] Memorization workflow (pick from spellbook → fill slots)
- [ ] Specialist wizard school restrictions

### Priority 2: Enhanced Widgets
- [ ] Drag-to-reorder widgets (CSS Grid + touch events)
- [ ] Widget size toggle (S/M/L) with long-press
- [ ] iOS-style jiggle mode for layout editing
- [ ] Widget state persistence (which widgets visible, sizes, positions)
- [ ] Movement/Encumbrance widget (auto-calc based on inventory weight)
- [ ] Proficiency widget (weapon + non-weapon profs)

### Priority 3: PWA & GitHub Pages
- [ ] Service Worker for offline caching
- [ ] manifest.json for home screen install
- [ ] Split into multi-file structure for GitHub Pages
- [ ] Add app icons (multiple sizes)
- [ ] Lighthouse audit → optimize to 90+

### Priority 4: Polish
- [ ] Grak tutorial flow (step-by-step first character walkthrough)
- [ ] Page transition animations
- [ ] Subtle sound effects (optional toggle)
- [ ] Character portrait upload (camera/file → base64)
- [ ] Campaign grouping on dashboard
- [ ] Action history log (all changes tracked with undo)
- [ ] PDF export of character sheet

## Context for Next Developer
- App is a single HTML file with inline CSS/JS — no build step needed
- IndexedDB stores everything in 'characters' store (key: id)
- Engine object contains all 2E lookup tables and calculation functions
- Hash routing: #/ = dashboard, #/character/:id = HUD, #/create = creator
- All coin types tracked separately (cp/sp/ep/gp/pp), displayed as GP equivalent
- Spell slots tracked via `spellSlotsUsed` object on character {level: usedCount}
- Mascot tips are in Mascot.tips array, cycle on each toggle
