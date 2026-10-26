/* « D'où viennent les couleurs du ciel ? » : une enquête affichée sur les quatre murs d'une pièce.
   On arrive au centre de la pièce ; on s'approche d'un mur en le touchant, on passe au mur voisin avec les flèches. Un clic sur un cadre s'en approche, un second clic recule,
   un clic sur un texte l'affiche en grand. Chaque mur est dessiné dans un repère fixe de 1200 × 680, mis à l'échelle de l'écran. */
(()=>{const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',DW=1200,DH=680,NAV=3,
  TITLES=['La lumière : pas aussi simple que ça','Les molécules de l’air responsables de la couleur bleue','Et pour un coucher de Soleil alors ?'],
  SPEC=['#ff3b30','#ff8a1e','#ffe23a','#3fd06a','#2f9bff','#5a4bff','#a24bff'],CNAME=['rouge','orange','jaune','vert','bleu','indigo','violet'],
  hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),
  spec=u=>{const x=Math.max(0,Math.min(1,u))*(SPEC.length-1),i=Math.min(SPEC.length-2,x|0),t=x-i,a=hex(SPEC[i]),b=hex(SPEC[i+1]);return`rgb(${a.map((v,k)=>Math.round(v+(b[k]-v)*t))})`},
  specStops=SPEC.map((c,i)=>`<stop offset="${(i/(SPEC.length-1)).toFixed(3)}" stop-color="${c}"/>`).join('');

/* ---------- textes : la version courte est sur le mur, la version complète s'ouvre en grand ---------- */
const NOTES={
  newton:{t:'Isaac Newton (1643 – 1727)',s:'Savant anglais. Il découvre la gravitation et montre, avec un prisme, que la lumière blanche est un mélange de couleurs.',
    l:`<p>Isaac Newton est un savant anglais, professeur à l’université de Cambridge.</p>
      <p>Il découvre la <b>gravitation</b> : la force qui fait tomber une pomme est la même que celle qui retient la Lune autour de la Terre.</p>
      <p>En 1666, il fait passer un rayon de soleil dans un <b>prisme</b> de verre : la lumière blanche s’étale en un ruban de couleurs. La lumière blanche est donc un <b>mélange de toutes les couleurs</b>.</p>`},
  soleil:{t:'Pourquoi le Soleil est blanc',s:'À 5 500 °C, le Soleil émet toutes les couleurs : leur mélange nous paraît blanc.',
    l:`<p>Un objet très chaud émet de la lumière, et sa couleur dépend de sa <b>température</b>, comme un morceau de fer chauffé qui devient rouge, puis orange, puis blanc.</p>
      <p>Les étoiles suivent la même règle :</p>
      <dl class="fiche"><dt>Bételgeuse</dt><dd>3 300 °C : rouge</dd><dt>Arcturus</dt><dd>4 000 °C : orange</dd><dt>Soleil</dt><dd>5 500 °C : blanc</dd><dt>Rigel</dt><dd>11 000 °C : bleue</dd></dl>
      <p>À 5 500 °C, le Soleil émet toutes les couleurs en quantités presque égales : leur mélange nous paraît <b>blanc</b>. Vu depuis l’espace, le Soleil est blanc ! S’il nous paraît jaune ou orangé depuis le sol, c’est à cause de l’air qu’il traverse : nous le verrons sur un autre mur.</p>`},
  prisme:{t:'Le prisme',s:'Le verre dévie la lumière, le violet plus que le rouge : les couleurs se séparent. Déplace l’œil !',
    l:`<p>Quand la lumière passe de l’air au verre, puis du verre à l’air, elle change de direction : c’est la <b>réfraction</b>.</p>
      <p>Mais toutes les couleurs ne sont pas déviées de la même façon : le <b>violet</b> est le plus dévié, le <b>rouge</b> le moins. Les couleurs mélangées dans la lumière blanche se séparent donc un peu dans le verre, puis beaucoup plus à la sortie, en s’éloignant du prisme : c’est la <b>dispersion</b>.</p>
      <p>On obtient un ruban de couleurs qui passent de l’une à l’autre sans frontière : le <b>spectre</b>. On y reconnaît le rouge, l’orange, le jaune, le vert, le bleu, l’indigo et le violet.</p>
      <p><b>À toi de jouer :</b> déplace l’œil dans le cadre. Près de la lampe, il reçoit de la lumière blanche ; après le prisme, il ne reçoit qu’une partie des couleurs.</p>
      <p class="petit">Sur l’animation, l’écart entre les couleurs est agrandi pour qu’on le voie bien.</p>`},
  arc:{t:'L’arc-en-ciel',s:'Le Soleil dans le dos, la pluie devant soi. Chaque goutte agit comme un petit prisme : elle renvoie la lumière en séparant les couleurs, chacune avec son propre angle.',
    l:`<p>Pour voir un arc-en-ciel, il faut deux choses : le <b>Soleil dans ton dos</b> et des <b>gouttes de pluie devant toi</b>.</p>
      <p>Chaque goutte se comporte comme un tout petit prisme : la lumière blanche du Soleil y entre (elle est déviée), se <b>réfléchit</b> sur le fond de la goutte, puis ressort (elle est encore déviée). À chaque passage, les couleurs se séparent un peu plus.</p>
      <p>Chaque couleur ressort avec un angle bien précis : environ <b>42°</b> pour le rouge et <b>40°</b> pour le violet. Ainsi, une goutte ne t’envoie qu’une seule couleur : le rouge te parvient des gouttes un peu plus hautes, le violet des gouttes un peu plus basses.</p>
      <p>Toutes les gouttes qui t’envoient du rouge sont sur un cercle autour du point opposé au Soleil : voilà pourquoi l’arc est <b>rond</b>, avec le rouge à l’extérieur et le violet à l’intérieur. Et ton voisin, un peu plus loin, voit son propre arc-en-ciel, fait d’autres gouttes !</p>`},
  air:{t:'De quoi est fait l’air ?',s:'L’air est un mélange de gaz : 80 % de diazote, 18 % de dioxygène et 2 % de dioxyde de carbone.',
    l:`<p>L’air semble vide, mais il est rempli de <b>molécules</b> minuscules, invisibles même au microscope. Chaque molécule est un petit assemblage d’<b>atomes</b>, que l’on retrouve dans le tableau périodique des éléments : l’azote (N), l’oxygène (O), le carbone (C)…</p>
      <dl class="fiche"><dt>Diazote N₂</dt><dd>2 atomes d’azote : 80 %</dd><dt>Dioxygène O₂</dt><dd>2 atomes d’oxygène : 18 %</dd><dt>Dioxyde de carbone CO₂</dt><dd>1 atome de carbone et 2 d’oxygène : 2 %</dd></dl>
      <p>Sur <b>100 molécules</b> d’air, il y a donc 80 molécules de diazote, 18 de dioxygène et 2 de dioxyde de carbone. On néglige les autres gaz, très peu nombreux.</p>
      <p class="petit">Sur les dessins, chaque atome a une couleur conventionnelle : l’oxygène en rouge, l’azote en bleu, le carbone en gris foncé.</p>`},
  souffle:{t:'Respirer : le rôle des gaz',s:'Le dioxygène passe des poumons dans le sang : nos cellules l’utilisent et rejettent du dioxyde de carbone, qu’on expire. Le diazote entre et ressort sans changer.',
    l:`<p>À chaque inspiration, l’air descend par le nez, la trachée et les bronches jusqu’aux <b>poumons</b>.</p>
      <p><b>Le dioxygène</b> traverse la paroi très fine des poumons et passe dans le sang, qui l’apporte à toutes nos cellules. Les cellules s’en servent pour tirer de l’énergie des aliments, et elles rejettent un déchet : le <b>dioxyde de carbone</b>. Le sang le ramène aux poumons, et nous l’expirons.</p>
      <p><b>Le diazote</b>, lui, ne sert à rien à notre corps : il entre et ressort sans changer. Il est pourtant le gaz le plus abondant de l’air !</p>
      <dl class="fiche"><dt>Air inspiré</dt><dd>18 % de dioxygène, 2 % de dioxyde de carbone</dd><dt>Air expiré</dt><dd>13 % de dioxygène, 7 % de dioxyde de carbone</dd></dl>
      <p class="petit">Sur l’animation, chaque inspiration fait entrer 100 molécules : 80 de diazote, 18 de dioxygène et 2 de dioxyde de carbone. Dans les poumons, 5 molécules de dioxygène sont remplacées par 5 de dioxyde de carbone.</p>`},
  bleu:{t:'Pourquoi le ciel est bleu',s:'Les molécules de l’air laissent passer la plupart des couleurs, mais dévient le bleu et le violet dans toutes les directions. Monte ou descends l’œil : hors du rayon du Soleil, il voit le bleu du ciel !',
    l:`<p>La lumière blanche du Soleil contient toutes les couleurs (mur 1). Pour arriver jusqu’à nous, elle traverse l’air et ses milliards de milliards de molécules.</p>
      <p>Ces molécules sont si petites que la plupart des couleurs passent à côté sans être gênées. Mais le <b>bleu</b> et le <b>violet</b> sont <b>déviés</b> par les molécules et partent dans toutes les directions.</p>
      <p>Résultat : où que tu regardes dans le ciel, tu reçois cette lumière bleue déviée par l’air. <b>Le ciel paraît bleu.</b></p>
      <p>Et le Soleil ? La lumière qui vient de lui en ligne droite a perdu un peu de son bleu : il nous paraît légèrement <b>jaune</b>. Attention : ne regarde <b>jamais</b> le Soleil directement, même avec des lunettes de soleil !</p>
      <p><b>Pourquoi pas violet ?</b> Le Soleil envoie moins de violet que de bleu, et nos yeux voient mal le violet : c’est le bleu qui l’emporte.</p>
      <p class="petit">Ce phénomène s’appelle la diffusion de Rayleigh, du nom du physicien anglais qui l’a expliqué en 1871. En réalité, toutes les couleurs sont un tout petit peu déviées, mais le bleu et le violet beaucoup plus que le rouge.</p>`}};

/* ---------- mur 1 : expérience du prisme (Snell-Descartes, dispersion exagérée pour être visible) ---------- */
const PW=490,PH=296,PA=[240,34],PL=[146,197],PR=[334,197],SRC=[40,236],EF=.52,
  E=[PL[0]+(PA[0]-PL[0])*EF,PL[1]+(PA[1]-PL[1])*EF],
  nrm=v=>{const l=Math.hypot(v[0],v[1]);return[v[0]/l,v[1]/l]},dot=(a,b)=>a[0]*b[0]+a[1]*b[1],
  refr=(I,N,eta)=>{const ci=-dot(N,I),k=1-eta*eta*(1-ci*ci);return k<0?null:nrm([eta*I[0]+(eta*ci-Math.sqrt(k))*N[0],eta*I[1]+(eta*ci-Math.sqrt(k))*N[1]])},
  hit=(P,D,A,B)=>{const ex=B[0]-A[0],ey=B[1]-A[1],den=D[0]*ey-D[1]*ex,t=((A[0]-P[0])*ey-(A[1]-P[1])*ex)/den;return[P[0]+D[0]*t,P[1]+D[1]*t]},
  /* normale sortante de la face d'entrée, normale rentrante de la face de sortie (orientées vers la lumière qui arrive) */
  NB=36,NL=nrm([PA[1]-PL[1],PL[0]-PA[0]]),NRi=nrm([PA[1]-PR[1],PR[0]-PA[0]]),I0=nrm([E[0]-SRC[0],E[1]-SRC[1]]),
  RAYS=Array.from({length:NB+1},(_,i)=>{const u=i/NB,n=1.46+.2*u,T=refr(I0,NL,1/n),X=hit(E,T,PA,PR),O=refr(T,NRi,n);return{u,X,O,F:[X[0]+O[0]*320,X[1]+O[1]*320]}}),
  pt=p=>`${p[0].toFixed(1)} ${p[1].toFixed(1)}`,
  inPoly=(P,Q)=>{let c=0;for(let i=0,j=Q.length-1;i<Q.length;j=i++)if((Q[i][1]>P[1])!=(Q[j][1]>P[1])&&P[0]<(Q[j][0]-Q[i][0])*(P[1]-Q[i][1])/(Q[j][1]-Q[i][1])+Q[i][0])c=!c;return c},
  TRI=[PA,PR,PL];
function prismSVG(){let fanOut='',fanIn='',rays='';
  for(let i=0;i<NB;i++){const a=RAYS[i],b=RAYS[i+1],c=spec((a.u+b.u)/2);fanOut+=`<path d="M${pt(a.X)}L${pt(a.F)}L${pt(b.F)}L${pt(b.X)}Z" fill="${c}"/>`;fanIn+=`<path d="M${pt(E)}L${pt(a.X)}L${pt(b.X)}Z" fill="${c}"/>`}
  [0,.5,1].forEach((u,k)=>{const r=RAYS[Math.round(u*NB)];rays+=`<path class="flow flow--soft" style="animation-delay:-${k*.4}s" d="M${pt(r.X)}L${pt([r.X[0]+r.O[0]*240,r.X[1]+r.O[1]*240])}" stroke="#fff"/>`});
  const k=6,iA=[PA[0],PA[1]+2*k],iL=[PL[0]+k*1.75,PL[1]-k*.9],iR=[PR[0]-k*1.75,PR[1]-k*.9],
    /* le faisceau de la lampe s'élargit jusqu'à la face d'entrée du prisme */
    fd=nrm([PA[0]-PL[0],PA[1]-PL[1]]),C1=[E[0]+fd[0]*26,E[1]+fd[1]*26],C2=[E[0]-fd[0]*26,E[1]-fd[1]*26];
  return`<svg viewBox="0 0 ${PW} ${PH}" class="prism-svg" aria-label="Expérience du prisme : déplace l’œil">
  <defs><radialGradient id="p-glow" cx="${SRC[0]}" cy="${SRC[1]}" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fffdf2" stop-opacity=".6"/><stop offset=".35" stop-color="#fff6dc" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="p-bulb"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fffbe6"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
    <linearGradient id="p-fade" gradientUnits="userSpaceOnUse" x1="${RAYS[0].X[0].toFixed(0)}" y1="0" x2="${PW}" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
    <mask id="p-mask"><rect width="${PW}" height="${PH}" fill="url(#p-fade)"/></mask>
    <linearGradient id="p-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#dff1ff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
    <linearGradient id="p-cone" gradientUnits="userSpaceOnUse" x1="${SRC[0]}" y1="${SRC[1]}" x2="${E[0].toFixed(0)}" y2="${E[1].toFixed(0)}"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity=".38"/></linearGradient>
    <linearGradient id="p-specH">${specStops}</linearGradient>
    <filter id="p-blur" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="p-blur3" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".9"/></filter><filter id="p-blur2" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <rect width="${PW}" height="${PH}" fill="#07080f"/>
  <circle class="p-halo" cx="${SRC[0]}" cy="${SRC[1]}" r="230" fill="url(#p-glow)"/>
  <path d="M${pt(SRC)}L${pt(C1)}L${pt(C2)}Z" fill="url(#p-cone)" filter="url(#p-blur)"/>
  <path d="M${pt(SRC)}L${pt(C1)}L${pt(C2)}Z" fill="url(#p-cone)" opacity=".7"/>
  <path class="flow" d="M${pt(SRC)}L${pt(E)}" stroke="#fff"/>
  <g mask="url(#p-mask)"><g opacity=".7" filter="url(#p-blur2)">${fanOut}</g><g filter="url(#p-blur)">${fanOut}</g><g opacity=".55" mask="url(#p-mask)">${rays}</g></g>
  <path d="M${pt(PA)}L${pt(PR)}L${pt(PL)}Z" fill="url(#p-glass)"/>
  <g opacity=".95" filter="url(#p-blur3)">${fanIn}</g>
  <path d="M${pt(PA)}L${pt(PR)}L${pt(iR)}L${pt(iA)}Z" fill="#fff" fill-opacity=".25"/><path d="M${pt(PA)}L${pt(PL)}L${pt(iL)}L${pt(iA)}Z" fill="#fff" fill-opacity=".1"/>
  <path d="M${pt(PL)}L${pt(PR)}L${pt(iR)}L${pt(iL)}Z" fill="#fff" fill-opacity=".18"/><path d="M${pt(PA)}L${pt(PR)}L${pt(PL)}Z" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="${E[0].toFixed(1)}" cy="${E[1].toFixed(1)}" r="10" fill="url(#p-bulb)"/>
  <circle cx="${SRC[0]}" cy="${SRC[1]}" r="26" fill="url(#p-bulb)" class="p-bulb"/><circle cx="${SRC[0]}" cy="${SRC[1]}" r="7" fill="#fff"/>
  <g class="p-lbl"><text x="${PA[0]}" y="${PL[1]+18}" text-anchor="middle">Prisme de verre</text>
    <text x="${PW-12}" y="${(RAYS[NB].F[1]>PH?PH-14:RAYS[NB].F[1]-14).toFixed(0)}" text-anchor="end">Spectre</text></g>
  <g class="p-view" id="p-view"><rect class="b-box" x="147" y="224" width="196" height="64" rx="10"/><text class="b-ttl" x="245" y="239" text-anchor="middle">Ce que l’œil reçoit</text>
    <rect class="b-view" x="157" y="245" width="176" height="18" rx="4"/><path class="b-mark"/><text class="b-txt" x="245" y="282" text-anchor="middle"></text></g>
  <g class="eye" id="p-eye" tabindex="0" role="slider" aria-label="Œil à déplacer">
    <ellipse cx="0" cy="0" rx="17" ry="10" fill="#fff" stroke="#2b2b2b" stroke-width="1.6"/><circle cx="2" cy="0" r="6.4" fill="#5b8fd6"/><circle cx="2" cy="0" r="3" fill="#111"/><circle cx="0" cy="-2" r="1.4" fill="#fff"/>
    <path d="M-17 0Q0-16 17 0" fill="none" stroke="#2b2b2b" stroke-width="2"/><circle r="26" fill="transparent"/></g>
  </svg>`}
/* ce que reçoit l'œil en (x,y) : blanc près de la lampe, une couleur précise dans le spectre, rien ailleurs */
function seen(P){if(inPoly(P,TRI)){for(let i=0;i<NB;i++)if(inPoly(P,[E,RAYS[i].X,RAYS[i+1].X]))return{k:'spec',u:(i+.5)/NB,in:1};return{k:'glass'}}
  for(let i=0;i<NB;i++)if(inPoly(P,[RAYS[i].X,RAYS[i].F,RAYS[i+1].F,RAYS[i+1].X]))return{k:'spec',u:(i+.5)/NB};
  const yy=Math.max(PA[1],Math.min(PL[1],P[1])),bx=PL[0]+(PA[0]-PL[0])*(PL[1]-yy)/(PL[1]-PA[1]);
  return P[0]<bx&&Math.hypot(P[0]-SRC[0],P[1]-SRC[1])<215?{k:'white'}:{k:'dark'}}
function placeEye(svg,x,y){x=Math.max(22,Math.min(PW-22,x));y=Math.max(18,Math.min(PH-14,y));const g=svg.querySelector('#p-eye'),s=seen([x,y]),v=svg.querySelector('#p-view'),q=v.querySelector.bind(v);
  g.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)})`);g.dataset.x=x;g.dataset.y=y;
  /* l'étiquette fixe sous le prisme montre ce que reçoit l'œil : blanc, une couleur repérée dans le spectre, ou rien */
  const vw=q('.b-view'),m=q('.b-mark'),t=q('.b-txt'),vx=+vw.getAttribute('x'),vy=+vw.getAttribute('y'),bw=+vw.getAttribute('width');
  vw.setAttribute('fill',s.k=='white'?'#ffffff':s.k=='spec'?'url(#p-specH)':s.k=='glass'?'#e9eef5':'#000');m.setAttribute('d','');
  if(s.k=='spec'){const mx=vx+s.u*bw;m.setAttribute('d',`M${mx-5} ${vy+25}L${mx} ${vy+19}L${mx+5} ${vy+25}Z`);t.textContent=(s.in?'Dans le verre · ici : ':'Couleurs séparées · ici : ')+CNAME[Math.round(s.u*6)]}
  else t.textContent=s.k=='white'?'Lumière blanche : tout est mélangé':s.k=='glass'?'Dans le verre, pas encore séparé':'Noir : aucune lumière ici'}

/* ---------- mur 1 : le Soleil et d'autres étoiles ---------- */
function starsSVG(){let st='';for(let i=0;i<70;i++)st+=`<circle cx="${(Math.random()*330).toFixed(1)}" cy="${(Math.random()*180).toFixed(1)}" r="${(Math.random()*.8+.3).toFixed(2)}" fill="#fff" opacity="${(Math.random()*.6+.2).toFixed(2)}"/>`;
  const S=[['Bételgeuse','3 300 °C','#ff5a3c',236,38,11],['Arcturus','4 000 °C','#ffa040',268,92,9],['Rigel','11 000 °C','#8fb4ff',236,146,10]];
  return`<svg viewBox="0 0 330 180" aria-label="Le Soleil et trois étoiles de couleurs différentes"><defs><radialGradient id="s-sun"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fffdf6"/><stop offset=".7" stop-color="#fff6e2" stop-opacity=".7"/><stop offset="1" stop-color="#ffe9c4" stop-opacity="0"/></radialGradient>
    ${S.map(([,,c],i)=>`<radialGradient id="s-g${i}"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
    <radialGradient id="s-bg" cx=".3" cy=".45" r=".9"><stop offset="0" stop-color="#1c2147"/><stop offset="1" stop-color="#05060f"/></radialGradient></defs>
    <rect width="330" height="180" fill="url(#s-bg)"/>${st}<circle cx="100" cy="82" r="78" fill="url(#s-sun)"/><circle cx="100" cy="82" r="44" fill="#fff"/>
    <text class="s-lbl s-sun" x="100" y="160" text-anchor="middle">Soleil · 5 500 °C</text>
    ${S.map(([n,t,c,x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r*2.4}" fill="url(#s-g${i})"/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="${c}"/><text class="s-lbl" x="${x+r+8}" y="${y-1}">${n}</text><text class="s-lbl s-t" x="${x+r+8}" y="${y+10}">${t}</text>`).join('')}</svg>`}

/* ---------- mur 1 : l'arc-en-ciel (flèches de lumière animées) ---------- */
const RW=385,RH=290,SUN=[54,52],CROWD=[66,246],BOWC=[80,420],BOWR=340,RAINX=[246,360],RAINY=[96,236];
function rainbowSVG(){let rain='',crowd='',bow='',rays='';
  for(let i=0;i<46;i++){const x=RAINX[0]+Math.random()*(RAINX[1]-RAINX[0]),y=RAINY[0]+Math.random()*10;rain+=`<path d="M${x.toFixed(1)} ${y.toFixed(1)}l-14 ${(RAINY[1]-y+14).toFixed(1)}" style="animation-delay:-${(Math.random()*.7).toFixed(2)}s"/>`}
  SPEC.forEach((c,i)=>bow+=`<path d="M${BOWC[0]+(BOWR+9-i*3)} ${BOWC[1]}A${BOWR+9-i*3} ${BOWR+9-i*3} 0 0 0 ${BOWC[0]} ${BOWC[1]-(BOWR+9-i*3)}" stroke="${c}"/>`);
  const P=['#d9534f','#3b6fb6','#e8a33a','#2ba39a','#8a5cc8','#5a8f3a','#c0563a'];for(let i=0;i<7;i++){const x=22+i*13+(i%2)*3,s=.85+(i%3)*.12;crowd+=`<g transform="translate(${x} ${CROWD[1]+4}) scale(${s})"><rect x="-3" y="-11" width="6" height="10" rx="2.5" fill="${P[i]}"/><circle cy="-14.5" r="3.2" fill="${['#f0c29a','#8d5a3b','#d9a27a'][i%3]}"/></g>`}
  for(let i=0;i<12;i++)rays+=`<path d="M0 -26V-36" transform="rotate(${i*30})"/>`;
  return`<svg viewBox="0 0 ${RW} ${RH}" aria-label="Formation d’un arc-en-ciel"><defs><linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8e0"/><stop offset="1" stop-color="#d6ebf7"/></linearGradient>
    <radialGradient id="r-sun"><stop offset="0" stop-color="#fffbe6"/><stop offset=".45" stop-color="#ffe066"/><stop offset="1" stop-color="#ffb52e" stop-opacity="0"/></radialGradient>
    <linearGradient id="r-spec" x1="0" y1="0" x2="0" y2="1">${specStops}</linearGradient><clipPath id="r-rain"><rect x="${RAINX[0]-20}" y="${RAINY[0]}" width="${RAINX[1]-RAINX[0]+30}" height="${RAINY[1]-RAINY[0]+20}"/></clipPath></defs>
    <rect width="${RW}" height="${RH}" fill="url(#r-sky)"/>
    <g clip-path="url(#r-rain)"><g class="r-bow" fill="none" stroke-width="3" opacity=".55">${bow}</g><g class="r-drops" stroke="#e6f1fb" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="5 13">${rain}</g></g>
    <g fill="#8c97a3"><circle cx="268" cy="80" r="22"/><circle cx="300" cy="64" r="30"/><circle cx="336" cy="78" r="24"/><circle cx="360" cy="92" r="16"/><rect x="250" y="80" width="122" height="22" rx="11"/></g>
    <g fill="#a7b1bc"><circle cx="292" cy="58" r="20"/><circle cx="322" cy="62" r="16"/></g>
    <rect y="${CROWD[1]+4}" width="${RW}" height="${RH-CROWD[1]-4}" fill="#78b356"/><rect y="${CROWD[1]+4}" width="${RW}" height="3" fill="#5f9a42"/>
    <g transform="translate(${SUN[0]} ${SUN[1]})"><circle r="44" fill="url(#r-sun)" class="r-glow"/><g class="r-rays" stroke="#ffd23a" stroke-width="3" stroke-linecap="round">${rays}</g><circle r="19" fill="#ffe25a"/><circle r="19" fill="none" stroke="#ffb22e" stroke-width="2"/></g>
    ${crowd}<g id="r-arrows"></g>
    <g class="p-lbl r-lbl"><text x="${SUN[0]+18}" y="${SUN[1]+52}" text-anchor="middle">Soleil (dans ton dos)</text><text x="306" y="36" text-anchor="middle">Nuage de pluie</text><text x="${CROWD[0]}" y="${RH-12}" text-anchor="middle">Toi et la foule</text></g></svg>`}
/* flèches : une flèche blanche part du Soleil vers une goutte de l'arc ; arrivée dans la goutte, elle fait demi-tour (la lumière s'y réfléchit)
   et se sépare en sept flèches colorées, plus petites, qui repartent vers la foule, chacune avec un angle un peu différent */
const ARW='M-7 -2.4H2V-5L8 0L2 5V2.4H-7Z';let arrows=[],nextShot=0;
function bowPoint(r){for(;;){const a=.62+Math.random()*.42,x=BOWC[0]+Math.cos(a)*r,y=BOWC[1]-Math.sin(a)*r;if(x>RAINX[0]+6&&x<RAINX[1]-4&&y>RAINY[0]+18&&y<RAINY[1]-12)return[x,y]}}
function arrowEl(g,col,sc){const e=document.createElementNS(NS,'path');e.setAttribute('d',ARW);e.setAttribute('fill',col);e.setAttribute('stroke','rgba(30,45,70,.55)');e.setAttribute('stroke-width',sc<1?.5:.8);g.appendChild(e);return e}
const deg=(x0,y0,x1,y1)=>Math.atan2(y1-y0,x1-x0)*180/Math.PI;
function stepArrows(g,now){if(now>nextShot){nextShot=now+700;const D=bowPoint(BOWR),x0=SUN[0]+20,y0=SUN[1]+8;
    arrows.push({k:'go',e:arrowEl(g,'#ffffff',1.15),x0,y0,x1:D[0],y1:D[1],t0:now,dur:1700,sc:1.15,a:deg(x0,y0,D[0],D[1])})}
  const add=[];arrows=arrows.filter(o=>{const t=(now-o.t0)/o.dur;
    if(o.k=='turn'){/* demi-tour sur place : la flèche pivote vers la foule en prenant les couleurs */
      const u=Math.min(1,t),a=o.a0+(o.a1-o.a0)*u*u*(3-2*u);o.e.setAttribute('transform',`translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(1.15)`);
      if(u>.5)o.e.setAttribute('fill','url(#r-spec)');if(t<1)return true;o.e.remove();
      SPEC.forEach((c,k)=>{const tx=CROWD[0]+(k-3)*10,ty=CROWD[1]-14+(k-3)*1.2;add.push({k:'back',e:arrowEl(g,c,.78),x0:o.x,y0:o.y,x1:tx,y1:ty,t0:now,dur:1500,sc:.78,a:deg(o.x,o.y,tx,ty)})});return false}
    if(t>=1){if(o.k=='go'){add.push({k:'turn',e:o.e,x:o.x1,y:o.y1,a0:o.a,a1:o.a+((deg(o.x1,o.y1,CROWD[0],CROWD[1]-14)-o.a+540)%360-180),t0:now,dur:380});return false}o.e.remove();return false}
    const x=o.x0+(o.x1-o.x0)*t,y=o.y0+(o.y1-o.y0)*t,f=o.k=='go'?1:Math.min(1,(1-t)*6);o.e.setAttribute('transform',`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${o.a.toFixed(1)}) scale(${o.sc})`);o.e.setAttribute('opacity',f.toFixed(2));return true});
  arrows.push(...add)}

/* ---------- construction des murs ---------- */
const note=(k,x,y,w,r=0,cls='')=>`<div class="note ${cls}" data-note="${k}" role="button" tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><h3>${NOTES[k].t}</h3><p>${NOTES[k].s}</p></div>`;
/* chaque cadre : zone sur laquelle on zoome (repère du mur : x, y, largeur, hauteur) */
/* deux zooms possibles : z, le cadre seul (le texte s'ouvre d'un toucher) ; zt, le cadre et son texte ensemble (plus petit à l'écran sur téléphone).
   ZOOM_TEXT choisit la version utilisée */
const ZOOM_TEXT=false,
  EL=[{id:'newton',z:[14,16,200,290],zt:[12,16,214,612]},{id:'soleil',z:[228,438,324,189],zt:[228,440,324,236]},{id:'prisme',z:[306,26,498,312],zt:[308,28,494,416]},{id:'arc',z:[798,224,396,305],zt:[800,226,392,442]},
  {id:'air',z:[12,206,370,292],zt:[18,210,370,400]},{id:'souffle',z:[398,108,414,424],zt:[398,108,414,560]},{id:'bleu',z:[834,52,360,320],zt:[832,52,364,560]},
  {id:'tableau',z:[22,30,300,268],zt:[22,30,300,420]},{id:'couchant',z:[320,186,560,340],zt:[320,186,560,450]},{id:'mars',z:[872,384,190,165]},{id:'venus',z:[922,538,190,160]},{id:'uranus',z:[1050,354,134,200]}];
/* un seul fil rouge tendu, qui marque les étapes de l'enquête : Newton, le Soleil, le prisme, l'arc-en-ciel ; et les punaises qui tiennent les papiers */
const STEPS=[[190,200],[262,458],[332,320],[822,370]],
  PINS=[...STEPS.map(p=>[...p,'#d63a2f']),[113,34,'#d63a2f'],[116,317,'#2f6bd6'],[334,48,'#d63a2f'],[776,48,'#d63a2f'],[550,382,'#e0a020'],[520,458,'#d63a2f'],[996,246,'#d63a2f'],[996,533,'#2f9e5e'],[996,35,'#e0a020']];
function wall1(){const d='M'+STEPS.map(p=>p.join(' ')).join('L');
  return`<div class="board"></div>
  <div class="card-title card-title--c1" style="left:812px;top:30px;width:368px;transform:rotate(-.8deg)"><h2>${TITLES[0]}</h2><p>Suis le fil rouge. Touche un cadre pour t’en approcher, un texte pour le lire en grand.</p></div>
  <div class="el polaroid" data-el="0" role="button" tabindex="0" aria-label="Portrait d’Isaac Newton" style="left:28px;top:28px;width:170px;transform:rotate(-2deg)"><img src="img/newton.jpg" alt="Isaac Newton, levant le pouce, une pomme accrochée à l’arbre derrière lui" width="150" height="225"><span>Isaac Newton</span></div>
  ${note('newton',20,312,192,1.2)}
  <div class="el exp" data-el="2" role="button" tabindex="0" aria-label="Expérience du prisme" style="left:320px;top:40px;width:470px;height:284px">${prismSVG()}</div>
  ${note('prisme',330,378,440,-.4,'note--wide')}
  <div class="el painting" data-el="1" role="button" tabindex="0" aria-label="Tableau : le Soleil et d’autres étoiles" style="left:240px;top:450px;width:300px;height:165px">${starsSVG()}</div>
  ${note('soleil',240,622,300,0,'note--plaque')}
  <div class="el exp exp--sky" data-el="3" role="button" tabindex="0" aria-label="Formation d’un arc-en-ciel" style="left:812px;top:238px;width:368px;height:277px;transform:rotate(.6deg)">${rainbowSVG()}</div>
  ${note('arc',812,528,368,-.6)}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true"><defs><radialGradient id="pin-hl" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" stroke-linejoin="round" opacity=".7"/>
    ${PINS.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}

