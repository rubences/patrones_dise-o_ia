---
patternId: 34
slug: iterator
title: Iterator
summary: Recorre una colección o flujo de resultados mediante una interfaz uniforme sin exponer su estructura interna ni cargar necesariamente todo en memoria.
family: foundations
legacyGroup: 4
level: code
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_34_iterator.ts
tags: [gof, behavioral, iterator, pagination]
related: [17, 35, 79]
combinesWith: [25, 41, 88]
antiPatterns:
  - Materializar colecciones enormes antes de iterar.
  - Ignorar expiración o consistencia de cursores remotos.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Iterator separa cómo recorrer elementos de cómo están almacenados. En IA aparece en resultados paginados, corpus, streams de documentos o lotes de evaluación.

## Problema
El consumidor no debería conocer índices internos, paginación o estructura del store.

## Solución
Expón operaciones de iteración y conserva el cursor/estado dentro del iterador.

## Aplicabilidad
Útil para colecciones grandes o fuentes remotas. Para streaming asíncrono, usa iteradores asíncronos y backpressure cuando corresponda.

## Producción
Define semántica ante cambios concurrentes: snapshot, eventual consistency o cursor invalidado.

## Implementación del repositorio
`src/pattern_34_iterator.ts` demuestra recorrido transparente de colecciones.

## Relaciones
**Composite (17)** crea estructuras recorribles; **Visitor (35)** añade operaciones; **Streaming (79)** trata entrega incremental.