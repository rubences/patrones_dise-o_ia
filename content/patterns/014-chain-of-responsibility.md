---
patternId: 14
slug: chain-of-responsibility
title: Chain of Responsibility
summary: Encadena manejadores independientes hasta que uno procesa la solicitud o la transforma para el siguiente, evitando un controlador monolítico.
family: foundations
legacyGroup: 3
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_14_chain.ts
tags: [gof, behavioral, chain, routing]
related: [2, 12, 24]
combinesWith: [53, 69, 72]
antiPatterns:
  - Cadenas sin criterio explícito de parada.
  - Depender de un orden accidental de handlers.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Chain of Responsibility divide el procesamiento en manejadores conectables. Un request avanza por validación, clasificación, políticas o transformaciones hasta resolverse.

## Problema
Un único bloque que valida, enruta, autoriza y responde acumula responsabilidades y es difícil de extender.

## Solución
Cada handler decide si procesa, modifica, rechaza o delega al siguiente.

```text
Request -> Validate -> Policy -> Classify -> Handle
```

## Aplicabilidad
Encaja en pipelines de seguridad, soporte y pre/postprocesado. No es ideal cuando todas las etapas deben ejecutarse siempre: ahí Pipeline suele comunicar mejor la intención.

## Riesgos
Debes conocer qué handler tomó la decisión, qué handlers se omitieron y por qué. Añade tracing y una política de fallo seguro.

## Implementación del repositorio
`src/pattern_14_chain.ts` demuestra una cadena jerárquica de manejadores.

## Relaciones
Se parece a **Pipeline (1)**, pero un handler puede detener la cadena. **Decorator (12)** envuelve una operación; Chain pasa una solicitud entre responsables.