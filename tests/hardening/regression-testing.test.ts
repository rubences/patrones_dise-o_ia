import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { OpenAI } from "openai";
import {
  JsonFileRegressionBaselineStore,
  SuiteRegresionLLM,
} from "../../src/pattern_76_regression_testing.js";

const fakeClient = {} as OpenAI;
const respuestaBuena = async (input: string) => {
  if (input.includes("RAG")) return "RAG combina recuperación y generación usando documentos.";
  if (input.includes("Factory")) return "Abstract Factory crea una familia; Factory Method delega la creación.";
  if (input.includes("Singleton")) return "Singleton mantiene una única instancia para compartir un recurso.";
  return "El observador se suscribe y el sujeto puede notificar cada cambio.";
};

test("baseline JSON persiste entre instancias de la suite", async () => {
  const dir = mkdtempSync(join(tmpdir(), "patrones-reg-"));
  try {
    const ruta = join(dir, "baseline.json");
    const evaluador = async () => 90;
    const suite1 = new SuiteRegresionLLM(fakeClient, new JsonFileRegressionBaselineStore(ruta), evaluador);
    await suite1.ejecutar(respuestaBuena, "v1");

    const suite2 = new SuiteRegresionLLM(fakeClient, new JsonFileRegressionBaselineStore(ruta), evaluador);
    const reporte = await suite2.ejecutar(respuestaBuena, "v2", "v1");
    assert.equal(reporte.baselineComparado, "v1");
    assert.equal(reporte.regresionesDetectadas.length, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Regression Testing detecta transición de pasado a fallido", async () => {
  const dir = mkdtempSync(join(tmpdir(), "patrones-reg-"));
  try {
    const ruta = join(dir, "baseline.json");
    const store = new JsonFileRegressionBaselineStore(ruta);
    const suite1 = new SuiteRegresionLLM(fakeClient, store, async () => 95);
    await suite1.ejecutar(respuestaBuena, "good");

    const suite2 = new SuiteRegresionLLM(fakeClient, new JsonFileRegressionBaselineStore(ruta), async () => 20);
    const reporte = await suite2.ejecutar(async () => "respuesta incorrecta", "bad", "good");
    assert.ok(reporte.regresionesDetectadas.length > 0);
    assert.ok(reporte.regresionesDetectadas.some((r) => r.includes("pasado")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Regression Testing mantiene evaluador inválido como null/invalido", async () => {
  const suite = new SuiteRegresionLLM(fakeClient, undefined, async () => null);
  const reporte = await suite.ejecutar(respuestaBuena, "invalid");
  assert.equal(reporte.invalidos, reporte.totalTests);
  assert.equal(reporte.resultados.every((r) => r.scoreObtenido === null && r.estado === "invalido"), true);
});
