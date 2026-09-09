---
patternId: 71
slug: secret-detection
title: Secret Detection
summary: Detecta y redacta credenciales o material sensible antes de registrarlo, enviarlo a terceros o devolverlo al usuario, con reglas específicas y tratamiento explícito de falsos positivos.
family: safety-security
legacyGroup: 16
level: component
difficulty: intermediate
maturity: established
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_71_secret_detection.ts
tags: [secrets, redaction, credentials, logging]
related: [89, 53, 77]
combinesWith: [100, 72]
antiPatterns:
  - Prometer detección completa de secretos mediante un conjunto fijo de regex.
  - Registrar el valor original del secreto en telemetría de detección.
  - Confundir redacción irreversible con tokenización reversible.
references: []
---
# Propósito
Secret Detection evita que credenciales, tokens y claves privadas atraviesen límites donde no son necesarias, especialmente logs, prompts o respuestas.

## Implementación del repositorio
`src/pattern_71_secret_detection.ts` utiliza regex para OpenAI keys, GitHub tokens, JWT, Bearer, passwords, connection strings, emails, teléfonos, tarjetas, private keys y un patrón genérico base64-like. Después reemplaza los hallazgos por marcadores.

El código **no implementa reversibilidad**, aunque el comentario introductorio la menciona. `SecretoDetectado` conserva `valorOriginal` en memoria para devolver el hallazgo al caller, pero no existe un vault o mapping de recuperación. El patrón genérico puede producir falsos positivos y las regex específicas no cubren todas las variantes reales de credenciales.

Además, email/teléfono/tarjeta son PII y conceptualmente encajan mejor con el patrón 89; mezclarlos aquí puede dificultar políticas de retención distintas.

## Producción
Combina detectores específicos de proveedor, entropía, allowlists y secret scanners mantenidos. Nunca vuelques `valorOriginal` a logs. Define fail-open/fail-closed según el canal y conserva solo metadata mínima del hallazgo.

## Relaciones
**PII Redaction (89)** cubre datos personales; Secret Detection se centra en credenciales y material de autenticación.