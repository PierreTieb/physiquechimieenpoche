// Ajouté par mettre_a_jour.py dans chaque appli : lien « ← Choix d'application » en haut de sa page d'accueil
// data-home : élément de la page d'accueil de l'appli ; data-class : classe de son bouton « Retour » (même police) ;
// data-style : couleurs propres à l'appli, par-dessus la pastille en verre dépoli commune à toutes
(function () {
  var s = document.currentScript, home = s.getAttribute('data-home'), cls = s.getAttribute('data-class') || '', extra = s.getAttribute('data-style') || '';
  function add() {
    var box = document.querySelector(home);
    if (!box || box.querySelector('.pcp-retour')) return;
    var a = document.createElement('a');
    a.href = '../../index.html';
    a.className = cls + ' pcp-retour';
    a.textContent = '← Choix d\'application';
    a.style.cssText = 'display:inline-flex;align-items:center;align-self:flex-start;text-decoration:none;'
      + 'margin:0 0 10px;padding:9px 16px;border-radius:999px;font-weight:800;font-size:.95rem;'
      + 'background:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.7);'
      + '-webkit-backdrop-filter:blur(10px) saturate(1.4);backdrop-filter:blur(10px) saturate(1.4);'
      + 'box-shadow:0 4px 14px rgba(30,40,60,.14),inset 0 1px 0 rgba(255,255,255,.75);' + extra;
    box.insertBefore(a, box.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add);
  else add();
})();
