// Personnages et pétard : images img/*.png si présentes, sinon dessins de secours
window.Sprites=(function(){
  var c,IMG={},cbs=[];
  // Images facultatives dans img/ : si un fichier manque, le dessin intégré prend le relais
  ['petard','astronaute','fille','plongeur','mineur','Rocher'].forEach(function(n){var i=new Image();i.onload=function(){IMG[n]=i;cbs.forEach(function(f){f()})};i.src='img/'+n+'.png'});
  // Zone utile de chaque image (marges transparentes retirées) et hauteur affichée pour s = 1. Les images regardent vers la droite.
  var CROP={petard:[2,42,236,402],fille:[10,8,152,390],plongeur:[6,140,336,500],mineur:[8,90,222,570],astronaute:[15,55,315,515]},
      HT={petard:72,fille:120,plongeur:100,mineur:124,astronaute:116};
  function img(k,x,y,s,flip){var i=IMG[k];if(!i)return false;var r=CROP[k]||[0,0,i.width,i.height],h=HT[k]*s,w=h*r[2]/r[3];
    c.save();c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(i,r[0],r[1],r[2],r[3],-w/2,-h,w,h);c.restore();return true}
  // Rocher du mode écho : son contour est presque un cercle (centre 267,290 ; rayon 253 px dans l'image), dessiné centré en (x,y) avec le rayon R
  function rock(ctx,x,y,R){var i=IMG.Rocher;if(!i)return false;var k=R/253;ctx.drawImage(i,x-267*k,y-290*k,i.width*k,i.height*k);return true}
  function rr(x,y,w,h,rd){c.beginPath();c.moveTo(x+rd,y);c.arcTo(x+w,y,x+w,y+h,rd);c.arcTo(x+w,y+h,x,y+h,rd);c.arcTo(x,y+h,x,y,rd);c.arcTo(x,y,x+w,y,rd);c.fill()}
  function ci(x,y,r){c.beginPath();c.arc(x,y,r,0,6.283);c.fill()}
  function limb(a,b,x,y,w,col){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke()}
  function cracker(ctx,x,y,s){c=ctx;if(img('petard',x,y,s))return;c.save();c.translate(x,y);c.scale(s,s);c.rotate(-.42);
    c.fillStyle='#E23B2E';rr(-8,-46,16,46,6);c.fillStyle='#FF7A5C';rr(-5,-44,4,42,2);c.fillStyle='#F6E3A1';c.fillRect(-8,-30,16,8);
    c.strokeStyle='#8A6A3B';c.lineWidth=2.2;c.beginPath();c.moveTo(0,-46);c.quadraticCurveTo(2,-54,8,-56);c.stroke();c.fillStyle='#FFD84D';ci(9,-58,4);c.fillStyle='#fff';ci(9,-58,1.8);c.restore()}
  function person(ctx,x,y,s,m,flip){c=ctx;if(img({air:'fille',water:'plongeur',rock:'mineur',space:'astronaute'}[m],x,y,s,flip))return;c.save();c.translate(x,y);c.scale(flip?-1.45*s:1.45*s,1.45*s);var W='#F4F5FA';   // flip : tourné vers la gauche
    if(m==='space'){limb(-14,-34,-27,-45,7,W);limb(14,-34,27,-45,7,W);limb(-6,-14,-9,-2,8,W);limb(6,-14,9,-2,8,W);
      c.fillStyle='#D3D7E6';rr(-19,-52,10,26,4);c.fillStyle=W;rr(-13,-46,26,30,10);c.fillStyle='#4C9BFF';ci(2,-34,2.2);c.fillStyle=W;ci(0,-62,16);
      c.fillStyle='#3A1D5C';c.beginPath();c.ellipse(1,-62,11.5,10,0,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,.55)';ci(-3,-66,2.6);ci(4,-58,1.4)}
    else{var bc={air:'#4F86E8',water:'#16394F',rock:'#F08A24'}[m],lc={air:'#2D3B63',water:'#16394F',rock:'#4A4047'}[m],sk='#F2C6A0';
      limb(-5,-16,-6,-1,8,lc);limb(5,-16,6,-1,8,lc);
      if(m==='water'){c.fillStyle='#F2C230';c.beginPath();c.ellipse(-9,0,9,3,0,0,6.283);c.ellipse(9,0,9,3,0,0,6.283);c.fill();c.fillStyle='#8D97A5';rr(-21,-48,10,28,4)}
      limb(-12,-38,-21,-24,6.5,m==='air'?bc:sk);limb(12,-38,21,-24,6.5,m==='air'?bc:sk);
      c.fillStyle=bc;rr(-12,-47,24,31,9);
      if(m==='water'){c.fillStyle='#F2C230';c.fillRect(-12,-34,24,3)}
      if(m==='rock'){c.fillStyle='#FFF3A0';c.fillRect(-12,-36,24,3);c.fillRect(-12,-28,24,3)}
      c.fillStyle=sk;ci(0,-61,14);c.fillStyle='#2B2B3A';ci(-5,-60,1.9);ci(5,-60,1.9);
      if(m==='air'){c.fillStyle='#3A2A22';c.beginPath();c.arc(0,-62,14,Math.PI*1.05,Math.PI*1.95);c.fill()}
      if(m==='water'){c.fillStyle='#10212C';c.beginPath();c.arc(0,-62,14.5,Math.PI,0);c.fill();rr(-10,-67,20,10,4);c.fillStyle='#6AD1F0';rr(-7,-65,14,6,3);limb(12,-68,17,-84,3,'#F2C230')}
      if(m==='rock'){c.fillStyle='#FFC800';c.beginPath();c.arc(0,-63,15.5,Math.PI,0);c.fill();rr(-19,-64,38,6,3);c.fillStyle='#FFF8C0';ci(0,-72,3.6)}}
    c.restore()}
  return{cracker:cracker,person:person,rock:rock,ready:function(k){return!!IMG[k]},onLoad:function(f){cbs.push(f)}};
})();
