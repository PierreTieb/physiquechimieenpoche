// Utilitaires partagés : milieux, formats, générateur pseudo-aléatoire, papier peint, ondes
window.Utils=(function(){
var $=function(i){return document.getElementById(i)};
var MED={air:{n:'Air',who:'Humain',v:340,thr:500,art:"l'air"},water:{n:'Eau',who:'Plongeur',v:1500,thr:1000,art:"l'eau"},rock:{n:'Roche',who:'Mineur',v:5000,thr:3000,art:'la roche'},space:{n:'Espace',who:'Astronaute',v:0,thr:0,art:"l'espace"}};
var ORDER=['air','water','rock','space'];
function fmtD(d){return d<1000?d+' m':(Math.round(d/10)/100).toString().replace('.',',')+' km'}
function fmtT(t){return t.toFixed(3).replace('.',',')+' s'}
function nf(v){return String(v).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function wall(col){var s='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480"><g fill="none" stroke="'+col+'" stroke-opacity=".26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 64h14l18-14v48l-18-14H30z"/><path d="M70 64a14 14 0 0 1 0 20M78 56a26 26 0 0 1 0 36"/><path d="M156 74h22l5-12 6 26 7-38 7 46 6-30 5 8h22"/><circle cx="300" cy="80" r="7"/><path d="M382 96v-12a26 26 0 0 1 52 0v12"/><rect x="374" y="90" width="12" height="24" rx="5"/><rect x="430" y="90" width="12" height="24" rx="5"/><rect x="30" y="300" width="96" height="66" rx="8"/><path d="M40 334h18l6-12 8 26 8-30 8 22 6-6h22"/><path d="M236 290v40a14 14 0 0 0 28 0v-40M250 344v50"/><circle cx="400" cy="340" r="10"/><circle cx="400" cy="340" r="24" stroke-dasharray="3 6"/><circle cx="400" cy="340" r="40"/><circle cx="200" cy="190" r="9"/><circle cx="350" cy="210" r="5"/></g><g fill="'+col+'" fill-opacity=".3"><circle cx="150" cy="210" r="4"/><circle cx="80" cy="200" r="3"/><circle cx="460" cy="230" r="4"/><circle cx="320" cy="440" r="3"/></g></svg>';return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'}
// Ondes lumineuses orangées (motif de 1200 px qui se répète horizontalement)
function waves(){var W=1200,H=400;
  function sine(a,per,ph){var d='M';for(var x=0;x<=W;x+=8)d+=x+' '+(H/2+a*Math.sin(2*Math.PI*x/per+ph)).toFixed(1)+' ';return d}
  function line(d,col,w,op){return '<path d="'+d+'" stroke="'+col+'" stroke-width="'+w+'" stroke-opacity="'+op+'"/>'}
  var main=sine(70,400,0),s='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><g fill="none" stroke-linecap="round">'+
    line(sine(120,600,3.6),'#B85628',1,.3)+line(sine(95,1200,2.4),'#D9682E',1.2,.4)+line(sine(50,600,1.2),'#F07A35',1.6,.55)+line(sine(32,300,.6),'#FFB866',1.2,.45)+
    line(main,'#FF8A2A',18,.06)+line(main,'#FF8A2A',10,.12)+line(main,'#FF9A3D',5,.3)+line(main,'#FFA94D',2.6,1)+line(main,'#FFE0B0',1,.8)+'</g></svg>';
  return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'}

return{$:$,MED:MED,ORDER:ORDER,fmtD:fmtD,fmtT:fmtT,nf:nf,rng:rng,wall:wall,waves:waves,WALL_HOME:'#C77A48',WALL_YELLOW:'#C9944A',WALL_ORANGE:'#C77A48',WALL_GOLD:'#C99A3E',WALL_MUSIC:'#D07040'};
})();
