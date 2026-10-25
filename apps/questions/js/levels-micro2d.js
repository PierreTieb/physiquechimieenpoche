/* Étages 0 à 8 : du noyau d'atome à la fourmi.
   Chaque étage renvoie {a: position de l'étage précédent (en unités de celui-ci), c: centre du cadrage, main(c,v), back(c,v): décor qui s'efface dès qu'on part vers l'étage suivant}.
   v donne le temps v.t, la taille d'un pixel en unités v.px, le rectangle visible v.x0..v.x1 / v.y0..v.y1 et v.tag(texte,x,y,a) pour poser une étiquette.
   L'axe y descend : « en haut » veut dire y négatif ; le sol est en y = 0. */

/* 0 · noyau d'oxygène : 8 protons et 8 neutrons serrés en grappe (rayon 2,7 fm = 2 unités), empilés en volume.
   La grappe tourne lentement sur elle-même : on la dessine du fond vers l'avant, chaque nucléon posant une ombre douce sur ceux de derrière */
function L0(){const n=16,r=.78,P=[];for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,s=Math.sqrt(1-y*y),a=i*2.39996;P.push([Math.cos(a)*s*1.3,y*1.3,Math.sin(a)*s*1.3])}
  /* chaque nucléon est attiré vers le centre et repoussé au contact des autres */
  for(let it=0;it<400;it++)P.forEach((p,i)=>{const f=p.map(x=>-x*.04);P.forEach((q,j)=>{if(i==j)return;const d=p.map((x,m)=>x-q[m]),l=Math.hypot(...d)||1e-3;if(l<1.5)d.forEach((x,m)=>f[m]+=x/l*(1.5-l)*.4)});p.forEach((_,m)=>p[m]+=f[m])});
  const k=2/(Math.max(...P.map(p=>Math.hypot(...p)))+.75),rr=.75*k,kind=[...Array(n)].map((_,i)=>i<8).sort(()=>Math.random()-.5),
    N=P.map((p,i)=>[p[0]*k,p[1]*k,p[2]*k,kind[i]?'#E8483C':'#2F6BE0',i]),T=Math.cos(.35),U=Math.sin(.35);
  return{a:[0,0],main:(c,v)=>{glow(c,0,0,3.8,'#ffd6c8',.3);const a=v.t*.22,ca=Math.cos(a),sa=Math.sin(a);
    /* rotation autour d'un axe vertical, puis légère inclinaison vers nous */
    N.map(([x,y,z,col,i])=>{const X=x*ca+z*sa,Z=-x*sa+z*ca,Y=y*T-Z*U;return[X+Math.sin(v.t*3+i)*.012,Y+Math.cos(v.t*2.6+i)*.012,y*U+Z*T,col]}).sort((p,q)=>p[2]-q[2])
      .forEach(([x,y,z,col])=>{contact(c,x,y,rr,.45);orb(c,x,y,rr,col);const f=cl(-z/2.4)*.35;if(f>.01)disc(c,x,y,rr,`rgba(11,16,48,${f.toFixed(3)})`)})}}}

/* 1 · atome d’oxygène : 2 électrons à ~7 pm du noyau, 6 à ~60 pm (4 unités). Le noyau, 22 000 fois plus petit que l’atome, y devient invisible */
function L1(){const E=[[.47,0,2.4],[.47,Math.PI,2.4],...[0,1,2,3,4,5].map(i=>[4,i*TAU/6+.3,i%2?.55:-.55])];
  return{a:[0,0],main:(c,v)=>{const px=v.px,g=c.createRadialGradient(0,0,0,0,0,4.8);
    [[0,.3],[.12,.08],[.6,.05],[.83,.15],[1,0]].forEach(([s,a])=>g.addColorStop(s,`rgba(111,168,255,${a})`));c.fillStyle=g;c.fillRect(-4.8,-4.8,9.6,9.6);
    c.strokeStyle='rgba(160,200,255,.28)';c.lineWidth=px;[.47,4].forEach(r=>{c.beginPath();c.arc(0,0,r,0,TAU);c.stroke()});
    E.forEach(([r,a0,w])=>{const a=a0+v.t*w*.35,x=Math.cos(a)*r,y=Math.sin(a)*r;glow(c,x,y,10*px,'#6fa8ff',.7);disc(c,x,y,3.4*px,'#dce9ff')})}}}

/* 2 · molécule d'eau H₂O : liaisons O–H de 95,8 pm (2 unités), angle de 104,5°. Autour, ses voisines reliées par des liaisons hydrogène */
const OXY='#E5413A',HYD='#F4F4F4',HA=52.25*R;
/* molécule centrée sur l'oxygène, tournée de a, à l'échelle s, en boules et bâtonnets ; renvoie la position des deux hydrogènes */
function mol(c,x,y,a,s){const H=[1,-1].map(k=>{const hx=k*Math.sin(HA)*2,hy=Math.cos(HA)*2;return[x+s*(hx*Math.cos(a)-hy*Math.sin(a)),y+s*(hx*Math.sin(a)+hy*Math.cos(a))]});
  if(s*.62<3*PXU){H.forEach(p=>disc(c,p[0],p[1],.62*s,HYD));disc(c,x,y,s,OXY);return H}
  H.forEach(p=>stick(c,x,y,p[0],p[1],.36*s,'#e9e6e2'));H.forEach(p=>{contact(c,p[0],p[1],.62*s,.3);orb(c,p[0],p[1],.62*s,HYD)});contact(c,x,y,s,.3);orb(c,x,y,s,OXY);return H}
