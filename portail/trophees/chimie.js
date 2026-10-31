// Trophées de l'appli Les Bases de la chimie (chargé en fin de page, après les scripts de l'appli)
(function () {
  'use strict';
  var T = window.Trophees;
  if (!T) return;
  var $ = function (id) { return document.getElementById(id); };

  // Joyeux duelliste : la page vient d'être rechargée pour lancer un duel (js/challenge.js), la partie démarre
  var duelLance = false;
  try { duelLance = !!sessionStorage.getItem('chimie-duel-launch'); } catch (e) { /* stockage indisponible */ }

  // Nullos : 5 questions passées dans la même partie du Challenge
  var passees = 0, enPartie = false;
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#ch-pass') && document.body.classList.contains('ch-run') && ++passees >= 5) T.unlock('nullos');
  }, true);

  // Non là c'est trop : des 9 dans toutes les cases de coefficients d'une équation
  document.addEventListener('input', function (e) {
    var i = e.target;
    if (!i.classList || !i.classList.contains('eq-coef')) return;
    var bloc = i.parentElement;
    while (bloc && bloc.querySelectorAll('.eq-coef').length < 2) bloc = bloc.parentElement;
    if (!bloc) return;
    var cases = [].slice.call(bloc.querySelectorAll('.eq-coef'));
    if (cases.every(function (c) { return c.value.trim() === '9'; })) T.unlock('trop');
  }, true);

  // Attention très chaud !! : toutes les couleurs de flamme des ions, vues au bec Bunsen (labos et leçons)
  function flammes() {
    var Lb = window.Lab;
    if (!Lb || !Lb.data) return;
    var vues = [];
    ['free', 'test', 'expert'].forEach(function (k) {
      try {
        (Lb[k].state().history || []).forEach(function (h) { if (h.test === 'flame' && h.result) vues = T.ajoute('flammes', h.result); });
      } catch (e) { /* labo pas encore ouvert */ }
    });
    var F = Lb.data.tests.flame, toutes = Object.keys(F).map(function (k) { return F[k].name; });
    if (vues.length && toutes.every(function (n) { return vues.indexOf(n) >= 0; })) T.unlock('chaud2');
  }

  // Leçons terminées
  function lecons() {
    var L = window.LessonsData || [], fait = {};
    try { fait = JSON.parse(localStorage.getItem('chimie-lessons-done')) || {}; } catch (e) { /* stockage indisponible */ }
    var liste = L.filter(function (l) { return !l.parent; });
    T.lecons('chimie', liste.filter(function (l) { return fait[l.id]; }).length, liste.length);
  }

  var n = 0;
  setInterval(function () {
    var r = document.body.classList.contains('ch-run');
    if (r && !enPartie) {
      passees = 0;
      if (duelLance) { T.unlock('duelliste'); duelLance = false; }
    }
    enPartie = r;
    // Esprit de compétition : fin d'une partie en duel (écran de fin du duel, compté une fois)
    var fin = document.querySelector('#ch-results .ch-res__duel');
    if (fin && !fin.dataset.pcpCompte) { fin.dataset.pcpCompte = '1'; T.compteur('duels'); }
    // Attention super chaud !!! : la température maximale du graphique (500 °C), en leçon, au labo ou au Challenge
    try { if (window.TempLab.state().T >= 499.5) T.unlock('chaud3'); } catch (e) { /* écran pas encore ouvert */ }
    flammes();
    if (++n % 4 === 1) lecons();
  }, 400);
})();
