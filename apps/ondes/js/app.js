// Navigation entre écrans, thèmes et initialisation
window.App=(function(){
  var $=Utils.$,TH={'screen-home':'home','screen-prop':'yellow','screen-measure':'gold','screen-freq':'orange','screen-music':'music','screen-calc':'yellow','screen-retain':'yellow'};
  var keep=false,Free=null;
  function showScreen(id){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});$(id).classList.add('active');
    document.body.setAttribute('data-theme',TH[id]);
    document.body.style.setProperty('--wall',Utils.wall(id==='screen-home'?Utils.WALL_HOME:id==='screen-measure'?Utils.WALL_GOLD:id==='screen-freq'?Utils.WALL_ORANGE:id==='screen-music'?Utils.WALL_MUSIC:Utils.WALL_YELLOW)); // papier peint jaune partout sauf à l'accueil
    window.scrollTo(0,0);
    if(id!=='screen-freq')Freq.stop();
    if(id!=='screen-music')Music.stop();
    if(id==='screen-prop')Free.size();
    if(id==='screen-calc'&&!keep)Guided.start();
    if(id==='screen-measure')Measure.start();
    if(id==='screen-freq')Freq.start();
    if(id==='screen-music')Music.start();
    keep=false;
  }
  document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){var g=b.dataset.go;if(g==='screen-calc')keep=true;showScreen(g)})});
  $('go-prop').addEventListener('click',function(){showScreen('screen-prop')});
  $('go-measure').addEventListener('click',function(){showScreen('screen-measure')});
  $('go-freq').addEventListener('click',function(){showScreen('screen-freq')});
  $('go-music').addEventListener('click',function(){showScreen('screen-music')});
  $('go-calc').addEventListener('click',function(){showScreen('screen-calc')});
  Free=createLab($('lab-free'),{});
  Free.ctrls.appendChild($('calc-wrap'));
  document.body.style.setProperty('--wall',Utils.wall(Utils.WALL_HOME));
  // Pas de zoom par double-tap / double-clic
  var lastTouch=0;
  document.addEventListener('touchend',function(e){var n=Date.now();if(n-lastTouch<350&&!/INPUT|TEXTAREA/.test(e.target.tagName))e.preventDefault();lastTouch=n},{passive:false});
  document.addEventListener('dblclick',function(e){e.preventDefault()});
  return{showScreen:showScreen};
})();
