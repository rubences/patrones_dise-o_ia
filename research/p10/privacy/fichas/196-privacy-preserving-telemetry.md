# P10.6 — Privacy-Preserving Telemetry

**ID:** 196 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Evitar publicar agregados con grupos de tamaño insuficiente.

## Contrato de referencia

Supresión de grupos pequeños y cálculo de medias por tenant y métrica.

Archivo: `research/p10/privacy/src/pattern_196_privacy_preserving_telemetry.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

La supresión k no garantiza anonimato, especialmente ante consultas diferenciales.

## Modelo de amenazas y controles de producción

Ataques de reconstrucción, consultas repetidas, retención y límites de exposición. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Literatura de divulgación estadística y privacidad diferencial, por verificar. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
