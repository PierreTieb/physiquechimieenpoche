/* PROVISOIRE : diagnostic du toucher sur iPhone (croix inactive en portrait après un passage en paysage). À retirer une fois le bug compris.
   Toucher l'écran 5 fois de suite, rapidement, affiche ou cache le diagnostic : un point rouge là où le navigateur croit que le doigt est posé,
   un cadre pointillé là où il croit que sont les croix, et les dimensions de l'écran */
(()=>{let on=0,last=null;const mk=css=>{const e=document.createElement('div');e.style.cssText='position:fixed;pointer-events:none;z-index:2147483647;'+css;document.body.appendChild(e);e.hidden=true;return e};
  const panel=mk('left:4px;right:4px;bottom:4px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.82);color:#fff;font:600 11px/1.35 ui-monospace,Menlo,monospace;white-space:pre-wrap'),
    dot=mk('width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#ff2a2a;box-shadow:0 0 0 2px #fff'),
    boxes=['quit','room-quit'].map(()=>mk('border:2px dashed #ff2a2a;border-radius:50%')),
    probe=mk('left:0;top:0;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)');
  const r=n=>Math.round(n),show=()=>{if(!on)return;const v=visualViewport,de=document.documentElement,cs=getComputedStyle(probe);
    ['quit','room-quit'].forEach((id,i)=>{const b=document.getElementById(id),q=b.getBoundingClientRect(),x=boxes[i];x.hidden=!q.width;Object.assign(x.style,{left:q.left+'px',top:q.top+'px',width:q.width+'px',height:q.height+'px'})});
    const q=document.getElementById(document.getElementById('ui').hidden?'room-quit':'quit').getBoundingClientRect();
    panel.textContent=`inner ${r(innerWidth)}×${r(innerHeight)} · client ${de.clientWidth}×${de.clientHeight} · écran ${screen.width}×${screen.height} ${(screen.orientation||{}).type||orientation}
visual ${v?`${r(v.width)}×${r(v.height)} décalage ${r(v.offsetLeft)},${r(v.offsetTop)} page ${r(v.pageLeft)},${r(v.pageTop)} zoom ${v.scale.toFixed(3)}`:'—'}
défilement fenêtre ${r(scrollX)},${r(scrollY)} · html ${de.scrollLeft},${de.scrollTop} · body ${document.body.scrollLeft},${document.body.scrollTop}
marges sûres h${cs.paddingTop} d${cs.paddingRight} b${cs.paddingBottom} g${cs.paddingLeft}
croix ${r(q.left)},${r(q.top)} ${r(q.width)}×${r(q.height)}
dernier toucher ${last?`${r(last.clientX)},${r(last.clientY)} (écran ${r(last.screenX)},${r(last.screenY)}) sur ${last.t}`:'—'}`};
  let taps=[];
  addEventListener('pointerdown',e=>{const now=performance.now();taps=taps.filter(t=>now-t<2000);taps.push(now);if(taps.length>=5){taps=[];on=!on;[panel,dot,...boxes].forEach(x=>x.hidden=!on)}
    const t=e.target;last={clientX:e.clientX,clientY:e.clientY,screenX:e.screenX,screenY:e.screenY,t:t.id?'#'+t.id:t.tagName.toLowerCase()+(t.className&&typeof t.className=='string'?'.'+t.className.split(' ')[0]:'')};
    dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';show()},true);
  addEventListener('resize',()=>setTimeout(show,400));setInterval(show,700)})();