function L2(){const H=[1,-1].map(k=>[k*Math.sin(HA)*2,Math.cos(HA)*2]),nb=[],hb=[];
  /* deux voisines reçoivent les hydrogènes de la molécule centrale, deux autres lui donnent les leurs */
  H.forEach(([x,y])=>{const l=Math.hypot(x,y);nb.push([x+x/l*4.1,y+y/l*4.1,rnd(0,TAU)]);hb.push([x+x/l*.72,y+y/l*.72,x+x/l*3.02,y+y/l*3.02])});
  [-1,1].forEach(k=>{const a=-Math.PI/2+k*.9,d=6.1,x=Math.cos(a)*d,y=Math.sin(a)*d;nb.push([x,y,Math.atan2(-y,-x)-Math.PI/2+k*HA]);hb.push([Math.cos(a)*1.1,Math.sin(a)*1.1,Math.cos(a)*(d-2.75),Math.sin(a)*(d-2.75)])});
  while(nb.length<18){const x=rnd(-15,15),y=rnd(-11,11);if(nb.every(q=>Math.hypot(q[0]-x,q[1]-y)>4.4)&&Math.hypot(x,y)>5)nb.push([x,y,rnd(0,TAU)])}
  return{a:[0,0],back:(c,v)=>{const px=v.px;nb.forEach(([x,y,a],i)=>mol(c,x+Math.sin(v.t*.7+i)*.06,y+Math.cos(v.t*.6+i)*.06,a+Math.sin(v.t*.5+i)*.04,1));
      c.setLineDash([5*px,4*px]);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=2*px;hb.forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()});c.setLineDash([])},
    main:c=>mol(c,0,0,0,1)}}

/* 3 · double hélice d'ADN (2 nm de large = 4 unités, 0,34 nm par paire de bases), dans l'eau. La molécule d'eau de l'étage précédent flotte à côté */
const BASES={A:'#F5C431',T:'#E5413A',C:'#45B74F',G:'#2F6BE0'},PAIR={A:'T',T:'A',C:'G',G:'C'};
function L3(){const seq=Array.from({length:130},()=>'ATCG'[Math.random()*4|0]),Y0=-44,ST=.68,PI=6.8,RH=2,PH=.75*Math.PI,S2=4.8e-11/5e-10,wt=[];
  while(wt.length<180){const x=rnd(-16,16),y=rnd(-30,30);if(Math.abs(x)>2.7&&Math.hypot(x-3.2,y-.6)>.6)wt.push([x,y,rnd(0,TAU)])}
  /* hélice droite (ADN B) : en montant, les brins tournent dans le sens inverse des aiguilles d'une montre vus d'en haut ; z > 0 vient vers nous */
  const th=(y,ph)=>-TAU*y/PI+ph,X=(y,ph)=>RH*Math.sin(th(y,ph)),Z=(y,ph)=>RH*Math.cos(th(y,ph)),BB='#a9c6f2',PB='#7ea6e8',
    /* ce qui est loin derrière l'axe s'assombrit vers la couleur de l'eau (8 nuances par couleur, gardées en mémoire) */
    DC=new Map(),dc=(col,z)=>{const q=Math.round(cl((RH-z)/(2*RH))*8),k=col+q;let s=DC.get(k);if(!s)DC.set(k,s=mix(col,'#0e2a3c',q/8*.55));return s};
  return{a:[3.2,.6],back:(c,v)=>wt.forEach(([x,y,a])=>{if(x>v.x0-1&&x<v.x1+1&&y>v.y0-1&&y<v.y1+1)mol(c,x,y,a,S2)}),
    main:(c,v)=>{const y0=Math.max(Y0,v.y0-1),y1=Math.min(-Y0,v.y1+1);if(y1<y0)return;c.lineCap='round';
      /* tout ce qui compose l'hélice est rangé par profondeur puis dessiné du fond vers l'avant : morceaux de brins, perles des phosphates, barreaux des paires de bases */
      const st=Math.max(.05,2*v.px),it=[],i0=Math.max(0,Math.ceil((y0-Y0)/ST)),i1=Math.min(seq.length-1,Math.floor((y1-Y0)/ST));
      /* chaque brin est coupé en tronçons continus de même profondeur (12 nuances) : peu de raccords, et chacun passe devant ou derrière au bon moment */
      [0,PH].forEach(ph=>{let run=null;for(let y=y0;y<y1+st/2;y+=st){const yy=Math.min(y1,y),z=Z(yy,ph),q=Math.round(cl((RH-z)/(2*RH))*12);
        if(!run||run.q!=q){if(run){run.P.push([X(yy,ph),yy]);it.push([run.z/run.n,0,run.P])}run={q,P:[],z:0,n:0}}run.P.push([X(yy,ph),yy]);run.z+=z;run.n++}if(run)it.push([run.z/run.n,0,run.P])});
      for(let i=i0;i<=i1;i++){const y=Y0+i*ST,za=Z(y,0),zb=Z(y,PH);it.push([(za+zb)/2,1,X(y,0),y,X(y,PH),seq[i]],[za+.01,2,X(y,0),y],[zb+.01,2,X(y,PH),y])}
      it.sort((a,b)=>a[0]-b[0]).forEach(([z,k,x,y,x2,e])=>{
        /* morceaux de brin à bouts droits, un peu allongés pour se chevaucher : le tube paraît continu */
        if(k==0){if(x.length<2)return;c.lineCap='butt';tubeG(c,path(p=>x.forEach(([a,b],i)=>i?p.lineTo(a,b):p.moveTo(a,b))),dc(BB,z),.46);c.lineCap='round'}
        else if(k==1){const xm=(x+x2)/2;stick(c,x,y,xm,y,.34,dc(BASES[e],z));stick(c,xm,y,x2,y,.34,dc(BASES[PAIR[e]],z))}
        else orb(c,x,y,.3,dc(PB,z))})}}}