/* ---------- mur 2 : de quoi est fait l'air ? ---------- */
const MC={N:'#2F6BE0',O:'#E5413A',C:'#3b3f46'},
  mixh=(a,b,t)=>{const B=hex(b);return'#'+hex(a).map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')},
  /* atomes en boules éclairées : un dégradé par élément */
  atomDefs=Object.entries(MC).map(([k,c])=>`<radialGradient id="a-${k}" cx=".35" cy=".32" r=".7"><stop offset="0" stop-color="${mixh(c,'#ffffff',.6)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${mixh(c,'#000000',.45)}"/></radialGradient>`).join(''),
  atom=(x,y,r,k)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#a-${k})"/>`;
/* l'affiche : les trois molécules, leurs pourcentages, et une barre qui montre les proportions */
function airSVG(){const M=[['Diazote','N₂','80 %',atom(41,78,17,'N')+atom(67,78,17,'N'),MC.N],['Dioxygène','O₂','18 %',atom(152,78,16,'O')+atom(177,78,16,'O'),MC.O],
    ['Dioxyde de carbone','CO₂','2 %',atom(250,78,13,'O')+atom(292,78,13,'O')+atom(271,78,15,'C'),MC.C]],cx=[54,164,271];
  return`<svg viewBox="0 0 330 230" aria-label="Les trois principaux gaz de l’air"><defs>${atomDefs}</defs><rect width="330" height="230" fill="#fbf8ef"/>
    <text class="po-t" x="316" y="28" text-anchor="end">L’air que tu respires</text>
    ${M.map(([n,f,p,a,c],i)=>`${a}<text class="po-n" x="${cx[i]}" y="118" text-anchor="middle">${n}</text><text class="po-f" x="${cx[i]}" y="134" text-anchor="middle">${f}</text><text class="po-p" x="${cx[i]}" y="162" text-anchor="middle" fill="${c}">${p}</text>`).join('')}
    <rect x="20" y="180" width="232" height="16" fill="${MC.N}"/><rect x="252" y="180" width="52.2" height="16" fill="${MC.O}"/><rect x="304.2" y="180" width="5.8" height="16" fill="${MC.C}"/>
    <rect x="20" y="180" width="290" height="16" fill="none" stroke="#2e3a46" stroke-width="1"/>
    <text class="po-s" x="20" y="214">Sur 100 molécules d’air : 80 N₂, 18 O₂, 2 CO₂</text></svg>`}
/* tableau périodique coloré par familles, posé de biais sur le coin de l'affiche ; l'azote, l'oxygène et le carbone sont mis en valeur */
function mendelSVG(){const C=8,X0=4,Y0=14;let s='';
  const col=(r,g)=>{if(r==1)return g==1?'#9be7ff':'#ce93d8';if(g==1)return'#ff9e80';if(g==2)return'#ffd180';if(g==18)return'#ce93d8';if(g==17)return'#80deea';if(g<=12)return'#b39ddb';
      const d=g-r;return d>=12?'#fff59d':d==11||(d==10&&(r==4||r==5))?'#c5e1a5':'#a5d6a7'},
    has=(r,g)=>r==1?g==1||g==18:r<=3?g<=2||g>=13:true,HL={'2,14':'C','2,15':'N','2,16':'O'};
  for(let r=1;r<=7;r++)for(let g=1;g<=18;g++){if(!has(r,g))continue;const x=X0+(g-1)*C,y=Y0+(r-1)*C,h=HL[r+','+g];
    s+=`<rect x="${x}" y="${y}" width="${C-1}" height="${C-1}" fill="${col(r,g)}"${h?' stroke="#1e2a36" stroke-width="1"':''}/>`;if(h)s+=`<text x="${x+3.5}" y="${y+5.6}" text-anchor="middle" class="md-h">${h}</text>`}
  for(let r=0;r<2;r++)for(let g=3;g<=17;g++)s+=`<rect x="${X0+(g-1)*C}" y="${Y0+7*C+4+r*C}" width="${C-1}" height="${C-1}" fill="${r?'#ffab91':'#f48fb1'}"/>`;
  return`<svg class="mendel" viewBox="0 0 152 94" aria-hidden="true"><rect width="152" height="94" fill="#fdfcf7"/><text x="76" y="9.5" text-anchor="middle" class="md-t">Tableau périodique des éléments</text>${s}</svg>`}

/* l'humain vu en coupe de profil : à chaque inspiration, 100 molécules entrent par la bouche jusqu'aux poumons (80 N₂, 18 O₂, 2 CO₂) ;
   dans les poumons, 5 O₂ deviennent CO₂, puis tout ressort à l'expiration. Un cycle dure 7 s */
const BW=390,BH=400,AIRW=[[232,135],[212,135],[194,135],[180,139],[171,153],[172,176],[174,204],[175,230],[176,250]],LUNG=[168,312,56,62],
  BT=7,INH=3.7,KCOL=[MC.N,MC.O,MC.C],
  ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},
  rndIn=(x0,x1)=>x0+Math.random()*(x1-x0),
  outPt=()=>[rndIn(262,378),rndIn(72,212)],
  lungPt=()=>{const a=Math.random()*6.283,r=Math.sqrt(Math.random());return[LUNG[0]+Math.cos(a)*r*LUNG[2],LUNG[1]+Math.sin(a)*r*LUNG[3]]};
