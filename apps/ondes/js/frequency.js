// Mode 3 : Fréquence et intensité (molécules, graphique sinusoïdal, compteur de dB, fenêtres d'aide)
window.Freq=(function(){
  var $=Utils.$,MAXF=30000,TWO=6.2832;
  var st={f:440,db:60,play:!matchMedia('(prefers-reduced-motion:reduce)').matches,t:0,run:false,last:0,W:300,H:190,GW:300,GH:112,dirty:true,audio:false,nof:false};
  var mic=false,saved=null,lastChips=0;
  var cs=$('fq-scene'),cx=cs.getContext('2d'),cg=$('fq-graph'),gx=cg.getContext('2d');
  var EQ=[[0,'Silence'],[10,'Feuilles dans le vent'],[25,'Chuchotement'],[35,'Salle calme'],[50,'Pluie légère'],[60,'Conversation'],[75,'Rue animée'],[90,'Tondeuse, perceuse'],[100,'Discothèque'],[110,'Concert'],[120,'Avion au décollage']];
  function eq(db){var r=EQ[0][1];EQ.forEach(function(e){if(db>=e[0])r=e[1]});return r}
  var NMAX=5,DMAX=6;                                                         // réglages de lisibilité : nombre max de vagues affichées ; déplacement max (px) à 120 dB
  function cyc(f){return NMAX*Math.log(1+f/100)/Math.log(301)}                 // nombre de vagues affichées (échelle visuelle, non réelle)
  function fv(f){return f<=0?0:.35+cyc(f)/NMAX}                               // vitesse visuelle de l'animation
  function fromV(v){return v<=0?0:Math.round(10*Math.pow(3000,(v-1)/999))}   // curseur logarithmique : 0 puis 10 Hz → 30 000 Hz
  function toV(f){return f<=0?0:Math.max(1,Math.min(1000,Math.round(1+999*Math.log(Math.max(f,10)/10)/Math.log(3000))))}
  function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
  function hz(f){return String(f).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')+' Hz'}
  function gainFor(db){return db<=0?0:.5*Math.pow(10,(Math.min(db,90)-90)/40)}  // volume réel raisonnable : plafonné à 90 dB

  /* ---------- affichage des valeurs ---------- */
  function update(){
    var f=st.f,db=st.db;
    var lost=mic&&st.nof;
    $('fq-val').textContent=lost?'— Hz':hz(f);
    var tag=lost?'Pas de fréquence nette (bruit ou silence)':f<20?'Infrasons : inaudibles':f>20000?'Ultrasons : inaudibles':'Audible : '+(f<250?'grave':f<2000?'médium':'aigu');
    if(mic&&!lost)tag='Micro · '+tag;
    $('fq-tag').textContent=tag;$('fq-tag').className='rd__tag '+(lost?'':f<20?'t-infra':f>20000?'t-ultra':'t-ok');
    $('db-val').textContent='≈ '+db+' dB';
    $('db-tag').textContent=eq(db)+(db>=120?' · seuil de la douleur':db>=90?' · danger pour l\'oreille':'');
    $('db-box').className='card rd '+(db>=120?'rd--pain':db>=90?'rd--danger':db>=60?'rd--warn':'rd--ok');
    if(document.activeElement!==$('fq-input'))$('fq-input').value=f;
    $('fq-range').value=toV(f);$('fq-range').style.setProperty('--p',(toV(f)/10)+'%');
    var fr=db/120,sl=$('amp-sl');sl.setAttribute('aria-valuenow',db);sl.setAttribute('aria-valuetext',db+' décibels');
    $('amp-thumb').style.bottom='calc((100% - 28px)*'+fr+')';$('amp-fill').style.height=(fr*100)+'%';
    st.dirty=true;audio();
  }
  function audio(){
    var m='';
    if(st.audio){
      var s=Tone.set(st.f,gainFor(st.db));
      m=s==='limit'?'Fréquence non reproductible sur cet appareil : son coupé.':s==='silence'?'0 Hz : pas de vibration, donc pas de son.':
        st.f<20?'Infrasons : le signal est généré mais tu ne peux pas l\'entendre.':st.f>20000?'Ultrasons : le signal est généré mais tu ne peux pas l\'entendre.':
        'Son réel à '+hz(st.f)+'.'+(st.db>90?' Le volume réel reste raisonnable : seul l\'affichage continue de monter.':'');
    }
    $('fq-msg').textContent=m;
  }
  function setF(f){st.f=clamp(Math.round(f),0,MAXF);update()}
  function setDb(d){st.db=clamp(Math.round(d),0,120);update()}

  /* ---------- dessin ---------- */
  function size(){
    var d=window.devicePixelRatio||1,w=cs.clientWidth,g=cg.clientWidth;if(!w||!g)return;
    st.W=w;st.GW=g;cs.width=w*d;cs.height=st.H*d;cx.setTransform(d,0,0,d,0,0);cg.width=g*d;cg.height=st.GH*d;gx.setTransform(d,0,0,d,0,0);st.dirty=true;
  }
  function mix(a,b,k){return'rgb('+Math.round(a[0]+(b[0]-a[0])*k)+','+Math.round(a[1]+(b[1]-a[1])*k)+','+Math.round(a[2]+(b[2]-a[2])*k)+')'}
  var NEU=[150,178,194],WARM=[255,170,60],COOL=[60,200,255];
  function drawScene(){
    var c=cx,W=st.W,H=st.H,M=30,L=W-M-8,sp=7,cols=Math.floor(L/sp),rows=9,zt=14,zh=H-28,rh=zh/rows;
    c.fillStyle='#050C11';c.fillRect(0,0,W,H);
    c.strokeStyle='rgba(110,210,240,.07)';c.lineWidth=1;c.beginPath();for(var gx0=M;gx0<=W;gx0+=L/8){c.moveTo(gx0,0);c.lineTo(gx0,H)}c.stroke();
    var n=cyc(st.f),k=n>0?TWO*n/L:0,D=st.f<=0?0:(st.db/120)*Math.min(DMAX,k>0?.85/k:DMAX),ph=TWO*fv(st.f)*st.t;
    function u(x){return D*Math.sin(k*x-ph)}function s(x){return D*k*Math.cos(k*x-ph)}
    c.fillStyle='#16303B';c.fillRect(2,zt-8,14,zh+16);c.fillStyle='#FFB26B';c.fillRect(M-14+u(0),zt-4,7,zh+8);   // haut-parleur
    var tr=Math.round(cols/2),tx=0,ty=0;
    for(var r=0;r<rows;r++){var y=zt+(r+.5)*rh;
      for(var i=0;i<cols;i++){var x0=(i+.5)*sp,cp=clamp(-s(x0)/.3,-1,1),px=M+x0+u(x0);
        if(r===4&&i===tr){tx=px;ty=y;continue}
        c.fillStyle=cp>=0?mix(NEU,WARM,cp):mix(NEU,COOL,-cp);c.beginPath();c.arc(px,y,2.1,0,TWO);c.fill()}}
    var rx=M+(tr+.5)*sp;c.strokeStyle='rgba(255,255,255,.35)';c.setLineDash([3,4]);c.beginPath();c.moveTo(rx,zt);c.lineTo(rx,zt+zh);c.stroke();c.setLineDash([]);
    c.shadowColor='#fff';c.shadowBlur=14;c.fillStyle='#fff';c.beginPath();c.arc(tx,ty,4,0,TWO);c.fill();c.shadowBlur=0;
  }
  function drawGraph(){
    var c=gx,W=st.GW,H=st.GH,b=H/2,A=(st.db/120)*(H/2-14),n=cyc(st.f),k=n>0?TWO*n/(W-16):0,ph=st.f<=0?0:TWO*fv(st.f)*st.t;
    c.fillStyle='#050C11';c.fillRect(0,0,W,H);
    c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.moveTo(8,b);c.lineTo(W-8,b);c.stroke();
    if(A>5){c.strokeStyle='rgba(242,107,195,.45)';c.beginPath();c.moveTo(8,b-A);c.lineTo(W-8,b-A);c.moveTo(8,b+A);c.lineTo(W-8,b+A);c.stroke();
      c.setLineDash([]);c.fillStyle='rgba(242,107,195,.9)';c.font='700 10px Figtree,sans-serif';c.textAlign='right';c.fillText('amplitude',W-10,b-A-3)}
    c.setLineDash([]);c.strokeStyle='#FFB26B';c.lineWidth=2.4;c.shadowColor='#FF9F5A';c.shadowBlur=8;c.beginPath();
    for(var x=8;x<=W-8;x+=2){var y=b-A*Math.sin(k*(x-8)-ph);x===8?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();c.shadowBlur=0;
  }
  function loop(now){
    if(!st.run)return;var dt=Math.min(.05,(now-st.last)/1000||0);st.last=now;
    if(st.play&&st.f>0){st.t+=dt;st.dirty=true}
    if(st.dirty){st.dirty=false;drawScene();drawGraph()}
    requestAnimationFrame(loop);
  }

  /* ---------- commandes ---------- */
  var sl=$('amp-sl'),drag=false;
  function fromPointer(e){var r=sl.getBoundingClientRect();setDb(clamp(1-(e.clientY-r.top-14)/(r.height-28),0,1)*120)}
  sl.addEventListener('pointerdown',function(e){if(mic)return;drag=true;try{sl.setPointerCapture(e.pointerId)}catch(x){}fromPointer(e);e.preventDefault()});
  sl.addEventListener('pointermove',function(e){if(drag)fromPointer(e)});
  ['pointerup','pointercancel'].forEach(function(n){sl.addEventListener(n,function(){drag=false})});
  sl.addEventListener('keydown',function(e){if(mic)return;var d={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:10,PageDown:-10}[e.key];
    if(d){setDb(st.db+d);e.preventDefault()}else if(e.key==='Home'){setDb(0)}else if(e.key==='End'){setDb(120)}});
  $('fq-range').addEventListener('input',function(){setF(fromV(+this.value))});
  function step(sgn){var s=Math.max(1,Math.round(st.f*.01));setF(st.f+sgn*s)}
  $('fq-minus').addEventListener('click',function(){step(-1)});$('fq-plus').addEventListener('click',function(){step(1)});
  function commit(){var v=parseFloat(String($('fq-input').value).replace(',','.').replace(/\s/g,''));if(isNaN(v)){update();return}setF(v)}
  $('fq-input').addEventListener('change',commit);
  $('fq-input').addEventListener('keydown',function(e){if(e.key==='Enter'){commit();this.blur()}});
  function audioBtn(on){var b=$('fq-audio');b.setAttribute('aria-pressed',on);b.textContent=on?'Couper le son':'Écouter'}
  $('fq-audio').addEventListener('click',function(){
    if(st.audio){st.audio=false;Tone.stop();audioBtn(false);audio();return}
    var s=Tone.start(st.f,gainFor(st.db));if(s==='none'){$('fq-msg').textContent='Le son n\'est pas disponible sur cet appareil.';return}
    st.audio=true;audioBtn(true);audio();
  });
  window.addEventListener('resize',function(){if(st.run)size()});


  /* ---------- analyse du micro ---------- */
  function micUI(on){
    mic=on;var b=$('fq-analyze');b.textContent=on?'Arrêter l\'analyse':'Analyser';b.setAttribute('aria-pressed',on);
    ['fq-range','fq-input','fq-minus','fq-plus','fq-audio'].forEach(function(i){$(i).disabled=on});
    document.querySelector('.fq-fine').style.display=on?'none':'';$('fq-tune').style.display=on?'':'none';disp=null;rec=[];
    sl.classList.toggle('vs--off',on);sl.setAttribute('aria-disabled',on);$('fq-meas').style.display=on?'':'none';
  }
  // note la plus proche (La = 440 Hz) : affichage indicatif, sans numéro d'octave
  var NOTE=['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'],disp=null,rec=[],lastUpd=0;
  function tune(fm,d){
    var g=$('tn-g'),s=$('tn-s');
    if(d==null||d<27||d>4200){$('tn-f').textContent=d==null?'— Hz':hz(Math.round(d));$('tn-n').textContent='—';g.className='tg tg--off';s.textContent=d==null?'Pas de note nette':'Hors des notes';s.className='';return}
    var k=Math.round(12*Math.log(d/440)/Math.LN2),fn=440*Math.pow(2,k/12),half=fn*(Math.pow(2,1/24)-1),diff=fm-fn,ok=Math.abs(diff)<=2;
    $('tn-f').textContent=hz(Math.round(d));
    $('tn-n').innerHTML=NOTE[((k+9)%12+12)%12]+' <span>'+Math.round(fn)+' Hz</span>';
    $('tn-ok').style.width=Math.min(100,4/(2*half)*100)+'%';                                  // zone « Correct » : ±2 Hz
    $('tn-nd').style.left=(50+50*clamp(diff/half,-1,1))+'%';
    g.className='tg'+(ok?' tg--ok':'');s.textContent=ok?'Correct':diff<0?'Plus grave':'Plus aigu';s.className=ok?'is-ok':'';
  }
  function natureOf(cl){return cl>.85?'son net':cl>.5?'son mélangé':'bruit'}
  function onMic(m){
    var n=performance.now();if(n-lastUpd<100)return;lastUpd=n;                              // rafraîchissement toutes les 100 ms
    st.db=clamp(Math.round(m.db),0,120);
    if(m.f==null){rec=[];disp=null}                                                           // la valeur affichée est la médiane des 5 dernières mesures (100 ms),
    else{rec.push(m.f);if(rec.length>5)rec.shift();                                           // et ne change que si l'écart dépasse 3 Hz
      if(rec.length>=3){var md=rec.slice().sort(function(a,b){return a-b})[rec.length>>1];if(disp==null||Math.abs(md-disp)>3)disp=md}}
    st.nof=disp==null;st.f=disp==null?0:clamp(Math.round(disp),0,MAXF);update();tune(m.f,disp);
    if(n-lastChips<150)return;lastChips=n;
    var per=m.f==null?'—':(1000/m.f>=10?(1000/m.f).toFixed(1):(1000/m.f).toFixed(2)).replace('.',',')+' ms';
    $('fq-meas').innerHTML='<span class="mu-chip">Période <b>'+per+'</b></span><span class="mu-chip">Amplitude <b>'+Math.round(m.amp*100)+' %</b></span><span class="mu-chip">Nature <b>'+(m.silent?'silence':natureOf(m.clarity))+'</b></span>';
  }
  function stopMic(){
    Mic.stop();if(!mic)return;micUI(false);st.nof=false;if(saved){st.f=saved.f;st.db=saved.db}update();$('fq-msg').textContent='';
  }
  $('fq-analyze').addEventListener('click',function(){
    if(mic){stopMic();return}
    if(st.audio){st.audio=false;Tone.stop();audioBtn(false)}
    saved={f:st.f,db:st.db};$('fq-msg').textContent='Autorise le micro pour commencer…';
    Mic.start(onMic).then(function(){micUI(true);$('fq-msg').textContent='J\'écoute. Siffle, chante ou joue un son près du micro. Rien n\'est enregistré.'}).catch(function(e){
      micUI(false);$('fq-msg').textContent=e&&e.name==='NoMic'?'Le micro n\'est pas disponible ici : ouvre la page en https (par exemple sur GitHub Pages).':
        e&&e.name==='NotAllowedError'?'Accès au micro refusé : autorise-le dans les réglages du navigateur, puis réessaie.':'Impossible d\'utiliser le micro sur cet appareil.'});
  });

  /* ---------- fenêtres d'aide ---------- */
  function wp(x,y,w,a,n){var d='',N=Math.max(24,Math.round(n*16));for(var i=0;i<=N;i++)d+=(i?'L':'M')+(x+w*i/N).toFixed(1)+' '+(y-a*Math.sin(TWO*n*i/N)).toFixed(1);return d}
  function svg(h,inner){return'<svg viewBox="0 0 320 '+h+'" width="100%" role="img" aria-hidden="true" style="display:block;margin:10px 0">'+inner+'</svg>'}
  var T='font-family="Figtree,sans-serif" font-weight="700"';
  function strip(y,n,col,label,lc){return'<rect x="8" y="'+(y+12)+'" width="304" height="30" rx="8" fill="#0A0F13" stroke="#2A343C"/><path d="'+wp(14,y+27,292,10,n)+'" fill="none" stroke="'+col+'" stroke-width="2.2"/><text x="10" y="'+(y+8)+'" font-size="11" '+T+' fill="'+lc+'">'+label+'</text>'}
  var HELP={
    freq:{t:'La fréquence',b:function(){return'<p>La <b class="t-freq">fréquence</b> est le nombre de <b class="t-freq">vibrations par seconde</b>. <span class="t-freq">100 vibrations</span> en 1 s équivaut à une fréquence de <b class="t-freq">100 Hertz (Hz)</b>.</p>'+
      svg(150,strip(0,2,'#B79CFF','1 s : peu de vibrations → fréquence basse','#B79CFF')+strip(48,6,'#4DD6C8','1 s : plus de vibrations → fréquence moyenne','#4DD6C8')+strip(96,16,'#7CC8FF','1 s : beaucoup de vibrations → fréquence haute','#7CC8FF'))+
      '<p>Plus la fréquence est <b>élevée</b>, plus le son est <b class="t-aigu">aigu</b>. À l\'inverse, plus la fréquence est <b>basse</b>, plus le son est <b class="t-grave">grave</b>.</p>'+
      '<div style="text-align:center"><span class="chip t-grave">Fréquence basse → grave</span><span class="chip t-aigu">Fréquence haute → aigu</span></div>'+
      '<p>L\'être humain entend les fréquences situées entre <b class="t-ok">20 Hz</b> et <b class="t-ok">20 000 Hz</b>. Plus haut, cela s\'appelle les <b class="t-ultra">Ultrasons</b>, plus bas ce sont les <b class="t-infra">Infrasons</b>.</p>'+
      svg(70,'<rect x="8" y="10" width="72" height="26" rx="6" fill="#6C54C4"/><rect x="80" y="10" width="160" height="26" rx="0" fill="#2FA874"/><rect x="240" y="10" width="72" height="26" rx="6" fill="#D2527F"/>'+
      '<text x="44" y="27" text-anchor="middle" font-size="11" '+T+' fill="#fff">Infrasons</text><text x="160" y="27" text-anchor="middle" font-size="12" '+T+' fill="#fff">Audible</text><text x="276" y="27" text-anchor="middle" font-size="11" '+T+' fill="#fff">Ultrasons</text>'+
      '<text x="80" y="54" text-anchor="middle" font-size="11" '+T+' fill="#6FE3A0">20 Hz</text><text x="240" y="54" text-anchor="middle" font-size="11" '+T+' fill="#6FE3A0">20 000 Hz</text>')}},
    db:{t:'Le niveau d\'intensité sonore',b:function(){
      function X(d){return 14+292*d/120}
      var ticks=[[0,'0 dB','silence'],[30,'30 dB','salle calme'],[60,'60 dB','conversation'],[90,'90 dB','danger'],[120,'120 dB','douleur']].map(function(t){var col=t[0]>=90?'#FF6B5E':'#C9D3DC';
        return'<line x1="'+X(t[0])+'" y1="30" x2="'+X(t[0])+'" y2="40" stroke="'+col+'" stroke-width="2"/><text x="'+Math.min(300,Math.max(20,X(t[0])))+'" y="54" text-anchor="middle" font-size="11" '+T+' fill="'+col+'">'+t[1]+'</text><text x="'+Math.min(296,Math.max(24,X(t[0])))+'" y="68" text-anchor="middle" font-size="10.5" '+T+' fill="'+col+'">'+t[2]+'</text>'}).join('');
      return'<p>Le <b class="t-amp">niveau d\'intensité sonore</b> est ce qu\'on appelle généralement « le <b class="t-amp">volume sonore</b> ». Il se mesure en <b class="t-db">décibels (dB)</b>.</p>'+
      svg(80,'<defs><linearGradient id="gdb" x1="0" x2="1"><stop offset="0" stop-color="#3FBF7F"/><stop offset=".5" stop-color="#8FD35A"/><stop offset=".72" stop-color="#FFB347"/><stop offset=".78" stop-color="#FF6B5E"/><stop offset="1" stop-color="#B3261E"/></linearGradient></defs><rect x="14" y="12" width="292" height="16" rx="8" fill="url(#gdb)"/>'+ticks)+
      '<p>L\'oreille humaine est un organe <b>sensible et fragile</b> : certains sons sont trop forts et présentent un <b class="t-danger">danger</b>. À partir de <b class="t-danger">120 dB</b>, le son présente un vrai risque d\'abîmer les tympans.</p>'}},
    graph:{t:'Le graphique',b:function(){
      function panel(x,y,n,a,col,cap,arrow){return'<rect x="'+x+'" y="'+y+'" width="148" height="72" rx="8" fill="#0A0F13" stroke="#2A343C"/><line x1="'+(x+6)+'" y1="'+(y+36)+'" x2="'+(x+142)+'" y2="'+(y+36)+'" stroke="#55606A" stroke-dasharray="2 4"/><path d="'+wp(x+8,y+36,132,a,n)+'" fill="none" stroke="'+col+'" stroke-width="2.2"/>'+
        (arrow?'<line x1="'+(x+14)+'" y1="'+(y+36)+'" x2="'+(x+14)+'" y2="'+(y+36-a)+'" stroke="#F26BC3" stroke-width="2"/><path d="M'+(x+10)+' '+(y+36-a+6)+' L'+(x+14)+' '+(y+36-a)+' L'+(x+18)+' '+(y+36-a+6)+'" fill="none" stroke="#F26BC3" stroke-width="2"/>':'')+
        '<text x="'+(x+74)+'" y="'+(y+90)+'" text-anchor="middle" font-size="11" '+T+' fill="'+col+'">'+cap+'</text>'}
      return'<p>On peut représenter la <b>proximité des molécules</b> par un graphique. La <b class="t-amp">hauteur de la vague</b> est l\'<b class="t-amp">amplitude</b>, elle est liée au <b class="t-amp">niveau d\'intensité sonore</b>. Plus l\'onde est forte, plus la vague est haute, plus le son est violent.</p>'+
      svg(104,panel(8,6,3,9,'#F26BC3','Son faible : petite vague',false)+panel(164,6,3,28,'#F26BC3','Son fort : grande vague',true))+
      '<p>Le <b class="t-freq">nombre de vagues</b> correspond au nombre de vibrations, c\'est-à-dire qu\'il correspond à la <b class="t-freq">fréquence</b>. Plus la fréquence est haute, plus les vagues sont <b>rapprochées</b>.</p>'+
      svg(104,panel(8,6,2,18,'#4DD6C8','Peu de vagues : grave',false)+panel(164,6,8,18,'#4DD6C8','Beaucoup de vagues : aigu',false))}}
  };
  var ov=$('modal');
  function openHelp(k){$('md-t').textContent=HELP[k].t;$('md-b').innerHTML=HELP[k].b();ov.classList.add('open');$('md-x').focus({preventScroll:true});document.querySelector('#modal .ov-panel').scrollTop=0}
  function closeHelp(){ov.classList.remove('open')}
  document.querySelectorAll('[data-help]').forEach(function(b){b.addEventListener('click',function(){openHelp(b.dataset.help)})});
  ov.addEventListener('click',function(e){if(e.target===ov)closeHelp()});$('md-x').addEventListener('click',closeHelp);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeHelp()});

  function stop(){stopMic();st.run=false;if(st.audio){st.audio=false;Tone.stop();audioBtn(false)}closeHelp()}
  function start(){size();st.run=true;st.last=performance.now();update();requestAnimationFrame(loop)}
  return{start:start,stop:stop};
})();
