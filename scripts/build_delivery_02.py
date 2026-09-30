"""Empacota somente fontes e documentação versionadas da segunda entrega."""
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "Onde-Foi-Meu-Dinheiro-Entrega-02.zip"
paths = subprocess.check_output(
    ["git", "ls-files", "-z", "--", "mobile", "docs", ".gitignore",
     "scripts/build_delivery_02.py"], cwd=ROOT
).decode("utf-8").split("\0")
OUTPUT.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as archive:
    archive.writestr("Onde-Foi-Meu-Dinheiro-Entrega-02/LEIA-ME.txt",
        "Segunda entrega — Onde Foi Meu Dinheiro\n"
        "Extraia este ZIP. Leia mobile/README.md para instalar e executar.\n"
        "Checklist: docs/ENTREGA-02.md. Testes: docs/TESTES-ENTREGA-02.md.\n"
        "Validacao em aparelho fisico pelo grupo permanece pendente.\n"
        "Repositorio: https://github.com/JonathanSM-dev/onde-foi-meu-dinheiro\n")
    for name in sorted(p for p in paths if p and (ROOT / p).is_file()):
        archive.write(ROOT / name, "Onde-Foi-Meu-Dinheiro-Entrega-02/" + name)
with zipfile.ZipFile(OUTPUT) as archive:
    assert archive.testzip() is None
    assert any(n.endswith("mobile/package-lock.json") for n in archive.namelist())
    assert not any("/node_modules/" in n or "/.env" in n for n in archive.namelist())
    print(f"{OUTPUT.name}: {len(archive.namelist())} arquivos; ZIP verificado.")
