# Integrar Voreal UI con Next.js

Voreal conserva una frontera neutral: no importa `next/link` ni `next/image`, por lo que el mismo paquete funciona en Next.js, Vite y otros hosts React.

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
