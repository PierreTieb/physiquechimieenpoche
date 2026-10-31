// Trophées de Physique Chimie en poche : des accomplissements d'exploration dans toutes les applis.
// Ce fichier est chargé par la page principale et, par mettre_a_jour.py, dans chaque copie d'appli (apps/<nom>/),
// avec un observateur propre à l'appli (portail/trophees/<nom>.js) qui appelle Trophees.unlock(id).
// Les applis d'origine du dossier VS Code ne contiennent aucun code de trophée.
//
// Ajouter un trophée : une ligne dans TROPHEES (le tri se fait tout seul : bronze, argent, or, platine ;
// dans chaque métal, ceux avec description d'abord, les secrets « ??? » ensuite), puis sa détection.
window.Trophees = (function () {
  'use strict';

  var KEY = 'pcp-trophees', KEY_SUIVI = 'pcp-trophees-suivi';
  var METAUX = ['bronze', 'argent', 'or', 'platine'];
  // Couleurs de chaque métal, du plus clair au plus foncé (comme les médailles des applis ;
  // le platine tire vers le lavande, comme le reflet irisé de leurs médailles de platine, pour ne pas ressembler à l'argent)
  var TEINTES = {
    bronze:  ['#FFE6CC', '#E8A066', '#A9622C', '#643410'],
    argent:  ['#FFFFFF', '#DCE3EB', '#9AA6B4', '#56606D'],
    or:      ['#FFFBE0', '#FFD54A', '#D49A12', '#7E5400'],
    platine: ['#FFFFFF', '#E2E4FF', '#9CA6E8', '#4A4E96']
  };
  // Les applis comptées par « Premiers pas »
  var APPLIS = ['chimie', 'conversions', 'ondes', 'electricite', 'questions', 'realite'];

  // secret : la description n'est pas montrée (« ??? ») ; la condition est notée en commentaire
  var TROPHEES = [
    { id: 'premiers-pas', metal: 'bronze', titre: 'Premiers pas', desc: 'Ouvre au moins une fois toutes les applications' },
    { id: 'chimiste-herbe', metal: 'bronze', titre: 'Chimiste en herbe', desc: 'Termine 3 leçons de Chimie' },
    { id: 'electricien-herbe', metal: 'bronze', titre: 'Électricien(ne) en herbe', desc: 'Termine 3 leçons d\'Électricité' },
    { id: 'radar', metal: 'bronze', titre: 'Radar', desc: 'Calcule ta première distance à l\'aide du son' },
    { id: 'bon-debut', metal: 'bronze', titre: 'Un bon début', desc: 'Obtiens 3 médailles de bronze' },
    { id: 'petit-pas', metal: 'bronze', titre: 'Un petit pas pour l\'Homme...', desc: 'Passe de l\'atome à la galaxie pour la première fois' },
    { id: 'chaud1', metal: 'bronze', titre: 'Attention c\'est chaud !', secret: true },          // brûler complètement un fil par court-circuit, au Laboratoire de l'Électricité
    { id: 'nullos', metal: 'bronze', titre: 'Nullos', secret: true },                            // passer 5 questions dans une même partie du Challenge de Chimie
    { id: 'chimiste-cale', metal: 'argent', titre: 'Chimiste calé(e)', desc: 'Termine 6 leçons de Chimie' },
    { id: 'electricien-cale', metal: 'argent', titre: 'Électricien(ne) calé(e)', desc: 'Termine 6 leçons d\'Électricité' },
    { id: 'musique', metal: 'argent', titre: 'La musique dans la peau', desc: 'Joue un morceau de musique en entier' },
    { id: 'belle-avancee', metal: 'argent', titre: 'Une belle avancée', desc: 'Obtiens 3 médailles d\'argent' },
    { id: 'chargez', metal: 'argent', titre: 'Chargez !', desc: 'Fais tomber la foudre' },
    { id: 'chaud2', metal: 'argent', titre: 'Attention très chaud !!', secret: true },            // voir toutes les couleurs de flamme des ions au bec Bunsen
    { id: 'tremblotte', metal: 'argent', titre: 'J\'ai la tremblotte', secret: true },          // une lampe, un moteur et une DEL qui tremblent en même temps
    { id: 'specialiste-chimie', metal: 'or', titre: 'Spécialiste de la Chimie', desc: 'Termine toutes les leçons de Chimie' },
    { id: 'specialiste-elec', metal: 'or', titre: 'Spécialiste de l\'Électricité', desc: 'Termine toutes les leçons d\'Électricité' },
    { id: 'pas-mal', metal: 'or', titre: 'Pas mal du tout !', desc: 'Obtiens 3 médailles d\'or' },
    { id: 'maestro', metal: 'or', titre: 'Maestro !', desc: 'Branche 6 buzzers en dérivation en même temps' },
    { id: 'duelliste', metal: 'or', titre: 'Joyeux duelliste', desc: 'Affronte un adversaire dans un mode Duel' },
    { id: 'coucher-soleil', metal: 'or', titre: 'Un coucher de Soleil', desc: 'Observe la couleur du ciel au coucher du Soleil' },
    { id: 'pile-poil', metal: 'or', titre: '(Pi)le poil la bonne fréquence', secret: true },      // rester à 314 Hz pendant au moins 3,14 s
    { id: 'trop', metal: 'or', titre: 'Non là c\'est trop', secret: true },                      // des coefficients 9 dans toutes les cases d'une équation à équilibrer
    { id: 'chaud3', metal: 'or', titre: 'Attention super chaud !!!', secret: true },             // atteindre la température maximale (500 °C) du graphique de température
    { id: 'competition', metal: 'platine', titre: 'Esprit de compétition', desc: 'Termine 5 parties en mode Duel' },
    { id: 'chimie-augmentee', metal: 'platine', titre: 'Chimie augmentée', desc: 'Équilibre une équation chimique en réalité augmentée' },
    { id: 'respect', metal: 'platine', titre: 'Alors là, respect !', secret: true },             // obtenir 3 médailles de platine
    { id: 'chaud4', metal: 'platine', titre: 'ATTENTION CHAUD CHAUD CHAUD !!!', secret: true }   // 3 résistances qui tremblent en même temps avec un seul générateur
  ];
  TROPHEES.forEach(function (t, i) { t.rang = i; });
  TROPHEES.sort(function (a, b) {
    return METAUX.indexOf(a.metal) - METAUX.indexOf(b.metal) || (a.secret ? 1 : 0) - (b.secret ? 1 : 0) || a.rang - b.rang;
  });
  var PAR_ID = {};
  TROPHEES.forEach(function (t) { PAR_ID[t.id] = t; });

  /* ---------- Mémoire du téléphone ---------- */
  function lire(cle) { try { return JSON.parse(localStorage.getItem(cle)) || {}; } catch (e) { return {}; } }
  function ecrire(cle, v) { try { localStorage.setItem(cle, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  function obtenus() { return lire(KEY); }

  function unlock(id) {
    var t = PAR_ID[id], o = obtenus();
    if (!t || o[id]) return false;
    o[id] = new Date().toISOString();
    ecrire(KEY, o);
    notifier(t);
    return true;
  }

  // Suivi entre deux visites : ensembles (applis ouvertes, flammes vues), compteurs (duels terminés), leçons
  function ajoute(liste, valeur) {
    var s = lire(KEY_SUIVI), l = s[liste] || [];
    if (l.indexOf(valeur) < 0) { l.push(valeur); s[liste] = l; ecrire(KEY_SUIVI, s); }
    return l;
  }
  function compteur(nom) {
    var s = lire(KEY_SUIVI);
    s[nom] = (s[nom] || 0) + 1;
    ecrire(KEY_SUIVI, s);
    verifier();
    return s[nom];
  }
  // Leçons terminées d'une appli (calculées par son observateur, qui connaît la liste des leçons)
  function lecons(appli, faites, total) {
    var s = lire(KEY_SUIVI);
    s.lecons = s.lecons || {};
    s.lecons[appli] = [faites, total];
    ecrire(KEY_SUIVI, s);
    verifier();
  }

  /* ---------- Trophées tirés de ce qui est déjà enregistré ---------- */
  var RANG = { bronze: 1, argent: 2, or: 3, platine: 4 };
  // Meilleure médaille de chaque challenge (Chimie : 4e, 3e, La totale ; Conversions : 4e, 3e ; Électricité).
  // Une médaille compte aussi pour les métaux inférieurs ; les duels n'enregistrent pas de record.
  function medailles() {
    var rangs = [], ch = lire('chimie-challenge-best'), cv = lire('conv-challenge-best'), el = lire('elec-challenge-best');
    Object.keys(ch).forEach(function (k) { rangs.push(RANG[ch[k] && ch[k].medal] || 0); });
    Object.keys(cv).forEach(function (k) { rangs.push(RANG[cv[k] && cv[k].medal] || 0); });
    rangs.push(RANG[el.medal] || 0);
    return function (metal) { return rangs.filter(function (r) { return r >= RANG[metal]; }).length; };
  }
  function verifier() {
    var s = lire(KEY_SUIVI), m = medailles(), l = s.lecons || {};
    if ((s.applis || []).length >= APPLIS.length) unlock('premiers-pas');
    if (m('bronze') >= 3) unlock('bon-debut');
    if (m('argent') >= 3) unlock('belle-avancee');
    if (m('or') >= 3) unlock('pas-mal');
    if (m('platine') >= 3) unlock('respect');
    [['chimie', 'chimiste-herbe', 'chimiste-cale', 'specialiste-chimie'], ['electricite', 'electricien-herbe', 'electricien-cale', 'specialiste-elec']].forEach(function (a) {
      var n = l[a[0]];
      if (!n) return;
      if (n[0] >= 3) unlock(a[1]);
      if (n[0] >= 6) unlock(a[2]);
      if (n[1] && n[0] >= n[1]) unlock(a[3]);
    });
    if ((s.duels || 0) >= 5) unlock('competition');
  }

  /* ---------- Dessin du trophée (plein et brillant, ou silhouette vide) ---------- */
  var nDessin = 0;
  function svg(t, plein, cls) {
    var c = TEINTES[t.metal], g = 'pcp-tg' + (++nDessin);
    var forme = '<path d="M18 9h28v11c0 10-6 17-14 17S18 30 18 20z"/><path d="M29 37h6v7h-6z"/><path d="M22 44h20l2 6H20z"/><rect x="16" y="50" width="32" height="7" rx="2"/>';
    var anses = '<path d="M18 13h-6c0 9 4 13 9 14M46 13h6c0 9-4 13-9 14" fill="none" stroke-width="3.4" stroke-linecap="round"/>';
    if (!plein) {
      return '<svg class="' + (cls || '') + '" viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#B4BCC6" stroke-width="2" stroke-dasharray="3 3" stroke-linejoin="round">' +
        forme + '</g><g stroke="#B4BCC6" stroke-dasharray="3 3">' + anses + '</g></svg>';
    }
    return '<svg class="' + (cls || '') + '" viewBox="0 0 64 64" aria-hidden="true"><defs>' +
      '<linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + c[2] + '"/><stop offset=".35" stop-color="' + c[0] + '"/>' +
      '<stop offset=".6" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      '<g stroke="' + c[2] + '">' + anses + '</g>' +
      '<g fill="url(#' + g + ')" stroke="' + c[3] + '" stroke-width="1.2" stroke-linejoin="round">' + forme + '</g>' +
      '<path d="M32 14l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5-3.7-3.4 5-.6z" fill="' + c[0] + '" stroke="' + c[3] + '" stroke-width=".8" stroke-linejoin="round"/>' +
      '<path d="M23 13v7q0 6 3 9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>';
  }

  /* ---------- Notification : 3 s en haut de l'écran, confettis de la couleur du métal ---------- */
  var file = [], enCours = false;
  function style() {
    if (document.getElementById('pcp-trophees-css')) return;
    var s = document.createElement('style');
    s.id = 'pcp-trophees-css';
    s.textContent =
      '.pcp-toast{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));z-index:2147483000;display:flex;align-items:center;gap:12px;' +
      'width:max-content;max-width:calc(100vw - 24px);padding:10px 18px 10px 12px;border-radius:20px;background:#fff;color:#2E3A46;' +
      'font-family:Fredoka,Nunito,system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 0 0 3px var(--pcp-m),0 14px 34px rgba(0,0,0,.28);' +
      'transform:translate(-50%,-160%);transition:transform .45s cubic-bezier(.34,1.56,.64,1);pointer-events:none}' +
      '.pcp-toast.on{transform:translate(-50%,0)}' +
      '.pcp-toast svg{flex:none;width:48px;height:48px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}' +
      '.pcp-toast small{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--pcp-f)}' +
      '.pcp-toast b{display:block;font-size:1.12rem;font-weight:600;line-height:1.2}' +
      // taille imposée : sans elle, le canevas (2 ou 3 fois plus grand sur téléphone) débordait et les confettis partaient sur le côté
      '.pcp-confetti{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147482999;pointer-events:none}';
    document.head.appendChild(s);
  }
  function notifier(t) {
    file.push(t);
    if (!enCours) suivant();
  }
  function suivant() {
    var t = file.shift();
    if (!t) { enCours = false; return; }
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { file.unshift(t); suivant(); }); return; }
    enCours = true;
    style();
    var c = TEINTES[t.metal], d = document.createElement('div');
    d.className = 'pcp-toast';
    d.setAttribute('role', 'status');
    d.style.setProperty('--pcp-m', c[2]);
    d.style.setProperty('--pcp-f', c[3]);
    d.innerHTML = svg(t, true) + '<span><small>Trophée débloqué !</small><b>' + t.titre + '</b></span>';
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
    confettis(c);
    setTimeout(function () {
      d.classList.remove('on');
      setTimeout(function () { d.remove(); suivant(); }, 500);
    }, 3000);
  }
  function confettis(c) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.createElement('canvas'), x = cv.getContext('2d'), W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'pcp-confetti';
    cv.width = W * dpr; cv.height = H * dpr;
    x.scale(dpr, dpr);
    document.body.appendChild(cv);
    var couleurs = [c[0], c[1], c[2], c[3], c[1]], p = [];
    for (var i = 0; i < 90; i++) {
      // gerbe qui jaillit juste sous la notification, au centre de l'écran
      p.push({ x: W / 2 + (Math.random() - .5) * 140, y: 78, vx: (Math.random() - .5) * 9, vy: -Math.random() * 6 - 1,
        s: Math.random() * 6 + 5, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, c: couleurs[i % couleurs.length] });
    }
    var t0 = performance.now();
    (function frame(now) {
      var age = now - t0;
      x.clearRect(0, 0, W, H);
      x.globalAlpha = Math.max(0, Math.min(1, (3000 - age) / 700));
      p.forEach(function (q) {
        q.vy += .18; q.vx *= .99; q.x += q.vx; q.y += q.vy; q.r += q.vr;
        x.save(); x.translate(q.x, q.y); x.rotate(q.r); x.fillStyle = q.c;
        x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = .6;
        x.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); x.strokeRect(-q.s / 2, -q.s / 4, q.s, q.s / 2);
        x.restore();
      });
      if (age < 3000) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  /* ---------- Démarrage : appli ouverte (attribut data-app du script), vérification de ce qui est déjà enregistré ---------- */
  var moi = document.currentScript, appli = moi && moi.getAttribute('data-app');
  if (appli && APPLIS.indexOf(appli) >= 0) ajoute('applis', appli);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', verifier); else verifier();
  // Une autre page (autre onglet) a pu enregistrer une médaille ou une leçon
  window.addEventListener('storage', function (e) { if (e.key !== KEY) verifier(); });

  return {
    TROPHEES: TROPHEES, METAUX: METAUX, TEINTES: TEINTES,
    unlock: unlock, obtenus: obtenus, ajoute: ajoute, compteur: compteur, lecons: lecons, verifier: verifier, svg: svg
  };
})();
