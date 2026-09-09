---
patternId: 48
slug: semantic-cache
title: Semantic Cache
summary: Reutiliza resultados previos cuando una nueva consulta es suficientemente equivalente, reduciendo llamadas costosas sin exigir coincidencia textual exacta.
family: production-finops
legacyGroup: 10
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_48_semantic_cache.ts
tags: [cache, semantic, cost, latency]
related: [25, 32, 49]
combinesWith: [52, 77, 92]
antiPatterns:
  - Reutilizar respuestas sensibles entre usuarios o tenants.
  - Tratar similitud como equivalencia semántica garantizada.
  - Publicar tasas de ahorro sin medir hit rate y calidad del cache hit.
references: []
---
# Propósito
Semantic Cache busca respuestas reutilizables por cercanía semántica en vez de por igualdad exacta.

## Implementación del repositorio
`src/pattern_48_semantic_cache.ts` no usa embeddings de un modelo. Construye un vector manual con frecuencias sobre un vocabulario fijo y aplica similitud coseno. El almacenamiento es un array en memoria sin TTL ni invalidación.

El claim histórico de reducción de llamadas del 40–60% depende completamente de carga, threshold, dominio e invalidación; no se adopta como garantía.

## Producción
Usa embeddings evaluados, namespaces por identidad/tenant, TTL e invalidación por versión de modelo/prompt/datos. Mide false hits, hit rate, ahorro neto y calidad respecto a ejecutar de nuevo.

## Seguridad
No caches outputs dependientes de permisos o datos personales sin incluir ese contexto en la key y política de aislamiento.

## Relaciones
**Prompt Compression (49)** reduce tokens de una llamada; Semantic Cache evita llamadas completas. **Grounding (52)** ayuda a decidir cuándo una respuesta cacheada sigue siendo válida.