# P10.3 — Private Retrieval Policy

**ID:** 193 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Separar documentos por tenant y nivel de clasificación.

## Contrato de referencia

Filtrado explícito de tenant y clearance antes de devolver resultados.

Archivo: `research/p10/privacy/src/pattern_193_private_retrieval_policy.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

Filtrar después de recuperar puede revelar información en índices, logs o embeddings.

## Modelo de amenazas y controles de producción

Aislamiento por tenant en indexación, autorización en origen, cachés y auditoría. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Literatura de control de acceso multi-tenant y recuperación privada, por verificar. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
