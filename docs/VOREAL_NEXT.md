# Voreal Next (experimental)

Voreal Next es la API opt-in, reusable y temable de `@voreal/ui`. El Voreal actual continúa siendo la implementación predeterminada: `@voreal/ui`, sus componentes, estilos y temas legacy no cambian. El paquete sigue marcado `private`; “publicar” aquí significa estabilizar sus exports para consumo por workspace, copia o commit fijado, no publicarlo en npm.

## Inicio rápido

Importa una sola vez la hoja de estilos, monta un root alrededor de la isla visual y consume componentes desde la subruta de su familia:

```tsx
import { VorealNextRoot } from "@voreal/ui/next";
import { NextButton } from "@voreal/ui/next/components/actions";
import "@voreal/ui/next/styles.css";

export function App() {
  return (
    <VorealNextRoot theme="red-latina">
      <NextButton>Publicar negocio</NextButton>
    </VorealNextRoot>
  );
}
```

`theme` solamente escribe `data-vrn-theme`; el consumidor define las variables de ese nombre como se muestra más adelante. Si no necesitas una identidad propia, omite `theme` y usa los tokens predeterminados.

Las entradas públicas del núcleo son:

| Familia | Import |
| --- | --- |
| Acciones | `@voreal/ui/next/components/actions` |
| Contenido | `@voreal/ui/next/components/content` |
| Feedback | `@voreal/ui/next/components/feedback` |
| Formularios | `@voreal/ui/next/components/forms` |
| Navegación | `@voreal/ui/next/components/navigation` |
| Overlays | `@voreal/ui/next/components/overlays` |
| Estado | `@voreal/ui/next/components/status` |

Los barrels por familia son estables. Los archivos internos como `forms.tsx` o `navigation.client.tsx` no son entradas públicas.

## Root, aislamiento y orden de capas

`VorealNextRoot` aplica `data-voreal-ui="next"` solo a su propio subárbol. Las clases usan `.vrn-*`, las variables `--vrn-*` y los portales `data-vrn-portal`. No se escriben atributos ni resets sobre `html` o `body`.

`@voreal/ui/next/styles.css` declara, en este orden, `vrn-reset`, `vrn-tokens`, `vrn-components`, `vrn-patterns` y `vrn-utilities`. Carga los estilos del consumidor después:

```css
@import "@voreal/ui/next/styles.css";

@layer app-theme {
  /* Tema y overrides del producto. */
}
```

Si el host declara un orden global, conserva las cinco capas en ese orden y sitúa su capa al final:

```css
@layer vrn-reset, vrn-tokens, vrn-components, vrn-patterns, vrn-utilities, app-theme;
```

No importes `@voreal/ui/styles.css` para una pantalla que solo usa Voreal Next. Voreal Next no necesita Tailwind en runtime y puede convivir con CSS Modules, Tailwind o CSS tradicional mientras los overrides permanezcan fuera de las capas `vrn-*`.

## Tema mediante tokens

Un tema cubre tanto el root como los portales; pasa el mismo nombre en la prop `theme` de cada dialog o drawer. En el patrón de directorio, `NextDirectoryHeader` lo reenvía al drawer de navegación móvil y `NextDirectoryFilterDrawer` lo reenvía a su propio portal. Este ejemplo Red Latina es una receta de integración, no un segundo tema oficial exportado por el paquete:

```css
@layer app-theme {
  [data-voreal-ui="next"][data-vrn-theme="red-latina"],
  [data-vrn-portal][data-vrn-theme="red-latina"] {
    --vrn-color-canvas: #fff9ef;
    --vrn-color-surface: #fff;
    --vrn-color-surface-muted: #f5ecdf;
    --vrn-color-surface-raised: #fff;
    --vrn-color-ink: #071b46;
    --vrn-color-text-muted: #56617a;
    --vrn-color-text-subtle: #7f7668;
    --vrn-color-border: #dfd1bd;
    --vrn-color-border-strong: #b9a88e;

    --vrn-color-action: #b9371e;
    --vrn-color-action-hover: #a92f19;
    --vrn-color-action-active: #8f2614;
    --vrn-color-action-soft: #f9ded5;
    --vrn-color-on-action: #fff;
    --vrn-color-focus: #0b57d0;

    --vrn-color-success: #217a38;
    --vrn-color-success-soft: #ddf8e5;
    --vrn-color-warning: #8a5200;
    --vrn-color-warning-soft: #fff0c7;
    --vrn-color-danger: #a92f19;
    --vrn-color-danger-soft: #f9ded5;
    --vrn-color-info: #b9371e;
    --vrn-color-info-soft: #f9ded5;
  }
}
```

