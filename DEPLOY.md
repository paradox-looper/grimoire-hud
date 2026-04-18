# Deployment Guide

## GitHub Pages (Primary)

### One-Time Setup
1. In your repo `paradox-looper/celestia`:
   - Settings → **Pages** → Source: **Deploy from a branch**
   - Branch: `main` / root → Save

### Deploy
1. Download `celestia-release.zip`
2. Extract locally
3. Upload ALL files to your repo's root (delete old ones first)
4. Commit to `main`
5. Wait 1–3 minutes → visit `https://paradox-looper.github.io/celestia`

### iPhone Upload Workflow
1. Download and extract the zip in Files app
2. Open your repo in Safari on github.com
3. Delete old files (tap each → ⋯ → Delete)
4. **Add file → Upload files** → select all extracted files
5. Commit to main

---

## iOS Installation (PWA)

Users install the app from Safari:

1. Open the URL in **Safari**
2. Tap the **Share** button
3. **Add to Home Screen** → Add

The app launches fullscreen with proper icon, works offline, and behaves like a native app.

### App Store Path (Optional)
Requires Apple Developer account ($99/year). Wrap with Capacitor:
```bash
npm install -g @capacitor/cli
cap init Celestia com.paradoxlooper.celestia
cap add ios
cap sync ios
cap open ios
```
Build & submit from Xcode. All current assets are relative paths, making this migration clean.

---

## Custom Domain (Optional)

Repo Settings → Pages → Custom domain → your domain. Add DNS records:
- `CNAME` `www` → `paradox-looper.github.io`
- `A` `@` → `185.199.108.153` (+ `.109`, `.110`, `.111`)

Enable **Enforce HTTPS** after DNS propagates.

---

## Update Workflow

1. Edit `celestia.jsx` locally
2. Run `node build.js` → regenerates `index.html`
3. Commit both → GitHub Pages auto-deploys
4. **Bump cache version in `sw.js`** to force users to get the update:
   ```js
   const CACHE_NAME = 'celestia-v1.0.1'; // was v1.0.0
   ```

---

## Troubleshooting

- **Page blank:** Open browser DevTools → Console. Any error will show in the red error box on screen.
- **Icon wrong on iOS:** Remove from home screen and re-add (iOS caches aggressively)
- **Service worker errors:** Normal on first load; doesn't affect app
