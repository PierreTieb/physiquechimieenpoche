# Recopie les 4 petites applis dans « Physique Chimie en poche » (dossier apps/)
# et ajoute dans chacune le lien de retour vers la page principale.
# À lancer quand une petite appli est validée : double-clic sur « Mettre à jour les applis.bat ».
import shutil
from pathlib import Path

ICI = Path(__file__).resolve().parent
VS_CODE = ICI.parent

# dossier d'origine, page d'accueil de l'appli (où placer le lien de retour), classe du lien (style de l'appli)
APPLIS = {
    'chimie':      ('Les Bases de la chimie', '#screen-home', 'btn-back'),
    'conversions': ('Conversion training', '#screen-level-select .home-inner', 'btn-text home-back'),
    'ondes':       ('Les Ondes Sonores', '#screen-home', 'btn-back'),
    'electricite': ('Electricité', '#screen-home', 'btn-back'),
}
IGNORER = shutil.ignore_patterns('.git', '.github', '.claude', '.vscode', '__pycache__', '*.md', '*.py', '*.bat', 'Thumbs.db', '.DS_Store')


def copier(nom, source, accueil, classe):
    src, dst = VS_CODE / source, ICI / 'apps' / nom
    if not (src / 'index.html').exists():
        print('  !! introuvable :', src)
        return False
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=IGNORER)
    page = dst / 'index.html'
    html = page.read_text(encoding='utf-8')
    lien = '<script src="../../portail/retour.js" data-home="%s" data-class="%s"></script>\n' % (accueil, classe)
    i = html.lower().rfind('</body>')
    html = html[:i] + lien + html[i:] if i >= 0 else html + lien
    page.write_text(html, encoding='utf-8', newline='\n')
    n = sum(1 for f in dst.rglob('*') if f.is_file())
    print('  ok   %-12s <- %s (%d fichiers)' % (nom, source, n))
    return True


if __name__ == '__main__':
    print('Mise à jour de Physique Chimie en poche')
    ok = all([copier(nom, *v) for nom, v in APPLIS.items()])
    print('Terminé.' if ok else 'Terminé avec des erreurs (voir ci-dessus).')
