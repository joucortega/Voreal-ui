# Voreal Next: sistema reutilizable, temable y orientado a productos

**Fecha:** 2026-08-18

**Estado:** aprobado para planificación e implementación incremental

**Referencia visual:** Voreal Next Directory y las tres composiciones aprobadas de perfil, publicación y resumen de negocio

## 1. Decisión

Voreal Next dejará de ser únicamente una página de directorio y se convertirá en una biblioteca de interfaz reutilizable. Las páginas aprobadas serán composiciones de componentes públicos; no contendrán versiones privadas o duplicadas de botones, formularios, navegación, feedback u overlays.

La evolución será incremental y permanecerá aislada de Voreal actual. No se migrará Red Latina automáticamente ni se modificará `@voreal/ui`, sus temas o sus componentes existentes. La adopción continuará siendo opt-in mediante `@voreal/ui/next`.

## 2. Objetivos

1. Producir componentes funcionales, accesibles y adaptables que puedan utilizarse fuera de las páginas de demostración.
2. Mantener un lenguaje visual único: misma geometría, densidad, tipografía, iconografía, estados y movimiento.
3. Permitir que Red Latina u otro producto cambie identidad visual mediante tokens, sin copiar o editar CSS interno.
4. Conservar componentes estáticos compatibles con React Server Components y limitar JavaScript cliente a interacción real.
5. Ofrecer contratos explícitos para `next/link`, `next/image`, mapas, gráficas, analítica y persistencia sin imponer un framework de aplicación.
6. Mantener integración sencilla, CSS aislado y presupuestos medibles de tamaño.

## 3. Qué significa “completo”

“Completo” significa que Voreal Next cubrirá de principio a fin las necesidades de los tres flujos aprobados:

- explorar y consultar un negocio público;
- publicar o reclamar un negocio mediante un proceso guiado;
- administrar y comprender el estado de un negocio.

No significa copiar todos los componentes existentes en otros sistemas de diseño. Calendarios avanzados, editores enriquecidos, árboles, diagramas, hojas de cálculo y visualizaciones especializadas se añadirán únicamente cuando un producto real los necesite.

Cada componente incluido deberá:

- tener una API pública reutilizable;
- aceptar contenido y datos del consumidor;
- exponer estados controlados y, cuando sea apropiado, no controlados;
- funcionar con teclado, touch y lectores de pantalla;
- documentar estados, límites y adaptadores;
- incluir pruebas unitarias y de accesibilidad;
- aparecer aisladamente en Storybook;
- funcionar dentro de una composición real responsive.

## 4. Principios de arquitectura

### 4.1 Cuatro capas

```text
tokens y root
  -> fundamentos de layout y tipografía
  -> componentes generales
  -> patrones de negocio
  -> páginas de referencia
```

Las dependencias solo avanzan hacia abajo. Un componente general nunca importará un patrón de negocio y un patrón no definirá una copia privada de un componente general.

### 4.2 Organización pública

```text
src/next/
  root.tsx
  styles/
  foundations/
  components/
    actions/
    content/
    feedback/
    forms/
    navigation/
    overlays/
    status/
  patterns/
    directory/
    business-profile/
    business-onboarding/
    business-dashboard/
  testing/
```

Entradas previstas:

- `@voreal/ui/next`
- `@voreal/ui/next/styles.css`
- `@voreal/ui/next/components/*`
- `@voreal/ui/next/patterns/directory`
- `@voreal/ui/next/patterns/business-profile`
- `@voreal/ui/next/patterns/business-onboarding`
- `@voreal/ui/next/patterns/business-dashboard`

Los barrels por familia son la API estable. Los archivos internos no se consideran entradas públicas.

### 4.3 Aislamiento

- Root obligatorio: `[data-voreal-ui="next"]`.
- Portales: `[data-vrn-portal]`.
- Clases: `.vrn-*`.
- Variables: `--vrn-*`.
- Capas: `vrn-reset`, `vrn-tokens`, `vrn-components`, `vrn-patterns`, `vrn-utilities`.
- Ningún reset sobre `html`, `body` o nodos fuera del root.
- Ninguna dependencia de clases legacy `.vr-*`.
- Los estilos del consumidor se cargarán en una capa posterior.

## 5. Temas y tokens

### 5.1 Contrato de tema

`VorealNextRoot` añadirá un nombre de tema opcional y estable:

```tsx
export type VorealNextRootProps = HTMLAttributes<HTMLDivElement> & {
  theme?: string;
};

<VorealNextRoot theme="red-latina">...</VorealNextRoot>
```

