/* Les étages : nom, fond, m = mètres par unité de dessin (l'échelle réelle), légende.
   inn : décades de grossissement pendant lesquelles l'étage apparaît (il est encore trop grand avant) ;
   out : décades de rapetissement pendant lesquelles il s'efface (il devient trop petit, ou laisse la place au suivant). */
const LV=[
  {n:'Noyau d’atome',b:L0,m:1.35e-15,bg:'#0b1030',out:[1.6,2.2],leg:[['#E8483C','Proton (+)'],['#2F6BE0','Neutron (0)']]},
  {n:'Atome d’oxygène',b:L1,m:1.5e-11,bg:'#0d1436',inn:[3,2],out:[.3,.6],leg:[['#6fa8ff','Électron (−)']]},
  {n:'Molécule d’eau',b:L2,m:4.8e-11,bg:'#101a3e',inn:[.45,.15],out:[1.3,1.8],leg:[[OXY,'Oxygène (O)'],[HYD,'Hydrogène (H)'],['#ffffff','Liaison hydrogène (pointillés)']]},
  {n:'ADN',b:L3,m:5e-10,bg:'#0e2a3c',inn:[.8,.3],out:[2,2.6],leg:[[BASES.A,'Adénine (A)'],[BASES.T,'Thymine (T)'],[BASES.C,'Cytosine (C)'],[BASES.G,'Guanine (G)']]},
  {n:'Chromosome',b:L4,m:4e-7,bg:'#1b1636',inn:[1.6,.9],out:[1.5,2]},
  {n:'Cellule',b:L5,m:2.5e-6,bg:'#d3eac3',inn:[.6,.2],out:[.8,1.2],leg:[['#4FA8F0','Membrane'],['#9A62F0','Noyau et chromosomes'],['#F28A3A','Mitochondries'],['#3F8FE8','Réticulum'],['#E85FB0','Appareil de Golgi'],['#F6D86A','Vésicules']]},
  {n:'Micro-organisme',b:L6,m:3e-5,bg:LUMEN,inn:[.8,.3],out:[.5,.8]},
  {n:'Intestin de la fourmi',b:L7,m:2e-4,fr:.15,bg:'#7a5a3a',inn:[.7,.3],out:[.4,.7],leg:[['#f2c94c','Jabot (réserve de nourriture)'],['#e0957f','Intestin'],['#c7d65a','Tubes de Malpighi (reins)'],['#f3d79a','Corps gras (réserves)'],['#e9a0a0','Cœur'],['#f4efe0','Chaîne nerveuse'],['#8fd6a6','Micro-organisme']]},
  {n:'Fourmi',b:L8,m:1e-3,bg:'#b9d3a4',inn:[1,.45],out:[2,2.5]},
  {n:'Deux enfants en forêt',b:L9,m:.35,bg:'#c4dccb',inn:[1.4,.7],out:[1.4,1.9]},
  {n:'Les grands arbres',b:L10,m:4,bg:'#a9d3ee',inn:[1,.4],out:[.5,1]},
  {n:'La forêt',b:L11,m:300,bg:'#9cc25a',inn:[1.4,.9],out:[.5,.9]},
  {n:'France',b:L12,m:1.1e5,bg:'#1E78D8',inn:[1.8,1.2],out:[.4,.9]},
  {n:'Terre',b:L13,m:6.371e6/3.6,bg:'#04060e',inn:[1.1,.5],out:[2.1,2.6]},
  {n:'Terre et Lune',b:L14,m:1e8,bg:'#020308',inn:[1.4,.8],out:[1.5,2.3]},
  {n:'Système solaire',b:L15,m:MSS,bg:'#020308',inn:[4,3.5],out:[4.3,5]},
  {n:'Étoiles voisines',b:L16,m:2.5e16,bg:'#020207',inn:[3,2.2],out:[1.4,2]},
  {n:'Voie lactée',b:L17,m:5e4*LY/4.5,bg:'#010104',inn:[3.9,3.6],out:[1.2,1.8]},
  {n:'Galaxies voisines',b:L18,m:2.54e6*LY/4,bg:'#000003',inn:[1.4,.9],out:[.8,1.3]},
  {n:'Superamas de la Vierge',b:L19,m:1.35e7*LY,bg:'#000002',inn:[1.2,.6]}];
/* LM : échelle réelle de chaque étage ; M : position de sa station (fr recule un peu la vue pour cadrer l'objet entier) */
const N=LV.length,LM=LV.map(v=>Math.log10(v.m)),M=LM.map((m,i)=>m+(LV[i].fr||0));