/* 4 · chromosome (3,2 µm, 1 unité = 0,4 µm) : deux chromatides d'ADN très replié, en X, avec des boucles de fibre sur le pourtour.
   L'ADN de l'étage précédent est au cœur du bras supérieur droit. Le même dessin sert aux chromosomes du noyau de la cellule */
const CHR=(()=>{const CH=[[[-1.75,-3.9],[-.9,-1.8],[-.35,0],[-.9,1.9],[-1.6,3.9]],[[1.75,-3.9],[.9,-1.8],[.35,0],[.9,1.9],[1.6,3.9]]],bl=[];
  /* relief : des pelotes de fibre serrées le long des chromatides, chacune éclairée en haut à gauche */
  CH.forEach(P=>{for(let i=0;i<P.length-1;i++)for(let k=0;k<30;k++){const t=Math.random();bl.push([lerp(P[i][0],P[i+1][0],t)+rnd(-.5,.5),lerp(P[i][1],P[i+1][1],t)+rnd(-.5,.5),rnd(.16,.34)])}});
  bl.sort((a,b)=>a[1]-b[1]);
  return{arm:path(p=>CH.forEach(P=>curve(p,P))),knots:relief(bl),
    /* boucles de fibre : petites anses sur le pourtour */
    loops:path(p=>CH.forEach(P=>P.forEach(([x,y])=>{for(let k=0;k<6;k++){const a=rnd(0,TAU);oval(p,x+Math.cos(a)*.92,y+Math.sin(a)*.92,rnd(.15,.35),rnd(.08,.16),a)}})))}})();
/* chromosome centré en (x,y), tourné de a, à l'échelle s ; teintes du tube, des pelotes et du centromère */
function chromo(c,x,y,s=1,a=0,col='#8450d0',kn='#9C62E6',ce='#5a2f9a'){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);const p=PXU;PXU/=s;c.lineCap='round';c.lineJoin='round';
  stroke(c,CHR.loops,'rgba(190,150,245,.75)',.045);stroke(c,CHR.arm,'rgba(40,10,70,.35)',1.75);tubeS(c,CHR.arm,col,1.45);drawRelief(c,CHR.knots,kn,.3);ball(c,0,0,.42,ce);PXU=p;c.restore()}
function L4(){return{a:[.95,-1.85],main:c=>chromo(c,0,0)}}

/* 5 · cellule (20 µm, 1 unité = 2,5 µm), avalée par le micro-organisme de l'étage suivant et gardée dans une de ses vacuoles :
   membrane, cytoplasme, noyau et ses chromosomes (dont celui de l'étage précédent, à sa vraie taille), mitochondries, réticulum, appareil de Golgi, vésicules, ribosomes */
const LUMEN='#f0dcb4',CRX=4.2,CRY=3.4,NX=.6,NY=.15,NRX=1.55,NRY=1.35,CHA=[.3,.2],S4=4e-7/2.5e-6,GOX=-2.1,GOY=-1.15,
  PURP=[['#7a44c8','#9058dc','#4f2690'],['#6e3dba','#8a56d6','#45227e'],['#9C62E6','#b68af2','#6a3cb0'],['#a772ee','#c49af6','#7446c0']];
/* crêtes de la mitochondrie : la membrane interne forme des replis en doigts de gant, alternativement depuis le haut et depuis le bas */
const CRIS=path(p=>{for(let i=0;i<6;i++){const x=-.25+i*.1,w=i%2?.13:-.13,t=i%2?-.03:.03;p.moveTo(x-.025,w);p.quadraticCurveTo(x-.02,t,x,t);p.quadraticCurveTo(x+.02,t,x+.025,w)}});
/* mitochondrie : membrane externe brillante, matrice plus sombre, crêtes claires, reflet ; col : teinte, s : échelle */
function mito(c,x,y,a,col='#f08a4b',s=1){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);const p=PXU;PXU/=s;egg(c,0,0,.42,.2,col);
  c.beginPath();c.ellipse(0,0,.355,.145,0,0,TAU);c.fillStyle=mix(col,'#5a1e00',.3);c.fill();c.save();c.clip();c.lineCap='round';stroke(c,CRIS,mix(col,'#ffffff',.6),.03);c.restore();
  c.strokeStyle=rgba(mix(col,'#ffffff',.55),.8);c.lineWidth=.018;c.stroke();c.beginPath();c.ellipse(-.1,-.13,.2,.035,-.05,0,TAU);c.fillStyle='rgba(255,255,255,.4)';c.fill();PXU=p;c.restore()}
