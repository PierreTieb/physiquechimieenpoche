// Utilitaires partagés : milieux, formats, générateur pseudo-aléatoire, papier peint
window.Utils=(function(){
var $=function(i){return document.getElementById(i)};
var MED={air:{n:'Air',who:'Humain',v:340,thr:500,art:"l'air"},water:{n:'Eau',who:'Plongeur',v:1500,thr:1000,art:"l'eau"},rock:{n:'Roche',who:'Mineur',v:5000,thr:3000,art:'la roche'},space:{n:'Espace',who:'Astronaute',v:0,thr:0,art:"l'espace"}};
var ORDER=['air','water','rock','space'];
function fmtD(d){return d<1000?d+' m':(Math.round(d/10)/100).toString().replace('.',',')+' km'}
function fmtT(t){return t.toFixed(3).replace('.',',')+' s'}
function nf(v){return String(v).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202f')}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function wall(col){var s='<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><g fill="'+col+'" font-family="Georgia,serif" font-size="15"><text x="14" y="30">v = λ · f</text><text x="190" y="64">f = 1/T</text><text x="40" y="150">∂²p/∂t² = c²∇²p</text><text x="230" y="190">v = d/t</text><text x="20" y="300">ω = 2πf</text><text x="190" y="336">L = 20 log(p/p₀)</text><text x="250" y="130" font-size="44">λ</text><text x="120" y="250" font-size="40">Σ</text></g><g fill="none" stroke="'+col+'" stroke-width="1.2"><path d="M10 90q15-24 30 0t30 0t30 0t30 0"/><circle cx="300" cy="260" r="12"/><circle cx="300" cy="260" r="26" stroke-dasharray="3 5"/><circle cx="300" cy="260" r="40"/><path d="M20 200v-28M30 200v-14M40 200v-34M50 200v-18M60 200v-8M14 200h60"/><path d="M170 120v26a8 8 0 0 0 16 0v-26M178 154v18"/></g></svg>';return 'url("data:image/svg+xml,'+encodeURIComponent(s)+'")'}

return{$:$,MED:MED,ORDER:ORDER,fmtD:fmtD,fmtT:fmtT,nf:nf,rng:rng,wall:wall,WALL_HOME:'#35414B',WALL_YELLOW:'#574C28',WALL_ORANGE:'#6A4020',WALL_GOLD:'#6A5518',WALL_MUSIC:'#7A4318'};
})();
