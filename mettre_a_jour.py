# Recopie les petites applis dans « Physique Chimie en poche » (dossier apps/)
# et ajoute dans chacune le lien de retour vers la page principale.
# À lancer quand une petite appli est validée : double-clic sur « Mettre à jour les applis.bat ».
# Pour n'en recopier que certaines : python mettre_a_jour.py chimie ondes
import re
import time
import shutil
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
VS_CODE = ICI.parent

# dossier d'origine, page d'accueil de l'appli (où placer le lien de retour), classe du lien (police de l'appli),
# couleurs du lien par-dessus la pastille en verre dépoli de portail/retour.js
APPLIS = {
    'chimie':      ('Les Bases de la chimie', '#screen-home', 'btn-back', ''),
    'conversions': ('Conversion training', '#screen-home .home-inner', 'btn-text home-back', ''),
    'ondes':       ('Les Ondes Sonores', '#screen-home', 'btn-back',
                    'color:#FFE2C2;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);'
                    'box-shadow:0 4px 14px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.18)'),
    'electricite': ('Electricité', '#screen-home', 'btn-back', ''),
    'questions':   ('Questions', '#start .start-in', '', 'color:#24502E'),
    'realite':     ('Réalité augmentée', '#screen-home .home-top', '',
                    'color:#fff;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22);'
                    'box-shadow:0 4px 14px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.18)'),
}
# '*.mid' : morceaux MIDI d'origine des Ondes Sonores, déjà transcrits dans songs.js
IGNORER = shutil.ignore_patterns('.git', '.github', '.claude', '.vscode', '__pycache__', '*.md', '*.py', '*.bat', '*.mid', 'Thumbs.db', '.DS_Store')

# Trophées : portail/trophees.js (commun) et portail/trophees/<nom>.js (observateur de l'appli) sont ajoutés aux copies
# seulement. Par défaut en fin de page ; pour l'Électricité, juste après js/lab.js, pour suivre les labos dès leur création.
TROPHEES_APRES = {'electricite': 'js/lab.js'}
# Ce que chaque observateur surveille dans l'appli d'origine : si un de ces textes disparaît (appli modifiée),
# le trophée correspondant ne pourra plus être gagné et le script le signale.
SURVEILLE = {
    'chimie': ['ch-pass', 'ch-run', 'eq-coef', 'chimie-duel-launch', 'ch-res__duel', 'chimie-lessons-done',
               'window.LessonsData', 'window.TempLab', "test: 'flame'", 'flame: {'],
    'conversions': ['duel-launch', 'screen-exercise', 'screen-mixed', 'duel-ico--big', 'screen-challenge'],
    'ondes': ['m-go', 'mu-go', 'mu-inst', 'mu-song', 'mu-spd', 'fq-val', 'screen-music', 'screen-freq'],
    'electricite': ['lab-host', "fire('burn')", "'surtension'", 'relation:', 'names:', 'elec-lessons-done', 'window.LessonsData'],
    'questions': ['id="lvl"', 'Noyau d’atome', 'Atome d’oxygène', 'Voie lactée', "classList.add('strike')", 'c-sun', 'dataset.x', 'OBS=[270,240]'],
    'realite': ["'rx-banner rx-banner--'", 'Transformation équilibrée !'],
}

# Les polices Google sont copiées dans portail/polices/ pour que tout marche sans internet :
# les liens vers fonts.googleapis.com de chaque appli sont remplacés par la copie locale
POLICES = ICI / 'portail' / 'polices' / 'polices.css'
PRECONNECT = re.compile(r'[ \t]*<link rel="preconnect" href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>\s*', re.I)
GOOGLE_FONTS = re.compile(r'<link[^>]*href="https://fonts\.googleapis\.com/css2\?([^"]*)"[^>]*>', re.I)