/* le dessin de la cellule, préparé une fois : il sert à cet étage et, en tout petit, dans la vacuole du micro-organisme */
const CELL=(()=>{const cell=path(p=>{for(let i=0;i<=60;i++){const a=i/60*TAU,k=1+Math.sin(a*3+.5)*.035+Math.sin(a*5+1)*.02,x=Math.cos(a)*CRX*k,y=Math.sin(a)*CRY*k;i?p.lineTo(x,y):p.moveTo(x,y)}p.closePath()}),
    inC=(x,y,m)=>(x/(CRX*m))**2+(y/(CRY*m))**2<1,inN=(x,y,m)=>((x-NX)/(NRX*m))**2+((y-NY)/(NRY*m))**2<1,
    free=m=>{let x,y;do{x=rnd(-CRX,CRX);y=rnd(-CRY,CRY)}while(!inC(x,y,.86)||inN(x,y,1.3+m)||Math.hypot(x-GOX,y-GOY)<.8+m);return[x,y]},
    /* chromosomes : celui de l'étage précédent au premier plan, sept autres plus petits et tournés au hasard autour */
    chs=[];for(let i=0;chs.length<7&&i<2000;i++){const a=rnd(0,TAU),r=rnd(.4,1),x=NX+Math.cos(a)*r*NRX*.78,y=NY+Math.sin(a)*r*NRY*.78;
      if(Math.hypot(x-CHA[0],y-CHA[1])<.6||chs.some(q=>Math.hypot(q[0]-x,q[1]-y)<.5))continue;chs.push([x,y,S4*rnd(.55,.85),rnd(0,TAU),PURP[chs.length%4]])}
  const mit=[...Array(10)].map((_,i)=>{const[x,y]=free(.3);return[x,y,rnd(0,TAU),i<6?'#F28A3A':i<8?'#6CC24A':'#F2C230',rnd(0,TAU)]}),
    /* réticulum : rubans repliés autour du noyau, piqués de ribosomes */
    rib=[],er=path(p=>{for(let k=0;k<3;k++){const P=[];for(let i=0;i<=16;i++){const a=k*2.1+i/16*2.7,d=.38+k*.2+Math.sin(i*1.7+k)*.07,q=[NX+Math.cos(a)*(NRX+d),NY+Math.sin(a)*(NRY+d)];P.push(q);rib.push(q[0]+rnd(-.1,.1),q[1]+rnd(-.1,.1),.035)}curve(p,P)}}),
    gol=path(p=>{for(let k=0;k<4;k++){const r=.66-k*.12;p.moveTo(GOX+r*Math.cos(3.5),GOY+r*Math.sin(3.5));p.arc(GOX,GOY,r,3.5,5.9)}}),
    ves=[...Array(16)].map(()=>{const r=rnd(.09,.2),[x,y]=free(r);return[x,y,r]}),
    ribo=blobs([...Array(450)].flatMap(()=>{const[x,y]=free(0);return[x,y,rnd(.022,.04)]}).concat(rib));
  return{cell,draw(c,t){
    /* cytoplasme bleuté, plus soutenu vers le bord comme dans une bulle */
    const g=c.createRadialGradient(-1.2,-1,0,0,0,CRX*1.05);g.addColorStop(0,'#eef7ff');g.addColorStop(.7,'#d3e9fb');g.addColorStop(1,'#a9d3f5');fill(c,cell,g);
    c.save();c.clip(cell);fill(c,ribo,'rgba(42,74,154,.55)');c.lineCap='round';tubeG(c,er,'#3F8FE8',.13);tubeG(c,gol,'#E85FB0',.15);
    mit.forEach(([x,y,a,col,ph])=>mito(c,x,y+Math.sin(t*.8+ph)*.05,a+Math.sin(t*.3+ph)*.06,col,1.35));
    ves.forEach(([x,y,r])=>{contact(c,x,y,r,.2);orb(c,x,y,r,'#F6D86A')});
    /* noyau : nucléoplasme clair où se voient les chromosomes, nucléole, enveloppe percée de pores, reflet */
    c.beginPath();c.ellipse(NX,NY,NRX,NRY,0,0,TAU);const gn=c.createRadialGradient(NX-.5,NY-.5,0,NX,NY,NRX);gn.addColorStop(0,'#f4eeff');gn.addColorStop(.65,'#d9c7f7');gn.addColorStop(1,'#a888e4');c.fillStyle=gn;c.fill();
    c.save();c.clip();chs.forEach(([x,y,s,a,P])=>chromo(c,x,y,s,a,...P));orb(c,NX+.85,NY+.62,.3,'#5B2FB0');c.restore();
    chromo(c,CHA[0],CHA[1],S4);
    c.beginPath();c.ellipse(NX,NY,NRX,NRY,0,0,TAU);c.strokeStyle='#7d55c0';c.lineWidth=.09;c.stroke();c.setLineDash([.06,.16]);c.strokeStyle='#f3ecff';c.lineWidth=.045;c.stroke();c.setLineDash([]);
    c.save();c.translate(NX-.55,NY-.85);c.rotate(-.45);c.scale(.6,.15);const h=c.createRadialGradient(0,0,0,0,0,1);h.addColorStop(0,'rgba(255,255,255,.55)');h.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=h;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();
    c.restore();
    /* membrane : liseré bleu, halo, filet de lumière et grand reflet en haut à gauche */
    stroke(c,cell,'rgba(79,168,240,.3)',.4);stroke(c,cell,'#4FA8F0',.12);c.save();c.translate(-.06,-.08);stroke(c,cell,'rgba(255,255,255,.75)',.04);c.restore();
    c.save();c.translate(-1.9,-2.35);c.rotate(-.38);c.scale(1.7,.32);const hc=c.createRadialGradient(0,0,0,0,0,1);hc.addColorStop(0,'rgba(255,255,255,.5)');hc.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=hc;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore()}}})();
/* granules de l'intérieur du micro-organisme et vacuole qui contient la cellule (rayon 5,3 unités) */
const VAC=5.3,MOG='#3F9A5A';
function vacuole(c){c.beginPath();c.arc(0,0,VAC,0,TAU);const g=c.createRadialGradient(0,0,VAC*.6,0,0,VAC);g.addColorStop(0,'rgba(248,232,180,.95)');g.addColorStop(1,'rgba(240,206,120,.9)');c.fillStyle=g;c.fill();
  c.strokeStyle='rgba(185,145,55,.7)';c.lineWidth=.1;c.stroke()}
function L5(){const gr=blobs([...Array(700)].flatMap(()=>{const a=rnd(0,TAU),r=rnd(VAC+.2,20);return[Math.cos(a)*r,Math.sin(a)*r,rnd(.04,.1)]}));
  return{a:CHA,
    back:(c,v)=>{c.fillStyle='#d3eac3';c.fillRect(v.x0,v.y0,v.x1-v.x0,v.y1-v.y0);fill(c,gr,rgba(MOG,.5));vacuole(c)},
    main:(c,v)=>CELL.draw(c,v.t)}}

