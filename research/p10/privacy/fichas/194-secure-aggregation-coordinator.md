# P10.4 — Secure Aggregation Coordinator

**ID:** 194 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Bloquear rondas sin participantes únicos ni quórum mínimo.

## Contrato de referencia

Gate determinista de quórum y participantes.

Archivo: `research/p10/privacy/src/pattern_194_secure_aggregation_coordinator.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

No implementa protocolos de agregación segura ni tolerancia criptográfica a abandonos.

## Modelo de amenazas y controles de producción

Colusión, dropout, verificación de claves y umbrales de seguridad. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Bonawitz et al. (2017), Practical Secure Aggregation for Privacy-Preserving Machine Learning. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
