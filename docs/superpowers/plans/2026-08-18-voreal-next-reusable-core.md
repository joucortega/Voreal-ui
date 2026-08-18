# Voreal Next Reusable Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la base experimental de Voreal Next en un núcleo temable y reusable que proporcione los componentes generales necesarios para construir el perfil público, el wizard y el resumen de negocio.

**Architecture:** Mantener la isla `src/next` y ampliar sus familias públicas sin tocar Voreal legacy. La personalización será CSS-first mediante tokens semánticos y `data-vrn-theme`; los componentes estáticos permanecerán server-safe y las interacciones se aislarán en módulos cliente sobre Radix o controles nativos.

**Tech Stack:** React 18.3–19, TypeScript 7, CSS Cascade Layers, Radix Primitives, Lucide adapter existente, Storybook 10, Vitest, Testing Library, axe y Playwright.

**Spec:** `docs/superpowers/specs/2026-08-18-voreal-next-reusable-system-design.md`

## Global Constraints

- No modificar comportamiento, props, exports ni CSS de `src/components`, `src/patterns`, `src/primitives`, `src/styles`, `src/themes` o `src/tokens` legacy.
- Todo source visual nuevo vive en `src/next`; clases `.vrn-*`, variables `--vrn-*` y portales `[data-vrn-portal]`.
- No aplicar reset a `html`, `body` ni a elementos fuera de `[data-voreal-ui="next"]` o `[data-vrn-portal]`.
- No añadir Tailwind como dependencia de runtime; la interoperabilidad se resuelve con aislamiento, variables y cascade layers.
- Radix es un detalle interno y no aparece en las props públicas.
- Componentes estáticos son server-safe; solo módulos que administran interacción contienen `"use client"`.
- Componentes no hacen fetch, navegación imperativa, persistencia, autorización ni analytics.
- Props nativas, `ref`, `className`, `aria-*` y `data-*` se preservan.
- WCAG 2.2 AA, targets touch de 44px, focus visible, forced colors y reduced motion.
- Soporte responsive verificado a 375, 768, 1024 y 1440px, además de zoom 200% para composiciones críticas.
- Presupuesto al cerrar esta entrega: todo `src/next/**/*.css <= 28 KiB` gzip; fundamentos y componentes generales `<= 20 KiB` gzip; directorio permanece `<= 8 KiB` gzip.
- No crear aún perfil, wizard o dashboard completos. Esta entrega termina con los componentes generales y Theme Lab funcionando.
- No cambiar `main`, publicar paquete, migrar Red Latina ni sustituir el tema aprobado.

---

## File map

### Root y tokens

- Modify: `src/next/root.tsx` — prop `theme` y propagación SSR-safe al atributo del root.
- Modify: `src/next/root.test.tsx` — contratos de tema, aislamiento y props nativas.
- Create: `src/next/adapters.ts` — contratos compartidos de Link e Image.
- Modify: `src/next/patterns/directory/directory.types.ts` — consumir y reexportar los contratos compartidos sin romper nombres actuales.
- Modify: `src/next/styles/tokens.css` — tokens semánticos públicos y aliases internos.
- Modify: `src/next/styles/tokens.test.tsx` — inventario y ausencia de colores crudos en componentes.
- Create: `src/next/styles/theme-contract.test.tsx` — tokens computados y override real desde un tema consumidor.
- Modify: `src/next/components/status/status.css` — reemplazar colores crudos por tokens.
- Modify: `src/next/patterns/directory/directory.css` — reemplazar scrims y sombras crudas por aliases de tokens.
- Modify: `scripts/audit-next-css.mjs` — detectar colores literales fuera del archivo de tokens.
- Modify: `scripts/audit-next-css.test.mjs` — fixtures positivos y negativos del nuevo gate.

### Fundamentos y acciones

- Modify: `src/next/foundations/layout.tsx` — `NextSurface` y `NextSection`.
- Modify: `src/next/foundations/layout.test.tsx` — semántica y composición.
- Modify: `src/next/foundations/foundations.css` — geometría compartida.
- Modify: `src/next/components/actions/actions.tsx` — `NextButtonGroup` y `NextActionLink`.
- Modify: `src/next/components/actions/actions.test.tsx` — adapters, loading y grupos.
- Modify: `src/next/components/actions/actions.css` — variantes coherentes.

