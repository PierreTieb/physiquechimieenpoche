/* Base commune du rendu 2D : canevas, couleurs et petits outils de dessin.
   Chaque étage dessine en « unités » : à sa station, la plus petite dimension de l'écran fait environ 10 unités. */
const $=i=>document.getElementById(i),cl=t=>Math.max(0,Math.min(1,t)),sm=(a,b,x)=>{const t=cl((x-a)/(b-a));return t*t*(3-2*t)},
  lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a),TAU=2*Math.PI,R=Math.PI/180,LY=9.461e15,AU=1.496e11;
const cv=$('c'),cx=cv.getContext('2d');
/* PXU : taille d'un pixel en unités de l'étage en cours de dessin (mise à jour par le moteur) */
let PXU=1;

/* couleurs */
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),
  mix=(a,b,t)=>{const B=rgb(b);return'#'+rgb(a).map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')},
  rgba=(h,a)=>`rgba(${rgb(h)},${a})`;

/* boule éclairée en haut à gauche (teintes calculées une fois par couleur) ; à quelques pixels, un simple disque suffit */
const SH=new Map(),shade=col=>{let s=SH.get(col);if(!s)SH.set(col,s=[mix(col,'#ffffff',.6),col,mix(col,'#000000',.4)]);return s};
function ball(c,x,y,r,col){if(r<3*PXU){disc(c,x,y,r,col);return}const s=shade(col);
  const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);g.addColorStop(0,s[0]);g.addColorStop(.45,s[1]);g.addColorStop(1,s[2]);
  c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
/* ellipse éclairée de la même façon, tournée de a */
function egg(c,x,y,rx,ry,col,a=0){c.save();c.translate(x,y);c.rotate(a);c.scale(rx,ry);const p=PXU;PXU/=Math.min(rx,ry);orb(c,0,0,1,col);PXU=p;c.restore()}
const disc=(c,x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()};
/* halo lumineux */
function glow(c,x,y,r,col,a=1){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(.25,rgba(col,a*.5));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}

/* chemins préparés une fois (Path2D) et redessinés à chaque image, quelle que soit l'échelle */
const path=f=>{const p=new Path2D();f(p);return p};
const oval=(p,x,y,rx,ry,a=0)=>{p.moveTo(x+rx*Math.cos(a),y+rx*Math.sin(a));p.ellipse(x,y,rx,ry,a,0,TAU)};
/* plusieurs disques dans un seul chemin : [x,y,r, x,y,r, ...] */
const blobs=L=>path(p=>{for(let i=0;i<L.length;i+=3){p.moveTo(L[i]+L[i+2],L[i+1]);p.arc(L[i],L[i+1],L[i+2],0,TAU)}});
const rrect=(p,x,y,w,h,r)=>{p.moveTo(x+r,y);p.arcTo(x+w,y,x+w,y+h,r);p.arcTo(x+w,y+h,x,y+h,r);p.arcTo(x,y+h,x,y,r);p.arcTo(x,y,x+w,y,r);p.closePath()};
/* ligne lissée passant au milieu des points [[x,y],...] */
function curve(p,P){p.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++)p.quadraticCurveTo(P[i][0],P[i][1],(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2);const l=P[P.length-1];p.lineTo(l[0],l[1])}
const stroke=(c,p,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.stroke(p)},fill=(c,p,col)=>{c.fillStyle=col;c.fill(p)};
/* trait en relief (tube) : ombre large, couleur, puis reflet fin décalé vers la lumière (en haut à gauche) */
function tubeS(c,p,col,w){const s=shade(col);stroke(c,p,s[2],w);stroke(c,p,col,w*.74);c.save();c.translate(-w*.12,-w*.15);stroke(c,p,rgba(s[0],.7),w*.26);c.restore()}
/* ellipses en relief préparées une fois : ombre portée en bas à droite, corps, reflet en haut à gauche ; L = [[x,y,rx,ry?,angle?],...] */
function relief(L){const s=new Path2D(),b=new Path2D(),h=new Path2D();L.forEach(([x,y,rx,ry=rx,a=0])=>{const m=Math.min(rx,ry);oval(s,x+m*.22,y+m*.28,rx,ry,a);oval(b,x,y,rx,ry,a);oval(h,x-m*.3,y-m*.35,rx*.42,ry*.42,a)});return{s,b,h}}
function drawRelief(c,P,col,sh=.45){const s=shade(col);fill(c,P.s,`rgba(0,0,0,${sh})`);fill(c,P.b,col);fill(c,P.h,rgba(s[0],.65))}
/* image préparée hors écran (galaxies, toile cosmique) */
const off=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c};

