// Scène de propagation : molécules, onde, chrono, commandes
(function(){
  var $=Utils.$,MED=Utils.MED,ORDER=Utils.ORDER,fmtD=Utils.fmtD,fmtT=Utils.fmtT,LABS=[];
function createLab(host,o){
  var min=o.min||10,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var st={m:'air',d:o.guided?500:340,ral:false,state:'idle',T:0,t0:0,flash:-1e9,W:300,H:280,p:0,sel:!o.guided,wave:false,anim:1,dirty:true,echo:false,hide:!!o.hide},bgc=document.createElement('canvas');
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
  function draw(now){
    var W=st.W,H=st.H,m=st.m,ech=st.echo,x0=W*(ech?.3:.13),x1=W*.87,xc=ech?W*.13:x1,cy=H*.66,l=vl(),sc=1.5-.9*l;   // xc = centre du personnage (écho : placé avant le pétard)
    c.drawImage(bgc,0,0,W,H);
    if(m!=='space'){
      var cm={air:1,water:1.4,rock:1.8}[m],nb=Math.round((12+28*l)*cm),sp=(x1-x0)/nb,R={air:7,water:9,rock:10}[m],zt=H*.16,rh=H*.62/R,rad=({air:2.4,water:2.6,rock:2.8}[m])*(1.1-.35*l),N=NEU[m];
      var L1=x1-x0,f=st.p*(L1+(ech?x1-xc:0)),front=(ech&&f>L1)?x1-(f-L1):x0+f,   // p=1 : l'onde est exactement au centre du personnage
          sig=Math.max((x1-x0)*.06,sp*2.2),lam=sig*1.5,A=Math.min(sp*.4,9),k=6.283/lam,mid=Math.round(nb/2),tr=Math.floor(R/2),tx=0,ty=0;
      for(var j=0;j<R;j++){var y=zt+(j+.5)*rh;
        for(var i=Math.floor(-x0/sp);i<=(st.echo?Math.floor((x1-x0)/sp):Math.ceil((W-x0)/sp));i++){
          var xr=x0+i*sp,u=0,cp=0;
          if(st.wave){var z=(xr-front)/sig,e=Math.exp(-z*z),ph=k*(xr-front);u=A*e*Math.sin(ph);cp=Math.max(-1,Math.min(1,-A*e*(-2*z/sig*Math.sin(ph)+k*Math.cos(ph))/.5))}
          if(i===mid&&j===tr){tx=xr+u;ty=y;continue}
          c.fillStyle=cp>=0?mix(N,WARM,cp):mix(N,COOL,-cp);c.beginPath();c.arc(xr+u,y,rad,0,6.283);c.fill()}}
      var rx=x0+mid*sp;c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.setLineDash([3,4]);c.beginPath();c.moveTo(rx,zt);c.lineTo(rx,zt+R*rh);c.stroke();c.setLineDash([]);
      c.shadowColor='#fff';c.shadowBlur=14;c.fillStyle='#fff';c.beginPath();c.arc(tx,ty,rad*1.9,0,6.283);c.fill();c.shadowBlur=0}
    if(st.echo)wallDraw(x1,W,H,m);
    if(st.state!=='run')Sprites.cracker(c,x0,cy,sc);Sprites.person(c,xc,cy,sc,m);
    var fl=now-st.flash;if(fl<350){var f=fl/350;c.fillStyle='rgba(255,220,120,'+(1-f)*.85+')';ci(x0+6*sc,cy-52*sc,16+60*f)}
    c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1;c.setLineDash([4,5]);c.beginPath();c.moveTo(x0,H-16);c.lineTo(x1,H-16);c.stroke();c.setLineDash([]);
    c.fillStyle='rgba(0,0,0,.6)';c.fillRect(W/2-34,H-27,68,20);c.fillStyle='#E9EEF2';c.font='700 12px Figtree,sans-serif';c.textAlign='center';c.fillText(dtxt(),W/2,H-13);
  }
  function msg(t,ok){fb.textContent=t;fb.className='ex-feedback fb'+(ok?' ok':'')}
  function frame(now){
    if(!host.offsetParent)return;
    if(st.wave){st.p=(now-st.t0)/1000/st.anim;if(st.p>1.4)st.wave=false}
    if(st.dirty||st.wave||st.state==='run'||now-st.flash<400){st.dirty=false;draw(now)}
    if(st.state!=='run')return;var el=(now-st.t0)/1000;
    if(st.m==='space'){chr.textContent=fmtT(el);chr.style.opacity=Math.max(0,1-el/4);
      if(el>=4){st.state='done';msg('Aucun son reçu : pas de matière, pas de propagation !');act.disabled=false;lock(false);sync();o.onDone&&o.onDone({m:'space',d:st.d,silent:true})}return}
    chr.textContent=fmtT(Math.min(1,st.p)*st.T);
    if(st.p>=1){st.state='done';st.T=Math.round(st.T*1000)/1000;chr.textContent=fmtT(st.T);Sound.boom(st.m,path(),mult());msg('Le son est arrivé après '+fmtT(st.T)+'.',true);act.disabled=false;lock(false);sync();o.onDone&&o.onDone({m:st.m,d:st.d,T:st.T})}
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
