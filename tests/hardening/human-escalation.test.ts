import test from "node:test";
import assert from "node:assert/strict";
import { GestorHandoff, PoliticaEscalacion } from "../../src/pattern_95_human_escalation.js";

test("una categoría crítica domina la prioridad basada en intentos", () => {
  const politica = new PoliticaEscalacion({
    maxIntentos: 3,
    categoriasEscalacion: ["fraude"],
    prioridadPorCategoria: { fraude: "critica" },
  });
  assert.equal(politica.prioridad(0, "fraude"), "critica");
  assert.equal(politica.debeEscalar("cargo extraño", 0, "fraude").escalar, true);
});

test("el handoff exige lifecycle queued -> accepted -> resolved", () => {
  const gestor = new GestorHandoff();
  const caso = gestor.encolar({
    resumen: "caso",
    intentos: 0,
    categoria: "fraude",
    prioridad: "critica",
    historial: [],
  });
  assert.equal(caso.estado, "queued");
  assert.throws(() => gestor.resolver(caso.id), /accepted/);
  const aceptado = gestor.aceptar(caso.id, "op-1");
  assert.equal(aceptado.estado, "accepted");
  assert.equal(aceptado.owner, "op-1");
  const resuelto = gestor.resolver(caso.id);
  assert.equal(resuelto.estado, "resolved");
});
