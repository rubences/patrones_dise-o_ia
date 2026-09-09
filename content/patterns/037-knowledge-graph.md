---
patternId: 37
slug: knowledge-graph
title: Knowledge Graph
summary: Modela entidades y relaciones explícitas para recuperar contexto conectado, navegar dependencias y razonar sobre conocimiento cuya estructura relacional importa.
family: knowledge-context
legacyGroup: 7
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_37_knowledge_graph.ts
tags: [knowledge-graph, graph, entities, relations, retrieval]
related: [25, 41, 51]
combinesWith: [52, 66, 77]
antiPatterns:
  - Presentar Knowledge Graph como sustituto universal de RAG documental.
  - Crear relaciones sin procedencia, vigencia o reglas de identidad.
  - Permitir traversals sin límites de profundidad, coste o autorización.
references: []
---
# Propósito
Knowledge Graph representa conocimiento mediante **entidades, propiedades y relaciones explícitas**. Es útil cuando la respuesta depende no solo de recuperar fragmentos parecidos, sino de navegar conexiones como pertenencia, dependencia, propiedad, causalidad o jerarquía.

## Problema
La recuperación basada únicamente en similitud textual puede perder relaciones estructurales. Preguntas como «¿qué servicios dependen indirectamente de este componente?» o «¿quién es el responsable del equipo que mantiene este activo?» requieren encadenar relaciones.

## Solución

```text
Entidad A --relación--> Entidad B --relación--> Entidad C
     |                                      |
     +---------- propiedades ---------------+
```

El flujo suele separar:
1. resolución de entidades;
2. consulta/traversal del grafo;
3. selección de subgrafo relevante;
4. serialización del contexto;
5. generación o verificación con el LLM.

## Knowledge Graph y RAG
No son alternativas excluyentes. El grafo aporta estructura y relaciones; RAG aporta recuperación documental. Un sistema Graph-RAG puede recuperar entidades y relaciones y, a la vez, documentos que proporcionan evidencia textual.

## Gobernanza
Cada nodo y relación relevantes deberían conservar procedencia, timestamp/vigencia, ámbito de autorización y calidad. La ontología o schema debe versionarse para evitar que relaciones con distinto significado compartan el mismo nombre.

## Implementación del repositorio
`src/pattern_37_knowledge_graph.ts` implementa un grafo en memoria con `Map`, una lista de relaciones, búsqueda léxica y traversal limitado por profundidad. Construye un contexto textual que después se pasa al LLM.

La demo no es una base de grafos de producción ni implementa entity resolution, índices, consultas declarativas, provenance o autorización por subgrafo. Además, algunos valores de ejemplo —como un nombre concreto de modelo— son datos demostrativos y no deben tratarse como estado actual del ecosistema.

## Producción
- IDs canónicos y deduplicación de entidades;
- schema/ontología versionados;
- procedencia por hecho y relación;
- temporalidad y expiración;
- query budgets y límites de traversal;
- control de acceso por nodo/relación;
- evaluación de entity linking y path relevance;
- trazabilidad del subgrafo usado en cada respuesta.

## Relaciones
**RAG (25)** recupera evidencia documental; **Retrieval Ranking (41)** prioriza candidatos; **Grounding (52)** verifica afirmaciones; Knowledge Graph añade conocimiento relacional explícito.