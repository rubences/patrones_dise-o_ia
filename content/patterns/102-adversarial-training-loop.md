---
patternId: 102
slug: adversarial-training-loop
title: Adversarial Training Loop
summary: Genera ataques adaptativos ronda a ronda y mide la respuesta defensiva, usando los hallazgos para alimentar mejoras verificables en versiones posteriores del sistema.
family: safety-security
legacyGroup: 23
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_102_adversarial_training_loop.ts
tags: [adversarial, red-team, arena, continuous-evaluation]
related: [70, 74, 76]
combinesWith: [53, 69, 90]
antiPatterns:
  - Llamar entrenamiento a un bucle que no modifica modelo, políticas ni configuración defensiva.
  - Usar atacante y juez de la misma familia como única evidencia de seguridad.
  - Comparar rondas hasta compromiso sin fijar modelos, seeds, prompts y criterios.
references: []
---
# Propósito
Este patrón automatiza una arena donde un atacante adapta el siguiente intento al resultado anterior y un juez clasifica si la defensa fue comprometida.

## Precisión terminológica
La implementación actual es un **adversarial evaluation loop**, no entrenamiento en sentido estricto. No actualiza pesos, prompt del defensor, reglas ni guardrails durante las rondas. Para convertirse en un training/improvement loop debe existir una etapa que transforme hallazgos en cambios y una validación independiente posterior.

## Implementación del repositorio
`src/pattern_102_adversarial_training_loop.ts` crea atacante, defensor y juez sobre el mismo cliente/modelo por defecto. El atacante recibe feedback de la última ronda y genera una variante. El juez parsea `COMPROMETIDO` y `RAZON`. La métrica incluye primer compromiso y tasa de compromiso.

Estas métricas dependen de sampling, modelo, juez y prompt. Sin control de aleatoriedad ni suite fija no son directamente comparables entre ejecuciones. Compartir familia de modelo entre atacante y juez también introduce errores correlacionados.

## Producción
Ejecuta la arena en entorno aislado, versiona todos los participantes, conserva ataques como nuevos tests y exige que cada fix pase Regression Testing. Después de modificar defensa, vuelve a ejecutar tanto casos nuevos como baseline para detectar trade-offs.

## Cierre del bucle
El ciclo completo es `generar ataque -> evaluar -> triage -> corregir -> regression suite -> canary`. Solo con la etapa de corrección/promoción existe aprendizaje operativo real.

## Relaciones
**Red Teaming (74)** aporta suites conocidas; **Adversarial Robustness (70)** cuantifica perturbaciones; **Regression Testing (76)** convierte hallazgos en protección permanente.