// Trophées de l'appli Entraînement aux conversions (chargé en fin de page)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var actif = function (id) { var s = document.getElementById(id); return !!s && s.classList.contains('active'); };

  // Joyeux duelliste : « Lancer le duel », puis une conversion du duel s'affiche (pas seulement le code)
  var lance = false;
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#duel-launch')) lance = true;
  }, true);

  setInterval(function () {
    if (lance && (actif('screen-exercise') || actif('screen-mixed'))) { T.unlock('duelliste'); lance = false; }
    if (actif('screen-challenge') || actif('screen-home')) lance = false;
    // Esprit de compétition : écran de fin d'un duel, compté une fois
    var fin = document.querySelector('#results .duel-ico--big');
    if (fin && !fin.dataset.pcpCompte) { fin.dataset.pcpCompte = '1'; T.compteur('duels'); }
  }, 300);
})();