function bodySVG(){return`<svg viewBox="0 0 ${BW} ${BH}" class="body-svg" aria-label="Coupe d’un humain qui respire : les molécules d’air entrent et sortent des poumons">
  <defs><linearGradient id="b-bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4efe6"/><stop offset=".55" stop-color="#eaf3fb"/><stop offset="1" stop-color="#dcecf9"/></linearGradient>
    <radialGradient id="b-lungG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffd3d6"/><stop offset=".6" stop-color="#f2a3aa"/><stop offset="1" stop-color="#d9727e"/></radialGradient>
    </defs>
  <rect width="${BW}" height="${BH}" fill="url(#b-bg)"/>
  <path d="M150 26C196 26 214 56 212 84L223 106Q226 114 214 116L214 127Q220 129 219 132L205 133L205 137L219 138Q220 142 213 146Q215 160 206 166Q190 172 182 176L184 196Q230 204 262 232L272 ${BH}H58L64 250Q68 205 118 196L120 172Q88 150 88 98C88 52 112 26 150 26Z" fill="#fbf6f2" stroke="#cdb3a6" stroke-width="2"/>
  <ellipse cx="168" cy="304" rx="94" ry="104" fill="#f3e0d8" opacity=".8"/>
  <path d="M214 135Q196 133 184 137Q171 143 170 160L172 176" fill="none" stroke="#d9727e" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M214 135Q196 133 184 137Q171 143 170 160L172 176" fill="none" stroke="#f6b9bc" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="b-lung"><path d="M170 210C118 212 88 292 92 374Q106 396 166 390Q228 396 242 372C248 300 218 212 170 210Z" fill="url(#b-lungG)" stroke="#c45f6b" stroke-width="2"/>
    <path d="M176 250L150 282L128 318L114 352M150 282L158 336M176 250L194 280L210 318L218 352M194 280L188 338M128 318L140 360M210 318L200 362" fill="none" stroke="#c45f6b" stroke-width="3.2" stroke-linecap="round" opacity=".75"/></g>
  <path d="M172 176L176 250" stroke="#c45f6b" stroke-width="13" stroke-linecap="round"/><path d="M172 176L176 250" stroke="#f6b9bc" stroke-width="8" stroke-linecap="round" stroke-dasharray="2.5 3.5"/>
  <path id="b-dia" d="M86 396Q166 352 248 396" fill="none" stroke="#b5584a" stroke-width="4" stroke-linecap="round"/>
  <g id="b-dots"></g>
  <g class="b-lbl"><text x="248" y="${BH-12}" text-anchor="end">Poumon</text><text x="226" y="160">Bouche</text><text x="160" y="222" text-anchor="end">Trachée</text></g>
  <g class="b-leg">${[['N₂ · diazote',MC.N],['O₂ · dioxygène',MC.O],['CO₂ · dioxyde de carbone',MC.C]].map(([t,c],i)=>`<circle cx="256" cy="${20+i*16}" r="4" fill="${c}"/><text x="265" y="${24+i*16}">${t}</text>`).join('')}</g>
  <g class="b-count"><text id="b-phase" x="276" y="248">Inspiration</text><text x="276" y="266" class="b-small">sur 100 molécules :</text>
    ${['N₂','O₂','CO₂'].map((f,i)=>`<circle cx="281" cy="${283+i*18}" r="4.5" fill="${KCOL[i]}"/><text x="291" y="${288+i*18}">${f} : <tspan id="b-n${i}"></tspan></text>`).join('')}</g></svg>`}
