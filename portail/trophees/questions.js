// Trophées de l'appli Questions Scientifiques (chargé en fin de page)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var $ = function (id) { return document.getElementById(id); };
  // Voyage des tailles : niveaux de l'atome, et niveaux à partir de notre galaxie (js/app2d.js)
  var ATOME = ['Noyau d’atome', 'Atome d’oxygène'], GALAXIE = ['Voie lactée', 'Galaxies voisines', 'Superamas de la Vierge'];
  var vuAtome = false;

  setInterval(function () {
    // Un petit pas pour l'Homme... : partir de l'atome et arriver jusqu'à la galaxie
    var l = $('lvl'), n = l ? l.textContent.trim() : '';
    if (ATOME.indexOf(n) >= 0) vuAtome = true;
    if (vuAtome && GALAXIE.indexOf(n) >= 0) T.unlock('petit-pas');
    // Chargez ! : l'éclair extra-nuageux frappe la colline (classe « strike » du théâtre de l'orage)
    var th = $('theatre');
    if (th && !th.hidden && th.classList.contains('strike')) T.unlock('chargez');
    // Un coucher de Soleil : le Soleil posé sur l'horizon, d'un côté ou de l'autre (js/room.js : observateur en 270, 240)
    var s = $('c-sun');
    if (s && s.dataset.x) {
      var h = Math.atan2(240 - parseFloat(s.dataset.y), Math.abs(parseFloat(s.dataset.x) - 270)) * 180 / Math.PI;
      if (h <= .45) T.unlock('coucher-soleil');
    }
  }, 300);
})();
