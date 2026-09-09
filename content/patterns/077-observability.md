---
patternId: 77
slug: observability
title: Observability
summary: Instrumenta flujos agénticos con trazas, atributos y métricas correlacionables, manteniendo aislamiento de contexto entre solicitudes concurrentes.
family: production-finops
legacyGroup: 18
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_77_observability.ts
tags: [observability, tracing, metrics, concurrency]
related: [44, 78, 92]
combinesWith: [45, 53, 94]
antiPatterns:
  - Usar una variable global de span activo en un servidor concurrente.
  - Registrar prompts, secretos o PII indiscriminadamente para ganar visibilidad.
  - Interpretar suma de duración de spans anidados como wall-clock del request.
references: []
---
# Propósito
Observability hace visible qué ocurrió en un flujo, dónde se consumió tiempo/coste y qué componente produjo un error, sin mezclar solicitudes independientes.

## Implementación del repositorio
Tras el hardening P1, `src/pattern_77_observability.ts` usa `AsyncLocalStorage` para asociar el span activo al contexto async de cada request. Los spans hijos consultan ese contexto, por lo que dos operaciones simultáneas conservan árboles padre/hijo independientes aunque sus `await` se intercalen.

Esto sustituye el anterior `spanActivo` global, vulnerable a contaminación cruzada entre requests concurrentes.

`duracionTotal` continúa siendo la suma de duración de spans instrumentados; como existen spans anidados, representa trabajo acumulado y **no** tiempo wall-clock del request.

## Producción
Integra OpenTelemetry o un backend equivalente, propaga trace IDs entre procesos, define sampling y redacción de atributos, y separa métricas de negocio, seguridad, calidad, coste y disponibilidad. El contexto de tracing no debe convertirse en un canal para conservar payloads sensibles.

## Relaciones
**Cost Attribution (92)** agrega coste; **Health Check (94)** mide disponibilidad proactiva; Observability explica el comportamiento real de requests e incidentes.