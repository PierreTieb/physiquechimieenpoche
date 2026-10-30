/* Étages 9 à 19 : des enfants en forêt au Superamas de la Vierge (même contrat que levels-micro2d.js). */

/* 9 · une enfant (1,30 m) et un adulte (1,75 m) en forêt (1 unité = 0,35 m) ; la fourmi est à leurs pieds, entre les deux */
/* les deux personnages sont des images posées dans le décor : source, partie visible de l'image (haut et bas, en pixels), taille réelle (m), place des pieds (x) */
const PEOPLE=[['img/fille.png',22,394,1.3,-.9],['img/mineur.png',94,656,1.75,1.75]].map(([src,top,bot,m,x])=>{const img=new Image();img.src=src;return{img,top,bot,m,x}});
function people(c){PEOPLE.forEach(({img,top,bot,m,x})=>{if(!img.complete||!img.naturalWidth)return;const k=m/.35/(bot-top),w=img.naturalWidth*k;
  c.beginPath();c.ellipse(x+.05,0,w*.42,.12,0,0,TAU);c.fillStyle='rgba(30,20,10,.28)';c.fill();c.drawImage(img,x-w/2,-bot*k,w,img.naturalHeight*k)})}
/* tronc cylindrique : dégradé de gauche (éclairé) à droite (ombre) */
function trunk(c,x,w,y0,y1,col){const g=c.createLinearGradient(x-w/2,0,x+w/2,0),s=shade(col);g.addColorStop(0,mix(col,'#ffffff',.18));g.addColorStop(.35,col);g.addColorStop(1,s[2]);c.fillStyle=g;c.fillRect(x-w/2,y0,w,y1-y0)}
function L9(){const far=Array.from({length:30},(_,i)=>[rnd(-28,28),rnd(.4,1.5),i%3]),FC=['#b2c8b4','#97b09a','#7d9580'],
    /* profondeur : des plans de feuillage de plus en plus voilés par la brume entre les troncs, et des buissons au pied */
    fol=[[90,-11,-3.5,.8,1.6],[70,-7.5,-2.2,.6,1.2]].map(([n,y0,y1,r0,r1])=>foliage(Array.from({length:n},()=>[rnd(-30,30),rnd(y0,y1),rnd(r0,r1)]),16)),FF=['#b9d1b6','#93b892'],
    bush=[['#2f6a2a',.5,.9],['#4a8c3a',.4,.7]].map(([col,r0,r1])=>[col,foliage(Array.from({length:45},()=>{const r=rnd(r0,r1),x=rnd(-30,30);return[Math.abs(x+.3)<2.6?x+(x<0?-3:3):x,-r*.55,r]}),14,[.2,.34])]),
    litter=['#b5651d','#d08a3a','#8a5a2a','#c7a04a'].map(()=>relief(Array.from({length:55},()=>{const r=rnd(.08,.2);return[rnd(-30,30),rnd(.02,.4),r,r*rnd(.35,.6),rnd(0,TAU)]}))),
    fern=path(p=>[[-3.6,1],[4.6,.8],[-9,1.2]].forEach(([x,s])=>{for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*.32,l=s*rnd(1.4,1.9),ex=x+Math.cos(a)*l,ey=Math.sin(a)*l*.8;
      p.moveTo(x,0);p.quadraticCurveTo(x+Math.cos(a)*l*.5,-l*.7*Math.abs(Math.sin(a)),ex,ey);
      for(let j=1;j<9;j++){const t=j/9,px=lerp(x,ex,t),py=lerp(0,ey,t)-Math.sin(t*Math.PI)*l*.12,ll=.22*(1-t*.8),na=a+Math.PI/2;p.moveTo(px,py);p.lineTo(px+Math.cos(na)*ll,py+Math.sin(na)*ll-ll*.4);p.moveTo(px,py);p.lineTo(px-Math.cos(na)*ll,py-Math.sin(na)*ll-ll*.4)}}})),
    bark=path(p=>[[-6.5,2.2],[7.6,1.6]].forEach(([x,w])=>{for(let k=0;k<9;k++){let bx=x+rnd(-w*.42,w*.42),by=0;p.moveTo(bx,by);while(by>-30){by-=rnd(.5,1.4);bx+=rnd(-.08,.08);p.lineTo(bx,by)}}})),
    moss=relief(Array.from({length:30},()=>[-6.5+rnd(-1,1),-rnd(0,2.5),rnd(.1,.25),rnd(.06,.15),0])),
    /* sol : touffes d'herbe et de mousse sur la ligne du sol, grains de terre clairs et sombres dessous */
    tuft=path(p=>{for(let i=0;i<260;i++){const x=rnd(-30,30),h=rnd(.12,.45);if(Math.abs(x-.3)<2.4&&Math.random()<.7)continue;p.moveTo(x,.02);p.quadraticCurveTo(x+rnd(-.05,.05),-h*.6,x+rnd(-.12,.12),-h)}}),
    soil=[0,1].map(()=>blobs(Array.from({length:260},()=>[rnd(-30,30),rnd(.15,4),rnd(.02,.07)]).flat())),
    shafts=path(p=>[[-3,1.6],[2.5,1],[6,1.3]].forEach(([x,w])=>{p.moveTo(x-8,-30);p.lineTo(x-8+w,-30);p.lineTo(x+w*1.6,0);p.lineTo(x,0);p.closePath()}));
  return{a:[.55,0],c:[.3,-2.2],
    back:(c,v)=>{const gs=c.createLinearGradient(0,-14,0,0);gs.addColorStop(0,'#eef5e4');gs.addColorStop(1,'#b5d0b8');c.fillStyle=gs;c.fillRect(v.x0,v.y0,v.x1-v.x0,Math.max(0,-v.y0));
      far.forEach(([x,w,l])=>{if(l==0){c.fillStyle=FC[0];c.fillRect(x-w/2,-60,w,60)}});leaves(c,fol[0],FF[0],.4);
      far.forEach(([x,w,l])=>{if(l==1){c.fillStyle=FC[1];c.fillRect(x-w/2,-60,w,60)}});leaves(c,fol[1],FF[1],.5);
      far.forEach(([x,w,l])=>{if(l==2)trunk(c,x,w,-60,0,FC[2])});
      const gl=c.createLinearGradient(0,-30,0,0);gl.addColorStop(0,'rgba(255,250,220,.28)');gl.addColorStop(1,'rgba(255,250,220,0)');fill(c,shafts,gl);
      trunk(c,-6.5,2.2,-60,0,'#6b4f3a');trunk(c,7.6,1.6,-60,0,'#6b4f3a');stroke(c,bark,'rgba(35,22,12,.45)',.07);drawRelief(c,moss,'#6f9a3c',.25);
      bush.forEach(([col,P])=>drawRelief(c,P,col,.18));
      const gg=c.createLinearGradient(0,0,0,3);gg.addColorStop(0,'#6b5236');gg.addColorStop(1,'#4e3a26');c.fillStyle=gg;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      fill(c,soil[0],'rgba(40,26,14,.5)');fill(c,soil[1],'rgba(170,135,95,.35)');c.lineCap='round';stroke(c,tuft,'#4f7f30',.04);
      ['#b5651d','#d08a3a','#8a5a2a','#c7a04a'].forEach((col,i)=>drawRelief(c,litter[i],col,.3));stroke(c,fern,'#3f7a2c',.05);
      [[2.7,.45],[3.1,.3]].forEach(([x,s])=>{trunk(c,x,.12*s/.3,-s*.9,0,'#efe4cf');c.save();c.beginPath();c.ellipse(x,-s*.9,s*.55,s*.42,0,Math.PI,TAU);c.closePath();
        const gm=c.createRadialGradient(x-s*.2,-s*1.15,0,x,-s*.9,s*.6);gm.addColorStop(0,'#ff7a5c');gm.addColorStop(1,'#a8281c');c.fillStyle=gm;c.fill();c.restore();disc(c,x-s*.2,-s*1.05,s*.07,'#fff');disc(c,x+s*.18,-s*1.0,s*.06,'#fff')})},
    main:c=>people(c)}}

