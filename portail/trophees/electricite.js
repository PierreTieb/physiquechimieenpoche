// Trophées de l'appli L'électricité : chargé juste après js/lab.js (voir mettre_a_jour.py), avant la création des labos.
// Chaque labo créé (Laboratoire, leçons, Challenge) est suivi grâce à son mode d'emploi (fin de js/lab.js) :
// lab.state(nom).level === 'surtension' quand le dipôle tremble, événement 'burn' quand un fil a fini de brûler.
(function () {
  'use strict';
  var T = window.Trophees, L = window.Lab;
  if (!T || !L || !L.create) return;

  var labs = [];
  var creer = L.create;
  L.create = function (host, opts) {
    opts = opts || {};
    var labo = !!host && host.id === 'lab-host', avant = opts.onEvent;
    opts.onEvent = function (type) {
      if (type === 'burn' && labo) T.unlock('chaud1');                 // fil brûlé : au Laboratoire seulement
      if (avant) return avant.apply(this, arguments);
    };
    var lab = creer.call(this, host, opts);
    if (!opts.ideal && !opts.nominal) labs.push({ lab: lab, host: host });   // dipôles idéaux : jamais de tremblement
    return lab;
  };

  // Tremble sans être sur le point de casser : au-delà de 150 % (js/lab.js), le dipôle casse en un tiers de seconde
  function tremble(lab, n) { try { var s = lab.state(n); return s.level === 'surtension' && s.ratio <= 1.5; } catch (e) { return false; } }
  function sonne(lab, n) { try { var s = lab.state(n); return s.on && !s.broken; } catch (e) { return false; } }
  function verifierLab(lab) {
    var de = function (type) { try { return lab.names(type) || []; } catch (e) { return []; } };
    var t = function (type) { return de(type).filter(function (n) { return tremble(lab, n); }).length; };
    if (t('lamp') && t('motor') && t('led')) T.unlock('tremblotte');
    if (t('res') >= 3 && de('gen').length === 1) T.unlock('chaud4');
    // 6 buzzers qui sonnent, tous en dérivation les uns par rapport aux autres
    var b = de('buzzer').filter(function (n) { return sonne(lab, n); });
    if (b.length >= 6) {
      var ok = true;
      for (var i = 0; i < b.length && ok; i++) for (var j = i + 1; j < b.length && ok; j++) {
        try { ok = lab.relation(b[i], b[j]) === 'derivation'; } catch (e) { ok = false; }
      }
      if (ok) T.unlock('maestro');
    }
  }
  setInterval(function () {
    labs = labs.filter(function (x) { return document.body.contains(x.host); });
    labs.forEach(function (x) { if (x.host.offsetParent) verifierLab(x.lab); });
  }, 300);

  // Leçons terminées : un cours à plusieurs niveaux compte quand tous ses niveaux sont faits (comme js/lessons.js)
  function lecons() {
    var D = window.LessonsData || [], fait = {};
    try { fait = JSON.parse(localStorage.getItem('elec-lessons-done')) || {}; } catch (e) { /* stockage indisponible */ }
    var par = {};
    D.forEach(function (c) { par[c.id] = c; });
    var fini = function (c) { return !!fait[c.id] && (!c.next || (par[c.next] && fini(par[c.next]))); };
    var cours = D.filter(function (c) { return !c.parent; });
    T.lecons('electricite', cours.filter(fini).length, cours.length);
  }
  // Ce fichier est chargé avant js/lessons-data.js : premier calcul une fois la page chargée
  setInterval(lecons, 1500);
  document.addEventListener('DOMContentLoaded', lecons);
})();