let DOTS=[],bCycle=-1;
function buildDots(svg){const g=svg.querySelector('#b-dots'),kinds=[...Array(100)].map((_,i)=>i<80?0:i<98?1:2).sort(()=>Math.random()-.5);
  DOTS=kinds.map(k=>{const e=document.createElementNS(NS,'circle');e.setAttribute('r',3.1);e.setAttribute('stroke','rgba(255,255,255,.75)');e.setAttribute('stroke-width',.7);g.appendChild(e);
    return{k,e,d:Math.random()*.9,j:[rndIn(-2.5,2.5),rndIn(-2.5,2.5)]}})}
/* position le long du trajet O → nez → trachée → poumon (s de 0 à 1, à vitesse constante) */
function along(P,s){let L=0;const seg=[];for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);seg.push(l);L+=l}
  let t=s*L;for(let i=0;i<seg.length;i++){if(t<=seg[i]||i==seg.length-1){const u=seg[i]?Math.min(1,t/seg[i]):0;return[P[i][0]+(P[i+1][0]-P[i][0])*u,P[i][1]+(P[i+1][1]-P[i][1])*u]}t-=seg[i]}}
function stepBreath(now){const svg=box.querySelector('.body-svg');if(!svg||!DOTS.length)return;const T=now/1000,cyc=Math.floor(T/BT),t=T-cyc*BT;
  if(cyc!=bCycle){bCycle=cyc;/* nouvel air : nouvelles positions, et 5 des 18 O₂ seront transformés */
    const o2=DOTS.filter(o=>o.k==1).sort(()=>Math.random()-.5);DOTS.forEach(o=>{o.O=outPt();o.O2=outPt();o.L=lungPt();o.conv=0});o2.slice(0,5).forEach(o=>o.conv=1)}
  const b=t<3.2?ease(t/3.0):t<INH?1:ease(1-(t-INH)/2.9),ex=t>=3.45;
  svg.querySelector('#b-lung').setAttribute('transform',`translate(170 240) scale(${(1+.07*b).toFixed(4)}) translate(-170 -240)`);svg.querySelector('#b-dia').setAttribute('transform',`translate(0 ${(8*b).toFixed(2)})`);
  const fade=Math.min(1,t/.3,(BT-t)/.45);
  DOTS.forEach(o=>{const air=AIRW.map(([x,y])=>[x+o.j[0],y+o.j[1]]),p=t<INH?along([o.O,...air,o.L],ease((t-o.d)/2.1)):along([o.L,...air.slice().reverse(),o.O2],ease((t-INH-o.d)/1.9)),
      c=o.conv?mixh(MC.O,MC.C,ease((t-3.0)/.5)):KCOL[o.k];
    o.e.setAttribute('cx',p[0].toFixed(1));o.e.setAttribute('cy',p[1].toFixed(1));o.e.setAttribute('fill',c);o.e.setAttribute('opacity',fade.toFixed(2))});
  const ph=svg.querySelector('#b-phase');if(ph.dataset.ex!=String(ex)){ph.dataset.ex=ex;ph.textContent=ex?'Expiration':'Inspiration';
    [80,ex?13:18,ex?7:2].forEach((n,i)=>{const e=svg.querySelector('#b-n'+i);e.textContent=n;e.classList.toggle('chg',ex&&i>0)})}}

/* la diffusion par l'air : des flèches de toutes les couleurs partent du Soleil en ligne droite, sur un halo blanc qui jaunit en traversant l'air.
   Le bleu, l'indigo et le violet se perdent dans la couche d'air : ils rebondissent de molécule en molécule, puis en ressortent tous du côté de l'œil,
   dans toutes les directions. L'œil monte et descend le long du bord droit : hors du rayon, il voit le bleu du ciel ; dans l'axe du Soleil, du jaune, presque blanc au centre */
const SW=340,SH=300,SUN2=[28,150],LAY=[112,250],BEAM=[136,164],EYX=312;let MOLS=[];
function skySVG(){MOLS=[];let mol='';for(let i=0;i<70;i++){const x=rndIn(LAY[0]+6,LAY[1]-6),y=rndIn(28,292),a=Math.random()*180,k=Math.random()<.8?'N':'O';MOLS.push([x,y]);
    mol+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})"><circle cx="-2" r="2.6" fill="url(#a-${k})"/><circle cx="2" r="2.6" fill="url(#a-${k})"/></g>`}
  const f=x=>(x/SW).toFixed(3),halo=(dy,o,fl)=>`<rect x="${SUN2[0]}" y="${BEAM[0]-dy}" width="${SW-SUN2[0]}" height="${BEAM[1]-BEAM[0]+2*dy}" fill="url(#s2-halo)" opacity="${o}"${fl?' filter="url(#s2-blur)"':''}/>`;
  return`<svg viewBox="0 0 ${SW} ${SH}" class="sky-svg" aria-label="La lumière du Soleil traverse l’air : monte ou descends l’œil">
  <defs><radialGradient id="s2-sun"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#fffbe8"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></radialGradient>
    <linearGradient id="s2-air" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fb0ff" stop-opacity="0"/><stop offset=".12" stop-color="#7fb0ff" stop-opacity=".16"/><stop offset=".88" stop-color="#7fb0ff" stop-opacity=".16"/><stop offset="1" stop-color="#7fb0ff" stop-opacity="0"/></linearGradient>
    <linearGradient id="s2-halo" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${SW}" y2="0"><stop offset="${f(LAY[0])}" stop-color="#ffffff"/><stop offset="${f(LAY[1])}" stop-color="#ffe066"/><stop offset="1" stop-color="#ffd23a"/></linearGradient>
    <filter id="s2-blur" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="7"/></filter></defs>
  <rect width="${SW}" height="${SH}" fill="#0a0f26"/>
  <rect x="${LAY[0]-10}" y="0" width="${LAY[1]-LAY[0]+20}" height="${SH}" fill="url(#s2-air)"/>
  ${halo(14,.55,1)}${halo(0,.28,0)}${mol}
  <circle cx="${SUN2[0]}" cy="${SUN2[1]}" r="44" fill="url(#s2-sun)" class="p-bulb"/><circle cx="${SUN2[0]}" cy="${SUN2[1]}" r="13" fill="#fff"/>
  <path d="M${EYX} 14V${SH-14}" stroke="#fff" stroke-opacity=".2" stroke-dasharray="3 5"/>
  <g id="s2-arrows"></g>
  <g class="p-lbl"><text x="${SUN2[0]}" y="${SUN2[1]+34}" text-anchor="middle">Soleil</text><text x="${(LAY[0]+LAY[1])/2}" y="18" text-anchor="middle">Air : diazote et dioxygène</text></g>
  <g class="eye" id="s2-eye" tabindex="0" role="slider" aria-label="Œil à monter ou descendre">
    <g class="bubble"><path class="b-tail"/><rect class="b-box" rx="10"/><path class="b-tail b-tail2"/><rect class="b-view" rx="4" height="20"/><text class="b-txt" text-anchor="middle"></text></g>
    <ellipse cx="0" cy="0" rx="17" ry="10" fill="#fff" stroke="#2b2b2b" stroke-width="1.6"/><circle cx="-2" cy="0" r="6.4" fill="#5b8fd6"/><circle cx="-2" cy="0" r="3" fill="#111"/><circle cx="-4" cy="-2" r="1.4" fill="#fff"/>
    <path d="M-17 0Q0-16 17 0" fill="none" stroke="#2b2b2b" stroke-width="2"/><circle r="26" fill="transparent"/></g></svg>`}