/* 10 · les grands arbres (1 unité = 4 m) : des chênes de 25 à 32 m ; les enfants, au pied, mesurent moins d'un vingtième de leur hauteur */
function L10(){const T=[[-13,6.8,.32,2],[-9.5,7.2,.35,2.2],[-6,6.4,.3,1.9],[-2.8,7.9,.4,2.3],[3.6,7.5,.38,2.2],[6.8,6.2,.3,1.8],[10,7,.33,2],[13.5,7.4,.36,2.1]],cr=[],hi=[],
    tp=T.map(([x,h,w])=>path(p=>{p.moveTo(x-w,0);p.quadraticCurveTo(x-w*.4,-.4,x-w*.35,-h+.6);p.lineTo(x+w*.35,-h+.6);p.quadraticCurveTo(x+w*.4,-.4,x+w,0);p.closePath()})),
    br=path(p=>T.forEach(([x,h])=>{for(let k=0;k<4;k++){const y=-h*rnd(.55,.8),s=k%2?1:-1;p.moveTo(x,y);p.quadraticCurveTo(x+s*.4,y-.35,x+s*rnd(.55,.9),y-rnd(.6,1))}})),
    farF=foliage(Array.from({length:110},()=>{const r=rnd(.9,1.9);return[rnd(-26,26),-rnd(r*.5,5.5),r]}),16),bush=foliage(Array.from({length:50},()=>[rnd(-24,24),-rnd(.1,.3),rnd(.2,.45)]),10),
    bark=path(p=>T.forEach(([x,h,w])=>{for(let k=0;k<6;k++){let bx=x+rnd(-w*.5,w*.5),by=0;p.moveTo(bx,by);while(by>-h+1){by-=rnd(.3,.8);bx+=rnd(-.03,.03);p.lineTo(bx,by)}}}));
  T.forEach(([x,h,,r])=>{for(let k=0;k<12;k++){const a=rnd(0,TAU),d=Math.sqrt(Math.random())*r*.75,cx0=x+Math.cos(a)*d*1.2,cy0=-h+Math.sin(a)*d*.8,rr=r*rnd(.36,.5);cr.push([cx0,cy0,rr]);if(cy0<-h+.2)hi.push([cx0-rr*.2,cy0-rr*.25,rr*.45])}});
  /* houppiers : une masse de feuillage sombre, puis une couche éclairée décalée vers la lumière (en haut à gauche) */
  const crowns=foliage(cr,18,[.2,.34]),light=foliage(cr.map(([x,y,r])=>[x-r*.22,y-r*.28,r*.7]),12,[.2,.32]);
  return{a:[.4,0],c:[0,-3.6],main:(c,v)=>{const gs=c.createLinearGradient(0,-12,0,0);gs.addColorStop(0,'#78b8ec');gs.addColorStop(1,'#d6ecf5');c.fillStyle=gs;c.fillRect(v.x0,v.y0,v.x1-v.x0,Math.max(0,-v.y0));
      leaves(c,farF,'#9dbfa6',.45);
      const gg=c.createLinearGradient(0,0,0,2);gg.addColorStop(0,'#6a8a40');gg.addColorStop(1,'#4c6a2c');c.fillStyle=gg;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      T.forEach(([x,,,r])=>{c.beginPath();c.ellipse(x+.6,.05,r*.9,.14,0,0,TAU);c.fillStyle='rgba(20,40,10,.25)';c.fill()});
      T.forEach(([x,,w],i)=>{const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'#8a6a50');g.addColorStop(.4,'#6b4f3a');g.addColorStop(1,'#3e2c1f');fill(c,tp[i],g)});
      c.lineCap='round';stroke(c,bark,'rgba(30,20,12,.35)',.05);tubeS(c,br,'#5e4532',.12);drawRelief(c,crowns,'#2f6e2a',.3);leaves(c,light,'#4f9a3c',.6);drawRelief(c,bush,'#3f7a2c',.25);
      v.tag('Chêne · 32 m',-2.8,-10.2,.9)}}}