/* 6 · micro-organisme en bâtonnet (200 µm sur 60 µm, 1 unité = 30 µm) : un protiste translucide couvert de cils, avec quelques flagelles,
   dix fois la taille de la cellule et vingt-cinq fois plus petit que la fourmi dans l'intestin de laquelle il vit. La cellule de l'étage précédent est dans l'une de ses vacuoles */
const MOA=-.35,MOL=2.33,MOR=1,S5=2.5e-6/3e-5,MOC=[-1,.15],MOP=[MOC[0]*Math.cos(MOA)-MOC[1]*Math.sin(MOA),MOC[0]*Math.sin(MOA)+MOC[1]*Math.cos(MOA)],
  /* forme en gélule, dans le repère du corps */
  MOB=path(p=>{p.arc(MOL,0,MOR,-Math.PI/2,Math.PI/2);p.arc(-MOL,0,MOR,Math.PI/2,Math.PI*1.5);p.closePath()});
/* corps vu de loin (dans l'intestin de la fourmi) : gélule verte translucide et son liseré */
function moSmall(c){c.save();c.rotate(MOA);const g=c.createLinearGradient(0,-MOR,0,MOR);g.addColorStop(0,'rgba(215,245,222,.9)');g.addColorStop(1,'rgba(120,200,150,.9)');fill(c,MOB,g);stroke(c,MOB,'#3f9a5a',.12);c.restore()}
function L6(){const Lp=4*MOL+TAU*MOR,
    /* point du pourtour à l'abscisse s : position et normale (pour les cils) */
    at=s=>{if(s<2*MOL)return[-MOL+s,-MOR,0,-1];s-=2*MOL;if(s<Math.PI*MOR){const a=-Math.PI/2+s/MOR;return[MOL+Math.cos(a)*MOR,Math.sin(a)*MOR,Math.cos(a),Math.sin(a)]}
      s-=Math.PI*MOR;if(s<2*MOL)return[MOL-s,MOR,0,1];s-=2*MOL;const a=Math.PI/2+s/MOR;return[-MOL+Math.cos(a)*MOR,Math.sin(a)*MOR,Math.cos(a),Math.sin(a)]},
    CIL=[...Array(460)].map((_,i)=>[...at(i/460*Lp),i/460*Lp]),
    inB=(x,y,m)=>Math.hypot(Math.max(0,Math.abs(x)-MOL),y)<MOR*m,
    gran=blobs([...Array(700)].flatMap(()=>{let x,y;do{x=rnd(-3.3,3.3);y=rnd(-1,1)}while(!inB(x,y,.9)||Math.hypot(x-MOC[0],y-MOC[1])<.6);return[x,y,rnd(.02,.045)]})),
    /* matériel génétique : un long filament bleu enroulé le long du corps */
    gen=path(p=>{for(let x=-2.4;x<=2.4;x+=.04){const y=.42+Math.cos(x*3.2)*.2+Math.sin(x*.7)*.08;x>-2.4?p.lineTo(x,y):p.moveTo(x,y)}}),
    food=[[.7,-.35,.36],[1.6,.35,.28],[-2.4,-.3,.3],[2.6,-.2,.24]].map(([x,y,r])=>[x,y,r,[...Array(4)].map(()=>[x+rnd(-r,r)*.5,y+rnd(-r,r)*.5])]),
    /* autour, dans l'intestin : bactéries (2 µm), particules de nourriture, petites algues */
    bac=path(p=>{for(let i=0;i<700;i++){const x=rnd(-14,14),y=rnd(-10,10),a=rnd(0,TAU),l=.035;if(Math.hypot(x/4,y/1.6)<1)continue;p.moveTo(x-Math.cos(a)*l,y-Math.sin(a)*l);p.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l)}}),
    foodOut=relief([...Array(34)].map(()=>{let x,y;do{x=rnd(-13,13);y=rnd(-9,9)}while(Math.hypot(x/4.2,y/1.8)<1);return[x,y,rnd(.15,.5),rnd(.12,.4),rnd(0,TAU)]})),
    algae=[...Array(12)].map(()=>{let x,y;do{x=rnd(-13,13);y=rnd(-9,9)}while(Math.hypot(x/4.4,y/2)<1);return[x,y,rnd(.2,.4)]});
  return{a:MOP,
    back:(c,v)=>{c.globalAlpha=v.w*.6;drawRelief(c,foodOut,'#c9a46a',.15);c.globalAlpha=v.w;algae.forEach(([x,y,r])=>orb(c,x,y,r,'#5aa848'));
      c.lineCap='round';stroke(c,bac,'#6e4596',.032);c.save();c.translate(-.006,-.007);stroke(c,bac,'#d9b8f0',.012);c.restore()},
    main:(c,v)=>{const t=v.t;c.save();c.translate(MOP[0],MOP[1]);c.rotate(MOA+Math.sin(t*.4)*.05);c.translate(-MOC[0],-MOC[1]);c.lineCap='round';c.lineJoin='round';
      /* flagelles ondulants à l'arrière, cils qui battent en vagues tout autour */
      [-.3,-.1,.1,.3].forEach((y0,k)=>{const f=new Path2D();for(let i=0;i<=24;i++){const s=i/24;f[i?'lineTo':'moveTo'](-MOL-MOR*.95-s*4.6,y0*(1+s)+Math.sin(s*9-t*5+k*1.7)*.35*s)}stroke(c,f,'rgba(120,160,200,.5)',.08);stroke(c,f,'#d8ecff',.045)});
      const cil=new Path2D();CIL.forEach(([x,y,nx,ny,s])=>{const w=Math.sin(t*7-s*2.2)*.09;cil.moveTo(x,y);cil.lineTo(x+nx*.24-ny*w,y+ny*.24+nx*w)});stroke(c,cil,'rgba(110,215,140,.75)',.025);
      /* corps translucide */
      const g=c.createRadialGradient(-.8,-.5,0,0,0,3.4);g.addColorStop(0,'rgba(230,248,234,.88)');g.addColorStop(.7,'rgba(185,232,198,.85)');g.addColorStop(1,'rgba(120,205,150,.9)');fill(c,MOB,g);
      c.save();c.clip(MOB);fill(c,gran,rgba(MOG,.6));tubeG(c,gen,'#2F6BE0',.2);
      food.forEach(([x,y,r,G])=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle='rgba(242,210,122,.5)';c.fill();c.strokeStyle='rgba(185,145,55,.6)';c.lineWidth=.03;c.stroke();G.forEach(([a,b])=>orb(c,a,b,r*.18,'#b08840'))});
      /* vacuoles contractiles aux deux bouts : elles se gonflent puis se vident */
      [-2.2,2.2].forEach((x,k)=>{const r=.24+.08*Math.sin(t*1.6+k*2);for(let i=0;i<6;i++){const a=i/6*TAU+.3;c.beginPath();c.moveTo(x,-.4);c.lineTo(x+Math.cos(a)*.62,-.4+Math.sin(a)*.62);c.strokeStyle='rgba(150,205,235,.8)';c.lineWidth=.05;c.stroke()}orb(c,x,-.4,r,'#9fd8f0',.5)});
      c.restore();
      stroke(c,MOB,'rgba(95,214,138,.35)',.25);stroke(c,MOB,'#4fc27a',.07);c.save();c.translate(-.03,-.05);stroke(c,MOB,'rgba(255,255,255,.6)',.03);c.restore();c.restore();
      /* la vacuole et la cellule de l'étage précédent, à leur vraie taille (dessinées sans la rotation du corps pour se raccorder à l'étage précédent) */
      c.save();c.translate(MOP[0],MOP[1]);c.scale(S5,S5);const p=PXU;PXU/=S5;vacuole(c);CELL.draw(c,t);PXU=p;c.restore()}}}