/* bulle de BD au-dessus de l'œil (en dessous s'il est trop haut), sa pointe tournée vers lui */
function bubbleAt(g,x,y,W0){const up=y>95,bw=172,bh=56,bx=Math.max(8-x,Math.min(W0-8-x-bw,-bw/2)),by=up?-bh-20:22,q=s=>g.querySelector(s),set=(e,a)=>{for(const k in a)e.setAttribute(k,a[k])};
  set(g,{transform:`translate(${x.toFixed(1)} ${y.toFixed(1)})`});g.dataset.x=x;g.dataset.y=y;set(q('.b-box'),{x:bx,y:by,width:bw,height:bh});
  const tail=up?`M-8 ${by+bh-1}L0 -13L8 ${by+bh-1}Z`:`M-8 ${by+1}L0 13L8 ${by+1}Z`;g.querySelectorAll('.b-tail').forEach(e=>e.setAttribute('d',tail));
  set(q('.b-view'),{x:bx+10,y:by+8,width:bw-20});set(q('.b-txt'),{x:bx+bw/2,y:by+bh-12})}
/* l'œil glisse sur l'axe vertical du bord droit ; ce qu'il voit dépend de son écart avec l'axe du Soleil */
/* couleurs vues selon la proximité de l'axe du Soleil (0 : loin, 1 : en plein dans l'axe) : bleu du ciel, bleu pâle, jaune, presque blanc */
const SKYC=[[0,'#5b9cf0'],[.2,'#cfe3ff'],[.45,'#ffe066'],[.8,'#fff3b8'],[1,'#fffdf2']];
function placeSky(svg,x,y){y=Math.max(24,Math.min(SH-24,y));const g=svg.querySelector('#s2-eye'),t=Math.max(0,1-Math.abs(y-SUN2[1])/55);bubbleAt(g,EYX,y,SW);
  g.querySelector('.b-view').setAttribute('fill',(i=>mixh(SKYC[i][1],SKYC[i+1][1],ease((t-SKYC[i][0])/(SKYC[i+1][0]-SKYC[i][0]))))(Math.max(0,SKYC.findIndex(c=>c[0]>=t)-1)));
  g.querySelector('.b-txt').textContent=t<.12?'Le bleu du ciel':t<.85?'Le Soleil, jaune':'Face au Soleil : presque blanc'}
let sArrows=[],sLast=0,sSpawn=0;
/* prochain rebond d'une flèche perdue dans l'air : une molécule voisine, un peu plus loin vers la droite ; après quelques rebonds, elle ressort vers l'œil */
function aim(o){if(++o.n>o.max||!(o.tg=(c=>c.length?c[Math.random()*c.length|0]:null)(MOLS.filter(([mx,my])=>{const d=Math.hypot(mx-o.x,my-o.y);return d>16&&d<62&&mx>o.x-12})))){
  o.tg=null;o.out=1;const ty=rndIn(10,SH-10),dx=SW+20-o.x,dy=ty-o.y,d=Math.hypot(dx,dy);o.vx=o.v*dx/d;o.vy=o.v*dy/d}}
function stepSky(now){const svg=box.querySelector('.sky-svg');if(!svg)return;const dt=Math.min(50,now-(sLast||now));sLast=now;const g=svg.querySelector('#s2-arrows');
  for(sSpawn+=dt;sSpawn>33;sSpawn-=33){const k=Math.random()*7|0,e=document.createElementNS(NS,'path');e.setAttribute('d',ARW);e.setAttribute('fill',SPEC[k]);g.appendChild(e);
    sArrows.push({k,e,x:SUN2[0]+14,y:rndIn(BEAM[0],BEAM[1]),v:.1,vx:.1,vy:0,lost:k>=4&&Math.random()<.85,n:0,max:2+(Math.random()*4|0),tg:null,out:0})}
  sArrows=sArrows.filter(o=>{if(o.lost&&!o.out&&!o.tg&&o.x>=LAY[0]+4)aim(o);
    if(o.tg){const dx=o.tg[0]-o.x,dy=o.tg[1]-o.y,d=Math.hypot(dx,dy);if(d<=o.v*dt){o.x=o.tg[0];o.y=o.tg[1];aim(o)}else{o.vx=o.v*dx/d;o.vy=o.v*dy/d}}
    o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.x<-10||o.x>SW+10||o.y<-10||o.y>SH+10){o.e.remove();return false}
    o.e.setAttribute('transform',`translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${(Math.atan2(o.vy,o.vx)*57.3).toFixed(0)}) scale(.55)`);return true})}

/* disposition du mur 2 : un seul fil rouge de l'affiche à l'humain, puis à la diffusion */
const STEPS2=[[352,264],[420,126],[850,70]],
  PINS2=[...STEPS2.map(p=>[...p,'#d63a2f']),[205,504,'#2f6bd6'],[205,40,'#e0a020'],[605,538,'#e0a020'],[1014,380,'#2f9e5e']];
function wall2(){const d='M'+STEPS2.map(p=>p.join(' ')).join('L');
  return`<div class="board"></div>
  <div class="el poster" data-el="4" role="button" tabindex="0" aria-label="Affiche : les gaz de l’air" style="left:40px;top:256px;width:330px;height:230px">${airSVG()}${mendelSVG()}</div>
  ${note('air',40,498,330,.8)}
  <div class="card-title card-title--c2" style="left:40px;top:34px;width:330px;transform:rotate(-1deg)"><h2>${TITLES[1]}</h2><p>Suis le fil rouge.</p></div>
  <div class="el exp exp--body" data-el="5" role="button" tabindex="0" aria-label="Un humain qui respire, vu en coupe" style="left:410px;top:120px;width:390px;height:400px">${bodySVG()}</div>
  ${note('souffle',410,532,390,-.5)}
  <div class="el exp" data-el="6" role="button" tabindex="0" aria-label="La lumière du Soleil traverse l’air" style="left:846px;top:64px;width:336px;height:296px">${skySVG()}</div>
  ${note('bleu',846,374,336,.5)}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true">
    <path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" stroke-linejoin="round" opacity=".7"/>
    ${PINS2.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}

/* ---------- mur 3 : et pour un coucher de Soleil alors ? ---------- */
const MK="'Segoe Print','Bradley Hand','Comic Sans MS','Chalkboard SE',cursive",
  smst=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)},
  specRGB=u=>{const x=Math.max(0,Math.min(1,u))*(SPEC.length-1),i=Math.min(SPEC.length-2,x|0),t=x-i,a=hex(SPEC[i]),b=hex(SPEC[i+1]);return a.map((v,k)=>v+(b[k]-v)*t)},
  /* couleur d'une longueur de lumière, du violet (400) au rouge (700) */
  lamRGB=l=>specRGB(1-(l-400)/300),
  /* spectre en barre, de gauche (violet) à droite (rouge) ; f(u) donne l'éclat de chaque couleur, de 0 (éteinte) à 1 */
  specBar=(f,w,h,n=48,cls='')=>`<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${[...Array(n)].map((_,i)=>{const u=(i+.5)/n,c=lamRGB(400+300*u),k=Math.max(0,Math.min(1,f(u)));
    return`<rect x="${(i*w/n).toFixed(2)}" width="${(w/n+.3).toFixed(2)}" height="${h}" fill="rgb(${c.map(v=>Math.round(v*k)).join()})"/>`}).join('')}</svg>`;

/* élément 1 : schéma au feutre sur un tableau blanc. La Terre, son atmosphère (très exagérée), l'observateur ;
   le Soleil au zénith et à l'horizon en même temps, et le trajet de leur lumière dans l'air */
function veledaSVG(){const E=[132,178],RE=60,RA=92,H=[132,111],ya=E[1]-RA,xa=E[0]+Math.sqrt(RA*RA-(E[1]-H[1])**2),
    sun=(x,y)=>`<circle cx="${x}" cy="${y}" r="9"/>${[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return`<path d="M${(x+Math.cos(a)*12).toFixed(1)} ${(y+Math.sin(a)*12).toFixed(1)}L${(x+Math.cos(a)*16).toFixed(1)} ${(y+Math.sin(a)*16).toFixed(1)}"/>`}).join('')}`;
  return`<svg viewBox="0 0 264 220" aria-label="Schéma : la lumière du Soleil traverse peu d’air au zénith, beaucoup à l’horizon">
  <defs><marker id="v-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1L9 5L0 9" fill="none" stroke="#1f2a36" stroke-width="2"/></marker></defs>
  <rect width="264" height="220" fill="#fdfdfb"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="${E[0]}" cy="${E[1]}" r="${RA}" stroke="#1e5fd6" stroke-width="1.6" stroke-dasharray="5 4"/>
    <circle cx="${E[0]}" cy="${E[1]}" r="${RE}" stroke="#2a9d4b" stroke-width="2.4"/>
    <path d="M${E[0]} ${ya}V${H[1]-9}" stroke="#1e5fd6" stroke-width="6" stroke-opacity=".45"/>
    <path d="M${xa.toFixed(1)} ${H[1]}H${H[0]+7}" stroke="#d6332a" stroke-width="6" stroke-opacity=".45"/>
    <path d="M${E[0]} 36V${H[1]-10}" stroke="#1f2a36" stroke-width="1.6" marker-end="url(#v-arr)"/>
    <path d="M232 ${H[1]}H${H[0]+8}" stroke="#1f2a36" stroke-width="1.6" marker-end="url(#v-arr)"/>
    <g stroke="#f08a1e" stroke-width="2">${sun(E[0],22)}${sun(246,H[1])}</g>
    <g stroke="#1f2a36" stroke-width="1.5"><circle cx="${H[0]}" cy="${H[1]}" r="2.6"/><path d="M${H[0]} ${H[1]+3}V${E[1]-RE-3}M${H[0]-3} ${H[1]+5}H${H[0]+3}M${H[0]} ${E[1]-RE-3}l-2.5 3M${H[0]} ${E[1]-RE-3}l2.5 3"/></g></g>
  <g class="v-txt"><text x="146" y="19">Soleil au zénith</text><text x="258" y="${H[1]-20}" text-anchor="end">Soleil à l’horizon</text>
    <text x="138" y="97" fill="#1e5fd6">peu d’air</text><text x="${(xa+H[0])/2+4}" y="${H[1]+14}" text-anchor="middle" fill="#d6332a">beaucoup d’air</text>
    <text x="${H[0]-6}" y="${H[1]-3}" text-anchor="end">toi</text><text x="${E[0]}" y="200" text-anchor="middle" fill="#2a9d4b">Terre</text>
    <text x="6" y="54" fill="#1e5fd6">atmosphère</text><text x="6" y="65" fill="#1e5fd6" class="v-small">(très exagérée)</text></g>
  <path d="M36 70L${(E[0]-RA*.71).toFixed(0)} ${(E[1]-RA*.71-2).toFixed(0)}" stroke="#1e5fd6" stroke-width="1.2" fill="none"/></svg>`}

/* élément 2 : une portion de la Terre ; le Soleil glisse sur un arc parallèle au sol. Couleurs du ciel calculées par le modèle d'atmosphère
   pour chaque hauteur du Soleil (8 couleurs du haut vers l'horizon, 3 pour le halo autour du Soleil) ; spectre de la lumière reçue calculé en direct */
const CK=[[90,'5f86ce3f76ce437fd65091e26aaaea8ec1e7b2cedac5d0d1','5875af5875af5875af'],[60,'3c70c63871c83f7dd44e91e269abeb8fc3e8b4d0dcc7d3d2','5f7eb85c7cb75074b5'],[40,'3166ba326bc03b7ad04d91e069acea90c5e7b6d2dac9d4d0','6d8dc46689c3507bc0'],[25,'2a60af2e67b8397aca4c91db6aade591c5e0b7d2d1cbd4c5','83a3cf789dcd5c8dcb'],[15,'275da32c66ae3a7ac24d92d26cadda94c4d3bad0c0ced1b0','a0bacf94b3ce74a4cd'],[10,'275c9b2d67a63b7ab94f92c86eadce96c3c4bdcdabd1cd97','bac9c3adc3c38cb4c3'],[6,'295c8f30679a3f7aab5491b873abbb9cbfaac3c684d6c365','dad49fcfcf9fafc1a1'],[4,'2c5b873466914379a05990ac79a8aba2ba93c8bf5cdab823','f1d765e8d168cac36f'],[2,'335a7c3b64854b7793628c9b82a295abb16fd0ae00dfa100','ffcf00ffc800efb800'],[1,'37587640627f50748b678892889d88b0a85bd3a000df8e00','ffc000ffb700ffa400'],[0.3,'3a5673435f7b5471876b848c8b9780b3a04ed39400da7e00','ffa900ffa000ff8f00']].map(([h,s,g])=>[h,...[s,g].map(x=>x.match(/.{6}/g).map(c=>[0,2,4].map(i=>parseInt(c.substr(i,2),16))))]),
  CW2=540,CH2=320,CC=[270,470],RT=230,RAT=300,RSUN=325,OBS=[270,240],HEAD=[270,229],
  sunPos=f=>[CC[0]+RSUN*Math.sin(f),CC[1]-RSUN*Math.cos(f)],
  elevOf=f=>{const s=sunPos(f);return Math.atan2(OBS[1]-s[1],Math.abs(s[0]-OBS[0]))*180/Math.PI},
  /* le Soleil s'arrête quand il touche l'horizon */
  PHM=(()=>{let a=0,b=1.5;for(let i=0;i<40;i++){const m=(a+b)/2;elevOf(m)>.3?a=m:b=m}return a})(),
  /* masse d'air traversée (1 au zénith, environ 38 à l'horizon) et épaisseur optique de l'air (molécules + poussières) */
  airmass=h=>1/(Math.sin(h*Math.PI/180)+.50572*Math.pow(h+6.07995,-1.6364)),
  tau=l=>{const u=l/1000;return .0088*Math.pow(u,-4.05)+.1*Math.pow(u/.55,-1.3)},
  /* part de chaque couleur qui arrive, par rapport au rouge, le moins arrêté */
  transm=(l,m)=>Math.min(1,Math.exp(-(tau(l)-tau(700))*m)),
  rgbS=c=>`rgb(${c.map(v=>Math.round(Math.max(0,Math.min(255,v)))).join()})`,
  CEV=[0,.3,.5,.64,.76,.86,.94,1];
function sunsetSVG(){const arc=[...Array(41)].map((_,i)=>sunPos(-PHM+2*PHM*i/40)),trees=[-.34,-.22,.17,.29,.41].map(a=>{const x=CC[0]+RT*Math.sin(a),y=CC[1]-RT*Math.cos(a);
    return`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a*57.3).toFixed(1)})"><rect x="-1.6" y="-12" width="3.2" height="12" fill="#5b4330"/><circle cy="-17" r="8" fill="#3f7d33"/><circle cx="-2.5" cy="-19.5" r="3.5" fill="#5b9a44"/></g>`}).join('');
  return`<svg viewBox="0 0 ${CW2} ${CH2}" class="sunset-svg" aria-label="Une portion de la Terre : déplace le Soleil et regarde le ciel changer">
  <defs><linearGradient id="c-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${OBS[1]}">${CEV.map(o=>`<stop offset="${o}"/>`).join('')}</linearGradient>
    <radialGradient id="c-glow" gradientUnits="userSpaceOnUse" r="230">${[[0,.95],[.07,.75],[.25,.4],[.6,.1],[1,0]].map(([o,a])=>`<stop offset="${o}" stop-opacity="${a}"/>`).join('')}</radialGradient>
    <radialGradient id="c-halo"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="c-ground" gradientUnits="userSpaceOnUse" cx="${CC[0]}" cy="${CC[1]}" r="${RT}"><stop offset=".8" stop-color="#3f6e2c"/><stop offset="1" stop-color="#6aa548"/></radialGradient></defs>
  <rect width="${CW2}" height="${CH2}" fill="url(#c-sky)"/><rect width="${CW2}" height="${CH2}" fill="url(#c-glow)" id="c-glowr"/>
  <circle cx="${CC[0]}" cy="${CC[1]}" r="${RAT}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-dasharray="4 6"/>
  <path d="M${arc.map(p=>p.map(v=>v.toFixed(1)).join(' ')).join('L')}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 7" stroke-linecap="round"/>
  <path id="c-rayair" fill="none" stroke-width="7" stroke-linecap="round" stroke-opacity=".45"/><path id="c-ray" fill="none" stroke-width="2"/>
  <circle cx="${CC[0]}" cy="${CC[1]}" r="${RT}" fill="url(#c-ground)"/>${trees}
  <g stroke="#1f2a36" stroke-width="1.8" stroke-linecap="round" fill="none"><circle cx="${HEAD[0]}" cy="${HEAD[1]}" r="3.4" fill="#f4d7b8"/><path d="M270 233V236M266 236H274M270 236L267 ${OBS[1]}M270 236L273 ${OBS[1]}"/></g>
  <circle cx="${CC[0]}" cy="${CC[1]}" r="${RT+1}" fill="#06101c" id="c-dark" opacity="0"/>
  <g class="c-lbl"><text x="22" y="262">haut de l’atmosphère</text><text x="${HEAD[0]+9}" y="${HEAD[1]+2}">toi</text></g>
  <g class="eye" id="c-sun" tabindex="0" role="slider" aria-label="Soleil à déplacer le long de son arc"><circle r="40" fill="url(#c-halo)" id="c-sunh"/><circle r="13" id="c-disc"/><circle r="30" fill="transparent"/></g>
  <g class="c-panel"><rect x="10" y="10" width="206" height="84" rx="10" fill="rgba(10,14,30,.62)"/><text x="20" y="28" class="c-t">Lumière du Soleil reçue</text>
    <g transform="translate(20 36)"><rect width="186" height="20" rx="3" fill="#000"/><g id="c-spec">${[...Array(62)].map((_,i)=>`<rect x="${(i*3).toFixed(0)}" width="3.3" height="20"/>`).join('')}</g></g>
    <text x="20" y="69" class="c-s">violet</text><text x="206" y="69" class="c-s" text-anchor="end">rouge</text><text x="20" y="86" class="c-i" id="c-info"></text></g></svg>`}