/* 11 · la forêt vue d'en haut (1 unité = 300 m) : la forêt de Tronçais, au centre de la France ; les enfants sont dans la clairière */
function L11(){const edge=Array.from({length:40},(_,i)=>{const a=i/40*TAU,r=10+Math.sin(a*3)*1.6+Math.sin(a*7+1)*.8+rnd(-.4,.4);return[Math.cos(a)*r*1.2,Math.sin(a)*r*.85]}),
    inF=(x,y)=>{const a=Math.atan2(y/.85,x/1.2),i=Math.round((a<0?a+TAU:a)/TAU*40)%40,e=edge[i];return Math.hypot(x/1.2,y/.85)<Math.hypot(e[0]/1.2,e[1]/.85)-.2},
    forest=path(p=>{p.moveTo(...edge[0]);curve(p,[...edge,edge[0],edge[1]]);p.closePath()}),
    fc=['#e3c75a','#9cc25a','#b88a52','#c9d77a','#7fae4a'],fields=fc.map(()=>new Path2D()),hedge=new Path2D(),near=[[],[],[]],
    /* houppiers vus d'en haut : ombre portée en bas à droite, couronne (cinq verts), reflet en haut à gauche */
    CC=['#2c6a2a','#3a7d32','#4a8c38','#5d9a3c','#7a9e46'],crowns=(L,x)=>{const S=new Path2D(),B=CC.map(()=>new Path2D()),Hh=new Path2D();
      L.forEach(([X,Y,r])=>{S.moveTo(X+r*1.3,Y+r*.35);S.arc(X+r*.3,Y+r*.35,r,0,TAU);const b=B[Math.random()*Math.random()*5|0];b.moveTo(X+r,Y);b.arc(X,Y,r,0,TAU);Hh.moveTo(X-r*.3+r*.45,Y-r*.35);Hh.arc(X-r*.3,Y-r*.35,r*.45,0,TAU)});
      x.fillStyle='rgba(8,28,8,.55)';x.fill(S);B.forEach((b,i)=>{x.fillStyle=CC[i];x.fill(b)});x.fillStyle='rgba(175,215,120,.42)';x.fill(Hh)},
    /* rivière qui méandre : la ligne de base est densifiée puis ondulée perpendiculairement */
    RB=[[-40,-14],[-14,-9],[-6,-4],[3,-2.5],[8,1],[15,3],[40,9]],RP=[];
  for(let i=0;i<RB.length-1;i++)for(let t=0;t<1;t+=.02){const [x0,y0]=RB[i],[x1,y1]=RB[i+1],l=Math.hypot(x1-x0,y1-y0),d=(i*50+t*50)*.06*l/10;RP.push([lerp(x0,x1,t)-(y1-y0)/l*Math.sin(d*2.4)*.35,lerp(y0,y1,t)+(x1-x0)/l*Math.sin(d*2.4)*.35])}
  /* bocage : une mosaïque de champs sans chevauchement (bandes de largeur variable, découpées en parcelles), bordés de haies */
  for(let x=-40;x<40;){const w=rnd(.6,1.4);for(let y=-30;y<30;){const h=rnd(.45,1.2);fields[Math.random()*fc.length|0].rect(x,y,w,h);if(Math.random()<.7)hedge.rect(x,y,w,h);y+=h}x+=w}
  /* étangs de la forêt, aux bords irréguliers */
  const pond=([cx,cy,rx,ry])=>path(p=>{for(let i=0;i<=24;i++){const a=i/24*TAU,k=1+Math.sin(a*3+cx)*.15+Math.sin(a*5)*.08;i?p.lineTo(cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k):p.moveTo(cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k)}p.closePath()}),
    ponds=[[-4.2,3.1,.9,.45],[5.2,-4.6,.6,.32]].map(pond);
  /* la canopée : des dizaines de milliers de houppiers de 10 à 20 m, peints une fois dans une image (±15 unités) */
  const FE=15,canopy=off(2048,2048,(x,w)=>{const k=w/(2*FE),o=w/2;x.translate(o,o);x.scale(k,k);x.fillStyle='#1d461d';x.fill(forest);x.clip(forest);
    /* bouquets d'arbres : de près, chaque bouquet est fait de plusieurs houppiers ; de loin, ils donnent à la canopée son grain bosselé */
    const L=[];for(let i=0;i<16000;i++){const X=rnd(-FE,FE),Y=rnd(-11,11),R=rnd(.07,.15);for(let j=0;j<4;j++){const a=rnd(0,TAU),d=Math.sqrt(Math.random())*R*.6;L.push([X+Math.cos(a)*d,Y+Math.sin(a)*d,R*rnd(.45,.7)])}}crowns(L,x);
    ponds.forEach(p=>{x.fillStyle='#4f7a3a';x.lineWidth=.08;x.strokeStyle='#5e8a44';x.stroke(p);const g=x.createLinearGradient(0,-6,0,6);g.addColorStop(0,'#3f86c6');g.addColorStop(1,'#2b6aa8');x.fillStyle=g;x.fill(p);
      x.lineWidth=.02;x.strokeStyle='rgba(220,240,255,.5)';x.stroke(p)})});
  for(let i=0;i<800;i++){const a=rnd(0,TAU),r=rnd(.25,1.2),x=Math.cos(a)*r*1.25,y=Math.sin(a)*r;if(Math.hypot(x/.25,y/.2)>1.05)near[i%3].push([x,y,rnd(.035,.065)])}
  /* arbres de bord de rivière, et ceux qui entourent la clairière (dessinés à part pour rester nets de près) */
  RP.forEach(([x,y],i)=>{if(i%2)return;[-1,1].forEach(k=>near[0].push([x+k*rnd(.13,.2),y+rnd(-.08,.08),rnd(.03,.05)]))});
  const nearL=near.flat(),
    river=path(p=>curve(p,RP)),road=path(p=>curve(p,[[-30,12],[-8,4],[-1.2,.9],[.3,.25],[2,-1],[9,-6],[30,-16]])),
    /* village : maisons aux toits à deux pans (un côté au soleil, l'autre à l'ombre) */
    H=Array.from({length:45},()=>[13+rnd(-.5,.5),7+rnd(-.4,.4)]),roofA=path(p=>H.forEach(([x,y])=>p.rect(x,y,.025,.04))),roofB=path(p=>H.forEach(([x,y])=>p.rect(x+.025,y,.025,.04))),
    hsh=path(p=>H.forEach(([x,y])=>p.rect(x+.012,y+.012,.05,.04)));
  return{a:[0,0],main:(c,v)=>{fields.forEach((p,i)=>fill(c,p,fc[i]));stroke(c,hedge,'rgba(45,85,35,.55)',Math.max(.02,1.2*v.px));
      c.lineCap='round';c.lineJoin='round';stroke(c,river,'#4d6e34',.2);stroke(c,river,'#2f74b8',.11);stroke(c,river,'rgba(150,200,240,.6)',.03);
      c.drawImage(canopy,-FE,-FE,2*FE,2*FE);
      const gc=c.createRadialGradient(-.05,-.05,0,0,0,.3);gc.addColorStop(0,'#a8cf6a');gc.addColorStop(1,'#82b252');c.beginPath();c.ellipse(0,0,.27,.22,0,0,TAU);c.fillStyle=gc;c.fill();crowns(nearL,c);
      stroke(c,river,'#2f74b8',.11);stroke(c,river,'rgba(150,200,240,.6)',.03);
      stroke(c,road,'#b8a47a',Math.max(.035,2.2*v.px));stroke(c,road,'#e2d2a8',Math.max(.025,1.5*v.px));fill(c,hsh,'rgba(30,30,20,.35)');fill(c,roofA,'#d0644a');fill(c,roofB,'#9a4030');
      v.tag('Forêt de Tronçais',0,-6,.9);v.tag('Clairière',.3,0,sm(-.6,-.2,v.d)*(1-sm(.4,.7,v.d)))}}}

/* 12 · la France (1 unité ≈ 110 km, soit un degré de latitude) */
/* même projection que le globe de l'étage suivant (vue de l'espace au-dessus du centre de la France), pour que la carte s'y superpose exactement en dézoomant ;
   FP donne la position d'un lieu (longitude, latitude) en unités de cet étage, FI fait l'inverse */
const LON0=2.5,LAT0=46.5,EK=6.371e6/1.1e5,SP0=Math.sin(LAT0*R),CP0=Math.cos(LAT0*R),
  FP=(lo,la)=>{const l=(lo-LON0)*R,f=la*R;return[EK*Math.cos(f)*Math.sin(l),-EK*(CP0*Math.sin(f)-SP0*Math.cos(f)*Math.cos(l))]},
  FI=(x,y)=>{const X=x/EK,Y=y/EK,z=Math.sqrt(Math.max(0,1-X*X-Y*Y));return[LON0+Math.atan2(X,z*CP0+Y*SP0)/R,Math.asin(cl(z*SP0-Y*CP0))/R]};
