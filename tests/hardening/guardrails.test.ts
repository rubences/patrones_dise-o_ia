import test from "node:test";
import assert from "node:assert/strict";
import { GuardrailInput, interpretarVeredictoSeguridad } from "../../src/pattern_53_guardrails.js";

test("INSEGURO nunca se interpreta como SEGURO", () => {
  assert.equal(interpretarVeredictoSeguridad("INSEGURO"), "inseguro");
  assert.equal(interpretarVeredictoSeguridad("SEGURO"), "seguro");
});

test("un veredicto ambiguo falla como inválido", () => {
  assert.equal(interpretarVeredictoSeguridad("La respuesta parece SEGURA"), "invalido");
  assert.equal(interpretarVeredictoSeguridad("SEGURO o INSEGURO"), "invalido");
});

test("la detección PII es estable entre llamadas consecutivas", () => {
  const guardrail = new GuardrailInput();
  const primera = guardrail.revisar("Contacto: uno@example.com");
  const segunda = guardrail.revisar("Contacto: dos@example.com");
  assert.equal(primera.aprobado, false);
  assert.equal(segunda.aprobado, false);
  assert.equal(primera.categoria, "pii");
  assert.equal(segunda.categoria, "pii");
});

test("redacta todas las apariciones del patrón detectado", () => {
  const guardrail = new GuardrailInput();
  const resultado = guardrail.revisar("uno@example.com y dos@example.com");
  assert.equal(resultado.textoSanitizado, "[REDACTADO] y [REDACTADO]");
});
