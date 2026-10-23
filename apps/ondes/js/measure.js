// Mode 2 : Mesurer des distances (milieu et distance tirés au sort, option « L'écho »)
window.Measure=(function(){
  var $=Utils.$,MED=Utils.MED,nf=Utils.nf;
  var WHO={air:'la fillette',water:'le plongeur',rock:'le mineur'},CLS={air:'c-air',water:'c-water',rock:'c-rock'};
  var order=[],attempt=0,echo=false,res=null,cur=null,lab;
  var P=function(v){return parseFloat(String(v).replace(',','.').replace(/\s/g,''))};
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  function field(id,label){return'<input class="field" id="'+id+'" inputmode="decimal" autocomplete="off" aria-label="'+label+'">'}
  function build(){                                   // formule, aide (toujours visible) et champs
    var M=MED[cur.m],sp='<span class="'+CLS[cur.m]+'">dans '+M.art+' vaut '+nf(M.v)+'&nbsp;m/s</span>';
    $('m-help').innerHTML=echo
      ?'Pour calculer la distance entre le pétard et le mur d\'en face, on calcule la distance parcourue par l\'onde (v × t), puis on la divise par 2 à cause de l\'aller-retour : <b>d = (v × t) / 2</b>. On sait que la vitesse du son '+sp+'.'
      :'Pour calculer la distance entre le pétard et '+WHO[cur.m]+', on utilise la formule <b>d = v × t</b>. On sait que la vitesse du son '+sp+'.';
    var prod='<span class="prod">'+field('m-v','Premier facteur')+' × '+field('m-t','Second facteur')+'</span>';
    $('m-eq').innerHTML=echo?'d =<span class="frac">'+prod+'<hr><span class="two">2</span></span>':'d =<span style="margin:0 8px">'+prod+'</span>';
    ['m-v','m-t'].forEach(function(i){$(i).addEventListener('input',check)});
    $('m-go').style.display='';$('m-go').disabled=true;$('m-hint').textContent='';
  }
  function go(n){
    $('m-prog').textContent='Étape '+n+' / 2';$('m-s2').style.display=n===2?'':'none';$('m-result').style.display='none';
    $('m-instr').innerHTML=n===1
      ?(echo?'Déclenche le son : il va jusqu\'au mur et revient. Chronomètre l\'aller-retour.':'Déclenche le son et chronomètre le temps de propagation.')+'<br><span class="small">Milieu : '+MED[cur.m].art+'. Distance : inconnue.</span>'
      :'Calcule la distance avec la formule.';
  }
  function check(){                                   // multiplication : les deux facteurs peuvent être saisis dans n'importe quel ordre
    var sp=MED[cur.m].v,T=res&&res.T,a=P($('m-v').value),b=P($('m-t').value);
    function isV(x){return!isNaN(x)&&Math.abs(x-sp)<1e-9}
    function isT(x){return T!=null&&!isNaN(x)&&Math.abs(x-T)<5e-4}
    var pair=(isV(a)&&isT(b))||(isT(a)&&isV(b)),same=(isV(a)&&isV(b))||(isT(a)&&isT(b));
    $('m-v').className='field'+((isV(a)||isT(a))&&!same?' okf':'');$('m-t').className='field'+((isV(b)||isT(b))&&!same?' okf':'');
    $('m-hint').textContent=T==null?'Attends la fin du chrono pour lire le temps.':'';
    $('m-go').disabled=!pair;
  }
  function newAttempt(){                              // milieu : ordre tiré une fois puis repris en boucle ; distance : au hasard
    if(!order.length)order=shuffle(['air','water','rock']);
    cur={m:order[attempt%3],d:(10+Math.floor(Math.random()*291))*10};attempt++;
    lab.setMedium(cur.m);lab.setD(cur.d);lab.setEcho(echo);lab.reset();lab.msg('Déclenche le pétard.');
    res=null;$('m-echo').disabled=false;build();go(1);
  }
  lab=createLab($('lab-measure'),{hide:true,
    onStart:function(){res=null;$('m-echo').disabled=true;$('m-v').value='';$('m-t').value='';check();go(2)},
    onDone:function(r){res=r;lab.msg(echo?'Le son est revenu après '+Utils.fmtT(r.T)+'.':'Le son est arrivé après '+Utils.fmtT(r.T)+'.',true);check()}});
  lab.parts.med.classList.add('off');lab.parts.dist.classList.add('off');lab.ctrls.style.display='none';
  $('m-echo').addEventListener('change',function(){echo=this.checked;lab.setEcho(echo);build();go(1)});
  $('m-go').addEventListener('click',function(){
    var M=MED[cur.m],raw=M.v*res.T/(echo?2:1),shown=Math.round(raw/10)*10,t=String(res.T).replace('.',',');
    $('m-res').innerHTML='La distance entre le pétard et '+(echo?'le mur d\'en face':WHO[cur.m])+' est de <b>'+nf(shown)+' m</b>';
    $('m-calc').textContent=(echo?'('+M.v+' × '+t+') ÷ 2':M.v+' × '+t)+' ≈ '+nf(shown)+' m (valeur arrondie à la dizaine de mètres)';
    $('m-go').style.display='none';$('m-v').disabled=true;$('m-t').disabled=true;$('m-result').style.display='';
  });
  $('m-new').addEventListener('click',newAttempt);
  return{start:function(){order=[];attempt=0;echo=false;$('m-echo').checked=false;lab.size();newAttempt()}};
})();
