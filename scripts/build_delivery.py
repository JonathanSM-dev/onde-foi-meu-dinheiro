"""Gera o HTML portátil e o ZIP da primeira entrega usando somente Python padrão."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
html = (ROOT / 'prototipo/index.html').read_text(encoding='utf-8')
css = (ROOT / 'prototipo/styles.css').read_text(encoding='utf-8')
model = (ROOT / 'prototipo/model.js').read_text(encoding='utf-8')
app = (ROOT / 'prototipo/app.js').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
refinements = (ROOT / 'prototipo/refinements.css').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="refinements.css">', f'<style>{refinements}</style>')
html = html.replace('<script src="model.js"></script><script src="app.js"></script>', f'<script>{model}</script><script>{app}</script>')
portable = OUT / 'Onde-Foi-Meu-Dinheiro-Prototipo.html'
portable.write_text(html, encoding='utf-8')
archive = OUT / 'Onde-Foi-Meu-Dinheiro-Entrega-01.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    bundle.write(portable, portable.relative_to(ROOT).as_posix())
    for path in [ROOT/'README.md', *sorted((ROOT/'docs').glob('*.md')), *sorted((ROOT/'prototipo').glob('*')), *sorted((ROOT/'docs').glob('*.json')), ROOT/'scripts/build_delivery.py', ROOT/'scripts/build_pdf.py', ROOT/'output/pdf/Onde-Foi-Meu-Dinheiro-Entrega-01.pdf']:
        if path.is_file():
            bundle.write(path, path.relative_to(ROOT).as_posix())
print(f'HTML: {portable.name} ({portable.stat().st_size} bytes)')
print(f'ZIP: {archive.name} ({archive.stat().st_size} bytes)')
with ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    print(f'Integridade do ZIP: OK; {len(bundle.namelist())} arquivos')