/* Trajet : la molette fait avancer p. Chaque saut entre deux étages a une longueur qui grandit avec le nombre de décades à franchir,
   et l'échelle y suit une courbe douce : plus lente près des objets, plus rapide au milieu du vide. À pleine vitesse, le voyage complet dure ~50 s.
   u = log10 du nombre de mètres que vaut S pixels (S = un dixième de la plus petite dimension de l'écran). */
const PS=[0];for(let i=0;i<N-1;i++)PS[i+1]=PS[i]+.7+.45*(M[i+1]-M[i]);const PMAX=PS[N-1],VMAX=.6,KLIN=.3;
const S3=t=>t*t*(3-2*t);
function uOf(p){p=Math.max(0,Math.min(PMAX,p));let i=0;while(i<N-2&&p>=PS[i+1])i++;const t=(p-PS[i])/(PS[i+1]-PS[i]);return M[i]+(M[i+1]-M[i])*((1-KLIN)*S3(t)+KLIN*t)}
function pOf(u){let i=0;while(i<N-2&&u>=M[i+1])i++;let a=PS[i],b=PS[i+1];for(let j=0;j<40;j++){const m=(a+b)/2;if(uOf(m)<u)a=m;else b=m}return(a+b)/2}
/* voyage vers un étage choisi sur la jauge : départ très lent, arrivée très amortie */
const B=x=>105*x*x*x*(1/3-x+1.2*x*x-2/3*x*x*x+x*x*x*x/7);

/* écran et ciel étoilé (dessiné une fois, il reste fixe derrière l'espace proche) */
let W,H,DPR,S,sky;
function rs(){W=innerWidth;H=innerHeight;DPR=Math.min(2,devicePixelRatio||1);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);S=Math.min(W,H)/10;
  sky=off(cv.width,cv.height,(x,w,h)=>{for(let i=0;i<w*h/2500;i++){const k=rnd(.3,1);x.fillStyle=`rgba(${255*k|0},${245*k|0},${(Math.random()<.2?200:255)*k|0},${rnd(.4,1)})`;const s=rnd(.6,1.8)*DPR;x.fillRect(rnd(0,w),rnd(0,h),s,s)}})}
rs();addEventListener('resize',rs);
const BG=LV.map(v=>rgb(v.bg));

let LS=null,u=M[0],p=0,pT=0,vel=0,fl=null,t0=performance.now(),tp=0,run=0;
function build(){if(!LS)LS=LV.map(v=>Object.assign({c:[0,0]},v.b()))}

/* étiquettes posées pendant le dessin, écrites par-dessus à la fin */
const TAGS=[],V={tag(t,x,y,a=1){a*=V.w;if(a>.02)TAGS.push([t,V.ox+x*V.q,V.oy+y*V.q,a])}};
function drawTags(c){c.font='800 13px Nunito, system-ui, sans-serif';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=3.5;
  /* le texte passe à gauche du point quand il déborderait de l'écran (la jauge occupe le bord droit) */
  TAGS.forEach(([t,x,y,a])=>{if(x<-50||x>W+50||y<-20||y>H+20)return;const tw=c.measureText(t).width,tx=x+8+tw>W-46?x-8-tw:x+8;c.globalAlpha=Math.min(1,a);disc(c,x,y,2.2,'#ffffff');
    c.strokeStyle='rgba(10,14,30,.85)';c.strokeText(t,tx,y);c.fillStyle='#fff';c.fillText(t,tx,y)});
  c.globalAlpha=1;TAGS.length=0}