function L12(){const land=path(p=>LAND.forEach(r=>{let a=1e9,b=-1e9,d=1e9,e=-1e9;for(let i=0;i<r.length;i+=2){a=Math.min(a,r[i]);b=Math.max(b,r[i]);d=Math.min(d,r[i+1]);e=Math.max(e,r[i+1])}
      if(b<-30||a>45||e<25||d>75)return;for(let i=0;i<r.length;i+=2)p[i?'lineTo':'moveTo'](...FP(r[i],r[i+1]));p.closePath()})),
    /* relief : chaînes de montagnes (lignes de crête en lon/lat, hauteur en km, largeur en degrés) et massifs, rendus rugueux par du bruit */
    RID=[[[[5.6,44],[6.6,44.5],[6.9,45.3],[6.9,45.9],[7.6,46],[8.6,46.5],[10,46.5],[11.5,46.7],[13,47]],2.7,.95],[[[-1.8,43.1],[-.5,42.85],[.7,42.7],[1.8,42.55],[2.9,42.45]],2.2,.5],
      [[[5.6,46.2],[6.2,46.8],[7,47.4]],.75,.35],[[[6.85,47.8],[7.2,48.5]],.75,.4],[[[3.6,44.1],[4.1,44.6]],.8,.45]],
    MAS=[[2.9,45.3,1.1,1.1],[9.05,42.2,.35,1.8],[-2.5,48.2,1.4,.25],[5,49.9,.6,.45],[-5,40.5,3,.9],[-1,41.5,.8,1.4]],
    elev=(lo,la)=>{let e=0;RID.forEach(([P,h,w])=>{let d=1e9;for(let i=0;i<P.length-1;i++){const[x0,y0]=P[i],[x1,y1]=P[i+1],dx=x1-x0,dy=y1-y0,t=cl(((lo-x0)*dx+(la-y0)*dy)/(dx*dx+dy*dy));d=Math.min(d,Math.hypot(lo-x0-dx*t,(la-y0-dy*t)*1.4))}d+=(fbm(lo*1.7,la*1.7,3)-.5)*w*.9;e+=h*Math.exp(-((Math.max(0,d)/w)**2))});
      MAS.forEach(([x,y,r,h])=>e+=h*Math.exp(-((Math.hypot(lo-x,(la-y)*1.4)/r)**2)));
      /* crêtes et vallées : bruit « en arêtes », plus marqué en altitude */
      const rg=1-Math.abs(2*fbm(lo*3.1,la*3.1,4)-1);return e*(.35+.85*rg*rg+.25*fbm(lo*7,la*7,2))},
    /* image du relief ombré (éclairé du nord-ouest), teintes selon l'altitude, taches de forêts et de cultures */
    /* l'image couvre le rectangle (dans la carte) qui contient la région de 6° O à 11,5° E et de 41° à 52° N ; ses bords se fondent dans le vert uni des terres */
    LO=[-6,11.5],LA=[41,52],BX=(()=>{const P=[];for(let k=0;k<=8;k++)P.push(FP(lerp(LO[0],LO[1],k/8),LA[0]),FP(lerp(LO[0],LO[1],k/8),LA[1]),FP(LO[0],lerp(LA[0],LA[1],k/8)),FP(LO[1],lerp(LA[0],LA[1],k/8)));
      const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);return[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]})(),
    RX=BX[0],RY=BX[1],RWu=BX[2]-BX[0],RHu=BX[3]-BX[1],RW=600,RH=Math.round(RW*RHu/RWu),
    ll=(i,j)=>FI(RX+RWu*(i+.5)/RW,RY+RHu*(j+.5)/RH),edge=(i,j)=>sm(0,.07,Math.min(i/RW,1-i/RW))*sm(0,.07,Math.min(j/RH,1-j/RH)),EL=new Float32Array(RW*(RH+2)),
    T=[[0,[92,162,78]],[.25,[128,170,88]],[.6,[176,176,116]],[1.1,[160,136,100]],[1.9,[142,124,110]],[2.4,[178,170,166]],[2.9,[244,246,250]]],tint=e=>{let k=0;while(k<T.length-2&&e>T[k+1][0])k++;const[a,A]=T[k],[b,B]=T[k+1],t=cl((e-a)/(b-a));return A.map((v,m)=>v+(B[m]-v)*t)},
    /* l'altitude d'une ligne est calculée juste avant d'en avoir besoin (une ligne d'avance pour la pente) */
    elRow=j=>{if(j<0||j>RH+1||EL[j*RW+1])return;for(let i=0;i<RW;i++)EL[j*RW+i]=elev(...ll(i,j))+1e-6},
    rel=bake(RW,RH,(d,j,w)=>{elRow(j);elRow(j+1);elRow(j+2);const E=(i,jj)=>EL[Math.max(0,jj)*w+Math.min(w-1,Math.max(0,i))];
      for(let i=0;i<w;i++){const gx=(E(i+1,j)-E(i-1,j))*3.2,gy=(E(i,j+1)-E(i,Math.max(0,j-1)))*3.2,n=Math.hypot(gx,gy,1),sh=cl((gx*.6+gy*.6+1)/n*.75+.3),
        /* plaines : grandes taches douces de forêts (plus sombres) et de cultures (plus claires) */
        q=ll(i,j),f=fbm(q[0]*4.5,q[1]*4.5,3),e=E(i,j),C=tint(e),k=e<.5?lerp(.88,1.06,sm(.3,.7,f)):1,o=(j*w+i)*4;
        d[o]=C[0]*sh*k;d[o+1]=C[1]*sh*k;d[o+2]=C[2]*sh*k;d[o+3]=255*edge(i,j)}}),
    /* fleuves (lon, lat) */
    RIV=[[[4.72,47.48],[4.4,48.1],[4.07,48.3],[3.4,48.4],[2.95,48.38],[2.66,48.54],[2.35,48.86],[2.05,48.95],[1.7,48.99],[1.48,49.09],[1.1,49.44],[.6,49.42],[.15,49.47]],
      [[4.22,44.84],[3.95,45.15],[4.08,45.6],[4.07,46.04],[3.98,46.48],[3.46,46.83],[3.16,46.99],[2.95,47.4],[2.63,47.69],[1.9,47.9],[1.33,47.59],[.69,47.39],[-.08,47.26],[-.55,47.42],[-1.55,47.21],[-2.2,47.27]],
      [[.7,42.8],[.72,43.1],[1.44,43.6],[1.1,43.95],[.62,44.2],[.17,44.5],[-.3,44.7],[-.57,44.84],[-.75,45.1],[-1.1,45.6]],[[2.8,45.5],[1.7,44.9],[.48,44.85],[-.24,44.92],[-.6,45.02]],
      [[6.15,46.2],[5.8,45.9],[4.83,45.76],[4.82,45.2],[4.89,44.93],[4.75,44.3],[4.81,43.95],[4.63,43.68],[4.6,43.35]],[[6,47.9],[5.4,47.4],[4.85,46.78],[4.83,46.3],[4.83,45.76]],
      [[7.59,47.56],[7.8,48.58],[8.2,49],[8.27,50],[7.6,50.4]],[[6.9,47.9],[6.45,48.17],[5.9,48.68],[6.18,49.12],[6.17,49.36],[6.4,49.7],[7.6,50.36]],[[5.6,48],[5.38,49.16],[4.94,49.7],[4.8,50.2],[4.86,50.47]]],
    rivers=path(p=>RIV.forEach(P=>curve(p,P.map(([lo,la])=>FP(lo,la))))),
    /* nuages au-dessus de la mer : quelques amas doux */
    CLD=[[-4.5,46.2],[-3.2,50.2],[6,41.9],[-7.5,48.5]].flatMap(([lo,la])=>{const[x,y]=FP(lo,la);return Array.from({length:9},()=>[x+rnd(-.5,.5),y+rnd(-.25,.25),rnd(.15,.38)])}),
    CITY=[['Paris',48.86,2.35],['Lyon',45.76,4.83],['Marseille',43.3,5.37],['Bordeaux',44.84,-.58],['Toulouse',43.6,1.44],['Lille',50.63,3.06],['Strasbourg',48.58,7.75],['Nantes',47.22,-1.55]];
  return{a:FP(2.69,46.63),main:(c,v)=>{
      /* mer : plus claire près des côtes (hauts-fonds) */
      c.lineJoin='round';[[.7,.06],[.42,.08],[.22,.1],[.1,.14]].forEach(([w,a])=>stroke(c,land,`rgba(140,210,245,${a})`,w));
      fill(c,land,'#5aa04c');c.save();c.clip(land);if(rel.ready)c.drawImage(rel,RX,RY,RWu,RHu);
      /* la forêt de Tronçais : une dizaine de kilomètres de chênes */
      const[tx,ty]=FP(2.69,46.63),gt=c.createRadialGradient(tx,ty,0,tx,ty,.07);gt.addColorStop(0,'rgba(31,74,28,.95)');gt.addColorStop(.6,'rgba(31,74,28,.7)');gt.addColorStop(1,'rgba(31,74,28,0)');c.fillStyle=gt;c.fillRect(tx-.07,ty-.07,.14,.14);
      c.lineCap='round';stroke(c,rivers,'#3d86cf',Math.max(.02,1.3*v.px));c.restore();
      c.beginPath();c.ellipse(...FP(6.55,46.43),.28,.08,-.25,0,TAU);c.fillStyle='#3d86cf';c.fill();stroke(c,land,'rgba(255,255,255,.35)',Math.max(.008,.8*v.px));
      CLD.forEach(([x,y,r])=>glow(c,x,y,r,'#ffffff',.4));
      CITY.forEach(([n,la,lo])=>{const[x,y]=FP(lo,la);disc(c,x,y,2.6*v.px,'#ffffff');v.tag(n,x,y)})}}}