/* 7 · l'intestin de la fourmi : son abdomen (gastre, 1,8 mm) vu en coupe, 1 unité = 0,2 mm.
   Le jabot garde la nourriture que la fourmi partage avec les autres ; l'intestin moyen digère, c'est là que vit la grégarine */
function L7(){const mg=path(p=>curve(p,[[.2,-.4],[-.4,.5],[-1.4,.5],[-2.4,.5],[-3.3,-.3],[-2.6,-1.5],[-1.3,-1.65],[-.9,-1.2]])),
    hg=path(p=>curve(p,[[-.9,-1.2],[-1.6,-.6],[-3.2,.9],[-4.55,.3]])),
    mal=path(p=>{for(let k=0;k<7;k++){const P=[[-.9,-1.2]];let x=-.9,y=-1.2,a=rnd(0,TAU);for(let i=0;i<9;i++){a+=rnd(-1.2,1.2);x+=Math.cos(a)*.35;y+=Math.sin(a)*.35;x=Math.max(-4,Math.min(1,x));y=Math.max(-2.5,Math.min(2.3,y));P.push([x,y])}curve(p,P)}}),
    fat=relief(Array.from({length:80},()=>{const t=rnd(0,TAU),r=Math.sqrt(Math.random());return[Math.cos(t)*r*4,Math.sin(t)*r*2.8,rnd(.15,.32)]})),
    seg=path(p=>[-2.6,-.9,.9,2.7].forEach(x=>{const h=3.3*Math.sqrt(1-x*x/21.2);p.moveTo(x,-h);p.quadraticCurveTo(x+.25,0,x,h)})),
    heart=path(p=>curve(p,[[-4,-2.05],[-1.5,-2.75],[1.5,-2.8],[3.9,-2.25]])),nerve=path(p=>curve(p,[[-3.9,2.1],[-1.5,2.8],[1.5,2.85],[3.8,2.3]])),
    gs=path(p=>oval(p,0,0,4.6,3.3));
  return{a:[-1.4,.5],main:(c,v)=>{const gi=c.createRadialGradient(-.8,-.8,.5,0,0,4.8);gi.addColorStop(0,'#fcefd8');gi.addColorStop(1,'#e6c08c');fill(c,gs,gi);
      drawRelief(c,fat,'#f3d79a',.15);c.lineCap='round';c.lineJoin='round';tubeS(c,heart,'#e9a0a0',.2);tubeS(c,nerve,'#f4efe0',.1);[-2.6,-.9,.9,2.7].forEach(x=>orb(c,x,2.62+Math.abs(x)*-.05,.13,'#f4efe0'));
      tubeS(c,mal,'#c7d65a',.1);egg(c,2.2,-.3,1.9,1.5,'#f2c94c');c.beginPath();c.ellipse(1.6,-1.05,.7,.32,-.4,0,TAU);c.fillStyle='rgba(255,255,255,.35)';c.fill();
      tubeS(c,hg,'#d98a6e',.75);stroke(c,hg,'#ead2a8',.5);
      /* paroi de l'intestin moyen : une rangée de cellules (pointillés), puis l'intérieur */
      stroke(c,mg,'#b8675b',1.56);c.setLineDash([.06,.035]);stroke(c,mg,'#eba595',1.47);c.setLineDash([]);stroke(c,mg,LUMEN,1.3);orb(c,.25,-.35,.36,'#d98a6e');
      /* le micro-organisme, minuscule, dans l'intestin moyen */
      c.save();c.translate(-1.4,.5);c.scale(.15,.15);moSmall(c);c.restore();
      /* la coque : chitine ambrée translucide, plus épaisse (donc plus sombre) vers les bords, bandes des segments, grand reflet brillant */
      const gr=c.createRadialGradient(-.7,-.7,2.2,0,0,4.9);gr.addColorStop(0,'rgba(170,80,25,.06)');gr.addColorStop(.75,'rgba(150,62,18,.3)');gr.addColorStop(1,'rgba(110,40,10,.75)');fill(c,gs,gr);
      stroke(c,seg,'rgba(122,50,15,.5)',.12);c.save();c.translate(.1,0);stroke(c,seg,'rgba(255,215,170,.28)',.04);c.restore();
      stroke(c,gs,'#5e2a0e',.26);stroke(c,gs,'#9a4c1c',.14);
      c.save();c.translate(-1.5,-1.95);c.rotate(-.42);c.scale(2.3,.45);const gh=c.createRadialGradient(0,0,0,0,0,1);gh.addColorStop(0,'rgba(255,248,236,.42)');gh.addColorStop(1,'rgba(255,248,236,0)');
      c.fillStyle=gh;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();
      c.beginPath();c.ellipse(0,0,4.3,3.02,0,1.12*Math.PI,1.42*Math.PI);c.strokeStyle='rgba(255,250,240,.6)';c.lineWidth=.09;c.stroke();
      v.tag('Jabot',2.2,-1.9);v.tag('Intestin',-2.1,-.35)}}}

