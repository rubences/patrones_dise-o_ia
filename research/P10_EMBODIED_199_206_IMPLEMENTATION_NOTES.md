# P10.2 — Multimodal & Embodied Agent Systems

Fecha: 2026-11-20. Estado: **investigación**, no catálogo canónico. Ocho contratos TypeScript 199–206, pruebas y typecheck CI incorporados; resultado de ejecución aún no confirmado.

| ID | Contrato | Limitación crítica |
|---|---|---|
| 199 | Media ponderada por confianza de sensores | No calibra probabilidades ni modela dependencia entre sensores |
| 200 | Rechazo de percepciones obsoletas o poco confiables | No ejecuta actuadores ni garantiza seguridad física |
| 201 | Límites numéricos de velocidad y fuerza | No incluye dinámica, trayectorias, distancias ni frenado de emergencia |
| 202 | Alineación temporal dentro de tolerancia | No corrige desfase de relojes ni latencias de red |
| 203 | Registro y autorización de habilidades | Retorna simulación, nunca control físico |
| 204 | Predicción de posición y mezcla con observación | No es un filtro de Kalman ni un estimador validado |
| 205 | Error absoluto medio simulado-observado | No demuestra transferencia robusta sim-to-real |
| 206 | Bloqueo por parada humana y rearme autorizado | No es un circuito E-stop certificado ni tolerante a fallos |

Código: `research/p10/embodied/src/`. Pruebas: `tests/p10_embodied_patterns.test.ts`. Typecheck: `research/p10/embodied/tsconfig.json`.

## Modelo de amenazas

Percepciones manipuladas, confianza mal calibrada, datos obsoletos, saturación de actuadores, comandos no autorizados, fallos de sincronización y pérdida de capacidad de parada. La seguridad física debe depender de hardware y controladores independientes, no de estos contratos educativos.

## Evidencia preliminar a revisar

- Ahn et al., *Do As I Can, Not As I Say: Grounding Language in Robotic Affordances* (2022).
- Brohan et al., *RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control* (2023).
- Literatura de seguridad funcional y normas de robótica aplicables al dominio, pendientes de identificar y verificar.

No registrar estas fuentes como validación de implementación sin verificar correspondencia específica y alcance.

## Criterios de promoción

Fichas canónicas, diferenciación respecto a patrón 50 y edge, pruebas de escenarios físicos simulados, modelo de amenazas, resultados CI verificables y revisión de evidencia. Mantener catálogo productivo en 190 patrones/22 macrofamilias hasta completar gates.
