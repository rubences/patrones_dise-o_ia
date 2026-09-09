import test from "node:test";
import assert from "node:assert/strict";
import { parsearSalidaJuez, RUBRICA_ESTANDAR } from "../../src/pattern_73_llm_as_judge.js";

const salidaValida = RUBRICA_ESTANDAR.map(
  (r, i) => `DIMENSION: ${r.nombre} | SCORE: ${8 + (i % 2)} | FEEDBACK: evidencia ${i}`,
).join("\n") + "\nRECOMENDACIONES: revisar fuentes; calibrar juez";

test("LLM-as-Judge calcula score solo con todas las dimensiones válidas", () => {
  const resultado = parsearSalidaJuez(salidaValida);
  assert.equal(resultado.estado, "valido");
  assert.ok(resultado.scorePonderado !== null);
  assert.equal(resultado.errores.length, 0);
  assert.equal(resultado.scores.every((s) => s.valido), true);
});

test("LLM-as-Judge no imputa score a una dimensión ausente", () => {
  const incompleta = salidaValida.split("\n").filter((l) => !l.includes("DIMENSION: seguridad")).join("\n");
  const resultado = parsearSalidaJuez(incompleta);
  assert.equal(resultado.estado, "invalido");
  assert.equal(resultado.scorePonderado, null);
  assert.equal(resultado.scores.find((s) => s.dimension === "seguridad")?.score, null);
});

test("LLM-as-Judge rechaza score fuera de rango y dimensiones duplicadas", () => {
  const salida = salidaValida
    .replace("DIMENSION: relevancia | SCORE: 9", "DIMENSION: relevancia | SCORE: 19")
    + "\nDIMENSION: claridad | SCORE: 8 | FEEDBACK: duplicada";
  const resultado = parsearSalidaJuez(salida);
  assert.equal(resultado.estado, "invalido");
  assert.equal(resultado.scorePonderado, null);
  assert.ok(resultado.errores.some((e) => e.includes("relevancia")));
  assert.ok(resultado.errores.some((e) => e.includes("duplicada")));
});
