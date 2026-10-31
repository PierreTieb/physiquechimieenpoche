// Trophées de l'appli Les Ondes Sonores (chargé en fin de page)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var $ = function (id) { return document.getElementById(id); };
  var actif = function (id) { var s = $(id); return !!s && s.classList.contains('active'); };

  // Radar : la distance calculée avec la formule est validée (mode « Mesurer des distances »)
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#m-go');
    if (b && !b.disabled) T.unlock('radar');
  }, true);

  // La musique dans la peau : un morceau joué jusqu'au bout (le bouton ■ redevient ▶ sans que l'élève l'ait arrêté)
  var coupe = false, joue = false;
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    if (e.target.closest('#mu-go')) coupe = joue;                    // ■ : arrêt ; ▶ : nouveau départ
    else if (e.target.closest('#mu-inst button')) coupe = true;      // changer d'instrument arrête le morceau
  }, true);
  document.addEventListener('change', function (e) {
    if (e.target.id === 'mu-song' || e.target.id === 'mu-spd') coupe = false;   // le morceau repart du début
  }, true);

  // (Pi)le poil la bonne fréquence : 314 Hz affichés pendant au moins 3,14 s
  var depuis = 0;
  setInterval(function () {
    var go = $('mu-go'), j = !!go && go.textContent.trim() === '■';
    if (!actif('screen-music')) coupe = true;                         // quitter l'écran arrête le morceau
    if (j && !joue) coupe = false;                                    // un morceau démarre
    if (!j && joue && !coupe) T.unlock('musique');                    // il s'est arrêté tout seul : joué en entier
    joue = j;

    var f = $('fq-val'), a314 = actif('screen-freq') && !!f && f.textContent.trim() === '314 Hz';
    if (!a314) depuis = 0;
    else if (!depuis) depuis = performance.now();
    else if (performance.now() - depuis >= 3140) T.unlock('pile-poil');
  }, 100);
})();
