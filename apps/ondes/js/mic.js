// Analyse du micro : fréquence (Hz), niveau (dB approximatif), amplitude, nature du son. Tout reste sur l'appareil : rien n'est enregistré ni envoyé.
window.Mic=(function(){
  var ctx=null,stream=null,an=null,tb=null,fb=null,run=false,cb=null,hist=[],dbS=null,lastOk=0,token=0,DB_OFFSET=105;   // téléphone non calibré : dB SPL ≈ dB pleine échelle + 105
  function available(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}
  // YIN : fréquence fondamentale par autocorrélation (60 à 1500 Hz)
  function yin(x,sr){
    var N=2048,minL=Math.floor(sr/1500),maxL=Math.min(Math.floor(sr/60),x.length-N-2),d=new Float32Array(maxL+2),cum=0,t,tau=-1;
    for(var l=1;l<=maxL;l++){var s=0;for(var i=0;i<N;i+=2){var df=x[i]-x[i+l];s+=df*df}cum+=s;d[l]=cum?s*l/cum:1}
    for(t=minL;t<=maxL;t++){if(d[t]<.15){while(t+1<=maxL&&d[t+1]<d[t])t++;tau=t;break}}
    if(tau<0){var m=1;for(t=minL;t<=maxL;t++)if(d[t]<m){m=d[t];tau=t}if(m>=.3)return null}
    var a=d[tau-1],b=d[tau],c=d[tau+1],den=2*(a-2*b+c),sh=den?(a-c)/den:0;
    return{f:sr/(tau+Math.max(-1,Math.min(1,sh))),clarity:1-b};
  }
  // pic du spectre (de 60 Hz à la limite du micro) : sert aux sons purs aigus et à écarter les faux résultats de YIN
  function spectrum(sr){
    an.getFloatFrequencyData(fb);var bw=sr/an.fftSize,i0=Math.ceil(60/bw),i1=Math.min(fb.length-2,Math.floor(Math.min(sr/2-300,30000)/bw)),mx=-1e9,mi=-1,sum=0,n=0,i;
    for(i=i0;i<=i1;i++){sum+=fb[i];n++;if(fb[i]>mx){mx=fb[i];mi=i}}
    if(mi<1)return null;
    var a=fb[mi-1],b=fb[mi],c=fb[mi+1],d=a-2*b+c,sh=d?.5*(a-c)/d:0;
    return{f:(mi+sh)*bw,mag:mx,prom:mx-sum/n,at:function(f){var k=Math.round(f/bw);return Math.max(fb[k-1],fb[k],fb[k+1])}};
  }
  function median(a){var s=a.slice().sort(function(x,y){return x-y});return s[Math.floor(s.length/2)]}
  function frame(){
    if(!run)return;requestAnimationFrame(frame);
    var sr=ctx.sampleRate;an.getFloatTimeDomainData(tb);
    var mean=0,i;for(i=0;i<tb.length;i++)mean+=tb[i];mean/=tb.length;
    var sq=0,pk=0;for(i=0;i<tb.length;i++){var v=tb[i]-mean;tb[i]=v;sq+=v*v;if(Math.abs(v)>pk)pk=Math.abs(v)}
    var dbfs=20*Math.log10(Math.sqrt(sq/tb.length)+1e-9),db=Math.max(0,Math.min(120,dbfs+DB_OFFSET));
    dbS=dbS==null?db:dbS+.25*(db-dbS);
    var f=null,cl=0,now=performance.now();
    if(dbfs>-62){
      var y=yin(tb,sr),p=spectrum(sr);
      // YIN est écarté si le spectre ne montre aucune énergie à sa fréquence (cas d'un son aigu pris pour un multiple de sa période)
      if(y&&y.clarity>.72&&y.f<1500&&(!p||p.at(y.f)>p.mag-25)){f=y.f;cl=y.clarity}
      else if(p&&p.prom>=25&&p.f>=700){f=p.f;cl=Math.min(1,p.prom/50)}
    }
    if(f!=null){hist.push(f);if(hist.length>5)hist.shift();lastOk=now}
    else if(now-lastOk>400)hist=[];
    var fm=hist.length>=3?median(hist):null;
    cb({db:dbS,f:fm,clarity:cl,amp:Math.min(1,pk),silent:dbfs<=-62});
  }
  function start(onFrame){
    if(!available())return Promise.reject({name:'NoMic'});
    var my=++token;
    return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(function(s){
      if(my!==token){s.getTracks().forEach(function(t){t.stop()});return}                // annulé entre-temps
      stream=s;var C=window.AudioContext||window.webkitAudioContext;ctx=new C();
      var src=ctx.createMediaStreamSource(s);an=ctx.createAnalyser();an.fftSize=4096;an.smoothingTimeConstant=0;src.connect(an);   // aucune sortie vers les haut-parleurs
      tb=new Float32Array(an.fftSize);fb=new Float32Array(an.frequencyBinCount);cb=onFrame;hist=[];dbS=null;lastOk=0;run=true;
      if(ctx.resume)ctx.resume();frame();
    });
  }
  function stop(){token++;run=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}if(ctx){try{ctx.close()}catch(e){}ctx=null}}
  return{start:start,stop:stop,available:available};
})();
