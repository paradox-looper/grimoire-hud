const fs = require('fs');
const sucrase = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/sucrase');

let jsx = fs.readFileSync('/home/claude/celestia-rebuild/celestia.jsx', 'utf8');
jsx = jsx.replace(/^import\s*{[^}]+}\s*from\s*["']react["'];?\s*/m, '');
jsx = jsx.replace('export default function Celestia', 'function Celestia');

const appSource = `
function appMain() {
  const { useState, useEffect, useCallback, useRef } = React;
  ${jsx}
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(Celestia));
}
`;

let transpiled;
try {
  transpiled = sucrase.transform(appSource, {transforms: ['jsx'], production: true}).code;
  console.log('Transpiled:', transpiled.length, 'bytes');
} catch(e) {
  console.error('FAILED:', e.message);
  process.exit(1);
}

// Verify ReactDOM is only referenced inside appMain
const lines = transpiled.split('\n');
let insideAppMain = false;
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('function appMain')) { insideAppMain = true; depth = 0; }
  if (insideAppMain) {
    for (const c of line) { if (c==='{') depth++; if (c==='}') depth--; }
    if (depth < 0) { insideAppMain = false; break; }
  }
  if (!insideAppMain && line.includes('ReactDOM')) {
    console.error('ERROR: ReactDOM referenced outside appMain on line', i+1, ':', line.substring(0,80));
    process.exit(1);
  }
  if (!insideAppMain && line.includes('React.') && !line.includes('typeof React')) {
    console.error('ERROR: React. referenced outside appMain on line', i+1, ':', line.substring(0,80));
    process.exit(1);
  }
}
console.log('Verified: no React/ReactDOM references outside appMain');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>Celestia</title>
<meta name="theme-color" content="#0a0a18">
<link rel="manifest" href="manifest.json">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Celestia">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html,body,#root { height:100%; width:100%; overflow:hidden; }
body { font-family:'Outfit',-apple-system,sans-serif; background:#0a0a18; color:#e2e8f0; }
select,input,textarea { font-size:16px !important; }
@media(max-width:768px){.sidebar-desktop{display:none !important;}}
</style>
</head>
<body>
<div id="root">
  <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#a78bfa;font-family:sans-serif;flex-direction:column;gap:12px">
    <div style="font-size:32px">&#10022;</div>
    <div style="font-size:14px;letter-spacing:2px">CELESTIA</div>
    <div style="font-size:11px;color:#555770">Loading...</div>
  </div>
</div>
<script>
window.onerror=function(msg,src,line,col,err){
  var d=msg+'\\nLine:'+line+' Col:'+col;
  if(err&&err.stack)d+='\\n\\n'+err.stack;
  document.getElementById('root').innerHTML='<div style="padding:20px;color:#ef4444;font-family:monospace;font-size:11px;white-space:pre-wrap;overflow:auto;max-height:100vh">'+d.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</div>';
  return true;
};
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(s){s.unregister();});});
}
</script>

<!-- React loaded synchronously before app script -->
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js'"></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js'"></script>

<!-- App runs after React is guaranteed available -->
<script>
${transpiled}
try{
  if(typeof React==='undefined'||typeof ReactDOM==='undefined'){
    throw new Error('React or ReactDOM failed to load from CDN. Check network connection.');
  }
  appMain();
}catch(e){
  document.getElementById('root').innerHTML='<div style="padding:20px;color:#ef4444;font-family:monospace;font-size:11px;white-space:pre-wrap"><b style="color:#fbbf24">App Error</b><br><br>'+e.message.replace(/</g,'&lt;')+'<br><br>'+(e.stack||'').replace(/</g,'&lt;')+'</div>';
}
</script>
</body>
</html>`;

fs.writeFileSync('/home/claude/celestia-rebuild/index.html', html);
console.log('Built index.html:', html.length, 'bytes');
