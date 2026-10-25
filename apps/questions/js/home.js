/* Accueil : tapisserie de points d'interrogation sur fond vert pomme, dans des polices, tailles et inclinaisons variées (tirées à chaque ouverture) ;
   moitié en tons clairs (blanc, verts très pâles), moitié en verts sombres */
(()=>{const F=["'Fredoka',sans-serif","'Nunito',sans-serif","Georgia,serif","'Courier New',monospace","'Comic Sans MS','Chalkboard SE',cursive","Impact,'Arial Black',sans-serif","'Times New Roman',serif","'Trebuchet MS',sans-serif","'Brush Script MT',cursive"],
  LIGHT=['#FFFFFF','#FAFFF2','#F2FBE4','#F6FDEB','#EEF9DD'],DARK=['#24501E','#335F24','#4E7F2E','#3C6C44','#5E8C2E','#22502E','#486E22'],
  pick=A=>A[Math.random()*A.length|0],cols=8,rows=12;let h='';
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=(i+.5+(Math.random()-.5)*.7)/cols*100,y=(j+.5+(Math.random()-.5)*.7)/rows*100,
    light=Math.random()<.5,op=light?.72+Math.random()*.28:.2+Math.random()*.24;
    h+=`<span style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;font-family:${pick(F)};font-size:${18+Math.random()*52|0}px;color:${pick(light?LIGHT:DARK)};opacity:${op.toFixed(2)};transform:translate(-50%,-50%) rotate(${(Math.random()-.5)*50|0}deg)">?</span>`}
  document.getElementById('qbg').innerHTML=h})();

/* Carte « tailles » : les électrons tournent sur leurs orbites inclinées, suivis d'une traînée d'étoile filante qui passe devant puis derrière le noyau ;
   la galaxie tourne lentement dans son plan (bras traînants). Figé si l'utilisateur préfère réduire les animations, en pause hors de l'accueil. */
