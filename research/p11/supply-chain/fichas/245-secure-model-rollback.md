# 245 — Secure Model Rollback

**Familia candidata:** AI Supply Chain & Model Artifact Security · **Estado:** investigación en main, no catálogo canónico.

## Propósito

Secure Model Rollback introduce un contrato de control específico para procedencia, integridad, licencias o recuperación segura de artefactos de IA.

## Implementación de referencia

`research/p11/supply-chain/src/pattern_245_secure_model_rollback.ts` y pruebas en `tests/p11_supply_chain_patterns.test.ts`.

## Amenazas y límites

Considerar sustitución de pesos, metadatos falsificados, pérdida de confianza en firmantes, dependencias no declaradas, licencias incompatibles, rollback malicioso y manipulaciones en el pipeline. Una huella SHA-256 no demuestra procedencia por sí sola. La verificación de firma requiere un ancla de confianza y gestión de claves externas. Las reglas de licencia requieren revisión jurídica. Los flags de verificación externos no constituyen atestación criptográfica.

## Criterios de promoción

Revisión de duplicidades con seguridad y gobernanza, evidencia primaria verificada, modelo de amenazas, pruebas negativas, CI verde, integración con artefactos reales y ficha editorial canónica.
