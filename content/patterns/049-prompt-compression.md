---
patternId: 49
slug: prompt-compression
title: Prompt Compression
summary: Reduce contexto o instrucciones antes de una llamada al modelo conservando la información necesaria para la tarea y midiendo el coste de pérdida de información.
family: production-finops
legacyGroup: 10
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_49_prompt_compression.ts
tags: [compression, prompt, tokens, cost]
related: [48, 66, 86]
combinesWith: [78, 77]
antiPatterns:
  - Optimizar solo ratio de compresión sin medir calidad.
  - Resumir instrucciones de seguridad de forma que pierdan invariantes.
  - Usar un estimador aproximado como medición contractual de tokens.
references: []
---
# Propósito
Prompt Compression reduce el material enviado al LLM mediante extracción, resumen o combinación de ambos.

## Implementación del repositorio
`src/pattern_49_prompt_compression.ts` ofrece modos extractive, abstractive e hybrid. La extracción prioriza keywords y longitud; la abstracción usa un LLM. Los tokens se estiman como palabras multiplicadas por 1,3.

Los claims de reducción del 60–80% son dependientes del texto y no se publican como universales. Tampoco debe asumirse que un resumen conserva toda la información importante solo porque el prompt lo solicite.

## Producción
Usa tokenización real, evals de information recall y answer quality, protege instrucciones no comprimibles y conserva provenance cuando se comprimen fuentes.

## Relaciones
**Contextual Compression (66)** comprime documentos recuperados; **Context Compaction (86)** resume historial multi-turno; Prompt Compression es más general.