### Formularios

- Split: `src/next/components/forms/forms.tsx` — conservar controles server-safe.
- Create: `src/next/components/forms/form-controls.client.tsx` — radio group y switch interactivos.
- Modify: `src/next/components/forms/forms.test.tsx` — contratos de asociación, estados y callbacks.
- Modify: `src/next/components/forms/forms.css` — textarea, input group, radios, switch y summary.
- Modify: `src/next/components/forms/index.ts` — exports públicos.

### Navegación

- Create: `src/next/components/navigation/navigation.tsx` — breadcrumbs y navigation rail server-safe.
- Create: `src/next/components/navigation/navigation.client.tsx` — tabs y stepper controlados/no controlados.
- Create: `src/next/components/navigation/navigation.test.tsx` — semántica, teclado y estado.
- Create: `src/next/components/navigation/navigation.css` — geometría responsive.
- Create: `src/next/components/navigation/index.ts` — barrel público.

### Feedback y contenido

- Create: `src/next/components/feedback/feedback.tsx` — alert, progress, skeleton y empty state.
- Create: `src/next/components/feedback/feedback.test.tsx` — estados y anuncios.
- Create: `src/next/components/feedback/feedback.css` — estilos semánticos.
- Create: `src/next/components/feedback/index.ts` — barrel público.
- Create: `src/next/components/content/content.tsx` — avatar, rating y review summary server-safe.
- Create: `src/next/components/content/content.test.tsx` — datos parciales y accesibilidad.
- Create: `src/next/components/content/content.css` — anatomía compacta.
- Create: `src/next/components/content/index.ts` — barrel público.

### Overlays

- Create: `src/next/components/overlays/dialog-drawer.client.tsx` — wrappers generales de Dialog/Drawer.
- Create: `src/next/components/overlays/dialog-drawer.test.tsx` — foco, portal, control y scroll.
- Create: `src/next/components/overlays/overlays.css` — shell compartido.
- Create: `src/next/components/overlays/index.ts` — exports públicos.
- Modify: `src/next/patterns/directory/directory-mobile-nav.tsx` — composición con `NextDrawer`.
- Modify: `src/next/patterns/directory/directory-filter-drawer.tsx` — composición con `NextDrawer`.

### Integración y documentación

- Modify: `src/next/index.ts` — exports por familias terminadas.
- Modify: `src/next/styles.css` — imports en capas.
- Modify: `package.json` — nuevos subpath exports explícitos y budgets.
- Create: `src/next/styles/theme-lab.stories.tsx` — validación visual de tokens.
- Create: `src/next/components/core-components.stories.tsx` — atlas compacto.
- Modify: `docs/VOREAL_NEXT.md` — guía de integración y tema Red Latina.
- Modify: `scripts/next-isolation.test.mjs` — nuevos exports y familias aisladas.
- Modify: `scripts/server-boundary.test.mjs` — lista server-safe actualizada.

---

### Task 1: Establecer el contrato público de temas

**Files:**
- Modify: `src/next/root.tsx`
- Modify: `src/next/root.test.tsx`
- Create: `src/next/adapters.ts`
- Modify: `src/next/patterns/directory/directory.types.ts`
- Modify: `src/next/styles/tokens.css`
- Modify: `src/next/styles/tokens.test.tsx`
- Create: `src/next/styles/theme-contract.test.tsx`
- Modify: `src/next/components/status/status.css`
- Modify: `src/next/patterns/directory/directory.css`
- Modify: `scripts/audit-next-css.mjs`
- Modify: `scripts/audit-next-css.test.mjs`

**Interfaces:**
- Consumes: `VorealNextRoot`, `vorealNextPortalProps` existentes.
- Produces:

