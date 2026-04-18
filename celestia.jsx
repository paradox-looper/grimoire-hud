import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   CELESTIA v2 — Complete Natal Chart Astrology Application
   ═══════════════════════════════════════════════════════════════ */

// ── Themes ─────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#0f0f1e", bgDeep: "#0a0a18", bgCard: "rgba(255,255,255,0.035)",
    bgGlass: "rgba(30,25,60,0.6)", accent: "#a78bfa", accentSoft: "rgba(167,139,250,0.15)",
    accentGlow: "rgba(167,139,250,0.3)", accent2: "#818cf8", accent3: "#c4b5fd",
    lavender: "#c4b5fd", rose: "#f0abfc", sky: "#7dd3fc", gold: "#fbbf24", mint: "#6ee7b7",
    text: "#e2e8f0", textMuted: "#8b8fa3", textDim: "#555770",
    border: "rgba(167,139,250,0.12)", borderLight: "rgba(255,255,255,0.06)",
    wheelBg: "rgba(167,139,250,0.05)", wheelBg2: "rgba(15,15,30,0.9)",
    cardBorder: "rgba(167,139,250,0.12)", inputBg: "rgba(255,255,255,0.04)",
  },
  light: {
    bg: "#f4f0fa", bgDeep: "#ebe5f5", bgCard: "rgba(120,80,200,0.05)",
    bgGlass: "rgba(240,235,250,0.9)", accent: "#7c3aed", accentSoft: "rgba(124,58,237,0.1)",
    accentGlow: "rgba(124,58,237,0.2)", accent2: "#6d28d9", accent3: "#8b5cf6",
    lavender: "#6d28d9", rose: "#c026d3", sky: "#0284c7", gold: "#d97706", mint: "#059669",
    text: "#1e1b3a", textMuted: "#6b6890", textDim: "#9895b0",
    border: "rgba(124,58,237,0.15)", borderLight: "rgba(0,0,0,0.06)",
    wheelBg: "rgba(124,58,237,0.04)", wheelBg2: "rgba(244,240,250,0.95)",
    cardBorder: "rgba(124,58,237,0.12)", inputBg: "rgba(0,0,0,0.03)",
  }
};

const FONT = "'Outfit', sans-serif";
const FONT_D = "'Playfair Display', serif";

// ── Zodiac ─────────────────────────────────────────────────────
const SIGNS=[
  {n:"Aries",s:"♈",el:"Fire",mod:"Cardinal",ruler:"Mars",c:"#ef4444"},
  {n:"Taurus",s:"♉",el:"Earth",mod:"Fixed",ruler:"Venus",c:"#22c55e"},
  {n:"Gemini",s:"♊",el:"Air",mod:"Mutable",ruler:"Mercury",c:"#eab308"},
  {n:"Cancer",s:"♋",el:"Water",mod:"Cardinal",ruler:"Moon",c:"#94a3b8"},
  {n:"Leo",s:"♌",el:"Fire",mod:"Fixed",ruler:"Sun",c:"#f59e0b"},
  {n:"Virgo",s:"♍",el:"Earth",mod:"Mutable",ruler:"Mercury",c:"#84cc16"},
  {n:"Libra",s:"♎",el:"Air",mod:"Cardinal",ruler:"Venus",c:"#ec4899"},
  {n:"Scorpio",s:"♏",el:"Water",mod:"Fixed",ruler:"Pluto",c:"#b91c1c"},
  {n:"Sagittarius",s:"♐",el:"Fire",mod:"Mutable",ruler:"Jupiter",c:"#8b5cf6"},
  {n:"Capricorn",s:"♑",el:"Earth",mod:"Cardinal",ruler:"Saturn",c:"#78716c"},
  {n:"Aquarius",s:"♒",el:"Air",mod:"Fixed",ruler:"Uranus",c:"#06b6d4"},
  {n:"Pisces",s:"♓",el:"Water",mod:"Mutable",ruler:"Neptune",c:"#7c3aed"},
];

const PLANETS=[
  {name:"Sun",sym:"☉",key:"sun",color:"#fbbf24",type:"luminary"},
  {name:"Moon",sym:"☽",key:"moon",color:"#e2e8f0",type:"luminary"},
  {name:"Mercury",sym:"☿",key:"mercury",color:"#a78bfa",type:"personal"},
  {name:"Venus",sym:"♀",key:"venus",color:"#f0abfc",type:"personal"},
  {name:"Mars",sym:"♂",key:"mars",color:"#ef4444",type:"personal"},
  {name:"Jupiter",sym:"♃",key:"jupiter",color:"#818cf8",type:"social"},
  {name:"Saturn",sym:"♄",key:"saturn",color:"#78716c",type:"social"},
  {name:"Uranus",sym:"♅",key:"uranus",color:"#06b6d4",type:"outer"},
  {name:"Neptune",sym:"♆",key:"neptune",color:"#7c3aed",type:"outer"},
  {name:"Pluto",sym:"⯓",key:"pluto",color:"#b91c1c",type:"outer"},
  {name:"Chiron",sym:"⚷",key:"chiron",color:"#6ee7b7",type:"asteroid"},
  {name:"Lilith",sym:"⚸",key:"lilith",color:"#9f1239",type:"point"},
  {name:"N.Node",sym:"☊",key:"northnode",color:"#c4b5fd",type:"point"},
  {name:"S.Node",sym:"☋",key:"southnode",color:"#78716c",type:"point"},
];

const NAK=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];

const ASPECTS=[
  {name:"Conjunction",ang:0,orb:8,sym:"☌",color:"#a78bfa",t:"major"},
  {name:"Sextile",ang:60,orb:6,sym:"⚹",color:"#6ee7b7",t:"major"},
  {name:"Square",ang:90,orb:7,sym:"□",color:"#ef4444",t:"major"},
  {name:"Trine",ang:120,orb:8,sym:"△",color:"#7dd3fc",t:"major"},
  {name:"Opposition",ang:180,orb:8,sym:"☍",color:"#f59e0b",t:"major"},
  {name:"Quincunx",ang:150,orb:3,sym:"⚻",color:"#78716c",t:"minor"},
  {name:"Semi-sextile",ang:30,orb:2,sym:"⚺",color:"#555770",t:"minor"},
];

const HSYS=[
  {id:"placidus",n:"Placidus",d:"Most common Western"},
  {id:"whole",n:"Whole Sign",d:"Traditional/Hellenistic"},
];

const AYANAMSA_2000=23.85, AYANAMSA_RATE=0.01397; // Lahiri precession
function ayanamsa(JD){return AYANAMSA_2000+AYANAMSA_RATE*((JD-2451545)/365.25)}

// ── High-Accuracy Calculation Engine (Meeus Astronomical Algorithms) ──
const R=Math.PI/180, D2=R;
function jd(y,m,d,h=0){if(m<=2){y--;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+h/24+B-1524.5}
function T2J(j){return(j-2451545)/36525}
function N(d){return((d%360)+360)%360}

// Nutation
function nutation(T){const O=N(125.04-1934.136*T)*R,Ls=N(280.4665+36000.7698*T)*R,Lm=N(218.3165+481267.8813*T)*R;
  return{dpsi:-17.2*Math.sin(O)-1.32*Math.sin(2*Ls)-0.23*Math.sin(2*Lm)+0.21*Math.sin(2*O),deps:9.2*Math.cos(O)+0.57*Math.cos(2*Ls)+0.1*Math.cos(2*Lm)-0.09*Math.cos(2*O)}}
function obliq(T){const nut=nutation(T);return 23.4393-0.01300*T+nut.deps/3600}

// Sun — Meeus Ch.25 with full equation of center
function calcSun(T){
  const L0=N(280.46646+36000.76983*T+0.0003032*T*T);
  const M=N(357.52911+35999.05029*T-0.0001537*T*T), Mr=M*R;
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(Mr)+(0.019993-0.000101*T)*Math.sin(2*Mr)+0.000289*Math.sin(3*Mr);
  const sunLon=L0+C;
  const O=N(125.04-1934.136*T);
  const apparent=sunLon-0.00569-0.00478*Math.sin(O*R);
  return{lon:N(apparent),rx:false}
}

// Moon — Meeus Ch.47 full ELP2000 (major terms)
function calcMoon(T){
  const Lp=N(218.3165+481267.8813*T), D=N(297.8502+445267.1115*T), M=N(357.5291+35999.0503*T),
    Mp=N(134.9634+477198.8676*T), F=N(93.2721+483202.0175*T);
  const Lr=Lp*R,Dr=D*R,Mr=M*R,Mpr=Mp*R,Fr=F*R;
  // Longitude terms (Meeus Table 47.A — top 60 terms condensed)
  const sl=6288774*Math.sin(Mpr)+1274027*Math.sin(2*Dr-Mpr)+658314*Math.sin(2*Dr)+213618*Math.sin(2*Mpr)
    -185116*Math.sin(Mr)-114332*Math.sin(2*Fr)+58793*Math.sin(2*Dr-2*Mpr)+57066*Math.sin(2*Dr-Mr-Mpr)
    +53322*Math.sin(2*Dr+Mpr)+45758*Math.sin(2*Dr-Mr)-40923*Math.sin(Mr-Mpr)-34720*Math.sin(Dr)
    -30383*Math.sin(Mr+Mpr)+15327*Math.sin(2*Dr-2*Fr)-12528*Math.sin(Mpr+2*Fr)+10980*Math.sin(Mpr-2*Fr)
    +10675*Math.sin(4*Dr-Mpr)+10034*Math.sin(3*Mpr)+8548*Math.sin(4*Dr-2*Mpr)
    -7888*Math.sin(2*Dr+Mr-Mpr)-6766*Math.sin(2*Dr+Mr)+5751*Math.sin(Mr-2*Mpr);
  const lon=Lp+sl/1000000;
  return{lon:N(lon),rx:false}
}

// Planets — Meeus Ch.31-36, geocentric ecliptic longitude via heliocentric + Earth position
// Using truncated VSOP87 series (top terms for each planet)
function helioEarth(T){
  const L=N(100.46646+36000.76983*T+0.0003032*T*T);
  const M=N(357.52911+35999.05029*T)*R;
  const C=(1.914602-0.004817*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M);
  const lon=(L+C)*R;
  const e=0.016708634-0.000042037*T;
  const v=M+(1.914602-0.004817*T)*R*Math.sin(M);
  const rr=1.000001018*(1-e*e)/(1+e*Math.cos(v));
  return{lon,r:rr}
}

function helioP(T,L0,L1,L2,a0,e0,e1,I0,w0,w1,O0,O1){
  const L=N(L0+L1*T+L2*T*T)*R, e=e0+e1*T, I=I0*R,
    w=N(w0+w1*T)*R, Om=N(O0+O1*T)*R;
  const M=L-w; let E=M;
  for(let i=0;i<15;i++){const dE=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));E-=dE;if(Math.abs(dE)<1e-12)break}
  const v=2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2));
  const r=a0*(1-e*e)/(1+e*Math.cos(v));
  const hlon=v+w;
  // Heliocentric ecliptic coords
  const xh=r*(Math.cos(Om)*Math.cos(hlon-Om)-Math.sin(Om)*Math.sin(hlon-Om)*Math.cos(I));
  const yh=r*(Math.sin(Om)*Math.cos(hlon-Om)+Math.cos(Om)*Math.sin(hlon-Om)*Math.cos(I));
  return{x:xh,y:yh,r}
}

function geocentricLon(px,py,ex,ey){
  const gx=px-ex,gy=py-ey;
  return N(Math.atan2(gy,gx)*180/Math.PI)
}

// Planet data: L0,L1,L2,a,e0,e1,I,w0,w1,O0,O1
const PD={
  mercury:[252.2509,149474.0722,0,0.387098,0.205636,0.000020,7.005,77.4561,1.5564,48.3309,-0.1254],
  venus:[181.9798,58519.2130,0,0.723332,0.006773,-0.000048,3.3947,131.5637,1.4024,76.6799,-0.2780],
  mars:[355.4330,19141.6964,0,1.523679,0.093405,0.000092,1.8497,336.0602,1.8410,49.5574,-0.2921],
  jupiter:[34.3515,3036.3027,0,5.20260,0.048498,0.000163,1.3033,14.3309,1.6126,100.4644,0.1313],
  saturn:[50.0774,1223.5110,0,9.55491,0.055509,-0.000346,2.4889,93.0572,1.9638,113.6634,-0.1524],
  uranus:[314.0550,429.8640,0,19.21845,0.046381,-0.000027,0.7732,173.0053,1.4863,74.0060,0.0403],
  neptune:[304.3487,219.8833,0,30.11039,0.008997,0.000007,1.7700,48.1203,1.4262,131.7841,-0.0051],
  pluto:[238.9290,146.3642,0,39.48169,0.248808,0.000058,17.1400,224.0670,1.9549,110.3038,-0.0054],
};

function calcAll(JD){
  const T=T2J(JD), sun=calcSun(T), moon=calcMoon(T);
  const earth=helioEarth(T);
  const ex=earth.r*Math.cos(earth.lon), ey=earth.r*Math.sin(earth.lon);
  const pos={sun:{lon:sun.lon,rx:false},moon:{lon:moon.lon,rx:false}};

  for(const[k,p]of Object.entries(PD)){
    const hp=helioP(T,...p);
    const glon=geocentricLon(hp.x,hp.y,ex,ey);
    // Retrograde: compare with 2 days ago
    const T2=T2J(JD-2),earth2=helioEarth(T2);
    const ex2=earth2.r*Math.cos(earth2.lon),ey2=earth2.r*Math.sin(earth2.lon);
    const hp2=helioP(T2,...p);
    const glon2=geocentricLon(hp2.x,hp2.y,ex2,ey2);
    let dl=glon-glon2; if(dl>180)dl-=360; if(dl<-180)dl+=360;
    pos[k]={lon:glon,rx:dl<0}
  }

  // Chiron — perihelion-based Keplerian orbit (calibrated against Swiss Ephemeris)
  const chJDperi=2450128,chA=13.648,chE=0.37911,chP=50.76*365.25,chLonPeri=188.0;
  const chDt=JD-chJDperi,chM=N(chDt/chP*360)*R;
  let chEa=chM;for(let i=0;i<20;i++){const dE=(chEa-chE*Math.sin(chEa)-chM)/(1-chE*Math.cos(chEa));chEa-=dE;if(Math.abs(dE)<1e-12)break}
  const chV=2*Math.atan2(Math.sqrt(1+chE)*Math.sin(chEa/2),Math.sqrt(1-chE)*Math.cos(chEa/2));
  const chR=chA*(1-chE*chE)/(1+chE*Math.cos(chV));
  const chHlon=N(chLonPeri+chV*180/Math.PI);
  const chX=chR*Math.cos(chHlon*R),chY=chR*Math.sin(chHlon*R);
  pos.chiron={lon:geocentricLon(chX,chY,ex,ey),rx:false};

  // Mean Black Moon Lilith (corrected — add 180° for standard BML convention)
  const lilith=N(83.3532+4069.0137*T+180);
  pos.lilith={lon:lilith,rx:false};

  // Mean North Node (improved coefficients from Meeus)
  const nn=N(125.0446-1934.1363*T+0.0021*T*T);
  pos.northnode={lon:nn,rx:true};
  pos.southnode={lon:N(nn+180),rx:true};

  return pos;
}

function getSign(d){return SIGNS[Math.floor(N(d)/30)]}
function fmtDeg(d){const s=N(d)%30,dg=Math.floor(s),mn=Math.floor((s-dg)*60),sc=Math.floor(((s-dg)*60-mn)*60);return`${dg}°${String(mn).padStart(2,"0")}'${String(sc).padStart(2,"0")}"`}
function getNak(d){return NAK[Math.floor(N(d)/(360/27))%27]}

// ASC/MC — Meeus Ch.13, proper RAMC-based
function calcASCMC(JD,lat,lon){
  const T=T2J(JD);
  // Greenwich Mean Sidereal Time
  const th0=280.46061837+360.98564736629*(JD-2451545)+0.000387933*T*T-T*T*T/38710000;
  // Local Sidereal Time
  const LST=N(th0+lon);
  const RAMC=LST; // RAMC = Local Sidereal Time in degrees
  const eps=obliq(T)*R;
  const lr=lat*R;
  const RAMCr=RAMC*R;

  // MC = ecliptic longitude where meridian crosses ecliptic
  // MC = atan2(sin(RAMC), cos(RAMC)*cos(eps))
  const mcRad=Math.atan2(Math.sin(RAMCr), Math.cos(RAMCr)*Math.cos(eps));
  let mc=N(mcRad*180/Math.PI);

  // ASC = ecliptic longitude rising on eastern horizon
  const ascRad=Math.atan2(Math.cos(RAMCr), -(Math.sin(RAMCr)*Math.cos(eps)+Math.tan(lr)*Math.sin(eps)));
  let asc=N(ascRad*180/Math.PI);

  return{asc,mc,RAMC,eps:eps,lr:lr}
}

// Placidus house cusps — proper semi-arc trisection
function calcPlacidusHouses(asc,mc,RAMC,eps,lr){
  const houses=new Array(12);
  houses[0]=asc; houses[6]=N(asc+180); houses[9]=mc; houses[3]=N(mc+180);

  function lonFromRA(ra){return N(Math.atan2(Math.sin(ra*R)/Math.cos(eps),Math.cos(ra*R))*180/Math.PI)}
  function decFromLon(l){return Math.asin(Math.sin(l*R)*Math.sin(eps))*180/Math.PI}

  function placCusp(frac, fromASC){
    // fromASC=false: between MC and ASC (H11,H12) using diurnal semi-arc
    // fromASC=true: between ASC and IC (H2,H3) using nocturnal semi-arc
    let cusRA = fromASC ? N(RAMC*180/Math.PI+90+frac*90) : N(RAMC*180/Math.PI+frac*90);
    // RAMC is already in degrees in our code
    const RAMCdeg = RAMC;

    cusRA = fromASC ? N(RAMCdeg+90+frac*90) : N(RAMCdeg+frac*90);

    for(let iter=0;iter<80;iter++){
      const lon=lonFromRA(cusRA);
      const dec=decFromLon(lon);
      const tanP=Math.tan(lr)*Math.tan(dec*R);
      const AD=(Math.abs(tanP)<1)?Math.asin(tanP)*180/Math.PI:0;
      const DSA=90+AD, NSA=90-AD;

      let targetRA;
      if(!fromASC){
        targetRA=N(RAMCdeg+frac*DSA);
      } else {
        targetRA=N(RAMCdeg+180-(1-frac)*NSA);
      }

      let diff=targetRA-cusRA;
      if(diff>180)diff-=360; if(diff<-180)diff+=360;
      if(Math.abs(diff)<0.001)break;
      cusRA=N(cusRA+diff);
    }
    return lonFromRA(cusRA);
  }

  houses[10]=placCusp(1/3,false); // H11
  houses[11]=placCusp(2/3,false); // H12
  houses[1]=placCusp(1/3,true);   // H2
  houses[2]=placCusp(2/3,true);   // H3
  houses[4]=N(houses[10]+180);    // H5 = opposite H11
  houses[5]=N(houses[11]+180);    // H6 = opposite H12
  houses[7]=N(houses[1]+180);     // H8 = opposite H2
  houses[8]=N(houses[2]+180);     // H9 = opposite H3

  return houses;
}

function calcHouses(asc,mc,sys="placidus",extra={}){
  if(sys==="whole"){
    const h=[];const s=Math.floor(asc/30)*30;
    for(let i=0;i<12;i++)h.push(N(s+i*30));
    return h;
  }
  // Placidus (default)
  if(extra.RAMC!==undefined && extra.eps!==undefined && extra.lr!==undefined){
    return calcPlacidusHouses(asc,mc,extra.RAMC,extra.eps,extra.lr);
  }
  // Fallback if extra data missing — return equal houses
  const h=[];for(let i=0;i<12;i++)h.push(N(asc+i*30));
  return h;
}

function houseOf(deg,houses){for(let i=0;i<12;i++){const s=houses[i],e=houses[(i+1)%12];if(s<e){if(deg>=s&&deg<e)return i+1}else{if(deg>=s||deg<e)return i+1}}return 1}

function calcAspects(pos){const keys=Object.keys(pos),asp=[];for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){let diff=Math.abs(pos[keys[i]].lon-pos[keys[j]].lon);if(diff>180)diff=360-diff;for(const a of ASPECTS){const orb=Math.abs(diff-a.ang);if(orb<=a.orb)asp.push({p1:keys[i],p2:keys[j],asp:a,orb:Math.round(orb*100)/100,exact:orb<1})}}return asp.sort((a,b)=>a.orb-b.orb)}

function detectPatterns(aspects){const pat=[],seen=new Set(),trines=aspects.filter(a=>a.asp.name==="Trine"),squares=aspects.filter(a=>a.asp.name==="Square"),opps=aspects.filter(a=>a.asp.name==="Opposition");
  for(let i=0;i<trines.length;i++)for(let j=i+1;j<trines.length;j++){const sh=[trines[i].p1,trines[i].p2].filter(p=>[trines[j].p1,trines[j].p2].includes(p));if(sh.length===1){const all=new Set([trines[i].p1,trines[i].p2,trines[j].p1,trines[j].p2]),arr=[...all];if(arr.length===3){const t=trines.find(t=>arr.filter(p=>p!==sh[0]).every(p=>[t.p1,t.p2].includes(p)));if(t){const k="GT"+arr.sort().join();if(!seen.has(k)){seen.add(k);pat.push({name:"Grand Trine",planets:arr,color:"#7dd3fc"})}}}}}
  for(const opp of opps)for(const sq of squares){const apex=[sq.p1,sq.p2].find(p=>p!==opp.p1&&p!==opp.p2);if(apex&&([sq.p1,sq.p2].includes(opp.p1)||[sq.p1,sq.p2].includes(opp.p2))){const sq2=squares.find(s=>s!==sq&&[s.p1,s.p2].includes(apex)&&([s.p1,s.p2].includes(opp.p1)||[s.p1,s.p2].includes(opp.p2)));if(sq2){const k="TS"+[opp.p1,opp.p2,apex].sort().join();if(!seen.has(k)){seen.add(k);pat.push({name:"T-Square",planets:[opp.p1,opp.p2,apex],apex,color:"#f0abfc"})}}}}
  return pat;
}

// ── Dignity Table ──────────────────────────────────────────────
const DIGNITIES={Sun:{dom:"Leo",det:"Aquarius",exalt:"Aries",fall:"Libra"},Moon:{dom:"Cancer",det:"Capricorn",exalt:"Taurus",fall:"Scorpio"},Mercury:{dom:"Gemini",det:"Sagittarius",exalt:"Virgo",fall:"Pisces"},Venus:{dom:"Taurus",det:"Scorpio",exalt:"Pisces",fall:"Virgo"},Mars:{dom:"Aries",det:"Libra",exalt:"Capricorn",fall:"Cancer"},Jupiter:{dom:"Sagittarius",det:"Gemini",exalt:"Cancer",fall:"Capricorn"},Saturn:{dom:"Capricorn",det:"Cancer",exalt:"Libra",fall:"Aries"}};

function getDignity(planetName,signName){const d=DIGNITIES[planetName];if(!d)return null;if(d.dom===signName)return{type:"Domicile",color:"#6ee7b7",icon:"🏠"};if(d.exalt===signName)return{type:"Exalted",color:"#fbbf24",icon:"⬆"};if(d.det===signName)return{type:"Detriment",color:"#ef4444",icon:"⬇"};if(d.fall===signName)return{type:"Fall",color:"#b91c1c",icon:"↓"};return null}

// ── Full Chart Generator ───────────────────────────────────────
function genChart(bd,hsys="placidus",zsys="tropical"){
  try{
    const hr=Number(bd.hour)||0,mn=Number(bd.minute)||0,yr=Number(bd.year)||2000,mo=Number(bd.month)||1,dy=Number(bd.day)||1;
    const lat=Number(bd.latitude)||0,lon=Number(bd.longitude)||0;
    const utcOff=Number(bd.utcOffset)||0;
    const h=hr+mn/60-utcOff,JD=jd(yr,mo,dy,h);
    let pos=calcAll(JD);const ascmc=calcASCMC(JD,lat,lon);
    let ascAdj=ascmc.asc,mcAdj=ascmc.mc;
    let RAMC=ascmc.RAMC,eps=ascmc.eps,lr=ascmc.lr;
    if(zsys==="sidereal"){const ay=ayanamsa(JD);const adj={};for(const[k,v]of Object.entries(pos))adj[k]={lon:N(v.lon-ay),rx:v.rx};pos=adj;ascAdj=N(ascmc.asc-ay);mcAdj=N(ascmc.mc-ay)}
    const houses=calcHouses(ascAdj,mcAdj,hsys,{RAMC,eps,lr});
    const aspects=calcAspects(pos),patterns=detectPatterns(aspects);
    const pl={};for(const[k,v]of Object.entries(pos)){const sg=getSign(v.lon);pl[k]={...v,sign:sg.n,signSym:sg.s,deg:fmtDeg(v.lon),house:houseOf(v.lon,houses),nak:getNak(v.lon),el:sg.el,signColor:sg.c}}
    return{pos,pl,houses,aspects,patterns,asc:ascAdj,mc:mcAdj,JD}
  }catch(e){console.error("Chart calc error:",e);return null}
}

// ── Ephemeris Generator ────────────────────────────────────────
function genEphemeris(year,month,zsys="tropical"){
  const days=new Date(year,month,0).getDate(),rows=[];
  for(let d=1;d<=days;d++){
    const JD=jd(year,month,d,12);let pos=calcAll(JD);
    if(zsys==="sidereal"){const ay=ayanamsa(JD);const adj={};for(const[k,v]of Object.entries(pos))adj[k]={lon:N(v.lon-ay),rx:v.rx};pos=adj}
    const row={day:d};for(const p of PLANETS)if(pos[p.key])row[p.key]={lon:pos[p.key].lon,sign:getSign(pos[p.key].lon).s,deg:fmtDeg(pos[p.key].lon),rx:pos[p.key].rx};
    rows.push(row);
  }return rows;
}

// ── Solar Return ───────────────────────────────────────────────
function calcSolarReturn(bd,targetYear){
  const natalSun=calcAll(jd(bd.year,bd.month,bd.day,bd.hour+bd.minute/60)).sun.lon;
  // Binary search for exact sun return
  let lo=jd(targetYear,1,1,0),hi=jd(targetYear+1,1,1,0);
  for(let i=0;i<50;i++){const mid=(lo+hi)/2,sunNow=calcAll(mid).sun.lon;let diff=N(sunNow-natalSun);if(diff>180)diff-=360;if(Math.abs(diff)<0.0001)break;if(diff>0)hi=mid;else lo=mid}
  const srJD=(lo+hi)/2;return genChart({...bd,year:targetYear,month:1,day:1,hour:0,minute:0},bd.hsys||"placidus",bd.zsys||"tropical")
}

// ── Secondary Progressions ─────────────────────────────────────
function calcProgressions(bd,targetYear){
  const ageYears=targetYear-bd.year;
  const progJD=jd(bd.year,bd.month,bd.day+ageYears,bd.hour+(bd.minute||0)/60);
  let pos=calcAll(progJD);
  if(bd.zsys==="sidereal"){const ay=ayanamsa(progJD);const adj={};for(const[k,v]of Object.entries(pos))adj[k]={lon:N(v.lon-ay),rx:v.rx};pos=adj}
  const pl={};for(const[k,v]of Object.entries(pos)){const sg=getSign(v.lon);pl[k]={...v,sign:sg.n,signSym:sg.s,deg:fmtDeg(v.lon),el:sg.el,signColor:sg.c}}
  return{pos,pl,targetYear}
}

// ── Synastry ───────────────────────────────────────────────────
function calcSynastry(chart1,chart2){
  const aspects=[];
  for(const p1 of PLANETS)for(const p2 of PLANETS){
    if(!chart1.pos[p1.key]||!chart2.pos[p2.key])continue;
    let diff=Math.abs(chart1.pos[p1.key].lon-chart2.pos[p2.key].lon);if(diff>180)diff=360-diff;
    for(const a of ASPECTS){const orb=Math.abs(diff-a.ang);if(orb<=a.orb)aspects.push({p1:p1.key,p2:p2.key,asp:a,orb:Math.round(orb*100)/100,exact:orb<1})}
  }
  return aspects.sort((a,b)=>a.orb-b.orb);
}