function placeSun(svg,x,y){const f=Math.max(-PHM,Math.min(PHM,Math.atan2(x-CC[0],CC[1]-y))),S=sunPos(f),h=elevOf(f),m=airmass(h),q=s=>svg.querySelector(s);
  const g=q('#c-sun');g.setAttribute('transform',`translate(${S[0].toFixed(1)} ${S[1].toFixed(1)})`);g.dataset.x=S[0];g.dataset.y=S[1];
  /* spectre reçu et couleur du disque solaire */
  const L=[...Array(62)].map((_,i)=>400+300*(i+.5)/62),T=L.map(l=>transm(l,m)),W=[0,1,2].map(k=>L.reduce((s,l)=>s+lamRGB(l)[k],0)),
    sc=[0,1,2].map(k=>L.reduce((s,l,i)=>s+lamRGB(l)[k]*T[i],0)/W[k]),mx=Math.max(...sc),fl=.08+.17*smst(0,20,h),disc=sc.map(v=>255*(fl+(1-fl)*v/mx));
  q('#c-spec').querySelectorAll('rect').forEach((r,i)=>r.setAttribute('fill',rgbS(lamRGB(L[i]).map(v=>v*Math.pow(T[i],.6)))));
  q('#c-disc').setAttribute('fill',rgbS(disc.map(v=>Math.min(255,v*1.08))));q('#c-sunh').setAttribute('transform',`scale(${(1+.6*smst(12,1,h)).toFixed(3)})`);
  /* ciel : interpolation entre les hauteurs calculées */
  let i=0;while(i<CK.length-2&&CK[i+1][0]>h)i++;const[h0,s0,g0]=CK[i],[h1,s1,g1]=CK[i+1],t=Math.max(0,Math.min(1,(h0-h)/(h0-h1))),mixa=(a,b)=>a.map((v,k)=>v+(b[k]-v)*t);
  q('#c-sky').querySelectorAll('stop').forEach((e,j)=>e.setAttribute('stop-color',rgbS(mixa(s0[j],s1[j]))));
  const gl=q('#c-glow');gl.setAttribute('cx',S[0].toFixed(1));gl.setAttribute('cy',S[1].toFixed(1));/* halo autour du Soleil : presque blanc quand il est haut */
  const wh=.8*smst(8,35,h);gl.querySelectorAll('stop').forEach((e,j)=>e.setAttribute('stop-color',rgbS(mixa(g0[Math.min(j,2)],g1[Math.min(j,2)]).map(v=>v+(255-v)*wh))));
  q('#c-dark').setAttribute('opacity',(.42*(1-smst(0,25,h))).toFixed(3));
  /* trajet de la lumière : du Soleil jusqu'à toi, et la partie qui traverse l'air */
  const d=[S[0]-HEAD[0],S[1]-HEAD[1]],p=[HEAD[0]-CC[0],HEAD[1]-CC[1]],A=d[0]*d[0]+d[1]*d[1],B=2*(p[0]*d[0]+p[1]*d[1]),C=p[0]*p[0]+p[1]*p[1]-RAT*RAT,
    u=(-B+Math.sqrt(B*B-4*A*C))/(2*A),E=[HEAD[0]+d[0]*u,HEAD[1]+d[1]*u],col=rgbS(disc);
  q('#c-ray').setAttribute('d',`M${S[0].toFixed(1)} ${S[1].toFixed(1)}L${HEAD[0]} ${HEAD[1]}`);q('#c-ray').setAttribute('stroke',col);
  q('#c-rayair').setAttribute('d',`M${E[0].toFixed(1)} ${E[1].toFixed(1)}L${HEAD[0]} ${HEAD[1]}`);q('#c-rayair').setAttribute('stroke',col);
  q('#c-info').textContent=`Hauteur : ${Math.round(h)}° · air traversé : × ${m<10?m.toFixed(1).replace('.',','):Math.round(m)}`}

/* élément 3 : les autres planètes ; composition approchée de l'atmosphère et lumière qui la traverse */
const PLAN=[['Mars','95 % CO₂ · 3 % N₂ · 2 % argon','+ fines poussières orangées',u=>.28+.72*smst(.2,.75,u),'Ciel caramel le jour, coucher de soleil bleu'],
  ['Vénus','96 % CO₂ · 3,5 % N₂','+ épais nuages d’acide sulfurique',u=>.05+.9*smst(.42,.86,u),'Ciel jaune-orangé et sombre'],
  ['Uranus','83 % H₂ · 15 % hélium · 2 % méthane','pas de sol : une boule de gaz',u=>1-.9*smst(.55,.92,u),'Ciel bleu-vert']];
Object.assign(NOTES,{
  horizon:{t:'Le Soleil à l’horizon',s:'Soleil haut : sa lumière traverse peu d’air. Soleil à l’horizon : elle traverse l’air en biais, sur une distance environ 40 fois plus longue !',
    l:`<p>L’atmosphère est une couche d’air très fine autour de la Terre : si la Terre était un ballon de 1 m, l’air ferait moins d’1 cm d’épaisseur. Sur le schéma, elle est très exagérée pour qu’on la voie.</p>
      <p>Quand le Soleil est au <b>zénith</b> (juste au-dessus de ta tête), sa lumière traverse l’atmosphère par le chemin le plus court.</p>
      <p>Quand il est à l’<b>horizon</b>, sa lumière arrive en rasant la Terre : elle traverse l’air en biais, sur une distance bien plus longue. Elle rencontre environ <b>40 fois plus d’air</b> que lorsque le Soleil est au zénith.</p>
      <p>Plus la lumière traverse d’air, plus elle rencontre de molécules… et plus elle perd de bleu en route (mur n°2).</p>`},
  couchant:{t:'Le ciel du soir',s:'Déplace le Soleil : plus il est bas, plus sa lumière traverse d’air. Le bleu est dévié en route, puis le vert et le jaune : il ne reste que l’orange et le rouge.',
    l:`<p>Le spectre affiché montre la lumière du Soleil qui arrive jusqu’à toi.</p>
      <p><b>Soleil haut :</b> la lumière traverse peu d’air. Les molécules dévient seulement un peu de bleu et de violet : c’est ce bleu qui colore le ciel, et le Soleil reste presque blanc.</p>
      <p><b>Soleil bas :</b> la lumière traverse beaucoup plus d’air. Presque tout le bleu est dévié avant d’arriver, puis c’est au tour du vert et du jaune. Il ne reste que l’orange et le rouge : le Soleil et le ciel près de l’horizon deviennent orangés, puis rouges.</p>
      <p>Le bleu dévié n’est pas perdu : il colore le ciel d’autres régions de la Terre, où il fait encore grand jour !</p>
      <p class="petit">Les couleurs du ciel de l’animation ont été calculées avec un modèle de l’atmosphère (molécules de l’air, poussières, ozone).</p>`},
  planetes:{t:'Le ciel des autres planètes',l:`<p>Chaque planète a une atmosphère différente. Elle ne laisse pas passer les mêmes couleurs : son ciel n’a donc pas la même couleur que le nôtre.</p>
      ${PLAN.map(([n,,,f],i)=>`<p><b>${n}</b> : ${['un air très fin, plein de poussières orangées qui arrêtent le bleu. Le ciel est caramel… et le coucher de soleil est bleu !','un air très épais, avec des nuages. Le bleu est arrêté : le ciel est jaune-orangé.','le méthane de son air arrête le rouge : le ciel est bleu-vert.'][i]}</p>${specBar(f,300,14,60,'pop-spec')}`).join('')}
      <p class="petit">Les cartes postales sont des vues d’artiste : personne n’a encore photographié le ciel de Vénus ou d’Uranus.</p>`}});