/* 13 · la Terre (rayon 6 371 km = 3,6 unités), vue au-dessus de la France ; peinte une fois dans une image (océans, terres, déserts, glaces, nuages, ombre) */
function L13(){const p0=LAT0*R,pr=(lo,la)=>{const l=(lo-LON0)*R,f=la*R,x=Math.cos(f)*Math.sin(l),y=-(Math.cos(p0)*Math.sin(f)-Math.sin(p0)*Math.cos(f)*Math.cos(l)),
      cc=Math.sin(p0)*Math.sin(f)+Math.cos(p0)*Math.cos(f)*Math.cos(l);if(cc>=0)return[x,y,1];const n=Math.hypot(x,y)||1;return[x/n,y/n,0]};
  const land=path(p=>LAND.forEach(r=>{let vis=0;const Q=[];for(let i=0;i<r.length;i+=2){const q=pr(r[i],r[i+1]);vis|=q[2];Q.push(q)}if(!vis)return;Q.forEach((q,i)=>i?p.lineTo(q[0],q[1]):p.moveTo(q[0],q[1]));p.closePath()})),
    /* couleur du sol selon la latitude et la longitude : forêts tempérées et boréales, toundra, glaces, déserts, savanes, forêts tropicales, maquis méditerranéen */
    mixc=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),
    biome=(lo,la)=>{const al=Math.abs(la),n=fbm(lo*.25,la*.25,3);let c=[86,148,68];
      c=mixc(c,[132,148,80],sm(34,37,la)*(1-sm(43,45.5,la))*.7);c=mixc(c,[50,98,56],sm(52,60,al));c=mixc(c,[126,128,98],sm(64,71,al));
      const af=sm(-19,-15,lo)*(1-sm(50,58,lo)),sav=(sm(7,11,la)*(1-sm(14,17,la))+sm(-20,-16,la)*(1-sm(-9,-6,la)))*af;c=mixc(c,[168,160,86],cl(sav));
      const rf=(1-sm(4,9,al))*((sm(-80,-76,lo)*(1-sm(-38,-34,lo)))+(sm(8,10,lo)*(1-sm(30,33,lo))));c=mixc(c,[38,98,42],cl(rf));
      const de=cl(sm(14,19,la)*(1-sm(31,35,la))*sm(-18,-14,lo)*(1-sm(58,62,lo))+sm(36,40,la)*(1-sm(46,50,la))*sm(52,58,lo)*(1-sm(82,90,lo))*.85+sm(-29,-25,la)*(1-sm(-19,-16,la))*sm(13,15,lo)*(1-sm(24,27,lo))*.7)*(.75+.5*n);
      c=mixc(c,mixc([214,182,122],[190,150,98],fbm(lo*.6,la*.6,2)),cl(de));
      c=mixc(c,[236,240,245],cl(sm(74,80,al)+(sm(-58,-52,lo)*(1-sm(-25,-20,lo))*sm(60,64,la))));return c.map(v=>v*(.9+.2*n))},
    ER=3.6,E=1.15,N=1100,K=N/(2*E),O=N/2,sp=Math.sin(p0),cp=Math.cos(p0),Lv=[-.5,.55,.67].map(v=>v/Math.hypot(-.5,.55,.67)),Hv=[Lv[0],Lv[1],Lv[2]+1].map((v,_,A)=>v/Math.hypot(...A)),
    /* point du disque (X,Y en rayons terrestres, y vers le bas) : profondeur, latitude, longitude, éclairement */
    geo=(X,Y)=>{const z=Math.sqrt(Math.max(0,1-X*X-Y*Y));return[z,Math.asin(cl((z*sp-Y*cp+1)/2)*2-1)/R,((LON0+Math.atan2(X,z*cp+Y*sp)/R+540)%360)-180,Math.max(0,X*Lv[0]-Y*Lv[1]+z*Lv[2])]},
    mk=off(N,N,m=>{m.translate(O,O);m.scale(K,K);m.fillStyle='#fff';m.fill(land)}),M=mk.getContext('2d').getImageData(0,0,N,N).data,
    BL=off(N,N,m=>{m.filter='blur(12px)';m.drawImage(mk,0,0)}).getContext('2d').getImageData(0,0,N,N).data,
    /* surface : océan plus clair au-dessus des plateaux continentaux, terres colorées par leur biome, reflet du soleil, voile bleuté de l'atmosphère vers le bord */
    img=bake(N,N,(d,j,w)=>{for(let i=0;i<w;i++){const X=(i+.5-O)/K,Y=(j+.5-O)/K,r2=X*X+Y*Y;if(r2>1)continue;const[z,la,lo,lam]=geo(X,Y),o4=(j*w+i)*4,ld=M[o4+3]/255,sh=BL[o4+3]/255;
      let C=mixc([14,50,108],[34,104,166],Math.pow(sh,1.4)*.75);if(ld>0)C=mixc(C,biome(lo,la),ld);
      const spec=Math.pow(Math.max(0,X*Hv[0]-Y*Hv[1]+z*Hv[2]),45)*(1-ld)*190;C=C.map(v=>v*(.2+.9*lam)+spec);C=mixc(C,[110,170,255].map(v=>v*(.35+.7*lam)),Math.pow(1-z,2.2)*.75);
      d[o4]=C[0];d[o4+1]=C[1];d[o4+2]=C[2];d[o4+3]=255*cl((1-Math.sqrt(r2))*K)}}),
    /* nuages, à demi-résolution : volutes d'un bruit 3D déformé (pas de couture au pôle), nombreux à l'équateur et aux latitudes moyennes, rares vers 25° */
    NC=N/2,KC=NC/(2*E),OC=NC/2,
    clouds=bake(NC,NC,(d,j,w)=>{for(let i=0;i<w;i++){const X=(i+.5-OC)/KC,Y=(j+.5-OC)/KC,r2=X*X+Y*Y;if(r2>1)continue;const[z,la,lo,lam]=geo(X,Y),o4=(j*w+i)*4,
      f=la*R,g=lo*R,ux=Math.cos(f)*Math.cos(g)*2.6,uy=Math.cos(f)*Math.sin(g)*2.6,uz=Math.sin(f)*2.6,
      wx=ux+(fbm3(ux*1.2,uy*1.2,uz*1.2,3)-.5)*1.1,wy=uy+(fbm3(ux*1.2+5.2,uy*1.2+1.3,uz*1.2,3)-.5)*1.1,al=Math.abs(la),
      band=.18*Math.exp(-(((la-6)/7)**2))-.18*Math.exp(-(((al-24)/7)**2))+.1*sm(38,52,al),cd=sm(.53,.72,fbm3(wx*2.2,wy*2.2,uz*2.2,5)+band)*cl((1-Math.sqrt(r2))*KC)*(1-Math.pow(1-z,3)*.6);
      d[o4]=d[o4+1]=d[o4+2]=255*(.25+.8*lam);d[o4+3]=255*cd*.92}});
  return{a:[0,0],main:c=>{const ga=c.createRadialGradient(0,0,ER*.95,0,0,ER*1.13);ga.addColorStop(0,'rgba(111,176,255,.65)');ga.addColorStop(1,'rgba(111,176,255,0)');c.fillStyle=ga;c.fillRect(-ER*1.2,-ER*1.2,ER*2.4,ER*2.4);
    /* tant que les images ne sont pas prêtes : un globe simple (océan et terres) */
    if(img.ready)c.drawImage(img,-E*ER,-E*ER,2*E*ER,2*E*ER);else{c.save();c.scale(ER,ER);disc(c,0,0,1,'#1d5aa0');fill(c,land,'#4f8f45');c.restore()}
    if(clouds.ready)c.drawImage(clouds,-E*ER,-E*ER,2*E*ER,2*E*ER)}}}