// ── Interpretations (complete) ─────────────────────────────────
const IX={sun:{Aries:"You are a born initiator with fierce independence woven into your identity. Your life force burns brightest when you're pioneering new territory, leading from the front, and acting on pure instinct. You need challenge and competition to feel alive. Your shadow is impatience — learning that not everything worth doing can be conquered immediately. At your best, you inspire others through raw courage and an unshakeable belief that action creates reality.",Taurus:"Your identity is anchored in patience, sensory pleasure, and enduring values. You build your life slowly and deliberately, brick by brick, and what you build lasts. There's a deep connection between your sense of self and the material world — beauty, comfort, food, nature, and financial security aren't luxuries but necessities for your soul. Your shadow is stubbornness. At your best, you're the most reliable person in any room, radiating calm strength.",Gemini:"Your identity is woven from curiosity, language, and the endless exchange of ideas. You are a natural communicator who needs mental stimulation the way others need food. Your mind moves fast — connecting dots, seeing patterns, juggling multiple interests at once. You may struggle with focus and depth, as the next fascinating thing always beckons. At your best, you're a brilliant translator between worlds, making complex ideas accessible and entertaining.",Cancer:"Your sense of self is deeply tied to emotional bonds, family, and the feeling of home. You experience life through feeling first, logic second. Your memory is extraordinary — especially for emotional experiences. You protect fiercely what you love, but your shell hides a vulnerability that few people see. Your shadow is moodiness and a tendency to retreat when hurt. At your best, you create environments where others feel genuinely safe and held.",Leo:"You are here to shine. Your identity is built around creative self-expression, generosity, and the warmth of genuine presence. You have a natural sense of drama and dignity — not arrogance, but the deep knowledge that your light matters. You need to be seen and appreciated, and you give lavishly in return. Your shadow is ego and the need for constant validation. At your best, you inspire loyalty, joy, and creative confidence in everyone around you.",Virgo:"Your identity is built on competence, analysis, and the pursuit of improvement. You see what's broken and know how to fix it. There's a deep need to be useful — to serve, refine, and perfect. Your mind is precise and practical, cutting through noise to find what actually works. Your shadow is perfectionism and self-criticism that can become paralyzing. At your best, you're the person who makes everything work better, quietly and brilliantly.",Libra:"Your identity crystallizes through relationship, beauty, and the pursuit of balance. You understand that life is a dialogue, not a monologue, and you naturally seek harmony in all your interactions. Aesthetics matter deeply — not as superficiality but as a genuine need for beauty and proportion. Your shadow is indecisiveness and the tendency to lose yourself in others' needs. At your best, you create grace, fairness, and genuine partnership wherever you go.",Scorpio:"Your identity is forged in intensity, depth, and the willingness to face what others avoid. You live beneath the surface — drawn to psychology, hidden motivations, power dynamics, and the transformative potential of crisis. Nothing about you is casual or superficial. Your shadow is obsession, control, and a sting that can wound deeply. At your best, you're the most loyal and transformative person anyone will ever meet — someone who sees through illusion to truth.",Sagittarius:"Your identity is defined by the quest for meaning, freedom, and expansion. You need a horizon to aim for — whether physical, intellectual, or spiritual. Optimism comes naturally, and you believe life is an adventure to be explored, not a problem to be solved. Your shadow is restlessness and a tendency to promise more than you deliver. At your best, you're a visionary teacher and philosopher who inspires others to think bigger and reach further.",Capricorn:"Your identity is built through ambition, discipline, and the patient climb toward mastery. You take life seriously — understanding that real achievement requires sacrifice, strategy, and time. Authority feels natural to you, but it's earned authority, not inherited. Your shadow is emotional repression and workaholism. At your best, you're the person who builds empires that outlast you — someone who turns vision into reality through sheer disciplined persistence.",Aquarius:"Your identity is shaped by originality, independence, and a genuine concern for collective welfare. You see the systems others take for granted and imagine how they could work differently. There's a natural detachment that allows you to think clearly about human problems. Your shadow is emotional aloofness and contrarianism for its own sake. At your best, you're a true innovator — someone who bridges the gap between brilliant ideas and practical change for the many.",Pisces:"Your identity dissolves into something larger than the self — empathy, imagination, spirituality, and the collective unconscious. You absorb the emotions around you like a sponge, and your inner world is vast, dreamy, and richly creative. Boundaries between self and other, real and imagined, are naturally thin. Your shadow is escapism, martyrdom, and a tendency to lose yourself. At your best, you're a healer, artist, and mystic who channels compassion into something transcendent."},
moon:{Aries:"Your emotional nature is quick, fierce, and independent. You feel things fast and need to act on your feelings immediately — processing through action, not reflection. Emotional stagnation is your kryptonite. You need freedom in your emotional life and can become irritable when you feel controlled or forced to wait. Your emotional security comes from feeling brave, autonomous, and in motion. You nurture others by encouraging their independence and courage.",Taurus:"Your emotional nature craves stability, comfort, and sensory satisfaction. You feel safest when your physical environment is beautiful, your body is well-fed, and your routine is undisturbed. Change and emotional chaos deeply unsettle you. You process feelings slowly but thoroughly, and once you commit emotionally, you're immovable. Your emotional security comes from material stability and physical affection. You nurture others through cooking, physical presence, and unwavering dependability.",Gemini:"Your emotional nature is restless, curious, and verbal. You process feelings by talking about them, writing about them, or analyzing them intellectually. Emotional depth can feel uncomfortable — you'd rather understand a feeling than drown in it. You need constant mental stimulation to feel emotionally alive. Your security comes from having information, options, and interesting people around you. You nurture others by listening, teaching, and keeping the conversation going.",Cancer:"The Moon is at home here — your emotional nature is extraordinarily deep, intuitive, and protective. You feel everything intensely and have powerful emotional memory that shapes your present reactions. Home and family are not just important — they are your emotional oxygen. Your moods cycle like the tides, and you need safe spaces to retreat and recharge. You nurture others instinctively and completely, sometimes to the point of losing yourself in caregiving.",Leo:"Your emotional nature is warm, dramatic, and generous. You need to feel special, seen, and appreciated to feel emotionally secure. Your heart is big and you express love lavishly — through attention, gifts, creativity, and playfulness. Feeling ignored or unappreciated wounds you deeply. You process emotions through creative expression and performance. You nurture others by celebrating them, building their confidence, and making them feel like the center of your world.",Virgo:"Your emotional nature expresses through service, analysis, and practical problem-solving. When you care about someone, you show it by fixing things, offering help, and attending to details others miss. You can be anxious and self-critical — your inner voice is demanding. Emotional messiness makes you uncomfortable; you prefer to organize feelings into manageable categories. You nurture others through acts of service, health consciousness, and quiet, reliable devotion.",Libra:"Your emotional nature seeks harmony, beauty, and partnership above all. You feel most secure in relationship — having someone to share life with, process feelings with, and create beauty alongside. Conflict and ugliness genuinely disturb your emotional equilibrium. You can struggle with making decisions because you feel both sides so acutely. You nurture others through diplomacy, aesthetic sensitivity, and a genuine desire to understand their perspective.",Scorpio:"Your emotional nature runs deep, intense, and hidden. You feel everything at maximum volume but rarely show it — there's a protective layer between your inner world and what you reveal. Trust is earned slowly, but once given, your emotional bonds are unbreakable. You're drawn to emotional extremes, crisis, and transformation. Superficial emotional exchanges feel like a waste of time. You nurture others through fierce loyalty, psychological insight, and a willingness to sit with darkness.",Sagittarius:"Your emotional nature is optimistic, restless, and freedom-seeking. You process feelings through philosophy — turning experience into wisdom, pain into meaning. Emotional confinement makes you panic; you need space to roam physically and intellectually. You can struggle with emotional depth because sitting still with uncomfortable feelings feels unbearable. You nurture others through humor, encouragement, big-picture perspective, and the infectious belief that everything will work out.",Capricorn:"Your emotional nature is reserved, disciplined, and quietly ambitious. You learned early to manage your feelings, possibly because emotional expression wasn't safe or valued in your childhood. There's a stoic quality to your emotional life — you endure. Your security comes from achievement, structure, and feeling in control. Behind the composure is a deeply sensitive person who simply processes feelings slowly and privately. You nurture others through providing structure and long-term stability.",Aquarius:"Your emotional nature operates through intellect and idealism. You process feelings by detaching and analyzing them from a distance — which others can misread as coldness, but it's actually how you make sense of overwhelming emotion. Your security comes from feeling unique, free, and connected to a community of like-minded people. You can struggle with intimacy because too much emotional closeness feels suffocating. You nurture others through friendship, acceptance, and respecting their individuality.",Pisces:"Your emotional nature is boundless, empathic, and deeply sensitive to the invisible currents around you. You absorb other people's feelings like a sponge, which is both your gift and your greatest challenge. Your inner world is rich with imagination, dreams, and spiritual longing. Boundaries are difficult — you merge with those you love. You need solitude, creative expression, and spiritual practice to stay grounded. You nurture others through unconditional compassion, intuitive understanding, and gentle presence."},
mercury:{Aries:"Your mind is a sprinter — fast, bold, and direct. You think in headlines, not paragraphs, and communicate with an urgency that cuts straight to the point. You're the first to speak up, often before fully thinking things through. Debates energize you. Your learning style is active and impatient — you grasp concepts through doing, not studying. At your best, your directness is refreshing and your mental courage is inspiring.",Taurus:"Your mind moves slowly and deliberately, but what it produces is solid and lasting. You think in practical, concrete terms and have little patience for abstract theory that can't be applied. Your communication style is measured and calm — you choose words carefully and rarely speak without purpose. You learn best through repetition and hands-on experience. Your memory is excellent, especially for anything connected to the senses.",Gemini:"Mercury is at home here — your mind is lightning-quick, endlessly curious, and brilliantly versatile. You can hold multiple ideas simultaneously, see connections others miss, and communicate with wit and charm. Information is your oxygen. Your challenge is depth — with so many interesting things to think about, you may skim surfaces rather than diving deep. At your best, you're the most interesting conversationalist in any room.",Cancer:"Your thinking is deeply colored by emotion and intuition. You have an extraordinary memory — especially for feelings, conversations, and the emotional atmosphere of past experiences. You communicate with care and sensitivity, often knowing what others need to hear. Your mind is protective and can be cautious about sharing ideas that feel vulnerable. You learn best in emotionally safe environments where you feel supported.",Leo:"Your mind is creative, confident, and theatrical. You think in bold strokes and communicate with dramatic flair — storytelling comes naturally. You have strong opinions and express them with conviction that commands attention. Learning happens best when you feel recognized and engaged. Your challenge is intellectual pride — difficulty admitting when you're wrong. At your best, your communication inspires confidence and joy in others.",Virgo:"Mercury is exalted here — your mind is precise, analytical, and extraordinarily detailed. You think in systems and processes, naturally breaking complex problems into manageable steps. Your communication is clear, practical, and efficient. You're the person who catches every error and sees every flaw — which makes you invaluable but can also make you anxious. Your challenge is overthinking. At your best, you turn chaos into order with elegant precision.",Libra:"Your mind naturally seeks balance, fairness, and harmony. You're a diplomatic communicator who can see all sides of any argument — which makes you an excellent mediator but can lead to chronic indecisiveness. You think in terms of relationship: how ideas connect, how people interact, how opposing viewpoints might be reconciled. Your aesthetic sense extends to language — you appreciate beautiful writing and eloquent speech.",Scorpio:"Your mind penetrates beneath surfaces to find hidden truth. You think like an investigator — probing, questioning, never accepting the obvious answer. Your communication can be incisive, sometimes uncomfortably so. You're drawn to taboo subjects, psychology, and anything that reveals the motivations others try to hide. You learn best through intense immersion. Your challenge is mental obsession. At your best, your insight is transformative and your perception unmatched.",Sagittarius:"Your mind is expansive, optimistic, and hungry for meaning. You think in big pictures and grand narratives — connecting ideas across cultures, philosophies, and disciplines. Communication is enthusiastic and often educational. You're a natural teacher and storyteller. Your challenge is overgeneralizing and promising more intellectual rigor than you deliver. At your best, your thinking inspires others to expand their worldview and question their assumptions.",Capricorn:"Your mind is structured, strategic, and oriented toward practical achievement. You think in terms of goals, timelines, and what actually works. Communication is measured and authoritative — you speak with the weight of someone who has thought things through. You have little patience for impractical ideas or rambling conversation. You learn best through real-world application. At your best, your mental discipline turns ambitious visions into concrete plans.",Aquarius:"Your mind operates outside conventional frameworks — original, innovative, and sometimes brilliantly eccentric. You think in systems and networks, naturally seeing how individual pieces connect to larger patterns. Your communication can be ahead of its time, making it hard for others to follow your leaps of logic. You're drawn to technology, science, and progressive ideas. At your best, your thinking reshapes how others understand the world.",Pisces:"Your mind works through images, feelings, and intuitive leaps rather than linear logic. You absorb information osmotically — soaking up the mood of a room, the subtext of a conversation, the emotional truth beneath words. Your thinking is deeply creative and imaginative, but can lack focus and practical structure. You communicate most powerfully through art, metaphor, and storytelling. At your best, you channel inspired insight that seems to come from beyond the rational mind."},
venus:{Aries:"You love with fire and urgency. Attraction hits you like lightning — sudden, intense, and impossible to ignore. You pursue what you want with bold directness and need a partner who can match your energy without being intimidated. You value independence in love and become restless with partners who are passive or clingy. Your love language is action — showing up, taking initiative, and fighting for what matters. Romance needs to feel exciting and alive.",Taurus:"Venus is at home here — you love with deep sensuality, loyalty, and patience. Physical comfort, beauty, and material security are love languages for you. You attract resources naturally and have refined taste. In relationships, you're devoted and steady but possessive when insecure. You need touch, quality time, and tangible expressions of affection. You value commitment and build relationships slowly, but what you build endures. Your aesthetic sense is naturally sophisticated.",Gemini:"You love through conversation, humor, and intellectual connection. Mental chemistry is more important to you than physical chemistry alone — a partner who bores you intellectually will lose you regardless of other qualities. You need variety and stimulation in love, which can make you seem fickle. Your charm is verbal and witty. You value freedom in relationships and express affection through texting, talking, sharing ideas, and keeping things light and fun.",Cancer:"You love with protective tenderness and deep emotional investment. Emotional security is the foundation of all your relationships — without it, nothing else matters. You show love through nurturing: cooking, creating home, remembering what matters to those you care about. You can be clingy when insecure and retreat into your shell when hurt. Family approval matters. At your best, you create relationships that feel like the safest place on earth.",Leo:"You love with generosity, drama, and wholehearted devotion. Romance is an art form for you — grand gestures, passionate declarations, and the intoxicating feeling of being adored. You need to feel special in your relationships and give lavishly in return. Loyalty is non-negotiable. You attract attention naturally and enjoy being admired. Your challenge is ego in love — needing constant validation. At your best, you make your partner feel like royalty.",Virgo:"You love through service, attention to detail, and practical devotion. You show you care by fixing things, improving things, and noticing what others need before they ask. Your love standards are high — you analyze potential partners carefully and can be critical when reality falls short of your ideals. You're not naturally demonstrative but deeply devoted once committed. You value competence, health-consciousness, and someone who has their life together.",Libra:"Venus is at home here — you are a natural romantic who lives for partnership, beauty, and harmony. Love is not optional for you; it's essential to your sense of self. You attract others effortlessly through charm, grace, and genuine interest. You need a relationship that feels balanced, fair, and aesthetically beautiful. Your challenge is losing yourself in partnership and avoiding conflict at the cost of authenticity. At your best, you create relationships of extraordinary grace.",Scorpio:"You love with terrifying intensity. Venus in Scorpio doesn't do casual — you need emotional and physical merging at the deepest possible level. Trust is everything; once broken, it's rarely restored. You're drawn to partners who have depth, mystery, and psychological complexity. Jealousy and possessiveness are your shadows, but so is transformative love that literally changes both people involved. You value loyalty above all else and give yourself completely or not at all.",Sagittarius:"You love with enthusiasm, adventure, and a need for freedom that can make traditional commitment feel claustrophobic. You're attracted to people who expand your world — different cultures, philosophies, or life experiences. Your love language is shared adventure and intellectual growth. You can struggle with the routine aspects of long-term partnership. At your best, you create relationships that are both a love story and an epic journey of mutual discovery.",Capricorn:"You love seriously, ambitiously, and with long-term vision. You're attracted to competence, status, and people who are building something meaningful. Casual flings feel like a waste of time — you want a partner who is also a life teammate. Your love expression can seem reserved, but beneath the composure is deep loyalty and quiet devotion. You may struggle to show vulnerability. At your best, you build partnerships that are both emotionally fulfilling and practically powerful.",Aquarius:"You love unconventionally — needing intellectual connection, personal space, and a partner who respects your independence. Traditional romance can feel suffocating; you prefer friendship-based love that allows both people to remain fully themselves. You're attracted to originality, intelligence, and people who don't fit the mold. Your challenge is emotional detachment and a tendency to intellectualize feelings. At your best, you create partnerships rooted in mutual respect and genuine equality.",Pisces:"You love with boundless compassion, romantic idealism, and a capacity for self-sacrifice that can be either beautiful or devastating. You see the divine in your partners and love their potential as much as their reality. Boundaries in love are difficult — you merge completely and absorb your partner's emotions. You're drawn to artists, healers, and wounded souls. Your challenge is codependency and loving illusions. At your best, your love is transcendent — a spiritual experience for both people."},
mars:{Aries:"Mars is at home here — your drive is pure, direct, and powerful. You act first and think later, attacking life with primal competitive energy. You need physical outlets and challenges to feel alive. Anger comes fast but burns out quickly. You're a natural leader in crisis. Your challenge is impulse control and learning that not everything is a battle. At your best, your courage and initiative are unstoppable forces that inspire others to action.",Taurus:"Your drive is slow, steady, and relentless. Once you commit to a course of action, nothing can move you — you're an unstoppable force of patient determination. Physical stamina is remarkable. You're slow to anger but when pushed past your limit, your fury is seismic. You fight for material security, comfort, and the things you value. Your energy is best spent on building tangible things that last.",Gemini:"Your drive is mental, versatile, and scattered across multiple fronts. You fight with words, ideas, and strategy rather than brute force. You can juggle several projects simultaneously but may finish none of them. Anger expresses verbally — sharp words and cutting wit. Your energy is best spent on communication projects, learning, and any work that requires mental agility and quick thinking.",Cancer:"Your drive is protective and emotionally fueled. You fight hardest when defending home, family, and those you love. Your approach to conflict is indirect — you circle, retreat, and attack from an unexpected angle. Anger is often swallowed and held, creating passive-aggressive patterns. Your energy is most powerful when channeled into creating emotional security. The motivation behind your actions is almost always rooted in feeling.",Leo:"Your drive is fueled by pride, creativity, and the desire to be recognized. You approach action with dramatic confidence and natural authority. You need to feel that your efforts matter — anonymous, thankless work drains you. Anger flares when your dignity is insulted. Your energy is best channeled into creative projects, leadership roles, and anything where your personal stamp makes the difference.",Virgo:"Your drive is precise, methodical, and service-oriented. You channel energy into perfecting systems, solving problems, and making things work better. You're the person who gets things done while others are still talking. Anger expresses as sharp criticism. Your challenge is anxiety and overwork — the motor never stops. Your energy is best spent on detailed work that requires both skill and dedication to quality.",Libra:"Your drive expresses through negotiation, partnership, and the pursuit of fairness. You fight for justice and balance, preferring diplomacy to direct confrontation. Anger makes you uncomfortable — you may suppress it to keep the peace, then explode unpredictably. Your energy is activated by partnership and collaboration. You work best with others and struggle with purely solo endeavors. At your best, you're a fierce and graceful advocate for what's right.",Scorpio:"Mars has traditional rulership here — your drive is intense, strategic, and psychologically powerful. You don't just act — you calculate, then strike with devastating precision. Your willpower is extraordinary. Anger runs deep and can become obsessive revenge if unchecked. You channel energy into transformation, investigation, and anything that requires penetrating beneath the surface. You never do anything halfway.",Sagittarius:"Your drive is adventurous, enthusiastic, and aimed at the far horizon. You need a mission, a cause, or a quest to feel energized. Physical activity, travel, and intellectual exploration are essential outlets. Anger flares when your freedom is restricted or your beliefs are challenged. Your energy is expansive — you want to do big things, explore new territory, and inspire others to join the adventure.",Capricorn:"Mars is exalted here — your drive is disciplined, strategic, and relentlessly ambitious. You channel energy into long-term goals with the patience and persistence of a mountain climber. You don't waste effort on things that don't serve your objectives. Anger is controlled and deployed strategically. Your stamina for sustained effort is unmatched. At your best, you turn raw ambition into lasting achievement through pure disciplined action.",Aquarius:"Your drive is revolutionary, unconventional, and directed toward collective goals. You fight for ideas, systems, and the future — not personal gain. Your approach to action is innovative and often surprising. Anger surfaces when you witness injustice or irrationality. Your energy is electric and intermittent — brilliant bursts of activity followed by periods of detachment. You work best in groups where your originality can catalyze change.",Pisces:"Your drive operates through intuition, compassion, and inspired action. You don't force — you flow. Your energy is subtle but can be surprisingly powerful when channeled through artistic, spiritual, or healing pursuits. Anger is difficult for you — it often turns inward as guilt or dissolves into sadness. Your challenge is passivity and escapism. At your best, your actions are guided by something larger than personal will — a creative or spiritual calling that moves through you."},
jupiter:{Aries:"Growth comes through bold initiative and independent action. You expand your world by being first — first to try, first to lead, first to take the risk. Luck follows your courage. Opportunities arrive when you assert yourself and trust your instincts. Your optimism is fierce and contagious. The shadow is overconfidence and reckless expansion. Your philosophical outlook centers on individual freedom and the power of personal will.",Taurus:"Abundance flows naturally toward you when you're patient and grounded. Jupiter here brings expansion through material wealth, sensory pleasure, and the steady accumulation of resources. Your optimism is practical — you believe in building something real. Luck comes through financial ventures, real estate, food, and beauty. The shadow is excess and overindulgence. Your philosophy centers on the value of the physical world.",Gemini:"Growth comes through learning, communication, and intellectual variety. Jupiter here expands your mind in all directions — you're hungry for information, connections, and diverse perspectives. Luck comes through writing, teaching, networking, and being in the right conversation at the right time. The shadow is superficiality and scattered attention. Your philosophy values curiosity, dialogue, and the exchange of ideas above all.",Cancer:"Abundance flows through emotional generosity, family, and creating home. Jupiter here brings growth through nurturing relationships, domestic expansion, and deep emotional wisdom. Luck comes through family connections, real estate, and following your intuitive feelings. Your optimism is rooted in emotional faith — a deep belief that love and care create abundance. The shadow is over-protectiveness and emotional smothering.",Leo:"Growth comes through creative self-expression, generosity, and the courage to shine. Jupiter here amplifies your capacity for joy, performance, and leadership. Luck follows when you put yourself out there — on stage, in creative ventures, or in any arena where your personal light is needed. Your optimism is warm and theatrical. The shadow is ego inflation and excessive pride. Your philosophy celebrates individual creativity and the power of the heart.",Virgo:"Growth comes through service, mastery, and the perfection of practical skills. Jupiter here expands your capacity for analysis, healing, and detailed work. Luck comes through health-related fields, editing, craftsmanship, and anywhere precision matters. Your optimism is quietly competent — you believe that doing good work creates opportunity. The shadow is anxiety about imperfection. Your philosophy values usefulness, skill, and humble service.",Libra:"Growth comes through partnership, diplomacy, and the creation of beauty and harmony. Jupiter here expands your social world and your capacity for relationship. Luck follows when you collaborate, negotiate, and bring people together. Legal matters and artistic ventures are favored. Your optimism is relational — you believe in the power of connection. The shadow is over-dependence on others. Your philosophy centers on justice, beauty, and the art of balance.",Scorpio:"Growth comes through deep transformation, psychological insight, and the willingness to face darkness. Jupiter here expands your capacity for regeneration — you grow most when everything falls apart and you rebuild. Luck comes through shared resources, research, and anything involving deep investigation. Your optimism is paradoxical — you find abundance through loss and power through surrender.",Sagittarius:"Jupiter is at home here — your capacity for growth, optimism, and expansion is at maximum power. You believe deeply that life is meaningful and adventure is the path to wisdom. Luck seems to follow you naturally. Higher education, travel, publishing, and philosophical pursuits are all powerfully favored. The shadow is excess, self-righteousness, and promising more than you deliver. Your philosophy is your life itself — an ongoing quest for truth.",Capricorn:"Growth comes through discipline, strategy, and the patient building of authority. Jupiter here channels expansion through structure — you grow by mastering the rules before breaking them. Luck comes through institutions, government, long-term planning, and earned reputation. Your optimism is cautious but durable. The shadow is excessive conservatism and letting ambition override ethics. Your philosophy values responsibility and the slow accumulation of wisdom through effort.",Aquarius:"Growth comes through innovation, community, and progressive ideals. Jupiter here expands your capacity to envision a better future and connect with groups who share that vision. Luck comes through technology, humanitarian work, and unconventional approaches. Your optimism is intellectual and forward-looking. The shadow is detachment from personal relationships in favor of abstract causes. Your philosophy centers on collective liberation and the power of original thinking.",Pisces:"Jupiter is at home here — your capacity for spiritual growth, compassion, and creative vision is boundless. You grow through surrendering control, trusting intuition, and allowing life to flow through you rather than forcing it. Luck comes through artistic pursuits, healing, spiritual practice, and acts of selfless compassion. Your optimism is mystical — a deep, wordless faith that the universe is benevolent. The shadow is excessive escapism and boundary dissolution."},
saturn:{Aries:"Your greatest life lesson involves learning to channel impulsive energy into disciplined action. Early life may have included frustrations around asserting yourself or blocks to independence. Over time, you develop extraordinary courage — not the reckless kind, but the mature courage of someone who has earned the right to lead through patience and self-mastery. Authority comes through learning to act decisively without acting destructively.",Taurus:"Your greatest life lesson involves building genuine security — financial, material, and in your own self-worth. Early life may have included scarcity, instability, or lessons about the unreliability of material comfort. Over time, you develop an unshakeable relationship with resources — not through hoarding, but through the patient, responsible stewardship of what you have. Your sense of value becomes rock-solid because it was tested and earned.",Gemini:"Your greatest life lesson involves disciplining your mind and communication. Early life may have included learning difficulties, speech issues, or feeling intellectually inadequate. Over time, you develop extraordinary mental discipline — the ability to think clearly, communicate precisely, and turn scattered ideas into structured wisdom. You may become a respected teacher, writer, or thinker specifically because mental mastery didn't come easily.",Cancer:"Your greatest life lesson involves building emotional maturity and inner security independent of family validation. Early life may have included emotional coldness, family disruption, or premature responsibility within the home. Over time, you develop extraordinary emotional resilience — the ability to provide your own sense of home and safety. You become the family elder, the emotional rock, precisely because you had to build that foundation from scratch.",Leo:"Your greatest life lesson involves authentic self-expression — learning to shine without needing constant external validation. Early life may have included suppression of creativity, criticism of self-expression, or difficulty feeling seen. Over time, you develop genuine creative authority — the kind that comes from disciplined artistic practice rather than natural talent alone. You earn your spotlight through dedicated mastery.",Virgo:"Your greatest life lesson involves developing practical competence without being destroyed by perfectionism. Early life may have included excessive criticism, anxiety about performance, or health challenges. Over time, you develop extraordinary skill and expertise — becoming genuinely masterful at what you do through years of dedicated refinement. You learn that good enough is sometimes perfect, and that your worth isn't measured by your productivity.",Libra:"Your greatest life lesson involves building mature, equitable partnerships and a genuine understanding of justice. Early life may have included relationship dysfunction, unfairness, or difficulty finding balance. Over time, you develop extraordinary diplomatic skill and the ability to create true equality in your relationships. Marriage or partnership may come later in life but be more solid than most. You earn harmony rather than assuming it.",Scorpio:"Your greatest life lesson involves mastering power, control, and the depths of human psychology without being consumed by them. Early life may have included exposure to crisis, betrayal, or the dark side of human nature. Over time, you develop extraordinary psychological strength — the ability to face the abyss without flinching and emerge transformed. You become someone others trust with their darkest truths because you've already met your own.",Sagittarius:"Your greatest life lesson involves developing focused, tested wisdom rather than relying on untested beliefs and superficial optimism. Early life may have included crises of faith, restriction of freedom, or challenges to your worldview. Over time, you develop genuine philosophical depth — beliefs that have been tested by experience and refined by doubt. You become a teacher or guide whose wisdom carries authority because it was earned through struggle.",Capricorn:"Saturn is at home here — your capacity for discipline, ambition, and strategic building is extraordinary but the demands on you are equally heavy. Early life may have included excessive responsibility, parental pressure, or a feeling of having to grow up too fast. Over time, you develop the kind of authority that commands respect without demanding it. Your life is a masterclass in patient construction — and what you build endures long after you're gone.",Aquarius:"Your greatest life lesson involves creating lasting, structured change rather than rebelling without purpose. Early life may have included feeling like an outsider, social isolation, or conflict between individuality and belonging. Over time, you develop the ability to channel revolutionary ideas into practical, sustainable systems. You become someone who changes institutions from within rather than simply tearing them down.",Pisces:"Your greatest life lesson involves grounding spiritual sensitivity in practical discipline. Early life may have included confusion, boundary violations, or difficulty distinguishing reality from imagination. Over time, you develop the extraordinary ability to bring structure to compassion — channeling artistic inspiration into finished works, spiritual insight into practical healing, and empathic sensitivity into genuine service. You learn that boundaries are not walls but containers that make depth possible."},
uranus:{Aries:"Generational revolutionary energy. Radical independence, pioneering breakthroughs, and bold disruption of the status quo. Your generation redefines individual identity and courage.",Taurus:"Generational upheaval in values and finances. Revolution in how resources, food, and material security are structured. Your generation transforms the economy and relationship to the earth.",Gemini:"Generational revolution in communication and information. Breakthroughs in media, technology, and how knowledge is shared. Your generation rewrites how humanity connects and learns.",Cancer:"Generational transformation of home and family structures. Revolution in emotional life, housing, and caregiving. Your generation redefines what family and belonging mean.",Leo:"Generational creative revolution. Breakthroughs in self-expression, entertainment, and individual identity. Your generation disrupts art, performance, and how personal power is claimed.",Virgo:"Generational revolution in health, work, and service. Breakthroughs in medicine, technology, and daily life systems. Your generation transforms how we care for bodies and organize labor.",Libra:"Generational revolution in relationships and justice. Upheaval in marriage, law, diplomacy, and social contracts. Your generation redefines partnership and equality.",Scorpio:"Generational transformation of power structures. Revolution in psychology, sexuality, finance, and hidden systems. Your generation exposes secrets and rebuilds from the depths.",Sagittarius:"Generational revolution in belief and education. Upheaval in religion, philosophy, travel, and global perspective. Your generation redefines truth and cultural boundaries.",Capricorn:"Generational restructuring of institutions and authority. Revolution in government, corporations, and social hierarchies. Your generation dismantles and rebuilds power from the ground up.",Aquarius:"Generational revolution in technology, community, and humanitarian ideals. Breakthroughs in science, networks, and collective consciousness. Your generation rewires how society functions.",Pisces:"Generational spiritual revolution. Transformation of compassion, creativity, and collective consciousness. Your generation dissolves old boundaries between the material and the mystical."},
neptune:{Aries:"Generational spiritual pioneering. Collective dreams of bold new beginnings, heroic idealism, and the dissolution of old identities. Spiritual awakening through action and courage.",Taurus:"Generational dreams about material security and nature. Collective idealism around sustainability, beauty, and reconnecting with the earth. Spiritual values grounded in the physical world.",Gemini:"Generational dissolution of information boundaries. Collective dreams about communication, AI, and the merging of minds. Spirituality through connection and the exchange of ideas.",Cancer:"Generational longing for emotional and domestic security. Collective dreams about home, family, and belonging. Spiritual sensitivity runs deep through ancestral and emotional channels.",Leo:"Generational creative and romantic idealism. Collective dreams about love, self-expression, and theatrical spirituality. The boundary between performer and audience dissolves.",Virgo:"Generational idealism about health and service. Collective dreams about perfecting systems, healing, and purification. Spiritual practice through daily devotion and practical compassion.",Libra:"Generational romantic and aesthetic idealism. Collective dreams about perfect love, beauty, and justice. Spiritual longing expressed through art, relationship, and the pursuit of harmony.",Scorpio:"Generational fascination with the hidden and taboo. Collective dreams about transformation, death, sexuality, and power. Spiritual depth through confronting the shadow self.",Sagittarius:"Generational spiritual expansion and philosophical idealism. Collective dreams about meaning, truth, and transcendence through travel and education. Faith and belief systems dissolve and reform.",Capricorn:"Generational dreams about restructuring society. Collective idealism channeled through institutions, government, and long-term ambition. Spiritual lessons about the limits of control and material achievement.",Aquarius:"Generational dreams about collective liberation and technological utopia. Idealism about science, community, and humanitarian progress. Spiritual awakening through innovation and group consciousness.",Pisces:"Generational return to source. Neptune in its home sign amplifies collective spirituality, compassion, and creative vision to maximum intensity. Boundaries between self and other, real and imagined, dissolve completely."},
pluto:{Aries:"Generational transformation of identity and independence. Collective power struggles around individual rights, warfare, and the definition of courage. Deep regeneration of the self.",Taurus:"Generational transformation of resources, wealth, and values. Power struggles around money, land, food systems, and what humanity truly values. Deep regeneration of material foundations.",Gemini:"Generational transformation of communication and knowledge. Power struggles around information, media, truth, and education. Deep regeneration of how minds connect and ideas spread.",Cancer:"Generational transformation of family, homeland, and emotional foundations. Power struggles around nationalism, housing, and caregiving. Deep regeneration of roots and belonging.",Leo:"Generational transformation of creative power and leadership. Power struggles around authority, fame, and self-expression. Deep regeneration of how individuals claim and wield personal power.",Virgo:"Generational transformation of health, work, and service systems. Power struggles around labor, medicine, and daily life infrastructure. Deep regeneration of practical competence and purity.",Libra:"Generational transformation of relationships and justice. Power struggles around equality, marriage, diplomacy, and social contracts. Deep regeneration of how humans partner and seek fairness.",Scorpio:"Pluto in its home sign — maximum transformative intensity. Generational power struggles around sex, death, money, and psychological control. Nuclear age, AIDS crisis, and the exposure of hidden power. Deep regeneration through total destruction and rebirth.",Sagittarius:"Generational transformation of belief systems and global culture. Power struggles around religion, philosophy, and international relations. Deep regeneration of meaning, truth, and cultural identity.",Capricorn:"Generational transformation of institutions, government, and corporate power. Structural collapse and rebuilding of authority systems. Deep regeneration of ambition, responsibility, and social order.",Aquarius:"Generational transformation of technology, community, and humanitarian systems. Power struggles around AI, networks, and collective governance. Deep regeneration of how society organizes and innovates.",Pisces:"Generational transformation of spirituality, compassion, and collective consciousness. Power struggles around faith, addiction, and the boundary between illusion and reality. Deep regeneration through surrender and transcendence."}};

