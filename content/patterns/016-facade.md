---
patternId: 16
slug: facade
title: Facade
summary: Expone una interfaz de alto nivel sobre un conjunto de subsistemas de IA para reducir acoplamiento y complejidad en los consumidores.
family: foundations
legacyGroup: 3
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_16_facade.ts
tags: [gof, structural, facade, api]
related: [11, 21, 31]
combinesWith: [25, 53, 77]
antiPatterns:
  - Convertir la fachada en un god object.
  - Ocultar controles de seguridad que el consumidor necesita conocer.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Facade ofrece una entrada simple a un subsistema complejo. Un método de negocio puede ocultar retrieval, guardrails, llamadas LLM, validación y telemetría.

## Problema
Si cada consumidor debe conocer todos los componentes y su orden, la arquitectura interna se filtra a toda la aplicación.

## Solución
Crea una API orientada a casos de uso y delega internamente en subsistemas especializados.

```text
Client -> AI Facade -> Retrieval / LLM / Guardrails / Evaluation
```

## Aplicabilidad
Ideal para SDKs y boundaries de dominio. La fachada debe mantener opciones avanzadas accesibles cuando sean necesarias.

## Seguridad
Simplificar no significa ocultar riesgo: operaciones sensibles deben conservar autorización, trazabilidad y confirmaciones explícitas.

## Implementación del repositorio
`src/pattern_16_facade.ts` demuestra una interfaz unificada sobre varios componentes.

## Relaciones
**Adapter (11)** traduce contratos; **Facade** simplifica; **Proxy (21)** controla el acceso al objeto.