/* 8 · fourmi de 5 mm sur le sol de la forêt (1 unité = 1 mm) : tête, antennes coudées, thorax, pétiole, gastre (où se trouve l'intestin).
   Chitine brillante : chaque pièce est éclairée en haut à gauche, avec un reflet ; les pattes ont hanche, fémur, tibia et tarse en cinq articles */
const ANT='#B8541F',ANTG='#9a4418',ANTL='#8A3A16',ANTF='#5e240c';
/* une patte : points de la hanche, du genou, de la cheville et du pied ; celles de l'autre côté sont plus sombres */
function antLeg(c,[h,k,a,f],col){egg(c,h[0],h[1],.15,.11,col,.6);taper(c,h[0],h[1],k[0],k[1],.15,.09,col);taper(c,k[0],k[1],a[0],a[1],.085,.055,col);
  for(let i=0;i<5;i++){const t0=i/5,t1=(i+.86)/5;taper(c,lerp(a[0],f[0],t0),lerp(a[1],f[1],t0),lerp(a[0],f[0],t1),lerp(a[1],f[1],t1),.05,.038,col)}
  c.beginPath();c.moveTo(f[0],f[1]);c.quadraticCurveTo(f[0]+.08,f[1]-.02,f[0]+.1,f[1]+.04);c.strokeStyle=mix(col,'#000000',.4);c.lineWidth=.02;c.stroke()}