Antes de aprobar otros valores, valida el contrato exacto que renderiza Theme Lab. Los 27 pares de texto requieren `4.5:1`; solo los tres pares marcados como límites no textuales usan `3:1`:

| ID del par | Primer plano | Fondo | Tipo | Mínimo |
| --- | --- | --- | --- | --- |
| `ink-on-canvas` | ink | canvas | texto | 4.5:1 |
| `ink-on-surface` | ink | surface | texto | 4.5:1 |
| `ink-on-surface-muted` | ink | surface-muted | texto | 4.5:1 |
| `ink-on-action-soft` | ink | action-soft | texto | 4.5:1 |
| `ink-on-success-soft` | ink | success-soft | texto | 4.5:1 |
| `ink-on-warning-soft` | ink | warning-soft | texto | 4.5:1 |
| `ink-on-danger-soft` | ink | danger-soft | texto | 4.5:1 |
| `text-muted-on-canvas` | text-muted | canvas | texto | 4.5:1 |
| `text-muted-on-surface` | text-muted | surface | texto | 4.5:1 |
| `text-muted-on-surface-muted` | text-muted | surface-muted | texto | 4.5:1 |
| `action-on-canvas` | action | canvas | texto | 4.5:1 |
| `action-on-surface` | action | surface | texto | 4.5:1 |
| `action-on-surface-muted` | action | surface-muted | texto | 4.5:1 |
| `action-on-action-soft` | action | action-soft | texto | 4.5:1 |
| `action-on-success-soft` | action | success-soft | texto | 4.5:1 |
| `action-on-warning-soft` | action | warning-soft | texto | 4.5:1 |
| `action-on-danger-soft` | action | danger-soft | texto | 4.5:1 |
| `action-hover-on-action-soft` | action-hover | action-soft | texto | 4.5:1 |
| `on-action-on-action` | on-action | action | texto | 4.5:1 |
| `on-action-on-action-hover` | on-action | action-hover | texto | 4.5:1 |
| `success-on-success-soft` | success | success-soft | texto | 4.5:1 |
| `warning-on-warning-soft` | warning | warning-soft | texto | 4.5:1 |
| `warning-on-canvas` | warning | canvas | texto | 4.5:1 |
| `warning-on-surface` | warning | surface | texto | 4.5:1 |
| `danger-on-danger-soft` | danger | danger-soft | texto | 4.5:1 |
| `danger-on-canvas` | danger | canvas | texto | 4.5:1 |
| `danger-on-surface` | danger | surface | texto | 4.5:1 |
| `focus-on-canvas` | focus | canvas | límite no textual | 3:1 |
| `focus-on-surface` | focus | surface | límite no textual | 3:1 |
| `text-subtle-on-surface` | text-subtle | surface | límite no textual | 3:1 |

Los nombres de la tabla omiten el prefijo común `--vrn-color-`. Los 23 tokens de la receta son el inventario semántico público exacto; aliases de compatibilidad como `primary`, `primary-soft`, `clay` y `control-boundary` son internos y se derivan de esos tokens. `border` y `border-strong` son divisores decorativos; `text-subtle` aporta el contraste del límite de controles. Cambiar valores personalizados transfiere al consumidor la validación de contraste. `Next/Foundations/Theme Lab` renderiza los 23 tokens y exporta sus 30 pares de contraste para el tema predeterminado y el ejemplo local Red Latina.

## Server Components y módulos cliente

Los módulos estáticos no contienen `"use client"`, hooks, Radix, red ni persistencia:

- server-safe: root; container, stack, cluster, grid, divider, surface, section y tipografía; acciones estáticas; input, select, textarea, field, input group, checkbox y form summary; breadcrumbs, navigation rail y stepper estático; badge y tag; alert, progress, skeleton y empty state; avatar, rating y review summary;
- client-only: radio group, switch, tabs, dialog, drawer y dialog close; también el host que pase `onStepChange` al stepper;
- patrones del directorio: layout, tarjeta, media, paginación, búsqueda y estados mantienen su frontera server-safe; filtros interactivos y overlays pertenecen al cliente.

