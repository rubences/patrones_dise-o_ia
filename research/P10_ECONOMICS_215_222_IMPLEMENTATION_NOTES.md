# P10.4 — AI Economics, Markets & Mechanism Design

Fecha: 2026-11-20. Estado: **investigación en main**; contratos y tests incorporados, sin ejecución verde de CI confirmada.

| ID | Mecanismo | Límite de interpretación |
|---|---|---|
| 215 | Reparto proporcional bajo presupuesto | No optimiza utilidad ni demuestra equidad |
| 216 | Subasta inversa de segundo precio simplificada | La compatibilidad de incentivos depende de supuestos no demostrados aquí; no usar para contratación real |
| 217 | Costes por uso y precio unitario | No reconcilia facturas ni mide costes indirectos |
| 218 | Regla de valor neto esperado | No estima incertidumbre ni evita manipulación |
| 219 | Umbral de diferencia absoluta entre grupos | Es una métrica proxy, no garantía de equidad |
| 220 | Alerta por dispersión relativa de precios | No prueba colusión ni conducta ilícita |
| 221 | Selección de información por beneficio menos coste | Beneficios asumidos, no estimados empíricamente |
| 222 | Balance de débitos y créditos con tolerancia | No es un sistema contable completo ni un ledger inmutable |

Código: `research/p10/economics/src/`. Pruebas: `tests/p10_economics_patterns.test.ts`. Typecheck: `research/p10/economics/tsconfig.json`.

## Evidencia a contrastar

- Vickrey (1961), *Counterspeculation, Auctions, and Competitive Sealed Tenders*.
- Myerson (1981), *Optimal Auction Design*.
- Literatura primaria de asignación justa, economía computacional y valor de la información; verificar DOI, supuestos y alcance.

## Gates de promoción

Comparación con `production-finops` y `multi-agent`; fichas canónicas completas; modelo de amenazas y abuso de incentivos; pruebas adversariales; revisión de evidencia y CI verde. No afirmar estrategia dominante, ausencia de colusión ni equidad certificada sin demostración formal y supuestos explícitos.

El catálogo productivo sigue siendo 190 patrones y 22 macrofamilias; P10 reúne 32 candidatos distribuidos en cuatro familias en `research/p10`.