```ts
export type VorealNextRootProps = HTMLAttributes<HTMLDivElement> & {
  theme?: string;
};

export type VorealNextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };
export type VorealNextLinkComponent = ElementType<VorealNextLinkProps>;
export type VorealNextImageProps = Pick<ImgHTMLAttributes<HTMLImageElement>, "alt" | "className" | "height" | "loading" | "sizes" | "src" | "width"> & {
  alt: string;
  height: number;
  src: string;
  width: number;
};
export type VorealNextImageComponent = ElementType<VorealNextImageProps>;
```

- [ ] **Step 1: Escribir pruebas RED del root y el inventario**

Añadir a `root.test.tsx`:

```tsx
it("exposes a theme name without mutating the document", () => {
  render(<VorealNextRoot theme="red-latina">Contenido</VorealNextRoot>);
  expect(screen.getByText("Contenido")).toHaveAttribute("data-vrn-theme", "red-latina");
  expect(document.documentElement).not.toHaveAttribute("data-vrn-theme");
  expect(document.body).not.toHaveAttribute("data-vrn-theme");
});

it("omits the theme attribute when no theme is provided", () => {
  render(<VorealNextRoot>Contenido</VorealNextRoot>);
  expect(screen.getByText("Contenido")).not.toHaveAttribute("data-vrn-theme");
});
```

Crear `theme-contract.test.tsx`, importar `tokens.css`, renderizar un root y comprobar con `getComputedStyle` que los 23 tokens semánticos documentados tienen valor. Inyectar una regla de tema de prueba para `data-vrn-theme="consumer"` y comprobar que cambia `--vrn-color-action` solo dentro de ese root, sin modificar `documentElement`, `body` ni un root sibling.

- [ ] **Step 2: Ejecutar RED**

Run:

```bash
./node_modules/.bin/vitest run --project unit src/next/root.test.tsx src/next/styles/theme-contract.test.tsx
```

Expected: FAIL porque `theme` y varios tokens semánticos todavía no existen.

- [ ] **Step 3: Implementar root e inventario mínimo**

En `root.tsx`, extraer `theme` antes de propagar props y añadir:

```tsx
data-vrn-theme={theme || undefined}
```

Exportar los adaptadores desde un módulo server-safe sin leer el DOM. `directory.types.ts` importa esos contratos y reexporta sus nombres actuales como aliases para no romper consumidores. En `tokens.css`, mantener aliases temporales de compatibilidad:

```css
--vrn-color-action: #0f5bde;
--vrn-color-primary: var(--vrn-color-action);
--vrn-color-action-hover: #0a47b8;
--vrn-color-primary-hover: var(--vrn-color-action-hover);
--vrn-color-focus: #0f5bde;
--vrn-focus-ring: 0 0 0 3px var(--vrn-color-focus);
--vrn-color-overlay-scrim: rgb(11 31 58 / 42%);
--vrn-shadow-overlay-side: -0.5rem 0 1.5rem rgb(11 31 58 / 12%);
--vrn-shadow-overlay-bottom: 0 -0.5rem 1.5rem rgb(11 31 58 / 12%);
```

No eliminar tokens existentes en esta tarea.

- [ ] **Step 4: Probar aliases y ausencia de hex en CSS de componentes**

Extender `audit-next-css.mjs` para analizar declaraciones y reportar `raw-color` cuando encuentre hex, `rgb()` o `hsl()` fuera de `styles/tokens.css`; los comentarios, strings y custom properties dentro del archivo de tokens no generan hallazgos. Añadir fixtures que prueben el gate. Migrar los tonos soft de `status.css` y los scrims/sombras de `directory.css` a variables declaradas en `tokens.css`.

- [ ] **Step 5: Ejecutar GREEN y gates de aislamiento**

```bash
./node_modules/.bin/vitest run --project unit src/next/root.test.tsx src/next/styles/tokens.test.tsx src/next/styles/theme-contract.test.tsx
node --test scripts/next-isolation.test.mjs scripts/audit-next-css.test.mjs
./node_modules/.bin/tsc -p tsconfig.json --noEmit
./node_modules/.bin/stylelint 'src/next/**/*.css'
```

Expected: todos PASS.

- [ ] **Step 6: Commit**

