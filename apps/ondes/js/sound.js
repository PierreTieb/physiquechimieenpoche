// Détonation synthétisée. Même intensité dans tous les milieux, atténuée avec la distance.
// Eau : plus grave. Roche : écho. Mode Ralenti : son étiré et plus grave.
window.Sound=(function(){
  var AC=null;
  function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume()}catch(e){}}
  function boom(m,d,slow){
    if(!AC)return;
    try{
      var lf=Math.max(0,Math.min(1,Math.log(d/10)/Math.log(300)));
      var gain=.9*Math.pow(10,-.45*Math.log10(d/10));            // 10 m : fort, 3 km : environ -22 dB (identique pour tous les milieux)
      var cut={air:4500,water:1800,rock:3200}[m]*(1-.5*lf);      // le lointain devient plus sourd
      var sr=slow>1?Math.max(.25,1/slow):1;                      // ralenti
      var rate=Math.max(.18,(m==='water'?.55:1)*sr);             // eau : plus grave
      var len=Math.floor(AC.sampleRate*1.0),buf=AC.createBuffer(1,len,AC.sampleRate),a=buf.getChannelData(0);
      for(var i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);
      var s=AC.createBufferSource();s.buffer=buf;s.playbackRate.value=rate;
      var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;
      var g=AC.createGain();g.gain.value=gain;
      s.connect(f);f.connect(g);g.connect(AC.destination);
      if(m==='rock'){                                            // roche : écho (retard avec rétroaction)
        var dl=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter(),wet=AC.createGain();
        dl.delayTime.value=Math.min(.95,.18/sr);fb.gain.value=.55;lp.type='lowpass';lp.frequency.value=1800;wet.gain.value=.8;
        g.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(wet);wet.connect(AC.destination);
      }
      s.start();
    }catch(e){}
  }
  return{unlock:unlock,boom:boom};
})();
