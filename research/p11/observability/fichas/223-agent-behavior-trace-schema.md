# 223 — Agent Behavior Trace Schema

**Familia candidata:** AI Observability & Behavioral Diagnostics · **Estado:** investigación en main, no catálogo canónico.

## Problema y solución

Agent Behavior Trace Schema aporta un contrato de diagnóstico diferenciado sobre trazas, decisiones, herramientas, latencia o cobertura. El mecanismo determinista de referencia está en `research/p11/observability/src/pattern_223_agent_behavior_trace_schema.ts`.

## Pruebas y observabilidad

`tests/p11_observability_patterns.test.ts` contiene pruebas positivas y negativas. Medir cobertura de eventos, falsos positivos de deriva, latencias y coste de instrumentación con datos reproducibles.

## Amenazas y limitaciones

Las trazas pueden contener información sensible. Deben minimizarse, anonimizarse cuando corresponda, aplicar control de acceso y retención. Las atribuciones basadas en pesos no prueban causalidad; las clasificaciones heurísticas pueden fallar; un join de trazas no identifica causas reales por sí solo.

## Evidencia y promoción

Revisar solapamientos con `evaluation-qa`, `production-finops` y `agent-runtime-harness`. Requiere referencias primarias verificadas, fichas canónicas, tests de integración y CI satisfactoria antes de promoción.