```bash
git add src/next/root.tsx src/next/root.test.tsx src/next/adapters.ts src/next/patterns/directory/directory.types.ts src/next/patterns/directory/directory.css src/next/components/status/status.css src/next/styles/tokens.css src/next/styles/tokens.test.tsx src/next/styles/theme-contract.test.tsx scripts/audit-next-css.mjs scripts/audit-next-css.test.mjs
git commit -m "feat(next): establish reusable theme contract"
```

---

### Task 2: Añadir surfaces y acciones composables

**Files:**
- Modify: `src/next/foundations/layout.tsx`
- Modify: `src/next/foundations/layout.test.tsx`
- Modify: `src/next/foundations/foundations.css`
- Modify: `src/next/foundations/index.ts`
- Modify: `src/next/components/actions/actions.tsx`
- Modify: `src/next/components/actions/actions.test.tsx`
- Modify: `src/next/components/actions/actions.css`
- Modify: `src/next/components/actions/index.ts`

**Interfaces:**

```ts
export type NextSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "raised";
  padding?: "none" | "sm" | "md" | "lg";
};

export type NextSectionProps = HTMLAttributes<HTMLElement> & { as?: "section" | "div" };

export type NextButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  attached?: boolean;
  label: string;
};

export type NextActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  LinkComponent?: VorealNextLinkComponent;
  variant?: NextButtonProps["variant"];
  size?: NextButtonProps["size"];
};
```

- [ ] **Step 1: Escribir pruebas RED**

Comprobar:

```tsx
render(<NextSurface tone="raised" padding="md">Panel</NextSurface>);
expect(screen.getByText("Panel")).toHaveAttribute("data-tone", "raised");
expect(screen.getByText("Panel")).toHaveAttribute("data-padding", "md");

render(<NextButtonGroup attached label="Formato"><NextButton>Lista</NextButton><NextButton>Grid</NextButton></NextButtonGroup>);
expect(screen.getByRole("group", { name: "Formato" })).toHaveAttribute("data-attached", "true");
```

Crear un `LinkComponent` fixture que registre `href` y comprobar que `NextActionLink` no renderiza un `<button>` dentro de `<a>`.

- [ ] **Step 2: Ejecutar RED**

```bash
./node_modules/.bin/vitest run --project unit src/next/foundations/layout.test.tsx src/next/components/actions/actions.test.tsx
```

Expected: FAIL por exports ausentes.

- [ ] **Step 3: Implementar las APIs mínimas**

Usar `clsx`, atributos `data-*` y elementos nativos. `NextButtonGroup` usa `role="group"` y `aria-label={label}`. `NextActionLink` comparte clases de geometría con `NextButton`, pero siempre renderiza un enlace o `LinkComponent`.

- [ ] **Step 4: Implementar CSS con aliases semánticos**

`NextSurface` no recibe sombra salvo `tone="raised"`; `NextSection` no añade caja visual. `attached` colapsa bordes internos y mantiene focus rings no recortados mediante `position: relative` y z-index tokenizado.

- [ ] **Step 5: Ejecutar pruebas, a11y y typecheck**

```bash
./node_modules/.bin/vitest run --project unit src/next/foundations/layout.test.tsx src/next/components/actions/actions.test.tsx
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
./node_modules/.bin/tsc -p tsconfig.json --noEmit
./node_modules/.bin/stylelint 'src/next/**/*.css'
```

- [ ] **Step 6: Commit**

```bash
git add src/next/foundations src/next/components/actions
git commit -m "feat(next): add reusable surfaces and action groups"
```

---

### Task 3: Completar controles de formulario generales

**Files:**
- Modify: `src/next/components/forms/forms.tsx`
- Create: `src/next/components/forms/form-controls.client.tsx`
- Modify: `src/next/components/forms/forms.test.tsx`
- Modify: `src/next/components/forms/forms.css`
- Modify: `src/next/components/forms/index.ts`

**Interfaces:**

```ts
export type NextTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export type NextInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export type NextRadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type NextRadioGroupProps = {
  label: string;
  name: string;
  options: readonly NextRadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

export type NextSwitchProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
};

export type NextFormSummaryProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  errors: readonly { id: string; message: string; href?: string }[];
};
```

