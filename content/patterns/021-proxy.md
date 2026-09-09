---
patternId: 21
slug: proxy
title: Proxy
summary: Interpone un sustituto controlado delante de un servicio para regular acceso, cache, límites o políticas sin cambiar el consumidor.
family: foundations
legacyGroup: 4
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_21_proxy.ts
tags: [gof, structural, proxy, access-control]
related: [12, 16, 72]
combinesWith: [45, 48, 80]
antiPatterns:
  - Confiar en el proxy como única barrera de seguridad.
  - Ocultar latencia o fallos externos sin telemetría.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Proxy controla el acceso a otro objeto conservando una interfaz compatible. En IA puede aplicar rate limiting, cache, autenticación o fallback alrededor de un proveedor.

## Problema
Los consumidores no deberían implementar por separado políticas de acceso y resiliencia para cada llamada.

## Solución
El proxy recibe la solicitud, aplica controles y delega en el servicio real solo cuando procede.

## Aplicabilidad
Adecuado para APIs LLM compartidas, multi-tenant y servicios remotos. Mantén claras las diferencias entre proxy local y enforcement del backend.

## Seguridad
La autorización real debe existir en el boundary confiable. Un proxy cliente puede mejorar UX, pero no reemplaza enforcement server-side.

## Implementación del repositorio
`src/pattern_21_proxy.ts` demuestra control de acceso y limitación alrededor de un servicio.

## Relaciones
**Decorator (12)** añade comportamiento; **Facade (16)** simplifica; **Access Control (72)** define autorización; **Rate Limiting (80)** especializa una política.