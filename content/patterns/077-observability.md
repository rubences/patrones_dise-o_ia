---
patternId: 77
slug: observability
title: Observability
summary: Instrumenta ejecuciones agénticas con trazas, métricas y eventos para reconstruir qué ocurrió, cuánto costó y dónde falló sin depender del texto generado.
family: production-finops
legacyGroup: 18
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_77_observability.ts
tags: [observability, tracing, metrics, production]
related: [18, 44, 92]
combinesWith: [73, 76, 94]
antiPatterns:
  - Registrar prompts completos con secretos o PII por defecto.
  - Usar una variable global de span activo en concurrencia real.
  - Estimar tokens y presentarlos como consumo facturado.
references: []
---
# Propósito
Observability crea telemetría estructurada por paso del workflow y permite correlacionar latencia, errores, herramientas, modelos, coste y resultados.

## Implementación del repositorio
`src/pattern_77_observability.ts` implementa un tracer en memoria con spans padre/hijo y una variable `spanActivo`. En ejecuciones concurrentes esa variable compartida puede asociar hijos al padre incorrecto. Los tokens se estiman como palabras×1,3 y el RAG de la demo está simulado.

## Producción
Usa context propagation asíncrona, IDs de trace estables y estándares como OpenTelemetry. Redacta datos sensibles, separa logs de payloads y obtiene usage real del proveedor cuando exista.

## Señales recomendadas
TTFT, latencia total, tool latency, error rate, retries, tokens/coste, cache hits, retrieval quality y outcome/eval score.

## Relaciones
Observability atraviesa casi todos los patrones de producción y es prerequisito para canary, SLOs y FinOps.