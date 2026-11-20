# P10.2 — Confidential Inference Boundary

**ID:** 192 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Impedir el paso a inferencia cuando faltan señales de ejecución confiable.

## Contrato de referencia

Decisión fail-closed basada en afirmaciones de atestación, medición y cifrado.

Archivo: `research/p10/privacy/src/pattern_192_confidential_inference_boundary.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

Las señales booleanas no son atestación criptográfica; integrar verificación de certificados y TEE.

## Modelo de amenazas y controles de producción

Falsificación de mediciones, claves, revocación y validación de cadenas de confianza. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Documentación primaria de Intel SGX/TDX y AMD SEV-SNP, por verificar. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
