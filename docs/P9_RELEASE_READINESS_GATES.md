# P9 — Release readiness gates for 222 patterns

Fecha: 2026-11-20. Estado: **NO VERIFICADO**. Esta lista describe comprobaciones integradas en CI, no resultados de ejecución.

## Gates requeridos

1. Integridad editorial: `node scripts/validate-editorial.mjs` y `node scripts/validate-catalog-integrity.mjs`.
2. Consistencia de repositorio, publicaciones y registro de evidencia: validadores `scripts/validate-*.mjs` del workflow.
3. Compilación estática de los 222 módulos TypeScript: `npx tsc --noEmit --project tsconfig.json` (incorporado al CI).
4. Tests de regresión: `tests/hardening/*.test.ts`, `tests/p8_interoperability_contracts.ts`, `tests/p9_catalog_contracts.ts` y suites P9 de memoria, gobierno, datos, edge, causalidad y seguridad.
5. Build de Astro, Quarto y artefactos de publicaciones según `.github/workflows/web-ci.yml`.
6. Confirmar la ejecución verde y los artefactos en GitHub Actions antes de etiquetar una release como verificada.

## Diferenciación de indicadores

- **Cobertura de catálogo**: 222 registros y fichas, 26 macrofamilias.
- **Cobertura de evidencia primaria**: 54 asociaciones de patrones y 51 referencias mínimas de P7.0; no implica que las implementaciones reproduzcan resultados publicados.
- **Evidencia editorial**: estados `needs-review` y `partially-verified` del catálogo; no equivalen directamente a las asociaciones del registro.
- **Validación de implementación**: typecheck, tests, benchmarks e integraciones por patrón. No debe inferirse de `implementationStatus: implemented`.

## Bloqueantes conocidos

- No hay resultado verificado de CI para la última revisión.
- Algunos contratos son demostraciones pedagógicas y requieren pruebas de integración/benchmarks para afirmaciones de producción.
- La clasificación de evidencia requiere reconciliación semántica, sin modificar artificialmente el baseline.

## Criterio de publicación

No declarar release estable, seguridad certificada, rendimiento medido o cumplimiento regulatorio sin resultados reproducibles y evidencia asociada. Un build verde prueba los gates definidos, no propiedades que los gates no evalúan.

## Pipeline técnico independiente (20-11-2026)

Se ha añadido `.github/workflows/patterns-code-ci.yml` para ejecutar de forma separada validación editorial, integridad referencial, `tsc --noEmit`, contratos P8/P9, regresiones de seguridad e informe de calidad. Se activa con cambios en código, catálogo o tests, y admite `workflow_dispatch` para ejecución manual desde GitHub Actions. Este workflow no sustituye al principal de Quarto/Astro y publicación. **El resultado de ejecución sigue pendiente de confirmación**; crear un workflow no demuestra que pase.

## P10 incorporado al catálogo principal (20-11-2026)

Los patrones 191–222 y las cuatro nuevas macrofamilias están registrados en `catalog/patterns.json` y `catalog/taxonomy.json`, con 32 archivos `src/pattern_*.ts`, 32 fichas `content/patterns/*.md`, exportaciones públicas y scripts de ejecución. La versión de metadatos del paquete es **20.0.0**. Los contratos siguen siendo experimentales y `needs-review`; la inclusión en el catálogo **no implica certificación ni validación científica**.

El catálogo tiene **222 patrones, 26 macrofamilias y 39 grupos**. El registro mantiene **54 asociaciones de evidencia primaria y 51 referencias** sin atribuir evidencia nueva no verificada.

**Bloqueante:** todavía no hay ejecución CI satisfactoria confirmada para esta integración; verificar tanto el workflow técnico como el editorial antes de declarar release estable.