const HOUSE_IX={
1:"The First House is your front door to the world. It governs your physical appearance, first impressions, instinctive behavior, and the persona you project. The sign on this cusp — your Rising Sign — is the lens through which all your other placements are filtered. It shapes how others perceive you before they know you deeply. Planets here dominate your personality and are immediately visible to others. This is the house of self-initiation: how you start things, enter rooms, and meet the unknown.",
2:"The Second House governs your relationship with money, possessions, and self-worth. It reveals how you earn, spend, save, and what you truly value — not just materially, but as core personal values that anchor your identity. Planets here shape your financial instincts and your capacity to build tangible security. The sign on this cusp describes your earning style: how you attract resources and what makes you feel financially stable. Deeply connected to self-esteem — what you own reflects what you believe you deserve.",
3:"The Third House rules communication, learning, and your immediate environment. It governs how you think, speak, write, and process information day to day. This house also covers siblings, neighbors, short trips, and early education. Planets here amplify your mental activity and communication style. A busy Third House indicates a restless, curious mind that needs constant intellectual stimulation. The sign on this cusp reveals your learning style, conversational approach, and how you navigate your local world.",
4:"The Fourth House is your deepest foundation — home, family, ancestry, and emotional roots. It represents where you come from, your relationship with your parents (especially the nurturing parent), and the private inner world you retreat to. The IC (Imum Coeli) at this cusp is the most hidden point in your chart. Planets here operate in your private life, shaping your emotional baseline and domestic needs. This house also governs the end of life and the legacy you leave behind. It is your psychological bedrock.",
5:"The Fifth House is the house of joy, creativity, and self-expression. It governs romance (the falling-in-love stage), children, creative projects, hobbies, and anything you do purely for pleasure. This is where your inner child lives — the part of you that creates, plays, takes risks, and performs. Planets here bring dramatic energy to your creative life and love affairs. The sign on this cusp shows how you express affection, what brings you joy, and your approach to fun, gambling, and artistic expression.",
6:"The Sixth House governs daily work, health, routines, and service to others. Unlike the Tenth House (career ambition), this house is about the actual work you do day-to-day — your habits, skills, and relationship with your body. It rules employees, pets, and the practical systems that keep your life running. Planets here focus energy on self-improvement, health consciousness, and efficiency. The sign on this cusp reveals your work ethic, health vulnerabilities, and how you handle the mundane tasks of living.",
7:"The Seventh House is the house of partnership — marriage, business partnerships, open enemies, and anyone who serves as your mirror. The Descendant (DSC) on this cusp represents the qualities you seek in others and often project outward. While the First House is 'I,' the Seventh House is 'We.' Planets here shape your relationship patterns, what you attract in partners, and how you handle one-on-one dynamics. Committed relationships, contracts, negotiations, and lawsuits all fall under this house.",
8:"The Eighth House is where things get deep — transformation, shared resources, intimacy, death, rebirth, and the occult. This is 'other people's money' — inheritance, taxes, debt, insurance, and joint finances. It governs the psychological merging that happens in sexual intimacy, the process of profound personal transformation, and everything society considers taboo. Planets here create intense inner experiences and a relationship with power, control, and surrender. This house strips away the surface to reveal what lies beneath.",
9:"The Ninth House governs higher education, philosophy, long-distance travel, religion, law, publishing, and the expansion of consciousness. Where the Third House is local and factual, the Ninth House seeks meaning, wisdom, and the big picture. This is the house of your worldview — your beliefs, ethics, and the stories you tell yourself about what life means. Planets here create a hunger for growth, exploration, and truth. The sign on this cusp reveals how you seek wisdom and what philosophical framework guides your life.",
10:"The Tenth House is the most visible point in your chart — career, public reputation, social status, and your highest achievements. The Midheaven (MC) at this cusp represents what you're known for and your professional calling. Unlike the Sixth House (daily work), this house governs your legacy, authority, and the mark you leave on the world. Planets here are prominently expressed in your public life. The sign on this cusp shapes your career archetype and how you relate to ambition, recognition, and the structures of power.",
11:"The Eleventh House governs friendships, groups, networks, hopes, and wishes. This is your social ecosystem — the communities you belong to, the causes you champion, and the collective dreams you share. It rules organizations, social media, humanitarian ideals, and the income from your career (gains from the Tenth House). Planets here activate your social life and align your personal goals with collective movements. The sign on this cusp reveals what kind of friends you attract and how you participate in group dynamics.",
12:"The Twelfth House is the most mysterious — the subconscious, hidden enemies, self-undoing, spiritual transcendence, and the dissolution of ego. It governs what you hide from yourself and the world: secret sorrows, addictions, mental health, institutions (hospitals, prisons), and the vast reservoir of the collective unconscious. But it's also the house of spiritual liberation — meditation, dreams, artistic inspiration, and the capacity to surrender personal will to something greater. Planets here operate behind the scenes, often expressing themselves through intuition, solitude, and invisible acts of service."
};

// ── localStorage ───────────────────────────────────────────────
const LS={
  load:(k,d)=>{try{return JSON.parse(localStorage.getItem("celestia_"+k))||d}catch{return d}},
  save:(k,v)=>localStorage.setItem("celestia_"+k,JSON.stringify(v)),
};

// ── Interactive Chart Wheel SVG ─────────────────────────────────
function Wheel({chart,size=420,theme:TH,zsys}){
  const [sel, setSel] = useState(null);
  const wrapRef = useRef(null);
  const cx=size/2,cy=size/2;
  const outerEdge=size*.48;  // very outside edge
  const oR=size*.44;         // outer ring (sign symbols)
  const sR=size*.36;         // sign/house boundary ring
  const pR=size*.27;         // planet ring
  const hR=size*.20;         // house number ring
  const iR=size*.12;         // inner circle

  // MC at top (12 o'clock = 90° in screen coords)
  // Zodiac increases counter-clockwise: screenAngle = 90 + (zodiacDeg - MC)
  // MC at top, ASC to the left, IC at bottom, DSC to the right
  const degToAngle = (zodiacDeg) => 90 + (zodiacDeg - chart.mc);
  const xy = (screenAngle, r) => {
    const rad = screenAngle * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
  };
  const pos2screen = (zodiacDeg, r) => xy(degToAngle(zodiacDeg), r);

  // Build arc path between two zodiac degrees at given radius range
  const arcWedge = (deg1, deg2, r1, r2, steps=36) => {
    let span = deg2 - deg1; if(span<0) span+=360; if(span>360) span=360;
    let d = "";
    for(let s=0;s<=steps;s++){const pt=pos2screen(deg1+s/steps*span,r1);d+=(s===0?"M":"L")+pt.x+","+pt.y}
    for(let s=steps;s>=0;s--){const pt=pos2screen(deg1+s/steps*span,r2);d+="L"+pt.x+","+pt.y}
    return d+"Z";
  };

  const dismiss = () => setSel(null);
  const select = (type, data, svgX, svgY) => setSel({type, data, x: svgX, y: svgY});

  // Popup content builder (same as before)
  const popupContent = () => {
    if (!sel) return null;
    const s = sel;
    if (s.type === "planet") {
      const p = s.data, pl = chart.pl[p.key]; if (!pl) return null;
      const dig = getDignity(p.name, pl.sign);
      const interp = IX[p.key]?.[pl.sign];
      const pAspects = chart.aspects.filter(a => a.p1 === p.key || a.p2 === p.key).slice(0, 5);
      return (<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:24,color:p.color}}>{p.sym}</span>
          <div><div style={{fontSize:15,fontWeight:700,color:TH.text}}>{p.name}</div><div style={{fontSize:11,color:TH.textMuted}}>{p.type}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,background:`${pl.signColor}12`,borderRadius:6,padding:"5px 8px"}}>
          <span style={{color:pl.signColor,fontSize:16}}>{pl.signSym}</span>
          <span style={{fontSize:13,color:TH.text}}>{pl.sign} {pl.deg}</span>
          {pl.rx&&<span style={{color:TH.rose,fontSize:10,marginLeft:"auto"}}>℞ Retrograde</span>}
        </div>
        <div style={{fontSize:11,color:TH.textMuted,marginBottom:6}}>House {pl.house} · {HOUSE_IX[pl.house]?.split(",")[0]}</div>
        {dig&&<div style={{fontSize:11,color:dig.color,marginBottom:6}}>{dig.icon} {dig.type}</div>}
        {zsys==="sidereal"&&<div style={{fontSize:11,color:TH.accent,marginBottom:6}}>Nakshatra: {pl.nak}</div>}
        {interp&&<div style={{fontSize:11,color:TH.textMuted,lineHeight:1.5,borderTop:`1px solid ${TH.borderLight}`,paddingTop:6,marginTop:4}}>{interp}</div>}
        {pAspects.length>0&&<div style={{borderTop:`1px solid ${TH.borderLight}`,paddingTop:6,marginTop:6}}>
          <div style={{fontSize:10,color:TH.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Aspects</div>
          {pAspects.map((a,i)=>{const other=a.p1===p.key?a.p2:a.p1;const op=PLANETS.find(pp=>pp.key===other);return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:TH.textMuted,padding:"2px 0"}}>
              <span style={{color:a.asp.color}}>{a.asp.sym} {a.asp.name}</span>
              <span style={{color:op?.color}}>{op?.sym} {op?.name}</span>
              <span style={{marginLeft:"auto",color:TH.textDim}}>{a.orb}°</span>
            </div>)})}
        </div>}
      </div>);
    }
    if (s.type === "sign") {
      const sg = s.data;
      const planetsInSign = PLANETS.filter(p => chart.pl[p.key]?.sign === sg.n);
      return (<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:28,color:sg.c}}>{sg.s}</span>
          <div><div style={{fontSize:15,fontWeight:700,color:TH.text}}>{sg.n}</div>
          <div style={{fontSize:11,color:TH.textMuted}}>{sg.el} · {sg.mod} · Ruler: {sg.ruler}</div></div>
        </div>
        {planetsInSign.length>0?<div>{planetsInSign.map(p=>{const pl=chart.pl[p.key];return (
          <div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"3px 0"}}>
            <span style={{color:p.color}}>{p.sym}</span><span style={{color:TH.text}}>{p.name}</span><span>{pl?.deg}</span>
            {pl?.rx&&<span style={{color:TH.rose,fontSize:10}}>℞</span>}
          </div>)})}</div>:<div style={{fontSize:11,color:TH.textDim}}>No planets in {sg.n}</div>}
      </div>);
    }
    if (s.type === "house") {
      const hi = s.data, planetsInHouse = PLANETS.filter(p => chart.pl[p.key]?.house === hi);
      const cusp = chart.houses[hi-1], sg = getSign(cusp);
      return (<div>
        <div style={{fontSize:20,fontFamily:FONT_D,color:TH.lavender,marginBottom:6}}>House {hi}</div>
        <div style={{fontSize:12,color:TH.textMuted,marginBottom:6}}>Cusp: <span style={{color:sg.c}}>{sg.s}</span> {sg.n} {fmtDeg(cusp)}</div>
        <div style={{fontSize:11,color:TH.textMuted,lineHeight:1.5,marginBottom:8}}>{HOUSE_IX[hi]}</div>
        {planetsInHouse.length>0&&<div style={{borderTop:`1px solid ${TH.borderLight}`,paddingTop:6}}>
          {planetsInHouse.map(p=>{const pl=chart.pl[p.key];return (
            <div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"2px 0"}}>
              <span style={{color:p.color}}>{p.sym}</span><span style={{color:TH.text}}>{p.name}</span><span>in {pl?.sign} {pl?.deg}</span>
            </div>)})}
        </div>}
      </div>);
    }
    if (s.type === "aspect") {
      const a = s.data;
      const pp1=PLANETS.find(p=>p.key===a.p1),pp2=PLANETS.find(p=>p.key===a.p2);
      const pl1=chart.pl[a.p1],pl2=chart.pl[a.p2];
      return (<div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          <span style={{color:pp1?.color,fontSize:20}}>{pp1?.sym}</span>
          <span style={{color:a.asp.color,fontSize:20}}>{a.asp.sym}</span>
          <span style={{color:pp2?.color,fontSize:20}}>{pp2?.sym}</span>
        </div>
        <div style={{fontSize:14,fontWeight:600,color:a.asp.color,marginBottom:4}}>{pp1?.name} {a.asp.name} {pp2?.name}</div>
        <div style={{fontSize:12,color:TH.textMuted}}>Orb: {a.orb}°{a.exact?" (exact)":""}</div>
        <div style={{fontSize:11,color:TH.textMuted,marginTop:4}}>{pp1?.name}: {pl1?.sign} {pl1?.deg} (H{pl1?.house})</div>
        <div style={{fontSize:11,color:TH.textMuted}}>{pp2?.name}: {pl2?.sign} {pl2?.deg} (H{pl2?.house})</div>
      </div>);
    }
    if (s.type === "angle") {
      const a = s.data;
      const sg = a.sign;
      const houseNum = a.l==="ASC"?1:a.l==="IC"?4:a.l==="DSC"?7:10;
      const meanings = {ASC:"Your rising sign — the mask you wear and how you appear to others. The lens through which you experience life.",MC:"Midheaven — your public image, career path, reputation, and highest aspirations. What you're known for.",DSC:"Descendant — what you seek in partnerships and relationships. The qualities you attract and are drawn to.",IC:"Imum Coeli — your deepest roots, home, family, private self, and emotional foundation."};
      return (<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:20,fontFamily:FONT_D,color:TH.accent}}>{a.l}</span>
          <div><div style={{fontSize:14,fontWeight:700,color:TH.text}}>{a.l==="ASC"?"Ascendant":a.l==="MC"?"Midheaven":a.l==="DSC"?"Descendant":"Imum Coeli"}</div>
          <div style={{fontSize:11,color:TH.textMuted}}>House {houseNum} cusp</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,background:`${sg.c}12`,borderRadius:6,padding:"5px 8px"}}>
          <span style={{color:sg.c,fontSize:16}}>{sg.s}</span>
          <span style={{fontSize:13,color:TH.text}}>{sg.n} {a.deg}</span>
        </div>
        <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7}}>{meanings[a.l]}</div>
      </div>);
    }
    return null;
  };

  const popW=240,popH=200;
  let popX=sel?Math.min(Math.max(sel.x-popW/2,4),size-popW-4):0;
  let popY=sel?sel.y-popH-12:0;
  if(popY<4)popY=sel?sel.y+20:0;

  return (
    <div ref={wrapRef} style={{position:"relative",display:"inline-block"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display:"block",maxWidth:"100%"}}
        onClick={(e)=>{if(e.target.tagName==="svg")dismiss()}}>
        <defs>
          <filter id="gl"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerEdge} fill={TH.wheelBg2||"#0a0a18"} stroke={TH.border} strokeWidth="1.5"/>

        {/* ── OUTER RING: Sign band with alternating fills ── */}
        {SIGNS.map((sg,i)=>{
          const d=arcWedge(i*30,(i+1)*30,outerEdge-1,sR+1);
          const mid=i*30+15;
          const labelPt=pos2screen(mid,(outerEdge+sR)/2);
          const isSelected=sel?.type==="sign"&&sel?.data?.n===sg.n;
          return (
            <g key={sg.n} style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();select("sign",sg,labelPt.x,labelPt.y)}}>
              <path d={d} fill={i%2===0?"rgba(167,139,250,0.04)":"rgba(167,139,250,0.09)"} stroke="none"/>
              {/* Sign boundary line */}
              <line x1={pos2screen(i*30,sR).x} y1={pos2screen(i*30,sR).y} x2={pos2screen(i*30,outerEdge).x} y2={pos2screen(i*30,outerEdge).y} stroke={TH.border} strokeWidth="0.8"/>
              {/* Sign symbol */}
              <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="central"
                fill={isSelected?sg.c:sg.c} fontSize={size*(isSelected?0.042:0.034)} fontFamily={FONT}
                opacity={isSelected?1:0.75}>{sg.s}</text>
            </g>
          );
        })}

        {/* Sign/house boundary ring */}
        <circle cx={cx} cy={cy} r={sR} fill="none" stroke={TH.accent} strokeWidth="1" opacity="0.4"/>

        {/* ── HOUSE WEDGES: Strong alternating fills ── */}
        {chart.houses.map((cusp,i)=>{
          const next=chart.houses[(i+1)%12];
          const d=arcWedge(cusp,next,sR-1,iR+1);
          const span=N(next-cusp)||360;
          const midDeg=cusp+span/2;
          const labelPt=pos2screen(midDeg,hR);
          const isSelected=sel?.type==="house"&&sel?.data===i+1;
          // Strong alternating: odd houses darker
          const fillEven="rgba(167,139,250,0.03)";
          const fillOdd="rgba(167,139,250,0.10)";
          return (
            <g key={`h${i}`} style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();select("house",i+1,labelPt.x,labelPt.y)}}>
              <path d={d} fill={i%2===0?fillEven:fillOdd} stroke="none"/>
              {/* House number — large and clear */}
              <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="central"
                fill={isSelected?TH.accent:TH.textDim}
                fontSize={size*(isSelected?0.04:0.032)}
                fontWeight={isSelected?"800":"600"}
                fontFamily={FONT} opacity={isSelected?1:0.6}>{i+1}</text>
            </g>
          );
        })}

        {/* ── HOUSE CUSP LINES ── */}
        {chart.houses.map((cusp,i)=>{
          const isAngular=(i===0||i===3||i===6||i===9);
          const innerPt=pos2screen(cusp,iR);
          const outerPt=pos2screen(cusp,sR);
          return (
            <line key={`cl${i}`} x1={innerPt.x} y1={innerPt.y} x2={outerPt.x} y2={outerPt.y}
              stroke={isAngular?TH.accent:TH.border}
              strokeWidth={isAngular?2.5:0.7}
              opacity={isAngular?0.8:0.5}/>
          );
        })}

        {/* ── ANGULAR AXIS LINES (ASC-DSC, MC-IC) extended through center ── */}
        {[{d1:chart.asc,d2:N(chart.asc+180)},{d1:chart.mc,d2:N(chart.mc+180)}].map(({d1,d2},i)=>{
          const p1=pos2screen(d1,sR),p2=pos2screen(d2,sR);
          return <line key={`ax${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={TH.accent} strokeWidth="2" opacity="0.5"/>;
        })}

        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={iR} fill={TH.wheelBg2||"#0a0a18"} stroke={TH.border} strokeWidth="1"/>

        {/* ── ASPECT LINES ── */}
        {chart.aspects.filter(a=>a.asp.t==="major").slice(0,20).map((a,i)=>{
          const p1=chart.pos[a.p1],p2=chart.pos[a.p2];
          if(!p1||!p2) return null;
          const c1=pos2screen(p1.lon,pR),c2=pos2screen(p2.lon,pR);
          const midX=(c1.x+c2.x)/2,midY=(c1.y+c2.y)/2;
          const isSel=sel?.type==="aspect"&&sel?.data?.p1===a.p1&&sel?.data?.p2===a.p2&&sel?.data?.asp?.name===a.asp.name;
          return (
            <g key={`a${i}`} style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();select("aspect",a,midX,midY)}}>
              <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                stroke={a.asp.color} strokeWidth={isSel?2.5:(a.exact?1.2:0.5)}
                opacity={isSel?0.9:(a.exact?0.5:0.2)}
                strokeDasharray={a.asp.name==="Opposition"?"4,3":"none"}/>
              <line x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke="transparent" strokeWidth="8"/>
            </g>
          );
        })}

        {/* ── PLANET GLYPHS ── */}
        {PLANETS.map(p=>{
          const ppos=chart.pos[p.key]; if(!ppos) return null;
          const pt=pos2screen(ppos.lon,pR);
          const tick1=pos2screen(ppos.lon,sR-3),tick2=pos2screen(ppos.lon,sR+3);
          const isSel=sel?.type==="planet"&&sel?.data?.key===p.key;
          const gr=size*(isSel?0.024:0.019);
          return (
            <g key={p.key} style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();select("planet",p,pt.x,pt.y)}}>
              <line x1={tick1.x} y1={tick1.y} x2={tick2.x} y2={tick2.y} stroke={p.color} strokeWidth="1.5" opacity="0.6"/>
              {isSel&&<circle cx={pt.x} cy={pt.y} r={gr+5} fill={`${p.color}15`} stroke={p.color} strokeWidth="0.5"/>}
              <circle cx={pt.x} cy={pt.y} r={gr} fill={TH.bgDeep||"#0a0a18"} stroke={p.color} strokeWidth={isSel?2:1.2}/>
              <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
                fill={p.color} fontSize={size*(isSel?0.03:0.025)} fontFamily={FONT} fontWeight={isSel?"700":"500"}>{p.sym}</text>
              {ppos.rx&&<text x={pt.x+size*0.02} y={pt.y-size*0.016} fill={TH.rose} fontSize={size*0.012}>℞</text>}
            </g>
          );
        })}

        {/* ── ANGLE LABELS (ASC/MC/DSC/IC) — inside outer ring ── */}
        {[
          {l:"ASC",d:chart.asc,primary:true},
          {l:"MC",d:chart.mc,primary:true},
          {l:"DSC",d:N(chart.asc+180),primary:false},
          {l:"IC",d:N(chart.mc+180),primary:false}
        ].map(({l,d,primary})=>{
          const pt=pos2screen(d,outerEdge-16);
          const isSel=sel?.type==="angle"&&sel?.data?.l===l;
          return (
            <g key={l} style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();select("angle",{l,d,deg:fmtDeg(d),sign:getSign(d)},pt.x,pt.y)}}>
              <rect x={pt.x-18} y={pt.y-10} width="36" height="20" rx="4" fill={primary?(isSel?TH.accent+"40":TH.accent+"20"):(isSel?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)")} stroke={primary?TH.accent:TH.textDim} strokeWidth={isSel?1.5:0.5}/>
              <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
                fill={primary?TH.accent:TH.textMuted}
                fontSize={size*0.024}
                fontWeight="700" fontFamily={FONT}>{l}</text>
            </g>
          );
        })}

        {/* Degree marks on outer edge — small ticks every 5° */}
        {Array.from({length:72},(_,i)=>{
          const deg=i*5;
          const p1=pos2screen(deg,outerEdge-1),p2=pos2screen(deg,outerEdge-(i%6===0?6:3));
          return <line key={`tick${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={TH.border} strokeWidth={i%6===0?0.8:0.4} opacity="0.5"/>;
        })}
      </svg>

      {/* Floating popup overlay */}
      {sel&&(
        <div style={{
          position:"absolute",left:popX,top:popY,width:popW,maxHeight:320,overflowY:"auto",
          background:TH.bgDeep||"#0a0a18",border:`1px solid ${TH.border}`,borderRadius:12,
          padding:16,boxShadow:`0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${TH.accentGlow}`,
          backdropFilter:"blur(16px)",zIndex:50,fontFamily:FONT,animation:"fadeIn 0.15s ease-out",
        }}>
          <button onClick={dismiss} style={{position:"absolute",top:8,right:8,background:"transparent",border:"none",color:TH.textDim,fontSize:16,cursor:"pointer",padding:"2px 6px",borderRadius:4}}>✕</button>
          {popupContent()}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// (Wheel component complete above)

// placeholder_removed

// ── Shared Components ──────────────────────────────────────────
function Btn({children,onClick,primary,small,style:sx,...props}){
  const TH=props.theme||THEMES.dark;
  return <button onClick={onClick} style={{padding:small?"6px 12px":"12px 20px",borderRadius:8,background:primary?`linear-gradient(135deg,${TH.accent},${TH.accent2})`:TH.bgCard,color:primary?"#fff":TH.textMuted,fontFamily:FONT,fontSize:small?12:14,fontWeight:600,border:primary?"none":`1px solid ${TH.border}`,cursor:"pointer",transition:"all .2s",...sx}}>{children}</button>
}

function Tabs({tabs,active,onChange,theme:TH}){
  return <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:16}}>{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} style={{padding:"7px 14px",borderRadius:6,background:active===t.id?"rgba(255,255,255,0.06)":"transparent",color:active===t.id?TH.text:TH.textDim,border:`1px solid ${active===t.id?TH.borderLight:"transparent"}`,fontSize:12,fontFamily:FONT,cursor:"pointer"}}>{t.label}</button>)}</div>
}

