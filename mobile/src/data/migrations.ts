import type { SqlAdapter } from "./adapter";
export async function migrate(db: SqlAdapter) {
  await db.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;");
  const version = await db.all<{ user_version: number }>("PRAGMA user_version");
  if (version[0].user_version > 1)
    throw Error("Banco criado por uma versão mais nova do aplicativo.");
  await db.exec(`BEGIN IMMEDIATE;
 CREATE TABLE IF NOT EXISTS categorias(id TEXT NOT NULL, usuarioId TEXT NOT NULL, nome TEXT NOT NULL, tipo TEXT NOT NULL CHECK(tipo IN ('receita','despesa')), PRIMARY KEY(usuarioId,id));
 CREATE TABLE IF NOT EXISTS lancamentos(id TEXT PRIMARY KEY, usuarioId TEXT NOT NULL, categoriaId TEXT NOT NULL, payload TEXT NOT NULL, excluidoEm TEXT, recurrenceKey TEXT, UNIQUE(usuarioId,recurrenceKey), FOREIGN KEY(usuarioId,categoriaId) REFERENCES categorias(usuarioId,id));
 CREATE TABLE IF NOT EXISTS orcamentos(id TEXT PRIMARY KEY, usuarioId TEXT NOT NULL, categoriaId TEXT NOT NULL, mes TEXT NOT NULL, payload TEXT NOT NULL, excluidoEm TEXT, UNIQUE(usuarioId,categoriaId,mes), FOREIGN KEY(usuarioId,categoriaId) REFERENCES categorias(usuarioId,id));
 CREATE TABLE IF NOT EXISTS recorrencias(id TEXT PRIMARY KEY, usuarioId TEXT NOT NULL, categoriaId TEXT NOT NULL, payload TEXT NOT NULL, excluidoEm TEXT, FOREIGN KEY(usuarioId,categoriaId) REFERENCES categorias(usuarioId,id));
 CREATE INDEX IF NOT EXISTS lancamentos_usuario ON lancamentos(usuarioId,excluidoEm);
 PRAGMA user_version=1; COMMIT;`);
}
