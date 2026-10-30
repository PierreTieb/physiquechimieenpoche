/* « C'est quoi l'orage ? » : une leçon mise en scène dans un petit théâtre.
   Un grand rideau rouge s'ouvre sur une scène en planches ; les décors (dessins en 2D) entrent, avancent et reculent sur scène,
   et un nuage blanc, sur le côté, raconte dans des bulles de BD. La scène est dessinée dans un repère fixe de 1200 × 680, mis à l'échelle de l'écran. */
(()=>{const $=id=>document.getElementById(id),SW=1200,SH=680,th=$('theatre'),stage=$('th-stage');

/* ---------- décors ---------- */
/* nuage gris en carton, pendu aux cintres par deux cordes ; de temps en temps, des éclairs l'illuminent de l'intérieur (décor en réserve pour la suite) */
const CL='M40 150C10 150 4 108 36 98C30 62 74 46 100 66C110 22 170 10 194 50C214 22 270 28 276 72C312 66 340 96 324 126C350 140 338 172 306 170H48Z';
const greyCloud=`<svg viewBox="0 0 360 520" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="tc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3b0"/><stop offset=".6" stop-color="#7d8794"/><stop offset="1" stop-color="#5f6874"/></linearGradient>
    <radialGradient id="tc-f"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#e6ecff" stop-opacity=".6"/><stop offset="1" stop-color="#c8d4ff" stop-opacity="0"/></radialGradient>
    <clipPath id="tc-clip"><path d="${CL}"/></clipPath></defs>
  <g stroke="#c9b48a" stroke-width="3"><path d="M110 0V392"/><path d="M250 0V392"/></g><g stroke="#8a7550" stroke-width="1" stroke-dasharray="3 5"><path d="M110 0V392"/><path d="M250 0V392"/></g>
  <g transform="translate(0 340)">
    <path d="${CL}" fill="#4c5560" transform="translate(6 7)"/>
    <path d="${CL}" fill="url(#tc-g)" stroke="#525b66" stroke-width="3"/>
    <g clip-path="url(#tc-clip)" class="th-flash"><circle class="f1" cx="130" cy="96" r="120" fill="url(#tc-f)"/><circle class="f2" cx="246" cy="110" r="110" fill="url(#tc-f)"/></g>
    <path d="M70 92C86 70 110 72 118 84M168 52C190 40 214 52 218 70M262 92C280 88 298 98 302 112" fill="none" stroke="#b9c1cc" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <circle cx="110" cy="52" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="250" cy="52" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/>
  </g></svg>`;
/* le narrateur : un nuage blanc jovial */
const narrator=`<svg viewBox="0 0 240 200" class="th-svg" aria-hidden="true">
  <defs><radialGradient id="tn-g" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f2f5fb"/><stop offset="1" stop-color="#d6deeb"/></radialGradient></defs>
  <ellipse cx="120" cy="186" rx="58" ry="6" fill="#000" opacity=".22"/>
  <path d="M52 160C14 160 8 112 44 104C38 64 86 46 112 70C124 26 190 22 204 66C236 64 250 106 226 126C246 148 226 168 200 164H60Z" fill="url(#tn-g)" stroke="#b9c4d6" stroke-width="3"/>
  <ellipse cx="76" cy="134" rx="13" ry="8" fill="#ff9aa8" opacity=".55"/><ellipse cx="172" cy="134" rx="13" ry="8" fill="#ff9aa8" opacity=".55"/>
  <g class="tn-happy"><ellipse cx="96" cy="112" rx="9" ry="12" fill="#2b3442"/><ellipse cx="150" cy="112" rx="9" ry="12" fill="#2b3442"/><circle cx="99" cy="107" r="3.2" fill="#fff"/><circle cx="153" cy="107" r="3.2" fill="#fff"/>
    <path d="M104 134Q123 156 142 134Q123 146 104 134Z" fill="#2b3442" stroke="#2b3442" stroke-width="3" stroke-linejoin="round"/>
    <path d="M86 92Q96 84 106 90M140 90Q150 84 160 92" fill="none" stroke="#2b3442" stroke-width="3.5" stroke-linecap="round"/></g>
  <g class="tn-scared"><g fill="#fff" stroke="#2b3442" stroke-width="3"><ellipse cx="96" cy="110" rx="14" ry="17"/><ellipse cx="150" cy="110" rx="14" ry="17"/></g><circle cx="96" cy="115" r="4.5" fill="#2b3442"/><circle cx="150" cy="115" r="4.5" fill="#2b3442"/>
    <path d="M80 90L108 80M138 80L166 90" fill="none" stroke="#2b3442" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="123" cy="146" rx="12" ry="10" fill="#2b3442"/><path d="M114 141Q118 137 122 141T131 141" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M190 80Q182 92 190 97Q198 92 190 80Z" fill="#a9dcff" stroke="#5a9bd0" stroke-width="2"/></g>
  <g class="th-arm"><path d="M222 128Q248 112 246 86" fill="none" stroke="#b9c4d6" stroke-width="12" stroke-linecap="round"/><path d="M222 128Q248 112 246 86" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/></g></svg>`;

/* ---------- décors des étapes : tous dans le repère de la scène, à droite du narrateur (x de 640 à 1095) ---------- */
const flake=(x,y,k)=>`<g class="flk" style="animation-delay:-${(k*.77%6).toFixed(2)}s"><g transform="translate(${x} ${y})" stroke="#fff" stroke-width="2.2" stroke-linecap="round">${[0,60,120].map(a=>`<path d="M-8 0H8" transform="rotate(${a})"/>`).join('')}</g></g>`;
/* étape 1 : l'air froid du haut, panneau bleu pendu aux cintres, où tombent des flocons */
const coldAir=`<svg viewBox="0 0 455 270" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="ta-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2f1ff"/><stop offset="1" stop-color="#93c4f0"/></linearGradient>
    <clipPath id="ta-cc"><rect x="8" y="120" width="440" height="135" rx="34"/></clipPath></defs>
  <g stroke="#c9b48a" stroke-width="3"><path d="M110 -800V128"/><path d="M345 -800V128"/></g>
  <rect x="14" y="128" width="440" height="135" rx="34" fill="#5d86ad"/>
  <rect x="8" y="120" width="440" height="135" rx="34" fill="url(#ta-c)" stroke="#6f9cc6" stroke-width="3"/>
  <g clip-path="url(#ta-cc)">${[[40,0],[90,1],[150,2],[205,3],[260,4],[320,5],[380,6],[425,7],[65,8],[180,9],[290,10],[400,11]].map(([x,k])=>flake(x,108,k)).join('')}</g>
  <rect x="112" y="166" width="232" height="44" rx="12" fill="#fff" opacity=".88"/><text x="228" y="196" text-anchor="middle" class="ta-lbl" fill="#1f4f7a">Air froid · −20 °C</text>
  <circle cx="110" cy="130" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="345" cy="130" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/></svg>`;
/* étape 1 : l'air chaud près du sol, panneau orange posé sur ses pieds, traversé de vaguelettes de chaleur qui montent */
const warmAir=`<svg viewBox="0 0 455 250" class="th-svg" aria-hidden="true">
  <defs><linearGradient id="ta-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd38a"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient>
    <clipPath id="ta-wc"><rect x="8" y="12" width="440" height="150" rx="30"/></clipPath></defs>
  <ellipse cx="228" cy="240" rx="200" ry="10" fill="#000" opacity=".25"/>
  ${[90,365].map(x=>`<path d="M${x} 160V236M${x-26} 236H${x+26}" stroke="#4e3420" stroke-width="10" stroke-linecap="round"/><path d="M${x} 160V236" stroke="#8a5a34" stroke-width="6"/>`).join('')}
  <rect x="14" y="20" width="440" height="150" rx="30" fill="#b35a22"/>
  <rect x="8" y="12" width="440" height="150" rx="30" fill="url(#ta-w)" stroke="#c9622a" stroke-width="3"/>
  <g clip-path="url(#ta-wc)" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3" stroke-linecap="round">${[40,95,150,205,260,315,370,420].map((x,i)=>`<path class="wav" style="animation-delay:-${(i*.37).toFixed(2)}s" d="M${x} 170${[...Array(8)].map((_,k)=>`Q${x+(k%2?-9:9)} ${160-k*20} ${x} ${150-k*20}`).join('')}"/>`).join('')}</g>
  <rect x="112" y="64" width="232" height="44" rx="12" fill="#fff" opacity=".88"/><text x="228" y="94" text-anchor="middle" class="ta-lbl" fill="#8a3b0e">Air chaud · 30 °C</text></svg>`;
/* étape 1 : des bulles d'air chaud qui montent, des bulles d'air froid qui descendent (visibles quand la scène a la classe « conv ») */
const conv=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>
    <radialGradient id="tp-w" cx=".38" cy=".32"><stop offset="0" stop-color="#ffe2b0"/><stop offset=".55" stop-color="#ffa14a"/><stop offset="1" stop-color="#e2671f"/></radialGradient>
    <radialGradient id="tp-c" cx=".38" cy=".32"><stop offset="0" stop-color="#eaf5ff"/><stop offset=".55" stop-color="#7fb5ec"/><stop offset="1" stop-color="#3f7fc7"/></radialGradient></defs>
  ${[[690,0,1],[765,1,0],[840,2,1],[915,3,0],[990,4,1],[1060,5,0]].map(([x,k,up])=>`<g transform="translate(${x} ${up?470:180})"><g class="${up?'pu':'pd'}" style="animation-delay:-${(k*.75).toFixed(2)}s">
    <circle r="25" fill="url(#tp-${up?'w':'c'})" stroke="#fff" stroke-width="2.5"/><path d="${up?'M0 11V-11M-8 -3L0 -11L8 -3':'M0 -11V11M-8 3L0 11L8 3'}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></g>`).join('')}</svg>`;
/* étape 2 : gouttes d'eau et cristaux de glace pendus à des fils, par paires ; quand une paire se croise, les deux se cognent */
const ICE=(id)=>{const h=[...Array(6)].map((_,k)=>{const a=(k*60+30)*Math.PI/180;return`${(34*Math.cos(a)).toFixed(1)} ${(34*Math.sin(a)).toFixed(1)}`}).join('L');
    return`<path d="M${h}Z" fill="#6d9bbd" transform="translate(5 6)"/><path d="M${h}Z" fill="url(#tq-i)" stroke="#6aa7cf" stroke-width="2.5"/>
      <g stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".85">${[0,60,120].map(a=>`<g transform="rotate(${a})"><path d="M-24 0H24M14 0l7 -7M14 0l7 7M-14 0l-7 -7M-14 0l-7 7"/></g>`).join('')}</g>`},
  DROP=()=>{const d='M0 -38C12 -20 30 -2 30 12A30 30 0 0 1 -30 12C-30 -2 -12 -20 0 -38Z';
    return`<path d="${d}" fill="#1f5ea8" transform="translate(5 6)"/><path d="${d}" fill="url(#tq-d)" stroke="#2a6fbd" stroke-width="2.5"/><ellipse cx="-11" cy="2" rx="6" ry="11" fill="#fff" opacity=".55" transform="rotate(20 -11 2)"/>`},
  PAIRS=[[670,'ice','drop',3.2,.9],[830,'ice','ice',3.9,2.1],[990,'drop','ice',3.5,4.0]],CY=320,CA=115;
const crystals=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>
    <linearGradient id="tq-i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4fcff"/><stop offset="1" stop-color="#a5d6f2"/></linearGradient>
    <radialGradient id="tq-d" cx=".38" cy=".38"><stop offset="0" stop-color="#cfe9ff"/><stop offset=".6" stop-color="#5aa4f0"/><stop offset="1" stop-color="#2a6fbd"/></radialGradient>
    <radialGradient id="tq-s"><stop offset="0" stop-color="#fff8c0"/><stop offset=".4" stop-color="#ffe04a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb81f" stop-opacity="0"/></radialGradient></defs>
  ${PAIRS.map(([x,a,b],p)=>[[x,a],[x+60,b]].map(([xx,k],j)=>`<path class="str" id="tq-s${p}${j}" stroke="#c9b48a" stroke-width="2"/><g class="it" id="tq-${p}${j}">${k=='ice'?ICE():DROP()}</g>`).join('')).join('')}
  <g id="tq-sparks"></g></svg>`;
/* étapes 3 et 4 : un grand décor (colline, petits nuages, gros nuage d'orage) ; les charges sont des cartons ronds, rouges (+) ou bleus (−),
   qu'on déplace comme sur une maquette ; un halo coloré montre la charge globale d'une zone */
const tok=s=>{const red=s=='+',f=red?'#e2453c':'#2f74d6',d=red?'#8f231d':'#1b4588';
  return`<circle r="15" fill="${d}" transform="translate(2.5 3.5)"/><circle r="15" fill="${f}" stroke="${d}" stroke-width="2"/><circle r="11" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>
    <path d="${red?'M-7 0H7M0 -7V7':'M-7 0H7'}" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`};
let TKN=0;
const tokG=(id,s,x,y,hid)=>`<g class="tk" id="tk-${id}" style="transform:translate(${x}px,${y}px)${hid?';opacity:0':''}"><g class="tk-sh"><g transform="rotate(${(TKN++*37)%25-12})">${tok(s)}</g></g></g>`;
const halo=(id,c)=>`<radialGradient id="th-${id}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".55" stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
/* charges du gros nuage (signe, x, y), électrons qui viendront s'y ajouter, charges de la colline ; où les − de la colline seront repoussés */
const CT=[['+',720,160],['-',790,160],['+',860,160],['-',660,212],['+',740,212],['-',820,212],['+',900,212],['-',970,212],['+',700,262],['-',860,262]],TOP=[1,3,5,7],
  EX=[[630,264],[770,272],[925,272],[985,252],[820,278]],
  HT=[['+',700,480],['+',790,455],['+',880,462],['+',800,530],['-',745,505],['-',840,488],['-',930,500],['-',690,535]],AWAY={4:[540,578],5:[1040,560],6:[1088,586],7:[468,572]};
/* flèche « tension » : un zigzag jaune à deux pointes */
const tension=(id,x,y0,y1,lx,ly)=>{let d=`M${x} ${y0+14}`;const n=Math.floor((y1-y0-28)/12);for(let i=1;i<=n;i++)d+=`L${x+(i%2?7:-7)} ${y0+14+i*12}`;d+=`L${x} ${y1-14}`;
  const hd=`M${x-11} ${y0+17}L${x} ${y0}L${x+11} ${y0+17}ZM${x-11} ${y1-17}L${x} ${y1}L${x+11} ${y1-17}Z`;
  return`<g class="tens" id="${id}"><path d="${d}" fill="none" stroke="#6b4e00" stroke-width="10" stroke-linejoin="round"/><path d="${hd}" fill="#6b4e00" stroke="#6b4e00" stroke-width="5" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#ffd23f" stroke-width="5" stroke-linejoin="round"/><path d="${hd}" fill="#ffd23f"/>
    <rect x="${lx}" y="${ly}" width="96" height="32" rx="8" fill="#fff8dc" stroke="#6b4e00" stroke-width="2.5"/><text x="${lx+48}" y="${ly+23}" text-anchor="middle" class="ts-lbl">tension</text></g>`};
const CLOUD='M585 295C540 295 530 250 565 238C552 200 590 172 628 186C632 140 690 118 730 138C755 100 830 96 860 132C890 108 950 118 962 160C1000 150 1040 184 1028 222C1062 236 1056 292 1012 295Z';
const storm=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>${halo('sr','#ff4b3e')+halo('sb','#49a2ff')}
    <linearGradient id="ts-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3d9e2"/><stop offset=".55" stop-color="#9aa4b2"/><stop offset="1" stop-color="#6c7685"/></linearGradient>
    <radialGradient id="ts-f"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#e3eaff" stop-opacity=".6"/><stop offset="1" stop-color="#c8d4ff" stop-opacity="0"/></radialGradient>
    <clipPath id="ts-clip"><path d="${CLOUD}"/></clipPath></defs>
  <g stroke="#c9b48a" stroke-width="3"><path d="M668 -800V176"/><path d="M932 -800V150"/></g>
  <ellipse class="hl" id="hl-aura" cx="800" cy="205" rx="310" ry="150" fill="url(#th-sb)"/>
  <path d="${CLOUD}" fill="#3f4753" transform="translate(8 9)"/><path d="${CLOUD}" fill="url(#ts-g)" stroke="#4a525d" stroke-width="3"/>
  <g clip-path="url(#ts-clip)">
    <ellipse class="hl" id="hl-top" cx="800" cy="165" rx="200" ry="70" fill="url(#th-sr)"/><ellipse class="hl" id="hl-bot" cx="800" cy="272" rx="250" ry="60" fill="url(#th-sb)"/>
    ${[[700,200,120,75],[845,165,130,70],[935,235,110,65],[760,262,140,55]].map(([x,y,rx,ry],i)=>`<ellipse class="ic" id="ic-${i}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ts-f)"/>`).join('')}</g>
  <path d="M600 210C612 196 632 196 640 206M700 150C716 132 744 134 752 148M800 122C822 110 846 116 852 132M900 140C920 134 942 142 946 156" fill="none" stroke="#eef1f6" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  ${tension('ts-t1',1002,172,262,1016,201)}${tension('ts-t2',962,304,446,976,358)}
  <circle cx="668" cy="178" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="932" cy="152" r="7" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/>
  ${CT.map(([s,x,y],i)=>tokG('c'+i,s,x,y)).join('')}${EX.map(([x,y],i)=>tokG('x'+i,'-',x<800?480:1130,y,1)).join('')}</svg>`;
/* petits nuages en carton pendus aux cintres ; celui du milieu à gauche prendra une charge positive */
const NP='M52 160C14 160 8 112 44 104C38 64 86 46 112 70C124 26 190 22 204 66C236 64 250 106 226 126C246 148 226 168 200 164H60Z';
const smallClouds=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>${halo('cr','#ff4b3e')}<linearGradient id="tsc-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f4f8"/><stop offset="1" stop-color="#aeb8c6"/></linearGradient></defs>
  <ellipse class="hl" id="hl-s2" cx="395" cy="152" rx="110" ry="70" fill="url(#th-cr)"/>
  ${[[115,128,120],[330,112,130],[1035,140,95]].map(([x,y,w])=>{const k=w/240,tx=x-8*k,ty=y-30*k,a=y+40*k;
    return`<g stroke="#c9b48a" stroke-width="3"><path d="M${x+.32*w} -800V${a}"/><path d="M${x+.68*w} -800V${a}"/></g>
    <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(3)})"><path d="${NP}" fill="#55606e" transform="translate(10 12)"/><path d="${NP}" fill="url(#tsc-g)" stroke="#7d8898" stroke-width="5"/></g>
    <circle cx="${x+.32*w}" cy="${a}" r="5" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/><circle cx="${x+.68*w}" cy="${a}" r="5" fill="#d8c79c" stroke="#8a7550" stroke-width="2"/>`}).join('')}</svg>`;
/* la colline : un grand contreplaqué peint, posé sur le plancher, avec trois sapins ; le trou brûlé et ses flammes n'apparaissent qu'après la foudre */
const HILL='M60 600C200 560 330 520 470 500C600 480 700 420 820 418C940 416 1020 470 1140 500V600Z';
const fir=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-14" width="8" height="16" fill="#5a3a20"/><path d="M0 -62L18 -30H8L22 -12H-22L-8 -30H-18Z" fill="#2c6a32" stroke="#1d4a22" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -62L-18 -30H-8L-22 -12" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.5"/></g>`;
const blob=(cx,cy,r,k)=>{let d='';for(let i=0;i<14;i++){const a=i/14*2*Math.PI,q=r*(1+.22*Math.sin(i*2.7+k)+.12*Math.cos(i*5.1+k));d+=(i?'L':'M')+(cx+q*Math.cos(a)).toFixed(1)+' '+(cy+q*Math.sin(a)*.9).toFixed(1)}return d+'Z'};
const flame=(x,y,s,k)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="flm" style="animation-delay:-${k*.17}s"><path d="M0 0C-11 -5 -9 -20 0 -34C3 -24 13 -18 9 -6C7 -2 4 0 0 0Z" fill="#ff7a1a"/><path d="M0 0C-6 -3 -5 -12 0 -20C3 -12 6 -6 0 0Z" fill="#ffe14d"/></g></g>`;
const hill=`<svg viewBox="0 0 1200 680" class="th-svg" aria-hidden="true"><defs>${halo('hr','#ff4b3e')}
    <linearGradient id="th-hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fca62"/><stop offset="1" stop-color="#4a8838"/></linearGradient><clipPath id="th-hc"><path d="${HILL}"/></clipPath></defs>
  <ellipse cx="600" cy="604" rx="560" ry="10" fill="#000" opacity=".28"/>
  ${fir(300,538,1)}${fir(368,524,.8)}${fir(1030,476,.9)}
  <path d="${HILL}" fill="#2f5124" transform="translate(8 9)"/><path d="${HILL}" fill="url(#th-hg)" stroke="#30561f" stroke-width="3"/>
  <path d="M90 592C220 556 340 522 470 503C600 484 700 424 820 422C935 420 1015 470 1130 500" fill="none" stroke="#c4ec8e" stroke-width="4" stroke-linecap="round" opacity=".55" transform="translate(0 5)"/>
  <g clip-path="url(#th-hc)"><ellipse class="hl" id="hl-hill" cx="815" cy="480" rx="200" ry="80" fill="url(#th-hr)"/></g>
  <g class="burn" id="tl-burn"><path d="${blob(835,444,25,1)}" fill="#2a1a0c" opacity=".9"/><path d="${blob(835,444,17,3)}" fill="#141a33"/>
    ${[[818,436],[852,440],[830,462],[846,455]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5" fill="#ff9a2a"/>`).join('')}
    ${[[817,432,.8,0],[834,424,1.1,1],[852,433,.75,2],[826,462,.6,3]].map(a=>flame(...a)).join('')}
    ${[0,1].map(i=>`<circle class="smk" style="animation-delay:-${i*1.4}s" cx="836" cy="412" r="12" fill="#8a8f99"/>`).join('')}</g>
  ${HT.map(([s,x,y],i)=>tokG('h'+i,s,x,y)).join('')}</svg>`;
/* éclairs : un tracé principal et des ramifications ; « trace » : il se dessine, « hit » : il frappe d'un coup */
const bolt=(main,br,cls)=>`<svg viewBox="0 0 ${SW} ${SH}" class="th-svg ${cls}" aria-hidden="true"><defs><filter id="tb-f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
  ${[[main,'mn'],[br,'br']].map(([d,c])=>`<g class="${c}"><path d="${d}" pathLength="1" fill="none" stroke="#b9c8ff" stroke-width="${c=='mn'?14:8}" filter="url(#tb-f)" stroke-linejoin="round"/>
    <path d="${d}" pathLength="1" fill="none" stroke="#fff" stroke-width="${c=='mn'?4:2.2}" stroke-linejoin="round" stroke-linecap="round"/></g>`).join('')}</svg>`;
const INTER=['M640 294L612 282L618 268L590 262L575 246L548 250L530 232L506 236L494 218L470 214L455 200L428 188','M590 262L572 280L560 296M506 236L512 256L498 270M548 250L540 268'],
  CG=['M812 296L798 318L815 332L801 352L820 366L808 388L826 402L834 424','M798 318L780 336L774 352M801 352L786 370L782 384M820 366L838 380'];
/* ---------- la scène : fond, plancher, décors, narrateur, cadre de scène, rideau ---------- */
const planks=(()=>{const top=478,bot=SH,vx=SW/2,n=18;let s='';
  for(let i=0;i<=n;i++){const xb=-120+i*(SW+240)/n,xt=vx+(xb-vx)*.7;s+=`<path d="M${xt.toFixed(1)} ${top}L${xb.toFixed(1)} ${bot}" stroke="#5a3a20" stroke-width="2" opacity=".55"/>`}
  [0,.18,.4,.66].forEach((t,k)=>{const y=top+(bot-top)*t*t+ (k?0:0);s+=`<path d="M0 ${y.toFixed(1)}H${SW}" stroke="#5a3a20" stroke-width="1.5" opacity=".35"/>`});
  return`<svg viewBox="0 0 ${SW} ${SH-470}" preserveAspectRatio="none" class="th-floor-svg" aria-hidden="true"><defs><linearGradient id="tf-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5230"/><stop offset=".35" stop-color="#a87445"/><stop offset="1" stop-color="#c88d55"/></linearGradient></defs>
    <rect y="8" width="${SW}" height="${SH-478}" fill="url(#tf-g)"/><g transform="translate(0 -470)">${s}</g><path d="M0 8H${SW}" stroke="#3a2412" stroke-width="4"/></svg>`})();
/* lambrequin : festons de velours rouge qui pendent, bordés d'une frange dorée */
const valance=(()=>{const n=12,w=SW/n;let d=`M0 0H${SW}V54`,fr='';for(let i=n-1;i>=0;i--){const x0=(i+1)*w,x1=i*w;d+=`L${x0} 54Q${x0-w/2} 104 ${x1} 54`}d+='Z';
  for(let i=0;i<n;i++){const x0=i*w;fr+=`<path d="M${x0} 54Q${x0+w/2} 104 ${x0+w} 54" fill="none" stroke="#e6c25a" stroke-width="7" stroke-dasharray="3 3"/>`}
  return`<svg viewBox="0 0 ${SW} 110" preserveAspectRatio="none" class="th-svg" aria-hidden="true"><defs><linearGradient id="tv-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f0b0f"/><stop offset=".55" stop-color="#a51f26"/><stop offset="1" stop-color="#6e1217"/></linearGradient></defs>
    <path d="${d}" fill="url(#tv-g)"/>${fr}<path d="M0 22H${SW}" stroke="#e6c25a" stroke-width="5"/></svg>`})();
stage.innerHTML=`
  <div class="th-back"></div><div class="th-floor">${planks}</div><div class="th-foot"></div>
  <div class="th-set" id="th-set">
  <div class="th-conv" id="th-conv">${conv}</div>
  <div class="th-dark"></div><div class="th-fx" id="th-fx"></div>
  <div class="th-spot"></div>
  <div class="th-pool"></div>
  <div class="th-narr" id="th-narr">${narrator}</div>
  <div class="th-bubble" id="th-bubble"><p id="th-say"></p></div>
  </div>
  <div class="th-frame th-frame--l"></div><div class="th-frame th-frame--r"></div>
  <div class="th-curtain th-curtain--l"></div><div class="th-curtain th-curtain--r"></div>
  <div class="th-valance">${valance}</div><div class="th-white"></div>`;

/* ---------- mise à l'échelle et déroulé ---------- */
/* la scène remplit tout l'écran : fond, plancher, rideaux et lambrequin s'étirent sur la largeur (ou la hauteur) en trop ;
   les décors et le narrateur restent dans une zone de 1200 × 680 centrée, posée sur le plancher */
function fit(){const W=innerWidth,H=innerHeight,k=Math.min(W/SW,H/SH),w=W/k,h=H/k;
  stage.style.width=w+'px';stage.style.height=h+'px';stage.style.transform=`scale(${k})`;const set=$('th-set');set.style.left=(w-SW)/2+'px';set.style.top=(h-SH)+'px'}
/* ---------- l'histoire : des étapes (une scène chacune), faites de phrases du narrateur ; « go » met en place le décor de la phrase ---------- */
const SCENES=[
  [{t:'Bonjour ! Je suis un petit nuage, et je vais te raconter comment naît un orage.'},
   {t:'Tout se passe dans l’air. En haut, très loin au-dessus du sol, l’air est froid : il y fait souvent moins de −20 °C, et il neige !',go:()=>add('cold')},
   {t:'En bas, près du sol, l’air est chaud : le Soleil a chauffé le sol, et le sol chauffe l’air.',go:()=>add('warm')},
   {t:'Un orage se forme quand la température de l’air change très vite, ou quand il y a un grand écart de température entre deux couches d’air : l’air chaud du bas et l’air froid du haut.'},
   {t:'Alors l’air se met en mouvement : l’air chaud, plus léger, monte. L’air froid, plus lourd, descend.',go:()=>th.classList.add('conv')},
   {t:'C’est une question de densité : l’air chaud est moins dense que l’air froid. Ces mouvements forment de grands courants d’air, vers le haut et vers le bas.'}],
  [{t:'Dans ces courants d’air, il y a de minuscules gouttes d’eau et de petits cristaux de glace.',go:()=>add('crystals')},
   {t:'Emportés par l’air, ils montent et descendent sans arrêt… et se cognent les uns contre les autres !',go:()=>moving=1},
   {t:'À chaque choc, ils s’échangent ce qu’ils ont à leur surface : des électrons, de toutes petites particules qui viennent des molécules d’eau.',go:()=>sparks=1}],
  [{t:'Pour la suite, il nous faut un plus grand décor : une colline et, au-dessus, des nuages… dont un gros nuage d’orage !',go:()=>{add('hill');later(()=>add('clouds'),500);later(()=>add('storm'),1000)},lock:2800},
   {t:'Les petits cartons rouges sont des charges positives (+). Les bleus sont des charges négatives (−) : ce sont les électrons.'},
   {t:'Pour l’instant, il y a autant de + que de − : tout est neutre.'},
   {t:'Mais à chaque choc, des électrons s’accumulent dans le nuage. Avec tous ces électrons en plus, il devient globalement négatif !',go:accumulate,lock:2000},
   {t:'Et c’est comme pour un aimant : le négatif repousse le négatif !',go:()=>TOP.forEach(i=>shake('c'+i,1))},
   {t:'Le bas du nuage est très négatif : il chasse les charges négatives du haut du nuage. Le haut du nuage devient très positif !',go:polarize,lock:2200},
   {t:'Même chose pour le sol : le bas du nuage repousse ses charges négatives. Sous le nuage, le sol devient très positif !',go:ground,lock:2000}],
  [{t:'Quand une zone très négative est proche d’une zone très positive, il apparaît une tension électrique entre les deux.',go:()=>{tens('ts-t1',1);tens('ts-t2',1)}},
   {t:'Si le matériau qui les sépare laisse passer les électrons, il se crée un courant électrique. Ici, ce matériau, c’est l’air.'},
   {t:'Au bout d’un moment, la tension entre le haut et le bas du nuage est si grande que l’électricité passe : c’est un éclair intra-nuageux !',go:()=>{tens('ts-t1',0);tens('ts-t2',0);weather('intra')},lock:1800},
   {t:'Quand la tension est trop forte entre deux nuages, c’est un éclair inter-nuageux : il se balade sous les nuages !',go:()=>{hl('s2',1);weather('inter')},lock:2200},
   {t:'Et parfois, moins souvent mais de façon bien plus spectaculaire, la tension s’accumule entre le nuage et le sol…',go:build,lock:4200},
   {t:'C’est la naissance de l’éclair extra-nuageux : un impact électrique très bruyant, impressionnant… et dangereux !',go:strike,lock:2600},
   {t:'Brrr… J’en tremble encore ! Heureusement, sur scène, ce n’est qu’une maquette.'},
   {t:'Et voilà comment naît un orage ! Merci d’avoir assisté au spectacle !',go:()=>th.classList.remove('scared','dim')}]];
/* étapes dont le décor reste en place pour l'étape suivante */
const KEEP=new Set([2]);
/* décors : position dans la scène, d'où ils viennent (ils y repartent à la fin de l'étape), et leur bruit de machinerie (poulie des cintres ou glissement sur le plancher) */
const PROPS={cold:{html:coldAir,cls:'th-hang',box:[640,0,455,270],out:'translateY(-900px)'},warm:{html:warmAir,box:[640,330,455,250],out:'translateX(1400px)',snd:'slide'},
  crystals:{html:crystals,box:[0,0,1200,680],out:'translateY(-1000px)',init:initCrystals},
  hill:{html:hill,box:[0,0,1200,680],out:'translateX(1400px)',snd:'slide'},clouds:{html:smallClouds,box:[0,0,1200,680],out:'translateY(-700px)'},storm:{html:storm,box:[0,0,1200,680],out:'translateY(-700px)'}};
let T=[],sc=0,li=0,busy=0,ended=0,raf=0,moving=0,sparks=0,CRY=null,last=0,wid=0;
const later=(f,ms)=>T.push(setTimeout(f,ms)),btn=$('th-next'),fx=$('th-fx'),endMenu=$('th-end'),A=window.ThAudio,rnd=(a,b)=>a+Math.random()*(b-a);
const machine=k=>PROPS[k].snd=='slide'?A.slide():A.pulley();
function say(t){const b=$('th-bubble');b.classList.remove('on');if(t)later(()=>{$('th-say').textContent=t;b.classList.add('on')},150)}
function add(k){const P=PROPS[k],e=document.createElement('div');e.className='th-prop '+(P.cls||'');e.dataset.prop=k;
  e.style.cssText=`left:${P.box[0]}px;top:${P.box[1]}px;width:${P.box[2]}px;height:${P.box[3]}px;--out:${P.out}`;e.innerHTML=P.html;
  $('th-set').insertBefore(e,$('th-conv'));if(P.init)P.init(e);void e.offsetWidth;e.classList.add('in');machine(k)}
/* fin d'étape : tous les décors repartent d'où ils sont venus (une poulie, un glissement), puis disparaissent */
function clearProps(now){th.classList.remove('conv','dark','dim','build','strike','scared');moving=sparks=0;wid++;fx.innerHTML='';A.rumble(false);const snd=new Set();
  document.querySelectorAll('#th-set .th-prop').forEach(e=>{if(now){e.remove();return}const s=PROPS[e.dataset.prop].snd||'pulley';if(!snd.has(s)){snd.add(s);machine(e.dataset.prop)}
    e.classList.remove('in');later(()=>e.remove(),1700)});if(now)CRY=null;else later(()=>CRY=null,1700)}
/* bouton « Compris » : phrase suivante ; il reste bloqué un instant, le temps que le décor se mette en place */
function lock(ms){busy=1;btn.disabled=true;later(()=>{busy=0;btn.disabled=false},ms)}
function line(){const L=SCENES[sc][li];say(L.t);if(L.go)L.go();lock(L.lock||(L.go?1300:700))}
function next(){if(busy||btn.hidden||ended)return;
  if(li<SCENES[sc].length-1){li++;line();return}
  if(sc<SCENES.length-1){if(KEEP.has(sc)){sc++;li=0;line();return}say('');clearProps();lock(2100);later(()=>{sc++;li=0;line()},1900);return}
  finale()}
/* fin de la représentation : les décors s'en vont, le narrateur salue sous les applaudissements, le rideau se ferme, puis le menu */
function finale(){ended=1;say('');clearProps();btn.hidden=true;
  later(()=>{th.classList.add('bow');A.applause(true)},1500);
  later(()=>{th.classList.remove('opening');A.music(false)},3700);
  later(()=>{th.classList.remove('bow');endMenu.hidden=false;$('th-again').focus({preventScroll:true})},6100)}
function start(){sc=li=ended=0;endMenu.hidden=true;btn.hidden=true;A.music(true);later(()=>th.classList.add('opening'),500);later(()=>{btn.hidden=false;line()},2400)}
function restart(){T.forEach(clearTimeout);T=[];clearProps(1);A.applause(false);busy=0;th.className='';start()}

/* étapes 3 et 4 : les cartons des charges, les halos, les éclairs */
const tk=id=>$('tk-'+id);
function mv(id,x,y,delay,op){const e=tk(id);if(!e)return;e.style.transitionDelay=(delay||0)+'s';e.style.transform=`translate(${x}px,${y}px)`;e.style.opacity=op==null?1:op}
function shake(id,on){const e=tk(id);if(e)e.firstChild.classList.toggle('shake',!!on)}
function hl(id,on){const e=$('hl-'+id);if(e){e.classList.toggle('on',!!on);e.classList.remove('spent')}}
function tens(id,on){const e=$(id);if(e)e.classList.toggle('on',!!on)}
/* des électrons arrivent par les côtés et s'entassent dans le bas du nuage : le nuage devient négatif (halo bleu) */
function accumulate(){EX.forEach(([x,y],i)=>mv('x'+i,x,y,i*.22));later(()=>hl('aura',1),900)}
/* les − du haut sont chassés vers le haut, hors du nuage ; le haut reste positif (rouge), le bas très négatif (bleu) */
function polarize(){TOP.forEach((i,k)=>{shake('c'+i,0);const[,x]=CT[i];mv('c'+i,x+rnd(-70,70),-260,k*.18)});mv('c8',800,190,.5);hl('aura',0);later(()=>{hl('top',1);hl('bot',1)},900)}
/* les − de la colline sont repoussés au loin, sur les côtés : le sol sous le nuage devient positif */
function ground(){Object.entries(AWAY).forEach(([i,[x,y]],k)=>mv('h'+i,x,y,k*.15));later(()=>hl('hill',1),900)}
/* lueurs diffuses dans le nuage (tonnerre étouffé), ou éclair qui se dessine sous les nuages (tonnerre au loin) ; ça se répète tant que dure la phrase */
function glow(){const i=Math.floor(Math.random()*4),e=$('ic-'+i);if(!e)return;e.classList.remove('go');void e.getBoundingClientRect();e.classList.add('go');later(()=>A.thunder('muffled'),rnd(250,600))}
function weather(m){const id=++wid,go=()=>{if(id!=wid)return;
  if(m=='intra'){glow();if(Math.random()<.4)later(glow,350);later(go,rnd(2600,4200))}
  else{fx.innerHTML=bolt(...INTER,'trace');later(()=>A.thunder('far'),700);later(glow,3000);later(go,rnd(5200,6400))}};go()}
/* la tension monte entre le nuage et le sol : tout s'assombrit, les halos battent, ça gronde */
function build(){wid++;fx.innerHTML='';tens('ts-t2',1);th.classList.add('dark','build');A.rumble(true)}
/* la foudre tombe sur la colline : éclair, flash, fracas, la scène tremble ; il reste un trou brûlé et des flammèches */
function strike(){th.classList.remove('build','strike');void th.offsetWidth;th.classList.add('strike');fx.innerHTML=bolt(...CG,'hit');tens('ts-t2',0);A.rumble(false);A.thunder('near');
  later(()=>{$('tl-burn').classList.add('on');th.classList.add('scared','dim');th.classList.remove('dark');['bot','hill'].forEach(k=>$('hl-'+k).classList.add('spent'))},120)}

/* étape 2 : chaque paire de particules monte et descend en sens contraire ; quand elles se croisent, elles se cognent (et, une fois expliqué, une étincelle jaillit) */
function initCrystals(e){CRY={e,pairs:PAIRS.map(([x,,,per,a],p)=>({x,w:2*Math.PI/per,a,g:[0,1].map(j=>e.querySelector(`#tq-${p}${j}`)),s:[0,1].map(j=>e.querySelector(`#tq-s${p}${j}`))})),sp:e.querySelector('#tq-sparks')};stepCrystals(0)}
function spark(x,y){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform',`translate(${x} ${y})`);
  g.innerHTML=`<g class="spk"><circle r="34" fill="url(#tq-s)"/><path d="M0 -26L6 -7L24 -12L9 1L20 18L2 9L-8 26L-7 6L-26 4L-9 -6Z" fill="#ffe04a" stroke="#f0a020" stroke-width="2" stroke-linejoin="round"/></g>`;CRY.sp.appendChild(g);setTimeout(()=>g.remove(),700)}
function stepCrystals(dt){if(!CRY)return;CRY.pairs.forEach(p=>{const a0=p.a;if(moving)p.a+=p.w*dt;const s=Math.sin(p.a);
  [CY-CA*s,CY+CA*s].forEach((y,j)=>{const x=p.x+60*j;p.g[j].setAttribute('transform',`translate(${x} ${y.toFixed(1)})`);p.s[j].setAttribute('d',`M${x} -800V${(y-34).toFixed(1)}`)});
  if(sparks&&Math.floor(p.a/Math.PI)!=Math.floor(a0/Math.PI))spark(p.x+30,CY)})}
function loop(now){raf=requestAnimationFrame(loop);const dt=last?Math.min(.05,(now-last)/1000):0;last=now;stepCrystals(dt)}

function open(){$('start').hidden=true;th.hidden=false;th.className='';fit();rot.hidden=!portrait.matches;void th.offsetWidth;start();last=0;if(!raf)raf=requestAnimationFrame(loop)}
function close(){T.forEach(clearTimeout);T=[];clearProps(1);A.stop();cancelAnimationFrame(raf);raf=0;th.hidden=true;th.className='';say('');btn.hidden=true;endMenu.hidden=true;$('start').hidden=false;$('go-storm').focus({preventScroll:true})}
/* invitation à passer en paysage : disparaît seule quand on tourne le téléphone, ou d'un toucher */
const portrait=matchMedia('(orientation: portrait)'),rot=$('th-rot');portrait.addEventListener('change',()=>{if(!portrait.matches)rot.hidden=true});rot.onclick=()=>rot.hidden=true;
$('go-storm').onclick=open;$('th-quit').onclick=close;$('th-next').onclick=next;$('th-again').onclick=restart;$('th-out').onclick=close;
/* bouton pour couper le son (retenu d'une visite à l'autre) */
const snd=$('th-snd');let muted=false;try{muted=localStorage.getItem('th-muted')=='1'}catch(e){}
function setMute(m){muted=m;A.mute(m);snd.textContent=m?'🔇':'🔊';snd.setAttribute('aria-pressed',m);snd.setAttribute('aria-label',m?'Remettre le son':'Couper le son');try{localStorage.setItem('th-muted',m?'1':'0')}catch(e){}}
setMute(muted);snd.onclick=()=>setMute(!muted);
addEventListener('resize',()=>{if(!th.hidden)fit()});addEventListener('orientationchange',()=>{if(!th.hidden)setTimeout(fit,300)});
addEventListener('keydown',e=>{if(th.hidden)return;if(e.key=='Escape')close();else if((e.key=='Enter'||e.key==' '||e.key=='ArrowRight')&&!e.target.closest('button')&&rot.hidden){e.preventDefault();next()}})})();