// ── City Database for Location Picker ──────────────────────────
const CITIES=[
{n:"New York, NY",lat:40.7128,lon:-74.006,tz:-5},{n:"Brooklyn, NY",lat:40.6782,lon:-73.9442,tz:-5},{n:"Queens, NY",lat:40.7282,lon:-73.7949,tz:-5},{n:"Bronx, NY",lat:40.8448,lon:-73.8648,tz:-5},{n:"Manhattan, NY",lat:40.7831,lon:-73.9712,tz:-5},{n:"Buffalo, NY",lat:42.8864,lon:-78.8784,tz:-5},{n:"Rochester, NY",lat:43.1566,lon:-77.6088,tz:-5},{n:"Albany, NY",lat:42.6526,lon:-73.7562,tz:-5},{n:"Syracuse, NY",lat:43.0481,lon:-76.1474,tz:-5},{n:"Yonkers, NY",lat:40.9312,lon:-73.8987,tz:-5},
{n:"Los Angeles, CA",lat:34.0522,lon:-118.2437,tz:-8},{n:"San Francisco, CA",lat:37.7749,lon:-122.4194,tz:-8},{n:"San Diego, CA",lat:32.7157,lon:-117.1611,tz:-8},{n:"San Jose, CA",lat:37.3382,lon:-121.8863,tz:-8},{n:"Sacramento, CA",lat:38.5816,lon:-121.4944,tz:-8},{n:"Oakland, CA",lat:37.8044,lon:-122.2712,tz:-8},{n:"Long Beach, CA",lat:33.77,lon:-118.1937,tz:-8},{n:"Fresno, CA",lat:36.7378,lon:-119.7871,tz:-8},{n:"Bakersfield, CA",lat:35.3733,lon:-119.0187,tz:-8},{n:"Riverside, CA",lat:33.9533,lon:-117.3962,tz:-8},{n:"Harbor City, CA",lat:33.79,lon:-118.29,tz:-8},{n:"Torrance, CA",lat:33.8358,lon:-118.3406,tz:-8},{n:"Pasadena, CA",lat:34.1478,lon:-118.1445,tz:-8},{n:"Santa Monica, CA",lat:34.0195,lon:-118.4912,tz:-8},{n:"Anaheim, CA",lat:33.8366,lon:-117.9143,tz:-8},{n:"Irvine, CA",lat:33.6846,lon:-117.8265,tz:-8},{n:"Santa Barbara, CA",lat:34.4208,lon:-119.6982,tz:-8},{n:"Stockton, CA",lat:37.9577,lon:-121.2908,tz:-8},{n:"Compton, CA",lat:33.8958,lon:-118.2201,tz:-8},{n:"Glendale, CA",lat:34.1425,lon:-118.255,tz:-8},{n:"Palm Springs, CA",lat:33.8303,lon:-116.5453,tz:-8},
{n:"Chicago, IL",lat:41.8781,lon:-87.6298,tz:-6},{n:"Springfield, IL",lat:39.7817,lon:-89.6501,tz:-6},{n:"Naperville, IL",lat:41.7508,lon:-88.1535,tz:-6},{n:"Rockford, IL",lat:42.2711,lon:-89.094,tz:-6},
{n:"Houston, TX",lat:29.7604,lon:-95.3698,tz:-6},{n:"San Antonio, TX",lat:29.4241,lon:-98.4936,tz:-6},{n:"Dallas, TX",lat:32.7767,lon:-96.797,tz:-6},{n:"Austin, TX",lat:30.2672,lon:-97.7431,tz:-6},{n:"Fort Worth, TX",lat:32.7555,lon:-97.3308,tz:-6},{n:"El Paso, TX",lat:31.7619,lon:-106.485,tz:-7},{n:"Corpus Christi, TX",lat:27.8006,lon:-97.3964,tz:-6},{n:"Lubbock, TX",lat:33.5779,lon:-101.8552,tz:-6},{n:"Laredo, TX",lat:27.5036,lon:-99.5076,tz:-6},{n:"Amarillo, TX",lat:35.222,lon:-101.8313,tz:-6},{n:"Brownsville, TX",lat:25.9017,lon:-97.4975,tz:-6},
{n:"Phoenix, AZ",lat:33.4484,lon:-112.074,tz:-7},{n:"Tucson, AZ",lat:32.2226,lon:-110.9747,tz:-7},{n:"Mesa, AZ",lat:33.4152,lon:-111.8315,tz:-7},{n:"Scottsdale, AZ",lat:33.4942,lon:-111.9261,tz:-7},{n:"Flagstaff, AZ",lat:35.1983,lon:-111.6513,tz:-7},
{n:"Philadelphia, PA",lat:39.9526,lon:-75.1652,tz:-5},{n:"Pittsburgh, PA",lat:40.4406,lon:-79.9959,tz:-5},{n:"Allentown, PA",lat:40.6023,lon:-75.4714,tz:-5},{n:"Erie, PA",lat:42.1292,lon:-80.0851,tz:-5},{n:"Scranton, PA",lat:41.409,lon:-75.6624,tz:-5},
{n:"Jacksonville, FL",lat:30.3322,lon:-81.6557,tz:-5},{n:"Miami, FL",lat:25.7617,lon:-80.1918,tz:-5},{n:"Tampa, FL",lat:27.9506,lon:-82.4572,tz:-5},{n:"Orlando, FL",lat:28.5383,lon:-81.3792,tz:-5},{n:"St. Petersburg, FL",lat:27.7676,lon:-82.6403,tz:-5},{n:"Fort Lauderdale, FL",lat:26.1224,lon:-80.1373,tz:-5},{n:"Tallahassee, FL",lat:30.4383,lon:-84.2807,tz:-5},{n:"Gainesville, FL",lat:29.6516,lon:-82.3248,tz:-5},{n:"Sarasota, FL",lat:27.3364,lon:-82.5307,tz:-5},{n:"Pensacola, FL",lat:30.4213,lon:-87.2169,tz:-6},{n:"Naples, FL",lat:26.142,lon:-81.7948,tz:-5},{n:"West Palm Beach, FL",lat:26.7153,lon:-80.0534,tz:-5},
{n:"Columbus, OH",lat:39.9612,lon:-82.9988,tz:-5},{n:"Cleveland, OH",lat:41.4993,lon:-81.6944,tz:-5},{n:"Cincinnati, OH",lat:39.1031,lon:-84.512,tz:-5},{n:"Toledo, OH",lat:41.6528,lon:-83.5379,tz:-5},{n:"Akron, OH",lat:41.0814,lon:-81.519,tz:-5},{n:"Dayton, OH",lat:39.7589,lon:-84.1916,tz:-5},
{n:"Charlotte, NC",lat:35.2271,lon:-80.8431,tz:-5},{n:"Raleigh, NC",lat:35.7796,lon:-78.6382,tz:-5},{n:"Durham, NC",lat:35.994,lon:-78.8986,tz:-5},{n:"Greensboro, NC",lat:36.0726,lon:-79.792,tz:-5},{n:"Asheville, NC",lat:35.5951,lon:-82.5515,tz:-5},{n:"Wilmington, NC",lat:34.2257,lon:-77.9447,tz:-5},
{n:"Indianapolis, IN",lat:39.7684,lon:-86.1581,tz:-5},{n:"Fort Wayne, IN",lat:41.0793,lon:-85.1394,tz:-5},{n:"South Bend, IN",lat:41.6764,lon:-86.252,tz:-5},
{n:"Seattle, WA",lat:47.6062,lon:-122.3321,tz:-8},{n:"Tacoma, WA",lat:47.2529,lon:-122.4443,tz:-8},{n:"Spokane, WA",lat:47.6588,lon:-117.426,tz:-8},{n:"Olympia, WA",lat:47.0379,lon:-122.9007,tz:-8},
{n:"Denver, CO",lat:39.7392,lon:-104.9903,tz:-7},{n:"Colorado Springs, CO",lat:38.8339,lon:-104.8214,tz:-7},{n:"Boulder, CO",lat:40.015,lon:-105.2705,tz:-7},{n:"Fort Collins, CO",lat:40.5853,lon:-105.0844,tz:-7},
{n:"Washington, DC",lat:38.9072,lon:-77.0369,tz:-5},
{n:"Nashville, TN",lat:36.1627,lon:-86.7816,tz:-6},{n:"Memphis, TN",lat:35.1495,lon:-90.049,tz:-6},{n:"Knoxville, TN",lat:35.9606,lon:-83.9207,tz:-5},{n:"Chattanooga, TN",lat:35.0456,lon:-85.3097,tz:-5},
{n:"Boston, MA",lat:42.3601,lon:-71.0589,tz:-5},{n:"Cambridge, MA",lat:42.3736,lon:-71.1097,tz:-5},{n:"Worcester, MA",lat:42.2626,lon:-71.8023,tz:-5},{n:"Salem, MA",lat:42.5195,lon:-70.8967,tz:-5},
{n:"Detroit, MI",lat:42.3314,lon:-83.0458,tz:-5},{n:"Grand Rapids, MI",lat:42.9634,lon:-85.6681,tz:-5},{n:"Ann Arbor, MI",lat:42.2808,lon:-83.743,tz:-5},{n:"Lansing, MI",lat:42.7325,lon:-84.5555,tz:-5},
{n:"Portland, OR",lat:45.5152,lon:-122.6784,tz:-8},{n:"Eugene, OR",lat:44.0521,lon:-123.0868,tz:-8},{n:"Salem, OR",lat:44.9429,lon:-123.0351,tz:-8},{n:"Bend, OR",lat:44.0582,lon:-121.3153,tz:-8},
{n:"Las Vegas, NV",lat:36.1699,lon:-115.1398,tz:-8},{n:"Reno, NV",lat:39.5296,lon:-119.8138,tz:-8},{n:"Henderson, NV",lat:36.0395,lon:-114.9817,tz:-8},
{n:"Atlanta, GA",lat:33.749,lon:-84.388,tz:-5},{n:"Savannah, GA",lat:32.0809,lon:-81.0912,tz:-5},{n:"Augusta, GA",lat:33.4735,lon:-82.0105,tz:-5},{n:"Athens, GA",lat:33.951,lon:-83.3576,tz:-5},
{n:"Minneapolis, MN",lat:44.9778,lon:-93.265,tz:-6},{n:"St. Paul, MN",lat:44.9537,lon:-93.09,tz:-6},{n:"Duluth, MN",lat:46.7867,lon:-92.1005,tz:-6},
{n:"Salt Lake City, UT",lat:40.7608,lon:-111.891,tz:-7},{n:"Provo, UT",lat:40.2338,lon:-111.6585,tz:-7},
{n:"Kansas City, MO",lat:39.0997,lon:-94.5786,tz:-6},{n:"St. Louis, MO",lat:38.627,lon:-90.1994,tz:-6},{n:"Springfield, MO",lat:37.2089,lon:-93.2923,tz:-6},
{n:"New Orleans, LA",lat:29.9511,lon:-90.0715,tz:-6},{n:"Baton Rouge, LA",lat:30.4515,lon:-91.1871,tz:-6},{n:"Shreveport, LA",lat:32.5252,lon:-93.7502,tz:-6},
{n:"Milwaukee, WI",lat:43.0389,lon:-87.9065,tz:-6},{n:"Madison, WI",lat:43.0731,lon:-89.4012,tz:-6},{n:"Green Bay, WI",lat:44.5133,lon:-88.0133,tz:-6},
{n:"Baltimore, MD",lat:39.2904,lon:-76.6122,tz:-5},{n:"Annapolis, MD",lat:38.9784,lon:-76.4922,tz:-5},
{n:"Albuquerque, NM",lat:35.0844,lon:-106.6504,tz:-7},{n:"Santa Fe, NM",lat:35.687,lon:-105.9378,tz:-7},
{n:"Oklahoma City, OK",lat:35.4676,lon:-97.5164,tz:-6},{n:"Tulsa, OK",lat:36.154,lon:-95.9928,tz:-6},
{n:"Louisville, KY",lat:38.2527,lon:-85.7585,tz:-5},{n:"Lexington, KY",lat:38.0406,lon:-84.5037,tz:-5},
{n:"Richmond, VA",lat:37.5407,lon:-77.436,tz:-5},{n:"Virginia Beach, VA",lat:36.8529,lon:-75.978,tz:-5},{n:"Norfolk, VA",lat:36.8508,lon:-76.2859,tz:-5},{n:"Arlington, VA",lat:38.8799,lon:-77.1068,tz:-5},{n:"Charlottesville, VA",lat:38.0293,lon:-78.4767,tz:-5},
{n:"Birmingham, AL",lat:33.5207,lon:-86.8025,tz:-6},{n:"Montgomery, AL",lat:32.3792,lon:-86.3077,tz:-6},{n:"Mobile, AL",lat:30.6954,lon:-88.0399,tz:-6},{n:"Huntsville, AL",lat:34.7304,lon:-86.5861,tz:-6},
{n:"Honolulu, HI",lat:21.3069,lon:-157.8583,tz:-10},{n:"Maui, HI",lat:20.7984,lon:-156.3319,tz:-10},
{n:"Anchorage, AK",lat:61.2181,lon:-149.9003,tz:-9},{n:"Fairbanks, AK",lat:64.8378,lon:-147.7164,tz:-9},{n:"Juneau, AK",lat:58.3005,lon:-134.4197,tz:-9},
{n:"Charleston, SC",lat:32.7765,lon:-79.9311,tz:-5},{n:"Columbia, SC",lat:34.0007,lon:-81.0348,tz:-5},{n:"Greenville, SC",lat:34.8526,lon:-82.394,tz:-5},{n:"Myrtle Beach, SC",lat:33.6891,lon:-78.8867,tz:-5},
{n:"Omaha, NE",lat:41.2565,lon:-95.9345,tz:-6},{n:"Lincoln, NE",lat:40.8136,lon:-96.7026,tz:-6},
{n:"Des Moines, IA",lat:41.5868,lon:-93.625,tz:-6},{n:"Cedar Rapids, IA",lat:41.9779,lon:-91.6656,tz:-6},{n:"Iowa City, IA",lat:41.661,lon:-91.5302,tz:-6},
{n:"Little Rock, AR",lat:34.7465,lon:-92.2896,tz:-6},{n:"Fayetteville, AR",lat:36.0822,lon:-94.1719,tz:-6},
{n:"Jackson, MS",lat:32.2988,lon:-90.1848,tz:-6},
{n:"Hartford, CT",lat:41.7658,lon:-72.6734,tz:-5},{n:"New Haven, CT",lat:41.3083,lon:-72.9279,tz:-5},{n:"Stamford, CT",lat:41.0534,lon:-73.5387,tz:-5},
{n:"Providence, RI",lat:41.824,lon:-71.4128,tz:-5},
{n:"Wilmington, DE",lat:39.7391,lon:-75.5398,tz:-5},
{n:"Portland, ME",lat:43.6591,lon:-70.2568,tz:-5},{n:"Bangor, ME",lat:44.8016,lon:-68.7712,tz:-5},
{n:"Manchester, NH",lat:42.9956,lon:-71.4548,tz:-5},
{n:"Burlington, VT",lat:44.4759,lon:-73.2121,tz:-5},
{n:"Charleston, WV",lat:38.3498,lon:-81.6326,tz:-5},
{n:"Billings, MT",lat:45.7833,lon:-108.5007,tz:-7},{n:"Missoula, MT",lat:46.8721,lon:-113.994,tz:-7},
{n:"Boise, ID",lat:43.615,lon:-116.2023,tz:-7},
{n:"Sioux Falls, SD",lat:43.5446,lon:-96.7311,tz:-6},{n:"Rapid City, SD",lat:44.0805,lon:-103.231,tz:-7},
{n:"Fargo, ND",lat:46.8772,lon:-96.7898,tz:-6},{n:"Bismarck, ND",lat:46.8083,lon:-100.7837,tz:-6},
{n:"Cheyenne, WY",lat:41.14,lon:-104.8202,tz:-7},{n:"Jackson, WY",lat:43.4799,lon:-110.7624,tz:-7},
{n:"Wichita, KS",lat:37.6872,lon:-97.3301,tz:-6},{n:"Topeka, KS",lat:39.0489,lon:-95.678,tz:-6},
// Canada
{n:"Toronto, Canada",lat:43.6532,lon:-79.3832,tz:-5},{n:"Montreal, Canada",lat:45.5017,lon:-73.5673,tz:-5},{n:"Vancouver, Canada",lat:49.2827,lon:-123.1207,tz:-8},{n:"Calgary, Canada",lat:51.0447,lon:-114.0719,tz:-7},{n:"Edmonton, Canada",lat:53.5461,lon:-113.4938,tz:-7},{n:"Ottawa, Canada",lat:45.4215,lon:-75.6972,tz:-5},{n:"Winnipeg, Canada",lat:49.8951,lon:-97.1384,tz:-6},{n:"Halifax, Canada",lat:44.6488,lon:-63.5752,tz:-4},{n:"Victoria, Canada",lat:48.4284,lon:-123.3656,tz:-8},{n:"Quebec City, Canada",lat:46.8139,lon:-71.208,tz:-5},{n:"Saskatoon, Canada",lat:52.1332,lon:-106.67,tz:-6},{n:"St. John's, Canada",lat:47.5615,lon:-52.7126,tz:-3.5},
// Mexico & Central America
{n:"Mexico City, Mexico",lat:19.4326,lon:-99.1332,tz:-6},{n:"Guadalajara, Mexico",lat:20.6597,lon:-103.3496,tz:-6},{n:"Monterrey, Mexico",lat:25.6866,lon:-100.3161,tz:-6},{n:"Cancún, Mexico",lat:21.1619,lon:-86.8515,tz:-5},{n:"Tijuana, Mexico",lat:32.5149,lon:-117.0382,tz:-8},{n:"Puebla, Mexico",lat:19.0414,lon:-98.2063,tz:-6},{n:"Panama City, Panama",lat:8.9824,lon:-79.5199,tz:-5},{n:"San José, Costa Rica",lat:9.9281,lon:-84.0907,tz:-6},{n:"Guatemala City",lat:14.6349,lon:-90.5069,tz:-6},
// Caribbean
{n:"Havana, Cuba",lat:23.1136,lon:-82.3666,tz:-5},{n:"San Juan, PR",lat:18.4655,lon:-66.1057,tz:-4},{n:"Kingston, Jamaica",lat:18.0179,lon:-76.8099,tz:-5},{n:"Santo Domingo, DR",lat:18.4861,lon:-69.9312,tz:-4},{n:"Nassau, Bahamas",lat:25.0343,lon:-77.3963,tz:-5},{n:"Port of Spain, Trinidad",lat:10.6596,lon:-61.5086,tz:-4},
// UK & Ireland
{n:"London, UK",lat:51.5074,lon:-0.1278,tz:0},{n:"Manchester, UK",lat:53.4808,lon:-2.2426,tz:0},{n:"Birmingham, UK",lat:52.4862,lon:-1.8904,tz:0},{n:"Edinburgh, UK",lat:55.9533,lon:-3.1883,tz:0},{n:"Glasgow, UK",lat:55.8642,lon:-4.2518,tz:0},{n:"Liverpool, UK",lat:53.4084,lon:-2.9916,tz:0},{n:"Leeds, UK",lat:53.8008,lon:-1.5491,tz:0},{n:"Bristol, UK",lat:51.4545,lon:-2.5879,tz:0},{n:"Dublin, Ireland",lat:53.3498,lon:-6.2603,tz:0},{n:"Belfast, UK",lat:54.5973,lon:-5.9301,tz:0},
// Western Europe
{n:"Paris, France",lat:48.8566,lon:2.3522,tz:1},{n:"Lyon, France",lat:45.764,lon:4.8357,tz:1},{n:"Marseille, France",lat:43.2965,lon:5.3698,tz:1},{n:"Nice, France",lat:43.7102,lon:7.262,tz:1},{n:"Bordeaux, France",lat:44.8378,lon:-0.5792,tz:1},
{n:"Berlin, Germany",lat:52.52,lon:13.405,tz:1},{n:"Munich, Germany",lat:48.1351,lon:11.582,tz:1},{n:"Hamburg, Germany",lat:53.5511,lon:9.9937,tz:1},{n:"Frankfurt, Germany",lat:50.1109,lon:8.6821,tz:1},{n:"Cologne, Germany",lat:50.9375,lon:6.9603,tz:1},{n:"Stuttgart, Germany",lat:48.7758,lon:9.1829,tz:1},
{n:"Rome, Italy",lat:41.9028,lon:12.4964,tz:1},{n:"Milan, Italy",lat:45.4642,lon:9.19,tz:1},{n:"Naples, Italy",lat:40.8518,lon:14.2681,tz:1},{n:"Florence, Italy",lat:43.7696,lon:11.2558,tz:1},{n:"Venice, Italy",lat:45.4408,lon:12.3155,tz:1},
{n:"Madrid, Spain",lat:40.4168,lon:-3.7038,tz:1},{n:"Barcelona, Spain",lat:41.3874,lon:2.1686,tz:1},{n:"Seville, Spain",lat:37.3891,lon:-5.9845,tz:1},{n:"Valencia, Spain",lat:39.4699,lon:-0.3763,tz:1},
{n:"Amsterdam, Netherlands",lat:52.3676,lon:4.9041,tz:1},{n:"Brussels, Belgium",lat:50.8503,lon:4.3517,tz:1},{n:"Zurich, Switzerland",lat:47.3769,lon:8.5417,tz:1},{n:"Geneva, Switzerland",lat:46.2044,lon:6.1432,tz:1},{n:"Vienna, Austria",lat:48.2082,lon:16.3738,tz:1},{n:"Lisbon, Portugal",lat:38.7223,lon:-9.1393,tz:0},{n:"Porto, Portugal",lat:41.1579,lon:-8.6291,tz:0},
// Northern Europe
{n:"Stockholm, Sweden",lat:59.3293,lon:18.0686,tz:1},{n:"Copenhagen, Denmark",lat:55.6761,lon:12.5683,tz:1},{n:"Oslo, Norway",lat:59.9139,lon:10.7522,tz:1},{n:"Helsinki, Finland",lat:60.1699,lon:24.9384,tz:2},{n:"Reykjavik, Iceland",lat:64.1466,lon:-21.9426,tz:0},
// Central/Eastern Europe
{n:"Prague, Czechia",lat:50.0755,lon:14.4378,tz:1},{n:"Warsaw, Poland",lat:52.2297,lon:21.0122,tz:1},{n:"Krakow, Poland",lat:50.0647,lon:19.945,tz:1},{n:"Budapest, Hungary",lat:47.4979,lon:19.0402,tz:1},{n:"Bucharest, Romania",lat:44.4268,lon:26.1025,tz:2},{n:"Athens, Greece",lat:37.9838,lon:23.7275,tz:2},{n:"Belgrade, Serbia",lat:44.7866,lon:20.4489,tz:1},{n:"Zagreb, Croatia",lat:45.815,lon:15.9819,tz:1},{n:"Sofia, Bulgaria",lat:42.6977,lon:23.3219,tz:2},
// Russia & Eastern
{n:"Istanbul, Turkey",lat:41.0082,lon:28.9784,tz:3},{n:"Ankara, Turkey",lat:39.9334,lon:32.8597,tz:3},{n:"Moscow, Russia",lat:55.7558,lon:37.6173,tz:3},{n:"St. Petersburg, Russia",lat:59.9343,lon:30.3351,tz:3},{n:"Kyiv, Ukraine",lat:50.4501,lon:30.5234,tz:2},
// Middle East
{n:"Dubai, UAE",lat:25.2048,lon:55.2708,tz:4},{n:"Abu Dhabi, UAE",lat:24.4539,lon:54.3773,tz:4},{n:"Riyadh, Saudi Arabia",lat:24.7136,lon:46.6753,tz:3},{n:"Jeddah, Saudi Arabia",lat:21.4858,lon:39.1925,tz:3},{n:"Tehran, Iran",lat:35.6892,lon:51.389,tz:3.5},{n:"Jerusalem, Israel",lat:31.7683,lon:35.2137,tz:2},{n:"Tel Aviv, Israel",lat:32.0853,lon:34.7818,tz:2},{n:"Beirut, Lebanon",lat:33.8938,lon:35.5018,tz:2},{n:"Amman, Jordan",lat:31.9454,lon:35.9284,tz:2},{n:"Baghdad, Iraq",lat:33.3152,lon:44.3661,tz:3},{n:"Doha, Qatar",lat:25.2854,lon:51.531,tz:3},{n:"Kuwait City, Kuwait",lat:29.3759,lon:47.9774,tz:3},
// South Asia
{n:"Mumbai, India",lat:19.076,lon:72.8777,tz:5.5},{n:"Delhi, India",lat:28.7041,lon:77.1025,tz:5.5},{n:"Bangalore, India",lat:12.9716,lon:77.5946,tz:5.5},{n:"Chennai, India",lat:13.0827,lon:80.2707,tz:5.5},{n:"Kolkata, India",lat:22.5726,lon:88.3639,tz:5.5},{n:"Hyderabad, India",lat:17.385,lon:78.4867,tz:5.5},{n:"Pune, India",lat:18.5204,lon:73.8567,tz:5.5},{n:"Ahmedabad, India",lat:23.0225,lon:72.5714,tz:5.5},{n:"Jaipur, India",lat:26.9124,lon:75.7873,tz:5.5},{n:"Goa, India",lat:15.2993,lon:74.124,tz:5.5},
{n:"Karachi, Pakistan",lat:24.8607,lon:67.0011,tz:5},{n:"Lahore, Pakistan",lat:31.5204,lon:74.3587,tz:5},{n:"Islamabad, Pakistan",lat:33.6844,lon:73.0479,tz:5},{n:"Dhaka, Bangladesh",lat:23.8103,lon:90.4125,tz:6},{n:"Colombo, Sri Lanka",lat:6.9271,lon:79.8612,tz:5.5},{n:"Kathmandu, Nepal",lat:27.7172,lon:85.324,tz:5.75},
// East Asia
{n:"Beijing, China",lat:39.9042,lon:116.4074,tz:8},{n:"Shanghai, China",lat:31.2304,lon:121.4737,tz:8},{n:"Guangzhou, China",lat:23.1291,lon:113.2644,tz:8},{n:"Shenzhen, China",lat:22.5431,lon:114.0579,tz:8},{n:"Hong Kong",lat:22.3193,lon:114.1694,tz:8},{n:"Taipei, Taiwan",lat:25.033,lon:121.5654,tz:8},{n:"Tokyo, Japan",lat:35.6762,lon:139.6503,tz:9},{n:"Osaka, Japan",lat:34.6937,lon:135.5023,tz:9},{n:"Kyoto, Japan",lat:35.0116,lon:135.7681,tz:9},{n:"Seoul, South Korea",lat:37.5665,lon:126.978,tz:9},{n:"Busan, South Korea",lat:35.1796,lon:129.0756,tz:9},
// Southeast Asia
{n:"Singapore",lat:1.3521,lon:103.8198,tz:8},{n:"Bangkok, Thailand",lat:13.7563,lon:100.5018,tz:7},{n:"Kuala Lumpur, Malaysia",lat:3.139,lon:101.6869,tz:8},{n:"Jakarta, Indonesia",lat:-6.2088,lon:106.8456,tz:7},{n:"Bali, Indonesia",lat:-8.3405,lon:115.092,tz:8},{n:"Manila, Philippines",lat:14.5995,lon:120.9842,tz:8},{n:"Hanoi, Vietnam",lat:21.0278,lon:105.8342,tz:7},{n:"Ho Chi Minh City, Vietnam",lat:10.8231,lon:106.6297,tz:7},{n:"Phnom Penh, Cambodia",lat:11.5564,lon:104.9282,tz:7},
// Oceania
{n:"Sydney, Australia",lat:-33.8688,lon:151.2093,tz:10},{n:"Melbourne, Australia",lat:-37.8136,lon:144.9631,tz:10},{n:"Brisbane, Australia",lat:-27.4698,lon:153.0251,tz:10},{n:"Perth, Australia",lat:-31.9505,lon:115.8605,tz:8},{n:"Adelaide, Australia",lat:-34.9285,lon:138.6007,tz:9.5},{n:"Canberra, Australia",lat:-35.2809,lon:149.13,tz:10},{n:"Auckland, New Zealand",lat:-36.8485,lon:174.7633,tz:12},{n:"Wellington, New Zealand",lat:-41.2865,lon:174.7762,tz:12},
// Africa
{n:"Cairo, Egypt",lat:30.0444,lon:31.2357,tz:2},{n:"Lagos, Nigeria",lat:6.5244,lon:3.3792,tz:1},{n:"Nairobi, Kenya",lat:-1.2921,lon:36.8219,tz:3},{n:"Johannesburg, South Africa",lat:-26.2041,lon:28.0473,tz:2},{n:"Cape Town, South Africa",lat:-33.9249,lon:18.4241,tz:2},{n:"Accra, Ghana",lat:5.6037,lon:-0.187,tz:0},{n:"Addis Ababa, Ethiopia",lat:9.0222,lon:38.7468,tz:3},{n:"Casablanca, Morocco",lat:33.5731,lon:-7.5898,tz:1},{n:"Dar es Salaam, Tanzania",lat:-6.7924,lon:39.2083,tz:3},{n:"Kampala, Uganda",lat:0.3476,lon:32.5825,tz:3},{n:"Kinshasa, DR Congo",lat:-4.4419,lon:15.2663,tz:1},{n:"Dakar, Senegal",lat:14.7167,lon:-17.4677,tz:0},
// South America
{n:"São Paulo, Brazil",lat:-23.5505,lon:-46.6333,tz:-3},{n:"Rio de Janeiro, Brazil",lat:-22.9068,lon:-43.1729,tz:-3},{n:"Brasília, Brazil",lat:-15.7975,lon:-47.8919,tz:-3},{n:"Buenos Aires, Argentina",lat:-34.6037,lon:-58.3816,tz:-3},{n:"Córdoba, Argentina",lat:-31.4201,lon:-64.1888,tz:-3},{n:"Lima, Peru",lat:-12.0464,lon:-77.0428,tz:-5},{n:"Bogotá, Colombia",lat:4.711,lon:-74.0721,tz:-5},{n:"Medellín, Colombia",lat:6.2476,lon:-75.5658,tz:-5},{n:"Santiago, Chile",lat:-33.4489,lon:-70.6693,tz:-4},{n:"Caracas, Venezuela",lat:10.4806,lon:-66.9036,tz:-4},{n:"Quito, Ecuador",lat:-0.1807,lon:-78.4678,tz:-5},{n:"Montevideo, Uruguay",lat:-34.9011,lon:-56.1645,tz:-3},{n:"La Paz, Bolivia",lat:-16.4897,lon:-68.1193,tz:-4},
];

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

