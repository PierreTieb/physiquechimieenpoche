// Détonation synthétisée. Même niveau sonore dans tous les milieux, atténué seulement par la distance (même atténuation partout).
// Eau : plus grave et étouffé. Roche : écho. Le volume est compensé pour que ces effets ne rendent pas le son plus faible.
// Mode Ralenti : son étiré et plus grave, volume compensé lui aussi.
window.Sound=(function(){
  var AC=null;
  // couleur du son par milieu : coupure des aigus (Hz), hauteur (vitesse de lecture) et gain de compensation
  // (un bruit étouffé ou plus grave paraît plus faible : on le remonte pour garder le niveau de l'air)
  var FX={air:{cut:4500,rate:1,comp:1},water:{cut:1800,rate:.55,comp:2},rock:{cut:3200,rate:1,comp:1.2}};
  function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume()}catch(e){}}
  function boom(m,d,slow){
    if(!AC)return;
    try{
      var fx=FX[m]||FX.air,lf=Math.max(0,Math.min(1,Math.log(d/10)/Math.log(300)));
      var sr=slow>1?Math.max(.5,1/slow):1;                         // ralenti
      var gain=.9*Math.pow(10,-.45*Math.log10(d/10))*fx.comp/Math.sqrt(sr);   // 10 m : fort, 3 km : environ -22 dB (identique pour tous les milieux)
      var cut=fx.cut*(1-.5*lf);                                    // le lointain devient plus sourd
      var len=Math.floor(AC.sampleRate*1.0),buf=AC.createBuffer(1,len,AC.sampleRate),a=buf.getChannelData(0);
      for(var i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);
      var s=AC.createBufferSource();s.buffer=buf;s.playbackRate.value=Math.max(.25,fx.rate*sr);
      var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;
      var g=AC.createGain();g.gain.value=Math.min(2.2,gain);
      s.connect(f);f.connect(g);g.connect(AC.destination);
      if(m==='rock'){                                              // roche : écho (retard avec rétroaction)
        var dl=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter(),wet=AC.createGain();
        dl.delayTime.value=Math.min(.95,.18/sr);fb.gain.value=.55;lp.type='lowpass';lp.frequency.value=1800;wet.gain.value=.8;
        g.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(wet);wet.connect(AC.destination);
      }
      s.start();
    }catch(e){}
  }
  return{unlock:unlock,boom:boom};
})();