/* 14 · la Terre et la Lune (1 unité = 100 000 km) : 384 400 km les séparent, 30 fois le diamètre de la Terre ; la Lune est 3,7 fois plus petite */
function L14(){const r=3.844,a=-35*R,mx=Math.cos(a)*r,my=Math.sin(a)*r;
  return{a:[0,0],main:(c,v)=>{c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=v.px;c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();
    orb(c,mx,my,Math.max(.01737,.9*v.px),'#c9c6c0');v.tag('Lune',mx,my)}}}

/* 15 · le système solaire jusqu'à Neptune (30 ua ; 1 ua = 0,15 unité). Le Soleil et les planètes sont dessinés à leur vraie taille, donc presque invisibles ;
   seul le Soleil garde un halo, de plus en plus petit et pâle quand on s'éloigne. Le nom de chaque planète s'affiche quand son orbite passe dans l'écran */
const MSS=30.07*AU/4.5,KA=AU/MSS;
function L15(){const PL=[['Mercure',.387,'#9a8f86',110],['Vénus',.723,'#E8C68A',200],['Terre',1,'#6fa8ff',40],['Mars',1.524,'#C1502E',300],['Jupiter',5.203,'#d8b48a',20],['Saturne',9.537,'#e8d29c',150],['Uranus',19.19,'#9fd8e0',250],['Neptune',30.07,'#6f8ff8',70]]
    .map(([n,a,col,an])=>[n,a*KA,col,Math.cos(an*R)*a*KA,-Math.sin(an*R)*a*KA]),SR=6.96e8/MSS,ring=(c,r0,r1,f)=>{c.beginPath();c.arc(0,0,r1,0,TAU);c.arc(0,0,r0,TAU,0,true);c.fillStyle=f;c.fill()};
  return{a:[KA*Math.cos(40*R),-KA*Math.sin(40*R)],
    back:(c,v)=>{const px=v.px;ring(c,2.2*KA,3.3*KA,'rgba(176,160,144,.14)');ring(c,30*KA,50*KA,'rgba(159,176,200,.07)');c.lineWidth=px;
      PL.forEach(([n,r,col,x,y])=>{if(r*v.q>1e6)return;c.strokeStyle=n=='Terre'?'rgba(140,190,255,.35)':'rgba(255,255,255,.18)';c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();disc(c,x,y,1.3*px,col);
        const f=r*v.q/v.mn;v.tag(n,x,y,sm(.47,.41,f)*(1-sm(.29,.23,f)))})},
    main:(c,v)=>{const rp=SR*v.q;if(rp>=12){glow(c,0,0,SR*3,'#ffb347',.8);ball(c,0,0,SR,'#FFC23A')}
      else{const k=rp/12,Rr=12*Math.pow(k,.15),a=Math.min(1,Math.pow(k,.12));glow(c,0,0,Rr*2.6*v.px,'#ffb347',a);disc(c,0,0,Rr*v.px,rgba('#fff4c0',a))}
      v.tag('Soleil',0,0,sm(-1.2,-.6,v.d))}}}

/* 16 · les étoiles voisines à moins de 12 al, à leur vraie position (distance en al, ascension droite en h, déclinaison en °) ; 1 unité = 2,64 al */
const NEAR=[['Proxima du Centaure',4.24,14.5,-62.7,'#ff9a6a',4],['Alpha du Centaure',4.37,14.66,-60.8,'#fff0c8',9,1],['Étoile de Barnard',5.96,17.96,4.7,'#ff8a5a',4,1],['Wolf 359',7.86,10.94,7,'#ff7a5a',3],
  ['Lalande 21185',8.31,11.06,35.97,'#ff9a6a',4],['Sirius',8.6,6.75,-16.7,'#cfe0ff',11,1],['Luyten 726-8',8.7,1.65,-17.95,'#ff7a5a',3],['Ross 154',9.69,18.83,-23.8,'#ff8a5a',3],['Ross 248',10.3,23.7,44.2,'#ff7a5a',3],
  ['Epsilon Eridani',10.5,3.55,-9.46,'#ffc890',5,1],['Lacaille 9352',10.7,23.1,-35.85,'#ff9a6a',4],['Ross 128',11,11.8,.8,'#ff8a5a',3],['EZ Aquarii',11.1,22.64,-15.3,'#ff7a5a',3],['Procyon',11.46,7.65,5.2,'#fff6e0',9,1],
  ['61 Cygni',11.4,21.12,38.75,'#ffb070',5],['Struve 2398',11.5,18.71,59.6,'#ff8a5a',3],['Groombridge 34',11.6,.3,44,'#ff9a6a',3],['Epsilon Indi',11.9,22.05,-56.8,'#ffb070',5],['Tau Ceti',11.9,1.73,-15.9,'#ffe6b0',6,1]];
function L16(){const k=LY/2.5e16,pj=(d,ra,de)=>{const a=ra*15*R,b=de*R,X=Math.cos(b)*Math.cos(a)*d*k,Y=Math.sin(b)*d*k,Z=-Math.cos(b)*Math.sin(a)*d*k;return[X*.94+Z*.34,-Y*.9+Z*.2]},
    S=NEAR.map(([n,d,ra,de,col,s,lk])=>[...pj(d,ra,de),col,s,`${n} · ${d.toLocaleString('fr-FR')} al`,lk]),
    lines=path(p=>S.forEach(([x,y,,,,lk])=>{if(lk){p.moveTo(0,0);p.lineTo(x,y)}})),
    bg=Array.from({length:110},()=>{const d=Math.cbrt(rnd(1728,8000)),a=rnd(0,TAU),b=Math.asin(rnd(-1,1));return pj(d,a/(15*R),b/R)});
  /* comme pour les planètes : le nom d'une étoile s'affiche quand elle entre dans l'écran, et s'efface avant d'arriver au centre où elles se regroupent */
  return{a:[0,0],main:(c,v)=>{const px=v.px;stroke(c,lines,'rgba(255,255,255,.14)',px);bg.forEach(([x,y])=>disc(c,x,y,.9*px,'rgba(255,150,120,.55)'));
    S.forEach(([x,y,col,s,lb])=>{glow(c,x,y,s*1.6*px,col,.4);disc(c,x,y,s*.33*px,col);const f=Math.hypot(x,y)*v.q/v.mn;v.tag(lb,x,y,sm(.5,.45,f)*(1-sm(.38,.33,f)))})}}}

/* galaxie spirale dessinée une fois dans une image (rayon 1 = bord du disque ; l'image couvre ±1,2) */
function galaxy(n,arms,{tw=2.3,core='#ffe2a8',arm='#a898ff',seed=0,size=1024}={}){return off(size,size,(x,w)=>{const k=w/2.4,o=w/2,col=[core,arm,'#ff7fd0'];
  x.globalCompositeOperation='lighter';const gc=x.createRadialGradient(o,o,0,o,o,k*.35);gc.addColorStop(0,rgba(core,.6));gc.addColorStop(1,rgba(core,0));x.fillStyle=gc;x.fillRect(0,0,w,w);
  col.forEach((cc,ci)=>{x.fillStyle=rgba(cc,.35);for(let i=0;i<n;i++){let X,Y;
    if(ci==0){if(i>n*.25)break;const r=Math.abs(gauss())*.16,a=rnd(0,TAU);X=Math.cos(a)*r*1.3;Y=Math.sin(a)*r*.8}
    else{if(ci==2&&i>n*.08)break;const j=i%arms,t=Math.pow(Math.random(),.8),r=.12+t*.88,a=j*TAU/arms+Math.log(r/.12)*tw+gauss()*.32*(1-t*.4)+seed;X=Math.cos(a)*r;Y=Math.sin(a)*r}
    const s=rnd(.8,2.2)*w/1024;x.fillRect(o+X*k,o+Y*k,s,s)}})})}
