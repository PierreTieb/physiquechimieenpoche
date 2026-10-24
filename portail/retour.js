// Ajouté par mettre_a_jour.py dans chaque appli : lien « ← Choix d'application » en haut de sa page d'accueil
// data-home : élément de la page d'accueil de l'appli ; data-class : classe de son bouton « Retour » (même style)
(function () {
  var s = document.currentScript, home = s.getAttribute('data-home'), cls = s.getAttribute('data-class') || '';
  function add() {
    var box = document.querySelector(home);
    if (!box || box.querySelector('.pcp-retour')) return;
    var a = document.createElement('a');
    a.href = '../../index.html';
    a.className = cls + ' pcp-retour';
    a.textContent = '← Choix d\'application';
    a.style.cssText = 'display:inline-flex;align-items:center;text-decoration:none;';
    box.insertBefore(a, box.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add);
  else add();
})();