El resultado será:

```html
<div data-voreal-ui="next" data-vrn-theme="red-latina">...</div>
```

La personalización será CSS-first y compatible con SSR. No habrá un proveedor React obligatorio ni conversión de tokens en el cliente.

```css
@layer app-theme {
  [data-voreal-ui="next"][data-vrn-theme="red-latina"],
  [data-vrn-portal][data-vrn-theme="red-latina"] {
    --vrn-color-action: #0f5bde;
    --vrn-color-action-hover: #0a47b8;
    --vrn-color-canvas: #f7f9fc;
  }
}
```

Los componentes con portales propagarán el tema del root mediante una prop explícita de portal o un wrapper público; no inspeccionarán `document` durante render.

### 5.2 Tres niveles

1. **Primitivos:** escala de espacio, tamaños, tipografía, radios, duración y capas.
2. **Semánticos públicos:** canvas, superficies, texto, borde, acción, foco y estados.
3. **Aliases internos:** tokens derivados para control, tarjeta, overlay y navegación.

Los temas de producto deben sobrescribir tokens semánticos. Los aliases internos permiten cambiar la construcción de un componente sin romper temas existentes.

### 5.3 Tokens semánticos públicos mínimos

```text
--vrn-color-canvas
--vrn-color-surface
--vrn-color-surface-muted
--vrn-color-surface-raised
--vrn-color-ink
--vrn-color-text-muted
--vrn-color-text-subtle
--vrn-color-border
--vrn-color-border-strong
--vrn-color-action
--vrn-color-action-hover
--vrn-color-action-active
--vrn-color-action-soft
--vrn-color-on-action
--vrn-color-focus
--vrn-color-success
--vrn-color-success-soft
--vrn-color-warning
--vrn-color-warning-soft
--vrn-color-danger
--vrn-color-danger-soft
--vrn-color-info
--vrn-color-info-soft
```

La escala de espacio actual `0, 4, 8, 12, 16, 24, 32, 40, 48, 64px` se conserva. Los temas pueden cambiar marca y tipografía, pero no deben redefinir arbitrariamente la anatomía responsive de los componentes.

### 5.4 Reglas de contraste

El tema predeterminado debe cumplir WCAG 2.2 AA. La documentación incluirá pares de tokens que el consumidor debe validar al crear un tema. Voreal no puede garantizar el contraste de valores personalizados, pero proveerá una historia Theme Lab y pruebas sobre los temas incluidos oficialmente.

### 5.5 Tailwind y otras bibliotecas

Voreal Next no necesitará Tailwind en runtime. CSS aislado y variables permiten usarlo junto a Tailwind, CSS Modules, styled-components o CSS tradicional. Radix continuará como motor interno para comportamientos complejos y no formará parte de la API pública de props.

## 6. Convenciones de componentes

### 6.1 Props y composición

- Extender atributos nativos cuando exista un elemento HTML equivalente.
- Reenviar `ref`, `className`, `aria-*` y `data-*`.
- Usar nombres semánticos de eventos: `onValueChange`, `onOpenChange`, `onStepChange`.
- No exponer clases de Radix ni exigir que el consumidor conozca su estructura.
- Preferir composición por `children` y slots explícitos frente a objetos de configuración gigantes.
- Evitar componentes polimórficos sin una necesidad demostrada.
- Mantener IDs explícitos en componentes server-safe; los wrappers cliente pueden generar IDs estables cuando sea seguro.

### 6.2 Estado

- Controles de formulario nativos conservan su API nativa.
- Tabs, stepper, overlays y menús aceptan `value/open` más `defaultValue/defaultOpen` y sus callbacks.
- Loading deshabilita acciones duplicadas y anuncia progreso.
- Error visible es breve y accionable; detalles técnicos salen por callbacks o logging del consumidor.
- Ningún componente hace `fetch`, escribe URL, guarda datos o decide autorización.

### 6.3 Adaptadores

Los contratos externos serán pequeños y estructurales:

```ts
export type VorealNextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};
export type VorealNextLinkComponent = ElementType<VorealNextLinkProps>;

export type VorealNextImageProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "height" | "loading" | "sizes" | "src" | "width"
> & {
  alt: string;
  height: number;
  src: string;
  width: number;
};
export type VorealNextImageComponent = ElementType<VorealNextImageProps>;

export interface VorealMapAdapterProps {
  latitude: number;
  longitude: number;
  label: string;
  interactive?: boolean;
}

export interface VorealChartAdapterProps {
  label: string;
  series: readonly VorealChartSeries[];
  summary: ReactNode;
}
```