/* Voie lactée vue de dessus (rayon 1 = 50 000 al) : un disque d'étoiles de plus en plus dense vers le centre, une barre centrale,
   et des bras à peine marqués ; le Soleil, à 26 000 al du centre, est sur l'un d'eux. La même densité sert à l'image et aux étoiles qui l'annoncent */
const MWA=4,MWT=2.1,MWC=TAU/4-MWT*Math.log(.12);
function mwDens(x,y,amp=.22){const r=Math.hypot(x,y);if(r>1.25)return 0;const t=Math.atan2(y,x),bx=x*.94+y*.34,by=y*.94-x*.34;
  return Math.exp(-r/.3)*(1+amp*Math.cos(MWA*(t-MWT*Math.log(Math.max(r,.02))-MWC)))*(r>1?Math.exp(-(r-1)*8):1)+2.2*Math.exp(-((r/.07)**2))+1.2*Math.exp(-((bx/.16)**2)-((by/.06)**2))}
const STC=['#ffffff','#cfdcff','#fff2c8','#ffd2a0','#ffb08a'],stc=()=>{const q=Math.random();return q<.3?0:q<.5?1:q<.75?2:q<.9?3:4};
/* image du disque : lueur lisse calculée pixel par pixel, puis des dizaines de milliers d'étoiles et quelques traînées de poussière */
function diskGalaxy(size,{amp=.22,core=[255,226,170],disk=[185,195,255],n=60000}={}){return off(size,size,(x,w)=>{
  const g=256,k=g/2.4,id=x.createImageData(g,g),d=id.data;
  for(let j=0;j<g;j++)for(let i=0;i<g;i++){const X=(i-g/2)/k,Y=(j-g/2)/k,f=mwDens(X,Y,amp),m=Math.min(1,Math.hypot(X,Y)/.35),o=(j*g+i)*4;
    d[o]=lerp(core[0],disk[0],m);d[o+1]=lerp(core[1],disk[1],m);d[o+2]=lerp(core[2],disk[2],m);d[o+3]=255*(1-Math.exp(-f*.8))}
  x.imageSmoothingEnabled=true;x.drawImage(off(g,g,c=>c.putImageData(id,0,0)),0,0,w,w);
  const K=w/2.4,o=w/2,sz=w/2048;
  x.globalCompositeOperation='source-over';x.fillStyle='rgba(25,12,30,.08)';
  for(let c=0;c<n/6;){const X=rnd(-1,1),Y=rnd(-1,1),r=Math.hypot(X,Y),t=Math.atan2(Y,X);if(r<.22||r>.95||Math.cos(MWA*(t-MWT*Math.log(r)-MWC)+.7)<.8)continue;c++;x.fillRect(o+X*K,o+Y*K,3*sz,3*sz)}
  x.globalCompositeOperation='lighter';const cols=STC.map(h=>rgba(h,.5));
  for(let c=0;c<n;){const X=rnd(-1.2,1.2),Y=rnd(-1.2,1.2);if(Math.random()*4.5>mwDens(X,Y,amp*1.2))continue;c++;x.fillStyle=cols[stc()];const s=rnd(1,2.4)*sz;x.fillRect(o+X*K,o+Y*K,s,s)}})}
const sunInMW=(()=>{const r=26000/5e4,a=TAU/4+Math.log(r/.12)*MWT;return[Math.cos(a)*r,Math.sin(a)*r]})();
/* 17 · la Voie lactée (100 000 al ; 1 unité ≈ 11 000 al). En s'éloignant des étoiles voisines, des étoiles de plus en plus lointaines apparaissent
   (quatre couches : 40, 250, 1 500 et 9 000 al autour du Soleil), avec des amas et des nébuleuses connus, jusqu'à former le disque de la galaxie */
function L17(){const R0=4.5,KL=5e4/R0,img=diskGalaxy(2048),sun=[sunInMW[0]*R0,sunInMW[1]*R0],
    layers=[[40,1200],[250,2000],[1500,2800],[9000,3600]].map(([D,n])=>{const Du=D/KL,g=STC.map(()=>[]);let fm=0;
      for(let i=0;i<300;i++){const a=rnd(0,TAU),r=Du*Math.sqrt(Math.random())*1.5;fm=Math.max(fm,mwDens((sun[0]+Math.cos(a)*r)/R0,(sun[1]+Math.sin(a)*r)/R0))}
      /* répartition en cloche autour du Soleil : la couche n'a pas de bord net et se fond dans la suivante */
      for(let c=0;c<n;){const dx=gauss()*Du*.55,dy=gauss()*Du*.55,r=Math.hypot(dx,dy);if(Math.random()>sm(3,14,r*KL))continue;const x=sun[0]+dx,y=sun[1]+dy;
        if(Math.random()*fm*1.1>mwDens(x/R0,y/R0))continue;c++;g[stc()].push(x,y,Math.random()<.08?2.2:rnd(1,1.6))}
      return{Du,g}}),
    /* objets connus, placés par leur longitude galactique (vers le centre = 0°) et leur distance */
    uc=[-sunInMW[0]/Math.hypot(...sunInMW),-sunInMW[1]/Math.hypot(...sunInMW)],up=[-uc[1],uc[0]],
    OBJ=[['Hyades',180.1,153,'cl','#cfe0ff'],['Pléiades',166.6,444,'cl','#a8c8ff'],['Bételgeuse',199.8,548,'st','#ffb070'],['Rigel',209.2,860,'st','#cfe0ff'],
      ['Nébuleuse d’Orion',209,1344,'neb','#ff7fb0'],['Deneb',84.3,2600,'st','#f4f6ff'],['Nébuleuse de la Lagune',6,4100,'neb','#ff6f9a'],['Nébuleuse de l’Aigle',17,5700,'neb','#ff8a7a'],
      ['Nébuleuse de la Carène',287.6,7500,'neb','#ff7f9f'],['Omega du Centaure',309.1,17000,'gl','#ffe6b0']]
      .map(([n,l,d,k,col])=>{const c=Math.cos(l*R)*d/KL,s=Math.sin(l*R)*d/KL;return[n,sun[0]+c*uc[0]+s*up[0],sun[1]+c*uc[1]+s*up[1],k,col,d/KL]}),
    CL=[[0,0],[-3,-2],[3,-1],[-1,3],[4,2],[-4,1],[1,-4]];
  return{a:sun,main:(c,v)=>{const px=v.px,mn=v.mn,gate=sm(-3.5,-3.15,v.d)*(1-sm(-.4,.2,v.d)),ia=sm(-1.3,-.5,v.d);
    if(ia>.01){c.globalAlpha=v.w*ia;c.drawImage(img,-1.2*R0,-1.2*R0,2.4*R0,2.4*R0)}
    if(gate>.01){layers.forEach(L=>{const s=L.Du*v.q,a=gate*sm(30*mn,6*mn,s)*(1-sm(.35*mn,.12*mn,s));if(a<.01)return;c.globalAlpha=v.w*a;
        L.g.forEach((A,ci)=>{c.fillStyle=STC[ci];for(let i=0;i<A.length;i+=3){const x=A[i],y=A[i+1];if(x<v.x0||x>v.x1||y<v.y0||y>v.y1)continue;const z=A[i+2]*px;c.fillRect(x-z/2,y-z/2,z,z)}})});
      OBJ.forEach(([n,x,y,k,col,d])=>{const f=d*v.q/mn,a=gate*sm(4,2,f)*(1-sm(.06,.02,f));if(a<.01||x<v.x0-20*px||x>v.x1+20*px||y<v.y0-20*px||y>v.y1+20*px)return;c.globalAlpha=v.w*a;
        if(k=='cl')CL.forEach(([dx,dy])=>{glow(c,x+dx*px,y+dy*px,4*px,col,.6);disc(c,x+dx*px,y+dy*px,1*px,'#fff')});
        else if(k=='neb'){glow(c,x,y,14*px,col,.55);glow(c,x+3*px,y-2*px,8*px,'#ffd0e0',.4);disc(c,x,y,1.2*px,'#fff')}
        else if(k=='gl'){glow(c,x,y,7*px,col,.7);disc(c,x,y,2*px,'#fff6e0')}
        else{glow(c,x,y,7*px,col,.6);disc(c,x,y,1.8*px,col)}
        v.tag(n,x,y,a*sm(.5,.45,f)*(1-sm(.38,.33,f)))})}
    c.globalAlpha=v.w;v.tag('Soleil',sun[0],sun[1],sm(-.6,0,v.d)*(1-sm(.6,1,v.d))*.9);v.tag('Centre de la Voie lactée',0,0,sm(-.8,-.2,v.d)*(1-sm(.6,1,v.d)))}}}

