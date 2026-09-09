---
patternId: 86
slug: context-compaction
title: Context Compaction
summary: Resume incrementalmente los turnos antiguos de una conversación y conserva los recientes con máxima fidelidad para mantener sesiones largas dentro del presupuesto de contexto.
family: knowledge-context
legacyGroup: 20
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_86_context_compaction.ts
tags: [context, conversation, compaction, memory]
related: [49, 51, 55, 66]
combinesWith: [78, 77]
antiPatterns:
  - Resumir repetidamente los mismos turnos y acumular deriva.
  - Perder instrucciones, decisiones o identificadores críticos en el resumen.
  - Confundir una estimación de caracteres con tokens reales.
references: []
---
# Propósito
Context Compaction mantiene un historial multi-turno acotado mediante un resumen acumulado de turnos antiguos más una ventana reciente verbatim.

## Implementación del repositorio
`src/pattern_86_context_compaction.ts` implementa correctamente la idea incremental y evita volver a resumir lo ya compactado. El resumidor por defecto es extractivo/truncado y el conteo usa aproximadamente cuatro caracteres por token.

La demo no verifica que el resumen preserve hechos o decisiones y su estado vive en memoria.

## Producción
Versiona resúmenes, conserva facts/constraints estructurados separados, usa tokenización real y evalúa memory retention. Mantén provenance hacia turnos originales cuando se necesite auditoría.

## Relaciones
Con este patrón, la macrofamilia Knowledge & Context queda realmente completa junto con RAG, Knowledge Graph, Long-Term Memory, Grounding y las dos formas de compresión.