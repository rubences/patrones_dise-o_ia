import test from "node:test";
import assert from "node:assert/strict";
import { ClarificationLoop } from "../../src/pattern_96_clarification_loop.js";

test("devuelve unresolved cuando se agotan rondas y la ambigüedad persiste", async () => {
  const loop = new ClarificationLoop(
    async () => ({ ambigua: true, preguntaAclaracion: "¿Cuál?", motivo: "faltan datos" }),
    2,
  );
  const resultado = await loop.clarificar("hazlo", async () => "no sé");
  assert.equal(resultado.estado, "unresolved");
  assert.equal(resultado.interpretacionFinal, undefined);
  assert.equal(resultado.rondas, 2);
  assert.equal(resultado.motivoPendiente, "faltan datos");
});

test("preserva la intención original al acumular una aclaración", async () => {
  const loop = new ClarificationLoop(
    async (input) => input.includes("ACLARACIÓN 1: pedido #42")
      ? { ambigua: false }
      : { ambigua: true, preguntaAclaracion: "¿Qué pedido?" },
    2,
  );
  const resultado = await loop.clarificar("Cancela mi pedido", async () => "pedido #42");
  assert.equal(resultado.estado, "resolved");
  assert.ok(resultado.interpretacionFinal?.includes("Cancela mi pedido"));
  assert.ok(resultado.interpretacionFinal?.includes("pedido #42"));
});