/* 18 · les galaxies voisines (1 unité ≈ 635 000 al) : Andromède, deux fois plus grande que la Voie lactée, à 2,5 millions d'al */
function L18(){const K=LY/(2.54e6*LY/4),mw=[-1.8,.7],an=[mw[0]+3.8,mw[1]-1.2],tr=[an[0]+.5,an[1]+1.1],G=[diskGalaxy(512,{n:15000}),diskGalaxy(512,{amp:.3,core:[255,236,205],disk:[205,200,255],n:15000}),galaxy(8000,2,{core:'#ffe2a8',arm:'#a8c8ff',seed:2,size:256})],
    dw=Array.from({length:60},(_,i)=>{const b=i%2?mw:an,a=rnd(0,TAU),d=rnd(.08,1.6);return[b[0]+Math.cos(a)*d,b[1]+Math.sin(a)*d]}),far=Array.from({length:400},()=>[rnd(-45,45),rnd(-30,30)]),
    gx=(c,g,[x,y],r,a,sq)=>{c.save();c.translate(x,y);c.rotate(a);c.scale(1,sq);c.drawImage(g,-1.2*r,-1.2*r,2.4*r,2.4*r);c.restore()};
  return{a:mw,c:[mw[0]+1.9,mw[1]-.6],main:(c,v)=>{const px=v.px;far.forEach(([x,y])=>disc(c,x,y,.8*px,'rgba(220,214,255,.45)'));dw.forEach(([x,y])=>disc(c,x,y,1.1*px,'rgba(255,230,192,.7)'));
    gx(c,G[0],mw,5e4*K,0,1);gx(c,G[1],an,1.1e5*K,.6,.35);gx(c,G[2],tr,3e4*K,-.4,.6);
    const ta=1-sm(.3,.7,v.d);v.tag('Voie lactée',mw[0],mw[1],ta);v.tag('Andromède',an[0],an[1],ta);v.tag('Galaxie du Triangle',tr[0],tr[1],ta)}}}

/* 19 · le Superamas de la Vierge, ou Superamas local (environ 110 millions d'al ; 1 unité = 13,5 millions d'al).
   Une centaine de groupes et d'amas de galaxies, à plat le long du « plan supergalactique » ; au centre, l'amas de la Vierge (plus de 1 300 galaxies),
   à 54 millions d'al de notre Groupe local, qui est en bordure. Positions schématiques, distances réelles depuis le Groupe local */
function L19(){const LG=[-3.5,1.95],VC=[0,0],GR=[['Groupe de M81',[LG[0]+.55,LG[1]-.7]],['Groupe du Lion',[LG[0]+2.3,LG[1]-1.05]],['Amas du Fourneau',[-5.6,4.4]]],
    E=8,img=off(2048,2048,(x,w)=>{const k=w/(2*E);x.translate(w/2,w/2);x.scale(k,k);x.globalCompositeOperation='lighter';const px=1/k,
      gal=(X,Y,s,col)=>{if(Math.hypot(X-LG[0],Y-LG[1])<.25)return;x.fillStyle=col;x.fillRect(X,Y,s*px*2.6,s*px*2.6)},
      cols=['rgba(255,230,192,.4)','rgba(207,216,255,.4)','rgba(255,245,225,.5)'],
      group=([cx,cy],n,sg)=>{for(let i=0;i<n;i++)gal(cx+gauss()*sg,cy+gauss()*sg*.7,rnd(1.2,2.6),cols[i%3])};
      /* l'amas de la Vierge, avec M87 au centre */
      for(let i=0;i<1500;i++)gal(gauss()*.38,gauss()*.28,rnd(.7,1.8),cols[i%3]);
      const gc=x.createRadialGradient(0,0,0,0,0,.6);gc.addColorStop(0,'rgba(255,225,180,.45)');gc.addColorStop(1,'rgba(255,225,180,0)');x.fillStyle=gc;x.fillRect(-.6,-.6,1.2,1.2);
      /* nuages et groupes le long du plan, plus serrés près de la Vierge, et filaments qui en partent */
      const ax=[.875,-.487];for(let g=0;g<90;g++){const t=gauss()*3.2,o=gauss()*.85;group([VC[0]+ax[0]*t-ax[1]*o,VC[1]+ax[1]*t+ax[0]*o],rnd(6,40)|0,rnd(.06,.16))}
      [[2.2,2.8],[2.8,-1.8],[-1.2,-2.2],[1.5,1.2]].forEach(([ex,ey])=>{for(let n=0;n<500;n++){const t=Math.random();gal(ex*t+gauss()*.15,ey*t+gauss()*.15,rnd(1,2),cols[n%3])}});
      GR.forEach(([,p])=>group(p,60,.14));
      for(let i=0;i<4000;i++){const t=gauss()*4,o=gauss()*2.2;gal(ax[0]*t-ax[1]*o,ax[1]*t+ax[0]*o,rnd(1,1.8),'rgba(200,205,255,.3)')}}),
    /* le Groupe local, dessiné à part pour rester net : la Voie lactée, Andromède et le Triangle (positions de l'étage précédent, réduites) */
    kl=(2.54e6/4)/1.35e7,lg=[[-1.8,.7],[2,-.5],[2.5,.6]].map(([gx,gy])=>[LG[0]+gx*kl,LG[1]+gy*kl]);
  return{a:LG,c:[-1.75,.95],main:(c,v)=>{const px=v.px;c.drawImage(img,-E,-E,2*E,2*E);lg.forEach(([gx,gy],i)=>disc(c,gx,gy,(i<2?1.6:1.1)*px,'rgba(255,240,220,.9)'));
    v.tag('Amas de la Vierge',VC[0],VC[1],.95);v.tag('Groupe local',LG[0],LG[1],sm(-.8,-.2,v.d));GR.forEach(([n,p])=>v.tag(n,p[0],p[1],.8))}}}
