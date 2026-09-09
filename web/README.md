# Patrones IA — Web

Sitio estático generado con Astro. Consume directamente las fichas canónicas de `../content/patterns/` mediante Content Collections.

## Desarrollo local

```bash
cd web
npm install
npm run dev
```

## Build

```bash
cd web
npm install
npm run build
```

El resultado estático se genera en `web/dist/`.

## GitHub Pages

El proyecto está configurado para publicarse en:

```text
https://rubences.github.io/patrones_dise-o_ia/
```

El workflow `deploy-web.yml` construye y despliega la web al hacer push a `main` o mediante ejecución manual.

En GitHub, la primera vez hay que seleccionar **Settings → Pages → Source: GitHub Actions**.

## Contenido

No dupliques fichas dentro de `web/`. Para añadir un patrón:

1. copia `content/templates/pattern-template.md`;
2. crea `content/patterns/NNN-slug.md`;
3. completa el frontmatter;
4. ejecuta `node scripts/validate-editorial.mjs`;
5. ejecuta `npm run build` desde `web/`.

La compilación de Astro valida el esquema definido en `web/src/content.config.ts`.
