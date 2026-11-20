# P10.1 — Differential Privacy Budget Gate

**ID:** 191 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Controlar el gasto declarado de epsilon y delta por sujeto.

## Contrato de referencia

Composición aditiva básica con reserva atómica en memoria.

Archivo: `research/p10/privacy/src/pattern_191_differential_privacy_budget_gate.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

El presupuesto no produce privacidad diferencial; requiere un mecanismo DP real y contabilidad validada.

## Modelo de amenazas y controles de producción

Límites de presupuesto, concurrencia, persistencia, composición y unidades de privacidad. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Dwork et al. (2006), Calibrating Noise to Sensitivity in Private Data Analysis. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