- [ ] **Step 1: Escribir RED de atributos nativos y estado**

Probar `NextTextarea` con `name`, `required`, `rows` y ref; `NextInputGroup` sin alterar el input; radio controlado/no controlado; switch con nombre accesible; summary con enlaces a campos.

```tsx
await user.click(screen.getByRole("radio", { name: "10 millas" }));
expect(onValueChange).toHaveBeenCalledWith("10");

await user.click(screen.getByRole("switch", { name: "Abierto ahora" }));
expect(onCheckedChange).toHaveBeenCalledWith(true);
```

- [ ] **Step 2: Ejecutar RED**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/forms/forms.test.tsx
```

Expected: FAIL por componentes ausentes.

- [ ] **Step 3: Ampliar `NextField` sin romper compatibilidad**

Permitir exactamente un `NextInput`, `NextTextarea`, `NextSelect` o control nativo `input/textarea/select`. Mantener `htmlFor` explícito y combinar `aria-describedby` sin duplicados.

- [ ] **Step 4: Implementar controles cliente sobre Radix**

`form-controls.client.tsx` contiene `"use client"`. Usar Radix Radio Group y Switch; pasar `name/value` a los roots de Radix para que sus bubble inputs nativos participen una sola vez en `FormData`. Añadir una prueba que someta un `<form>` real y compruebe un único valor por control. No importar este archivo desde módulos declarados server-safe.

- [ ] **Step 5: Añadir CSS responsive y forced colors**

Mantener altura mínima 44px; radio cards deben reflow sin ancho fijo; textarea permite resize vertical; prefixes/suffixes no capturan foco; error summary usa `role="alert"` solo cuando se monta como resultado de submit.

- [ ] **Step 6: Ejecutar GREEN completo de la familia**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/forms/forms.test.tsx
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
node --test scripts/server-boundary.test.mjs
./node_modules/.bin/tsc -p tsconfig.json --noEmit
./node_modules/.bin/stylelint 'src/next/**/*.css'
```

- [ ] **Step 7: Commit**

```bash
git add src/next/components/forms scripts/server-boundary.test.mjs
git commit -m "feat(next): complete reusable form controls"
```

---

### Task 4: Crear navegación esencial

**Files:**
- Create: `src/next/components/navigation/navigation.tsx`
- Create: `src/next/components/navigation/navigation.client.tsx`
- Create: `src/next/components/navigation/navigation.test.tsx`
- Create: `src/next/components/navigation/navigation.css`
- Create: `src/next/components/navigation/index.ts`
- Modify: `src/next/styles.css`
- Modify: `src/next/index.ts`

**Interfaces:**

```ts
export type NextBreadcrumbItem = { label: ReactNode; href?: string };
export type NextBreadcrumbsProps = { items: readonly NextBreadcrumbItem[]; LinkComponent?: VorealNextLinkComponent };

export type NextTabItem = { value: string; label: ReactNode; content: ReactNode; disabled?: boolean };
export type NextTabsProps = { label: string; items: readonly NextTabItem[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void };

export type NextStepItem = { value: string; label: ReactNode; description?: ReactNode; status?: "complete" | "current" | "upcoming" | "error" };
export type NextStepperProps = { label: string; steps: readonly NextStepItem[]; value: string; onStepChange?: (value: string) => void; orientation?: "horizontal" | "vertical" };

export type NextNavigationRailItem = { href: string; label: ReactNode; icon?: ReactNode; current?: boolean };
export type NextNavigationRailProps = { label: string; items: readonly NextNavigationRailItem[]; LinkComponent?: VorealNextLinkComponent };
```

- [ ] **Step 1: Escribir pruebas RED de semántica**

Verificar `<nav aria-label>`, lista ordenada de breadcrumbs, `aria-current="page"`, tabs con ArrowLeft/ArrowRight/Home/End, stepper con estado textual y rail con un solo current.

