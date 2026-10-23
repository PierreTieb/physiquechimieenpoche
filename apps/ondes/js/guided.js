// Mode guidé : calcul de la vitesse du son en 4 étapes
window.Guided=(function(){
  var $=Utils.$,MED=Utils.MED,ORDER=Utils.ORDER,nf=Utils.nf,meas={air:'—',water:'—',rock:'—',space:'—'};
  var lab,step=1,m='air',res=null;
  var P=function(v){return parseFloat(String(v).replace(',','.').replace(/\s/g,''))};
  function show(ids,on){ids.forEach(function(i){$(i).style.display=on?'':'none'})}
  function go(n){step=n;var lp=lab.parts;
    show(['g-s1','g-s3','g-space','g-s4'],false);
    lab.ctrls.style.display=(n<=2)?'':'none';
    lp.med.classList.toggle('off',n!==1);lp.dist.classList.toggle('off',n!==2);lp.ral.classList.toggle('off',n!==2);lp.act.classList.toggle('off',n!==2);
    $('g-prog').textContent='Étape '+n+' / 4';
    var I={1:'Sélectionne un environnement.',2:'Milieu : '+MED[m].art+'. Choisis une distance et déclenche le pétard.',3:'Mesure faite : place les bonnes valeurs dans la formule.',4:'Voici le résultat.'};
    $('g-instr').textContent=I[n];
    if(n===1)show(['g-s1'],true);if(n===3)show(['g-s3'],true);if(n===4)show(['g-s4'],true);
  }
  function check(){
    var d=lab.st.d,T=res&&res.T,vd=P($('f-d').value),vt=P($('f-t').value),ed=$('f-d'),et=$('f-t');
    var okD=!isNaN(vd)&&Math.abs(vd-d)<5e-4,okT=T!=null&&!isNaN(vt)&&Math.abs(vt-T)<5e-4;
    ed.className='field'+(okD?' okf':'');et.className='field'+(okT?' okf':'');
    var sw=T!=null&&((!isNaN(vd)&&Math.abs(vd-T)<5e-4)||(!isNaN(vt)&&Math.abs(vt-d)<5e-4));
    $('f-hint').textContent=sw?'Attention : la distance va en haut, le temps en bas.':(T==null?'Attends la fin du chrono pour lire le temps.':'');
    $('f-go').disabled=!(okD&&okT);
  }
  function blur(el,ok){if(el.value&&!ok)el.className='field badf'}
  lab=createLab($('lab-guided'),{guided:true,min:100,
    onMedium:function(x){m=x;$('g-next1').disabled=false},
    onStart:function(){res=null;$('f-d').value='';$('f-t').value='';check();go(3);if(m==='space')show(['g-s3'],false)},
    onDone:function(r){res=r;meas[r.m]=r.silent?'aucun son':nf(Math.round(Number((r.d/r.T).toPrecision(2))))+' m/s';
      if(r.silent){show(['g-s3'],false);show(['g-space'],true);$('g-instr').textContent='Écoute… il n\'y a rien.'}else{check()}}});
  $('g-next1').addEventListener('click',function(){go(2)});
  ['f-d','f-t'].forEach(function(i){$(i).addEventListener('input',check)});
  $('f-d').addEventListener('blur',function(){blur(this,Math.abs(P(this.value)-lab.st.d)<5e-4)});
  $('f-t').addEventListener('blur',function(){blur(this,res&&Math.abs(P(this.value)-res.T)<5e-4)});
  $('f-go').addEventListener('click',function(){
    var v=Number((res.d/res.T).toPrecision(2));
    $('g-res').innerHTML='La vitesse du son dans '+MED[res.m].art+' est <b>'+nf(v)+' m/s</b>';
    $('g-calc').textContent=res.d+' ÷ '+String(res.T).replace('.',',')+' ≈ '+nf(Math.round(res.d/res.T))+' m/s (valeur arrondie)';
    $('g-retry').textContent='Réessayer dans '+MED[res.m].art;go(4);renderTable()});
  function renderTable(){$('g-table').innerHTML=ORDER.map(function(k){return'<tr><td>'+MED[k].n+'</td><td>'+meas[k]+'</td></tr>'}).join('')}
  function again(toStep){lab.reset();lab.setMedium(m);if(toStep===1){lab.clearSel();$('g-next1').disabled=true}go(toStep)}
  $('g-retry').addEventListener('click',function(){again(2)});
  $('g-other').addEventListener('click',function(){again(1)});
  $('sp-other').addEventListener('click',function(){again(1)});
  $('g-retain').addEventListener('click',function(){App.showScreen('screen-retain')});
  return{start:function(){lab.size();lab.reset();lab.setMedium('air');lab.clearSel();lab.setD(500);$('g-next1').disabled=true;go(1)}};
})();
