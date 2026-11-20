# P10.5 — PII Minimization Pipeline

**ID:** 195 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Reducir datos expuestos mediante proyección de campos.

## Contrato de referencia

Lista permitida y bloqueo explícito de campos sensibles conocidos.

Archivo: `research/p10/privacy/src/pattern_195_pii_minimization_pipeline.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

No descubre PII en texto libre ni controla inferencias indirectas.

## Modelo de amenazas y controles de producción

Catálogo de campos, minimización por finalidad, trazabilidad y pruebas de fuga. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

RGPD art. 5(1)(c), minimización de datos; comprobar aplicación jurídica. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