Los imports públicos siguen siendo los barrels por familia. En Next.js, importa un componente client-only desde un archivo host que declare `"use client"`; un Server Component puede renderizar los componentes server-safe siempre que no intente pasarles callbacks desde el servidor.

```tsx
import { NextAlert } from "@voreal/ui/next/components/feedback";
import { NextHeading, NextSurface } from "@voreal/ui/next";

export function ServerSummary() {
  return (
    <NextSurface>
      <NextHeading as="h2" size="card">Estado de publicación</NextHeading>
      <NextAlert title="Listo para revisar" tone="success">
        Todos los campos obligatorios están completos.
      </NextAlert>
    </NextSurface>
  );
}
```

`NextStepper` se exporta desde el módulo server-safe de navegación. Sin `onStepChange`, un import desde el barrel público no arrastra Tabs, Radix ni un módulo con `"use client"`; para hacerlo editable, colócalo en un host cliente y pasa el callback.

## Formularios controlados y no controlados

Los controles nativos aceptan sus atributos React habituales, por ejemplo `defaultValue` para estado no controlado o `value` más `onChange` para estado controlado. `NextField` recibe exactamente un `NextInput`, `NextSelect`, `NextTextarea` o control nativo; `NextInputGroup` se etiqueta por separado.

Radio y switch siguen el mismo principio mediante `defaultValue`/`value` y `defaultChecked`/`checked`. El control padre debe vivir en cliente cuando administra estado:

```tsx
"use client";

import { useState } from "react";
import {
  NextRadioGroup,
  NextSwitch,
} from "@voreal/ui/next/components/forms";

export function Preferences() {
  const [visibility, setVisibility] = useState("public");
  const [messages, setMessages] = useState(true);

  return (
    <form>
      <NextRadioGroup
        label="Visibilidad"
        name="visibility"
        onValueChange={setVisibility}
        options={[
          { label: "Público", value: "public" },
          { label: "Borrador", value: "draft" },
        ]}
        value={visibility}
      />
      <NextSwitch
        checked={messages}
        label="Aceptar mensajes"
        name="messages"
        onCheckedChange={setMessages}
      />
    </form>
  );
}
```

Voreal no envía el formulario ni decide validación de negocio, autorización, guardado o publicación; el host conserva esas responsabilidades.

Los composites conservan los atributos de su raíz: `NextField` reenvía props y ref a su `div`; `NextRadioGroup` a la raíz Radix (`HTMLDivElement`); y `NextSwitch` al botón Radix (`HTMLButtonElement`). Puedes pasar `className`, `aria-*`, `data-*` y, en radio/switch, atributos relevantes como `required` y `form`. Un radio group o switch con `name` aporta exactamente un valor a `FormData`, incluso cuando usa un `form` externo.

## Copia localizable sin runtime

El núcleo no instala un proveedor ni una dependencia de i18n. Estas props permiten traducir la copia reusable; si se omiten, mantienen los textos españoles existentes (y `Breadcrumb` como etiqueta histórica del landmark):

| Componente | Prop | Contrato |
| --- | --- | --- |
| `NextBreadcrumbs` | `label` | Etiqueta del landmark; `aria-label` nativo tiene prioridad. |
| `NextStepper` | `statusLabels` | Sobrescrituras parciales para `complete`, `current`, `upcoming` y `error`. |
| `NextProgress` | `indeterminateLabel` | Texto accesible cuando no existe `value`. |
| `NextRating` | `messages` | Formatea nombre accesible y contador visible de reseñas. |
| `NextReviewSummary` | `messages` | Añade estado vacío, nombre del resumen y etiquetas de estrellas/distribución a los formatters de rating. |
| `NextDialog`, `NextDrawer` | `closeLabel` | Nombre accesible del botón de cierre. |

`messages` es parcial: puedes reemplazar solo un formatter, aunque una traducción completa debe aportar todos los fragmentos que renderice. `label` o un `aria-label` explícito siguen pudiendo sustituir por completo el nombre accesible de rating, breadcrumbs o review summary.

## Adaptadores Link e Image

Voreal Next no importa Next.js. Pasa `next/link` y `next/image` mediante contratos estructurales para conservar navegación cliente y dimensiones estables:

