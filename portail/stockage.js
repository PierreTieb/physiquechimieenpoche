// Page principale : demande au navigateur de protéger les données des applis (records, leçons, trophées).
// La demande vaut pour tout le site (toutes les applis de Physique Chimie en poche). Effets selon le téléphone :
// - Android (Chrome) : accordée sans rien demander si l'appli est installée sur l'écran d'accueil, mise en favori ou
//   souvent utilisée (refusée en silence sinon) ; une fois accordée, plus d'effacement quand le téléphone manque de place ;
// - iPhone (Safari) : accordée surtout à l'appli installée sur l'écran d'accueil ; dans un onglet, la règle de Safari
//   (données effacées après 7 jours sans visite) continue de s'appliquer ;
// - Firefox : pose la question à l'élève ; navigation privée : tout est effacé à la fermeture, quoi qu'on fasse.
(function () {
  'use strict';
  var s = navigator.storage;
  if (!s || !s.persist || !s.persisted) return;
  s.persisted().then(function (deja) {
    return deja || s.persist();
  }).then(function (ok) {
    document.documentElement.dataset.stockageProtege = ok ? 'oui' : 'non';   // pour vérifier (outils du navigateur)
  }).catch(function () { /* demande impossible : rien à faire */ });
})();
