# Voreal UI

Voreal UI `0.2.0` es un sistema visual React reutilizable para directorios modernos. La identidad principal es **Mercado contemporáneo** de Red Latina 360: marfil cálido, azul profundo, coral de acción y verde comunitario, sin mezclar la dirección morada/naranja descartada. `mercado-nocturno` ofrece una variante oscura del mismo lenguaje visual.

El paquete combina CSS encapsulado y tokens semánticos, Tailwind CSS v4 para utilidades acotadas, y Radix Primitives para interacción accesible. Incluye componentes base, patrones públicos de directorio y una superficie administrativa compacta.

La nueva referencia de tarjetas se mantiene separada como [Voreal Next (experimental)](docs/VOREAL_NEXT.md) y requiere consumo opt-in; Voreal actual continúa siendo el valor predeterminado.

## Requisitos

- React y React DOM `>=18.3 <20`.
- Un bundler que procese TypeScript/TSX y CSS Imports; Next.js App Router es compatible.
- Las dependencias Radix y Tailwind declaradas en este repositorio cuando se consume como workspace.
- Navegadores compatibles con Tailwind CSS v4. En navegadores algo anteriores, Voreal conserva contenido, navegación, foco y acciones; algunos efectos de `color-mix()` pueden degradarse visualmente.

## Instalar como carpeta o paquete local

Como workspace, coloca el repositorio en `packages/voreal-ui` y declara:

```json
{
  "dependencies": {
    "@voreal/ui": "workspace:*"
  }
}
```

Para una adopción por copia —la ruta recomendada para la primera migración de Red Latina— copia todo `src` sin seleccionar archivos sueltos:

```bash
mkdir -p src/voreal
cp -R ../Voreal-ui/src/. src/voreal/
```

Esto conserva imports relativos, tokens, temas, portales y estilos. El archivo público será `src/voreal/index.ts` y el CSS `src/voreal/styles/index.css`.

Para consumir Voreal desde otro repositorio, fija una versión, etiqueta o commit verificado; no apuntes a `main`. Este paquete conserva `private: true` y no se publica en npm.

## Orden exacto de estilos

En un paquete local:

```css
/* app/globals.css */
@import "@voreal/ui/styles.css";
@import "./vendor.css" layer(vendor);
@import "./app-overrides.css" layer(app);
```

En una copia dentro del host:

```css
@import "../voreal/styles/index.css";
@import "./vendor.css" layer(vendor);
@import "./app-overrides.css" layer(app);
```

Voreal declara el orden `vr-reset → vendor → vr-tokens → vr-base → vr-components → vr-utilities → app`. Mantén overrides del producto en `layer(app)` y evita `!important`.

## Raíz, tema y densidad

```tsx
import { VorealRoot } from "@voreal/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <VorealRoot density="comfortable" theme="red-latina">
          {children}
        </VorealRoot>
      </body>
    </html>
  );
}
```

Usa `comfortable` en el directorio público y `compact` en administración. También puedes aplicar ambas densidades a subárboles distintos.

## Portales Radix

Los overlays exportados por Voreal (`Dialog`, `Drawer`, `Popover`, `Select`, `Toast` y `Tooltip`) copian automáticamente tema y densidad al portal. Para un portal propio:

```tsx
"use client";

import { createPortal } from "react-dom";
import { useVorealPortalProps } from "@voreal/ui/primitives";

export function PortalPropio({ children }: { children: React.ReactNode }) {
  const portalProps = useVorealPortalProps();
  return createPortal(<div {...portalProps}>{children}</div>, document.body);
}
```

El orden de capas reserva los niveles superiores para listas desplegables y popovers, por lo que un `Select` abierto dentro de un `Drawer` o `Dialog` permanece visible y operable.

## Next.js App Router

Voreal no depende de Next.js. Pasa `next/link` a los patrones con navegación y compón `next/image` dentro de `MediaFrame`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { MediaFrame } from "@voreal/ui/content/media-frame";
import { BusinessCard } from "@voreal/ui/patterns/directory";

<BusinessCard
  LinkComponent={Link}
  business={business}
  media={
    <MediaFrame alt={business.image.alt} aspectRatio="16 / 10" fallback="SC">
      <Image alt={business.image.alt} fill sizes="(max-width: 48rem) 100vw, 38vw" src={business.image.src} />
    </MediaFrame>
  }
