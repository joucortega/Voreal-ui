# Voreal Next (experimental)

Voreal Next es una superficie visual opt-in y aislada para validar el nuevo directorio de tarjetas. El Voreal actual continúa siendo la implementación predeterminada: sus imports, estilos, componentes y temas no cambian.

## Consumo opt-in

Importa el root, el patrón y la hoja de estilos únicamente desde sus subrutas nuevas:

```tsx
import { VorealNextRoot } from "@voreal/ui/next";
import { NextDirectoryLayout } from "@voreal/ui/next/patterns/directory";
import "@voreal/ui/next/styles.css";

export function DirectoryPage() {
  return (
    <VorealNextRoot>
      <NextDirectoryLayout
        filters={filters}
        header={header}
        resultsHeader={resultsHeader}
        search={search}
      >
        {results}
      </NextDirectoryLayout>
    </VorealNextRoot>
  );
}
```

`VorealNextRoot` aplica `data-voreal-ui="next"` solo a su propio subárbol. Los portales internos reciben `data-vrn-portal`; no se escriben atributos ni resets sobre `html` o `body`.

## Orden de CSS y aislamiento

`@voreal/ui/next/styles.css` declara y carga, en este orden, las capas `vrn-reset`, `vrn-tokens`, `vrn-components`, `vrn-patterns` y `vrn-utilities`. Cárgala antes de los overrides de la aplicación:

```css
@import "@voreal/ui/next/styles.css";
@import "./app-overrides.css" layer(app);
```

Mantén los overrides del producto en una capa posterior. Todas las clases de esta superficie empiezan con `.vrn-` y sus variables con `--vrn-`; no importes `@voreal/ui/styles.css` para renderizar únicamente Voreal Next.

## Adaptadores de Next.js

Los componentes no dependen de Next.js. Inyecta `next/link` donde existe navegación y `next/image` en las tarjetas para conservar navegación cliente, optimización y estabilidad de dimensiones:

```tsx
import Image from "next/image";
import Link from "next/link";
import {
  NextDirectoryBusinessCard,
  NextDirectoryHeader,
  type NextDirectoryBusiness,
} from "@voreal/ui/next/patterns/directory";

const business: NextDirectoryBusiness = {
  id: "martinez-tax",
  name: "Martínez Tax Services",
  category: "Impuestos y contabilidad",
  location: "Dundalk, MD",
  href: "/negocios/martinez-tax",
  image: {
    alt: "Preparación de documentos contables",
    src: "/images/martinez-tax.webp",
    width: 960,
    height: 640,
  },
};

<NextDirectoryHeader
  LinkComponent={Link}
  brand={<Link href="/" aria-label="Inicio">Voreal</Link>}
  navItems={[{ href: "/recursos", label: "Recursos" }]}
  primaryAction={{ href: "/listar-negocio", label: "Listar mi negocio" }}
/>;

<NextDirectoryBusinessCard
  business={business}
  ImageComponent={Image}
  LinkComponent={Link}
/>;
```

Los datos de imagen siempre incluyen `width`, `height` y `alt`; el componente mantiene el marco `3:2` mientras carga. Los assets de demostración bajo `public/voreal-next` pertenecen a Storybook y no son una dependencia del paquete.

## Referencias de Storybook

La composición completa vive en `Next/Patterns/Directory Reference`:

- `Cards`: referencia principal.
- `Mobile 375` y `Tablet 768`: tamaños de revisión.
- `Loading`, `No Results`, `Error`, `Long Content` y `Missing Image`: estados y casos límite.

La suite aislada se ejecuta con `pnpm test:e2e:next` en Chromium, Firefox y WebKit. Las comparaciones visuales son únicamente Chromium y usan 375, 768, 1024 y 1440 px. La configuración Playwright predeterminada excluye expresamente este spec, por lo que `pnpm test:e2e` conserva solo las 29 pruebas legacy y no duplica el costo ni adelanta los baselines de Voreal Next.

Cuando esta suite falla en GitHub Actions, CI conserva `test-results/` y `playwright-report/` en el artifact `voreal-next-playwright-diagnostics`. Ese artifact sirve para diagnosticar fallos cross-browser y revisar los PNG reales antes de aceptar o actualizar un baseline; no sustituye ningún gate.

## Puerta de aprobación

Voreal Next sigue siendo experimental. No migres Red Latina, no cambies el entry point `@voreal/ui`, no sustituyas el CSS actual y no lleves otras familias de componentes al lenguaje `.vrn-*` hasta que el usuario apruebe explícitamente la referencia completa del directorio en móvil y escritorio.
