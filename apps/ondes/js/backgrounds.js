// Décors illustrés (air, eau, roche, espace), dessinés dans un canvas hors écran
window.Backgrounds=(function(){
  function draw(bgc,W,H,m){
    var d=window.devicePixelRatio||1,r=Utils.rng(5),b;bgc.width=W*d;bgc.height=H*d;b=bgc.getContext('2d');b.setTransform(d,0,0,d,0,0);
    function lg(y0,y1,a,z){var g=b.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,z);return g}
    function poly(p,col){b.fillStyle=col;b.beginPath();p.forEach(function(q,i){i?b.lineTo(q[0],q[1]):b.moveTo(q[0],q[1])});b.closePath();b.fill()}
    function dot(x,y,rad,col){b.fillStyle=col;b.beginPath();b.arc(x,y,rad,0,6.283);b.fill()}
    if(m==='air'){var LH=H*.58;b.fillStyle=lg(0,LH,'#4F79A8','#F0C3A4');b.fillRect(0,0,W,H);
      function ridge(amp,n){var p=[[0,LH]];for(var i=0;i<=n;i++)p.push([i*W/n,LH-amp*(.25+.75*r())]);p.push([W,LH]);return p}
      var rs=[[ridge(H*.34,8),lg(H*.15,LH,'#D9B3C8','#7F84B8')],[ridge(H*.27,7),lg(H*.2,LH,'#E8B7B0','#3F54A0')],[ridge(H*.14,6),lg(0,LH,'#2A3C80','#1A2760')]];
      rs.forEach(function(s){poly(s[0],s[1])});
      b.fillStyle=lg(LH,H,'#3B7BBF','#1B3F7E');b.fillRect(0,LH,W,H-LH);
      b.save();b.beginPath();b.rect(0,LH,W,H-LH);b.clip();b.globalAlpha=.3;rs.forEach(function(s){poly(s[0].map(function(q){return[q[0],2*LH-q[1]]}),s[1])});b.restore();
      for(var i=0;i<16;i++){var px=i<8?r()*W*.2:W*.8+r()*W*.2,ph=18+r()*26;poly([[px,LH+2],[px+7,LH+2],[px+3.5,LH-ph]],'#0F1D48')}}
    if(m==='water'){b.fillStyle=lg(0,H,'#0E6E8C','#04203A');b.fillRect(0,0,W,H);
      for(var i=0;i<5;i++){var x=W*(.1+i*.2);poly([[x,0],[x+26,0],[x+90,H],[x-14,H]],'rgba(170,235,255,.07)')}
      b.strokeStyle='rgba(220,245,255,.35)';b.lineWidth=1.5;for(var k=0;k<3;k++){b.beginPath();for(var x=0;x<=W;x+=6){var y=10+k*9+Math.sin(x/22+k*2)*3;x?b.lineTo(x,y):b.moveTo(x,y)}b.stroke()}
      function weed(x,h,col){b.fillStyle=col;b.beginPath();b.moveTo(x,H);b.bezierCurveTo(x-14,H-h*.4,x+16,H-h*.7,x+4,H-h);b.bezierCurveTo(x+22,H-h*.7,x-6,H-h*.4,x+10,H);b.fill()}
      for(var i=0;i<9;i++){weed(i<5?r()*W*.16:W*.84+r()*W*.16,H*(.35+r()*.4),'#08304F')}
      for(var i=0;i<26;i++){var fx=W*.2+r()*W*.6,fy=H*.14+r()*H*.5;b.fillStyle='rgba(175,230,248,.55)';b.beginPath();b.ellipse(fx,fy,4,2,0,0,6.283);b.fill();poly([[fx-3,fy],[fx-8,fy-3],[fx-8,fy+3]],'rgba(175,230,248,.55)')}
      b.fillStyle='#10425A';b.beginPath();b.ellipse(W/2,H+8,W*.6,H*.14,0,0,6.283);b.fill()}
    if(m==='rock'){b.fillStyle=lg(0,H,'#2A2331','#161118');b.fillRect(0,0,W,H);var cl=['#3A3140','#463C4C','#2E2735'],n=9;
      for(var i=0;i<n;i++){var x=i*W/n-8,top=H*.1+r()*H*.22;poly([[x,H*.84],[x+W/n*.5,top],[x+W/n+14,H*.84]],cl[i%3]);if(i%2===0)poly([[x+W/n*.42,top+14],[x+W/n*.5,top+10],[x+W/n*.78,H*.7],[x+W/n*.66,H*.74]],'rgba(214,138,64,.4)')}
      for(var i=0;i<16;i++){var x=i*W/15;poly([[x,0],[x+14,0],[x+7,10+r()*26]],'#1A1420');poly([[x+3,0],[x+11,0],[x+7,6+r()*8]],'#5A2A3A')}
      b.fillStyle=lg(H*.82,H,'#6A5446','#2E2420');b.fillRect(0,H*.82,W,H*.18);for(var i=0;i<22;i++){b.fillStyle='#2A211D';b.beginPath();b.ellipse(r()*W,H*.86+r()*H*.12,3+r()*4,2,0,0,6.283);b.fill()}}
    if(m==='space'){b.fillStyle=lg(0,H,'#01020A','#071433');b.fillRect(0,0,W,H);
      for(var i=0;i<260;i++){var t=r(),g=(r()+r()+r()-1.5)*W*.07;dot(W*.18+t*W*.38+g,t*H*.8,.5+r()*.9,'rgba(150,200,255,'+(.25+r()*.5)+')')}
      for(var i=0;i<120;i++)dot(r()*W,r()*H*.8,.4+r()*1.1,'rgba(255,255,255,'+(.4+r()*.6)+')');
      var R=W*.95,cy=H*.8+R,cx=W*.5;b.fillStyle='#0A2C5E';b.beginPath();b.arc(cx,cy,R,0,6.283);b.fill();
      b.strokeStyle='rgba(255,255,255,.18)';b.lineWidth=5;for(var k=1;k<7;k++){b.beginPath();b.arc(cx+(r()-.5)*W*.2,cy,R-k*H*.05,Math.PI*(1.15+r()*.1),Math.PI*(1.8-r()*.1));b.stroke()}
      b.strokeStyle='rgba(150,210,255,.7)';b.lineWidth=3;b.beginPath();b.arc(cx,cy,R,0,6.283);b.stroke();
      var gl=b.createRadialGradient(cx,H*.8,0,cx,H*.8,W*.28);gl.addColorStop(0,'rgba(255,244,200,.9)');gl.addColorStop(1,'rgba(255,244,200,0)');b.fillStyle=gl;b.fillRect(0,0,W,H)}
    b.fillStyle='rgba(4,7,10,'+{air:.45,water:.2,rock:.3,space:.1}[m]+')';b.fillRect(0,0,W,H);
  }
  return{draw:draw};
})();
