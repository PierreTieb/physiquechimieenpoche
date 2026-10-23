// Instruments synthétisés (aucun enregistrement) : piano, orgue, xylophone. Hauteurs exactes.
window.Instruments=(function(){
  var AC=null,master=null,comp=null,cur=null,DUR=2;                         // chaque note s'éteint en fondu en 2 s
  function chain(){comp=AC.createDynamicsCompressor();master=AC.createGain();master.gain.value=.9;master.connect(comp);comp.connect(AC.destination)}
  function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;try{AC=new C();chain()}catch(e){AC=null}}return AC}
  function unlock(){if(ctx()&&AC.state!=='running')AC.resume();return !!AC}
  function partial(f,t,dur,peak,att,tau,hold){                              // montée, puis décroissance (tau) ou tenue (hold)
    var o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);
    if(hold){g.gain.setValueAtTime(peak,t+dur-hold);g.gain.linearRampToValueAtTime(0,t+dur)}else g.gain.setTargetAtTime(0,t+att,tau);
    o.connect(g);g.connect(cur);o.start(t);o.stop(t+dur+.05);
  }
  function additive(P,f,t,dur,a,att,tauFn,hold,mult){var s=P.reduce(function(x,y){return x+y},0);P.forEach(function(p,i){partial(f*(mult?mult[i]:i+1),t,dur,a*p/s*1.6,att,tauFn(i+1),hold)})}
  var V={
    piano:function(f,t,a,L){additive([1,.55,.3,.16,.08],f,t,L+.1,a,.005,function(h){return 1.1/Math.pow(h,.7)},0)},
    organ:function(f,t,a,L){additive([1,.7,.45,.3],f,t,Math.max(2,L),a*.8,.03,function(){return 1},.25)},
    xylo:function(f,t,a){additive([1,.38,.14],f,t,1.6,a,.002,function(h){return h===1?.45:.2},0,[1,3,6])}
  };
  // at : instant (horloge audio) du départ ; dur : durée de la note en secondes (sinon note de clavier : fondu en 2 s) ; vol : volume relatif (1 par défaut)
  function play(inst,freqs,at,dur,vol){
    if(!unlock())return false;var t0=at!=null?at:AC.currentTime+.03,a=(vol||1)*.55/Math.sqrt(freqs.length),end=dur?dur+.3:DUR,fs=dur?dur:DUR-.5;
    freqs.forEach(function(f){cur=AC.createGain();cur.gain.setValueAtTime(1,t0);cur.gain.setValueAtTime(1,t0+fs);cur.gain.linearRampToValueAtTime(0,t0+end);cur.connect(master);V[inst](f,t0,a,end)});
    return true;
  }
  function time(){return unlock()?AC.currentTime:0}
  function stopAll(){
    if(!AC||!master)return;var m=master,t=AC.currentTime;m.gain.cancelScheduledValues(t);m.gain.setTargetAtTime(0,t,.03);
    setTimeout(function(){try{m.disconnect()}catch(e){}},300);master=AC.createGain();master.gain.value=.9;master.connect(comp);
  }
  return{play:play,stopAll:stopAll,unlock:unlock,time:time};
})();
