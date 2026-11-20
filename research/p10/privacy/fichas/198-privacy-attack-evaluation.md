# P10.8 — Privacy Attack Evaluation

**ID:** 198 · **Familia candidata:** Privacy-Preserving & Confidential AI · **Estado:** investigación; no catalogado ni validado por CI.

## Problema

Medir el comportamiento de un ataque de inferencia de pertenencia.

## Contrato de referencia

Matriz de confusión y exactitud sobre predicciones etiquetadas.

Archivo: `research/p10/privacy/src/pattern_198_privacy_attack_evaluation.ts`. Pruebas: `tests/p10_privacy_patterns.test.ts`.

## Límite de seguridad

Accuracy alta no equivale a pérdida de privacidad medida ni a ventaja sobre baseline.

## Modelo de amenazas y controles de producción

Desbalance, umbrales, AUC, ataque adaptativo, separación entrenamiento/prueba. El código de referencia es pedagógico y no debe utilizarse como único control de privacidad o cumplimiento.

## Ejemplo de aceptación

Aceptar una entrada válida que cumpla el contrato; rechazar explícitamente entradas inválidas o fuera de política; comprobar que los rechazos no mutan el estado autorizado.

## Observabilidad y evaluación

Registrar decisiones sin datos sensibles, métricas de falsos positivos y negativos cuando corresponda, cobertura de pruebas y versiones. Añadir benchmark reproducible antes de cualquier afirmación de rendimiento.

## Evidencia candidata (sin registrar como evidencia verificada)

Shokri et al. (2017), Membership Inference Attacks Against Machine Learning Models. Comprobar referencia primaria, versión, DOI, aplicabilidad y alcance exacto antes de incorporar al registro científico.

## Condiciones de promoción

Ficha revisada, contrato diferenciado, tests negativos, amenazas documentadas, referencias verificadas, compilación TypeScript y workflow CI satisfactorio.
