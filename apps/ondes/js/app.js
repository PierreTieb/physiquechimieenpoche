// Navigation entre écrans, thèmes et initialisation
window.App=(function(){
  var $=Utils.$,TH={'screen-home':'home','screen-prop':'blue','screen-sonar':'sonar','screen-freq':'orange','screen-music':'music','screen-calc':'blue','screen-retain':'blue'};
  // teinte des icônes du papier peint selon le thème de l'écran
  var WALLS={home:Utils.WALL_HOME,blue:Utils.WALL_BLUE,sonar:Utils.WALL_BLUE,orange:Utils.WALL_ORANGE,music:Utils.WALL_MUSIC};
  var keep=false,Free=null;
  function showScreen(id){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});$(id).classList.add('active');
    document.body.setAttribute('data-theme',TH[id]);
    document.body.style.setProperty('--wall',Utils.wall(WALLS[TH[id]]));
    document.body.style.setProperty('--waves',Utils.waves(TH[id]==='blue'||TH[id]==='sonar'));
    window.scrollTo(0,0);
    if(id!=='screen-freq')Freq.stop();
    if(id!=='screen-music')Music.stop();
    if(id==='screen-sonar')SonarApp.start();else SonarApp.stop();   // l'animation du sonar ne tourne que sur son écran
    if(id==='screen-prop')Free.size();
    if(id==='screen-calc'&&!keep)Guided.start();
    if(id==='screen-freq')Freq.start();
    if(id==='screen-music')Music.start();
    keep=false;
  }
  document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){var g=b.dataset.go;if(g==='screen-calc')keep=true;showScreen(g)})});
  $('go-prop').addEventListener('click',function(){showScreen('screen-prop')});
  $('go-sonar').addEventListener('click',function(){showScreen('screen-sonar')});
  $('go-freq').addEventListener('click',function(){showScreen('screen-freq')});
  $('go-music').addEventListener('click',function(){showScreen('screen-music')});
  $('go-calc').addEventListener('click',function(){showScreen('screen-calc')});
  Free=createLab($('lab-free'),{});
  Free.ctrls.appendChild($('calc-wrap'));
  document.body.style.setProperty('--wall',Utils.wall(Utils.WALL_HOME));
  document.body.style.setProperty('--waves',Utils.waves());
  // QR code du sonar (#sonar) ou lien d'un réglage (#c=… / #s=…) : on ouvre directement Sonar et Écho
  if(/^#(sonar|c=|s=)/.test(location.hash))showScreen('screen-sonar');
  // Pas de zoom au double appui ou au double clic (touch-action: manipulation dans le style), sans empêcher
  // d'appuyer très vite sur un bouton (Émettre) : seuls les doubles appuis hors des commandes sont bloqués
  var lastTouch=0;
  document.addEventListener('touchend',function(e){var n=Date.now();if(n-lastTouch<350&&!e.target.closest('button,a,input,textarea,select,label,canvas'))e.preventDefault();lastTouch=n},{passive:false});
  document.addEventListener('dblclick',function(e){e.preventDefault()});
  return{showScreen:showScreen};
})();
