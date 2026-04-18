# ✦ Celestia — Natal Chart Studio

Precision natal chart astrology with transit forecasting. Private, offline-capable, beautiful.

**Live Demo:** [paradox-looper.github.io/celestia](https://paradox-looper.github.io/celestia)

## Features

### Core Chart
- **14 celestial bodies** — Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, Lilith, North Node, South Node
- **Accurate Placidus houses** — verified to arcminute precision against astro.com
- **Whole Sign houses** — for Hellenistic and Vedic traditions
- **Dual zodiac** — Western Tropical and Vedic Sidereal (Lahiri)
- **27 Nakshatras** — lunar mansion for Vedic readings
- **Interactive chart wheel** — tap any planet, sign, house, or aspect

### Interpretation Content
- **120 planet-sign combinations** with multi-paragraph depth
- **12 house interpretations** with rich context
- **Aspect library** — hand-crafted for major planetary pairs
- **Career & Finance tab** — MC, 2nd/6th/8th/10th houses, Saturn/Jupiter/Venus analysis
- **Essential Dignities** — rulership, exaltation, detriment, fall
- **Pattern recognition** — stelliums, T-squares, grand trines, yods

### Transits
- **Now view** — 12 most significant current transits, with full interpretations
- **12-Month Forecast** — intensity chart + monthly narratives + expandable cards
- **540-combination matrix** — Transit × Aspect × Natal Point with sign and retrograde context
- **64 milestone overrides** — Saturn Return, Uranus Opposition, Jupiter Return, etc.

### Advanced
- **Synastry** — chart comparison between two people
- **Secondary Progressions** — day-for-a-year advanced chart
- **Solar Return** — annual return chart
- **Ephemeris** — full planetary positions for any month

### Privacy & Performance
- **Fully client-side** — your birth data never leaves your device
- **Offline-capable** — PWA with service worker caching
- **No account required** — nothing to sign up for
- **No tracking** — zero analytics, zero cookies

## Quick Start

Visit [paradox-looper.github.io/celestia](https://paradox-looper.github.io/celestia) — it just works.

On iPhone, tap **Share** → **Add to Home Screen** to install as an app.

## Self-Hosting

1. Download the latest release
2. Extract to any static web server (Apache, nginx, GitHub Pages, Netlify, Vercel)
3. That's it — no build step, no dependencies

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions including iOS App Store publication.

## Tech Stack

- **React 18** — UI (loaded from CDN)
- **Sucrase** — JSX transpilation at build time
- **Astronomical engines** — VSOP87 (planets), ELP2000 (Moon), Kepler (Chiron), Meeus (nodes)
- **OpenStreetMap Nominatim** — optional geocoding (falls back to 360-city offline database)

## Accuracy Notes

- Inner planets (Sun–Mars): accurate to arcminutes
- Outer planets (Saturn–Pluto): ~0.1–0.7° vs Swiss Ephemeris
- Moon: ELP2000 top-22 terms, ~1'
- Houses: Placidus verified against astro.com
- Chiron: perihelion-based Keplerian, calibrated against Swiss Ephemeris
- North Node: Mean Node (~2° from True Node)

## License

MIT — see [LICENSE](LICENSE)

## Privacy

See [PRIVACY.md](PRIVACY.md) — short version: nothing leaves your device.
