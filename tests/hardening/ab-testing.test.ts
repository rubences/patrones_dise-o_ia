import test from "node:test";
import assert from "node:assert/strict";
import { compararMuestrasCalidad, resumirMuestra } from "../../src/pattern_75_ab_testing.js";

test("A/B no fabrica estadística cuando una variante carece de muestra suficiente", () => {
  const resultado = compararMuestrasCalidad("A", [90], "B", [70, 72]);
  assert.equal(resultado.estado, "insuficiente");
  assert.equal(resultado.varianteSuperiorId, null);
  assert.equal(resultado.ic95Diferencia, null);
});

test("A/B declara diferencia solo cuando el IC95 aproximado excluye cero", () => {
  const resultado = compararMuestrasCalidad("A", [90, 91, 89, 92, 90], "B", [70, 72, 69, 71, 70]);
  assert.equal(resultado.estado, "diferencia_detectada");
  assert.equal(resultado.varianteSuperiorId, "A");
  assert.ok(resultado.ic95Diferencia && resultado.ic95Diferencia[0] > 0);
});

test("A/B conserva resultado inconcluso cuando el intervalo cruza cero", () => {
  const resultado = compararMuestrasCalidad("A", [80, 90, 70, 85], "B", [78, 88, 74, 84]);
  assert.equal(resultado.estado, "inconclusa");
  assert.equal(resultado.varianteSuperiorId, null);
  assert.ok(resultado.ic95Diferencia && resultado.ic95Diferencia[0] <= 0 && resultado.ic95Diferencia[1] >= 0);
});

test("resumirMuestra representa ausencia de datos con null, no con un score por defecto", () => {
  const resumen = resumirMuestra([]);
  assert.equal(resumen.media, null);
  assert.equal(resumen.ic95Media, null);
});
