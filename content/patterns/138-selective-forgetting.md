---
patternId: 138
slug: selective-forgetting
title: "Selective Forgetting"
summary: "Contrato arquitectónico experimental para selective forgetting con trazabilidad, autorización y pruebas negativas."
family: continual-learning-memory
legacyGroup: 31
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_138_selective_forgetting.ts
tags: [memory, learning, agent]
related: [44, 51, 86]
combinesWith: [72, 77, 98]
antiPatterns:
  - Confundir memoria almacenada con conocimiento validado.
references: []
---

## Propósito

Selective Forgetting proporciona un contrato experimental para evolución controlada de la memoria.

## Problema y fuerzas

La memoria persistente requiere atribución, acceso controlado, versiones y políticas de retención; no se debe confundir almacenamiento con aprendizaje demostrado.

## Solución

Mantener operaciones explícitas y autorizadas, con estado y procedencia auditables.

## Implementación del repositorio

`src/pattern_138_selective_forgetting.ts` contiene una abstracción mínima de almacenamiento por actor; no implementa un algoritmo de aprendizaje ni reproduce benchmarks.

## Producción

Exige políticas de retención, controles de identidad, evaluación longitudinal y adaptadores persistentes.

## Evidencia y alcance

`needs-review`: propuesta de investigación P9, sin resultados empíricos propios.

## Relaciones

Patrones 44, 51, 72, 77 y 86.
