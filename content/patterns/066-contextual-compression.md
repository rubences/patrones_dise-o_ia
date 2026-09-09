---
patternId: 66
slug: contextual-compression
title: Contextual Compression
summary: Reduce documentos recuperados a fragmentos relevantes para la consulta, conservando procedencia y evaluando el equilibrio entre ahorro de contexto y pérdida de evidencia.
family: knowledge-context
legacyGroup: 7
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_66_contextual_compression.ts
tags: [rag, context, compression, retrieval, tokens]
related: [25, 41, 49]
combinesWith: [52, 77, 98]
antiPatterns:
  - Comprimir sin conservar el vínculo al texto original.
  - Optimizar solo reducción de tokens ignorando recall de evidencia.
  - Publicar un porcentaje de ahorro como propiedad universal del patrón.
references: []
---
# Propósito
Contextual Compression transforma documentos recuperados en fragmentos más pequeños condicionados por la consulta. Su objetivo es reducir ruido y presupuesto de contexto sin eliminar la evidencia necesaria para responder.

## Problema
Un retriever puede encontrar un documento relevante aunque solo unas pocas frases respondan a la consulta. Enviar el documento completo desperdicia tokens y aumenta información distractora.

## Solución

```text
query + retrieved document
 -> compressor/extractor
 -> relevant spans
 -> context builder
 -> generation
```

Cada fragmento comprimido debería conservar `document_id`, offsets/span original y metadata de procedencia.

## Trade-off central
La métrica importante no es «cuánto comprimimos», sino **cuánta evidencia útil conservamos por token**. Una compresión agresiva puede reducir coste y simultáneamente borrar contexto necesario, negaciones o excepciones.

## Implementación del repositorio
`src/pattern_66_contextual_compression.ts` pide al LLM que extraiga solo oraciones relevantes o devuelva `IRRELEVANTE`. Ejecuta compresión de documentos en paralelo y estima tokens como `número_de_palabras × 1.3`.

La reducción mostrada por la demo depende completamente de esos documentos, de la consulta y del extractor. El claim `-80% tokens` de comentarios históricos no se adopta como garantía general. Además, el estimador `words × 1.3` es una aproximación, no el tokenizer real del modelo.

## Evaluación
Compara:
- tokens reales antes/después;
- evidence recall;
- answer quality;
- citation coverage;
- latencia y coste del compresor;
- tasa de documentos falsamente descartados.

## Producción
Usa tokenización real cuando el presupuesto sea contractual; conserva provenance; protege el compresor frente a instrucciones embebidas en documentos; y evalúa si un extractor más barato/determinista basta antes de añadir otra llamada LLM.

## Relaciones
**RAG (25)** recupera; **Retrieval Ranking (41)** decide qué documentos priorizar; **Contextual Compression** reduce su contenido; **Prompt Compression (49)** actúa sobre contexto/prompt más general.