function frame(){if(!run)return;requestAnimationFrame(frame);
  const now=performance.now(),dt=Math.min(.05,(now-tp)/1000),c=cx;tp=now;V.t=(now-t0)/1000;
  if(fl){fl.t+=dt;const x=Math.min(1,fl.t/fl.T);u=fl.u0+(fl.u1-fl.u0)*B(x);if(x>=1){u=fl.u1;p=pT=PS[fl.j];fl=null}else p=pT=pOf(u);vel=0}
  else{const vT=Math.max(-VMAX,Math.min(VMAX,(pT-p)*2.5));vel+=(vT-vel)*Math.min(1,dt*3);p=Math.max(0,Math.min(PMAX,p+vel*dt));u=uOf(p)}
  let k=0;while(k<N-2&&u>=M[k+1])k++;
  /* positions emboîtées, en pixels à partir du noyau : chaque étage est placé là où son ancre reçoit l'étage précédent */
  const Q=LM.map(m=>S*Math.pow(10,m-u)),P=[[0,0]];
  for(let i=1;i<N;i++){const a=LS[i].a;P[i]=[P[i-1][0]-a[0]*Q[i],P[i-1][1]-a[1]*Q[i]]}
  /* cadrage : on glisse du centre d'intérêt d'un étage à celui du suivant, sans jamais s'écarter de plus d'un tiers d'écran à la fois
     (tant que l'étage suivant est très agrandi, son centre est loin : on attend qu'il se rapproche) */
  const tf=S3(cl((u-M[k])/(M[k+1]-M[k]))),fc=i=>[P[i][0]+LS[i].c[0]*Q[i],P[i][1]+LS[i].c[1]*Q[i]],F0=fc(k),F1=fc(k+1),
    dd=Math.hypot(F1[0]-F0[0],F1[1]-F0[1]),wf=tf*Math.min(1,.33*Math.min(W,H)/(dd||1)),F=[lerp(F0[0],F1[0],wf),lerp(F0[1],F1[1],wf)];
  /* fond : couleur de l'étage, puis étoiles autour de nous, de la Terre jusqu'à la sortie de la Voie lactée */
  const tb=sm(.3,.8,(u-M[k])/(M[k+1]-M[k])),bc=BG[k].map((x,j)=>Math.round(lerp(x,BG[k+1][j],tb)));
  c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.fillStyle=`rgb(${bc})`;c.fillRect(0,0,cv.width,cv.height);
  const sw=sm(M[12]+.6,M[13]-.2,u)*(1-sm(M[17]-1,M[17],u));if(sw>.01){c.globalAlpha=sw;c.drawImage(sky,0,0);c.globalAlpha=1}
  V.mn=Math.min(W,H);
  for(let i=N-1;i>=0;i--){const L=LS[i],v=LV[i],m=LM[i]-u,q=Q[i];
    if(q>S*4000)continue;
    const wm=(v.inn?1-sm(v.inn[1],v.inn[0],m):1)*(v.out?1-sm(v.out[0],v.out[1],-m):1);if(wm<.004)continue;
    const wd=L.back?wm*(i<N-1?1-sm(.25,.65,(u-M[i])/(M[i+1]-M[i])):1):0,ox=W/2+P[i][0]-F[0],oy=H/2+P[i][1]-F[1];
    c.setTransform(q*DPR,0,0,q*DPR,ox*DPR,oy*DPR);PXU=1/q;
    Object.assign(V,{q,px:1/q,ox,oy,x0:-ox/q,x1:(W-ox)/q,y0:-oy/q,y1:(H-oy)/q,d:-m});
    if(wd>.004){V.w=wd;c.globalAlpha=wd;L.back(c,V)}
    V.w=wm;c.globalAlpha=wm;L.main(c,V)}
  c.globalAlpha=1;c.setTransform(DPR,0,0,DPR,0,0);drawTags(c);scaleBar();ui()}

/* échelle : la longueur ronde (1, 2 ou 5 × une puissance de 10) qui fait entre 50 et 125 pixels, et le segment à sa longueur exacte ;
   de la cellule à la Terre on parle en µm, mm, cm, m et km, ailleurs en puissances de 10 de mètres */
const BAR=110;let lastS='',lastL=null,lastY='';
function fmtL(n,pw,hu){const v=n*Math.pow(10,pw),f=x=>x.toLocaleString('fr-FR',{maximumFractionDigits:3});
  if(!hu)return(n>1?n+' × ':'')+(pw?`10<sup>${pw<0?'−':''}${Math.abs(pw)}</sup> m`:'1 m');
  return v<1e-3?f(v*1e6)+' µm':v<1e-2?f(v*1e3)+' mm':v<1?f(v*100)+' cm':v<1e3?f(v)+' m':f(v/1e3)+' km'}
function scaleBar(){const mpp=Math.pow(10,u)/S,L=BAR*mpp,pw=Math.floor(Math.log10(L)),r=L/Math.pow(10,pw),n=r>=5?5:r>=2?2:1,px=n*Math.pow(10,pw)/mpp,
    s=fmtL(n,pw,u>=M[5]-.01&&u<=M[13]+.01);
  $('scale').querySelector('i').style.width=px.toFixed(1)+'px';if(s!==lastS){lastS=s;$('scale-v').innerHTML=s}
  /* à partir du système solaire, la même longueur en années-lumière */
  const sl=u>=M[15]-.3;if(sl!==lastL){lastL=sl;$('scale-ly').hidden=!sl}if(sl){const t='≈ '+fmtLY(n*Math.pow(10,pw)/LY);if(t!==lastY){lastY=t;$('scale-ly-v').textContent=t}}}