```tsx
import Image from "next/image";
import Link from "next/link";
import { NextActionLink } from "@voreal/ui/next/components/actions";
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

export function DirectoryCard() {
  return (
    <>
      <NextDirectoryHeader
        LinkComponent={Link}
        brand={<Link href="/" aria-label="Inicio">Voreal</Link>}
        navItems={[{ href: "/recursos", label: "Recursos" }]}
        primaryAction={{ href: "/listar-negocio", label: "Listar mi negocio" }}
        theme="red-latina"
      />
      <NextDirectoryBusinessCard
        business={business}
        ImageComponent={Image}
        LinkComponent={Link}
      />
      <NextActionLink href="/listar-negocio" LinkComponent={Link}>
        Publicar negocio
      </NextActionLink>
    </>
  );
}
```

`href` es obligatorio en `NextActionLink`. Un adaptador `LinkComponent` debe reenviar el ref al anchor; `next/link` cumple ese contrato. Los datos de imagen incluyen `width`, `height` y `alt`. Los assets bajo `public/voreal-next` son demos de Storybook y no son una dependencia de runtime.

## Overlays y portales

Dialog y drawer aceptan estado controlado (`open`, `onOpenChange`) o no controlado (`defaultOpen`). `closeLabel` traduce el nombre accesible de su cierre. Radix monta el contenido en `document.body`; el wrapper de Voreal añade `data-vrn-portal` y propaga el nombre recibido en `theme` sin inspeccionar el DOM durante render:

```tsx
"use client";

import { NextButton } from "@voreal/ui/next/components/actions";
import {
  NextDialog,
  NextDialogClose,
} from "@voreal/ui/next/components/overlays";

export function PublishDialog() {
  return (
    <NextDialog
      description="Comprueba los datos antes de continuar."
      footer={(
        <NextDialogClose>
          <NextButton>Entendido</NextButton>
        </NextDialogClose>
      )}
      theme="red-latina"
      title="Confirmar publicación"
      trigger={<NextButton>Revisar</NextButton>}
    >
      El host realizará la operación al confirmar.
    </NextDialog>
  );
}
```

Para un portal propio, aplica `vorealNextPortalProps` y el mismo `data-vrn-theme`; no copies variables en línea:

```tsx
import type { ReactNode } from "react";
import { vorealNextPortalProps } from "@voreal/ui/next";

export function CustomPortalScope({ children }: { children: ReactNode }) {
  return (
    <div {...vorealNextPortalProps} data-vrn-theme="red-latina">
      {children}
    </div>
  );
}
```

## Storybook y referencias

- `Next/Foundations/Theme Lab`: tema predeterminado y ejemplo local Red Latina.
- `Next/Components/Core Atlas`: instancia compacta de cada componente público del núcleo, incluidas instancias reales de `NextContainer`, `NextCluster`, `NextDivider` y `NextCaption`.
- `Next/Patterns/Directory Reference`: `Cards`, tamaños de revisión y estados loading, vacío, error, contenido largo e imagen ausente.

La suite del directorio se ejecuta con `pnpm test:e2e:next` en Chromium, Firefox y WebKit. Las comparaciones visuales Chromium usan 375, 768, 1024 y 1440 px. CI conserva `test-results/` y `playwright-report/` en `voreal-next-playwright-diagnostics` cuando falla; esos artifacts ayudan al diagnóstico, pero no sustituyen ningún gate.

## Migración incremental

1. Fija una versión, etiqueta o commit; no sigas `main`.
2. Importa `next/styles.css` y monta un `VorealNextRoot` solo alrededor de una ruta nueva.
3. Adopta subrutas por familia y pasa adaptadores Link/Image desde el host.
4. Define el tema del producto en una capa posterior y valida Theme Lab más contraste.
5. Migra una composición por vez y conserva Voreal legacy en las demás rutas.
6. Ejecuta unit, a11y, typecheck, Stylelint, auditoría, budgets, Storybook y pruebas de navegador antes de ampliar la isla.

No copies CSS privado de una página ni construyas perfil, onboarding o dashboard con componentes duplicados. Si una futura referencia revela una carencia general, primero debe incorporarse al núcleo como API pública probada.

## Gates del repositorio

```bash
pnpm test
pnpm test:a11y
pnpm typecheck
pnpm build
pnpm lint:css
pnpm audit:next-css
pnpm budget:next-css
pnpm budget:next-components-css
pnpm budget:next-directory-css
pnpm build-storybook
pnpm test:e2e:next
```
