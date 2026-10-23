// Son pur (sinusoïde) à la fréquence exacte demandée. Contexte à 96 kHz quand l'appareil l'accepte, pour atteindre 30 000 Hz.
window.Tone=(function(){
  var AC=null,osc=null,gn=null;
  function ctx(){
    if(AC)return AC;var C=window.AudioContext||window.webkitAudioContext;
    try{AC=new C({sampleRate:96000})}catch(e){try{AC=new C()}catch(e2){AC=null}}
    return AC;
  }
  function limit(){return AC?Math.min(30000,AC.sampleRate/2-500):0}     // au-delà : repliement, donc son coupé
  function status(f){return f<1?'silence':(f>limit()?'limit':'ok')}
  function set(f,g){
    if(!osc)return status(f);var t=AC.currentTime,s=status(f);
    osc.frequency.setTargetAtTime(Math.min(Math.max(f,1),limit()),t,.02);
    gn.gain.setTargetAtTime(s==='ok'?g:0,t,.04);                         // fondus : pas de claquement
    return s;
  }
  function start(f,g){
    if(!ctx())return 'none';try{AC.resume()}catch(e){}
    if(!osc){osc=AC.createOscillator();gn=AC.createGain();osc.type='sine';gn.gain.value=0;osc.frequency.value=Math.max(1,Math.min(f,limit()));osc.connect(gn);gn.connect(AC.destination);osc.start()}
    return set(f,g);
  }
  function stop(){
    if(!osc)return;var o=osc,g=gn;osc=gn=null;
    try{g.gain.setTargetAtTime(0,AC.currentTime,.03);o.stop(AC.currentTime+.25);setTimeout(function(){o.disconnect();g.disconnect()},400)}catch(e){}
  }
  return{start:start,set:set,stop:stop,limit:function(){ctx();return limit()}};
})();