/* sphère brillante façon rendu 3D : dégradé de la lumière (en haut à gauche) à l'ombre, lumière renvoyée en bas à droite, reflet net.
   Peinte une fois par couleur dans une image (jusqu’à 128 px de rayon à l’écran), en vectoriel au-delà ; à quelques pixels, un simple disque */
function paintOrb(g,x,y,r,col,sp=1){const b=g.createRadialGradient(x-r*.34,y-r*.38,0,x,y,r);
  b.addColorStop(0,mix(col,'#ffffff',.55));b.addColorStop(.28,mix(col,'#ffffff',.15));b.addColorStop(.62,col);b.addColorStop(.9,mix(col,'#000000',.38));b.addColorStop(1,mix(col,'#000000',.52));
  g.fillStyle=b;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.save();g.clip();
  const k=g.createRadialGradient(x+r*.5,y+r*.55,0,x+r*.5,y+r*.55,r*.62);k.addColorStop(0,rgba(mix(col,'#ffffff',.4),.38));k.addColorStop(1,rgba(col,0));g.fillStyle=k;g.fillRect(x-r,y-r,2*r,2*r);g.restore();
  if(!sp)return;g.save();g.translate(x-r*.36,y-r*.42);g.rotate(-.7);g.scale(1,.62);const s=g.createRadialGradient(0,0,0,0,0,r*.3);
  s.addColorStop(0,`rgba(255,255,255,${.9*sp})`);s.addColorStop(.45,`rgba(255,255,255,${.35*sp})`);s.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=s;g.beginPath();g.arc(0,0,r*.3,0,TAU);g.fill();g.restore()}
const ORB=new Map();
function orb(c,x,y,r,col,sp=1){if(r<2.5*PXU){disc(c,x,y,r,col);return}if(r>128*PXU){paintOrb(c,x,y,r,col,sp);return}
  const key=col+sp;let s=ORB.get(key);if(!s)ORB.set(key,s=off(388,388,g=>paintOrb(g,194,194,192,col,sp)));c.drawImage(s,x-r*194/192,y-r*194/192,r*388/192,r*388/192)}
/* ombre douce au contact, posée sur ce qui est derrière avant de dessiner une sphère par-dessus */
function contact(c,x,y,r,a=.4){if(r<3*PXU)return;const g=c.createRadialGradient(x+r*.1,y+r*.14,r*.82,x+r*.1,y+r*.14,r*1.32);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=g;c.fillRect(x-r*1.4,y-r*1.4,r*2.9,r*2.9)}
/* bâtonnet cylindrique de (x1,y1) à (x2,y2), de largeur w : bords sombres, reflet le long du côté éclairé */
function stick(c,x1,y1,x2,y2,w,col){if(x2<x1)[x1,y1,x2,y2]=[x2,y2,x1,y1];const l=Math.hypot(x2-x1,y2-y1);if(l<1e-9)return;c.save();c.translate(x1,y1);c.rotate(Math.atan2(y2-y1,x2-x1));
  const g=c.createLinearGradient(0,-w/2,0,w/2);g.addColorStop(0,mix(col,'#000000',.4));g.addColorStop(.22,mix(col,'#ffffff',.6));g.addColorStop(.45,col);g.addColorStop(1,mix(col,'#000000',.5));
  c.fillStyle=g;c.fillRect(0,-w/2,l,w);c.restore()}
