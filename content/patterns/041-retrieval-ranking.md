---
patternId: 41
slug: retrieval-ranking
title: Retrieval with Ranking
summary: Separa recuperación amplia y ranking fino para aumentar la probabilidad de que el contexto final contenga la evidencia más útil para una consulta.
family: knowledge-context
legacyGroup: 7
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_41_retrieval_ranking.ts
tags: [retrieval, reranking, rag, ranking, context]
related: [25, 37, 66]
combinesWith: [52, 73, 98]
antiPatterns:
  - Suponer que un score de reranker es una probabilidad calibrada de relevancia.
  - Fijar top-k y top-n sin evaluarlos sobre consultas representativas.
  - Publicar una mejora porcentual sin conservar corpus, benchmark y baseline.
references: []
---
# Propósito
Retrieval with Ranking divide la selección de contexto en dos etapas: una recuperación de alta cobertura y un ranking posterior más costoso y preciso. La arquitectura permite que cada etapa optimice un objetivo distinto.

## Problema
Un retriever rápido puede devolver candidatos razonables pero incluir ruido. Enviar todos los candidatos al LLM aumenta tokens y puede diluir la evidencia importante.

## Solución

```text
query
 -> broad retrieval (top-k)
 -> reranker / scorer
 -> final selection (top-n)
 -> context builder
 -> generation
```

El primer paso busca **recall**; el segundo busca **precision@N**.

## Evaluación
Mide retrieval independientemente de generation. Métricas útiles incluyen Recall@K, MRR, nDCG, Precision@K, cobertura de evidencia y downstream answer quality. Los valores óptimos de K y N dependen de corpus, chunking, consulta y presupuesto.

## Implementación del repositorio
`src/pattern_41_retrieval_ranking.ts` describe conceptualmente una búsqueda vectorial, pero la recuperación real de la demo es una **coincidencia léxica de palabras** sobre un corpus pequeño. Después pide al LLM scores 0–100 mediante texto y los parsea con regex; si falla el parseo utiliza `scoreInicial * 10`.

Por tanto, la ficha no adopta el claim `+25% precisión` como resultado general. La demo demuestra la **forma arquitectónica retrieval → reranking**, no un benchmark real de vector search ni de mejora del 25%.

## Producción
- retriever real con índices adecuados al dominio;
- reranker especializado o juez evaluado;
- output de ranking estructurado;
- versionado de corpus/embeddings/reranker;
- evaluación offline con queries y relevancias etiquetadas;
- monitorización de drift;
- presupuesto de latencia para reranking.

## Failure modes
El reranker puede reordenar correctamente candidatos malos sin recuperar nunca la evidencia necesaria. Por eso no basta medir precisión final: debes comprobar primero que la evidencia estaba en el top-K inicial.

## Relaciones
**RAG (25)** usa los documentos finales; **Contextual Compression (66)** reduce cada documento seleccionado; **Grounding (52)** verifica claims de la respuesta; **Citation Attribution (98)** conserva atribución.