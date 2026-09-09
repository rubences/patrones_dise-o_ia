---
patternId: 52
slug: grounding
title: Grounding
summary: Vincula afirmaciones generadas a evidencia verificable y conserva el resultado de esa comprobación para reducir respuestas no fundamentadas y hacer explícita la incertidumbre.
family: knowledge-context
legacyGroup: 12
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_52_grounding.ts
tags: [grounding, verification, evidence, factuality]
related: [25, 37, 98]
combinesWith: [41, 73, 76]
antiPatterns:
  - Tratar la presencia de una fuente como prueba automática de que soporta el claim.
  - Convertir un score heurístico en porcentaje de verdad.
  - Usar una base de hechos desactualizada como autoridad sin versionado ni fecha.
references: []
---
# Propósito
Grounding hace que las afirmaciones relevantes de una respuesta estén vinculadas a evidencia externa. El objetivo no es añadir apariencia de autoridad, sino comprobar **entailment, procedencia, actualidad y cobertura**.

## Problema
Un LLM puede formular hechos plausibles que no estén respaldados. Incluso cuando se usa RAG, el hecho de que un documento aparezca en el contexto no demuestra que soporte exactamente la afirmación generada.

## Solución

```text
candidate answer
 -> claim extraction
 -> retrieve authoritative evidence
 -> claim/evidence verification
 -> supported / contradicted / unknown
 -> revise or annotate answer
```

Grounding debe conservar el vínculo entre claim y fragmento fuente, no solo un nombre genérico de documento.

## Evaluación
Mide al menos:
- claim coverage;
- citation correctness;
- entailment/contradiction;
- source authority/freshness;
- porcentaje de claims sin evidencia;
- downstream correction rate.

## Implementación del repositorio
`src/pattern_52_grounding.ts` extrae claims mediante texto generado, los parsea con separadores y los compara contra un `Map` de hechos **hardcoded** usando solapamiento léxico. El `scoreConfianza` es un promedio heurístico de valores prefijados y, si no hay claims, devuelve 70.

Por eso ese score no es una probabilidad calibrada de veracidad. Los hechos hardcoded tampoco constituyen una fuente autoritativa ni necesariamente actualizada; son datos de demostración.

## Producción
- fuentes con IDs y timestamps;
- retrieval reproducible;
- extractores de claims estructurados;
- verificadores de entailment evaluados;
- políticas de fuente autorizada por dominio;
- estado explícito `supported / contradicted / insufficient-evidence`;
- revisión o abstención cuando la evidencia sea insuficiente.

## Grounding vs Citation
Grounding pregunta «¿está respaldado?». **Citation Attribution (98)** pregunta «¿cómo presento y rastreo la fuente?». Deben combinarse, pero son responsabilidades distintas.

## Relaciones
**RAG (25)** aporta contexto; **Retrieval Ranking (41)** mejora selección; **Knowledge Graph (37)** aporta relaciones; **Citation Attribution (98)** materializa atribución al usuario.