/* tube brillant le long d'un chemin : ombre, couleur, reflet large et doux, puis filet de lumière */
function tubeG(c,p,col,w){const s=shade(col);stroke(c,p,s[2],w);stroke(c,p,col,w*.78);c.save();c.translate(-w*.1,-w*.14);stroke(c,p,rgba(s[0],.55),w*.38);c.translate(-w*.04,-w*.05);stroke(c,p,'rgba(255,255,255,.55)',w*.1);c.restore()}
const gauss=()=>{let s=0;for(let i=0;i<4;i++)s+=Math.random();return(s-2)/1.15};
/* segment effilé et brillant (pattes, antennes) de (x1,y1) à (x2,y2), de largeur w1 à w2 : côté tourné vers la lumière plus clair, filet de reflet */
function taper(c,x1,y1,x2,y2,w1,w2,col){const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy)||1e-9;let nx=-dy/l,ny=dx/l;if(nx+ny>0){nx=-nx;ny=-ny}
  const a1=w1/2,a2=w2/2,m=Math.max(a1,a2),mx=(x1+x2)/2,my=(y1+y2)/2,g=c.createLinearGradient(mx+nx*m,my+ny*m,mx-nx*m,my-ny*m);
  g.addColorStop(0,mix(col,'#ffffff',.38));g.addColorStop(.38,col);g.addColorStop(1,mix(col,'#000000',.5));c.fillStyle=g;
  c.beginPath();c.moveTo(x1+nx*a1,y1+ny*a1);c.lineTo(x2+nx*a2,y2+ny*a2);c.lineTo(x2-nx*a2,y2-ny*a2);c.lineTo(x1-nx*a1,y1-ny*a1);c.closePath();c.fill();
  c.beginPath();c.arc(x1,y1,a1,0,TAU);c.arc(x2,y2,a2,0,TAU);c.fill();
  c.beginPath();c.moveTo(x1+nx*a1*.45,y1+ny*a1*.45);c.lineTo(x2+nx*a2*.45,y2+ny*a2*.45);c.strokeStyle='rgba(255,235,220,.45)';c.lineWidth=Math.min(a1,a2)*.35;c.lineCap='round';c.stroke()}
/* feuillage : chaque masse [x,y,R] devient un amas de petites touches de feuilles, prêtes pour drawRelief ou leaves */
function foliage(L,n=14,k=[.22,.4]){const B=[];L.forEach(([x,y,R])=>{for(let i=0;i<n;i++){const a=rnd(0,TAU),d=Math.sqrt(Math.random())*R*.8,r=R*rnd(k[0],k[1]);B.push([x+Math.cos(a)*d,y+Math.sin(a)*d*.85,r,r*.85,a])}});
  B.sort((a,b)=>a[1]-b[1]);return relief(B)}
/* feuillage voilé par la brume : pas d'ombre portée, reflets doux */
function leaves(c,P,col,h=.55){fill(c,P.b,col);fill(c,P.h,rgba(mix(col,'#ffffff',.3),h))}
/* bruit de valeur lissé (2D) et sa somme d'octaves : relief, taches de végétation, nuages */
const hash2=(i,j)=>{let h=(i*374761393+j*668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295};
function vnoise(x,y){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,a=hash2(i,j),b=hash2(i+1,j),c=hash2(i,j+1),d=hash2(i+1,j+1),s=u*u*(3-2*u),t=v*v*(3-2*v);return a+(b-a)*s+(c-a)*t+(a-b-c+d)*s*t}
function fbm(x,y,o=4){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*vnoise(x*f+i*17.3,y*f-i*9.1);f*=2.03;a*=.5}return s/(1-Math.pow(.5,o))}
/* le même bruit en 3D (pour la sphère terrestre, sans couture) */
const hash3=(i,j,k)=>hash2(i+Math.imul(k,7919),j-Math.imul(k,104729));
function vnoise3(x,y,z){const i=Math.floor(x),j=Math.floor(y),k=Math.floor(z),u=x-i,v=y-j,w=z-k,s=u*u*(3-2*u),t=v*v*(3-2*v),r=w*w*(3-2*w),
  l=(a,b,q)=>a+(b-a)*q,f=kk=>l(l(hash3(i,j,kk),hash3(i+1,j,kk),s),l(hash3(i,j+1,kk),hash3(i+1,j+1,kk),s),t);return l(f(k),f(k+1),r)}
function fbm3(x,y,z,o=4){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*vnoise3(x*f+i*17.3,y*f-i*9.1,z*f+i*5.7);f*=2.03;a*=.5}return s/(1-Math.pow(.5,o))}
/* image calculée pixel par pixel en tâche de fond, par tranches de lignes, pour ne pas retarder le départ du voyage ; c.ready passe à 1 quand elle est prête.
   row(d,j,w) remplit la ligne j des données RVBA d */
function bake(w,h,row){const c=document.createElement('canvas');c.width=w;c.height=h;c.ready=0;const g=c.getContext('2d'),id=g.createImageData(w,h);let j=0;
  const step=()=>{const t=performance.now();while(j<h&&performance.now()-t<8)row(id.data,j++,w);if(j<h)setTimeout(step,0);else{g.putImageData(id,0,0);c.ready=1}};setTimeout(step,0);return c}
