# Continuidad — Patrones IA Interactive Lab (21-11-2026)

## Acuerdos vinculantes
- Meta editorial: 365 patrones canónicos, 42 macrofamilias y 55 grupos; conservar la fuente de verdad en `main`.
- Archify individual para los 365 patrones, con diagramas específicos fundamentados en código y trazabilidad, nunca atribuir al esquema un comportamiento no implementado.
- Editor y simulación estructural para docencia y análisis, con conexiones tipadas (datos, control, herramientas, delegación, evidencias), persistencia local (IndexedDB, sin cuentas), informes JSON y HTML imprimible.
- Publicar en `main` solamente cambios probados; no confundir un PR abierto con algo integrado.

## Estado contrastado contra GitHub
- `main` (al inspeccionar): `a61fbc8345ffad7493b92b2f3c1416639950431c`.
- Integrados: navegación por macrofamilias (#37); editor local (#43), persistencia y operaciones del editor (#42–#48); simulación y estadísticas (#49–#52); filtros de aristas (#53); HTML imprimible (#56); ajuste de Pages (#57); primeros Archify (#39–#40).
- Pendientes: #58 (365 diagramas, borrador contra main); #59 (13 diagramas semánticos específicos para patrones 002–014, borrador sobre la rama de #58, NO contra main). El #54 fue sustituido por #58.
- #58 contiene diagramas con distinta profundidad: 5 revisados manualmente y 360 mapas esquemáticos; NO declarar los 365 como semánticamente validados. #59 avanza 13 patrones adicionales, con límites de implementación explícitos.

## Fallos observados
1. Workflow 'Deploy Patrones IA Web' run 44909116387: `actions/configure-pages@v5` falla en 'Setup Pages': primero 'Get Pages site failed: Not Found' y después 'Create Pages site failed: Resource not accessible by integration'. El intento #57 de usar `enablement: true` no basta para habilitar Pages con este token. Requiere intervención en Settings → Pages por alguien con permisos de administración, eligiendo GitHub Actions como origen (o un token con permisos adecuados); después re-ejecutar deploy. No repetir merges de parche para permisos del sitio.
2. PR #59, run 44909975868 (Editorial CI): falla el Astro build por `[UNRESOLVED_IMPORT] Could not resolve '../../../catalog/patterns.json' in src/pages/lab/index.astro`. Corregir rutas relativas en la rama correspondiente a partir de la ubicación real de `web/src/pages/lab/index.astro`, preferiblemente con alias o módulo de catálogo compartido; verificar todos los imports del PR y correr pruebas y build. Run 44909975912 Browser E2E falla en 'Build static website' por el mismo tipo de bloqueo; resolver build antes de analizar browser tests.

## Orden recomendado y gates
1. Arreglar import y ejecutar `npm ci`, tests, typecheck y build de Astro; comprobar #58 y #59 por separado en sus ramas.
2. Mantener #59 basado en #58 hasta que #58 esté integrado. Una vez CI verde, integrar #58 mediante merge a main; retarget #59 a main, revalidar CI y hacer merge con historial conservado.
3. Para cada patrón, etiquetar fidelidad del diagrama como `source-reviewed` o `schematic`, con fichero/líneas de origen, límites y comportamiento simulado o mock. Seguir sustituyendo mapas esquemáticos por diagramas específicos por lotes, sin inventar ejecuciones de LLM/herramientas.
4. Reparar la activación de Pages desde Settings, publicar desde main validado y comprobar rutas `/patterns/`, `/lab/`, `/lab/editor/` y Archify individual.
5. Mantener los informes reproducibles y aptos para aula: JSON estructural, HTML imprimible, advertencias metodológicas y trazas separadas de medidas de rendimiento real.

## Referencias
- PR #58: https://github.com/rubences/patrones_dise-o_ia/pull/58
- PR #59: https://github.com/rubences/patrones_dise-o_ia/pull/59
- Deploy fallido: https://github.com/rubences/patrones_dise-o_ia/actions/runs/44909116387
- CI fallido #59: https://github.com/rubences/patrones_dise-o_ia/actions/runs/44909975868
