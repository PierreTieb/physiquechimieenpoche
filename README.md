# Physique Chimie en Poche

Les applis de physique-chimie du collège réunies dans une seule appli web :
Les Bases de la Chimie, Entraînement aux conversions, Les Ondes Sonores et L'électricité.

## Organisation

- `index.html` et `portail/` : la page principale (encadrés illustrés des applis, fond de motifs pastel, lien de retour).
- `manifest.webmanifest` et `portail/icone-*.png` : nom et icône de l'appli quand elle est ajoutée à l'écran d'accueil du téléphone.
- `apps/` : une copie de chaque appli. **Ne pas modifier ces fichiers à la main** : ils sont remplacés à chaque mise à jour.

## Mettre à jour après avoir validé une petite appli

1. Faire et tester les changements dans le dossier de la petite appli (par exemple `Electricité`).
2. Double-cliquer sur `Mettre à jour les applis.bat` : les 4 applis sont recopiées dans `apps/`,
   avec le lien « ← Choix d'application » ajouté en haut de leur page d'accueil.
3. Vérifier en ouvrant `index.html`, puis envoyer sur GitHub (commit + push).
