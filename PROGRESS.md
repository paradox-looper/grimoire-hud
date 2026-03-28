# GRIMOIRE HUD v3.0 — Progress Tracker

## v3.0 Changes (This Sprint)

### 1. Completely Rewritten Portrait System
The old portraits were blocky blobs with minimal detail. The new system renders **detailed bust portraits** with:
- **Proper body silhouettes** — shoulders with class-appropriate armor (plate for warriors, robes for wizards, vestments for priests, leather for rogues)
- **Class-specific armor details** — Paladin golden cross on breastplate, Ranger green cloak draped over shoulder, Druid leaf-green garments
- **Weapons per class** — Fighter sword with crossguard, Paladin holy blade with golden pommel, Ranger bow with string, Mage staff with glowing orb, Cleric flanged mace, Druid gnarled staff with leaf, Thief dagger, Bard lute
- **Headgear** — Fighter helm with crest, Paladin crown-helm, Ranger feathered cap, Wizard pointed hat with star gem, Cleric mitre with holy cross, Druid antler circlet with nature gem, Thief dark hood, Bard jaunty feathered beret
- **Racial ears** — Elf/Half-Elf pointed ears at correct angles, Gnome large rounded ears, Dwarf/Halfling subtle human ears, all proportioned
- **Facial hair** — Dwarf males get thick braided beards, Gnome males get goatees, randomized stubble for other male characters
- **Female features** — flowing hair locks, eyelashes, softer jaw, slightly larger eyes
- **Eye detail** — white sclera, race-tinted iris (green for elves, brown for dwarves, blue for gnomes), highlight dots
- **Size scaling** — Halflings/Gnomes rendered 85% with translate offset, Dwarves at 90%

### 2. Context-Aware Mascot with Puns
Grak the Adequate now tracks what the user last interacted with:
- **HP buttons** → shows HP management tips
- **XP buttons** → shows XP/leveling tips  
- **Gold buttons** → shows encumbrance/coin weight tips
- **Spell slots** → shows memorization/rest tips
- **Dice roller** → shows THAC0/combat roll tips
- **Inventory** → shows gear/encumbrance tips
- **Journal** → shows journaling tips
- **Tab switches** → sets context (Stats→abilities, Combat→combat, etc.)
- **Character creator** → shows creation tips

Each tip popup now includes a **random D&D pun/joke** before the crossed-out bad advice and good tip:
- "Why did the fighter break up with the wizard? There was no chemistry — only THAC0!"
- "What's a bard's favorite chord? A-minor… damage."
- "A skeleton walks into a tavern and orders a drink and a mop."
- 15 total jokes that cycle on each toggle

### 3. Auto-Generated Appearance Description
New `Appearance.generate()` system creates prose descriptions from character data:
- **STR/CON** → build description (powerfully muscled, athletic, lean, frail)
- **Height/Race** → stature (tall and graceful for elves, barely three feet for halflings)
- **Race** → facial features (high cheekbones and pointed ears for elves, braided beard for dwarves, hairy feet for halflings)
- **CHR** → attractiveness (strikingly beautiful, plain-featured, unsettling countenance)
- **INT** → gaze quality (sharp, calculating intelligence)
- **WIS** → aura (serene awareness, ancient wisdom)
- **DEX** → movement (catlike grace, clumsy and heavy-footed)
- **Class + Level** → flavor text scaled by level (fledgling/capable/seasoned/veteran/legendary)
- **CON** → health indicators (unnatural vitality, fragile health)

The creator has a **textarea** for appearance with an "Auto-Generate From Stats" button. If no appearance is saved, the Stats tab auto-generates one on the fly.

### 4. Enhanced Stats Tab
The Stats tab now shows:
- Large portrait with gold-trimmed panel
- Character summary (name, level, sex, race, class)
- Physical details (height, weight, age, alignment)
- Characteristics in italic
- Appearance description in a parchment-style block with gold left border
- Full ability tables (STR, DEX, CON, INT, WIS, CHR with all sub-attributes)

### Data Safety
All previous bulletproof dual-write (IndexedDB + localStorage) architecture retained. No data loss possible.
