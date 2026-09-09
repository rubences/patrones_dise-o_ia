import test from "node:test";
import assert from "node:assert/strict";
import { ejecutarSpeculativo } from "../../src/pattern_93_speculative_execution.js";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

test("el camino verificado arranca antes de que termine el draft", async () => {
  let verificacionIniciada = false;

  const resultado = await ejecutarSpeculativo(
    async () => {
      await delay(10);
      assert.equal(verificacionIniciada, true, "la verificación debe arrancar en paralelo desde t0");
      return "draft";
    },
    async () => {
      verificacionIniciada = true;
      await delay(20);
      return "final";
    },
    (a, b) => a === b,
  );

  assert.equal(resultado.corregido, true);
  assert.equal(resultado.resultadoFinal, "final");
  assert.equal(resultado.fuenteFinal, "verificado");
});

test("mantiene el draft cuando el camino verificado confirma equivalencia", async () => {
  const drafts: string[] = [];
  const resultado = await ejecutarSpeculativo(
    async () => "París",
    async () => "París",
    (a, b) => a === b,
    (draft) => drafts.push(draft),
  );

  assert.equal(resultado.corregido, false);
  assert.equal(resultado.resultadoFinal, "París");
  assert.equal(resultado.fuenteFinal, "draft");
  assert.deepEqual(drafts, ["París"]);
});

test("propaga el error del camino verificado después de producir el draft", async () => {
  await assert.rejects(
    ejecutarSpeculativo(
      async () => "provisional",
      async () => { throw new Error("verificación caída"); },
      (a, b) => a === b,
    ),
    /verificación caída/,
  );
});