function fmtLY(v){const f=(x,d)=>x.toLocaleString('fr-FR',{maximumSignificantDigits:d}),al=x=>x<2?'année-lumière':'années-lumière';
  return v<1?f(v,1)+' '+al(v):v<1e6?f(Math.round(v),2)+' '+al(v):v<1e9?f(v/1e6,2)+(v<2e6?' million':' millions')+' d’années-lumière':f(v/1e9,2)+(v<2e9?' milliard':' milliards')+' d’années-lumière'}

/* interface : nom de l'étage le plus proche, légende, jauge des échelles */
let lastI=-1;
function legend(i){const L=LV[i].leg,e=$('legend');e.classList.toggle('on',!!L);if(L)e.innerHTML=L.map(([c,t])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}
function ui(){let i=0;for(let j=1;j<N;j++)if(Math.abs(PS[j]-p)<Math.abs(PS[i]-p))i=j;if(i!=lastI){lastI=i;$('lvl').textContent=LV[i].n;legend(i);$('lvl').classList.remove('pop');void $('lvl').offsetWidth;$('lvl').classList.add('pop');
  [...$('gauge').children].forEach((d,j)=>d.classList.toggle('on',j==i))}}
/* jauge : le noyau en haut, l'univers en bas */
$('gauge').innerHTML=LV.map((v,i)=>`<button type="button" data-i="${i}" aria-label="${v.n}"><span>${v.n}</span></button>`).join('');
$('gauge').onclick=e=>{const b=e.target.closest('button');if(!b)return;const j=+b.dataset.i,du=Math.abs(M[j]-u);if(du<1e-3)return;
  fl={u0:u,u1:M[j],t:0,T:2.2+3.2*Math.sqrt(du),j};$('hint').classList.add('off')};

/* commandes : molette, pincement, ou un doigt qui glisse (vers le haut = dézoomer, vers le grand) */
const Pt=new Map();let pd=0;
const zoom=d=>{if(fl){fl=null;p=pT=pOf(u);vel=0}pT=Math.max(0,Math.min(PMAX,Math.max(p-1,Math.min(p+1,pT+d))));$('hint').classList.add('off')};
cv.addEventListener('wheel',e=>{e.preventDefault();const dy=e.deltaY*(e.deltaMode==1?33:e.deltaMode==2?400:1);zoom(Math.max(-120,Math.min(120,dy))*.0015)},{passive:false});
cv.onpointerdown=e=>{Pt.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);if(Pt.size==2){const a=[...Pt.values()];pd=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}};
cv.onpointermove=e=>{const o=Pt.get(e.pointerId);if(!o)return;
  if(Pt.size==2){Pt.set(e.pointerId,[e.clientX,e.clientY]);const a=[...Pt.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pd)zoom(Math.log(pd/d)*1.2);pd=d;return}
  zoom((o[1]-e.clientY)*.004);Pt.set(e.pointerId,[e.clientX,e.clientY])};
cv.onpointerup=cv.onpointercancel=e=>{Pt.delete(e.pointerId);pd=0};
addEventListener('keydown',e=>{if($('ui').hidden||!lyPop.hidden)return;if(e.key=='-'||e.key=='ArrowDown')zoom(.25);if(e.key=='+'||e.key=='ArrowUp')zoom(-.25)});

$('go').onclick=()=>{$('start').hidden=true;$('room').hidden=true;$('ui').hidden=false;$('load').hidden=false;
  setTimeout(()=>{build();$('load').hidden=true;u=M[0];p=pT=vel=0;fl=null;tp=performance.now();if(!run){run=1;frame()}},30)};
/* fenêtre « Qu'est-ce qu'une année-lumière ? » */
const lyPop=$('ly-pop'),lyOpen=o=>{lyPop.hidden=!o;if(o)$('ly-ok').focus();else $('ly-q').focus()};
$('ly-q').onclick=()=>lyOpen(1);$('ly-ok').onclick=()=>lyOpen(0);lyPop.onclick=e=>{if(e.target===lyPop)lyOpen(0)};
addEventListener('keydown',e=>{if(e.key=='Escape'&&!lyPop.hidden)lyOpen(0)});
$('quit').onclick=()=>{run=0;$('ui').hidden=true;$('start').hidden=false;$('hint').classList.remove('off')};
/* la croix répond à la position du doigt, même si un navigateur mobile attribue le toucher au dessin qui est dessous */
document.addEventListener('click',e=>{if($('ui').hidden||!lyPop.hidden)return;const q=$('quit'),r=q.getBoundingClientRect();
  if(!q.contains(e.target)&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){e.stopPropagation();e.preventDefault();q.click()}},true);