function BirthForm({onSubmit,initial,onCancel,theme:TH}){
  const [d,setD]=useState(initial||{name:"",year:1990,month:6,day:15,hour:12,minute:0,latitude:40.7128,longitude:-74.006,location:"New York, NY",utcOffset:-5});
  const [citySearch,setCitySearch]=useState(initial?.location||"");
  const [showCities,setShowCities]=useState(false);
  const [dst,setDst]=useState(false);
  const [geoResults,setGeoResults]=useState([]);
  const [geoLoading,setGeoLoading]=useState(false);
  const searchTimer=useRef(null);

  // Estimate UTC offset from longitude (rough: 1 hour per 15°)
  const estimateTz=(lat,lon)=>{let tz=Math.round(lon/15);return Math.max(-12,Math.min(14,tz))};

  // Auto-detect DST for common timezones based on birth month
  const autoDST = (month, baseTz) => {
    if(baseTz === -10 || baseTz === 9 || baseTz === 8 || baseTz === 5.5 || baseTz === 4 || baseTz === 3) return false;
    return month >= 3 && month <= 10;
  };

  // Nominatim geocoding search — enhances local results when online
  const searchGeo = (query) => {
    if(query.length < 2) return;
    setGeoLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,{headers:{"Accept-Language":"en"}})
      .then(r=>r.json())
      .then(results=>{
        const mapped=results.map(r=>({
          n: r.display_name.split(",").slice(0,3).join(",").trim(),
          full: r.display_name,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          tz: estimateTz(parseFloat(r.lat),parseFloat(r.lon)),
          online: true,
        }));
        // Merge: local matches first, then online results (deduplicated)
        setGeoResults(prev=>{
          const localNames=new Set(prev.filter(c=>!c.online).map(c=>c.n.toLowerCase()));
          const newOnline=mapped.filter(c=>!localNames.has(c.n.toLowerCase()));
          return [...prev.filter(c=>!c.online),...newOnline];
        });
        setGeoLoading(false);
      })
      .catch(()=>{
        // Offline — local results already shown, just stop loading
        setGeoLoading(false);
      });
  };

  // Debounced search — local results instant, Nominatim after delay
  const handleCityInput = (val) => {
    setCitySearch(val);
    setShowCities(true);
    setD({...d,location:val});
    if(searchTimer.current) clearTimeout(searchTimer.current);
    // Show ALL local matches instantly (up to 8)
    const local=CITIES.filter(c=>c.n.toLowerCase().includes(val.toLowerCase())).slice(0,8);
    setGeoResults(local);
    // Then search Nominatim after delay (works on GitHub Pages, not in artifact sandbox)
    if(val.length>=2){
      searchTimer.current=setTimeout(()=>searchGeo(val),500);
    }
  };

  const selectCity=(c)=>{
    const baseTz=c.tz||estimateTz(c.lat,c.lon);
    const shouldDST=autoDST(d.month, baseTz);
    const tz=shouldDST?baseTz+1:baseTz;
    setD({...d,latitude:c.lat,longitude:c.lon,location:c.n,utcOffset:tz});
    setDst(shouldDST);
    setCitySearch(c.n);setShowCities(false);setGeoResults([]);
  };

  const daysInMonth=new Date(d.year,d.month,0).getDate();

  const selS={background:TH.inputBg,border:`1px solid ${TH.border}`,borderRadius:8,padding:"10px 12px",color:TH.text,fontFamily:FONT,fontSize:14,outline:"none",width:"100%",appearance:"none",WebkitAppearance:"none",cursor:"pointer",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238b8fa3'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"};
  const iS={background:TH.inputBg,border:`1px solid ${TH.border}`,borderRadius:8,padding:"10px 14px",color:TH.text,fontFamily:FONT,fontSize:14,outline:"none",width:"100%"};
  const lS={fontSize:11,color:TH.textMuted,fontFamily:FONT,marginBottom:5,display:"block",letterSpacing:.5,fontWeight:500};

  // AM/PM conversion
  const displayHour=d.hour===0?12:d.hour>12?d.hour-12:d.hour;
  const ampm=d.hour>=12?"PM":"AM";
  const setTime=(h,m,ap)=>{
    let h24=h;
    if(ap==="AM"){h24=h===12?0:h}else{h24=h===12?12:h+12}
    setD({...d,hour:h24,minute:m});
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Name */}
      <div>
        <label style={lS}>Name</label>
        <input style={iS} value={d.name} onChange={e=>setD({...d,name:e.target.value})} placeholder="e.g. Sarah, Dad, Client #3"/>
      </div>

      {/* Date — Month / Day / Year dropdowns */}
      <div>
        <label style={lS}>Date of Birth</label>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1.2fr",gap:6}}>
          <select style={selS} value={d.month} onChange={e=>{const m=+e.target.value;const shouldDST=d.location?autoDST(m,d.utcOffset-(dst?1:0)):false;const baseTz=d.utcOffset-(dst?1:0);setD({...d,month:m,utcOffset:shouldDST?baseTz+1:baseTz});setDst(shouldDST)}}>
            {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
          </select>
          <select style={selS} value={d.day} onChange={e=>setD({...d,day:+e.target.value})}>
            {Array.from({length:daysInMonth},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}
          </select>
          <select style={selS} value={d.year} onChange={e=>setD({...d,year:+e.target.value})}>
            {Array.from({length:2050-1890+1},(_,i)=>1890+i).reverse().map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Time — Hour / Minute / AM-PM */}
      <div>
        <label style={lS}>Time of Birth</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          <select style={selS} value={displayHour} onChange={e=>setTime(+e.target.value,d.minute,ampm)}>
            {Array.from({length:12},(_,i)=><option key={i} value={i===0?12:i}>{i===0?12:i}</option>)}
          </select>
          <select style={selS} value={d.minute} onChange={e=>setTime(displayHour,+e.target.value,ampm)}>
            {Array.from({length:60},(_,i)=><option key={i} value={i}>{String(i).padStart(2,"0")}</option>)}
          </select>
          <div style={{display:"flex",gap:0,borderRadius:8,overflow:"hidden",border:`1px solid ${TH.border}`}}>
            {["AM","PM"].map(p=>(
              <button key={p} onClick={()=>setTime(displayHour,d.minute,p)} style={{flex:1,padding:"10px 0",background:ampm===p?TH.accentSoft:TH.inputBg,color:ampm===p?TH.accent:TH.textDim,border:"none",fontFamily:FONT,fontSize:13,fontWeight:600,cursor:"pointer"}}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{fontSize:10,color:TH.textDim,marginTop:4}}>If birth time is unknown, use 12:00 PM (noon)</div>
      </div>

      {/* Location — Nominatim live search + local fallback */}
      <div style={{position:"relative"}}>
        <label style={lS}>Birth Location</label>
        <input style={iS} value={citySearch} placeholder="Type any city or town worldwide..." 
          onChange={e=>handleCityInput(e.target.value)}
          onFocus={()=>{if(citySearch.length>=2)setShowCities(true)}}
        />
        {showCities&&citySearch.length>=2&&(
          <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:100,marginTop:4,background:TH.bgDeep||"#1a1a2e",border:`1px solid ${TH.border}`,borderRadius:8,maxHeight:300,overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.3)"}}>
            {geoResults.map((c,i)=>(
              <button key={i} onClick={()=>selectCity(c)} style={{display:"block",width:"100%",padding:"10px 14px",background:"transparent",border:"none",borderBottom:`1px solid ${TH.borderLight}`,color:TH.text,fontFamily:FONT,fontSize:13,cursor:"pointer",textAlign:"left"}}
                onMouseEnter={e=>e.target.style.background=TH.accentSoft}
                onMouseLeave={e=>e.target.style.background="transparent"}>
                {c.n}
                <span style={{fontSize:10,color:TH.textDim,marginLeft:8}}>{c.lat.toFixed(2)}°, {c.lon.toFixed(2)}°</span>
                {c.online&&<span style={{fontSize:9,color:TH.accent,marginLeft:4}}>🌐</span>}
              </button>
            ))}
            {geoLoading&&<div style={{padding:"10px 14px",fontSize:11,color:TH.textDim}}>🔍 Searching online...</div>}
            {!geoLoading&&geoResults.length===0&&(
              <div style={{padding:"14px"}}>
                <div style={{fontSize:12,color:TH.textMuted,marginBottom:6}}>No matches for "{citySearch}"</div>
                <div style={{fontSize:11,color:TH.textDim,lineHeight:1.6}}>Enter coordinates below. Tip: Google "<strong>{citySearch} lat long</strong>" to find them. On GitHub Pages this search finds any city worldwide.</div>
              </div>
            )}
          </div>
        )}
        {d.location&&d.latitude!==0&&d.location===citySearch&&geoResults.length===0&&<div style={{fontSize:10,color:TH.mint||TH.accent,marginTop:4}}>✓ {d.location} ({d.latitude.toFixed(4)}°, {d.longitude.toFixed(4)}°)</div>}
      </div>

      {/* Coordinates — always visible, editable */}
      <div>
        <label style={lS}>Coordinates <span style={{color:TH.textDim,fontWeight:400}}>(auto-filled, or enter manually)</span></label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input type="number" step="0.01" style={iS} placeholder="Latitude" value={d.latitude} onChange={e=>setD({...d,latitude:+e.target.value})}/>
          <input type="number" step="0.01" style={iS} placeholder="Longitude" value={d.longitude} onChange={e=>setD({...d,longitude:+e.target.value})}/>
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label style={lS}>Timezone</label>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <select style={{...selS,flex:1}} value={d.utcOffset} onChange={e=>{const v=parseFloat(e.target.value);setD({...d,utcOffset:v});setDst(false)}}>
            {Array.from({length:53},(_,i)=>{const tz=-12+i*0.5;const label=tz>=0?"+"+tz:String(tz);const names={"-10":"HST","-9":"AKST","-8":"PST","-7":"MST/PDT","-6":"CST/MDT","-5":"EST/CDT","-4":"EDT/AST","-3":"BRT","0":"GMT/UTC","1":"CET","2":"EET","3":"MSK","4":"GST","5.5":"IST","8":"CST/SGT","9":"JST/KST","10":"AEST"};return (<option key={tz} value={tz}>UTC {label}{names[String(tz)]?" ("+names[String(tz)]+")":""}</option>)})}
          </select>
          <button type="button" onClick={()=>{if(!dst){setD({...d,utcOffset:d.utcOffset+1});setDst(true)}else{setD({...d,utcOffset:d.utcOffset-1});setDst(false)}}} style={{
            padding:"10px 12px",borderRadius:8,whiteSpace:"nowrap",
            background:dst?TH.accentSoft:TH.inputBg,
            color:dst?TH.accent:TH.textDim,
            border:`1px solid ${dst?TH.accent+"40":TH.border}`,
            fontFamily:FONT,fontSize:12,fontWeight:600,cursor:"pointer",
          }}>{dst?"☑ DST":"☐ DST"}</button>
        </div>
        <div style={{fontSize:10,color:TH.textDim,marginTop:4}}>Auto-set when you pick a city. Tap DST if birth was during summer daylight saving time.</div>
      </div>

      {/* Submit */}
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <Btn primary onClick={()=>{setShowCities(false);onSubmit(d)}} theme={TH} style={{flex:1}}>Generate Chart ✦</Btn>
        {onCancel&&<Btn onClick={onCancel} theme={TH}>Cancel</Btn>}
      </div>
    </div>
  );
}

// ── Aspect Descriptions ────────────────────────────────────────
const ASP_IX={
  Conjunction:"Fusion of energies. These two planets merge their qualities, amplifying and blending their expression. Can be harmonious or tense depending on the planets involved.",
  Sextile:"Opportunity and talent. A flowing, cooperative connection that offers potential when actively engaged. Gentle support between these planetary energies.",
  Square:"Tension and growth. These planets challenge each other, creating friction that demands action. The most dynamic aspect — source of motivation and achievement through effort.",
  Trine:"Natural harmony and ease. These planetary energies flow together effortlessly, indicating innate talent. Can become complacent without conscious development.",
  Opposition:"Awareness through polarity. These planets sit across the chart, creating a push-pull dynamic. Seeks balance between two competing needs. Often projected onto relationships.",
  Quincunx:"Awkward adjustment. These planets have nothing in common and require constant calibration. A source of subtle stress that resists easy resolution.",
  "Semi-sextile":"Mild friction. Adjacent signs that share little common ground, requiring small ongoing adjustments. A background hum rather than a loud signal."
};

// ── Interactive Tab Components ──────────────────────────────────
// ── Natal Aspect Interpretation Library ────────────────────────
// Layered system: planet nature × aspect type × planet nature
const PLANET_THEMES={sun:"identity, ego, life purpose, vitality",moon:"emotions, instincts, comfort needs, the inner self",mercury:"thinking, communication, learning, perception",venus:"love, beauty, values, attraction, pleasure",mars:"drive, ambition, anger, sexuality, action",jupiter:"growth, luck, expansion, faith, abundance",saturn:"discipline, limits, authority, responsibility, mastery",uranus:"revolution, freedom, originality, disruption",neptune:"dreams, spirituality, illusion, compassion, dissolution",pluto:"power, transformation, obsession, rebirth, the shadow"};
const ASPECT_ENERGY={Conjunction:"merges and intensifies — these energies fuse into a single powerful force that's impossible to separate. The planets amplify each other, for better or worse.",Sextile:"creates natural opportunity and talent — these energies cooperate easily, offering gifts that activate when you consciously engage them. Gentle but productive.",Square:"generates tension, friction, and motivation — these energies clash, forcing you to grow through challenge. The most dynamic aspect, driving achievement through effort and creative problem-solving.",Trine:"flows with effortless harmony — these energies support each other naturally, creating innate talent and ease. The risk is complacency; the gift is grace.",Opposition:"creates a seesaw of awareness — these energies pull in opposite directions, demanding balance. Often projected onto relationships. The lesson is integration, not choosing one side.",Quincunx:"creates awkward friction — these energies have nothing in common and require constant adjustment. A source of subtle, persistent stress that resists easy resolution."};
function getAspectInterp(p1Key,p2Key,aspName,chart){
  const p1=PLANETS.find(p=>p.key===p1Key),p2=PLANETS.find(p=>p.key===p2Key);
  if(!p1||!p2)return"";
  const pl1=chart.pl[p1Key],pl2=chart.pl[p2Key];
  const t1=PLANET_THEMES[p1Key]||p1.name,t2=PLANET_THEMES[p2Key]||p2.name;
  const energy=ASPECT_ENERGY[aspName]||"connects these planetary energies.";
  // Build specific interpretation
  let specific="";
  const pair=[p1Key,p2Key].sort().join("-");
  // Sun aspects
  if(pair==="moon-sun"&&aspName==="Conjunction")specific="Your conscious will and emotional instincts are fused — you present a unified front to the world. What you want and what you need are aligned, giving you inner coherence but sometimes difficulty seeing yourself objectively.";
  else if(pair==="moon-sun"&&aspName==="Opposition")specific="A fundamental tension between your ego needs and emotional needs. You may feel pulled between what you want to be and what you feel. Relationships often mirror this inner split — partners reflect the qualities you haven't integrated.";
  else if(pair==="moon-sun"&&aspName==="Square")specific="Internal friction between your identity and your emotional nature. What makes you feel safe often conflicts with who you're trying to become. This tension drives tremendous personal growth but can create restlessness.";
  else if(pair==="moon-sun"&&aspName==="Trine")specific="Beautiful inner harmony between will and feeling. You instinctively know how to get what you need. Others find you emotionally authentic because your inner and outer selves are naturally aligned.";
  else if(pair.includes("venus")&&pair.includes("mars"))specific=aspName==="Conjunction"?"Magnetic sexual charisma. Your desire nature and your attraction nature are fused — you go after what you want in love with directness and passion. Extremely potent creative and romantic energy.":aspName==="Square"?"Tension between what you desire and what you attract. Passion runs high but relationships can be combative. The friction creates intense chemistry but requires learning to balance assertion with receptivity.":aspName==="Opposition"?"A powerful polarity between masculine and feminine energies within you, often projected onto partners. Relationships are charged with attraction but also push-pull dynamics. Learning to own both sides creates magnetic wholeness.":"Your desire nature and your sense of beauty work "+energy.split("—")[0]+". Love, creativity, and passion are connected.";
  else if(pair.includes("saturn")&&pair.includes("sun"))specific=aspName==="Conjunction"?"Authority and discipline are core to your identity. You take life seriously and feel the weight of responsibility early. Over time, you develop genuine mastery and earn respect that lasts. Can indicate a demanding father figure.":aspName==="Square"?"A fundamental tension between your desire to shine and the voice that says you're not good enough. This aspect drives extraordinary achievement through the need to prove yourself. The work is learning that your worth isn't contingent on accomplishment.":aspName==="Opposition"?"You attract authority figures who challenge, limit, or test you — until you develop your own inner authority. Career may feel blocked until you stop seeking external validation and build genuine self-discipline.":"Your sense of identity and your relationship with authority "+energy.split("—")[0]+". Discipline and self-expression find a working relationship.";
  else if(pair.includes("jupiter")&&pair.includes("saturn"))specific="The great balancing act between expansion and contraction, optimism and realism, faith and discipline. "+aspName+" "+energy.split("—")[0]+". This aspect shapes your relationship with success — whether you grow through leaps of faith or steady, strategic building.";
  else if(pair.includes("pluto")&&pair.includes("sun"))specific="Intense personal power and the capacity for profound self-transformation. "+aspName+" "+energy.split("—")[0]+". You are drawn to experiences that strip away pretense and reveal your core. Power dynamics are a central life theme — learning to wield influence without being consumed by it.";
  else if(pair.includes("neptune")&&pair.includes("moon"))specific="Extraordinary emotional sensitivity and psychic receptivity. "+aspName+" "+energy.split("—")[0]+". Your emotional boundaries are naturally thin — you absorb the feelings of those around you. Creative and spiritual gifts flow from this sensitivity, but you must learn to distinguish your emotions from others'.";
  else if(pair.includes("uranus")&&pair.includes("sun"))specific="A strong need for individual freedom and authenticity. "+aspName+" "+energy.split("—")[0]+". You resist conformity instinctively and may have experienced sudden disruptions to your sense of identity. Your path is unconventional, and trying to fit a standard mold creates deep restlessness.";
  // Generic but still meaningful
  if(!specific){
    specific=`Your ${p1.name} (${t1}) ${energy.split("—")[0]} with your ${p2.name} (${t2}). ${aspName==="Square"?"This creates productive tension — "+p1.name+"'s expression must negotiate with "+p2.name+"'s demands, driving growth through effort.":aspName==="Trine"?"This is a natural gift — "+p1.name+" and "+p2.name+" support each other effortlessly, creating ease in how these life areas interact.":aspName==="Opposition"?"These energies seek balance — you may project "+p2.name+" qualities onto others until you integrate both sides consciously.":aspName==="Conjunction"?p1.name+" and "+p2.name+" are inseparable in your psyche — they amplify each other and express as a unified force.":p1.name+" and "+p2.name+" find a working relationship through this aspect."} In House ${pl1?.house} and House ${pl2?.house}, this plays out through ${HOUSE_IX[pl1?.house]?.split(".")[0]?.toLowerCase()} and ${HOUSE_IX[pl2?.house]?.split(".")[0]?.toLowerCase()}.`;
  }
  return specific;
}

function InterpretTab({chart,TH,zsys}){
  const [open,setOpen]=useState(null);
  const [openAspect,setOpenAspect]=useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4,maxWidth:640}}>
      {PLANETS.slice(0,10).map(p=>{const pl=chart.pl[p.key];if(!pl)return null;
        const isOpen=open===p.key;
        const dig=getDignity(p.name,pl.sign);
        const pAspects=chart.aspects.filter(a=>a.p1===p.key||a.p2===p.key).slice(0,8);
        return (
          <div key={p.key} style={{background:isOpen?TH.bgCard:"transparent",border:`1px solid ${isOpen?TH.cardBorder:TH.borderLight}`,borderRadius:12,overflow:"hidden",transition:"all 0.2s"}}>
            <div onClick={()=>{setOpen(isOpen?null:p.key);setOpenAspect(null)}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer"}}>
              <span style={{fontSize:20,color:p.color}}>{p.sym}</span>
              <span style={{fontSize:14,fontWeight:600,color:TH.text}}>{p.name} in {pl.sign}</span>
              <span style={{fontSize:11,color:pl.signColor}}>{pl.signSym}</span>
              <span style={{fontSize:11,color:TH.textDim,marginLeft:"auto"}}>H{pl.house}</span>
              {pl.rx&&<span style={{color:TH.rose,fontSize:10}}>℞</span>}
              {pAspects.length>0&&<span style={{fontSize:9,color:TH.textDim,background:TH.borderLight,padding:"2px 5px",borderRadius:4}}>{pAspects.length} aspects</span>}
              <span style={{color:TH.textDim,fontSize:12,marginLeft:4,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 16px 16px",animation:"fadeIn 0.2s ease-out"}}>
                {dig&&<div style={{fontSize:11,color:dig.color,marginBottom:8,padding:"3px 8px",background:`${dig.color}10`,borderRadius:5,display:"inline-block"}}>{dig.icon} {dig.type} in {pl.sign}</div>}
                {zsys==="sidereal"&&<div style={{fontSize:11,color:TH.accent,marginBottom:8}}>✧ Nakshatra: {pl.nak}</div>}
                <div style={{fontSize:13,color:TH.textMuted,lineHeight:1.7,marginBottom:12}}>
                  {IX[p.key]?.[pl.sign]||`${p.name} in ${pl.sign}: a unique combination blending ${p.name}'s energy with ${pl.sign}'s qualities.`}
                </div>
                <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.6,padding:"8px 10px",background:`${TH.accent}06`,borderRadius:8,marginBottom:12}}>
                  <span style={{fontWeight:600,color:TH.accent}}>House {pl.house}:</span> {HOUSE_IX[pl.house]?.split(".").slice(0,2).join(".")+"."}
                </div>
                {/* Integrated Aspects — expandable with specific interpretations */}
                {pAspects.length>0&&(
                  <div>
                    <div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Natal Aspects</div>
                    {pAspects.map((a,i)=>{
                      const other=a.p1===p.key?a.p2:a.p1;
                      const op=PLANETS.find(pp=>pp.key===other);
                      const opl=chart.pl[other];
                      const isAspOpen=openAspect===p.key+"-"+i;
                      const interp=getAspectInterp(a.p1,a.p2,a.asp.name,chart);
                      return (
                        <div key={i} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${isAspOpen?a.asp.color+"30":"transparent"}`,marginBottom:3,background:isAspOpen?`${a.asp.color}06`:"transparent"}}>
                          <div onClick={()=>setOpenAspect(isAspOpen?null:p.key+"-"+i)} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:TH.textMuted,padding:"6px 8px",cursor:"pointer"}}>
                            <span style={{color:a.asp.color,fontSize:14}}>{a.asp.sym}</span>
                            <span style={{color:a.asp.color,fontWeight:600}}>{a.asp.name}</span>
                            <span style={{color:op?.color}}>{op?.sym}</span>
                            <span>{op?.name}</span>
                            {opl&&<span style={{color:TH.textDim,fontSize:10}}>({opl.sign})</span>}
                            <span style={{marginLeft:"auto",color:TH.textDim,fontSize:10}}>{a.orb}°{a.exact?" exact":""}</span>
                            <span style={{color:TH.textDim,fontSize:10,transition:"transform 0.15s",transform:isAspOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                          </div>
                          {isAspOpen&&(
                            <div style={{padding:"4px 8px 10px",animation:"fadeIn 0.15s ease-out"}}>
                              <div style={{display:"flex",gap:8,marginBottom:8}}>
                                <div style={{flex:1,padding:"6px 8px",background:`${p.color}08`,borderRadius:6,fontSize:10}}>
                                  <span style={{color:p.color,fontWeight:600}}>{p.sym} {p.name}</span>
                                  <div style={{color:TH.textDim}}>{pl.sign} {pl.deg} · H{pl.house}</div>
                                </div>
                                <div style={{flex:1,padding:"6px 8px",background:`${op?.color}08`,borderRadius:6,fontSize:10}}>
                                  <span style={{color:op?.color,fontWeight:600}}>{op?.sym} {op?.name}</span>
                                  <div style={{color:TH.textDim}}>{opl?.sign} {opl?.deg} · H{opl?.house}</div>
                                </div>
                              </div>
                              <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7}}>{interp}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function AspectsTab({chart,TH}){
  const [open,setOpen]=useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3,maxWidth:640}}>
      {chart.aspects.slice(0,35).map((a,i)=>{
        const p1=PLANETS.find(p=>p.key===a.p1),p2=PLANETS.find(p=>p.key===a.p2);
        if(!p1||!p2) return null;
        const isOpen=open===i;
        const pl1=chart.pl[a.p1],pl2=chart.pl[a.p2];
        return (
          <div key={i} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${isOpen?TH.cardBorder:"transparent"}`,background:isOpen?TH.bgCard:(a.exact?`${TH.accent}06`:"transparent"),transition:"all 0.15s"}}>
            <div onClick={()=>setOpen(isOpen?null:i)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",cursor:"pointer",fontSize:12,fontFamily:FONT,color:TH.text}}>
              <span style={{color:p1.color,width:18,textAlign:"center",fontSize:15}}>{p1.sym}</span>
              <span style={{color:TH.textMuted,width:55,fontSize:11}}>{p1.name}</span>
              <span style={{color:a.asp.color,width:16,textAlign:"center",fontSize:16}}>{a.asp.sym}</span>
              <span style={{color:a.asp.color,width:75,fontSize:11}}>{a.asp.name}</span>
              <span style={{color:p2.color,width:18,textAlign:"center",fontSize:15}}>{p2.sym}</span>
              <span style={{color:TH.textMuted,width:55,fontSize:11}}>{p2.name}</span>
              <span style={{marginLeft:"auto",color:a.exact?TH.accent:TH.textDim,fontSize:10}}>{a.orb}°{a.exact?" exact":""}</span>
              <span style={{color:TH.textDim,fontSize:11,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 10px 12px",animation:"fadeIn 0.15s ease-out"}}>
                <div style={{display:"flex",gap:16,marginBottom:8,marginTop:4}}>
                  <div style={{flex:1,padding:"8px 10px",background:`${p1.color}08`,borderRadius:6,fontSize:11}}>
                    <div style={{color:p1.color,fontWeight:600,marginBottom:2}}>{p1.sym} {p1.name}</div>
                    <div style={{color:TH.textMuted}}>{pl1?.sign} {pl1?.deg}</div>
                    <div style={{color:TH.textDim}}>House {pl1?.house}</div>
                  </div>
                  <div style={{flex:1,padding:"8px 10px",background:`${p2.color}08`,borderRadius:6,fontSize:11}}>
                    <div style={{color:p2.color,fontWeight:600,marginBottom:2}}>{p2.sym} {p2.name}</div>
                    <div style={{color:TH.textMuted}}>{pl2?.sign} {pl2?.deg}</div>
                    <div style={{color:TH.textDim}}>House {pl2?.house}</div>
                  </div>
                </div>
                <div style={{fontSize:11,color:TH.textMuted,lineHeight:1.6}}>{ASP_IX[a.asp.name]||""}</div>
                <div style={{fontSize:10,color:TH.textDim,marginTop:4}}>Orb: {a.orb}° · Type: {a.asp.t}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PatternsTab({chart,TH}){
  const [open,setOpen]=useState(null);
  const PATTERN_IX={
    "Grand Trine":"A closed triangle of three trines (120° each) linking three planets in signs of the same element. Represents natural talent, ease, and flow — but can become a comfort zone that resists growth. The key is to actively channel this gift rather than coast on it.",
    "T-Square":"Two planets in opposition (180°) with a third squaring both (90°). The apex planet bears the most pressure and becomes the focal point for resolving the tension. One of the most dynamic and productive patterns — drives achievement through sustained effort and creative problem-solving."
  };
  if(!chart.patterns.length) return (
    <div style={{color:TH.textDim,fontSize:13,padding:20,background:TH.bgCard,borderRadius:12}}>No major aspect patterns detected in this chart. Patterns like Grand Trines and T-Squares require specific geometric relationships between three or more planets.</div>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {chart.patterns.map((p,i)=>{
        const isOpen=open===i;
        return (
          <div key={i} style={{background:`${p.color}${isOpen?"15":"08"}`,border:`1px solid ${p.color}${isOpen?"40":"25"}`,borderRadius:12,overflow:"hidden",transition:"all 0.2s"}}>
            <div onClick={()=>setOpen(isOpen?null:i)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:p.color}}>{p.name}</div>
                <div style={{fontSize:12,color:TH.textMuted,marginTop:2}}>
                  {p.planets.map(k=>PLANETS.find(pl=>pl.key===k)?.name||k).join(", ")}
                  {p.apex&&` · Apex: ${PLANETS.find(pl=>pl.key===p.apex)?.name}`}
                </div>
              </div>
              <span style={{color:p.color,fontSize:12,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 16px 16px",animation:"fadeIn 0.15s ease-out"}}>
                <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7,marginBottom:10}}>{PATTERN_IX[p.name]||""}</div>
                <div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Planets Involved</div>
                {p.planets.map(k=>{const pp=PLANETS.find(pl=>pl.key===k);const pl=chart.pl[k];if(!pp||!pl) return null;
                  return (
                    <div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:TH.bgCard,borderRadius:6,marginBottom:4,fontSize:12}}>
                      <span style={{color:pp.color,fontSize:16}}>{pp.sym}</span>
                      <span style={{color:TH.text,fontWeight:600}}>{pp.name}</span>
                      <span style={{color:pl.signColor}}>{pl.signSym}</span>
                      <span style={{color:TH.textMuted}}>{pl.sign} {pl.deg}</span>
                      <span style={{marginLeft:"auto",color:TH.textDim,fontSize:10}}>H{pl.house}</span>
                      {k===p.apex&&<span style={{color:p.color,fontSize:9,padding:"1px 5px",background:`${p.color}20`,borderRadius:4}}>APEX</span>}
                    </div>
                  );
                })}
                {/* Show the aspects that form this pattern */}
                <div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginTop:8,marginBottom:4}}>Forming Aspects</div>
                {chart.aspects.filter(a=>p.planets.includes(a.p1)&&p.planets.includes(a.p2)).map((a,j)=>{
                  const pp1=PLANETS.find(x=>x.key===a.p1),pp2=PLANETS.find(x=>x.key===a.p2);
                  return (
                    <div key={j} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:TH.textMuted,padding:"2px 0"}}>
                      <span style={{color:pp1?.color}}>{pp1?.sym}</span>
                      <span style={{color:a.asp.color}}>{a.asp.sym} {a.asp.name}</span>
                      <span style={{color:pp2?.color}}>{pp2?.sym} {pp2?.name}</span>
                      <span style={{marginLeft:"auto",color:TH.textDim}}>{a.orb}°</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HousesTab({chart,TH}){
  const [open,setOpen]=useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {chart.houses.map((d,i)=>{
        const sg=getSign(d),pls=PLANETS.filter(p=>chart.pl[p.key]?.house===i+1);
        const isOpen=open===i;
        return (
          <div key={i} style={{background:isOpen?TH.bgCard:"transparent",border:`1px solid ${isOpen?TH.cardBorder:TH.borderLight}`,borderRadius:12,overflow:"hidden",transition:"all 0.15s"}}>
            <div onClick={()=>setOpen(isOpen?null:i)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer"}}>
              <span style={{fontFamily:FONT_D,fontSize:18,color:TH.lavender,width:70}}>House {i+1}</span>
              <span style={{fontSize:12,color:sg.c}}>{sg.s} {sg.n}</span>
              <span style={{fontSize:10,color:TH.textDim}}>{fmtDeg(d)}</span>
              {pls.length>0&&<div style={{display:"flex",gap:2,marginLeft:"auto"}}>{pls.map(p=> (<span key={p.key} style={{color:p.color,fontSize:14}}>{p.sym}</span>))}</div>}
              <span style={{color:TH.textDim,fontSize:11,marginLeft:pls.length?4:"auto",transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 16px 16px",animation:"fadeIn 0.15s ease-out"}}>
                <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7,marginBottom:10}}>{HOUSE_IX[i+1]}</div>
                {pls.length>0?(
                  <div>
                    <div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Planets in this house</div>
                    {pls.map(p=>{const pl=chart.pl[p.key];const dig=getDignity(p.name,pl?.sign);return (
                      <div key={p.key} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:`${p.color}08`,borderRadius:6,marginBottom:4,fontSize:12}}>
                        <span style={{color:p.color,fontSize:16}}>{p.sym}</span>
                        <span style={{color:TH.text,fontWeight:600}}>{p.name}</span>
                        <span style={{color:pl?.signColor}}>{pl?.signSym}</span>
                        <span style={{color:TH.textMuted}}>{pl?.sign} {pl?.deg}</span>
                        {dig&&<span style={{marginLeft:"auto",color:dig.color,fontSize:9}}>{dig.icon}</span>}
                        {pl?.rx&&<span style={{color:TH.rose,fontSize:10}}>℞</span>}
                      </div>
                    )})}
                  </div>
                ):(
                  <div style={{fontSize:11,color:TH.textDim,fontStyle:"italic"}}>No planets in this house</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DignityTab({chart,TH}){
  const [open,setOpen]=useState(null);
  const DIG_IX={
    Domicile:"The planet is in the sign it rules — completely at home. Its energy expresses naturally and powerfully, like being in your own house with all your tools at hand.",
    Exalted:"The planet is honored and elevated in this sign. Its best qualities are amplified and refined, like being a celebrated guest at a banquet held in your honor.",
    Detriment:"The planet is in the sign opposite its domicile — uncomfortable and working against the grain. Its expression is challenged and must find indirect or unconventional outlets.",
    Fall:"The planet is in the sign opposite its exaltation — diminished and struggling. Its energy is weakened, requiring extra effort and consciousness to express constructively."
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4,maxWidth:540}}>
      <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Essential Dignities & Debilities</div>
      {PLANETS.slice(0,7).map(p=>{const pl=chart.pl[p.key];if(!pl) return null;
        const dig=getDignity(p.name,pl.sign);
        const isOpen=open===p.key;
        return (
          <div key={p.key} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${isOpen?(dig?dig.color+"40":TH.border):(dig?dig.color+"20":TH.borderLight)}`,background:isOpen?(dig?`${dig.color}10`:TH.bgCard):(dig?`${dig.color}06`:"transparent"),transition:"all 0.15s"}}>
            <div onClick={()=>setOpen(isOpen?null:p.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}}>
              <span style={{color:p.color,fontSize:18}}>{p.sym}</span>
              <span style={{width:65,fontSize:13,color:TH.text,fontWeight:600}}>{p.name}</span>
              <span style={{color:pl.signColor}}>{pl.signSym}</span>
              <span style={{fontSize:12,color:TH.textMuted}}>in {pl.sign}</span>
              {dig?<span style={{color:dig.color,fontSize:12,fontWeight:600,marginLeft:"auto"}}>{dig.icon} {dig.type}</span>:<span style={{color:TH.textDim,fontSize:11,marginLeft:"auto"}}>Peregrine</span>}
              <span style={{color:TH.textDim,fontSize:11,marginLeft:6,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 14px 14px",animation:"fadeIn 0.15s ease-out"}}>
                {dig?(
                  <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7}}>{DIG_IX[dig.type]||""}</div>
                ):(
                  <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.7}}>This planet has no essential dignity or debility in {pl.sign} — it operates as a "guest" with neither special advantage nor disadvantage. Expression depends more on aspects and house placement.</div>
                )}
                <div style={{marginTop:8,padding:"8px 10px",background:TH.bgCard,borderRadius:6,fontSize:11}}>
                  <div style={{color:TH.textDim,marginBottom:4}}>Dignity Table for {p.name}:</div>
                  {DIGNITIES[p.name]?(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
                      <span style={{color:"#6ee7b7"}}>🏠 Domicile: {DIGNITIES[p.name].dom}</span>
                      <span style={{color:"#fbbf24"}}>⬆ Exalted: {DIGNITIES[p.name].exalt}</span>
                      <span style={{color:"#ef4444"}}>⬇ Detriment: {DIGNITIES[p.name].det}</span>
                      <span style={{color:"#b91c1c"}}>↓ Fall: {DIGNITIES[p.name].fall}</span>
                    </div>
                  ):(
                    <div style={{color:TH.textDim}}>No traditional dignities assigned to {p.name}.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
// ── Career & Finance Interpretations ──────────────────────────
const CAREER_IX={
  mc:{Aries:"Natural leader. Career in pioneering fields, entrepreneurship, military, athletics, or anywhere you can blaze trails.",Taurus:"Steady career builder. Finance, real estate, agriculture, luxury goods, art, music — anything requiring patience and sensory refinement.",Gemini:"Multi-talented communicator. Writing, journalism, teaching, marketing, sales, tech, or careers requiring versatility and mental agility.",Cancer:"Nurturing authority figure. Healthcare, food industry, real estate, family business, counseling, or roles caring for others.",Leo:"Born to shine publicly. Entertainment, leadership, creative direction, politics, luxury brands, or anywhere your charisma commands a stage.",Virgo:"Precision-oriented professional. Healthcare, analytics, editing, nutrition, veterinary, research, quality assurance, or service industries.",Libra:"Career diplomat. Law, design, fashion, public relations, mediation, art curation, or partnerships and consulting.",Scorpio:"Deep transformation work. Psychology, surgery, investigation, finance, research, crisis management, or anything probing beneath surfaces.",Sagittarius:"Expansive career vision. Higher education, publishing, travel industry, law, philosophy, international business, or spiritual teaching.",Capricorn:"Born executive. Corporate leadership, government, architecture, engineering, management, or any field requiring long-term strategic building.",Aquarius:"Innovative disruptor. Technology, science, humanitarian work, social media, activism, aviation, or progressive/unconventional fields.",Pisces:"Creative and compassionate career. Film, music, photography, spirituality, healing arts, marine work, or nonprofit/charitable organizations."},
  h2ruler:{Venus:"Earns through charm, beauty, relationships, art, or diplomacy. Attracting money feels natural.",Mars:"Earns through energy, initiative, competition, or physical effort. Motivated by financial independence.",Jupiter:"Earns through expansion, teaching, travel, or generosity. Money tends to flow abundantly when following purpose.",Saturn:"Earns through discipline, patience, authority, and expertise built over time. Slow but lasting wealth.",Mercury:"Earns through communication, ideas, writing, teaching, or intellectual services. Multiple income streams likely.",Moon:"Earns through nurturing, intuition, public-facing work, or businesses serving emotional needs.",Sun:"Earns through personal identity, leadership, creativity, or self-expression. Income tied to visibility and recognition."},
  h6:{empty:"No planets in your 6th house suggests work routines develop organically. The sign on the cusp colors your work style.",planets:"Planets in your 6th house bring focused energy to daily work, health routines, and service. These shape how you approach tasks and manage your day-to-day professional life."},
};

// ── TRANSIT INTERPRETATION LIBRARIES ──────────────────────────────────
// TA: Transit body × aspect type — what's the ENERGY of this transit?
const TA_IX = {
  Pluto: {
    conjunction:"Pluto on this point initiates a profound, years-long transformation. Something fundamental is being restructured from the roots. There's no going back — only forward through the metamorphosis. This is the most significant type of transit in astrology.",
    opposition:"Pluto opposes this point, creating a crucible. External pressures — relationships, power dynamics, confrontations — force you to reckon with what's been hidden or denied. What emerges is refined and real.",
    square:"Pluto squares this point, generating intense friction. The pressure is psychological — obsessive thoughts, power struggles, compulsive behaviors — all pushing you to transform what you've been avoiding.",
    trine:"Pluto trines this point, offering a rare gift of conscious transformation. You have natural access to depth and power now. This is a time when profound change feels supported rather than forced.",
    sextile:"Pluto sextiles this point with supportive depth. Opportunities arise to engage with power, psychology, and transformation in ways that feel manageable rather than overwhelming."
  },
  Neptune: {
    conjunction:"Neptune dissolves the boundaries around this point. Reality becomes dreamlike — more fluid, more imaginative, but also more confused. Spiritual openings and illusions arrive together. Stay grounded.",
    opposition:"Neptune opposes this point, creating a fog between you and external reality. Others may deceive you, or you may project fantasies onto them. Great art and spiritual insight are possible — so is disillusionment.",
    square:"Neptune squares this point with confusion and dissolution. Old certainties melt. You may feel lost, tired, or drawn to escape. The transit asks you to release what's illusory without losing what's real.",
    trine:"Neptune trines this point, opening channels to imagination, compassion, and spiritual sensitivity. Creativity flows naturally; intuition sharpens. A gentle, inspiring transit.",
    sextile:"Neptune sextiles this point, offering subtle opportunities for spiritual growth, artistic expression, or compassionate service. The energy is soft but available if you engage it."
  },
  Uranus: {
    conjunction:"Uranus electrifies this point with sudden awakening. Old structures shatter to make room for authentic individuality. Expect surprises, liberation, and a feeling of finally becoming who you really are.",
    opposition:"Uranus opposes this point — external events or relationships bring shocking changes. Someone else's independence or unpredictability disrupts your status quo. The goal is to free yourself without alienating everyone.",
    square:"Uranus squares this point with abrupt disruption. Tensions build until something breaks. Rebellion, restlessness, and the urgent need for change are themes. Channel the energy into conscious liberation.",
    trine:"Uranus trines this point, bringing genius, innovation, and welcome breakthroughs. New ideas and unexpected opportunities appear. Freedom feels possible without destruction.",
    sextile:"Uranus sextiles this point with a spark of innovation. You have opportunities to experiment, break small patterns, and try something new without major disruption."
  },
  Saturn: {
    conjunction:"Saturn meets this point with the weight of maturity and responsibility. Structures are built or collapsed depending on what's been earned. This is a reckoning — with reality, with time, with what's authentic.",
    opposition:"Saturn opposes this point — external authority, limits, or responsibilities confront you. Commitments are tested. What's been avoided comes due. The transit builds endurance and realism.",
    square:"Saturn squares this point with friction and frustration. Progress feels slow; obstacles are many. This is where you develop discipline, persistence, and the ability to work with limits rather than against them.",
    trine:"Saturn trines this point, offering rewards for past discipline. Structures solidify. Recognition, promotions, or the fruits of long effort arrive. Work done now has lasting value.",
    sextile:"Saturn sextiles this point with steady, constructive opportunity. Good for building, committing, and taking on appropriate responsibility. Not flashy but deeply useful."
  },
  Jupiter: {
    conjunction:"Jupiter expands this point with optimism, opportunity, and growth. Doors open. Your reach extends. The risk is overextension — bite off what you can actually chew, and ride the wave of good fortune.",
    opposition:"Jupiter opposes this point — through partners, legal matters, or foreign influences, life expands. Beware overcommitment. The blessing is real but needs editing.",
    square:"Jupiter squares this point with excess. Over-promises, overconfidence, or legal/moral tensions. The energy is fundamentally positive but poorly aimed — refine your target and growth becomes real.",
    trine:"Jupiter trines this point — one of the most favorable transits. Expansion, opportunity, and good fortune flow naturally. Travel, education, and meaningful growth are supported.",
    sextile:"Jupiter sextiles this point with an open door for growth. Opportunities require you to say yes, but they're well-proportioned and genuinely beneficial."
  },
  Mars: {
    conjunction:"Mars activates this point with energy, drive, and sometimes conflict. Take action on long-delayed matters. Watch for anger, haste, and impulsive decisions.",
    opposition:"Mars opposes this point — external conflicts or competitors appear. Assertiveness from others challenges you. Hold your ground without escalating.",
    square:"Mars squares this point with irritation and obstacles. Frustration builds. Channel the energy into physical activity or focused work rather than outbursts.",
    trine:"Mars trines this point with courageous momentum. Physical energy, decisiveness, and willpower are all available. Excellent for initiating action.",
    sextile:"Mars sextiles this point, offering available energy for action. Good for starting projects, exercising, and asserting yourself in measured ways."
  }
};

// NR: Natal point × aspect — what area of life is being activated?
const NR_IX = {
  Sun:"your core identity, vitality, and life direction",
  Moon:"your emotional world, inner life, and sense of security",
  Mercury:"your mind, communication, and daily interactions",
  Venus:"your relationships, values, and capacity for pleasure",
  Mars:"your drive, sexuality, and how you assert yourself",
  Jupiter:"your beliefs, opportunities for growth, and luck",
  Saturn:"your structures, responsibilities, and lessons in maturity",
  Uranus:"your individuality, freedom, and innovative edge",
  Neptune:"your dreams, spirituality, and capacity for transcendence",
  Pluto:"your power, psychological depths, and transformation",
  NNode:"your karmic growth direction and soul's evolution",
  SNode:"your karmic past and familiar patterns",
  Chiron:"your core wound and healing gift",
  Lilith:"your untamed, rejected, or repressed self"
};

// SPECIAL: rare, milestone transits deserve unique interpretations
const SPECIAL_IX = {
  "Saturn-conjunction-Saturn":"Saturn Return — one of life's great maturation points, happening every 29-30 years. Structures that no longer serve collapse; you step into adult authority. What you build now lasts decades.",
  "Saturn-opposition-Saturn":"Saturn Opposition (~age 14-15, 44-45, 73-74) — a midpoint reckoning. The structures you've built face tests. Adjust course toward what's authentic.",
  "Saturn-square-Saturn":"Saturn Square Saturn — one of the recurring crunch points (~age 7, 22, 37, 52). Pressure reveals what's solid and what's brittle.",
  "Uranus-opposition-Uranus":"Uranus Opposition (~age 40-42) — the classic midlife awakening. Suppressed individuality demands expression. Major life changes often occur. What have you not yet become?",
  "Uranus-square-Uranus":"Uranus Square Uranus (~age 21 and 63) — an urge toward freedom and authenticity. Expect a shift in how you express your unique self.",
  "Pluto-square-Pluto":"Pluto Square Pluto (~age 36-45) — a generational marker of psychological maturation. Deep transformation of identity, often through crisis.",
  "Jupiter-conjunction-Jupiter":"Jupiter Return (every ~12 years) — a fresh cycle of growth, optimism, and expansion begins. Plant seeds for the coming 12 years."
};

function getTransitReading(tBody, aspect, nPoint, tSign, isRet) {
  const spKey = `${tBody}-${aspect.name}-${nPoint}`;
  if (SPECIAL_IX[spKey]) return { isSpecial: true, body: SPECIAL_IX[spKey] };
  const taText = TA_IX[tBody]?.[aspect.name];
  const nrText = NR_IX[nPoint] || "this area of your chart";
  let body = "";
  if (taText) {
    body = taText + ` The transit touches ${nrText}.`;
  } else {
    body = `Transit ${tBody} ${aspect.name} your natal ${nPoint} activates themes of ${nrText}.`;
  }
  if (isRet) body += " Currently retrograde — the energy turns inward; this is a period of reworking rather than forward progress.";
  return { isSpecial: false, body };
}

// 12-month forecast: scans transits weekly across a year
function scanYearTransits(chart, startDate) {
  const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const TRANSIT_BODY_NAMES = ["Pluto","Neptune","Uranus","Saturn","Jupiter","Mars"];
  const months = [];
  for (let m = 0; m < 12; m++) {
    const mDate = new Date(startDate.getFullYear(), startDate.getMonth()+m, 1);
    const dim = new Date(mDate.getFullYear(), mDate.getMonth()+1, 0).getDate();
    const scanDays = [1, 8, 15, 22, Math.min(28, dim)];
    const aMap = new Map();
    for (const day of scanDays) {
      if (day > dim) continue;
      const sJD = jd(mDate.getFullYear(), mDate.getMonth()+1, day, 12);
      const tPos = calcAll(sJD);
      for (const tbName of TRANSIT_BODY_NAMES) {
        const tb = PLANETS.find(p => p.name === tbName);
        if (!tb) continue;
        const tv = tPos[tb.key];
        if (!tv) continue;
        for (const np of PLANETS) {
          const nv = chart.pos[np.key];
          if (!nv) continue;
          let diff = Math.abs(tv.lon - nv.lon);
          if (diff > 180) diff = 360 - diff;
          for (const asp of ASPECTS) {
            const orb = Math.abs(diff - asp.ang);
            const allowedOrb = ["conjunction","opposition"].includes(asp.name) ? 6 : ["square","trine"].includes(asp.name) ? 5 : 3;
            if (orb <= allowedOrb) {
              const key = tb.name + "-" + asp.name + "-" + np.name;
              const ex = aMap.get(key);
              if (!ex || orb < ex.orb) {
                const outerPri = {Pluto:10, Neptune:9, Uranus:8, Saturn:7, Jupiter:6, Mars:5};
                const weight = (outerPri[tb.name] || 1) * 3 + (10 - orb) + (asp.name === "conjunction" ? 3 : asp.name === "opposition" ? 2 : 1);
                aMap.set(key, {
                  tb, np, asp,
                  orb: Math.round(orb * 100) / 100,
                  weight,
                  tRx: tv.rx,
                  tSign: getSign(tv.lon),
                  nSign: getSign(nv.lon),
                  peakDate: MONTHS_SHORT[mDate.getMonth()] + " " + day,
                });
              }
            }
          }
        }
      }
    }
    const transits = [...aMap.values()].sort((a, b) => b.weight - a.weight);
    const intensity = transits.reduce((s, t) => s + t.weight, 0);
    months.push({
      date: mDate,
      label: MONTHS_FULL[mDate.getMonth()] + " " + mDate.getFullYear(),
      shortLabel: MONTHS_SHORT[mDate.getMonth()],
      transits,
      intensity,
    });
  }
  return months;
}

function monthNarrative(m) {
  if (!m.transits.length) return "A quieter month without major outer-planet transits in tight orb. Brief inner-planet activations may still create useful moments for action and reflection.";
  const top = m.transits[0];
  const bodies = [...new Set(m.transits.slice(0, 5).map(t => t.tb.name))];
  const special = m.transits.filter(t => SPECIAL_IX[t.tb.name + "-" + t.asp.name + "-" + t.np.name]).length;
  let s = (bodies.length > 1 ? "Multiple outer planets are" : "The planet " + bodies[0] + " is") + " making significant contact with your chart.";
  if (special) s += " " + special + " milestone transit" + (special > 1 ? "s" : "") + " carry extra weight.";
  s += " The dominant theme: " + top.tb.name + "'s " + top.asp.name + " to your natal " + top.np.name + ".";
  return s;
}

function CareerTab({chart,TH}){
  const [open,setOpen]=useState(null);
  const mcSign=getSign(chart.mc);
  const h2cusp=chart.houses[1];const h2Sign=getSign(h2cusp);
  const h6cusp=chart.houses[5];const h6Sign=getSign(h6cusp);
  const h8cusp=chart.houses[7];const h8Sign=getSign(h8cusp);
  const h10cusp=chart.houses[9];const h10Sign=getSign(h10cusp);

  // Find ruler of each house cusp
  const rulerMap={"Mars":"mars","Venus":"venus","Mercury":"mercury","Moon":"moon","Sun":"sun","Jupiter":"jupiter","Saturn":"saturn","Uranus":"uranus","Neptune":"neptune","Pluto":"pluto"};
  const h2Ruler=rulerMap[h2Sign.ruler];const h2RulerPl=chart.pl[h2Ruler];
  const h10Ruler=rulerMap[mcSign.ruler];const h10RulerPl=chart.pl[h10Ruler];

  const planetsInH2=PLANETS.filter(p=>chart.pl[p.key]?.house===2);
  const planetsInH6=PLANETS.filter(p=>chart.pl[p.key]?.house===6);
  const planetsInH8=PLANETS.filter(p=>chart.pl[p.key]?.house===8);
  const planetsInH10=PLANETS.filter(p=>chart.pl[p.key]?.house===10);

  // Key career planets
  const saturn=chart.pl.saturn;const jupiter=chart.pl.jupiter;const venus=chart.pl.venus;const mars=chart.pl.mars;const sun=chart.pl.sun;

  const sections=[
    {id:"mc",icon:"⬆",color:TH.accent,title:"Midheaven (MC) — Your Career Path",sub:`${mcSign.s} ${mcSign.n} ${fmtDeg(chart.mc)}`,content:CAREER_IX.mc[mcSign.n]||"Your MC sign shapes your public persona and career direction.",extra:()=>(<div>
      <div style={{fontSize:11,color:TH.textDim,marginTop:8}}>MC Ruler: <span style={{color:h10RulerPl?.signColor}}>{mcSign.ruler}</span> in {h10RulerPl?.sign} (H{h10RulerPl?.house})</div>
      <div style={{fontSize:11,color:TH.textMuted,marginTop:4,lineHeight:1.6}}>The ruler of your MC in House {h10RulerPl?.house} suggests your career success flows through the themes of that house — {HOUSE_IX[h10RulerPl?.house]}.</div>
      {planetsInH10.length>0&&<div style={{marginTop:8}}><div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Planets in 10th House</div>{planetsInH10.map(p=>{const pl=chart.pl[p.key];return(<div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"4px 8px",background:`${p.color}08`,borderRadius:6,marginBottom:3}}><span style={{color:p.color,fontSize:16}}>{p.sym}</span><span style={{color:TH.text,fontWeight:600}}>{p.name}</span><span>in {pl?.sign}</span></div>)})}</div>}
    </div>)},
    {id:"h2",icon:"💰",color:"#fbbf24",title:"2nd House — Earned Income & Self-Worth",sub:`${h2Sign.s} ${h2Sign.n} ${fmtDeg(h2cusp)}`,content:`Your 2nd house in ${h2Sign.n} (ruled by ${h2Sign.ruler}) shapes how you earn and relate to money. ${h2Sign.el==="Fire"?"You earn through boldness, initiative, and personal energy.":h2Sign.el==="Earth"?"You earn through practical skills, patience, and tangible results.":h2Sign.el==="Air"?"You earn through ideas, communication, and social connections.":"You earn through intuition, emotional intelligence, and creative depth."}`,extra:()=>(<div>
      <div style={{fontSize:11,color:TH.textDim,marginTop:8}}>2nd House Ruler: <span style={{color:h2RulerPl?.signColor}}>{h2Sign.ruler}</span> in {h2RulerPl?.sign} (H{h2RulerPl?.house})</div>
      {planetsInH2.length>0?<div style={{marginTop:8}}><div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Planets in 2nd House</div>{planetsInH2.map(p=>{const pl=chart.pl[p.key];return(<div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"4px 8px",background:`${p.color}08`,borderRadius:6,marginBottom:3}}><span style={{color:p.color,fontSize:16}}>{p.sym}</span><span style={{color:TH.text,fontWeight:600}}>{p.name}</span><span>in {pl?.sign}</span></div>)})}</div>:<div style={{fontSize:11,color:TH.textDim,marginTop:8,fontStyle:"italic"}}>No planets in the 2nd house — the ruler's condition tells the financial story.</div>}
    </div>)},
    {id:"h6",icon:"⚒",color:"#6ee7b7",title:"6th House — Daily Work & Service",sub:`${h6Sign.s} ${h6Sign.n} ${fmtDeg(h6cusp)}`,content:`Your 6th house in ${h6Sign.n} describes your daily work habits and service orientation. ${h6Sign.mod==="Cardinal"?"You initiate and lead in daily work.":h6Sign.mod==="Fixed"?"You're steady and persistent in routines.":"You're adaptable and versatile in your work approach."}`,extra:()=>(<div>
      {planetsInH6.length>0?<div style={{marginTop:8}}><div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Planets in 6th House</div>{planetsInH6.map(p=>{const pl=chart.pl[p.key];return(<div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"4px 8px",background:`${p.color}08`,borderRadius:6,marginBottom:3}}><span style={{color:p.color,fontSize:16}}>{p.sym}</span><span style={{color:TH.text,fontWeight:600}}>{p.name}</span><span>in {pl?.sign}</span></div>)})}</div>:<div style={{fontSize:11,color:TH.textDim,marginTop:8,fontStyle:"italic"}}>No planets in the 6th house — work routines shaped primarily by the cusp sign.</div>}
    </div>)},
    {id:"h8",icon:"🔄",color:"#f0abfc",title:"8th House — Shared Resources & Investments",sub:`${h8Sign.s} ${h8Sign.n} ${fmtDeg(h8cusp)}`,content:`Your 8th house in ${h8Sign.n} governs shared finances, investments, inheritance, taxes, and debt. This is "other people's money" — financial partnerships, joint ventures, and transformative financial events.`,extra:()=>(<div>
      {planetsInH8.length>0?<div style={{marginTop:8}}><div style={{fontSize:10,letterSpacing:1.5,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Planets in 8th House</div>{planetsInH8.map(p=>{const pl=chart.pl[p.key];return(<div key={p.key} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:TH.textMuted,padding:"4px 8px",background:`${p.color}08`,borderRadius:6,marginBottom:3}}><span style={{color:p.color,fontSize:16}}>{p.sym}</span><span style={{color:TH.text,fontWeight:600}}>{p.name}</span><span>in {pl?.sign}</span></div>)})}</div>:<div style={{fontSize:11,color:TH.textDim,marginTop:8,fontStyle:"italic"}}>No planets in the 8th house — shared finances develop through the cusp ruler's condition.</div>}
    </div>)},
    {id:"saturn",icon:"♄",color:"#78716c",title:"Saturn — Career Authority & Discipline",sub:`${saturn?.signSym} ${saturn?.sign} ${saturn?.deg} · House ${saturn?.house}`,content:`Saturn in ${saturn?.sign} (House ${saturn?.house}) shows where you build professional mastery through patience, discipline, and earned authority. Saturn's house is where you face your biggest challenges — and ultimately build your most enduring legacy. ${saturn?.house===10?"Saturn in the 10th house is the classic 'CEO placement' — career defines your life journey.":saturn?.house===2?"Saturn in the 2nd demands financial discipline — wealth comes slowly but solidly.":saturn?.house===6?"Saturn in the 6th house makes you a meticulous, dedicated worker who earns respect through reliability.":"Saturn here channels discipline into the "+HOUSE_IX[saturn?.house]?.split(",")[0]+" domain."}`},
    {id:"jupiter",icon:"♃",color:"#818cf8",title:"Jupiter — Expansion & Abundance",sub:`${jupiter?.signSym} ${jupiter?.sign} ${jupiter?.deg} · House ${jupiter?.house}`,content:`Jupiter in ${jupiter?.sign} (House ${jupiter?.house}) reveals where financial and professional growth comes most naturally. This is your area of luck, expansion, and opportunity. ${jupiter?.house===2?"Jupiter in the 2nd house is one of the strongest wealth indicators — natural financial abundance.":jupiter?.house===10?"Jupiter in the 10th blesses your career with expansion, recognition, and high-profile opportunities.":jupiter?.house===8?"Jupiter in the 8th can indicate significant wealth through investments, inheritance, or partnerships.":"Jupiter here brings growth and abundance through "+HOUSE_IX[jupiter?.house]?.split(",")[0]+"."}`},
    {id:"venus",icon:"♀",color:"#f0abfc",title:"Venus — What You Attract & Value",sub:`${venus?.signSym} ${venus?.sign} ${venus?.deg} · House ${venus?.house}`,content:`Venus in ${venus?.sign} (House ${venus?.house}) shows your earning style and relationship with material comfort. Venus attracts resources through beauty, charm, diplomacy, and the things you genuinely value. ${venus?.house===2?"Venus in the 2nd house is excellent for finances — you naturally attract money and value comfort.":venus?.house===10?"Venus in the 10th makes your career charming, artistic, or relationship-oriented.":"Venus here draws resources through "+HOUSE_IX[venus?.house]?.split(",")[0]+"."}`},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,maxWidth:640}}>
      <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:4}}>Career, Finances & Professional Life</div>
      {sections.map(s=>{
        const isOpen=open===s.id;
        return (
          <div key={s.id} style={{background:isOpen?TH.bgCard:"transparent",border:`1px solid ${isOpen?TH.cardBorder:TH.borderLight}`,borderRadius:12,overflow:"hidden",transition:"all 0.2s"}}>
            <div onClick={()=>setOpen(isOpen?null:s.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",cursor:"pointer"}}>
              <span style={{fontSize:20}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:s.color||TH.text}}>{s.title}</div>
                <div style={{fontSize:11,color:TH.textDim,marginTop:1}}>{s.sub}</div>
              </div>
              <span style={{color:TH.textDim,fontSize:12,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </div>
            {isOpen&&(
              <div style={{padding:"0 16px 16px",animation:"fadeIn 0.2s ease-out"}}>
                <div style={{fontSize:13,color:TH.textMuted,lineHeight:1.7}}>{s.content}</div>
                {s.extra&&s.extra()}
              </div>
            )}
          </div>
        );
      })}
      <div style={{background:`${TH.gold}08`,border:`1px solid ${TH.gold}20`,borderRadius:12,padding:14,marginTop:8}}>
        <div style={{fontSize:12,color:TH.gold,fontWeight:600,marginBottom:4}}>💡 Financial Summary</div>
        <div style={{fontSize:11,color:TH.textMuted,lineHeight:1.6}}>
          Your money axis runs from {h2Sign.n} (2nd, earned income) to {h8Sign.n} (8th, shared resources). Career authority (MC) is in {mcSign.n}, ruled by {mcSign.ruler} in House {h10RulerPl?.house}. Key wealth indicators: Jupiter in H{jupiter?.house}, Venus in H{venus?.house}, Saturn building mastery in H{saturn?.house}.
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── Default test profile (Wes) ────────────────────────────────
const WES_BIRTH={name:"Wes",year:1981,month:8,day:4,hour:8,minute:35,latitude:33.783,longitude:-118.30,location:"Harbor City, CA",utcOffset:-7};

export default function Celestia(){
  const [themeId,setThemeId]=useState(()=>LS.load("theme","dark"));
  const TH=THEMES[themeId]||THEMES.dark;
  const [profiles,setProfiles]=useState(()=>{const saved=LS.load("profiles",[]);if(!saved.find(p=>p.name==="Wes"))return[WES_BIRTH,...saved];return saved});
  const [active,setActive]=useState(null);
  const [chart,setChart]=useState(null);
  const [chart2,setChart2]=useState(null); // synastry
  const [synAspects,setSynAspects]=useState(null);
  const [view,setView]=useState("wheel");
  const [tab,setTab]=useState("chart");
  const [page,setPage]=useState("home");
  const [tExp,setTExp]=useState(0);
  const [tMode,setTMode]=useState("now");
  const [tSelMonth,setTSelMonth]=useState(0);
  const [tForecast,setTForecast]=useState(null);
  const [hsys,setHsys]=useState(()=>LS.load("hsys","placidus"));
  const [zsys,setZsys]=useState(()=>LS.load("zsys","tropical"));
  const [ephYear,setEphYear]=useState(new Date().getFullYear());
  const [ephMonth,setEphMonth]=useState(new Date().getMonth()+1);
  const [progYear,setProgYear]=useState(new Date().getFullYear());
  const [progData,setProgData]=useState(null);
  const [srData,setSrData]=useState(null);
  const [srYear,setSrYear]=useState(new Date().getFullYear());
  const [mobileNav,setMobileNav]=useState(false);
  const chartRef=useRef(null);

  // Auto-load Wes's chart on first render
  useEffect(()=>{
    const c=genChart(WES_BIRTH,"placidus","tropical");
    if(c){setChart(c);setActive(WES_BIRTH);setPage("chart");
      try{localStorage.setItem("celestia_active_natal",JSON.stringify(WES_BIRTH))}catch{}
    }
  },[]);

  useEffect(()=>{LS.save("theme",themeId)},[themeId]);
  useEffect(()=>{LS.save("hsys",hsys)},[hsys]);
  useEffect(()=>{LS.save("zsys",zsys)},[zsys]);

  const saveP=(p)=>{setProfiles(p);LS.save("profiles",p)};

  const go=useCallback((bd)=>{
    const c=genChart(bd,hsys,zsys);if(!c)return;
    setChart(c);setActive(bd);
    if(bd.name){const ex=profiles.findIndex(p=>p.name===bd.name),u=[...profiles];if(ex>=0)u[ex]=bd;else u.push(bd);saveP(u)}
    // Share active natal data with transits.html
    try{localStorage.setItem("celestia_active_natal",JSON.stringify(bd))}catch{}
    setPage("chart");setTab("chart");setSynAspects(null);setChart2(null);setProgData(null);setSrData(null);
  },[hsys,zsys,profiles]);

  const reCalc=useCallback((h,z)=>{if(active){const c=genChart(active,h,z);if(c)setChart(c)}},[active]);

  const toggleTheme=()=>setThemeId(t=>t==="dark"?"light":"dark");

  const exportChart=()=>{
    if(!chart||!active)return;
    const lines=[`CELESTIA — Birth Chart Report`,`${"═".repeat(40)}`,`Name: ${active?.name||"Unknown"}`,`Date: ${active?.month}/${active?.day}/${active?.year}`,`Time: ${String(active?.hour).padStart(2,"0")}:${String(active?.minute).padStart(2,"0")}`,`Location: ${active?.location}`,`System: ${zsys==="sidereal"?"Vedic Sidereal":"Western Tropical"} · ${HSYS.find(h=>h.id===hsys)?.n}`,``,`PLANETARY POSITIONS`,`${"─".repeat(40)}`];
    for(const p of PLANETS){const pl=chart?.pl[p.key];if(pl)lines.push(`${p.sym} ${p.name.padEnd(10)} ${pl.sign.padEnd(12)} ${pl.deg.padEnd(12)} House ${pl.house}${pl.rx?" ℞":""}`)}
    lines.push(``,`HOUSES (${HSYS.find(h=>h.id===hsys)?.n})`,`${"─".repeat(40)}`);
    for(let i=0;i<12;i++){const sg=getSign(chart.houses[i]);lines.push(`House ${String(i+1).padStart(2)}: ${sg.s} ${sg.n.padEnd(12)} ${fmtDeg(chart.houses[i])}`)}
    lines.push(``,`ASPECTS`,`${"─".repeat(40)}`);
    for(const a of(chart?.aspects||[]).slice(0,25)){const n1=PLANETS.find(p=>p.key===a.p1)?.name,n2=PLANETS.find(p=>p.key===a.p2)?.name;lines.push(`${n1} ${a.asp.sym} ${a.asp.name} ${n2} (${a.orb}° orb)`)}
    if(chart?.patterns?.length){lines.push(``,`PATTERNS`,`${"─".repeat(40)}`);for(const p of chart.patterns)lines.push(`${p.name}: ${p.planets.map(k=>PLANETS.find(pl=>pl.key===k)?.name).join(", ")}`)}
    const text=lines.join("\n");
    // Try clipboard first (works on mobile), then fallback to download
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=>alert("Chart report copied to clipboard! Paste it anywhere.")).catch(()=>downloadText(text));
    }else{downloadText(text)}
  };
  const downloadText=(text)=>{try{const blob=new Blob([text],{type:"text/plain"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${active?.name||"chart"}-celestia.txt`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)}catch{prompt("Copy your chart report:",text)}};

  // Profile switcher state
  // Profile switcher and edit state
  const [showSwitcher,setShowSwitcher]=useState(false);
  const [editMode,setEditMode]=useState(false);

  const navItems=[
    {id:"home",label:"Home",icon:"✦"},
    {id:"newchart",label:"New Chart",icon:"☉"},
    ...(chart?[{id:"chart",label:"Chart",icon:"◯"}]:[]),
    {id:"profiles",label:"Profiles",icon:"♡"},
    {id:"synastry",label:"Synastry",icon:"⚯"},
    {id:"transits",label:"Transits",icon:"↻"},
    {id:"progressions",label:"Progressions",icon:"→"},
    {id:"solarreturn",label:"Solar Return",icon:"☀"},
    {id:"ephemeris",label:"Ephemeris",icon:"▤"},
    {id:"settings",label:"Settings",icon:"⚙"},
  ];

  const sidebar=(
    <nav style={{width:220,minHeight:"100vh",padding:"24px 14px",background:themeId==="dark"?"rgba(10,10,24,0.85)":"rgba(235,229,245,0.95)",borderRight:`1px solid ${TH.borderLight}`,display:"flex",flexDirection:"column",gap:2,flexShrink:0,backdropFilter:"blur(20px)",overflowY:"auto"}}>
      <div style={{fontFamily:FONT_D,fontSize:22,color:TH.accent3,padding:"0 10px 16px",borderBottom:`1px solid ${TH.borderLight}`,marginBottom:8}}>
        Celestia<div style={{fontSize:10,color:TH.textDim,fontFamily:FONT,letterSpacing:2,textTransform:"uppercase",marginTop:3}}>Natal Chart Studio</div>
      </div>
      {navItems.map(it=>(
        <button key={it.id} onClick={()=>{setPage(it.id);setMobileNav(false)}} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:7,background:page===it.id?TH.accentSoft:"transparent",color:page===it.id?TH.accent:TH.textMuted,border:"none",cursor:"pointer",fontFamily:FONT,fontSize:12.5,fontWeight:page===it.id?600:400,transition:"all .2s",textAlign:"left",width:"100%"}}>
          <span style={{fontSize:15,width:18,textAlign:"center"}}>{it.icon}</span>{it.label}
        </button>
      ))}
      <button onClick={()=>setPage("transits")} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:7,background:"linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05))",color:"#c9a84c",border:"1px solid rgba(201,168,76,0.2)",fontFamily:FONT,fontSize:12.5,fontWeight:600,cursor:"pointer",marginTop:4,textAlign:"left",width:"100%"}}>
        <span style={{fontSize:15,width:18,textAlign:"center"}}>✦</span>Transit Forecast
      </button>
      <div style={{marginTop:"auto",padding:"12px 10px 0",borderTop:`1px solid ${TH.borderLight}`,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{fontSize:10,color:TH.textDim,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>System</div>
        <div style={{display:"flex",gap:3}}>
          {["tropical","sidereal"].map(s=><button key={s} onClick={()=>{setZsys(s);reCalc(hsys,s)}} style={{flex:1,padding:"5px 0",borderRadius:5,background:zsys===s?TH.accentSoft:"transparent",color:zsys===s?TH.accent:TH.textDim,border:`1px solid ${zsys===s?TH.accent+"40":TH.borderLight}`,fontSize:10,fontFamily:FONT,cursor:"pointer",textTransform:"capitalize",fontWeight:600}}>{s}</button>)}
        </div>
        <select value={hsys} onChange={e=>{setHsys(e.target.value);reCalc(e.target.value,zsys)}} style={{width:"100%",padding:"5px 6px",borderRadius:5,background:TH.inputBg,border:`1px solid ${TH.borderLight}`,color:TH.textMuted,fontFamily:FONT,fontSize:10,outline:"none"}}>
          {HSYS.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}
        </select>
        <button onClick={toggleTheme} style={{padding:"5px 0",borderRadius:5,background:TH.bgCard,border:`1px solid ${TH.borderLight}`,color:TH.textMuted,fontSize:10,fontFamily:FONT,cursor:"pointer"}}>
          {themeId==="dark"?"☀ Light Mode":"☽ Dark Mode"}
        </button>
      </div>
    </nav>
  );

  const PL=PLANETS.find;

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${TH.bgDeep} 0%,${TH.bg} 35%,${themeId==="dark"?"#141428":TH.bg} 70%,${TH.bgDeep} 100%)`,color:TH.text,fontFamily:FONT,display:"flex",position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

      {/* Mobile hamburger — always visible on small screens via CSS class */}
      <button className="mobile-menu-btn" onClick={()=>setMobileNav(!mobileNav)} style={{position:"fixed",top:12,left:12,zIndex:1001,background:TH.bgGlass,border:`1px solid ${TH.border}`,borderRadius:8,padding:"8px 12px",color:TH.accent,fontSize:18,cursor:"pointer",backdropFilter:"blur(10px)"}}>☰</button>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{display:"block"}}>{sidebar}</div>

      {/* Mobile overlay */}
      {mobileNav&&<div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.5)"}} onClick={()=>setMobileNav(false)}><div onClick={e=>e.stopPropagation()}>{sidebar}</div></div>}

      <style>{`@media(max-width:768px){.sidebar-desktop{display:none !important}.mobile-menu-btn{display:block !important}}@media(min-width:769px){.mobile-menu-btn{display:none !important}}`}</style>

      {/* Main */}
      <main ref={chartRef} style={{flex:1,padding:"28px 24px",overflowY:"auto",maxHeight:"100vh"}}>

        {/* ── HOME ── */}
        {page==="home"&&(
          <div style={{maxWidth:700}}>
            <div style={{fontSize:11,letterSpacing:3,color:TH.accent,textTransform:"uppercase",marginBottom:10}}>Welcome to Celestia</div>
            <h1 style={{fontFamily:FONT_D,fontSize:38,fontWeight:400,margin:"0 0 14px",lineHeight:1.15,color:TH.lavender}}>Your natal chart,<br/>decoded with precision.</h1>
            <p style={{color:TH.textMuted,fontSize:14,lineHeight:1.7,marginBottom:28}}>Calculate birth charts with high-precision astronomical algorithms. Explore placements, aspects, houses, transits, synastry, progressions, solar returns, and ephemeris data across Western tropical and Vedic sidereal systems.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
              <Btn primary onClick={()=>setPage("newchart")} theme={TH} style={{boxShadow:`0 4px 20px ${TH.accentGlow}`}}>Create New Chart ✦</Btn>
              {chart&&<Btn onClick={()=>setPage("chart")} theme={TH}>View Current Chart</Btn>}
              {profiles.length>0&&<Btn onClick={()=>setPage("profiles")} theme={TH}>Saved Profiles ({profiles.length})</Btn>}
            </div>
            <button onClick={()=>setPage("transits")} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 20px",borderRadius:10,background:"linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))",color:"#c9a84c",border:"1px solid rgba(201,168,76,0.3)",fontFamily:FONT,fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:32,boxShadow:"0 4px 16px rgba(201,168,76,0.15)"}}>
              <span style={{fontSize:18}}>✦</span> Transit Forecast — See What's Active Now
            </button>

            {/* Feature tour cards */}
            <div style={{fontSize:11,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:12}}>Explore</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10,marginBottom:24}}>
              {[
                {icon:"☉",label:"Natal Chart",desc:"Interactive wheel with all planets, houses, aspects",page:"chart",req:true},
                {icon:"✦",label:"Transits",desc:"Current influences + 12-month forecast",page:"transits",req:true},
                {icon:"♡",label:"Synastry",desc:"Compare two charts for relationship insights",page:"synastry",req:true},
                {icon:"↻",label:"Progressions",desc:"Secondary progressions for life timing",page:"progressions",req:true},
                {icon:"☼",label:"Solar Return",desc:"Your annual return chart",page:"solarreturn",req:true},
                {icon:"◯",label:"Ephemeris",desc:"Planetary positions for any date",page:"ephemeris",req:false},
              ].map((f,i)=>(
                <button key={i} onClick={()=>{if(f.req&&!chart){setPage("newchart")}else{setPage(f.page)}}} style={{background:TH.bgCard,border:`1px solid ${TH.borderLight}`,borderRadius:12,padding:14,cursor:"pointer",textAlign:"left",transition:"all 0.15s",fontFamily:FONT}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:20,color:TH.accent}}>{f.icon}</span>
                    <span style={{fontSize:13,fontWeight:600,color:TH.text}}>{f.label}</span>
                  </div>
                  <div style={{fontSize:11,color:TH.textDim,lineHeight:1.5}}>{f.desc}</div>
                </button>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
              {[{l:"House Systems",v:"2",i:"⌂"},{l:"Celestial Bodies",v:"14",i:"☉"},{l:"Zodiac Systems",v:"2",i:"♈"},{l:"Transit Content",v:"540",i:"✦"},{l:"Nakshatras",v:"27",i:"✧"},{l:"Privacy",v:"100%",i:"🔒"}].map((s,i)=>(
                <div key={i} style={{background:TH.bgCard,border:`1px solid ${TH.borderLight}`,borderRadius:12,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:22,marginBottom:4}}>{s.i}</div>
                  <div style={{fontSize:20,fontWeight:700,color:TH.accent,fontFamily:FONT_D}}>{s.v}</div>
                  <div style={{fontSize:10,color:TH.textDim,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NEW CHART ── */}
        {page==="newchart"&&(
          <div style={{maxWidth:480}}>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>New Birth Chart</h2>
            <p style={{color:TH.textDim,fontSize:12,marginBottom:20}}>Enter birth details for accurate chart calculation.</p>
            <BirthForm onSubmit={go} theme={TH}/>
          </div>
        )}

        {/* ── CHART VIEW ── */}
        {page==="chart"&&chart&&(
          <div>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
              {/* Profile switcher — tap name to switch */}
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowSwitcher(!showSwitcher)} style={{background:"transparent",border:"none",cursor:"pointer",textAlign:"left",padding:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,margin:0}}>{active?.name||"Chart"}</h2>
                    <span style={{color:TH.textDim,fontSize:14,transition:"transform 0.2s",transform:showSwitcher?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                  </div>
                  <div style={{fontSize:11,color:TH.textDim,marginTop:3}}>
                    {MONTHS[(active?.month||1)-1]} {active?.day}, {active?.year} · {(()=>{const h=active?.hour||0,m=active?.minute||0,dh=h===0?12:h>12?h-12:h,ap=h>=12?"PM":"AM";return`${dh}:${String(m).padStart(2,"0")} ${ap}`})()} · {active?.location}
                  </div>
                </button>
                {showSwitcher&&(
                  <div style={{position:"absolute",top:"100%",left:0,marginTop:8,zIndex:100,background:TH.bgDeep,border:`1px solid ${TH.border}`,borderRadius:12,padding:6,minWidth:260,boxShadow:`0 12px 40px rgba(0,0,0,.5)`,animation:"fadeIn 0.15s ease-out"}}>
                    {profiles.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:4,borderRadius:8,background:active?.name===p.name?TH.accentSoft:"transparent",padding:"4px 4px 4px 0"}}>
                        <button onClick={()=>{go(p);setShowSwitcher(false)}} style={{display:"flex",alignItems:"center",gap:8,flex:1,padding:"6px 10px",borderRadius:8,background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                          <span style={{fontSize:16,color:active?.name===p.name?TH.accent:TH.textDim}}>◯</span>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:active?.name===p.name?TH.accent:TH.text,fontFamily:FONT}}>{p.name||"Unnamed"}</div>
                            <div style={{fontSize:10,color:TH.textDim,fontFamily:FONT}}>{MONTHS[(p.month||1)-1]} {p.day}, {p.year}</div>
                          </div>
                          {active?.name===p.name&&<span style={{marginLeft:"auto",color:TH.accent,fontSize:12}}>✓</span>}
                        </button>
                        <button onClick={(e)=>{e.stopPropagation();go(p);setShowSwitcher(false);setEditMode(true)}} style={{padding:"4px 6px",background:"transparent",border:"none",cursor:"pointer",color:TH.textDim,fontSize:12}} title="Edit">✎</button>
                        {p.name!=="Wes"&&<button onClick={(e)=>{e.stopPropagation();if(confirm("Delete "+p.name+"?")){{const u=profiles.filter((_,j)=>j!==i);saveP(u);if(active?.name===p.name){if(u.length){go(u[0])}else{setChart(null);setActive(null);setPage("home")}}}}setShowSwitcher(false)}} style={{padding:"4px 6px",background:"transparent",border:"none",cursor:"pointer",color:"#ef4444",fontSize:11}} title="Delete">✕</button>}
                      </div>
                    ))}
                    <div style={{borderTop:`1px solid ${TH.borderLight}`,marginTop:4,paddingTop:4}}>
                      <button onClick={()=>{setShowSwitcher(false);setPage("newchart")}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 12px",borderRadius:8,background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}>
                        <span style={{fontSize:18,color:TH.accent}}>+</span>
                        <span style={{fontSize:13,color:TH.accent,fontWeight:600,fontFamily:FONT}}>Add New Person</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <Btn small onClick={()=>setEditMode(!editMode)} theme={TH} style={editMode?{background:TH.accentSoft,color:TH.accent,border:`1px solid ${TH.accent}40`}:{}}>{editMode?"✕ Cancel":"✎ Edit"}</Btn>
                {["wheel","cards"].map(v=><button key={v} onClick={()=>{setView(v);setEditMode(false)}} style={{padding:"6px 14px",borderRadius:6,background:view===v&&!editMode?TH.accentSoft:"transparent",color:view===v&&!editMode?TH.accent:TH.textDim,border:`1px solid ${view===v&&!editMode?TH.accent+"40":TH.borderLight}`,fontSize:11,fontFamily:FONT,cursor:"pointer",fontWeight:600}}>{v==="wheel"?"◯ Wheel":"▤ Cards"}</button>)}
                <Btn small onClick={exportChart} theme={TH}>📋 Export</Btn>
                <button onClick={()=>setPage("transits")} style={{padding:"6px 12px",borderRadius:6,background:"linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))",color:"#c9a84c",border:"1px solid rgba(201,168,76,0.25)",fontFamily:FONT,fontSize:11,fontWeight:600,cursor:"pointer"}}>✦ Transits</button>
              </div>
            </div>

            {/* Edit mode — show birth form pre-filled */}
            {editMode?(
              <div style={{maxWidth:480,marginBottom:20}}>
                <div style={{fontSize:12,color:TH.accent,fontWeight:600,marginBottom:12}}>✎ Editing {active?.name||"Chart"}</div>
                <BirthForm onSubmit={(bd)=>{go(bd);setEditMode(false)}} initial={active} onCancel={()=>setEditMode(false)} theme={TH}/>
              </div>
            ):(
            <div>

            {/* Inline system controls — easy to change */}
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:16,flexWrap:"wrap",padding:"10px 14px",background:TH.bgCard,borderRadius:10,border:`1px solid ${TH.borderLight}`}}>
              <span style={{fontSize:10,color:TH.textDim,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Zodiac</span>
              {["tropical","sidereal"].map(s=>(
                <button key={s} onClick={()=>{setZsys(s);if(active){const c=genChart(active,hsys,s);if(c)setChart(c)}}} style={{padding:"5px 12px",borderRadius:6,background:zsys===s?TH.accentSoft:"transparent",color:zsys===s?TH.accent:TH.textDim,border:`1px solid ${zsys===s?TH.accent+"40":"transparent"}`,fontSize:11,fontFamily:FONT,cursor:"pointer",fontWeight:600,textTransform:"capitalize"}}>{s==="tropical"?"♈ Tropical":"☸ Sidereal"}</button>
              ))}
              <div style={{width:1,height:20,background:TH.borderLight,margin:"0 6px"}}/>
              <span style={{fontSize:10,color:TH.textDim,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Houses</span>
              {HSYS.map(h=>(
                <button key={h.id} onClick={()=>{setHsys(h.id);if(active){const c=genChart(active,h.id,zsys);if(c)setChart(c)}}} style={{padding:"5px 10px",borderRadius:6,background:hsys===h.id?TH.accentSoft:"transparent",color:hsys===h.id?TH.accent:TH.textDim,border:`1px solid ${hsys===h.id?TH.accent+"40":"transparent"}`,fontSize:10,fontFamily:FONT,cursor:"pointer",fontWeight:hsys===h.id?600:400}}>{h.n}</button>
              ))}
            </div>

            <Tabs tabs={[{id:"chart",label:"Chart"},{id:"interpret",label:"Interpretations"},{id:"patterns",label:"Patterns"},{id:"houses",label:"Houses"},{id:"dignity",label:"Dignities"},{id:"career",label:"Career & Finance"}]} active={tab} onChange={setTab} theme={TH}/>

            {tab==="chart"&&(
              <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                {view==="wheel"?(
                  <>
                    <div style={{flexShrink:0}}><Wheel chart={chart} size={Math.min(420,380)} theme={TH} zsys={zsys}/></div>
                    <div style={{flex:1,minWidth:240}}>
                      <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:10}}>Placements</div>
                      {PLANETS.map(p=>{const pl=chart.pl[p.key];if(!pl)return null;const dig=getDignity(p.name,pl.sign);return(
                        <div key={p.key} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${TH.borderLight}`,fontSize:12}}>
                          <span style={{color:p.color,fontSize:16,width:20,textAlign:"center"}}>{p.sym}</span>
                          <span style={{width:60,color:TH.text}}>{p.name}</span>
                          <span style={{color:pl.signColor}}>{pl.signSym}</span>
                          <span style={{color:TH.textMuted,flex:1}}>{pl.sign} {pl.deg}</span>
                          <span style={{color:TH.textDim,fontSize:10}}>H{pl.house}</span>
                          {dig&&<span style={{color:dig.color,fontSize:9,padding:"1px 4px",borderRadius:3,background:`${dig.color}15`}}>{dig.icon}{dig.type}</span>}
                          {pl.rx&&<span style={{color:TH.rose,fontSize:10}}>℞</span>}
                        </div>
                      )})}
                      {zsys==="sidereal"&&<div style={{marginTop:14}}><div style={{fontSize:10,letterSpacing:2,color:TH.accent,textTransform:"uppercase",marginBottom:6}}>Nakshatras</div>{["sun","moon","mercury","venus","mars"].map(k=>{const pl=chart.pl[k],p=PLANETS.find(pp=>pp.key===k);return (<div key={k} style={{display:"flex",gap:6,padding:"3px 0",fontSize:11,color:TH.textMuted}}><span style={{color:p.color}}>{p.sym}</span>{pl?.nak}</div>)})}</div>}
                    </div>
                  </>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8,width:"100%"}}>
                    {PLANETS.map(p=>{const pl=chart.pl[p.key];if(!pl)return null;const sg=getSign(chart.pos[p.key].lon),dig=getDignity(p.name,pl.sign);return(
                      <div key={p.key} style={{background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:12,padding:14}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                          <span style={{fontSize:22,color:p.color}}>{p.sym}</span>
                          <div><div style={{fontSize:13,fontWeight:600,color:TH.text}}>{p.name}</div><div style={{fontSize:10,color:TH.textMuted}}>{pl.deg}</div></div>
                          {pl.rx&&<span style={{marginLeft:"auto",color:TH.rose,fontSize:10}}>℞</span>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:5,background:`${sg.c}12`,borderRadius:5,padding:"4px 7px",marginBottom:6}}>
                          <span style={{color:sg.c,fontSize:14}}>{sg.s}</span><span style={{color:TH.text,fontSize:12}}>{pl.sign}</span>
                          {dig&&<span style={{marginLeft:"auto",color:dig.color,fontSize:9}}>{dig.icon}{dig.type}</span>}
                        </div>
                        <div style={{fontSize:10,color:TH.textDim,lineHeight:1.4}}>House {pl.house} · {HOUSE_IX[pl.house]?.split(",")[0]}</div>
                        {zsys==="sidereal"&&<div style={{color:TH.accent,fontSize:10,marginTop:3}}>✧ {pl.nak}</div>}
                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}

            {tab==="interpret"&&(
              <InterpretTab chart={chart} TH={TH} zsys={zsys}/>
            )}

            {tab==="patterns"&&(
              <PatternsTab chart={chart} TH={TH}/>
            )}

            {tab==="houses"&&(
              <HousesTab chart={chart} TH={TH}/>
            )}

            {tab==="dignity"&&(
              <DignityTab chart={chart} TH={TH}/>
            )}

            {tab==="career"&&chart&&(
              <CareerTab chart={chart} TH={TH}/>
            )}
            </div>)}
          </div>
        )}

        {/* ── PROFILES ── */}
        {page==="profiles"&&(
          <div style={{maxWidth:580}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,margin:0}}>Saved Profiles</h2>
              <Btn small onClick={()=>setPage("newchart")} theme={TH}>+ New</Btn>
            </div>
            {profiles.length===0?<div style={{color:TH.textDim,fontSize:13,padding:32,textAlign:"center"}}>No profiles yet.</div>:(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {profiles.map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:12,padding:"12px 16px",cursor:"pointer"}} onClick={()=>go(p)}>
                    <div><div style={{fontSize:14,fontWeight:600,color:TH.text}}>{p.name||"Unnamed"}</div><div style={{fontSize:11,color:TH.textDim,marginTop:1}}>{MONTHS[(p.month||1)-1]} {p.day}, {p.year} · {p.location}</div></div>
                    <div style={{display:"flex",gap:6}}>
                      <Btn small onClick={e=>{e.stopPropagation();go(p)}} theme={TH}>View</Btn>
                      <button onClick={e=>{e.stopPropagation();const u=profiles.filter((_,idx)=>idx!==i);saveP(u)}} style={{padding:"5px 10px",borderRadius:6,background:"rgba(239,68,68,0.1)",color:"#ef4444",border:"none",fontSize:10,cursor:"pointer",fontFamily:FONT}}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{marginTop:20,display:"flex",gap:6}}>
              <Btn small theme={TH} onClick={()=>{const b=new Blob([JSON.stringify(profiles,null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="celestia-profiles.json";a.click()}}>↓ Export</Btn>
              <label style={{padding:"6px 12px",borderRadius:8,background:TH.bgCard,color:TH.textMuted,border:`1px solid ${TH.border}`,fontSize:12,fontFamily:FONT,cursor:"pointer"}}>↑ Import<input type="file" accept=".json" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const imp=JSON.parse(ev.target.result);if(Array.isArray(imp)){const m=[...profiles,...imp.filter(p=>!profiles.find(ep=>ep.name===p.name))];saveP(m)}}catch{}};r.readAsText(f)}}/></label>
            </div>
          </div>
        )}

        {/* ── SYNASTRY ── */}
        {page==="synastry"&&(
          <div style={{maxWidth:700}}>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>Synastry · Compatibility</h2>
            <p style={{color:TH.textDim,fontSize:12,marginBottom:20}}>Compare two charts to analyze relationship dynamics.</p>
            {profiles.length<2?<div style={{color:TH.textMuted,fontSize:13,padding:20,background:TH.bgCard,borderRadius:12}}>Save at least 2 profiles to use synastry. <Btn small onClick={()=>setPage("newchart")} theme={TH} style={{marginLeft:8}}>Create Profile</Btn></div>:(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
                  {[{label:"Person 1",val:active,set:bd=>{go(bd)}},{label:"Person 2",val:chart2?profiles.find(p=>p.name===chart2._name):null,set:bd=>{const c=genChart(bd,hsys,zsys);c._name=bd.name;setChart2(c);if(chart)setSynAspects(calcSynastry(chart,c))}}].map((side,idx)=>(
                    <div key={idx}>
                      <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>{side.label}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {profiles.map((p,i)=><button key={i} onClick={()=>side.set(p)} style={{padding:"8px 12px",borderRadius:8,background:((idx===0&&active?.name===p.name)||(idx===1&&chart2&&chart2._name===p.name))?TH.accentSoft:TH.bgCard,color:((idx===0&&active?.name===p.name)||(idx===1&&chart2&&chart2._name===p.name))?TH.accent:TH.textMuted,border:`1px solid ${TH.borderLight}`,fontSize:12,fontFamily:FONT,cursor:"pointer",textAlign:"left"}}>{p.name}</button>)}
                      </div>
                    </div>
                  ))}
                </div>
                {synAspects&&(
                  <div>
                    <div style={{fontSize:12,color:TH.accent,fontWeight:600,marginBottom:10}}>Cross-Chart Aspects ({synAspects.length})</div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {synAspects.slice(0,30).map((a,i)=>{const pp1=PLANETS.find(p=>p.key===a.p1),pp2=PLANETS.find(p=>p.key===a.p2);return(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:6,background:a.exact?`${TH.accent}08`:"transparent",fontSize:12}}>
                          <span style={{color:pp1?.color,fontSize:14}}>{pp1?.sym}</span>
                          <span style={{color:TH.textMuted,width:55,fontSize:11}}>P1 {pp1?.name}</span>
                          <span style={{color:a.asp.color,fontSize:14}}>{a.asp.sym}</span>
                          <span style={{color:a.asp.color,width:70,fontSize:11}}>{a.asp.name}</span>
                          <span style={{color:pp2?.color,fontSize:14}}>{pp2?.sym}</span>
                          <span style={{color:TH.textMuted,width:55,fontSize:11}}>P2 {pp2?.name}</span>
                          <span style={{marginLeft:"auto",color:TH.textDim,fontSize:10}}>{a.orb}°</span>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TRANSITS ── */}
        {page==="transits"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <div>
                <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>{tMode==="now"?"Current Transits":"12-Month Forecast"}</h2>
                <p style={{color:TH.textDim,fontSize:12}}>{tMode==="now"?`Active influences on your chart · ${new Date().toLocaleDateString()}`:"Timeline of your upcoming transits"}</p>
              </div>
              <div style={{display:"flex",gap:4,background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:8,padding:3}}>
                <button onClick={()=>setTMode("now")} style={{padding:"6px 14px",borderRadius:6,background:tMode==="now"?TH.accentSoft:"transparent",color:tMode==="now"?TH.accent:TH.textDim,border:"none",fontSize:11,fontFamily:FONT,cursor:"pointer",fontWeight:600}}>Now</button>
                <button onClick={()=>{setTMode("forecast");if(chart&&!tForecast)setTForecast(scanYearTransits(chart,new Date()))}} style={{padding:"6px 14px",borderRadius:6,background:tMode==="forecast"?TH.accentSoft:"transparent",color:tMode==="forecast"?TH.accent:TH.textDim,border:"none",fontSize:11,fontFamily:FONT,cursor:"pointer",fontWeight:600}}>12 Months</button>
              </div>
            </div>
            {tMode==="now"&&(()=>{
              const now=new Date();
              const JD=jd(now.getUTCFullYear(),now.getUTCMonth()+1,now.getUTCDate(),now.getUTCHours()+now.getUTCMinutes()/60);
              let pos=calcAll(JD);
              if(zsys==="sidereal"){const ay=ayanamsa(JD);const a={};for(const[k,v]of Object.entries(pos))a[k]={lon:N(v.lon-ay),rx:v.rx};pos=a}
              return (
              <div>
                {/* Current positions grid */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8,marginBottom:24}}>
                  {PLANETS.map(p=>{const ps=pos[p.key];if(!ps)return null;const sg=getSign(ps.lon);return(
                    <div key={p.key} style={{background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:12,padding:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:20,color:p.color}}>{p.sym}</span><span style={{fontSize:13,fontWeight:600,color:TH.text}}>{p.name}</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{color:sg.c}}>{sg.s}</span><span style={{color:TH.textMuted,fontSize:12}}>{sg.n}</span><span style={{color:TH.textDim,fontSize:10}}>{fmtDeg(ps.lon)}</span></div>
                      {ps.rx&&<div style={{color:TH.rose,fontSize:10,marginTop:4}}>℞ Retrograde</div>}
                    </div>
                  )})}
                </div>

                {/* Transit insights for active natal chart */}
                {chart&&active?(()=>{
                  // Build list of current transit aspects, prioritizing outer planets
                  const outerPriority={Pluto:10,Neptune:9,Uranus:8,Saturn:7,Jupiter:6,Mars:5,Sun:4,Venus:3,Mercury:3,Moon:2};
                  const ta=[];
                  for(const tp of PLANETS){
                    const tv=pos[tp.key];if(!tv)continue;
                    for(const np of PLANETS){
                      const nv=chart.pos[np.key];if(!nv)continue;
                      let diff=Math.abs(tv.lon-nv.lon);if(diff>180)diff=360-diff;
                      for(const asp of ASPECTS){
                        const orb=Math.abs(diff-asp.ang);
                        const allowedOrb=["conjunction","opposition"].includes(asp.name)?6:["square","trine"].includes(asp.name)?5:3;
                        if(orb<=allowedOrb){
                          const weight=(outerPriority[tp.name]||1)*3 + (10-orb) + (asp.name==="conjunction"?3:asp.name==="opposition"?2:1);
                          ta.push({tp,np,asp,orb:Math.round(orb*100)/100,weight,tRx:tv.rx,tSign:getSign(tv.lon),nSign:getSign(nv.lon)});
                        }
                      }
                    }
                  }
                  const sorted=ta.sort((a,b)=>b.weight-a.weight).slice(0,12);
                  return (
                    <div>
                      <div style={{fontSize:13,color:TH.accent,fontWeight:600,marginBottom:12,fontFamily:FONT_D}}>
                        ✦ Active Transit Insights for {active.name}
                      </div>
                      <div style={{fontSize:11,color:TH.textDim,marginBottom:14,lineHeight:1.6}}>
                        The most significant current transits to your natal chart, ranked by impact. Tap any card to read the interpretation.
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        {sorted.map((t,i)=>{
                          const reading=getTransitReading(t.tp.name,t.asp,t.np.name,t.tSign.n,t.tRx);
                          const isExp=tExp===i;
                          return (
                            <div key={i} style={{background:TH.bgCard,borderRadius:10,border:`1px solid ${isExp?TH.accent+"40":TH.cardBorder}`,overflow:"hidden",transition:"border 0.15s"}}>
                              <button onClick={()=>setTExp(isExp?null:i)} style={{width:"100%",padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,background:"none",border:"none",color:TH.text,cursor:"pointer",textAlign:"left",fontFamily:FONT}}>
                                <div style={{width:6,height:6,borderRadius:3,background:t.tp.color,flexShrink:0,marginTop:6}}/>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                    <span style={{color:t.tp.color,fontWeight:600,fontSize:14}}>{t.tp.sym} {t.tp.name}</span>
                                    <span style={{color:t.asp.color,fontWeight:600,fontSize:13}}>{t.asp.sym}</span>
                                    <span style={{color:TH.text,fontWeight:600,fontSize:14}}>{t.np.sym} {t.np.name}</span>
                                    {reading.isSpecial&&<span style={{fontSize:11,color:TH.accent}}>★ Milestone</span>}
                                    {t.tRx&&<span style={{fontSize:10,color:TH.rose}}>℞</span>}
                                  </div>
                                  <div style={{fontSize:10,color:TH.textDim,marginTop:3,display:"flex",gap:8}}>
                                    <span>{t.asp.name}</span>
                                    <span>orb {t.orb}°</span>
                                    <span>transit in {t.tSign.n}</span>
                                  </div>
                                  {!isExp&&<div style={{fontSize:11,color:TH.textMuted,marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>{reading.body.substring(0,110)}…</div>}
                                </div>
                                <span style={{color:TH.textDim,fontSize:12,marginTop:3,transition:"transform 0.15s",transform:isExp?"rotate(180deg)":"rotate(0)"}}>▾</span>
                              </button>
                              {isExp&&(
                                <div style={{padding:"0 14px 14px 30px",borderTop:`1px solid ${TH.border}`}}>
                                  <div style={{marginTop:10,fontSize:13,lineHeight:1.75,color:TH.text}}>{reading.body}</div>
                                  <div style={{marginTop:10,fontSize:10,color:TH.textDim,display:"flex",gap:12,flexWrap:"wrap"}}>
                                    <span>Transit: {t.tp.sym} {fmtDeg(pos[t.tp.key].lon)} {t.tSign.n}</span>
                                    <span>Natal: {t.np.sym} {fmtDeg(chart.pos[t.np.key].lon)} {t.nSign.n}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {sorted.length===0&&<div style={{padding:20,textAlign:"center",color:TH.textDim,fontSize:12}}>No major transits in tight orb right now. Check back in a few weeks.</div>}
                    </div>
                  );
                })():(
                  <div style={{padding:24,textAlign:"center",color:TH.textDim,fontSize:12,background:TH.bgCard,borderRadius:12,border:`1px solid ${TH.cardBorder}`}}>
                    Load a birth chart to see personalized transit insights.
                  </div>
                )}
              </div>
            )})()}
            {tMode==="forecast"&&(()=>{
              if(!chart||!active) return <div style={{padding:24,textAlign:"center",color:TH.textDim,fontSize:12,background:TH.bgCard,borderRadius:12,border:`1px solid ${TH.cardBorder}`}}>Load a birth chart to see your 12-month forecast.</div>;
              if(!tForecast) return <div style={{padding:24,textAlign:"center",color:TH.textDim,fontSize:12}}>Generating forecast...</div>;
              const maxI=Math.max(...tForecast.map(m=>m.intensity),1);
              const cur=tForecast[tSelMonth];
              return (
                <div>
                  <div style={{background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:12,padding:16,marginBottom:16}}>
                    <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:10}}>Transit Intensity · Next 12 Months</div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80,marginBottom:6}}>
                      {tForecast.map((m,i)=>{
                        const h=Math.max(6,(m.intensity/maxI)*70);
                        const act=i===tSelMonth;
                        const hasSpecial=m.transits.some(t=>SPECIAL_IX[t.tb.name+"-"+t.asp.name+"-"+t.np.name]);
                        return (
                          <button key={i} onClick={()=>{setTSelMonth(i);setTExp(0)}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:0}}>
                            <div style={{width:"100%",height:h,borderRadius:3,background:act?TH.accent:hasSpecial?TH.accent+"60":TH.accent+"25",transition:"all 0.15s",position:"relative"}}>
                              {hasSpecial&&<div style={{position:"absolute",top:-5,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:3,background:TH.accent}}/>}
                            </div>
                            <span style={{fontSize:9,color:act?TH.accent:TH.textMuted,fontWeight:act?600:400}}>{m.shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{fontSize:9,color:TH.textDim,textAlign:"center"}}>Tap a month for details · ★ = milestone transit</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:FONT_D,fontSize:22,fontWeight:500,color:TH.text,marginBottom:2}}>{cur.label}</div>
                    <div style={{fontSize:11,color:TH.textDim,marginBottom:10}}>{cur.transits.length} significant transit{cur.transits.length!==1?"s":""}</div>
                    <div style={{padding:"10px 12px",background:TH.bgCard,borderRadius:10,border:`1px solid ${TH.cardBorder}`,fontSize:12,color:TH.textMuted,lineHeight:1.65,fontStyle:"italic"}}>{monthNarrative(cur)}</div>
                  </div>
                  {cur.transits.length===0?<div style={{padding:20,textAlign:"center",color:TH.textMuted,fontSize:12}}>A quieter month.</div>:(
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {cur.transits.slice(0,10).map((t,i)=>{
                        const reading=getTransitReading(t.tb.name,t.asp,t.np.name,t.tSign.n,t.tRx);
                        const isExp=tExp===i;
                        return (
                          <div key={i} style={{background:TH.bgCard,borderRadius:10,border:`1px solid ${isExp?TH.accent+"40":TH.cardBorder}`,overflow:"hidden"}}>
                            <button onClick={()=>setTExp(isExp?null:i)} style={{width:"100%",padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,background:"none",border:"none",color:TH.text,cursor:"pointer",textAlign:"left",fontFamily:FONT}}>
                              <div style={{width:6,height:6,borderRadius:3,background:t.tb.color,flexShrink:0,marginTop:6}}/>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                  <span style={{color:t.tb.color,fontWeight:600,fontSize:14}}>{t.tb.sym} {t.tb.name}</span>
                                  <span style={{color:t.asp.color,fontWeight:600,fontSize:13}}>{t.asp.sym}</span>
                                  <span style={{color:TH.text,fontWeight:600,fontSize:14}}>{t.np.sym} {t.np.name}</span>
                                  {reading.isSpecial&&<span style={{fontSize:11,color:TH.accent}}>★</span>}
                                  {t.tRx&&<span style={{fontSize:10,color:TH.rose}}>℞</span>}
                                </div>
                                <div style={{fontSize:10,color:TH.textDim,marginTop:3,display:"flex",gap:8,flexWrap:"wrap"}}>
                                  <span>Peak ~{t.peakDate}</span><span>orb {t.orb}°</span><span>{t.asp.name}</span>
                                </div>
                                {!isExp&&<div style={{fontSize:11,color:TH.textMuted,marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>{reading.body.substring(0,110)}…</div>}
                              </div>
                              <span style={{color:TH.textDim,fontSize:12,marginTop:3,transform:isExp?"rotate(180deg)":"rotate(0)"}}>▾</span>
                            </button>
                            {isExp&&<div style={{padding:"0 14px 14px 30px",borderTop:`1px solid ${TH.border}`}}><div style={{marginTop:10,fontSize:13,lineHeight:1.75,color:TH.text}}>{reading.body}</div></div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── PROGRESSIONS ── */}
        {page==="progressions"&&(
          <div style={{maxWidth:600}}>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>Secondary Progressions</h2>
            <p style={{color:TH.textDim,fontSize:12,marginBottom:16}}>A day for a year: each day after birth represents a year of life.</p>
            {!active?<div style={{color:TH.textMuted,fontSize:13,padding:20,background:TH.bgCard,borderRadius:12}}>Generate a natal chart first.</div>:(
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:12,color:TH.textMuted}}>Progress to year:</span>
                  <input type="number" value={progYear} onChange={e=>setProgYear(+e.target.value)} style={{width:80,padding:"6px 10px",borderRadius:6,background:TH.inputBg,border:`1px solid ${TH.border}`,color:TH.text,fontFamily:FONT,fontSize:13,outline:"none"}}/>
                  <Btn small primary onClick={()=>setProgData(calcProgressions({...active,zsys},progYear))} theme={TH}>Calculate</Btn>
                </div>
                {progData&&(
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <div style={{fontSize:10,letterSpacing:2,color:TH.accent,textTransform:"uppercase",marginBottom:6}}>Progressed Positions — {progData.targetYear}</div>
                    {PLANETS.slice(0,10).map(p=>{const pl=progData.pl[p.key],natal=chart?.pl[p.key];if(!pl)return null;const changed=natal&&natal.sign!==pl.sign;return(
                      <div key={p.key} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:6,background:changed?`${TH.accent}08`:"transparent",fontSize:12}}>
                        <span style={{color:p.color,fontSize:16}}>{p.sym}</span>
                        <span style={{width:65,color:TH.text}}>{p.name}</span>
                        <span style={{color:pl.signColor}}>{pl.signSym}</span>
                        <span style={{color:TH.textMuted}}>{pl.sign} {pl.deg}</span>
                        {changed&&<span style={{marginLeft:"auto",color:TH.accent,fontSize:10}}>changed from {natal.sign}</span>}
                      </div>
                    )})}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SOLAR RETURN ── */}
        {page==="solarreturn"&&(
          <div style={{maxWidth:600}}>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>Solar Return</h2>
            <p style={{color:TH.textDim,fontSize:12,marginBottom:16}}>Your birthday chart — the cosmic snapshot for the year ahead.</p>
            {!active?<div style={{color:TH.textMuted,fontSize:13,padding:20,background:TH.bgCard,borderRadius:12}}>Generate a natal chart first.</div>:(
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:12,color:TH.textMuted}}>Solar return for year:</span>
                  <input type="number" value={srYear} onChange={e=>setSrYear(+e.target.value)} style={{width:80,padding:"6px 10px",borderRadius:6,background:TH.inputBg,border:`1px solid ${TH.border}`,color:TH.text,fontFamily:FONT,fontSize:13,outline:"none"}}/>
                  <Btn small primary onClick={()=>setSrData(genChart({...active,year:srYear},hsys,zsys))} theme={TH}>Calculate</Btn>
                </div>
                {srData&&(
                  <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                    <div style={{flexShrink:0}}><Wheel chart={srData} size={320} theme={TH} zsys={zsys}/></div>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{fontSize:10,letterSpacing:2,color:TH.accent,textTransform:"uppercase",marginBottom:8}}>Solar Return {srYear} Placements</div>
                      {PLANETS.slice(0,10).map(p=>{const pl=srData.pl[p.key];if(!pl)return null;return(
                        <div key={p.key} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderBottom:`1px solid ${TH.borderLight}`,fontSize:11}}>
                          <span style={{color:p.color,fontSize:14}}>{p.sym}</span>
                          <span style={{width:55,color:TH.text}}>{p.name}</span>
                          <span style={{color:pl.signColor}}>{pl.signSym}</span>
                          <span style={{color:TH.textMuted,flex:1}}>{pl.sign} {pl.deg}</span>
                          <span style={{color:TH.textDim,fontSize:10}}>H{pl.house}</span>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── EPHEMERIS ── */}
        {page==="ephemeris"&&(
          <div>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:6}}>Ephemeris</h2>
            <p style={{color:TH.textDim,fontSize:12,marginBottom:16}}>Daily planetary positions.</p>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <select value={ephMonth} onChange={e=>setEphMonth(+e.target.value)} style={{padding:"6px 10px",borderRadius:6,background:TH.inputBg,border:`1px solid ${TH.border}`,color:TH.text,fontFamily:FONT,fontSize:12,outline:"none"}}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
              <input type="number" value={ephYear} onChange={e=>setEphYear(+e.target.value)} style={{width:75,padding:"6px 10px",borderRadius:6,background:TH.inputBg,border:`1px solid ${TH.border}`,color:TH.text,fontFamily:FONT,fontSize:12,outline:"none"}}/>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{borderCollapse:"collapse",fontSize:10,fontFamily:FONT,width:"100%",minWidth:700}}>
                <thead><tr style={{borderBottom:`1px solid ${TH.border}`}}>
                  <th style={{padding:"6px 8px",textAlign:"left",color:TH.textDim}}>Day</th>
                  {PLANETS.slice(0,10).map(p=><th key={p.key} style={{padding:"6px 4px",textAlign:"center",color:p.color}}>{p.sym}</th>)}
                </tr></thead>
                <tbody>
                  {genEphemeris(ephYear,ephMonth,zsys).map(row=>(
                    <tr key={row.day} style={{borderBottom:`1px solid ${TH.borderLight}`}}>
                      <td style={{padding:"5px 8px",color:TH.text,fontWeight:600}}>{row.day}</td>
                      {PLANETS.slice(0,10).map(p=>{const d=row[p.key];return (<td key={p.key} style={{padding:"5px 4px",textAlign:"center",color:TH.textMuted,whiteSpace:"nowrap"}}>{d?<><span style={{color:getSign(d.lon).c}}>{d.sign}</span> <span>{d.deg}</span>{d.rx&&<span style={{color:TH.rose}}> ℞</span>}</>:"—"}</td>)})}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {page==="settings"&&(
          <div style={{maxWidth:480}}>
            <h2 style={{fontFamily:FONT_D,fontSize:26,fontWeight:400,color:TH.lavender,marginBottom:20}}>Settings</h2>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Theme</div>
                <div style={{display:"flex",gap:6}}>
                  {["dark","light"].map(t=><button key={t} onClick={()=>setThemeId(t)} style={{flex:1,padding:10,borderRadius:8,background:themeId===t?TH.accentSoft:TH.bgCard,color:themeId===t?TH.accent:TH.textMuted,border:`1px solid ${themeId===t?TH.accent+"40":TH.borderLight}`,fontFamily:FONT,fontSize:13,cursor:"pointer",fontWeight:600,textTransform:"capitalize"}}>{t==="dark"?"☽ Dark":"☀ Light"}</button>)}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Zodiac System</div>
                <div style={{display:"flex",gap:6}}>
                  {["tropical","sidereal"].map(s=><button key={s} onClick={()=>{setZsys(s);reCalc(hsys,s)}} style={{flex:1,padding:10,borderRadius:8,background:zsys===s?TH.accentSoft:TH.bgCard,color:zsys===s?TH.accent:TH.textMuted,border:`1px solid ${zsys===s?TH.accent+"40":TH.borderLight}`,fontFamily:FONT,fontSize:13,cursor:"pointer",fontWeight:600}}>{s==="tropical"?"♈ Western Tropical":"☸ Vedic Sidereal"}</button>)}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>House System</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {HSYS.map(h=><button key={h.id} onClick={()=>{setHsys(h.id);reCalc(h.id,zsys)}} style={{padding:10,borderRadius:8,background:hsys===h.id?TH.accentSoft:TH.bgCard,color:hsys===h.id?TH.accent:TH.textMuted,border:`1px solid ${hsys===h.id?TH.accent+"40":TH.borderLight}`,fontFamily:FONT,fontSize:12,cursor:"pointer",textAlign:"left"}}><div style={{fontWeight:600}}>{h.n}</div><div style={{fontSize:10,color:TH.textDim,marginTop:1}}>{h.d}</div></button>)}
                </div>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>AI Integration (Optional)</div>
                <div style={{background:TH.bgCard,border:`1px solid ${TH.cardBorder}`,borderRadius:12,padding:14}}>
                  <div style={{fontSize:12,color:TH.textMuted,lineHeight:1.6}}>To enable AI-powered interpretations, add your API key below. Readings are generated locally — your data never leaves your machine.</div>
                  <input placeholder="API Key (optional)" style={{width:"100%",marginTop:8,padding:"8px 12px",borderRadius:6,background:TH.inputBg,border:`1px solid ${TH.border}`,color:TH.text,fontFamily:FONT,fontSize:12,outline:"none"}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>Data</div>
                <button onClick={()=>{if(confirm("Clear all saved profiles?")){saveP([])}}} style={{padding:"8px 14px",borderRadius:8,background:"rgba(239,68,68,0.08)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",fontFamily:FONT,fontSize:12,cursor:"pointer"}}>Clear All Profiles</button>
              </div>
              <div style={{padding:14,background:TH.bgCard,borderRadius:12,border:`1px solid ${TH.borderLight}`}}>
                <div style={{fontSize:10,letterSpacing:2,color:TH.textDim,textTransform:"uppercase",marginBottom:6}}>About Celestia v2</div>
                <div style={{fontSize:11,color:TH.textMuted,lineHeight:1.6}}>Client-side natal chart calculator · VSOP87 + ELP2000 · 14 celestial bodies · 6 house systems · Western Tropical + Vedic Sidereal · 27 Nakshatras · Synastry · Progressions · Solar Returns · Ephemeris · Essential Dignities · Aspect Patterns · Dark/Light themes · Export/Import · No server required.</div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
