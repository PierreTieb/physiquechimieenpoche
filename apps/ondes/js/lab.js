// Scène de propagation : molécules, onde, chrono, commandes
(function(){
  var $=Utils.$,MED=Utils.MED,ORDER=Utils.ORDER,fmtD=Utils.fmtD,fmtT=Utils.fmtT,LABS=[];
function createLab(host,o){
  var min=o.min||10,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var st={m:'air',d:o.guided?500:340,ral:false,state:'idle',T:0,t0:0,flash:-1e9,hit:-1e9,W:300,H:280,p:0,sel:!o.guided,wave:false,anim:1,dirty:true,echo:false,hide:!!o.hide},bgc=document.createElement('canvas');
  host.innerHTML='<div class="card"><div class="lab-top"><div class="ex-score">Chrono <b class="chr">0,000 s</b></div><div class="ex-score">Distance <b class="dst"></b></div>'+
  '<div class="part pral ralwrap"><div class="swrow"><button class="sw" role="switch" aria-checked="false" aria-label="Ralenti"></button><span>Ralenti</span></div><div class="mult"></div></div></div>'+
  '<div class="stage"><canvas role="img" aria-label="Scène : pétard, molécules et auditeur"></canvas><button class="btn-primary act part">Déclencher</button></div></div><div class="ex-feedback fb"></div>'+
  '<div class="card card--controls ctrls"><div class="part pmed"><div class="row-label">Milieu</div><div class="seg">'+ORDER.map(function(k){return'<button data-m="'+k+'" aria-pressed="false">'+MED[k].n+'<span>'+MED[k].who+'</span></button>'}).join('')+'</div></div>'+
  '<div class="part pdist"><div class="ctl__head"><label>Distance</label><span class="ctl__val dv"></span></div><input type="range" min="0" max="1000" aria-label="Distance"></div></div>';
  var q=function(s){return host.querySelector(s)},cv=q('canvas'),c=cv.getContext('2d'),rg=q('input'),sw=q('.sw'),act=q('.act'),fb=q('.fb'),chr=q('.chr');
  var parts={med:q('.pmed'),dist:q('.pdist'),ral:q('.pral'),act:act};
  function lf(){return Math.max(0,Math.min(1,Math.log(st.d/10)/Math.log(300)))}
  function path(){return st.echo?2*st.d:st.d}
  function vl(){return st.hide?.5:lf()}
  function dtxt(){return st.hide?'?':fmtD(st.d)}
  function mult(){var M=MED[st.m];return(st.ral&&M.thr)?Math.max(1,M.thr/path()):1}
  function place(){act.style.visibility=st.state==='run'?'hidden':'visible';act.style.left=Math.max(st.W*(st.echo?.3:.13),64)+'px';act.style.top=(st.H*.66+10)+'px'}
  function sync(){st.dirty=true;
    q('.dst').textContent=dtxt();q('.dv').textContent=dtxt();rg.style.setProperty('--p',(rg.value/10)+'%');
    var M=MED[st.m],m1=M.thr&&st.d>=M.thr;
    q('.mult').textContent=st.hide?'':st.m==='space'?'Pas de propagation dans le vide':(m1?'× 1 : inutile dès '+fmtD(M.thr):'Multiplicateur : × '+(Math.round((M.thr/st.d)*10)/10)+(st.ral?'':' (si activé)'));
    sw.disabled=st.m==='space'||st.state==='run';place();
    host.querySelectorAll('.seg button').forEach(function(b){b.setAttribute('aria-pressed',st.sel&&b.dataset.m===st.m?'true':'false')});
  }
  function dFromV(v){var r=min*Math.pow(3000/min,v/1000);return r>=100?Math.round(r/10)*10:Math.round(r)}
  function setV(){rg.value=Math.round(1000*Math.log(st.d/min)/Math.log(3000/min))}
  function lock(l){host.querySelectorAll('.seg button').forEach(function(b){b.disabled=l});rg.disabled=l;sw.disabled=l||st.m==='space'}
  var NEU={air:[235,240,245],water:[70,150,255],rock:[150,155,162]},WARM=[255,170,60],COOL=[60,200,255];
  function mix(a,b,k){return'rgb('+Math.round(a[0]+(b[0]-a[0])*k)+','+Math.round(a[1]+(b[1]-a[1])*k)+','+Math.round(a[2]+(b[2]-a[2])*k)+')'}
  function ci(x,y,r){c.beginPath();c.arc(x,y,r,0,6.283);c.fill()}
  function wallDraw(x1,W,H,m){c.fillStyle={air:'#5B6B84',water:'#17415E',rock:'#30293A'}[m]||'#444';c.fillRect(x1,H*.1,W-x1,H*.9);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x1,H*.1,3,H*.9);c.fillStyle='rgba(0,0,0,.22)';for(var y=H*.1+22;y<H;y+=26)c.fillRect(x1+3,y,W-x1,2)}
  // Matière : air = gaz clairsemé et désordonné qui s'agite ; eau = liquide serré et désordonné ; roche = cristal régulier qui vibre à peine
  var MAT={air:{sp:28,dis:.42,th:.22,w:2.6,r:.12},water:{sp:17,dis:.26,th:.1,w:1.3,r:.24},rock:{sp:16,dis:0,th:.035,w:9,r:.27}};
  function hs(i,j,k){var s=Math.sin(i*127.1+j*311.7+k*74.7)*43758.5453;return s-Math.floor(s)}   // nombre pseudo-aléatoire fixe par molécule
  function molecules(now,x0,x1,xc,l,rk){
    var W=st.W,H=st.H,m=st.m,ech=st.echo,P=MAT[m],N=NEU[m],t=now/1000,th0=reduce?0:P.th;
    var sp=P.sp*(1-.45*l)*Math.max(.8,Math.min(1.25,W/700)),rh=sp*.87,zt=H*.16,R=Math.floor(H*.62/rh),rad=Math.max(1.4,Math.min(m==='air'?3.4:6,P.r*sp)),dis=P.dis*sp,th=th0*sp;
    var L1=x1-x0,f=st.p*(L1+(ech?x1-xc:0)),front=(ech&&f>L1)?x1-(f-L1):x0+f,   // p=1 : l'onde est exactement au centre du personnage
        sig=Math.max(L1*.06,sp*2.2),lam=sig*1.5,A=Math.min(sp*.45,9),k=6.283/lam,mid=Math.round(L1/sp/2),tr=Math.floor(R/2),tx=0,ty=0,rx=0,B={};
    for(var j=0;j<R;j++){var yb=zt+(j+.5)*rh;
      for(var i=Math.floor(-x0/sp)-1;i<=(ech&&!rk?Math.floor(L1/sp):Math.ceil((W-x0)/sp));i++){
        var xr=x0+(i+(j&1)*.5)*sp+dis*(2*hs(i,j,1)-1),y=yb+dis*(2*hs(i,j,2)-1),u=0,cp=0;
        if(ech&&(rk?(xr-rk.x)*(xr-rk.x)+(y-rk.y)*(y-rk.y)<(rk.r+rad)*(rk.r+rad):xr>x1-rad))continue;   // pas de molécule dans le rocher (ou le mur)
        var ax=0,ay=0;if(th){var w=P.w*(.6+.8*hs(i,j,3));ax=th*Math.sin(t*w+6.283*hs(i,j,4));ay=th*Math.cos(t*w*.83+6.283*hs(i,j,5))}
        if(st.wave){var z=(xr-front)/sig,e=Math.exp(-z*z),ph=k*(xr-front);u=A*e*Math.sin(ph);cp=Math.max(-1,Math.min(1,-A*e*(-2*z/sig*Math.sin(ph)+k*Math.cos(ph))/.5))}
        if(i===mid&&j===tr){rx=xr;tx=xr+u+ax;ty=y+ay;continue}
        var q=Math.round(cp*6),p=B[q]||(B[q]=new Path2D()),px=xr+u+ax,py=y+ay;p.moveTo(px+rad,py);p.arc(px,py,rad,0,6.283)}}
    for(var q in B){var v=q/6;c.fillStyle=v>=0?mix(N,WARM,v):mix(N,COOL,-v);c.fill(B[q])}
    c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.setLineDash([3,4]);c.beginPath();c.moveTo(rx,zt);c.lineTo(rx,zt+R*rh);c.stroke();c.setLineDash([]);
    c.shadowColor='#fff';c.shadowBlur=14;c.fillStyle='#fff';c.beginPath();c.arc(tx,ty,Math.max(rad*1.7,3.5),0,6.283);c.fill();c.shadowBlur=0;
  }
  // Explosion : éclair, onde de choc, étincelles, débris et fumée
  var EXD=1100,SHK=650;
  function explosion(e,x,y,s){
    if(e<0||e>=EXD)return;var r=Utils.rng(Math.floor(st.flash)),f=1-Math.pow(1-Math.min(1,e/380),2),g,i,R0=(16+74*f)*s,al=Math.max(0,1-e/520);
    if(al){c.save();c.globalCompositeOperation='lighter';   // boule de feu et halo
      g=c.createRadialGradient(x,y,0,x,y,R0*2.2);g.addColorStop(0,'rgba(255,200,120,'+al*.55+')');g.addColorStop(1,'rgba(255,90,20,0)');c.fillStyle=g;ci(x,y,R0*2.2);
      g=c.createRadialGradient(x,y,0,x,y,R0);g.addColorStop(0,'rgba(255,255,235,'+al+')');g.addColorStop(.3,'rgba(255,225,110,'+al+')');g.addColorStop(.65,'rgba(255,130,30,'+al*.85+')');g.addColorStop(1,'rgba(220,50,20,0)');c.fillStyle=g;ci(x,y,R0);c.restore()}
    if(reduce)return;
    var a=Math.max(0,1-e/550);if(a){c.strokeStyle='rgba(255,240,200,'+a*.75+')';c.lineWidth=4*s*a+1;c.beginPath();c.arc(x,y,(14+e*.36)*s,0,6.283);c.stroke()}   // onde de choc
    for(i=0;i<9;i++){var sa=-Math.PI*r(),sv=(.03+r()*.04)*s,sd=90+r()*160,se=e-sd;if(se<0)continue;var sf=se/(EXD-sd),sr=(12+30*sf+r()*10)*s;   // fumée
      c.fillStyle='rgba('+(i%2?110:84)+','+(i%2?100:78)+','+(i%2?96:76)+','+.6*(1-sf)*Math.min(1,se/120)+')';ci(x+Math.cos(sa)*sv*se,y+Math.sin(sa)*sv*se*.7-18*s*sf,sr)}
    c.save();c.globalCompositeOperation='lighter';c.lineCap='round';
    for(i=0;i<40;i++){var an=r()*6.283,v=(.18+r()*.34)*s,life=400+r()*450,te=Math.min(e,life),px=x+Math.cos(an)*v*te,py=y+Math.sin(an)*v*te+.0004*s*te*te,sl=1-e/life;   // étincelles
      if(sl<=0)continue;c.strokeStyle='rgba(255,'+Math.round(150+100*sl)+','+Math.round(70*sl)+','+sl+')';c.lineWidth=(1.2+r()*1.4)*s;c.beginPath();c.moveTo(px,py);c.lineTo(px-Math.cos(an)*v*34,py-Math.sin(an)*v*34);c.stroke()}
    c.restore();
    for(i=0;i<11;i++){var da=-Math.PI*(.05+r()*.9),dv=(.14+r()*.2)*s,dl=Math.min(e,800),dx=x+Math.cos(da)*dv*dl,dy=y+Math.sin(da)*dv*dl+.0006*s*dl*dl,ro=e*.02*(r()-.5),al2=1-e/EXD;   // débris
      c.save();c.translate(dx,dy);c.rotate(ro);c.fillStyle=i%3?'rgba(214,52,40,'+al2+')':'rgba(60,60,72,'+al2+')';c.fillRect(-3.5*s,-1.6*s,7*s,3.2*s);c.restore()}
  }
  function draw(now){
    var W=st.W,H=st.H,m=st.m,ech=st.echo,x0=W*(ech?.3:.13),x1=W*.87,xc=ech?W*.13:x1,cy=H*.66,l=vl(),sc=H/260*(1.15-.4*l);   // xc = centre du personnage (écho : placé avant le pétard)
    c.drawImage(bgc,0,0,W,H);
    var rk=ech&&Sprites.ready('Rocher')?{x:x1+H*.5,y:H*.47,r:H*.5}:null;   // écho : rocher dont le bord gauche est en x1 (là où l'onde se réfléchit)
    if(m!=='space')molecules(now,x0,x1,xc,l,rk);
    if(ech&&!(rk&&Sprites.rock(c,rk.x,rk.y,rk.r)))wallDraw(x1,W,H,m);   // mur dessiné si l'image manque
    var ha=now-st.hit,dx=ha>=0&&ha<SHK&&!reduce?3.5*sc*Math.sin(ha*.09)*Math.exp(-ha/220):0,   // vibration à la réception de l'onde
        bob=(m==='water'?-H*.04:0)+((m==='water'||m==='space')&&!reduce?Math.sin(now/650)*3*sc:0);   // plongeur et astronaute flottent
    if(st.state!=='run')Sprites.cracker(c,x0,cy,sc);Sprites.person(c,xc+dx,cy+bob,sc,m,!ech);
    explosion(now-st.flash,x0,cy-30*sc,sc);
    c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1;c.setLineDash([4,5]);c.beginPath();c.moveTo(x0,H-16);c.lineTo(x1,H-16);c.stroke();c.setLineDash([]);
    c.fillStyle='rgba(0,0,0,.6)';c.fillRect(W/2-34,H-27,68,20);c.fillStyle='#E9EEF2';c.font='700 12px Figtree,sans-serif';c.textAlign='center';c.fillText(dtxt(),W/2,H-13);
  }
  function msg(t,ok){fb.textContent=t;fb.className='ex-feedback fb'+(ok?' ok':'')}
  function frame(now){
    if(!host.offsetParent)return;
    if(st.wave){st.p=(now-st.t0)/1000/st.anim;if(st.p>1.4)st.wave=false}
    if(st.dirty||!reduce||st.wave||st.state==='run'||now-st.flash<EXD||now-st.hit<SHK){st.dirty=false;draw(now)}   // hors « mouvement réduit » : agitation continue des molécules
    if(st.state!=='run')return;var el=(now-st.t0)/1000;
    if(st.m==='space'){chr.textContent=fmtT(el);chr.style.opacity=Math.max(0,1-el/4);
      if(el>=4){st.state='done';msg('Aucun son reçu : pas de matière, pas de propagation !');act.disabled=false;lock(false);sync();o.onDone&&o.onDone({m:'space',d:st.d,silent:true})}return}
    chr.textContent=fmtT(Math.min(1,st.p)*st.T);
    if(st.p>=1){st.state='done';st.hit=now;st.T=Math.round(st.T*1000)/1000;chr.textContent=fmtT(st.T);Sound.boom(st.m,path(),mult());msg('Le son est arrivé après '+fmtT(st.T)+'.',true);act.disabled=false;lock(false);sync();o.onDone&&o.onDone({m:st.m,d:st.d,T:st.T})}
  }
  function trigger(){
    if(st.state==='run')return;Sound.unlock();
    var M=MED[st.m];st.state='run';st.p=0;st.flash=performance.now();st.t0=st.flash;chr.style.opacity=1;chr.textContent='0,000 s';act.disabled=true;lock(true);sync();
    if(st.m==='space'){st.wave=false;msg('Le pétard explose… écoute bien.')}else{st.T=path()/M.v;st.anim=st.T*mult();st.wave=true;msg('Le son voyage de molécule en molécule…')}
    o.onStart&&o.onStart();
  }
  function reset(){st.state='idle';st.p=0;st.wave=false;chr.style.opacity=1;chr.textContent='0,000 s';act.textContent='Déclencher';act.disabled=false;msg('Règle la distance, puis déclenche le pétard.');lock(false);sync()}
  function size(){var w=cv.clientWidth;if(!w)return;var d=window.devicePixelRatio||1;st.W=w;st.H=Math.round(Math.max(230,Math.min(300,w*.72)));cv.style.height=st.H+'px';cv.width=w*d;cv.height=st.H*d;c.setTransform(d,0,0,d,0,0);Backgrounds.draw(bgc,st.W,st.H,st.m);place();st.dirty=true}
  host.querySelectorAll('.seg button').forEach(function(b){b.addEventListener('click',function(){st.m=b.dataset.m;st.sel=true;Backgrounds.draw(bgc,st.W,st.H,st.m);st.dirty=true;sync();o.onMedium&&o.onMedium(st.m)})});
  rg.addEventListener('input',function(){st.d=dFromV(+rg.value);sync()});
  sw.addEventListener('click',function(){st.ral=!st.ral;sw.setAttribute('aria-checked',st.ral);sync()});
  act.addEventListener('click',function(){if(st.state==='done')reset();trigger()});
  window.addEventListener('resize',size);setV();sync();reset();
  var api={msg:msg,setEcho:function(b){st.echo=!!b;st.dirty=true;sync()},dirty:function(){st.dirty=true},parts:parts,ctrls:q('.ctrls'),st:st,reset:reset,size:size,lock:lock,sync:sync,setMedium:function(m){st.m=m;Backgrounds.draw(bgc,st.W,st.H,st.m);st.dirty=true;sync()},clearSel:function(){st.sel=false;sync()},setD:function(d){st.d=d;setV();sync()}};
  LABS.push({frame:frame,dirty:function(){st.dirty=true}});return api;
}

  (function loop(now){LABS.forEach(function(l){l.frame(now)});requestAnimationFrame(loop)})(0);
  Sprites.onLoad(function(){LABS.forEach(function(l){l.dirty()})});
  window.createLab=createLab;
})();
