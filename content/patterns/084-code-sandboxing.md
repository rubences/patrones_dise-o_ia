---
patternId: 84
slug: code-sandboxing
title: Code Sandboxing
summary: Ejecuta código no confiable dentro de límites explícitos de capacidades, tiempo y recursos, usando aislamiento de sistema cuando el código pueda ser hostil.
family: safety-security
legacyGroup: 19
level: architecture
difficulty: advanced
maturity: established
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_84_code_sandboxing.ts
tags: [sandbox, code-execution, isolation, security]
related: [50, 69, 101]
combinesWith: [46, 77, 85]
antiPatterns:
  - Considerar `node:vm` una frontera de seguridad suficiente para código hostil.
  - Limitar CPU pero dejar memoria, procesos o red sin cuotas externas.
  - Ejecutar código generado con credenciales del proceso anfitrión.
references: []
---
# Propósito
Code Sandboxing reduce el impacto de ejecutar código generado o suministrado por una fuente no confiable mediante aislamiento y capability minimization.

## Implementación del repositorio
`src/pattern_84_code_sandboxing.ts` usa `node:vm` con un global mínimo que expone `console`, `Math` y `JSON`. `require`, `process`, `fetch` y otras APIs no se añaden. `runInContext` aplica un timeout síncrono y captura logs y errores.

El propio código fuente incluye una advertencia correcta: **`node:vm` no es un sandbox de seguridad completo**. La demo bloquea accesos obvios y bucles infinitos, pero no proporciona aislamiento a nivel de kernel. El timeout tampoco constituye por sí solo una cuota robusta de memoria u otros recursos.

## Producción
Para código realmente hostil usa procesos/contenedores efímeros, seccomp/capabilities mínimos, gVisor, microVM o WASM según el riesgo. Elimina credenciales, limita CPU/memoria/pids/red/disco y destruye el entorno después de cada ejecución.

## Operación
Conserva stdout/stderr con límites, exit reason, resource usage e imagen/runtime versionados. No devuelvas artefactos del sandbox sin escanearlos.

## Relaciones
**Bulkhead (46)** limita recursos compartidos; **Tool Call Validation (101)** valida la intención de ejecutar; Code Sandboxing limita el impacto del código.