Los patrones reciben estos adaptadores; los componentes generales no importan Next.js, Google Maps ni una biblioteca de gráficas.

### 6.4 Server y client boundaries

Server-safe por defecto:

- layout, tipografía, surfaces, badges, avatar, progress estático, breadcrumb estático, rating de lectura, media y tarjetas de contenido.

Cliente únicamente cuando sea necesario:

- tabs interactivos, stepper editable, switch, radio compuesto, dialogs, drawers, popovers, tooltips, dropdowns, toast y gallery interactiva.

Los barrels server-safe no reexportarán accidentalmente módulos cliente si eso fuerza hidratación de todo el árbol.

## 7. Inventario objetivo

### 7.1 Fundamentos

- `NextContainer`
- `NextStack`
- `NextCluster`
- `NextGrid`
- `NextDivider`
- `NextSurface`
- `NextSection`
- `NextHeading`
- `NextText`
- `NextCaption`
- conjunto Lucide normalizado

### 7.2 Acciones

- `NextButton`
- `NextIconButton`
- `NextButtonGroup`
- `NextActionLink`

### 7.3 Formularios

- `NextField`
- `NextInput`
- `NextTextarea`
- `NextSelect` nativo
- `NextCheckbox`
- `NextRadioGroup`
- `NextSwitch`
- `NextInputGroup`
- `NextFormSummary`

Combobox y date picker quedan fuera del núcleo inicial porque no aparecen en los tres flujos aprobados. Podrán incorporarse como entregas independientes.

### 7.4 Navegación

- `NextBreadcrumbs`
- `NextTabs`
- `NextStepper`
- `NextNavigationRail`
- `NextPagination`

### 7.5 Estado, contenido y feedback

- `NextBadge`
- `NextTag`
- `NextAvatar`
- `NextProgress`
- `NextAlert`
- `NextSkeleton`
- `NextEmptyState`
- `NextRating`
- `NextReviewSummary`
- `NextMedia`
- `NextGallery`

### 7.6 Overlays

- `NextDialog`
- `NextDrawer`
- `NextDropdownMenu`
- `NextPopover`
- `NextTooltip`
- `NextToastProvider` y `useNextToast`

La primera fase generalizará dialog/drawer antes de añadir los demás overlays, porque esos dos ya son requeridos por navegación y filtros.

## 8. Patrones y páginas de referencia

### 8.1 Perfil público de negocio

Patrones reutilizables:

- `NextBusinessIdentity`
- `NextBusinessGallery`
- `NextBusinessContactPanel`
- `NextBusinessHours`
- `NextBusinessServices`
- `NextBusinessLocation`
- `NextBusinessReviews`

La página de Storybook ensamblará estos patrones con header, breadcrumbs, tabs, surfaces, rating y adaptadores. Ningún patrón asumirá que el negocio es latino; esa identidad pertenecerá al contenido del producto.

### 8.2 Publicación o reclamación

Patrones reutilizables:

- `NextBusinessWizard`
- `NextBusinessBasicsStep`
- `NextBusinessLocationStep`
- `NextBusinessDetailsStep`
- `NextBusinessReviewStep`
- `NextWizardActions`

El wizard administrará navegación y validación de interfaz, pero entregará datos al consumidor mediante callbacks. Guardado, autenticación, autorización y publicación pertenecen a Red Latina u otra aplicación.

### 8.3 Resumen de un negocio

Patrones reutilizables:

- `NextBusinessDashboardShell`
- `NextBusinessProfileHealth`
- `NextBusinessStat`
- `NextBusinessActivityList`
- `NextBusinessRecommendedActions`
- `NextBusinessPublicPreview`

La composición representa un solo negocio por defecto. El soporte multi-negocio, si existe en un producto, se resolverá en navegación de aplicación y no alterará la anatomía del resumen.

## 9. Funcionalidad de las referencias

Las historias completas utilizarán estado local realista para comprobar:

- tabs y navegación activa;
- apertura/cierre y foco de menús y drawers;
- edición de campos y validación visible;
- radio, checkbox, switch y select;
- avance, retroceso y bloqueo del stepper;
- guardado simulado con estado loading/success/error;
- gallery y selección de imagen;
- contacto, favoritos y acciones mediante callbacks observables;
- estados loading, vacío, error y contenido parcial.

No se fingirá persistencia. Las historias indicarán claramente cuándo una acción es una simulación local.

