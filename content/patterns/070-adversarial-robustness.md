---
patternId: 70
slug: adversarial-robustness
title: Adversarial Robustness
summary: Evalúa cómo cambia el comportamiento ante perturbaciones, casos límite y entradas hostiles mediante suites reproducibles y métricas ligadas a criterios de éxito explícitos.
family: safety-security
legacyGroup: 16
level: workflow
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_70_adversarial_robustness.ts
tags: [adversarial, robustness, testing, evaluation]
related: [74, 76, 102]
combinesWith: [53, 69, 77]
antiPatterns:
  - Publicar un score de robustez sin fijar casos, jueces y criterio de éxito.
  - Considerar equivalencia textual como seguridad operacional.
  - Contar una entrada que no produce excepción como caso robusto sin verificar su resultado.
references: []
---
# Propósito
Adversarial Robustness convierte perturbaciones y casos límite en un banco de pruebas repetible para detectar fragilidad antes de producción.

## Implementación del repositorio
`src/pattern_70_adversarial_robustness.ts` genera seis tipos de perturbación determinista y dispone además de generación con LLM. La demo solo toma los primeros cuatro casos. Para entradas no vacías compara la respuesta adversarial con la base mediante otro juicio del mismo `DEFAULT_MODEL`.

El caso vacío se considera estable si el handler simplemente **no lanza excepción**; no se comprueba si la respuesta es correcta o segura. El `scoreFinal` es el porcentaje de cuatro casos considerados estables y no una medida universal de robustez.

## Producción
Mantén suites versionadas por categoría de riesgo, resultados esperados o invariantes, semillas cuando exista aleatoriedad y jueces independientes o deterministas siempre que sea posible. Separa robustez funcional, seguridad, privacidad y disponibilidad.

## Métricas
Reporta tasa de fallo por categoría, severidad, cobertura de ataques y regresiones entre versiones. Un agregado 0–100 puede servir para dashboard, pero nunca debe ocultar un fallo crítico.

## Relaciones
**Red Teaming (74)** amplía cobertura de ataques; **Regression Testing (76)** evita reintroducir fallos; **Adversarial Training Loop (102)** adapta ataques ronda a ronda.