- [ ] **Step 2: Ejecutar RED**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/navigation/navigation.test.tsx
```

- [ ] **Step 3: Implementar server-safe navigation**

`navigation.tsx` no usa hooks. Breadcrumbs y rail aceptan `LinkComponent`; cuando falta `href`, el item final se renderiza como texto con `aria-current="page"`.

- [ ] **Step 4: Implementar tabs y stepper cliente**

Usar Radix Tabs para tabs. Stepper usa botones nativos únicamente si `onStepChange` existe; sin callback renderiza lista de progreso no interactiva. Nunca permitir saltar a un step `upcoming` deshabilitado por el consumidor.

- [ ] **Step 5: Añadir CSS de reflow**

Tabs permiten scroll local con affordance visible; stepper horizontal cambia a vertical antes de recortar labels; navigation rail se vuelve lista compacta o drawer solo en una composición superior.

- [ ] **Step 6: Ejecutar GREEN y boundaries**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/navigation/navigation.test.tsx
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
node --test scripts/next-isolation.test.mjs scripts/server-boundary.test.mjs
./node_modules/.bin/tsc -p tsconfig.json --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/next/components/navigation src/next/styles.css src/next/index.ts scripts
git commit -m "feat(next): add tabs stepper and reusable navigation"
```

---

### Task 5: Añadir feedback y contenido esencial

**Files:**
- Create: `src/next/components/feedback/feedback.tsx`
- Create: `src/next/components/feedback/feedback.test.tsx`
- Create: `src/next/components/feedback/feedback.css`
- Create: `src/next/components/feedback/index.ts`
- Create: `src/next/components/content/content.tsx`
- Create: `src/next/components/content/content.test.tsx`
- Create: `src/next/components/content/content.css`
- Create: `src/next/components/content/index.ts`
- Modify: `src/next/styles.css`
- Modify: `src/next/index.ts`

**Interfaces:**

```ts
export type NextAlertProps = HTMLAttributes<HTMLDivElement> & { tone?: "info" | "success" | "warning" | "danger"; title: ReactNode; action?: ReactNode };
export type NextProgressProps = HTMLAttributes<HTMLDivElement> & { label: string; value?: number; max?: number };
export type NextSkeletonProps = HTMLAttributes<HTMLDivElement> & { width?: string; height?: string };
export type NextEmptyStateProps = HTMLAttributes<HTMLDivElement> & { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode };

export type NextAvatarProps = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  src?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  ImageComponent?: VorealNextImageComponent;
  size?: "sm" | "md" | "lg";
};
export type NextRatingProps = HTMLAttributes<HTMLSpanElement> & { value: number; max?: 5; reviewCount?: number; label?: string };
export type NextReviewSummaryProps = HTMLAttributes<HTMLDivElement> & { average?: number; total: number; distribution: readonly { rating: 1 | 2 | 3 | 4 | 5; count: number }[] };
```

- [ ] **Step 1: Escribir pruebas RED de datos límites**

Probar progress indeterminado, clamp de valores; avatar con imagen y fallback de iniciales; rating inválido; cero reseñas; distribución cuyo total no coincide sin división por cero.

```tsx
render(<NextRating value={4.7} reviewCount={128} />);
expect(screen.getByLabelText("4.7 de 5, 128 reseñas")).toBeInTheDocument();

render(<NextReviewSummary total={0} distribution={[]} />);
expect(screen.getByText("Sin reseñas todavía")).toBeInTheDocument();
```

- [ ] **Step 2: Ejecutar RED**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/feedback/feedback.test.tsx src/next/components/content/content.test.tsx
```

- [ ] **Step 3: Implementar componentes server-safe**

No usar hooks. `NextAlert` solo usa `role="alert"` si el consumidor lo pasa explícitamente; contenido persistente usa semántica normal. `NextProgress` usa `<progress>` cuando hay value y `role="progressbar"` indeterminado cuando no. Rating usa iconos Lucide/adaptador existente, no caracteres de estrella.

- [ ] **Step 4: Añadir CSS compacto**

Skeleton respeta reduced motion; avatar usa `object-fit: cover`; review bars conservan label textual; ningún tamaño depende de contenido inglés corto.

- [ ] **Step 5: Ejecutar GREEN y a11y**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/feedback/feedback.test.tsx src/next/components/content/content.test.tsx
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
./node_modules/.bin/tsc -p tsconfig.json --noEmit
./node_modules/.bin/stylelint 'src/next/**/*.css'
```

