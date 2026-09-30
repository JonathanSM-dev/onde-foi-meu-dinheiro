import { test } from "node:test";
import assert from "node:assert/strict";
import { DraftController } from "../src/state/draft";
import { simulateEntry } from "../src/services/simulatedAI";
const entry = {
  id: "a",
  usuarioId: "u",
  categoriaId: "alimentacao",
  tipo: "despesa" as const,
  valorCentavos: 4500,
  data: "2026-09-24",
  descricao: "Mercado",
  origem: "manual" as const,
};
test("cancelar não grava; duplo toque grava uma vez", async () => {
  let writes = 0;
  const d = new DraftController(async () => {
    writes++;
  });
  d.begin(entry);
  d.cancel();
  await d.confirm();
  assert.equal(writes, 0);
  d.begin(entry);
  await Promise.all([d.confirm(), d.confirm()]);
  assert.equal(writes, 1);
  assert.equal(d.value, null);
});
test("falha mantém rascunho e retry usa mesma identidade", async () => {
  let fail = true;
  const ids: string[] = [];
  const d = new DraftController(async (e) => {
    ids.push(e.id);
    if (fail) throw Error("Disco cheio");
  });
  d.begin(entry);
  await assert.rejects(d.confirm());
  assert.equal(d.value?.id, "a");
  fail = false;
  await d.confirm();
  assert.deepEqual(ids, ["a", "a"]);
});
test("cancelamento invalida sugestão atrasada", async () => {
  const d = new DraftController(async () => {});
  let resolve!: (e: typeof entry) => void;
  const pending = d.suggest(
    () => new Promise<typeof entry>((r) => (resolve = r)),
  );
  d.cancel();
  resolve(entry);
  assert.equal(await pending, false);
  assert.equal(d.value, null);
});
test("simulação não inventa valores ausentes ou ambíguos", async () => {
  const cats = [
    {
      id: "alimentacao",
      usuarioId: "u",
      nome: "Alimentação",
      tipo: "despesa" as const,
    },
  ];
  for (const text of ["mercado ontem", "gastei -10", "gastei 10 e 20"])
    assert.equal(
      (await simulateEntry(text, "2026-09-29", cats)).valorCentavos,
      undefined,
    );
  assert.equal(
    (await simulateEntry("gastei 45 no mercado ontem", "2026-09-29", cats))
      .valorCentavos,
    4500,
  );
});