(()=>{const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg',mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e},
  AX=84,AY=60,RX=46,RY=10,N=26,SPAN=220*Math.PI/180,
  G={ob:$('orb-back'),of:$('orb-front'),eb:$('el-back'),ef:$('el-front')},gx=$('gx-spin'),start=$('start'),
  // étoiles des bras : coordonnées à plat dans la galaxie, replacées à chaque image pour rester rondes malgré l'inclinaison
  GX=245,GY=60,TC=Math.cos(-20*Math.PI/180),TS=Math.sin(-20*Math.PI/180),DOT=[...document.querySelectorAll('#gx-dots circle')].map(e=>[e,...e.dataset.p.split(' ').map(Number)]),
  // inclinaison de l'orbite (°), position de départ de l'électron (°), durée d'un tour (s)
  O=[[0,150,3.2],[60,330,4.1],[-60,120,3.6]].map(([r,t,p])=>({c:Math.cos(r*Math.PI/180),s:Math.sin(r*Math.PI/180),t0:t*Math.PI/180,w:2*Math.PI/p,
    seg:Array.from({length:N},(_,k)=>{const u=(k+1)/N;return mk('path',{'stroke-opacity':(u**1.6*.95).toFixed(2),'stroke-width':(.5+u*2).toFixed(1)})}),
    el:(()=>{const g=mk('g',{});g.append(mk('circle',{r:8,fill:'url(#g-eh)'}),mk('circle',{r:3.4,fill:'url(#g-e)'}));return g})()}));
  const pt=(o,t)=>{const x=RX*Math.cos(t),y=RY*Math.sin(t);return[AX+x*o.c-y*o.s,AY+x*o.s+y*o.c]},put=(e,g)=>{if(e.parentNode!==g)g.append(e)};
  function draw(ms){
    for(const o of O){const te=o.t0+o.w*ms/1000;
      o.seg.forEach((e,k)=>{const a0=te-SPAN+SPAN*k/N,a1=te-SPAN+SPAN*(k+1)/N,p=pt(o,a0),q=pt(o,a1);
        e.setAttribute('d',`M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);put(e,Math.sin((a0+a1)/2)>0?G.of:G.ob)});
      const p=pt(o,te);o.el.setAttribute('transform',`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`);put(o.el,Math.sin(te)>0?G.ef:G.eb)}
    const a=-ms/1000*4%360,c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);gx.setAttribute('transform',`rotate(${a.toFixed(2)})`);
    for(const[e,x,y]of DOT){const u=x*c-y*s,w=(x*s+y*c)*.48;e.setAttribute('cx',(GX+u*TC-w*TS).toFixed(1));e.setAttribute('cy',(GY+u*TS+w*TC).toFixed(1))}}
  draw(0);if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const loop=ms=>{if(!start.hidden)draw(ms);requestAnimationFrame(loop)};requestAnimationFrame(loop)})();

/* Carte « ciel » : le soleil remonte lentement jusqu'à frôler l'horizon (−0,5°) sans paraître, puis se recouche (−7°) ; un tour en 40 s.
   Couleurs calculées hors ligne par un modèle de diffusion atmosphérique spectral (Rayleigh, aérosols, ozone, ombre de la Terre, diffusion multiple approchée),
   puis exposées comme le ferait l'œil qui s'adapte. Pour chaque hauteur du soleil : 8 couleurs du zénith à l'horizon, et 3 pour le halo côté soleil. */
(()=>{const K=[[-8,'001f4a002b56003c611a4f643e605865672e7f5e00874c00','ff7a00e1be006e9993'],[-7,'0029570036620e476c29596c4b685b6f6b2f8560008b4d00','ff6d00deb600749a93'],[-6,'07315a123f672451703c626e5d6f59806f1f9660009a4900','ff6800e4b300819f94'],[-5,'183b65244a70375c77506c726f765892730da56200a64a00','ff6400e6ae008ea190'],[-4,'29456d3754774b667c647573837d54a37800b36500b14d00','ff6300e8aa009ba389'],[-3,'384f72485e7b5e707d777d7195844eb27e00c06a00bd5100','ff6500eaa900a6a581'],[-2.5,'3f54744f637d65747e7e82709c884ab98100c66e00c25500','ff6600eba800aba67d'],[-2,'44587655687d6b797e85866fa28c48bf8500cd7200c95900','ff6800efa900b0a87b'],[-1.5,'475c78586c7f707d7e8a8a6fa79146c48a00d37700d05e00','ff6c00f6aa00b6aa77'],[-1,'4a60795c708073817f8e8e6fac9545c98f00d97d00d86300','ff7800ffad00c0ac73'],[-0.5,'4b637b5d7382758581909271af9946cd9500df8400e26b00','ff8e00ffb200cbae6d']].map(([h,s,g])=>[h,...[s,g].map(x=>x.match(/.{6}/g).map(c=>[0,2,4].map(i=>parseInt(c.substr(i,2),16))))]),
  $=id=>document.getElementById(id),sky=[...document.querySelectorAll('#g-sky stop')],sun=[...document.querySelectorAll('#g-sun stop')],
  floor=document.querySelector('#g-floor stop'),rays=$('sun-rays'),start=$('start'),FL=[59,71,119],
  mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),css=c=>`rgb(${c.map(Math.round).join()})`;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  function draw(hs){let i=0;while(i<K.length-2&&K[i+1][0]<hs)i++;const [h0,s0,g0]=K[i],[h1,s1,g1]=K[i+1],t=Math.min(1,Math.max(0,(hs-h0)/(h1-h0)));
    const S=s0.map((c,j)=>mix(c,s1[j],t)),G=g0.map((c,j)=>mix(c,g1[j],t));
    sky.forEach((e,j)=>e.setAttribute('stop-color',css(S[j])));sun.forEach((e,j)=>e.setAttribute('stop-color',css(G[Math.min(j,2)])));
    floor.setAttribute('stop-color',css(mix(FL,S[7],.3)));rays.setAttribute('opacity',(.02+.1*((hs+7)/6.5)**2).toFixed(3))}
  let last=-1e9;const loop=ms=>{if(!start.hidden&&ms-last>50){last=ms;draw(-7+6.5*(1-Math.cos(ms/40000*2*Math.PI))/2)}requestAnimationFrame(loop)};requestAnimationFrame(loop)})();