- [ ] **Step 6: Commit**

```bash
git add src/next/components/feedback src/next/components/content src/next/styles.css src/next/index.ts
git commit -m "feat(next): add reusable feedback and review content"
```

---

### Task 6: Generalizar Dialog y Drawer sin duplicar Radix

**Files:**
- Create: `src/next/components/overlays/dialog-drawer.client.tsx`
- Create: `src/next/components/overlays/dialog-drawer.test.tsx`
- Create: `src/next/components/overlays/overlays.css`
- Create: `src/next/components/overlays/index.ts`
- Modify: `src/next/patterns/directory/directory-mobile-nav.tsx`
- Modify: `src/next/patterns/directory/directory-filter-drawer.tsx`
- Modify: `src/next/patterns/directory/directory-filters.test.tsx`
- Modify: `src/next/styles.css`
- Modify: `src/next/index.ts`

**Interfaces:**

```ts
export type NextDialogProps = {
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: string;
};

export type NextDrawerProps = NextDialogProps & {
  side?: "left" | "right" | "bottom";
};
```

- [ ] **Step 1: Escribir pruebas RED generales**

Comprobar trigger, title/description, cierre Escape, devolución de foco, controlled/defaultOpen, portal con `data-vrn-portal`, `data-vrn-theme`, footer visible y body scrollable.

- [ ] **Step 2: Ejecutar RED**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/overlays/dialog-drawer.test.tsx
```

- [ ] **Step 3: Implementar wrappers cliente**

Usar Radix Dialog. Clonar el trigger con `asChild`; crear overlay/content/title/description/close; propagar `theme` al nodo portal mediante wrapper. Drawer difiere solo mediante `data-side` y CSS.

- [ ] **Step 4: Migrar los dos drawers del directorio**

Reemplazar markup Radix duplicado en mobile nav y filter drawer por `NextDrawer`. Conservar exactamente sus props públicas, nombres accesibles, comportamiento, acciones y breakpoints.

- [ ] **Step 5: Ejecutar regresión del directorio**

```bash
./node_modules/.bin/vitest run --project unit src/next/components/overlays/dialog-drawer.test.tsx src/next/patterns/directory/directory-filters.test.tsx src/next/patterns/directory/directory-header.test.tsx
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
node --test scripts/server-boundary.test.mjs scripts/next-isolation.test.mjs
./node_modules/.bin/tsc -p tsconfig.json --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/next/components/overlays src/next/patterns/directory src/next/styles.css src/next/index.ts
git commit -m "refactor(next): generalize accessible dialog and drawer"
```

---

### Task 7: Publicar API, Theme Lab y guía de integración

**Files:**
- Create: `src/next/styles/theme-lab.stories.tsx`
- Create: `src/next/styles/theme-lab.stories.test.tsx`
- Create: `src/next/components/core-components.stories.tsx`
- Create: `src/next/components/core-components.stories.test.tsx`
- Modify: `src/next/index.ts`
- Modify: `src/next/styles.css`
- Modify: `package.json`
- Modify: `scripts/next-isolation.test.mjs`
- Modify: `scripts/server-boundary.test.mjs`
- Modify: `scripts/check-css-budget.mjs` or add package scripts using its current interface
- Modify: `docs/VOREAL_NEXT.md`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: todas las familias terminadas en Tasks 1–6.
- Produces:

```json
{
  "./next/components/actions": "./src/next/components/actions/index.ts",
  "./next/components/content": "./src/next/components/content/index.ts",
  "./next/components/feedback": "./src/next/components/feedback/index.ts",
  "./next/components/forms": "./src/next/components/forms/index.ts",
  "./next/components/navigation": "./src/next/components/navigation/index.ts",
  "./next/components/overlays": "./src/next/components/overlays/index.ts",
  "./next/components/status": "./src/next/components/status/index.ts"
}
```

- [ ] **Step 1: Escribir RED de exports y stories**

Extender `next-isolation.test.mjs` con las siete rutas exactas. En tests de stories, renderizar Theme Lab con tema default y `red-latina-example`; renderizar atlas con al menos una instancia de cada componente público y comprobar headings por familia.

- [ ] **Step 2: Ejecutar RED**

```bash
node --test scripts/next-isolation.test.mjs
./node_modules/.bin/vitest run --project unit src/next/styles/theme-lab.stories.test.tsx src/next/components/core-components.stories.test.tsx
```

- [ ] **Step 3: Crear Theme Lab y atlas compacto**

Theme Lab muestra tokens de surface/text/action/status, controles, focus, long content y pares de contraste. El tema Red Latina es un ejemplo local de la story mediante variables; no se exporta como segundo tema oficial. El atlas agrupa familias con `NextSection`, `NextStack` y `NextSurface`, evitando layouts gigantes.

- [ ] **Step 4: Documentar integración completa**

En `docs/VOREAL_NEXT.md` incluir ejemplos ejecutables de:

```tsx
import { VorealNextRoot } from "@voreal/ui/next";
import { NextButton } from "@voreal/ui/next/components/actions";
import "@voreal/ui/next/styles.css";

