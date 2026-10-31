// Ajouté par mettre_a_jour.py dans chaque appli : pas de zoom automatique quand le clavier s'ouvre.
// Sur iPhone et iPad, Safari zoome tout seul dès qu'on touche une case de texte écrite en moins de 16 px.
// maximum-scale=1 l'en empêche, et sur ces appareils l'élève peut toujours zoomer lui-même avec deux doigts.
// Rien n'est changé ailleurs : sur Android, ce réglage bloquerait le zoom à deux doigts (et Android ne zoome pas tout seul).
(function () {
  var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var m = document.querySelector('meta[name="viewport"]');
  if (!ios || !m || /maximum-scale/.test(m.content)) return;
  m.content += ', maximum-scale=1';
})();