/>
```

`AdminShell` acepta el mismo `LinkComponent`. Para tarjetas genéricas usa `<CardLink asChild><Link href="…">…</Link></CardLink>`. Consulta [Integración con Next.js](docs/NEXTJS.md).

## Búsqueda de directorio server-first

El formulario de búsqueda es server-safe y usa `GET`, de modo que el directorio funciona sin JavaScript. En un Server Component de Next.js, convierte los parámetros, interpreta los nombres canónicos (`q`, `location`, `category`, `sort`, `page`) y entrega el estado al formulario:

```tsx
import {
  parseDirectorySearchParams,
} from "@voreal/ui/patterns/directory/search-state";
import {
  DirectorySearchForm,
} from "@voreal/ui/patterns/directory/search-form";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") params.set(key, value);
  }
  const search = parseDirectorySearchParams(params);

  return (
    <>
      <DirectorySearchForm action="/directorio" defaultValue={search} />
      <p>{search.query ? `Resultados para ${search.query}` : "Explora negocios"}</p>
    </>
  );
}
```

Las sugerencias son una mejora opcional de cliente. Compón `DirectorySearchSuggestions` en `queryControl`; el cargador recibe un `AbortSignal`, que debe reenviarse a `fetch` para cancelar solicitudes sustituidas:

```tsx
"use client";

import { DirectorySearchForm } from "@voreal/ui/patterns/directory/search-form";
import { DirectorySearchSuggestions } from "@voreal/ui/patterns/directory/search-suggestions";
import type {
  DirectorySearchState,
  DirectorySuggestionGroup,
  DirectorySuggestionLoader,
} from "@voreal/ui/patterns/directory";

const loadSuggestions: DirectorySuggestionLoader = async (request, signal) => {
  const params = new URLSearchParams({
    q: request.query,
    location: request.location,
  });
  if (request.category) params.set("category", request.category);
  const response = await fetch(`/api/directory/suggestions?${params}`, { signal });
  if (!response.ok) throw { kind: "network", code: `HTTP_${response.status}` };
  return response.json() as Promise<readonly DirectorySuggestionGroup[]>;
};

export function DirectorySearchWithSuggestions({
  initialSearch,
}: {
  initialSearch: DirectorySearchState;
}) {
  return (
    <DirectorySearchForm
      action="/directorio"
      defaultValue={initialSearch}
      queryControl={(
        <DirectorySearchSuggestions
          defaultValue={initialSearch.query}
          loadSuggestions={loadSuggestions}
          name="q"
        />
      )}
    />
  );
}
```

Desde el Server Component, pasa el mismo estado ya interpretado: `<DirectorySearchWithSuggestions initialSearch={search} />`. Así una visita directa o un enlace compartido restaura tanto el formulario como la consulta controlada de sugerencias; `defaultValue` solo establece ese estado inicial y el envío `GET` sigue siendo la confirmación canónica.

El host decide si consume `onSearchEvent` para su analítica. Los eventos y diagnósticos locales tipados de Voreal no incluyen `raw query text` (texto de consulta sin procesar); no envíes la consulta a telemetría salvo que tu política de privacidad lo permita.

## Tablas en servidor y cliente

- `StaticDataTable` no incluye eventos y puede renderizarse desde un Server Component.
- `DataTable` declara su frontera de cliente e incorpora selección y ordenamiento controlados.
- `Table` conserva el desplazamiento horizontal dentro de una región accesible sin ensanchar la página.

## Imports reducibles por árbol

El entry principal es ESM y permite tree shaking. Para límites de bundle más explícitos usa subrutas:

```tsx
import { Button, PathButton } from "@voreal/ui/button";
import { Field, Input, Select } from "@voreal/ui/form";
import { BusinessCard, DirectorySearch } from "@voreal/ui/patterns/directory";
import { AdminShell, PublicationStatus } from "@voreal/ui/patterns/admin";
```

## Verificación

```bash
pnpm test
pnpm test:a11y
pnpm typecheck
pnpm lint:css
pnpm audit:css
pnpm audit:next-css
pnpm build
pnpm build-storybook
pnpm test:e2e
pnpm test:e2e:next
pnpm budget:search-css
pnpm budget:next-directory-css
pnpm budget:next-css
pnpm budget:css
```

`audit:css` falla ante colores de marca fuera de tokens/temas, `!important`, colores arbitrarios Tailwind y `z-index` numéricos. Para auditar CSS heredado sin bloquear todavía: `node scripts/audit-css.mjs ../red-latina/src --report`.

## Documentación

- [Temas](docs/THEMING.md)
- [Integración con Next.js](docs/NEXTJS.md)
- [Voreal Next (experimental)](docs/VOREAL_NEXT.md)
- [Migración desde CSS heredado](docs/MIGRATION.md)
- [Decisiones](DECISIONS.md)
- [Especificación aprobada](docs/specs/voreal-ui-design.md)
- [Plan de implementación](docs/plans/voreal-ui-implementation.md)

El código fuente del repositorio es público. El campo `private: true` de `package.json` evita una publicación accidental en npm; distribuirlo públicamente como paquete sigue requiriendo una decisión de versión y licencia.
