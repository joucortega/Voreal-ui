# Integrar Voreal UI con Next.js

Voreal conserva una frontera neutral: no importa `next/link` ni `next/image`, por lo que el mismo paquete funciona en Next.js, Vite y otros hosts React.

## Búsqueda de directorio con URL canónica

El formulario server-safe usa `GET`, conserva los parámetros canónicos (`q`, `location`, `category`, `sort`, `page`) y no necesita una mejora de cliente para buscar. Este Server Component lee `searchParams`, normaliza el estado y devuelve un formulario funcional:

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

## Sugerencias opcionales en un Client Component

Mantén el cargador y la composición de sugerencias en un archivo con `"use client"`. `DirectorySearchSuggestions` se inserta mediante `queryControl`; sus sugerencias no cambian la URL hasta el envío nativo del formulario. Reenvía el `AbortSignal` recibido a `fetch` para que una consulta sustituida pueda cancelarse:

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

Renderiza este wrapper desde el Server Component con `<DirectorySearchWithSuggestions initialSearch={search} />`, usando el mismo `search` producido por `parseDirectorySearchParams`. Compartir o abrir directamente una URL canónica restaura así los valores nativos del formulario y la consulta controlada del combobox. Ambos `defaultValue` son iniciales: la URL solo cambia cuando el usuario confirma mediante el envío `GET`.

El host elige si conecta `onSearchEvent` a analítica. Los diagnósticos locales tipados de Voreal excluyen `raw query text` (texto de consulta sin procesar) por defecto; aplica la política de privacidad del producto antes de registrar datos adicionales. Fija una versión, etiqueta o commit verificado al consumir el paquete y no sigas `main`.

## Navegación sin recargas completas

Pasa `Link` de Next a los patrones que generan destinos:

```tsx
import Link from "next/link";
import { AdminShell } from "@voreal/ui/patterns/admin";
import { BusinessCard } from "@voreal/ui/patterns/directory";

<AdminShell LinkComponent={Link} current="businesses" items={items}>
  {children}
</AdminShell>

<BusinessCard LinkComponent={Link} business={business} />
```

Para una tarjeta enlazada genérica, `asChild` coloca estilos y estados sobre el enlace del router:

```tsx
import Link from "next/link";
import { CardLink } from "@voreal/ui/content";

<CardLink asChild padding="lg">
  <Link href="/negocios">Explorar negocios</Link>
</CardLink>
```

## Imágenes optimizadas y estables

`MediaFrame` es server-safe y reserva la relación de aspecto antes de descargar la imagen. Esto evita saltos de layout y permite que Next conserve optimización, `sizes` y carga diferida:

```tsx
import Image from "next/image";
import { MediaFrame } from "@voreal/ui/content/media-frame";

<MediaFrame alt="Interior de Sabor de Casa" aspectRatio="16 / 10" fallback="SC">
  <Image
    alt="Interior de Sabor de Casa"
    fill
    sizes="(max-width: 48rem) 100vw, 38vw"
    src={photo}
  />
</MediaFrame>
```

En `BusinessCard`, entrega ese árbol mediante `media`. Si no lo haces, el componente usa `Media`, la opción cliente basada en `<img>` con fallback automático.

## Fronteras de datos

Usa `StaticDataTable` cuando la tabla se resuelve completamente en el servidor. Usa `DataTable` dentro de un Client Component cuando necesites selección u ordenamiento; sus callbacks y estado no deben cruzar la frontera de serialización.

```tsx
// Server Component
import { StaticDataTable } from "@voreal/ui/data/static";

export function DirectorySnapshot({ rows }: Props) {
  return <StaticDataTable columns={columns} getRowKey={(row) => row.id} label="Negocios" rows={rows} />;
}
```

Importa `@voreal/ui/styles.css` una sola vez desde el layout raíz. `VorealRoot` puede vivir dentro de `<body>` y copiará tema/densidad a los portales Radix.
