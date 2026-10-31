// Page principale : bouton carré « Trophées » en haut à droite et liste des trophées (portail/trophees.js).
// Chaque trophée : un rectangle très arrondi cerclé de son métal, le trophée (plein s'il est obtenu,
// silhouette vide sinon), son titre et sa description (« ??? » pour les trophées secrets).
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var btn = document.getElementById('trophees-btn'), fen = document.getElementById('trophees'), liste = document.getElementById('trophees-liste');
  var NOMS = { bronze: 'Bronze', argent: 'Argent', or: 'Or', platine: 'Platine' };

  btn.innerHTML = T.svg({ metal: 'or' }, true);

  function afficher() {
    var o = T.obtenus(), n = T.TROPHEES.filter(function (t) { return o[t.id]; }).length;
    document.getElementById('trophees-compte').textContent = n + ' / ' + T.TROPHEES.length + ' obtenu' + (n > 1 ? 's' : '');
    liste.innerHTML = T.TROPHEES.map(function (t) {
      var c = T.TEINTES[t.metal], a = !!o[t.id];
      var desc = t.secret ? (a ? 'Trophée secret découvert !' : '???') : t.desc;
      return '<li class="trophee' + (a ? ' trophee--ok' : '') + '" style="--t1:' + c[0] + ';--t2:' + c[1] + ';--t3:' + c[2] + ';--t4:' + c[3] + '">' +
        T.svg(t, a, 'trophee__ico') +
        '<div><b class="trophee__titre">' + t.titre + '</b><span class="trophee__desc' + (t.secret && !a ? ' trophee__desc--secret' : '') + '">' + desc + '</span>' +
        '<small class="trophee__metal">' + NOMS[t.metal] + (a ? ' · obtenu le ' + new Date(o[t.id]).toLocaleDateString('fr-FR') : '') + '</small></div></li>';
    }).join('');
  }
  function ouvrir() {
    afficher();
    fen.hidden = false;
    document.body.classList.add('trophees-ouvert');
    fen.scrollTop = 0;
    document.getElementById('trophees-fermer').focus();
  }
  function fermer() {
    fen.hidden = true;
    document.body.classList.remove('trophees-ouvert');
    btn.focus();
  }
  btn.addEventListener('click', ouvrir);
  document.getElementById('trophees-fermer').addEventListener('click', fermer);
  fen.addEventListener('click', function (e) { if (e.target === fen) fermer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !fen.hidden) fermer(); });
  // Un trophée gagné pendant que la liste est ouverte (vérification au chargement de la page)
  window.addEventListener('storage', function () { if (!fen.hidden) afficher(); });
})();