def polices_locales(html, nom):
    locales = set(re.findall(r"font-family: '([^']+)'", POLICES.read_text(encoding='utf-8')))

    def remplacer(m):
        familles = {f.replace('+', ' ') for f in re.findall(r'family=([^:&]+)', m.group(1))}
        if familles - locales:
            print('  !! %s : polices absentes de portail/polices (gardées en ligne) : %s' % (nom, ', '.join(sorted(familles - locales))))
            return m.group(0)
        return '<link rel="stylesheet" href="../../portail/polices/polices.css">'

    html = GOOGLE_FONTS.sub(remplacer, html)
    return html if 'fonts.googleapis.com/css2' in html else PRECONNECT.sub('', html)


def copier(nom, source, accueil, classe, style):
    src, dst = VS_CODE / source, ICI / 'apps' / nom
    if not (src / 'index.html').exists():
        print('  !! introuvable :', src)
        return False
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=IGNORER)
    page = dst / 'index.html'
    html = polices_locales(page.read_text(encoding='utf-8'), nom)
    # clavier.js : pas de zoom automatique sur iPhone quand on touche une case de texte
    lien = '<script src="../../portail/clavier.js"></script>\n'
    lien += '<script src="../../portail/retour.js" data-home="%s" data-class="%s"%s></script>\n' % (
        accueil, classe, ' data-style="%s"' % style if style else '')
    trophees = '<script src="../../portail/trophees.js" data-app="%s"></script>\n' % nom
    if (ICI / 'portail' / 'trophees' / (nom + '.js')).exists():
        trophees += '<script src="../../portail/trophees/%s.js"></script>\n' % nom
    if nom in TROPHEES_APRES:
        m = re.search(r'<script[^>]*src="%s"[^>]*></script>\n?' % re.escape(TROPHEES_APRES[nom]), html)
        if m:
            html = html[:m.end()] + trophees + html[m.end():]
            trophees = ''
        else:
            print('  !! %s : %s introuvable, trophées ajoutés en fin de page' % (nom, TROPHEES_APRES[nom]))
    lien += trophees
    i = html.lower().rfind('</body>')   # après l'insertion éventuelle des trophées, qui décale la fin de la page
    html = html[:i] + lien + html[i:] if i >= 0 else html + lien
    page.write_text(html, encoding='utf-8', newline='\n')
    n = sum(1 for f in dst.rglob('*') if f.is_file())
    print('  ok   %-12s <- %s (%d fichiers)' % (nom, source, n))
    verifier_trophees(nom, src)
    return True


def verifier_trophees(nom, src):
    textes = ''.join(f.read_text(encoding='utf-8', errors='ignore') for f in src.rglob('*')
                     if f.suffix in ('.js', '.html') and '.git' not in f.parts)
    manquants = [t for t in SURVEILLE.get(nom, []) if t not in textes]
    if manquants:
        print('  !! %s : l\'observateur des trophées (portail/trophees/%s.js) ne trouve plus : %s' % (nom, nom, ' | '.join(manquants)))


# Les téléphones (surtout l'appli installée sur l'écran d'accueil) gardent longtemps les pages en mémoire :
# le lien de la page principale vers chaque appli mise à jour reçoit une date (apps/<nom>/index.html?v=...),
# ce qui oblige le téléphone à recharger la nouvelle version de l'appli.
def dater_liens(noms):
    page = ICI / 'index.html'
    html, v = page.read_text(encoding='utf-8'), time.strftime('%Y%m%d%H%M')
    for nom in noms:
        html = re.sub(r'href="apps/%s/index\.html(\?v=\d+)?"' % re.escape(nom), 'href="apps/%s/index.html?v=%s"' % (nom, v), html)
    page.write_text(html, encoding='utf-8', newline='\n')


if __name__ == '__main__':
    print('Mise à jour de Physique Chimie en poche')
    noms = sys.argv[1:] or list(APPLIS)
    inconnus = [n for n in noms if n not in APPLIS]
    if inconnus:
        print('  !! applis inconnues :', ', '.join(inconnus), '(choix :', ', '.join(APPLIS) + ')')
    ok = not inconnus and all([copier(nom, *APPLIS[nom]) for nom in noms])
    if not inconnus:
        dater_liens(noms)
    print('Terminé.' if ok else 'Terminé avec des erreurs (voir ci-dessus).')
