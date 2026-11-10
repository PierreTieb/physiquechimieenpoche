// Mode « Sonar et Écho » des Ondes Sonores (repris de l'appli Sonar) :
// réglages, mode admin, chronomètre, historique, QR code, son, identification des obstacles, boucle d'animation.
// L'animation ne tourne que lorsque l'écran est affiché (start / stop, appelés par js/app.js).
const SonarApp = (() => {
  const CLE = 'sonar-echo-config';
  const $ = id => document.getElementById(id);
  const versOrigine = a => { const r = a * Math.PI / 180; return Math.atan2(-Math.cos(r), -Math.sin(r)) * 180 / Math.PI; };

  const DEFAUT = {
    milieu: 'eau', portee: 3000, angle: 60, grad: false, duree: true,
    origine: { v: 0, dir: 90 },
    obstacles: [{ d: 1200, a: -8, v: 0, m: 'p' }, { d: 2250, a: 14, v: 0, m: 'p' }]
  };
  // Mouvement d'un obstacle (voir js/sonar/simulation.js) : vers le sonar, s'en éloigne, sur l'arc vers la droite ou la gauche
  const MOUVEMENTS = { p: 'Vers le sonar', e: 'S\'éloigne du sonar', g: 'Sur l\'arc, vers la gauche', d: 'Sur l\'arc, vers la droite' };
  // Anciens réglages (direction en degrés) : on garde le plus proche des 4 mouvements
  function versMouvement(dir, a) {
    const ecart = x => Math.abs(((dir - x) % 360 + 540) % 360 - 180);
    const cands = { p: versOrigine(a), e: versOrigine(a) + 180, d: -a, g: 180 - a };
    return Object.keys(cands).reduce((m, k) => ecart(cands[k]) < ecart(cands[m]) ? k : m, 'p');
  }

  // Deux façons d'utiliser l'appli :
  //  - mode libre (par défaut) : la roue dentée est accessible à tous, les réglages sont gardés dans le navigateur ;
  //  - scénario n (scen = indice) : réglages imposés, obstacles cachés, pas de roue dentée…
  //    sauf en mode professeur (5 clics sur le titre), qui donne aussi les 5 emplacements.
  // vue : indice de l'émission mise en avant dans le graphique (clic dans l'historique), ou null
  const CLE_MODE = 'sonar-echo-scenario';
  const ecranSonar = document.getElementById('screen-sonar');
  // trouves : obstacles dont l'élève a donné la bonne réponse (remis à zéro à chaque modification des réglages)
  let trouves = {};
  let cfg, scen = null, prof = false, admin = false, sel = null, vue = null, zoom = false, son = true, flashE = -1e9, flashR = -1e9, audio = null;

  // ---------- Configuration ----------
  const nb = (x, def, a, b) => { x = Number(x); return Number.isFinite(x) ? U.clamp(x, a, b) : def; };
  function valide(c) {
    c = c && typeof c === 'object' ? c : {};
    const portee = nb(c.portee, 3000, 10, 100000);
    const o = c.origine || {};
    return {
      milieu: c.milieu === 'air' ? 'air' : 'eau',
      portee, angle: nb(c.angle, 60, 10, 180), grad: !!c.grad, duree: c.duree !== false,
      origine: { v: nb(o.v, 0, 0, 100000), dir: nb(o.dir, 90, -360, 360) },
      obstacles: (Array.isArray(c.obstacles) ? c.obstacles : []).slice(0, 26).map(b => {
        const a = nb(b && b.a, 0, -90, 90);
        const m = b && MOUVEMENTS[b.m] ? b.m : versMouvement(nb(b && b.dir, versOrigine(a), -360, 360), a);
        return { d: nb(b && b.d, portee / 2, 1, portee), a, v: nb(b && b.v, 0, 0, 100000), m };
      })
    };
  }

  // Lien compact : milieu,portée,angle,distances,durées,vitesse sonar,direction sonar ; puis un obstacle par bloc d,a,v,m
  // (ex. #c=e,3000,60,0,1,0,90;1200,-8,0,p;2250,14,40,e) : un QR code moins dense, plus facile à scanner.
  // m : mouvement (p, e, g, d) ; un ancien lien donne une direction en degrés, convertie par valide()
  const r1 = x => Math.round(x * 10) / 10;
  function compacter(c) {
    return [[c.milieu === 'air' ? 'a' : 'e', c.portee, r1(c.angle), +c.grad, +c.duree, r1(c.origine.v), r1(c.origine.dir)].join(',')]
      .concat(c.obstacles.map(o => [r1(o.d), r1(o.a), r1(o.v), o.m].join(','))).join(';');
  }
  function decompacter(s) {
    const [tete, ...obs] = s.split(';'), t = tete.split(',');
    return {
      milieu: t[0] === 'a' ? 'air' : 'eau', portee: t[1], angle: t[2], grad: t[3] === '1', duree: t[4] !== '0',
      origine: { v: t[5], dir: t[6] },
      obstacles: obs.filter(Boolean).map(b => { const [d, a, v, m] = b.split(','); return MOUVEMENTS[m] ? { d, a, v, m } : { d, a, v, dir: m }; })
    };
  }

  // Réglages du mode libre (une adresse #c=… les remplace)
  function chargerLibre() {
    const c = location.hash.match(/^#c=([\w.,;-]+)/);
    if (c) { try { return valide(decompacter(c[1])); } catch (e) { /* lien abîmé : on ignore */ } }
    const m = location.hash.match(/^#s=([\w-]+)/);
    if (m) { try { return valide(U.decode(m[1])); } catch (e) { /* lien abîmé : on ignore */ } }
    const lu = U.lire(CLE);
    return valide(lu || JSON.parse(JSON.stringify(DEFAUT)));
  }
  function lireScenario(i) {
    const s = emplacements()[i];
    if (!s) return null;
    try { return valide(decompacter(s.c)); } catch (e) { return null; }
  }

  // Seul le mode libre est enregistré : un scénario modifié par le professeur ne l'est que via son emplacement
  function sauver() {
    if (scen === null) U.ecrire(CLE, cfg);
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  // Toute modification remet la simulation à zéro
  function appliquer(enregistrer = true) {
    Sim.charger(cfg); vue = null; zoom = false; trouves = {};
    if (enregistrer) sauver();
    majEntete(); majHisto(); majBoutons(); majIdent();
  }

  // ---------- API utilisée par le sonar (mode admin) ----------
  function etatAdmin() { return admin ? { cfg, sel } : null; }
  function selectionner(s) { sel = s; majSel(); }
  function ajouter(d, a) {
    if (cfg.obstacles.length >= 26) { toast('26 obstacles au maximum'); return null; }
    const pas = cfg.portee >= 2000 ? 10 : cfg.portee >= 200 ? 5 : 1;
    d = U.clamp(Math.round(d / pas) * pas || pas, 1, cfg.portee);
    cfg.obstacles.push({ d, a: U.clamp(a, -90, 90), v: 0, m: 'p' });
    appliquer(false); selectionner(cfg.obstacles.length - 1);
    return cfg.obstacles.length - 1;
  }
  function majObs(k, champs, enregistrer = true) { Object.assign(cfg.obstacles[k], champs); appliquer(enregistrer); }
  function majOrig(champs, enregistrer = true) { Object.assign(cfg.origine, champs); appliquer(enregistrer); }

  // ---------- Affichage ----------
  function majEntete() {
    // l'écran porte le milieu (décor) et le mode : 'libre' ou le n° du scénario
    ecranSonar.dataset.milieu = cfg.milieu;
    ecranSonar.dataset.scen = scen === null ? 'libre' : String(scen);
    $('i-milieu').textContent = (cfg.milieu === 'eau' ? 'Eau' : 'Air') + ' · ' + U.fmtNb(VITESSES[cfg.milieu], 0) + ' m/s';
    $('i-portee').textContent = 'Portée : ' + U.fmtM(cfg.portee);
    $('i-scen').textContent = scen === null ? 'Mode libre' : nomScen(scen);
    $('i-scen').classList.toggle('libre', scen === null);
    document.querySelectorAll('#a-milieu button').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === cfg.milieu));
    $('a-portee').value = cfg.portee; $('a-angle').value = cfg.angle; $('a-grad').checked = cfg.grad; $('a-duree').checked = cfg.duree;
  }

  function majBoutons() {
    const ems = Sim.emissions(), n = Sim.actifs().length;
    const echos = ems.some(e => e.recus.length);
    $('b-zoom').disabled = !echos;
    if (!echos) zoom = false;
    $('b-zoom').textContent = zoom ? 'Toute la durée d\'écoute' : 'Zoom sur les échos';
    $('etat').textContent = n ? (n > 1 ? n + ' émissions à l\'écoute…' : 'Écoute en cours…') : ems.length ? 'Écoute terminée' : 'Prêt à émettre';
  }

  // Pour chaque écho, l'écho précédent du même obstacle et la durée de son déplacement entre les deux
  function lignesVitesse(i) {
    const ems = Sim.emissions(), e = ems[i], win = Sim.win(), out = [];
    for (const r of e.recus) {
      let j = i - 1, r1 = null;
      for (; j >= 0 && !r1; j--) r1 = ems[j].recus.find(q => q.k === r.k) || null;
      if (!r1) continue;
      const n1 = ems[j + 1].n, dt = Sim.dureeDeplacement(r.k, r1, r), t0 = Sim.departObs(r.k);
      const critere = t0 !== null && t0 > r1.th
        ? (t0 === r1.tr ? 'de la réception de l\'écho n°' + n1 + ' (l\'obstacle démarre)' : 'du départ de l\'obstacle')
          + ' jusqu\'au contact de l\'onde n°' + e.n
        : 'entre le contact de l\'onde n°' + n1 + ' et celui de l\'onde n°' + e.n;
      out.push('<div class="vitesse"><b>' + U.lettre(r.k) + '</b> : déplacement pendant <b>' + U.fmtT(dt, win) + '</b>'
        + '<span class="critere">' + critere + '</span></div>');
    }
    return out.join('');
  }

  function majHisto() {
    const ems = Sim.emissions(), ol = $('histo'), win = Sim.win();
    $('histo-aide').hidden = !(cfg.duree && ems.length > 1);
    if (!ems.length) { ol.innerHTML = '<li class="vide">Aucune émission pour l\'instant.</li>'; return; }
    ol.innerHTML = ems.map((e, i) => {
      const coul = couleurEmission(cfg.milieu, e.n);
      const puces = e.recus.length
        ? e.recus.map(r => '<span class="puce" style="--c:' + coul + '">' + U.lettre(r.k) + ' : ' + U.fmtT(r.delai, win) + '</span>').join('')
        : '<span class="vide">' + (e.fini ? 'aucun écho reçu' : 'écoute en cours…') + '</span>';
      return '<li><button class="ligne' + (i === vue ? ' active' : '') + '" data-i="' + i + '" style="--c:' + coul + '">'
        + '<span class="num">Émission n°' + e.n + '</span>'
        + '<span class="quand">' + (e.n === 1 ? 'départ du chronomètre général' : 'émise ' + U.fmtT(e.te, 1) + ' après la n°1') + '</span>'
        + '<span class="puces">' + puces + '</span>'
        + (cfg.duree ? lignesVitesse(i) : '') + '</button></li>';
    }).reverse().join('');
  }

  function majSel() {
    const z = $('a-sel');
    if (sel === 'o') {
      z.innerHTML = '<h3>Origine (sonar)</h3>'
        + '<label class="champ"><span>Vitesse (m/s)</span><input type="number" id="s-v" min="0" step="1" value="' + cfg.origine.v + '"></label>'
        + '<p class="aide">' + (cfg.origine.v > 0 ? 'Glisse la pointe de la flèche pour choisir sa direction. ' : '')
        + 'Le sonar se met en mouvement à la première réception d\'un écho.</p>';
      $('s-v').addEventListener('change', e => { majOrig({ v: nb(e.target.value, 0, 0, 100000) }); majSel(); });
    } else if (typeof sel === 'number' && cfg.obstacles[sel]) {
      const ob = cfg.obstacles[sel];
      z.innerHTML = '<h3>Obstacle ' + U.lettre(sel) + '</h3>'
        + '<label class="champ"><span>Distance au sonar (m)</span><input type="number" id="s-d" min="1" max="' + cfg.portee + '" step="1" value="' + ob.d + '"></label>'
        + '<label class="champ"><span>Vitesse (m/s)</span><input type="number" id="s-v" min="0" step="1" value="' + ob.v + '"></label>'
        + (ob.v > 0 ? '<div class="mouvements" id="s-m">' + Object.keys(MOUVEMENTS).map(m =>
          '<button data-m="' + m + '" aria-pressed="' + (ob.m === m) + '">' + MOUVEMENTS[m] + '</button>').join('') + '</div>' : '')
        + '<p class="aide">L\'obstacle se met en mouvement quand le sonar reçoit son premier écho.</p>'
        + '<button class="btn btn-mini btn-danger" id="s-suppr">Supprimer cet obstacle</button>';
      $('s-d').addEventListener('change', e => { majObs(sel, { d: Math.round(nb(e.target.value, ob.d, 1, cfg.portee)) }); majSel(); });
      $('s-v').addEventListener('change', e => { majObs(sel, { v: nb(e.target.value, 0, 0, 100000) }); majSel(); });
      if ($('s-m')) $('s-m').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { majObs(sel, { m: b.dataset.m }); majSel(); } });
      $('s-suppr').addEventListener('click', () => { cfg.obstacles.splice(sel, 1); sel = null; appliquer(); majSel(); });
    } else {
      const n = cfg.obstacles.length;
      z.innerHTML = '<p class="aide">Clique sur un obstacle ou sur le sonar pour régler sa distance ou sa vitesse. '
        + (n ? n + ' obstacle' + (n > 1 ? 's' : '') + ' placé' + (n > 1 ? 's' : '') + '.' : 'Aucun obstacle placé.') + '</p>';
    }
  }

  function basculerAdmin(b) {
    admin = b;
    $('b-admin').setAttribute('aria-pressed', admin);
    // en mode admin, le panneau de réglages remplace le graphique et l'historique
    $('p-admin').hidden = !admin; $('p-histo').hidden = admin; $('p-graphe').hidden = admin; $('badge-admin').hidden = !admin;
    document.querySelector('.scene').classList.toggle('admin', admin);
    if (!admin) sel = null;
    majSel();
  }

  let minuteur;
  function toast(txt) { const t = $('toast'); t.textContent = txt; t.classList.add('vu'); clearTimeout(minuteur); minuteur = setTimeout(() => t.classList.remove('vu'), 2200); }

  // ---------- Scénarios : 5 emplacements ----------
  // Les élèves voient les scénarios publiés avec l'appli (js/scenarios.js).
  // Sur le PC du professeur, les emplacements enregistrés dans le navigateur les remplacent,
  // tant que les scénarios publiés n'ont pas changé depuis (sinon la version publiée, plus récente, reprend la main).
  const CLE_EMPL = 'sonar-echo-emplacements', NB_EMPL = 5;
  const propre = s => s && typeof s.c === 'string' ? { nom: String(s.nom || '').slice(0, 40), c: s.c } : null;
  const parDefaut = i => 'Scénario ' + (i + 1);
  function publies() {
    const l = typeof SCENARIOS !== 'undefined' && Array.isArray(SCENARIOS) ? SCENARIOS : [];
    return Array.from({ length: NB_EMPL }, (_, i) => propre(l[i]));
  }
  function emplacements() {
    const lu = U.lire(CLE_EMPL);
    return lu && Array.isArray(lu.l) && lu.base === JSON.stringify(publies())
      ? Array.from({ length: NB_EMPL }, (_, i) => propre(lu.l[i])) : publies();
  }
  function ecrireEmpl(l) { U.ecrire(CLE_EMPL, { base: JSON.stringify(publies()), l }); majScenarios(); }

  function resume(s) {
    try { const c = valide(decompacter(s.c)); return (c.milieu === 'eau' ? 'Eau' : 'Air') + ' · portée ' + U.fmtM(c.portee); }
    catch (e) { return ''; }
  }

  function nomScen(i) { const s = emplacements()[i]; return (s && s.nom) || parDefaut(i); }

  // Passe dans un mode (null = libre, sinon indice du scénario) ; la session repart de zéro
  function changerMode(i, message = true) {
    let c;
    if (i === null) c = chargerLibre();
    else if (!(c = lireScenario(i))) { toast('Scénario illisible'); return; }
    cfg = c; scen = i; U.ecrire(CLE_MODE, i); sel = null;
    appliquer(false); majSel(); majAdmin(); majScenarios();
    $('sc-voile').hidden = true;
    if (message) toast(i === null ? 'Mode libre' : '« ' + nomScen(i) + ' » chargé');
  }

  // Roue dentée : en mode libre pour tous, dans un scénario seulement en mode professeur
  function majAdmin() {
    const roue = prof || scen === null;
    $('b-admin').hidden = !roue;
    if (!roue && admin) basculerAdmin(false);
    $('a-prof').hidden = !prof; $('i-prof').hidden = !prof;
  }

  function enregistrerEmpl(i) {
    const l = emplacements(), saisi = $('e-nom' + i).value.trim();
    if (l[i] && !confirm('Remplacer « ' + (l[i].nom || parDefaut(i)) + ' » par les réglages actuels ?')) return;
    l[i] = { nom: saisi || parDefaut(i), c: compacter(cfg) }; ecrireEmpl(l);
    scen = i; U.ecrire(CLE_MODE, i); majEntete(); majScenarios();
    toast('Enregistré dans l\'emplacement ' + (i + 1));
  }

  function majScenarios() {
    const l = emplacements(), esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    $('a-empl').innerHTML = l.map((s, i) =>
      '<div class="empl' + (i === scen ? ' courant' : '') + '"><span class="empl-n">' + (i + 1) + '</span>'
      + '<input type="text" class="empl-nom" id="e-nom' + i + '" maxlength="40" placeholder="Emplacement libre" value="' + (s ? esc(s.nom) : '') + '">'
      + '<button class="btn btn-mini" data-enr="' + i + '">Enregistrer</button>'
      + '<button class="btn btn-mini" data-ch="' + i + '"' + (s ? '' : ' disabled') + '>Charger</button>'
      + '<button class="btn btn-mini btn-icone-mini btn-danger" data-vid="' + i + '" title="Vider cet emplacement" aria-label="Vider l\'emplacement ' + (i + 1) + '"' + (s ? '' : ' disabled') + '>×</button>'
      + '</div>').join('');
    $('sc-liste').innerHTML =
      '<button class="sc-choix' + (scen === null ? ' actif' : '') + '" data-i="libre"><span class="sc-num sc-libre">∞</span><span><span class="sc-nom">Mode libre</span><span class="sc-info">Règle toi-même le sonar avec la roue dentée</span></span></button>'
      + l.map((s, i) => s
        ? '<button class="sc-choix' + (i === scen ? ' actif' : '') + '" data-i="' + i + '"><span class="sc-num">' + (i + 1) + '</span><span><span class="sc-nom">' + esc(s.nom || parDefaut(i)) + '</span><span class="sc-info">' + resume(s) + '</span></span></button>'
        : '').join('');
  }

  function exporter() {
    const data = JSON.stringify({ appli: 'Sonar et écho', emplacements: emplacements() }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = 'sonar-scenarios.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    toast('Fichier sonar-scenarios.json créé (Téléchargements)');
  }

  // ---------- QR code de l'appli ----------
  function afficherQR() {
    const url = location.href.split('#')[0] + '#sonar', cv = $('qr'), ctx = cv.getContext('2d');
    const qr = qrcode(0, 'M'); qr.addData(url); qr.make();
    const n = qr.getModuleCount(), marge = 4, cote = Math.min(560, Math.floor(Math.min(innerWidth, innerHeight) * 0.62));
    const t = Math.max(2, Math.floor(cote / (n + 2 * marge))), px = t * (n + 2 * marge);
    cv.width = px; cv.height = px; cv.style.width = cv.style.height = px + 'px';
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, px, px); ctx.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect((c + marge) * t, (r + marge) * t, t, t);
    $('qr-url').textContent = url;
    $('qr-alerte').hidden = /^https?:/.test(location.protocol);
    $('qr-voile').hidden = false;
  }

  // ---------- Son ----------
  function ping(f, duree, vol) {
    if (!son) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = 'sine'; osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(vol, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
      osc.connect(gain).connect(audio.destination); osc.start(t); osc.stop(t + duree + 0.05);
    } catch (e) { /* pas de son disponible */ }
  }
  const ICONE_SON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  const ICONE_MUET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>';
  function majSon() { $('b-son').innerHTML = son ? ICONE_SON : ICONE_MUET; $('b-son').title = son ? 'Couper le son' : 'Activer le son'; }

  // ---------- Actions ----------
  function emettre() {
    Sim.emettre();
    flashE = performance.now();
    ping(cfg.milieu === 'eau' ? 1300 : 1900, cfg.milieu === 'eau' ? 0.7 : 0.25, 0.3);
    majHisto(); majBoutons();
  }

  function brancher() {
    $('b-emettre').addEventListener('click', emettre);
    $('ident-btns').addEventListener('click', e => { const b = e.target.closest('.ident-btn'); if (b) ouvrirIdent(+b.dataset.k); });
    $('id-valider').addEventListener('click', valider);
    $('id-val').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); valider(); } });
    $('id-val').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9.,-]/g, ''); });
    $('id-fermer').addEventListener('click', fermerIdent);
    $('id-voile').addEventListener('click', e => { if (e.target === $('id-voile')) fermerIdent(); });
    $('b-reset').addEventListener('click', () => { Sim.reinit(); vue = null; zoom = false; majHisto(); majBoutons(); });
    $('b-admin').addEventListener('click', () => basculerAdmin(!admin));
    $('a-fermer').addEventListener('click', () => basculerAdmin(false));
    $('b-son').addEventListener('click', () => { son = !son; majSon(); });
    $('b-zoom').addEventListener('click', () => { zoom = !zoom; majBoutons(); });
    $('histo').addEventListener('click', e => {
      const b = e.target.closest('.ligne'); if (!b) return;
      const i = +b.dataset.i; vue = vue === i ? null : i;   // un 2e clic remet toutes les émissions au même plan
      majHisto();
    });
    document.querySelectorAll('#a-milieu button').forEach(b => b.addEventListener('click', () => { cfg.milieu = b.dataset.m; appliquer(); }));
    $('a-portee').addEventListener('change', e => {
      cfg.portee = Math.round(nb(e.target.value, cfg.portee, 10, 100000));
      cfg.obstacles.forEach(o => { o.d = Math.min(o.d, cfg.portee); });
      appliquer(); majSel();
    });
    $('a-angle').addEventListener('change', e => { cfg.angle = nb(e.target.value, cfg.angle, 10, 180); appliquer(); });
    $('a-grad').addEventListener('change', e => { cfg.grad = e.target.checked; sauver(); });
    $('a-duree').addEventListener('change', e => { cfg.duree = e.target.checked; sauver(); majHisto(); });
    $('a-vider').addEventListener('click', () => {
      if (!cfg.obstacles.length || !confirm('Supprimer tous les obstacles ?')) return;
      cfg.obstacles = []; sel = null; appliquer(); majSel();
    });
    $('a-qr').addEventListener('click', afficherQR);
    $('b-scen').addEventListener('click', () => { majScenarios(); $('sc-voile').hidden = false; });
    $('sc-fermer').addEventListener('click', () => { $('sc-voile').hidden = true; });
    $('sc-voile').addEventListener('click', e => {
      if (e.target === $('sc-voile')) { $('sc-voile').hidden = true; return; }
      const b = e.target.closest('.sc-choix'); if (b) changerMode(b.dataset.i === 'libre' ? null : +b.dataset.i);
    });
    $('a-empl').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.enr !== undefined) enregistrerEmpl(+b.dataset.enr);
      if (b.dataset.ch !== undefined) changerMode(+b.dataset.ch);
      if (b.dataset.vid !== undefined) {
        const i = +b.dataset.vid, l = emplacements();
        if (l[i] && confirm('Vider l\'emplacement ' + (i + 1) + ' (« ' + (l[i].nom || parDefaut(i)) + ' ») ?')) {
          l[i] = null; ecrireEmpl(l);
          if (scen === i) { scen = null; U.ecrire(CLE_MODE, null); sauver(); majEntete(); majScenarios(); }
        }
      }
    });
    // renommer un emplacement déjà rempli
    $('a-empl').addEventListener('change', e => {
      if (!e.target.classList.contains('empl-nom')) return;
      const i = +e.target.id.slice(5), l = emplacements();
      if (l[i]) { l[i].nom = e.target.value.trim() || parDefaut(i); ecrireEmpl(l); majEntete(); }
    });
    // mode professeur : 5 clics rapides sur le titre (souris ou doigt), autant pour en sortir
    let clics = 0, dernier = 0;
    $('titre').addEventListener('click', () => {
      const t = performance.now(); clics = t - dernier < 700 ? clics + 1 : 1; dernier = t;
      if (clics < 5) return;
      clics = 0; prof = !prof;
      try { sessionStorage.setItem('sonar-echo-prof', prof ? '1' : ''); } catch (e) { /* stockage indisponible */ }
      majAdmin(); toast(prof ? 'Mode professeur activé' : 'Mode professeur désactivé');
    });
    $('a-exporter').addEventListener('click', exporter);
    $('qr-fermer').addEventListener('click', () => { $('qr-voile').hidden = true; });
    $('qr-voile').addEventListener('click', e => { if (e.target === $('qr-voile')) $('qr-voile').hidden = true; });
    document.addEventListener('keydown', e => {
      if (!ecranSonar.classList.contains('active') || e.target.closest('input')) return;
      if (!$('id-voile').hidden) { if (e.key === 'Escape') fermerIdent(); return; }
      if (e.code === 'Space') { e.preventDefault(); emettre(); }
      if (e.key === 'Escape') {
        if (!$('qr-voile').hidden) $('qr-voile').hidden = true;
        else if (!$('sc-voile').hidden) $('sc-voile').hidden = true;
        else if (admin) basculerAdmin(false);
      }
    });
  }

  // ---------- Identification des obstacles ----------
  // Une bande de boutons « Obstacle A, B… » ouvre une fenêtre où l'élève écrit le résultat de son calcul (fait hors appli) :
  //  - sonar fixe et obstacle immobile ou sur l'arc (sa distance ne change pas) : sa distance ;
  //  - sonar ou obstacle qui s'approche / s'éloigne : sa vitesse d'approche (valeur absolue), jamais les deux.
  // Vitesses acceptées (à 5 % près) : celle que l'élève obtient avec les données de l'appli (deux échos du même obstacle,
  // distances déduites des retards v × retard / 2, durée du déplacement donnée par l'historique), et la vraie vitesse
  // d'approche au moment où l'onde touche l'obstacle. Les deux diffèrent un peu quand le sonar bouge (il avance
  // pendant le retour de l'onde) : un élève qui raisonne juste n'est jamais refusé.
  const TOL_DIST = 0.02, TOL_VIT = 0.05;   // marges d'erreur acceptées (arrondis des temps lus)
  let identK = null;
  const quoiChercher = k => {
    const ob = cfg.obstacles[k];
    return cfg.origine.v > 0 || (ob.v > 0 && (ob.m === 'p' || ob.m === 'e')) ? 'vitesse' : 'distance';
  };
  function echosDe(k) {
    const l = [];
    for (const e of Sim.emissions()) for (const r of e.recus) if (r.k === k) l.push(r);
    return l.sort((a, b) => a.tr - b.tr);
  }
  function majIdent() {
    const n = cfg.obstacles.length;
    $('ident').hidden = !n;
    $('ident-btns').innerHTML = cfg.obstacles.map((ob, k) => '<button class="btn btn-mini ident-btn' + (trouves[k] ? ' ok' : '')
      + '" data-k="' + k + '">Obstacle ' + U.lettre(k) + (trouves[k] ? ' ✓' : '') + '</button>').join('');
  }
  function ouvrirIdent(k) {
    identK = k;
    const L = U.lettre(k), q = quoiChercher(k);
    $('id-titre').textContent = 'Identifier l\'obstacle ' + L;
    $('id-consigne').textContent = q === 'distance'
      ? 'Calcule la distance entre le sonar et l\'obstacle ' + L + ', puis écris-la ici.'
      : 'Calcule la vitesse à laquelle l\'obstacle ' + L + ' se rapproche ou s\'éloigne du sonar, puis écris-la ici.';
    $('id-label').textContent = q === 'distance' ? 'Distance (m)' : 'Vitesse (m/s)';
    $('id-val').value = ''; $('id-res').hidden = true;
    $('id-voile').hidden = false;
    setTimeout(() => $('id-val').focus(), 50);
  }
  function fermerIdent() { $('id-voile').hidden = true; identK = null; }
  function resultat(txt, type, kind) {
    const r = $('id-res');
    r.textContent = txt; r.className = 'id-res id-res--' + type; r.dataset.type = kind; r.hidden = false;
  }
  function valider() {
    const k = identK, L = U.lettre(k), q = quoiChercher(k), x = parseFloat($('id-val').value.replace(',', '.').replace(/\s/g, ''));
    if (!Number.isFinite(x)) { resultat('Écris un nombre (chiffres et virgule).', 'info', q); return; }
    const echos = echosDe(k), proche = (val, tol) => Math.abs(Math.abs(x) - val) <= Math.max(tol * val, q === 'distance' ? 0.5 : 0.05);
    let ok;
    if (q === 'distance') {
      if (!echos.length) { resultat('Émets d\'abord : le sonar doit recevoir l\'écho de l\'obstacle ' + L + '.', 'info', q); return; }
      ok = proche(cfg.obstacles[k].d, TOL_DIST);
    } else {
      if (echos.length < 2) { resultat('Il faut au moins deux échos de l\'obstacle ' + L + ' pour calculer sa vitesse.', 'info', q); return; }
      const v = Sim.v(), cands = [];
      for (let i = 0; i < echos.length; i++) for (let j = i + 1; j < echos.length; j++) {
        const dt = Sim.dureeDeplacement(k, echos[i], echos[j]);
        if (dt > 1e-6) cands.push(v * Math.abs(echos[j].delai - echos[i].delai) / 2 / dt);
      }
      // vraie vitesse d'approche : variation de la distance sonar-obstacle autour de chaque contact
      const D = t => { const o = Sim.posObs(k, t), s = Sim.posOrig(t); return Math.hypot(o.x - s.x, o.y - s.y); };
      for (const r of echos) cands.push(Math.abs(D(r.th + 0.01) - D(r.th - 0.01)) / 0.02);
      ok = cands.filter(c => c > 0.5).some(c => proche(c, TOL_VIT));   // 0 : avant le départ, rien à comparer
    }
    if (ok) {
      trouves[k] = true; majIdent();
      resultat('Bravo ! C\'est la bonne ' + q + ' pour l\'obstacle ' + L + '.', 'ok', q);
      confettis();
    } else resultat('Ce n\'est pas la bonne valeur : vérifie ton calcul.', 'faux', q);
  }

  // Confettis aux couleurs du milieu (comme dans les autres modules)
  function confettis() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas'), x = cv.getContext('2d'), W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    cv.className = 'sonar-confettis'; cv.width = W * dpr; cv.height = H * dpr; x.scale(dpr, dpr);
    ecranSonar.appendChild(cv);
    const coul = COULEURS_EMISSIONS[cfg.milieu], p = Array.from({ length: 110 }, (_, i) => ({
      x: W / 2 + (Math.random() - .5) * 160, y: H * .35, vx: (Math.random() - .5) * 11, vy: -Math.random() * 9 - 2,
      s: Math.random() * 6 + 5, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, c: coul[i % coul.length] }));
    const t0 = performance.now();
    (function image(now) {
      const age = now - t0;
      x.clearRect(0, 0, W, H); x.globalAlpha = Math.max(0, Math.min(1, (2600 - age) / 600));
      for (const q of p) {
        q.vy += .2; q.vx *= .99; q.x += q.vx; q.y += q.vy; q.r += q.vr;
        x.save(); x.translate(q.x, q.y); x.rotate(q.r); x.fillStyle = q.c; x.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); x.restore();
      }
      if (age < 2600) requestAnimationFrame(image); else cv.remove();
    })(t0);
  }

  // ---------- Boucle (seulement quand l'écran est affiché) ----------
  let avant = performance.now(), tourne = false;
  function boucle(now) {
    if (!tourne) return;
    const dt = Math.min(0.1, Math.max(0, (now - avant) / 1000)); avant = now;
    for (const ev of Sim.avancer(dt)) {
      if (ev.type === 'echo') { flashR = now; ping(cfg.milieu === 'eau' ? 1300 : 1900, 0.35, 0.12); majHisto(); majBoutons(); }
      if (ev.type === 'fin') { majHisto(); majBoutons(); }
    }
    // chronomètre : temps écoulé depuis la dernière émission, arrêté à la fin de son écoute
    const ems = Sim.emissions(), win = Sim.win(), T = Sim.T(), der = ems[ems.length - 1];
    const tc = der ? Math.min(T - der.te, win) : 0;
    $('chrono').textContent = U.fmtT(tc, win);
    $('prog').style.width = (der ? tc / win * 100 : 0) + '%';

    Sonar.dessiner({ cfg, admin, sel, now, flashE, flashR });
    Graphe.dessiner({ ems, T, win, zoom, milieu: cfg.milieu, focus: vue });
    requestAnimationFrame(boucle);
  }
  function start() {
    if (tourne) return;
    tourne = true;
    requestAnimationFrame(t => { avant = t; boucle(t); });
  }
  function stop() { tourne = false; }

  function demarrer() {
    try { prof = sessionStorage.getItem('sonar-echo-prof') === '1'; } catch (e) { /* stockage indisponible */ }
    // mode libre par défaut ; on rouvre le scénario de la dernière visite s'il existe encore
    const m = U.lire(CLE_MODE);
    scen = !/^#[cs]=/.test(location.hash) && Number.isInteger(m) && lireScenario(m) ? m : null;
    cfg = scen === null ? chargerLibre() : lireScenario(scen);
    Sonar.init($('c-sonar')); Graphe.init($('c-graphe'));
    brancher(); majSon();
    Sim.charger(cfg); majEntete(); majHisto(); majBoutons(); majSel(); majScenarios(); majAdmin(); majIdent();
  }

  return { demarrer, start, stop, etatAdmin, selectionner, ajouter, majObs, majOrig, sauver: () => sauver() };
})();

SonarApp.demarrer();
