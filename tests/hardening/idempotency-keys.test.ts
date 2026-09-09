import test from "node:test";
import assert from "node:assert/strict";
import { RegistroIdempotencia } from "../../src/pattern_85_idempotency_keys.js";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

test("dos llamadas concurrentes con la misma clave ejecutan el efecto una sola vez", async () => {
  const registro = new RegistroIdempotencia();
  let ejecuciones = 0;
  const accion = async () => {
    ejecuciones++;
    await delay(20);
    return `resultado-${ejecuciones}`;
  };

  const [a, b] = await Promise.all([
    registro.ejecutar("misma-clave", accion),
    registro.ejecutar("misma-clave", accion),
  ]);

  assert.equal(ejecuciones, 1);
  assert.equal(a.resultado, b.resultado);
  assert.deepEqual([a.repetido, b.repetido].sort(), [false, true]);
  assert.equal(registro.enVuelo(), 0);
});

test("si la ejecución falla, la clave en vuelo se libera y un retry puede ejecutar", async () => {
  const registro = new RegistroIdempotencia();
  let intentos = 0;

  await assert.rejects(
    registro.ejecutar("k", async () => {
      intentos++;
      throw new Error("fallo transitorio");
    }),
    /fallo transitorio/,
  );
  assert.equal(registro.enVuelo(), 0);

  const retry = await registro.ejecutar("k", async () => {
    intentos++;
    return "ok";
  });
  assert.equal(retry.resultado, "ok");
  assert.equal(retry.repetido, false);
  assert.equal(intentos, 2);
});

test("un resultado completado se reutiliza en retries posteriores", async () => {
  const registro = new RegistroIdempotencia();
  let ejecuciones = 0;
  await registro.ejecutar("k", async () => { ejecuciones++; return "ok"; });
  const retry = await registro.ejecutar("k", async () => { ejecuciones++; return "duplicado"; });
  assert.equal(retry.resultado, "ok");
  assert.equal(retry.repetido, true);
  assert.equal(ejecuciones, 1);
});
