// Trophées de l'appli Réalité augmentée (chargé en fin de page)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  // Chimie augmentée : le bandeau « Transformation équilibrée ! » du module Transformation chimique (js/reaction-view.js)
  setInterval(function () {
    var b = document.querySelector('.rx-banner--ok');
    if (b && !b.hidden && b.textContent.indexOf('Transformation équilibrée') >= 0) T.unlock('chimie-augmentee');
  }, 300);
})();