export function App() {
  return <VorealNextRoot theme="red-latina"><NextButton>Publicar negocio</NextButton></VorealNextRoot>;
}
```

y el bloque CSS de tema con todos los pares críticos de contraste. Documentar módulos server-safe/client-only, Link/Image adapters, portales y orden de cascade layers.

- [ ] **Step 5: Ejecutar suite completa y presupuestos**

```bash
./node_modules/.bin/vitest run --project unit
node --test scripts/*.test.mjs
./node_modules/.bin/vitest run --project a11y -t "accessib|violations"
./node_modules/.bin/tsc -p tsconfig.json --noEmit
./node_modules/.bin/tsc -p tsconfig.build.json
./node_modules/.bin/stylelint 'src/**/*.css'
node scripts/audit-next-css.mjs src/next
node scripts/check-css-budget.mjs src/next 28672
node scripts/check-css-budget.mjs src/next/components 20480
node scripts/check-css-budget.mjs src/next/patterns/directory 8192
./node_modules/.bin/storybook build
git diff --check
```

Expected: todos PASS; budgets bajo 28/20/8 KiB gzip.

- [ ] **Step 6: Verificar Storybook en navegador**

Ejecutar Storybook en el mecanismo de preview disponible y comprobar Theme Lab y atlas a 375, 768, 1024 y 1440. Validar teclado para tabs, stepper, radio, switch y drawer. Comparar visualmente con el directorio aprobado para densidad, bordes, radios, tipografía y color.

- [ ] **Step 7: Commit**

```bash
git add package.json src/next scripts docs/VOREAL_NEXT.md README.md CHANGELOG.md
git commit -m "docs(next): publish reusable core integration contract"
```

---

## Self-review checklist

- [ ] Cada token público de la especificación aparece en Task 1.
- [ ] Cada componente de la Entrega 1 tiene una tarea, API, test y CSS definidos.
- [ ] Ninguna tarea crea un patrón de perfil, wizard o dashboard antes del núcleo.
- [ ] Los módulos server-safe y client-only están separados explícitamente.
- [ ] La migración de drawers conserva regresión del directorio.
- [ ] Tema, Link/Image, portales y cascade layers están documentados.
- [ ] Unit, a11y, typecheck, stylelint, aislamiento, Storybook y budgets aparecen en gates.
- [ ] No existen pasos con implementaciones indeterminadas ni nombres de API inconsistentes.

## Después de esta entrega

Al completar y aprobar este plan se escribirán tres planes independientes, cada uno con una referencia visual y gates propios:

1. `Voreal Next Business Profile`.
2. `Voreal Next Business Onboarding Wizard`.
3. `Voreal Next Single-Business Dashboard`.

Cada plan consumirá únicamente la API pública producida aquí. Si una referencia revela una carencia general, primero se añadirá al núcleo con su propia prueba e historia; no se implementará como CSS privado de la página.
