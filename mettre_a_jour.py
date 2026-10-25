# Recopie les petites applis dans « Physique Chimie en poche » (dossier apps/)
# et ajoute dans chacune le lien de retour vers la page principale.
# À lancer quand une petite appli est validée : double-clic sur « Mettre à jour les applis.bat ».
# Pour n'en recopier que certaines : python mettre_a_jour.py chimie ondes
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
}
# '*.mid' : morceaux MIDI d'origine des Ondes Sonores, déjà transcrits dans songs.js
IGNORER = shutil.ignore_patterns('.git', '.github', '.claude', '.vscode', '__pycache__', '*.md', '*.py', '*.bat', '*.mid', 'Thumbs.db', '.DS_Store')


def copier(nom, source, accueil, classe, style):
    src, dst = VS_CODE / source, ICI / 'apps' / nom
    if not (src / 'index.html').exists():
        print('  !! introuvable :', src)
        return False
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=IGNORER)
    page = dst / 'index.html'
    html = page.read_text(encoding='utf-8')
    lien = '<script src="../../portail/retour.js" data-home="%s" data-class="%s"%s></script>\n' % (
        accueil, classe, ' data-style="%s"' % style if style else '')
    i = html.lower().rfind('</body>')
    html = html[:i] + lien + html[i:] if i >= 0 else html + lien
    page.write_text(html, encoding='utf-8', newline='\n')
    n = sum(1 for f in dst.rglob('*') if f.is_file())
    print('  ok   %-12s <- %s (%d fichiers)' % (nom, source, n))
    return True


if __name__ == '__main__':
    print('Mise à jour de Physique Chimie en poche')
    noms = sys.argv[1:] or list(APPLIS)
    inconnus = [n for n in noms if n not in APPLIS]
    if inconnus:
        print('  !! applis inconnues :', ', '.join(inconnus), '(choix :', ', '.join(APPLIS) + ')')
    ok = not inconnus and all([copier(nom, *APPLIS[nom]) for nom in noms])
    print('Terminé.' if ok else 'Terminé avec des erreurs (voir ci-dessus).')