## 10. Responsive y densidad

- Base móvil desde `375px`.
- Tablet a `768px`.
- Transición intermedia verificada a `1024px`.
- Desktop de referencia a `1440px`.
- Targets touch mínimos de `44px`.
- Contenido antes que decoración; sidebar pasa a drawer cuando no cabe.
- Tablas o listas densas tendrán overflow local visible, nunca clipping del contexto exterior.
- Los patrones deben aceptar texto largo, zoom al 200% y traducciones ES/EN.
- No se usarán espacios verticales de `80–96px` en flujos funcionales.

## 11. Accesibilidad y movimiento

- WCAG 2.2 AA.
- Orden de foco igual al orden visual.
- Foco visible y no oculto por sticky headers u overlays.
- Nombres accesibles para icon buttons y controles compactos.
- Estados comunicados con texto o semántica, no solo color.
- `aria-live` reservado para cambios relevantes y mensajes de formularios/toasts.
- `prefers-reduced-motion` elimina desplazamientos no esenciales.
- Movimiento de `120/180/240ms`, sin animación decorativa continua.

## 12. Calidad, estabilidad y presupuestos

Gates para cada entrega:

- unit tests;
- a11y con axe;
- typecheck de fuente y build;
- stylelint;
- auditoría de aislamiento CSS y server/client boundaries;
- Storybook build;
- Playwright Chromium, Firefox y WebKit para flujos críticos;
- snapshots Chromium en 375, 768, 1024 y 1440 cuando exista una referencia aprobada;
- `git diff --check`.

Presupuestos:

- CSS completo de Voreal Next: `<= 36 KiB` gzip al terminar las tres referencias;
- fundamentos y componentes generales: `<= 20 KiB` gzip;
- cada familia de patrón: `<= 8 KiB` gzip;
- cero imágenes empacadas como dependencia de runtime;
- cero JavaScript propio para componentes puramente estáticos.

El aumento desde el presupuesto experimental de 24 KiB debe ocurrir únicamente al incorporar familias generales; cada fase conservará su presupuesto específico.

## 13. Documentación para consumidores

Se actualizará `docs/VOREAL_NEXT.md` con:

1. instalación e imports;
2. root y aislamiento;
3. creación de un tema por tokens;
4. ejemplo Red Latina;
5. adaptadores Next.js;
6. componentes server-safe y client-only;
7. formularios controlados/no controlados;
8. overlays y portales;
9. composición de cada referencia;
10. migración incremental desde Voreal actual.

Storybook incluirá:

- `Next/Foundations/Theme Lab`;
- `Next/Components/*` por familia;
- `Next/Patterns/*`;
- `Next/References/*` para las páginas completas.

## 14. Entregas

### Entrega 1 — núcleo reusable

Tema/root, aliases de tokens, surfaces, acciones, formularios, navegación esencial, feedback esencial, dialog/drawer generalizados, Theme Lab y documentación de integración.

### Entrega 2 — perfil público

Contenido/media, rating/review summary, gallery y patrones de perfil público; referencia desktop/mobile aprobada.

### Entrega 3 — wizard

Stepper, validación por pasos, acciones de guardado y patrones de publicación/reclamación.

### Entrega 4 — resumen del negocio

Navigation rail, profile health, métricas, actividad, recomendaciones y adaptadores de gráficas/analítica.

Cada entrega debe poder publicarse y consumirse sin depender de que la siguiente exista.

## 15. Fuera de alcance

- backend, base de datos, autenticación o permisos;
- fetch y caché de datos;
- pagos;
- mapas o gráficas concretas dentro del paquete base;
- editor enriquecido;
- date picker y calendar en esta secuencia inicial;
- soporte multi-negocio dentro del resumen aprobado;
- segundo tema visual oficial antes de completar y aprobar el tema actual;
- migración automática o merge a `main` sin aprobación separada.

## 16. Criterios de aceptación globales

Voreal Next estará listo para adopción cuando:

1. las tres referencias se construyan exclusivamente con componentes y patrones públicos;
2. un tema de ejemplo pueda cambiar marca, superficies, texto, acciones y estados sin editar CSS interno;
3. Red Latina pueda integrar Link/Image y sus servicios mediante adaptadores;
4. los flujos principales funcionen en teclado, touch y tres motores de navegador;
5. no exista contaminación de Voreal legacy ni del CSS de la aplicación;
6. documentación, historias, tipos y pruebas describan la misma API;
7. el diseño conserve la cohesión visual de la referencia aprobada en todos los breakpoints.