function L8(){const legs=[[[.95,-.85],[1.45,-1.3],[1.95,-.45],[2.2,0]],[[.55,-.82],[.6,-1.3],[.25,-.4],[.05,0]],[[.2,-.84],[-.35,-1.3],[-1.1,-.5],[-1.55,0]]],
    farL=legs.map(L=>L.map(([x,y],i)=>[x+.18+(i==3?.25:0),y-(i?.04:0)])),
    /* antenne : scape (long premier article) puis funicule de 11 articles qui s'épaissit en massue */
    fun=[[2.15,-2.25],[2.6,-2.15],[2.9,-1.9],[3.1,-1.55]],funP=(()=>{const P=[];for(let i=0;i<=11;i++){const t=i/11,u=t*3,j=Math.min(2,u|0),w=u-j,A=fun[j],B=fun[j+1];P.push([lerp(A[0],B[0],w),lerp(A[1],B[1],w)])}return P})(),
    /* thorax (mésosome) de profil : pronotum bombé, mésonotum, sillon, propodéum qui descend vers le pétiole */
    mes=path(p=>{p.moveTo(-.4,-.95);p.bezierCurveTo(-.36,-1.2,-.15,-1.32,.12,-1.28);p.quadraticCurveTo(.28,-1.2,.38,-1.3);p.bezierCurveTo(.5,-1.47,.8,-1.5,1.0,-1.45);
      p.bezierCurveTo(1.18,-1.4,1.28,-1.25,1.22,-1.08);p.bezierCurveTo(1.15,-.92,.95,-.82,.7,-.83);p.lineTo(.2,-.84);p.bezierCurveTo(-.05,-.85,-.3,-.86,-.4,-.95);p.closePath()}),
    mesHi=path(p=>{p.moveTo(-.22,-1.2);p.quadraticCurveTo(-.05,-1.27,.12,-1.24);p.moveTo(.45,-1.33);p.bezierCurveTo(.58,-1.43,.8,-1.45,.98,-1.4)}),
    mand=path(p=>{p.moveTo(2.1,-1.02);p.quadraticCurveTo(2.5,-1.04,2.52,-.8);p.lineTo(2.42,-.84);p.lineTo(2.4,-.78);p.lineTo(2.32,-.83);p.lineTo(2.29,-.77);p.quadraticCurveTo(2.2,-.9,2.05,-.9);p.closePath()}),
    stripes=path(p=>[-2.1,-1.6,-1.1].forEach(x=>{p.moveTo(x,-1.6);p.quadraticCurveTo(x+.12,-1,x,-.4)})),
    facets=blobs(Array.from({length:30},()=>{const t=rnd(0,TAU),r=Math.sqrt(Math.random())*.1;return[1.88+Math.cos(t)*r*1.2,-1.32+Math.sin(t)*r,.012]}).flat()),
    /* poils fins sur le pourtour du corps */
    hairs=path(p=>[[-1.6,-1,.92,.66,26],[1.75,-1.2,.5,.42,12],[.45,-1.02,.62,.3,10]].forEach(([x,y,rx,ry,n])=>{for(let i=0;i<n;i++){const a=rnd(Math.PI*1.05,Math.PI*2.05),px=x+Math.cos(a)*rx,py=y+Math.sin(a)*ry;p.moveTo(px,py);p.lineTo(px+Math.cos(a)*.13,py+Math.sin(a)*.13-.03)}})),
    /* sol : grains de sable (0,2 à 1,5 mm), brindille, mousse, une feuille morte et des brins d'herbe immenses à l'arrière */
    grains=['#9a7a56','#b09a80','#6a4e34'].map(()=>relief(Array.from({length:70},()=>{const r=rnd(.12,.7);return[rnd(-30,30),rnd(-.1,.5)+r*.3,r,r*rnd(.7,1),rnd(0,3)]}))),
    moss=path(p=>{for(let i=0;i<40;i++){const x=rnd(3,30)*(i%2?1:-1),h=rnd(.8,2.5);p.moveTo(x,0);p.quadraticCurveTo(x+rnd(-.4,.4),-h*.6,x+rnd(-.6,.6),-h)}}),
    leaf=path(p=>{p.moveTo(-26,-.1);p.bezierCurveTo(-20,-9,-10,-11,-4.5,-.1);p.closePath()}),
    veins=path(p=>{p.moveTo(-25,-.2);p.quadraticCurveTo(-15,-6.5,-5,-.2);for(let k=1;k<6;k++){const x=-25+k*3.4;p.moveTo(x,-.3-k*.2);p.lineTo(x+1.8,-4.5+Math.abs(k-3)*.6)}}),
    blades=[[-14,3.2,-.08],[-9,2.4,.05],[12,3,.06],[17,2.6,-.05],[23,3.4,.03]],twig=path(p=>{p.moveTo(6,-.35);p.lineTo(28,-.9)});
  return{a:[-1.6,-1],c:[.3,-1.4],
    back:(c,v)=>{blades.forEach(([x,w,a])=>{c.save();c.translate(x,0);c.rotate(a);const g=c.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'rgba(70,125,45,.55)');g.addColorStop(.45,'rgba(140,195,95,.55)');g.addColorStop(1,'rgba(60,110,40,.55)');
        c.fillStyle=g;c.beginPath();c.moveTo(-w/2,0);c.quadraticCurveTo(-w*.4,-40,0,-90);c.quadraticCurveTo(w*.4,-40,w/2,0);c.fill();c.restore()});
      const gl=c.createLinearGradient(-20,-9,-8,0);gl.addColorStop(0,'#b97a44');gl.addColorStop(1,'#8a5630');fill(c,leaf,gl);stroke(c,veins,'#6a3e1c',.25);c.lineCap='round';tubeS(c,twig,'#6b4a2e',.7);stroke(c,moss,'#5f9a3a',.18);
      const gs=c.createLinearGradient(0,0,0,4);gs.addColorStop(0,'#7a5a3a');gs.addColorStop(1,'#5a3f28');c.fillStyle=gs;c.fillRect(v.x0,0,v.x1-v.x0,Math.max(0,v.y1));
      ['#9a7a56','#b09a80','#6a4e34'].forEach((col,i)=>drawRelief(c,grains[i],col,.3))},
    main:(c,v)=>{const s=Math.sin(v.t*2)*.06;c.lineCap='round';c.lineJoin='round';
      farL.forEach(L=>antLeg(c,L,ANTF));
      /* gastre rayé, pétiole en écaille, thorax */
      egg(c,-1.6,-1,.92,.66,ANTG);stroke(c,stripes,'rgba(60,20,5,.5)',.07);c.save();c.translate(.05,0);stroke(c,stripes,'rgba(255,190,150,.22)',.025);c.restore();
      c.beginPath();c.ellipse(-1.92,-1.38,.36,.12,-.28,0,TAU);c.fillStyle='rgba(255,240,225,.42)';c.fill();
      egg(c,-.52,-1.1,.12,.26,ANT,-.15);
      const gm=c.createLinearGradient(0,-1.5,0,-.82);gm.addColorStop(0,mix(ANT,'#ffffff',.3));gm.addColorStop(.45,ANT);gm.addColorStop(1,mix(ANT,'#000000',.45));fill(c,mes,gm);
      stroke(c,mesHi,'rgba(255,235,215,.55)',.045);stroke(c,mes,'rgba(70,25,5,.5)',.02);
      legs.forEach(L=>antLeg(c,L,ANTL));
      /* tête : capsule brillante, mandibules dentées, œil composé à facettes */
      egg(c,1.75,-1.2,.5,.42,ANT,.25);fill(c,mand,'#5A2410');stroke(c,mand,'rgba(255,200,160,.35)',.015);
      const ge=c.createRadialGradient(1.84,-1.37,0,1.88,-1.32,.15);ge.addColorStop(0,'#3a2a24');ge.addColorStop(1,'#0c0806');c.beginPath();c.ellipse(1.88,-1.32,.15,.12,.2,0,TAU);c.fillStyle=ge;c.fill();
      fill(c,facets,'rgba(255,255,255,.12)');c.beginPath();c.ellipse(1.84,-1.38,.05,.025,-.4,0,TAU);c.fillStyle='rgba(255,255,255,.8)';c.fill();
      stroke(c,hairs,'rgba(70,30,10,.55)',.016);
      c.save();c.translate(1.95,-1.5);c.rotate(s);c.translate(-1.95,1.5);taper(c,1.95,-1.5,2.15,-2.25,.075,.06,ANTL);
      for(let i=0;i<11;i++){const A=funP[i],B=funP[i+1],w=.045+(i>7?(i-7)*.012:0);taper(c,A[0],A[1],lerp(A[0],B[0],.88),lerp(A[1],B[1],.88),w,w*1.1,ANTL)}c.restore()}}}
