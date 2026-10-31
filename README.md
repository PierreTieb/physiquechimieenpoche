# Physique Chimie en Poche

Les applis de physique-chimie du collège réunies dans une seule appli web :
Les Bases de la Chimie, Entraînement aux conversions, Les Ondes Sonores et L'électricité (modules de cours),
puis Questions Scientifiques et Réalité augmentée (modules supplémentaires).

Les modules supplémentaires restent toujours **sous** les modules de cours, regroupés sous le petit texte
« Des applications supplémentaires pour les curieux ». Une nouvelle appli s'ajoute dans la bonne liste de `index.html`,
et dans `APPLIS` de `mettre_a_jour.py`.

## Organisation

- `index.html` et `portail/` : la page principale (encadrés illustrés des applis, fond de motifs pastel, lien de retour).
  `portail/encadre-questions.svg` : fond de « ? » de l'encadré Questions Scientifiques.
  `portail/encadre-realite.svg` : tableau noir et figures à la craie de l'encadré Réalité augmentée.
- `manifest.webmanifest` et `portail/icone-*.png` : nom et icône de l'appli quand elle est ajoutée à l'écran d'accueil du téléphone.
- `apps/` : une copie de chaque appli. **Ne pas modifier ces fichiers à la main** : ils sont remplacés à chaque mise à jour.

## Trophées

Des accomplissements à débloquer en explorant toutes les applis, **uniquement dans Physique Chimie en poche**
(les applis d'origine ne contiennent aucun code de trophée). Bouton carré en haut à droite de la page principale.

- `portail/trophees.js` : la liste des trophées (titre, description, métal ; `secret: true` = « ??? »), la mémoire du téléphone,
  la notification de 3 s avec des confettis du métal, et les trophées tirés de ce qui est déjà enregistré (médailles, leçons, applis ouvertes).
  Le tri se fait tout seul : bronze, argent, or, platine, et dans chaque métal les trophées secrets en dernier.
- `portail/trophees/<appli>.js` : l'observateur de chaque appli, qui regarde ce qui se passe à l'écran et débloque les trophées.
- `portail/trophees-page.js` : le bouton et la liste sur la page principale.
- `mettre_a_jour.py` ajoute ces scripts dans chaque copie et vérifie que ce que chaque observateur surveille existe encore
  dans l'appli d'origine (liste `SURVEILLE`) : si une appli change, le script signale le trophée qui ne pourra plus être gagné.

## Mettre à jour après avoir validé une petite appli

1. Faire et tester les changements dans le dossier de la petite appli (par exemple `Electricité`).
2. Double-cliquer sur `Mettre à jour les applis.bat` : toutes les applis sont recopiées dans `apps/`
   (ou seulement certaines : `python mettre_a_jour.py chimie ondes`), avec le lien « ← Choix d'application » ajouté en haut de leur page d'accueil.
3. Vérifier en ouvrant `index.html`, puis envoyer sur GitHub (commit + push).
