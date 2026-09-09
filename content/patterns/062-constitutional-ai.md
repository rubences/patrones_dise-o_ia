---
patternId: 62
slug: constitutional-ai
title: Constitutional AI
summary: Evalúa y revisa una respuesta frente a un conjunto explícito de principios, convirtiendo criterios normativos en una etapa auditable de crítica y mejora.
family: safety-security
legacyGroup: 6
level: architecture
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_62_constitutional_ai.ts
tags: [safety, constitutional-ai, critique, principles]
related: [4, 53, 73]
combinesWith: [69, 70, 76]
antiPatterns:
  - Considerar la auto-crítica del mismo modelo como garantía de seguridad.
  - Confundir una lista de principios con autorización determinista.
  - Incorporar principios vagos sin tests adversariales ni criterios medibles.
references:
  - Bai et al. (2022), Constitutional AI: Harmlessness from AI Feedback.
---
# Propósito
Constitutional AI introduce principios explícitos para criticar y revisar comportamiento. Como patrón de arquitectura, ayuda a convertir criterios como privacidad, veracidad o no-daño en una etapa reproducible de evaluación.

## Problema
Las instrucciones generales de «sé seguro» son difíciles de auditar. Necesitamos criterios nombrados que puedan versionarse, probarse y relacionarse con una revisión concreta.

## Solución

```text
respuesta candidata
 -> evaluar contra principios
 -> registrar violaciones
 -> revisar
 -> reevaluar / publicar
```

La constitución debe ser versionada y sus principios suficientemente concretos para crear casos de prueba.

## Límites
Constitutional AI no sustituye controles deterministas de seguridad, autorización, filtros de datos ni revisión humana. Un modelo puede no detectar su propia violación o producir una crítica incorrecta.

## Implementación del repositorio
`src/pattern_62_constitutional_ai.ts` define cuatro principios y, por rendimiento de demo, evalúa solo los tres primeros. Detecta una violación buscando literalmente `VIOLA: SÍ` en texto generado y realiza como máximo una revisión.

La descripción original «alinear LLMs sin supervisión humana» es demasiado amplia para el capítulo: el trabajo de Constitutional AI incluye un proceso metodológico más rico y no implica que una auto-revisión runtime elimine la necesidad de supervisión, evaluación o políticas externas.

## Producción
- principios versionados con owner;
- suite adversarial por principio;
- output de evaluación estructurado;
- separación entre principios blandos y políticas hard-deny;
- métricas de falso positivo/falso negativo;
- escalado humano en categorías de alto impacto.

## Relaciones
**Guardrails (53)** aplican controles de runtime; **LLM-as-Judge (73)** evalúa outputs; **Adversarial Robustness (70)** prueba resistencia; Constitutional AI aporta el marco explícito de principios.