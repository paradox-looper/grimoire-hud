const fs = require('fs');
const sucrase = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/sucrase');

let jsx = fs.readFileSync('/home/claude/celestia-rebuild/celestia.jsx', 'utf8');
jsx = jsx.replace(/^import\s*{[^}]+}\s*from\s*["']react["'];?\s*/m, '');
jsx = jsx.replace('export default function Celestia', 'function Celestia');

const fullSource = `
function appMain() {
const { useState, useEffect, useCallback, useRef } = React;

${jsx}

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(Celestia));
}
`;

let transpiled;
try {
  transpiled = sucrase.transform(fullSource, {transforms: ['jsx'], production: true}).code;
  console.log('JSX transpiled:', transpiled.length, 'bytes');
} catch (e) {
  console.error('TRANSPILE FAILED:', e.message);
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>Celestia — Natal Chart Studio</title>
<meta name="description" content="Precision natal chart astrology with transit forecasting. Private, offline-capable, beautiful.">
<meta name="theme-color" content="#0a0a18">

<!-- PWA -->
<link rel="manifest" href="manifest.json">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">

<!-- iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Celestia">
<link rel="apple-touch-icon" href="apple-touch-icon.png">

<!-- Open Graph -->
<meta property="og:title" content="Celestia — Natal Chart Studio">
<meta property="og:description" content="Precision natal chart astrology with transit forecasting.">
<meta property="og:type" content="website">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { height: 100%; width: 100%; overflow: hidden; overscroll-behavior: none; }
  #root { height: 100%; width: 100%; overflow: hidden; }
  body {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a18;
    color: #e2e8f0;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  select, input, textarea { font-size: 16px !important; } /* prevents iOS zoom */
  @media(max-width:768px) { .sidebar-desktop { display: none !important; } }
  /* Smooth scroll restoration */
  * { -webkit-overflow-scrolling: touch; }
</style>
</head>
<body>
<div id="root"><div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#a78bfa;font-family:sans-serif;flex-direction:column;gap:12px"><div style="font-size:32px">✦</div><div style="font-size:14px;letter-spacing:2px">CELESTIA</div><div style="font-size:11px;color:#555770">Loading...</div></div></div>

<script>
window.onerror = function(msg, src, line, col, err) {
  var details = msg + '\\nLine: ' + line + ', Col: ' + col;
  if (err && err.stack) details += '\\n\\n' + err.stack;
  document.getElementById('root').innerHTML = '<div style="padding:20px;color:#ef4444;font-family:monospace;font-size:11px;white-space:pre-wrap;overflow:auto;height:100vh;line-height:1.5"><h2 style="color:#fbbf24;margin-bottom:12px;font-size:16px">Error</h2>' + details.replace(/[<>]/g, function(c){return c==='<'?'&lt;':'&gt;';}) + '</div>';
  return true;
};
// Kill any old service workers that may be caching broken files
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(regs) {
    regs.forEach(function(r) { r.unregister(); });
  });
  if (caches) caches.keys().then(function(names) {
    names.forEach(function(n) { caches.delete(n); });
  });
}
</script>
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react.production.min.js"></script>
<script>
if (typeof React === 'undefined') {
  document.write('<scr'+'ipt src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"><\\/scr'+'ipt>');
  document.write('<scr'+'ipt src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react.production.min.js"><\\/scr'+'ipt>');
}
</script>
<script>
${transpiled}

try {
  appMain();
} catch(e) {
  document.getElementById('root').innerHTML = '<div style="padding:20px;color:#ef4444;font-family:monospace;font-size:11px;white-space:pre-wrap"><h2 style="color:#fbbf24">App Error</h2>' + e.message + '\\n\\n' + (e.stack||'') + '</div>';
}
</script>
</body>
</html>`;

fs.writeFileSync('/home/claude/celestia-rebuild/index.html', html);
console.log('Built index.html:', html.length, 'bytes');
