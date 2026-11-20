# P10.7 — Consent-Aware Data Processing

**ID:** 197 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Bloquear tratamiento sin consentimiento vigente para la finalidad.

## Contrato de referencia

Registro en memoria de autorizaciones y revocación por sujeto/finalidad.

Archivo: `research/p10/privacy/src/pattern_197_consent_aware_data_processing.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

No representa por sí solo base jurídica, consentimiento informado o propagación de revocación.

## Modelo de amenazas y controles de producción

Identidad, evidencia de consentimiento, caducidad, borrado y auditoría. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

RGPD arts. 6 y 7; validar con asesoría jurídica. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
