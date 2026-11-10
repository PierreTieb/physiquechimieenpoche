// Trophées de l'appli Les Ondes Sonores (chargé en fin de page)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var $ = function (id) { return document.getElementById(id); };
  var actif = function (id) { var s = $(id); return !!s && s.classList.contains('active'); };

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

    sonar();
  }, 100);

  // Sonar et Écho (js/sonar/) : la simulation Sim et l'écran #screen-sonar, dont data-scen vaut 'libre' ou le n° du scénario
  var mode = null, compte = 0, vues = 0;
  function sonar() {
    var ecran = $('screen-sonar');
    if (!ecran || typeof Sim === 'undefined') return;
    var ems = Sim.emissions(), m = ecran.dataset.scen;
    // Obstacle repéré ! : un écho revenu au sonar
    if (ems.some(function (e) { return e.recus.length; })) T.unlock('obstacle-repere');
    // Je peux pas le perdre : 30 émissions sans changer de scénario ni de mode (« Réinitialiser » vide la liste sans remettre à zéro)
    if (m !== mode) { mode = m; compte = 0; vues = ems.length; }
    if (ems.length > vues) compte += ems.length - vues;
    vues = ems.length;
    if (compte >= 30) T.unlock('perdre');
    // Armada ! : en mode libre, une émission vers 10 obstacles ou plus dont tous les échos sont revenus
    if (m === 'libre' && ems.some(function (e) { return e.echos.length >= 10 && e.recus.length === e.echos.length; })) T.unlock('armada');
    // Ça va, il est loin / Il arrive... : bonne distance ou bonne vitesse validée dans un scénario
    var r = $('id-res');
    if (r && !r.hidden && m !== 'libre' && r.classList.contains('id-res--ok')) T.unlock(r.dataset.type === 'distance' ? 'loin' : 'arrive');
  }
})();
