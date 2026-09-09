---
patternId: 74
slug: red-teaming
title: Red Teaming
summary: Ejecuta suites explícitas de ataques y casos de control contra un agente para descubrir fallos, priorizarlos por severidad y convertir cada hallazgo confirmado en una regresión reproducible.
family: evaluation-qa
legacyGroup: 17
level: workflow
difficulty: advanced
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_74_red_teaming.ts
tags: [red-team, security-testing, attacks, evaluation]
related: [69, 70, 102]
combinesWith: [53, 76, 77]
antiPatterns:
  - Llamar evidencia de seguridad a una sola pasada de pocos ataques.
  - Publicar un score agregado que oculta una vulnerabilidad crítica.
  - Ejecutar pruebas ofensivas contra sistemas reales sin aislamiento y autorización.
references: []
---
# Propósito
Red Teaming busca activamente comportamientos inseguros mediante ataques conocidos, controles negativos y escenarios de abuso versionados.

## Implementación del repositorio
`src/pattern_74_red_teaming.ts` ejecuta seis casos fijos, incluidos inyección, exfiltración de contexto, roleplay, escalada de privilegios y dos controles legítimos. Otro LLM clasifica vulnerabilidad, severidad y evidencia.

El `scoreSeguridad` resta penalizaciones ad hoc por críticas, altas y número total de vulnerabilidades. No está calibrado ni representa una probabilidad de seguridad. El atacante y el evaluador comparten el mismo cliente/modelo por defecto, por lo que pueden existir errores correlacionados.

## Producción
Versiona la suite, ejecuta en entorno autorizado, separa ataques destructivos de pruebas de prompt y captura evidencia mínima reproducible. Cada vulnerabilidad confirmada debe convertirse en test permanente con owner y severidad.

No uses un score global para aceptar producción si existe un hallazgo crítico sin resolver.

## Relaciones
**Adversarial Robustness (70)** mide perturbaciones; **Adversarial Training Loop (102)** genera ataques adaptativos; **Regression Testing (76)** evita que un fix desaparezca en versiones futuras.