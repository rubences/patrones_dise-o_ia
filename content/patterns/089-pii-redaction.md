---
patternId: 89
slug: pii-redaction
title: PII Redaction
summary: Reduce exposición de datos personales mediante redacción o pseudonimización consistente antes de enviar contenido a modelos, logs o servicios que no necesitan los valores originales.
family: safety-security
legacyGroup: 20
level: component
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_89_pii_redaction.ts
tags: [pii, privacy, redaction, pseudonymization]
related: [71, 51, 77]
combinesWith: [72, 100]
antiPatterns:
  - Llamar anonimización irreversible a un proceso que conserva un mapping de reidentificación.
  - Suponer que regex simples detectan toda PII o que cada coincidencia es realmente PII.
  - Guardar el mapping reversible junto al texto pseudonimizado sin controles adicionales.
references: []
---
# Propósito
PII Redaction elimina o pseudonimiza datos personales cuando el valor real no es necesario para la tarea.

## Terminología
El modo reversible es **pseudonimización**, no anonimización plena. Si existe un mapping que permite recuperar el dato, sigue habiendo riesgo de reidentificación y obligaciones de protección.

## Implementación del repositorio
`src/pattern_89_pii_redaction.ts` detecta mediante regex nombre de dos palabras capitalizadas, email, teléfono español, Visa-like, IPv4 textual y fechas `dd/mm/yyyy`. En modo `tokenizar` conserva mappings bidireccionales en memoria; en modo `redactar` reemplaza por marcadores genéricos.

Las expresiones son pedagógicas. No validan rangos IP o fechas, omiten muchos nombres/formatos internacionales y pueden producir falsos positivos. Los tokens son predecibles como `[EMAIL_1]` y el mapping desaparece al terminar el proceso.

## Producción
Define categorías según finalidad y jurisdicción, combina NER/detectores especializados con reglas, cifra o almacena mappings en un servicio separado, aplica TTL y controla reidentificación. Minimiza datos antes de llegar a este módulo siempre que sea posible.

## Relaciones
**Secret Detection (71)** protege credenciales; PII Redaction protege información personal. **Long-Term Memory (51)** necesita políticas especialmente estrictas de retención y borrado.