import test from "node:test";
import assert from "node:assert/strict";
import { Tracer } from "../../src/pattern_77_observability.js";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

test("dos requests concurrentes conservan árboles de spans independientes", async () => {
  const tracer = new Tracer();

  await Promise.all([
    tracer.trazar("request-A", {}, async () => {
      await delay(15);
      await tracer.trazar("child-A", {}, async () => { await delay(2); });
    }),
    tracer.trazar("request-B", {}, async () => {
      await delay(2);
      await tracer.trazar("child-B", {}, async () => { await delay(2); });
    }),
  ]);

  const roots = tracer.obtenerTrazas();
  assert.equal(roots.length, 2);
  const a = roots.find((r) => r.nombre === "request-A");
  const b = roots.find((r) => r.nombre === "request-B");
  assert.ok(a);
  assert.ok(b);
  assert.deepEqual(a.hijos.map((h) => h.nombre), ["child-A"]);
  assert.deepEqual(b.hijos.map((h) => h.nombre), ["child-B"]);
  assert.equal(a.hijos[0].padreId, a.id);
  assert.equal(b.hijos[0].padreId, b.id);
});

test("un error cierra únicamente el span de su propio contexto", async () => {
  const tracer = new Tracer();
  await Promise.allSettled([
    tracer.trazar("ok", {}, async () => { await delay(5); }),
    tracer.trazar("fail", {}, async () => { throw new Error("boom"); }),
  ]);

  const roots = tracer.obtenerTrazas();
  assert.equal(roots.find((r) => r.nombre === "ok")?.estado, "ok");
  const fallo = roots.find((r) => r.nombre === "fail");
  assert.equal(fallo?.estado, "error");
  assert.equal(fallo?.error, "boom");
});