/* cartes postales (vues d'artiste) */
const PC={
  mars:`<svg viewBox="0 0 175 118" aria-hidden="true"><defs><linearGradient id="pm-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a302f"/><stop offset=".5" stop-color="#7f6352"/><stop offset=".85" stop-color="#ad917a"/><stop offset="1" stop-color="#c2b19f"/></linearGradient>
    <radialGradient id="pm-g" gradientUnits="userSpaceOnUse" cx="104" cy="82" r="62"><stop offset="0" stop-color="#eef5ff"/><stop offset=".1" stop-color="#b3cdec" stop-opacity=".95"/><stop offset=".45" stop-color="#86a6c8" stop-opacity=".45"/><stop offset="1" stop-color="#86a6c8" stop-opacity="0"/></radialGradient></defs>
    <rect width="175" height="118" fill="url(#pm-s)"/><rect width="175" height="118" fill="url(#pm-g)"/><circle cx="104" cy="82" r="3" fill="#fff"/>
    <path d="M0 84Q24 77 52 82Q82 88 116 80Q146 73 175 81V118H0Z" fill="#4a352c"/><path d="M0 97Q48 90 98 98Q138 104 175 95V118H0Z" fill="#2b1e19"/>
    <g fill="#3d2a22"><ellipse cx="30" cy="104" rx="9" ry="4"/><ellipse cx="128" cy="108" rx="13" ry="5"/><ellipse cx="72" cy="111" rx="6" ry="2.6"/></g></svg>`,
  venus:`<svg viewBox="0 0 175 118" aria-hidden="true"><defs><linearGradient id="pv-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b06f35"/><stop offset=".5" stop-color="#d69a5a"/><stop offset="1" stop-color="#efc68c"/></linearGradient>
    <radialGradient id="pv-g" gradientUnits="userSpaceOnUse" cx="118" cy="32" r="52"><stop offset="0" stop-color="#fff6dc"/><stop offset=".15" stop-color="#ffe7b0" stop-opacity=".9"/><stop offset=".5" stop-color="#ffd27a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
    <rect width="175" height="118" fill="url(#pv-s)"/><rect width="175" height="118" fill="url(#pv-g)"/><circle cx="118" cy="32" r="7" fill="#fff8e6"/>
    ${[[34,20,40,6,'#f6d77a',.7],[96,40,34,5,'#fbe08e',.55],[150,54,36,6,'#f2c55e',.65],[58,50,52,7,'#f8dc8a',.6],[16,62,28,5,'#efc25a',.55],[132,16,26,4,'#f6d77a',.5]].map(([x,y,rx,ry,c,o])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}"/>`).join('')}
    <path d="M0 74H175V118H0Z" fill="#6d5133"/><path d="M0 79L60 76L66 87L0 92ZM70 77L175 74V89L76 91ZM0 96L80 92L90 106L0 112ZM94 94L175 91V108L102 110Z" fill="#594128"/>
    <path d="M60 76L66 87M76 91L70 77M80 92L90 106M94 94L102 110M20 96L28 112M120 75L126 90M150 92L146 108" stroke="#33251a" stroke-width="1.4" fill="none"/></svg>`,
  uranus:`<svg viewBox="0 0 100 142" aria-hidden="true"><defs><linearGradient id="pu-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3a52"/><stop offset=".4" stop-color="#2b8ba5"/><stop offset=".75" stop-color="#6fc8d5"/><stop offset="1" stop-color="#b1eaee"/></linearGradient></defs>
    <rect width="100" height="142" fill="url(#pu-s)"/><path d="M-10 52Q50 18 112 44" fill="none" stroke="#d6eef3" stroke-opacity=".55" stroke-width="1.2"/><path d="M-10 56Q50 23 112 48" fill="none" stroke="#d6eef3" stroke-opacity=".3" stroke-width=".8"/>
    <circle cx="26" cy="24" r="6" fill="#fff" opacity=".25"/><circle cx="26" cy="24" r="1.8" fill="#fff"/>
    <g fill="#fff">${[[50,78,60,5,.18],[30,96,46,4,.22],[70,108,52,5,.2],[40,124,64,6,.25],[64,88,30,3,.15]].map(([x,y,rx,ry,o])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" opacity="${o}"/>`).join('')}</g></svg>`};

/* disposition du mur 3 : titre centré en haut ; un seul fil rouge du tableau blanc à l'animation, puis aux autres planètes */
const STEPS3=[[300,48],[344,204],[856,204],[912,48]],
  PINS3=[...STEPS3.map(p=>[...p,'#d63a2f']),[600,28,'#e0a020'],[170,306,'#2f6bd6'],[600,537,'#e0a020'],[966,402,'#d63a2f'],[1117,372,'#2f6bd6'],[1016,556,'#2f9e5e']];
function wall3(){const d='M'+STEPS3.map(p=>p.join(' ')).join('L'),card=(k,i,x,y,w,r,cap)=>`<div class="el postcard" data-el="${i}" role="button" tabindex="0" aria-label="Carte postale : ${cap}" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)">${PC[k]}<span>${cap}<small>vue d’artiste</small></span></div>`;
  return`<div class="board"></div>
  <div class="card-title card-title--c3 card-title--center" style="left:420px;top:22px;width:360px;transform:rotate(-.6deg)"><h2>${TITLES[2]}</h2><p>Déplace le Soleil et regarde le ciel changer.</p></div>
  <div class="el veleda" data-el="7" role="button" tabindex="0" aria-label="Tableau blanc : le trajet de la lumière dans l’air" style="left:30px;top:40px;width:280px;height:236px">${veledaSVG()}<i class="mk mk1"></i><i class="mk mk2"></i><i class="mk mk3"></i></div>
  ${note('horizon',30,300,280,-.8)}
  <div class="el exp" data-el="8" role="button" tabindex="0" aria-label="Animation : le Soleil se couche" style="left:330px;top:196px;width:540px;height:320px">${sunsetSVG()}</div>
  ${note('couchant',330,530,540,.4,'note--wide')}
  <div class="note note--planets" data-note="planetes" role="button" tabindex="0" style="left:900px;top:40px;width:272px;transform:rotate(.6deg)"><h3>Et sur les autres planètes ?</h3>
    ${PLAN.map(([n,c,x,f,s])=>`<div class="pl"><b>${n}</b><span>${c}</span><i>${x}</i>${specBar(f,240,12,48,'pl-spec')}<em>${s}</em></div>`).join('')}</div>
  ${card('mars',9,884,396,165,-7,'Mars, le soir')}${card('uranus',11,1064,366,106,7,'Ciel d’Uranus')}${card('venus',10,934,550,165,3,'Le ciel de Vénus')}
  <svg class="threads" viewBox="0 0 ${DW} ${DH}" aria-hidden="true">
    <path d="${d}" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none" stroke-linejoin="round" transform="translate(2 3)"/><path d="${d}" stroke="#c4161c" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#ff6a5a" stroke-width=".7" fill="none" stroke-linejoin="round" opacity=".7"/>
    ${PINS3.map(([x,y,c])=>`<ellipse cx="${x+3}" cy="${y+4}" rx="6.5" ry="4" fill="rgba(0,0,0,.3)"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x}" cy="${y}" r="7" fill="url(#pin-hl)"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`).join('')}</svg>`}

/* ---------- le 4e mur : pas d'enquête, une fenêtre ouverte sur le ciel bleu, des rideaux et une plante ---------- */
const windowWall=()=>`<div class="win"><div class="win-sky"><i class="cl cl1"></i><i class="cl cl2"></i><i class="cl cl3"></i></div><i class="win-bar win-v"></i><i class="win-bar win-h"></i></div>
  <div class="win-sill"></div><div class="rod"></div><div class="curtain curtain--l"></div><div class="curtain curtain--r"></div>
  <div class="plant"><i class="lf lf1"></i><i class="lf lf2"></i><i class="lf lf3"></i><i class="lf lf4"></i><i class="pot"></i></div>`;

/* ---------- la pièce : trois murs d'enquête et la fenêtre, un plancher, un plafond.
   À l'entrée, on est au milieu de la pièce (vue d'ensemble) : glisser sur le plancher la fait tourner, toucher un mur s'en approche.
   Devant un mur, la croix recule au centre de la pièce et les flèches mènent aux murs voisins ---------- */
const room=$('room'),scene=$('room-scene'),box=$('room-box');let W=0,H=0,P=0,cur=0,ang=0,dist=0,mode='room',zoomed=null,built=0,raf=0,K=[];
function build(){if(built)return;built=1;
  /* liège : un carreau de grains clairs et sombres, répété sur le tableau */
  room.style.setProperty('--cork',`url(${(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#c08a55';g.fillRect(0,0,256,256);
    for(let i=0;i<5200;i++){const v=Math.random();g.fillStyle=v<.45?`rgba(120,72,32,${.25+Math.random()*.4})`:v<.8?`rgba(222,178,120,${.3+Math.random()*.4})`:`rgba(80,46,20,${.3+Math.random()*.3})`;
      g.beginPath();g.ellipse(Math.random()*256,Math.random()*256,.6+Math.random()*1.6,.5+Math.random()*1.1,Math.random()*3,0,6.3);g.fill()}return c.toDataURL()})()})`);
  /* plancher : lattes de bois de teintes voisines, veinées, aux joints décalés */
  room.style.setProperty('--floor',`url(${(()=>{const N=1024,B=9,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),bw=N/B;
    for(let i=0;i<B;i++){let y=-Math.random()*300;while(y<N){const l=260+Math.random()*320,t=Math.random();g.fillStyle=`rgb(${150+t*30|0},${98+t*22|0},${58+t*14|0})`;g.fillRect(i*bw,y,bw,l);
      g.strokeStyle='rgba(70,40,18,.18)';g.lineWidth=1.2;for(let k=0;k<5;k++){const x=i*bw+8+Math.random()*(bw-16);g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+6,y+l*.3,x-6,y+l*.6,x+3,y+l);g.stroke()}
      g.fillStyle='rgba(50,28,12,.55)';g.fillRect(i*bw,y,bw,2);y+=l}g.fillStyle='rgba(50,28,12,.6)';g.fillRect(i*bw,0,2,N)}return c.toDataURL('image/jpeg',.85)})()})`);
  box.innerHTML=[0,1,2,3].map(i=>`<div class="face wall${i==3?' wall--win':''}" data-wall="${i}"><div class="wall-in">${i==0?wall1():i==1?wall2():i==2?wall3():windowWall()}</div></div>`).join('')+'<div class="face floor"></div><div class="face ceil"></div>';
  const svg=box.querySelector('.prism-svg');placeEye(svg,96,118);eyeDrag(svg);
  const s2=box.querySelector('.sky-svg');placeSky(s2,300,150);eyeDrag(s2,SW,SH,placeSky);
  const s3=box.querySelector('.sunset-svg');placeSun(s3,420,170);eyeDrag(s3,CW2,CH2,placeSun);buildDots(box.querySelector('.body-svg'))}
/* la caméra est au centre de la pièce et pivote sur elle-même. La pièce est un cube de côté L (74 % de la largeur de l'écran), avec des murs de hauteur HW :
   au centre, le mur d'en face occupe 74 % de l'écran et l'on voit un peu des murs voisins, du plafond et du plancher. Pour regarder un mur, la caméra avance de DIN
   vers lui, jusqu'à ce qu'il remplisse l'écran ; au repos, il est alors affiché à plat (agrandi de 1/SV) pour que les clics marchent partout */
const SV=.74;let L=0,HW=0,DIN=0;
/* taille réelle de la zone d'affichage (sur téléphone, elle n'est à jour qu'un peu après l'événement de rotation) */
const vpW=()=>document.documentElement.clientWidth||innerWidth,vpH=()=>document.documentElement.clientHeight||innerHeight;
function layout(){W=vpW();H=vpH();L=SV*W;HW=SV*H;P=L/2;DIN=P*(1-SV);scene.style.perspective=P+'px';box.style.setProperty('--fs',1/SV);
  const size=(e,w,h)=>{e.style.width=w+'px';e.style.height=h+'px';e.style.left=(W-w)/2+'px';e.style.top=(H-h)/2+'px'};
  box.querySelectorAll('.wall').forEach((w,i)=>{size(w,L,HW);w.style.transform=`rotateY(${-90*i}deg) translateZ(${-L/2}px)`});
  box.querySelectorAll('.floor,.ceil').forEach((f,i)=>{size(f,L,L);f.style.transform=i?`translateY(${-HW/2}px) rotateX(-90deg)`:`translateY(${HW/2}px) rotateX(90deg)`});
  /* contenu des murs : calculé pour l'écran entier, puis ramené à la taille du mur */
  const m=Math.min(W,H)*.025,k=Math.min((W-2*m)/DW,(H-2*m)/DH);K=[k*SV,(W-DW*k)/2*SV,(H-DH*k)/2*SV];
  box.querySelectorAll('.wall-in').forEach(w=>{w.style.transition='none';w.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${K[0]})`;void w.offsetWidth;w.style.transition=''});
  if(zoomed)zoomTo(zoomed,1);if(mode=='wall'){setView(ang,DIN,0);box.classList.add('flat')}else{box.classList.remove('flat');setView(ang,0,0)}}
/* pose la caméra : angle et avancée vers le mur regardé ; anim=0 pour un changement immédiat */
function setView(a,d,anim=1){ang=a;dist=d;box.classList.toggle('drag',!anim);box.style.transform=`translateZ(${L/2+d}px) rotateY(${a}deg)`}
/* angle qui fait face au mur i, le plus proche de l'angle actuel ; mur regardé depuis le centre */
const near=i=>90*i+360*Math.round((ang-90*i)/360),facing=()=>((Math.round(ang/90)%4)+4)%4;
/* fin du mouvement (ou, au plus tard, juste après sa durée) : devant un mur, retour à plat */
let flatT=0;const toFlat=()=>{if(mode=='wall')box.classList.add('flat')},unflat=()=>{if(box.classList.contains('flat')){setView(ang,DIN,0);box.classList.remove('flat');void box.offsetWidth}};
box.addEventListener('transitionend',e=>{if(e.target===box&&e.propertyName=='transform')toFlat()});
const markCur=()=>box.querySelectorAll('.wall').forEach((w,k)=>w.classList.toggle('cur',mode=='wall'&&k==cur));
/* s'approcher du mur i depuis le centre, reculer au centre, passer au mur voisin, tourner d'un quart de tour au centre */
function enter(i){mode='wall';cur=i;markCur();setView(near(i),DIN);clearTimeout(flatT);flatT=setTimeout(toFlat,1050);ui()}
function leave(){if(zoomed)unzoom();mode='room';markCur();unflat();setView(ang,0);ui()}
function go(i){if(zoomed)unzoom();i=Math.max(0,Math.min(NAV-1,i));if(i==cur)return;cur=i;markCur();unflat();setView(near(i),DIN);clearTimeout(flatT);flatT=setTimeout(toFlat,1050);ui()}
function turn(st){setView(90*Math.round(ang/90)+90*st,0)}
function ui(){const w=mode=='wall';room.classList.toggle('inroom',!w);$('room-prev').hidden=!w||cur<=0||!!zoomed;$('room-next').hidden=!w||cur>=NAV-1||!!zoomed;$('room-back').hidden=!zoomed;
  $('room-quit').setAttribute('aria-label',w?'Reculer au centre de la pièce':'Revenir au menu')}
/* zoom vers un cadre : il vient au centre et remplit l'écran (calcul pour l'écran, ramené à la taille du mur) ; transition douce */
function zoomTo(el,now){const z=EL[+el.dataset.el][ZOOM_TEXT?'zt':'z'],wi=el.closest('.wall-in'),k=Math.min(W*.94/z[2],H*.88/z[3]),tx=W/2-(z[0]+z[2]/2)*k,ty=H/2-(z[1]+z[3]/2)*k;
  if(now){wi.style.transition='none'}wi.style.transform=`translate(${tx*SV}px,${ty*SV}px) scale(${k*SV})`;if(now){void wi.offsetWidth;wi.style.transition=''}
  box.querySelectorAll('.el.on').forEach(e=>e.classList.remove('on'));el.classList.add('on');zoomed=el;room.classList.add('zoomed');ui()}
function unzoom(){if(!zoomed)return;const wi=zoomed.closest('.wall-in');wi.style.transform=`translate(${K[1]}px,${K[2]}px) scale(${K[0]})`;zoomed.classList.remove('on');zoomed=null;room.classList.remove('zoomed');ui()}
/* ce qui est sous le doigt au centre de la pièce : un mur (0 à 3), le plancher, ou rien. On projette nous-mêmes les faces, comme le navigateur
   (en gardant seulement leur partie devant la caméra), plutôt que de compter sur son repérage des clics en 3D, peu fiable sur ordinateur */
function cam([x,y,z]){const a=ang*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[x*c+z*s,y,-x*s+z*c+L/2+dist]}
function shot(Q){const out=[],lim=P-1;Q.forEach((A,i)=>{const B=Q[(i+1)%Q.length],ia=A[2]<lim,ib=B[2]<lim;if(ia)out.push(A);if(ia!=ib){const t=(lim-A[2])/(B[2]-A[2]);out.push(A.map((v,k)=>v+(B[k]-v)*t))}});
  return out.map(([X,Y,Z])=>{const k=P/(P-Z);return[W/2+X*k,H/2+Y*k]})}
function pick(px,py){const l=L/2,h=HW/2,area=Q=>Q.reduce((s,p,i)=>{const q=Q[(i+1)%Q.length];return s+p[0]*q[1]-q[0]*p[1]},0);
  for(let i=0;i<4;i++){const b=-i*Math.PI/2,c=Math.cos(b),s=Math.sin(b),Q=shot([[-l,-h],[l,-h],[l,h],[-l,h]].map(([u,v])=>cam([u*c-l*s,v,-u*s-l*c])));if(Q.length>2&&area(Q)>0&&inPoly([px,py],Q))return i}
  const F=shot([[-l,-l],[l,-l],[l,l],[-l,l]].map(([x,z])=>cam([x,h,z])));return F.length>2&&inPoly([px,py],F)?'floor':null}

/* ---------- l'œil (ou le Soleil) : on le fait glisser ---------- */
function eyeDrag(svg,W0=PW,H0=PH,place=placeEye){const eye=svg.querySelector('.eye'),toSvg=e=>{const r=svg.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W0,(e.clientY-r.top)/r.height*H0]};let on=0;
  eye.addEventListener('pointerdown',e=>{e.stopPropagation();on=1;eye.setPointerCapture(e.pointerId);eye.classList.add('grab')});
  eye.addEventListener('pointermove',e=>{if(on){const[x,y]=toSvg(e);place(svg,x,y)}});
  eye.addEventListener('pointerup',e=>{on=0;eye.classList.remove('grab');e.stopPropagation()});eye.addEventListener('click',e=>e.stopPropagation());
  eye.addEventListener('keydown',e=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!d)return;e.preventDefault();e.stopPropagation();place(svg,+eye.dataset.x+d[0],+eye.dataset.y+d[1])});}

/* ---------- au centre de la pièce : glisser sur le plancher pour tourner (un quart de tour, en suivant le doigt), toucher un mur pour s'en approcher ---------- */
let sx0=0,a0=0,drag=0,down=0,moved=0;
scene.addEventListener('pointerdown',e=>{if(mode!='room'||e.button)return;down=1;moved=0;sx0=e.clientX;a0=ang;drag=pick(e.clientX,e.clientY)=='floor';if(drag)scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx0;if(Math.abs(dx)>8)moved=1;if(drag&&moved)setView(a0-dx/W*120,0,0)});
const release=e=>{if(!down)return;down=0;if(drag&&moved){const dx=e.clientX-sx0,st=Math.abs(dx)>W*.08?Math.sign(-dx):0,r0=90*Math.round(a0/90);let t=90*Math.round(ang/90);if(st&&t==r0)t+=90*st;setView(t,0)}drag=0};
scene.addEventListener('pointerup',release);scene.addEventListener('pointercancel',release);
/* ---------- devant un mur : toucher un cadre pour s'en approcher (et le retoucher pour reculer), un texte pour le lire ---------- */
scene.addEventListener('click',e=>{if(mode=='room'){if(moved)return;const k=pick(e.clientX,e.clientY);if(typeof k=='number')k<NAV?enter(k):setView(near(k),0);return}
  const n=e.target.closest('.note');if(n){openNote(n.dataset.note);return}
  const el=e.target.closest('.el');if(el){el===zoomed?unzoom():zoomTo(el);return}if(zoomed)unzoom()});
scene.addEventListener('keydown',e=>{if(e.key!='Enter'&&e.key!=' ')return;const n=e.target.closest('.note'),el=e.target.closest('.el');if(n){e.preventDefault();openNote(n.dataset.note)}else if(el&&!e.target.closest('.eye')){e.preventDefault();el===zoomed?unzoom():zoomTo(el)}});
$('room-prev').onclick=()=>go(cur-1);$('room-next').onclick=()=>go(cur+1);$('room-back').onclick=unzoom;

/* ---------- fenêtre de lecture ---------- */
const pop=$('note-pop');let lastFocus=null;
function openNote(k){lastFocus=document.activeElement;$('note-title').textContent=NOTES[k].t;$('note-body').innerHTML=NOTES[k].l;pop.hidden=false;pop.querySelector('.pop-card').scrollTop=0;$('note-ok').focus({preventScroll:true})}
const closeNote=()=>{pop.hidden=true;if(lastFocus)lastFocus.focus()};$('note-ok').onclick=closeNote;pop.onclick=e=>{if(e.target===pop)closeNote()};

/* ---------- invitation à passer en paysage : disparaît seule quand on tourne le téléphone, ou d'un toucher ---------- */
const portrait=matchMedia('(orientation: portrait)'),rot=$('room-rot');
portrait.addEventListener('change',()=>{if(!portrait.matches)rot.hidden=true});rot.onclick=()=>rot.hidden=true;

/* ---------- entrée, sortie, animations (au centre de la pièce, les murs visibles s'animent aussi) ---------- */
function loop(now){raf=requestAnimationFrame(loop);if(document.hidden)return;
  /* l'écran a changé de taille (rotation du téléphone) : on refait la mise en page, même si l'événement est arrivé trop tôt */
  if(vpW()!=W||vpH()!=H)layout();const all=mode=='room';if(all||cur==0)stepArrows(box.querySelector('#r-arrows'),now);if(all||cur==1){stepBreath(now);stepSky(now)}else sLast=0}
function open(){build();$('start').hidden=true;room.hidden=false;zoomed=null;room.classList.remove('zoomed');mode='room';cur=0;ang=0;markCur();layout();ui();rot.hidden=!portrait.matches;if(!raf)raf=requestAnimationFrame(loop)}
/* en quittant, la pièce est entièrement démontée (elle sera reconstruite à la prochaine ouverture) : certains navigateurs mobiles gardaient sinon
   l'image de la scène 3D à l'écran, qui réapparaissait ensuite derrière les autres pages */
function close(){room.hidden=true;$('start').hidden=false;cancelAnimationFrame(raf);raf=0;zoomed=null;room.classList.remove('zoomed');pop.hidden=true;
  box.innerHTML='';box.style.transform='';built=0;arrows=[];sArrows=[];DOTS=[];bCycle=-1;sLast=0;$('go-sky').focus({preventScroll:true})}
$('go-sky').onclick=open;$('room-quit').onclick=()=>mode=='wall'?leave():close();
/* les boutons de commande répondent à la position du doigt, même si le navigateur attribue le toucher à la scène 3D qui est dessous */
room.addEventListener('click',e=>{const b=['room-quit','room-back','room-prev','room-next'].map($).find(b=>{if(b.hidden)return false;const r=b.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});
  if(b&&!b.contains(e.target)&&pop.hidden&&(rot.hidden||b.id=='room-quit')){e.stopPropagation();e.preventDefault();b.click()}},true);
addEventListener('resize',()=>{if(!room.hidden)layout()});addEventListener('orientationchange',()=>{if(!room.hidden)setTimeout(layout,300)});
addEventListener('keydown',e=>{if(room.hidden)return;if(e.key=='Escape'){if(!pop.hidden)closeNote();else if(zoomed)unzoom();else if(mode=='wall')leave();return}
  if(!pop.hidden||zoomed||e.target.closest&&e.target.closest('button,.eye'))return;
  if(mode=='room'){if(e.key=='ArrowRight')turn(1);if(e.key=='ArrowLeft')turn(-1);if(e.key=='Enter'&&facing()<NAV)enter(facing());return}
  if(e.key=='ArrowRight')go(cur+1);if(e.key=='ArrowLeft')go(cur-1)})})();
