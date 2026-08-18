# Voreal Next Directory Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una vista pública de directorio completa con el lenguaje visual de tarjetas aprobado, dentro de un namespace opt-in que pueda convivir con Voreal actual sin cambiarlo.

**Architecture:** Crear una isla de diseño autocontenida bajo `src/next`, con root, variables, capas y clases propias (`data-voreal-ui="next"`, `--vrn-*`, `.vrn-*`). Mantener los componentes estáticos compatibles con React Server Components, limitar `"use client"` a menús/drawers y controles que emiten eventos, e inyectar adaptadores para `next/link` y `next/image`. Exponer Voreal Next únicamente por subrutas nuevas; no añadirlo al entry point actual ni migrar otras familias hasta recibir aprobación visual.

**Tech Stack:** React 18.3–19, TypeScript 7, CSS por capas, Radix Dialog, adaptador Lucide aislado con fuentes oficiales, Storybook 10, Vitest + Testing Library + axe, Playwright.

## Global Constraints

- No modificar comportamiento, props, exports ni CSS de `src/components`, `src/patterns`, `src/primitives`, `src/styles`, `src/themes` o `src/tokens` existentes.
- Todo el source visual nuevo vive bajo `src/next`; toda clase nueva empieza con `.vrn-`; toda variable empieza con `--vrn-`.
- El entry point `@voreal/ui` y `@voreal/ui/styles.css` permanecen exactamente en sus rutas actuales. Voreal Next solo se consume desde `@voreal/ui/next`, `@voreal/ui/next/styles.css`, `@voreal/ui/next/components/*` o `@voreal/ui/next/patterns/directory`.
- No importar componentes o CSS `.vr-*` desde `src/next`. Se permite compartir únicamente dependencias externas y tipos/funciones sin estilos.
- No aplicar reset a `html`, `body` ni a elementos fuera de `[data-voreal-ui="next"]` o `[data-vrn-portal]`.
- Mantener un solo tema Voreal Next en esta entrega. No crear variantes oscuras ni mezclar Mercado contemporáneo con el diseño nuevo.
- Conservar la densidad aprobada: body `14–16px`, títulos de tarjeta `18px`, títulos de página `28–34px`, espacios de `4–64px`, tarjetas con radio `6–8px` y controles con radio `4–6px`.
- Usar botones, inputs y selects nativos cuando el navegador ya aporta el comportamiento correcto. Usar Radix Dialog solo para menú móvil y drawer de filtros.
- Usar iconos Lucide; no usar caracteres Unicode como `⌄`, `✓`, `★` o `↕` como iconos.
- No incluir fetch, backend, lógica de ranking, analytics, mapas, SearchCommand ni migración automática de Red Latina.
- El texto visible de errores debe ser corto y accionable. Los detalles técnicos quedan en callbacks o logs del consumidor.
- WCAG 2.2 AA, foco visible, targets táctiles de `44px`, forced colors, reduced motion y ausencia de overflow horizontal desde `375px`.
- Presupuesto: todo `src/next/**/*.css` `<= 24 KiB` gzip; `src/next/patterns/directory/**/*.css` `<= 8 KiB` gzip.
- Los assets de Storybook viven en `public/voreal-next`; no forman parte del paquete publicado ni crean una dependencia de imágenes en los componentes.
- La referencia visual de esta sesión es `generated_images/exec-ad9e2a67-c88d-4b4f-81ef-4336c8b524b4.png`. Si no está disponible al ejecutar, usar la especificación aprobada como fuente normativa y pedir al usuario que vuelva a adjuntarla antes de tomar decisiones visuales no cubiertas por la especificación.
- No hacer merge a `main`, publicar paquete ni cambiar Red Latina como parte de este plan. La entrega termina con Storybook listo para revisión.

---

## File map

### New source files

- `src/next/index.ts` — barrel opt-in de Voreal Next.
- `src/next/root.tsx` — `VorealNextRoot` y atributos para portales.
- `src/next/root.test.tsx` — contrato del root y aislamiento.
- `src/next/styles.css` — orden único de capas/imports.
- `src/next/styles/reset.css` — reset local.
- `src/next/styles/tokens.css` — paleta, espacio, tipografía, radios, motion y z-index.
- `src/next/styles/accessibility.css` — foco, forced colors y motion reducido.
- `src/next/foundations/index.ts` — exports de layout/tipografía.
- `src/next/foundations/layout.tsx` — container, stack, cluster, grid y divider.
- `src/next/foundations/layout.test.tsx` — semántica y customización.
- `src/next/foundations/typography.tsx` — heading, text y caption.
- `src/next/foundations/typography.test.tsx` — niveles y elementos.
- `src/next/foundations/foundations.css` — geometría compartida.
- `src/next/icons/index.ts` — exports del conjunto Lucide aislado.
- `src/next/icons/lucide.tsx` — adaptador React y nodos oficiales mínimos.
- `src/next/icons/lucide.test.tsx` — accesibilidad y geometría normalizada.
- `src/next/icons/LICENSE.lucide.txt` — licencia ISC de la fuente oficial.
- `src/next/components/actions/index.ts` — exports de acciones.
- `src/next/components/actions/actions.tsx` — button e icon button.
- `src/next/components/actions/actions.test.tsx` — estados y accesibilidad.
- `src/next/components/actions/actions.css` — variantes y tamaños.
- `src/next/components/forms/index.ts` — exports de formularios.
- `src/next/components/forms/forms.tsx` — field, input, select y checkbox.
- `src/next/components/forms/forms.test.tsx` — asociaciones, errores y props nativas.
- `src/next/components/forms/forms.css` — controles coherentes.
- `src/next/components/status/index.ts` — exports de tag y badge.
- `src/next/components/status/status.tsx` — chips/tags y badge.
- `src/next/components/status/status.test.tsx` — cierre y tonos.
- `src/next/components/status/status.css` — geometría compacta.
- `src/next/testing/render-voreal-next.tsx` — helper de pruebas bajo root nuevo.
- `src/next/patterns/directory/index.ts` — API pública del patrón.
- `src/next/patterns/directory/directory.types.ts` — contratos de datos, filtros y adaptadores.
- `src/next/patterns/directory/directory-header.tsx` — header desktop server-safe.
- `src/next/patterns/directory/directory-mobile-nav.tsx` — menú móvil Radix.
- `src/next/patterns/directory/directory-header.test.tsx` — navegación y menú.
- `src/next/patterns/directory/directory-search-form.tsx` — búsqueda `GET` server-safe.
- `src/next/patterns/directory/directory-search-form.test.tsx` — semántica y parámetros.
- `src/next/patterns/directory/directory-results-header.tsx` — título, conteo, tags y sort.
- `src/next/patterns/directory/directory-results-header.test.tsx` — acciones controladas.
- `src/next/patterns/directory/directory-filter-panel.tsx` — filtros desktop.
- `src/next/patterns/directory/directory-filter-drawer.tsx` — drawer móvil Radix.
- `src/next/patterns/directory/directory-filters.test.tsx` — controles, portal y foco.
- `src/next/patterns/directory/directory-media.tsx` — adaptador de imagen con fallback estable.
- `src/next/patterns/directory/directory-business-card.tsx` — tarjeta server-safe.
- `src/next/patterns/directory/directory-business-card.test.tsx` — anatomía, adapters y datos parciales.
- `src/next/patterns/directory/directory-layout.tsx` — shell, grid y composición por slots.
- `src/next/patterns/directory/directory-pagination.tsx` — paginación por links.
- `src/next/patterns/directory/directory-states.tsx` — loading, vacío y error.
- `src/next/patterns/directory/directory-layout.test.tsx` — grid, paginación y estados.
- `src/next/patterns/directory/directory.css` — patrón responsive completo.
- `src/next/patterns/directory/directory-reference.stories.tsx` — validación visual y estados.
- `scripts/next-isolation.test.mjs` — guarda exports, nombres y fronteras.
- `scripts/audit-next-css.mjs` — auditoría de namespace y selectores.
- `scripts/audit-next-css.test.mjs` — pruebas de la auditoría.
- `playwright.next.config.ts` — matriz aislada Chromium/Firefox/WebKit.
- `e2e/next-directory-reference.spec.ts` — visual, teclado, axe y responsive.
- `docs/VOREAL_NEXT.md` — consumo opt-in y puerta de aprobación.
- `public/voreal-next/brand/voreal-mark.png` — marca gráfica de demo sin texto.
- `public/voreal-next/directory/martinez-tax.webp`
- `public/voreal-next/directory/luna-beauty.webp`
- `public/voreal-next/directory/sabores-mi-tierra.webp`
- `public/voreal-next/directory/centro-integral.webp`
- `public/voreal-next/directory/baltimore-auto.webp`
- `public/voreal-next/directory/panaderia-esperanza.webp`

### Modified files

- `package.json` — subpath exports y scripts aislados.
- `.storybook/preview.tsx` — decorador condicional para historias `Next/*`.
- `.github/workflows/ci.yml` — auditorías/presupuestos nuevos y prueba cross-browser limitada a Voreal Next.
- `scripts/server-boundary.test.mjs` — lista explícita de módulos Next server-safe.
- `README.md` — enlace corto a preview opt-in.
- `CHANGELOG.md` — entrada experimental en “Próxima versión”.

---

### Task 1: Establish the isolated package boundary and CSS root

**Files:**
- Create: `src/next/root.tsx`
- Create: `src/next/root.test.tsx`
- Create: `src/next/index.ts`
- Create: `src/next/styles.css`
- Create: `src/next/styles/reset.css`
- Create: `src/next/styles/tokens.css`
- Create: `src/next/styles/accessibility.css`
- Create: `src/next/testing/render-voreal-next.tsx`
- Create: `scripts/next-isolation.test.mjs`
- Modify: `package.json`

**Interfaces:**

```ts
export type VorealNextRootProps = HTMLAttributes<HTMLDivElement>;
export function VorealNextRoot(props: VorealNextRootProps): ReactElement;
export const vorealNextPortalProps: { readonly "data-vrn-portal": "" };
```

- [ ] **Step 1: Write failing root and package-boundary tests**

Create `src/next/root.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VorealNextRoot, vorealNextPortalProps } from "./root";

describe("VorealNextRoot", () => {
  it("marks only its own subtree as Voreal Next", () => {
    render(<VorealNextRoot className="host-class">Contenido</VorealNextRoot>);
    const root = screen.getByText("Contenido");
    expect(root).toHaveAttribute("data-voreal-ui", "next");
    expect(root).toHaveClass("vrn-root", "host-class");
    expect(document.documentElement).not.toHaveAttribute("data-voreal-ui");
    expect(document.body).not.toHaveAttribute("data-voreal-ui");
  });

  it("provides a stable attribute for Radix portals", () => {
    expect(vorealNextPortalProps).toEqual({ "data-vrn-portal": "" });
  });
});
```

Create `scripts/next-isolation.test.mjs` with a test that reads `package.json` and asserts all of these exact mappings while also asserting the old mappings are unchanged:

```js
assert.equal(pkg.exports["."], "./src/index.ts");
assert.equal(pkg.exports["./styles.css"], "./src/styles/index.css");
assert.equal(pkg.exports["./next"], "./src/next/index.ts");
assert.equal(pkg.exports["./next/styles.css"], "./src/next/styles.css");
assert.equal(pkg.exports["./next/components/*"], "./src/next/components/*/index.ts");
assert.equal(pkg.exports["./next/patterns/directory"], "./src/next/patterns/directory/index.ts");
```

- [ ] **Step 2: Run the focused tests and verify red**

Run:

```bash
pnpm exec vitest run --project unit src/next/root.test.tsx
node --test scripts/next-isolation.test.mjs
```

Expected: FAIL because `src/next/root.tsx` and the new exports do not exist.

- [ ] **Step 3: Implement the root and public exports**

Implement `VorealNextRoot` with `forwardRef`, preserve caller props, merge `vrn-root` with `className`, set `data-voreal-ui="next"`, and never write to `document`, `html` or `body`.

Add these exact `package.json` exports without changing existing entries:

```json
"./next": "./src/next/index.ts",
"./next/styles.css": "./src/next/styles.css",
"./next/components/*": "./src/next/components/*/index.ts",
"./next/patterns/directory": "./src/next/patterns/directory/index.ts"
```

`src/next/index.ts` exports only the root, foundations, Next components and directory pattern. Do not re-export anything from `src/index.ts`.

- [ ] **Step 4: Implement the scoped CSS foundation**

Declare layer order once in `src/next/styles.css`:

```css
@layer vrn-reset, vrn-tokens, vrn-components, vrn-patterns, vrn-utilities;
@import "./styles/reset.css" layer(vrn-reset);
@import "./styles/tokens.css" layer(vrn-tokens);
@import "./foundations/foundations.css" layer(vrn-components);
@import "./components/actions/actions.css" layer(vrn-components);
@import "./components/forms/forms.css" layer(vrn-components);
@import "./components/status/status.css" layer(vrn-components);
@import "./patterns/directory/directory.css" layer(vrn-patterns);
@import "./styles/accessibility.css" layer(vrn-utilities);
```

The later component files may not exist yet; create empty files only when their implementation task begins. During Task 1 import only `reset.css`, `tokens.css`, and `accessibility.css`, then add imports together with each component task so every intermediate commit builds.

In `tokens.css`, scope all variables to:

```css
:where([data-voreal-ui="next"], [data-vrn-portal]) { /* --vrn-* */ }
```

Encode the approved palette exactly, plus the spacing sequence `0, 4, 8, 12, 16, 24, 32, 40, 48, 64`, control/card/overlay radii, type scale, `120/180/240ms`, focus ring, and named layers. `reset.css` may select bare elements only when every selector begins with `[data-voreal-ui="next"]` or `[data-vrn-portal]`.

- [ ] **Step 5: Run isolation, unit, type and style checks**

Run:

```bash
pnpm exec vitest run --project unit src/next/root.test.tsx
node --test scripts/next-isolation.test.mjs
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS and all legacy tests remain unchanged.

- [ ] **Step 6: Commit the isolated foundation**

```bash
git add package.json src/next scripts/next-isolation.test.mjs
git commit -m "feat(next): establish isolated Voreal Next root"
```

---

### Task 2: Add layout and typography foundations

**Files:**
- Create: `src/next/foundations/index.ts`
- Create: `src/next/foundations/layout.tsx`
- Create: `src/next/foundations/layout.test.tsx`
- Create: `src/next/foundations/typography.tsx`
- Create: `src/next/foundations/typography.test.tsx`
- Create: `src/next/foundations/foundations.css`
- Modify: `src/next/index.ts`
- Modify: `src/next/styles.css`

**Interfaces:**

```ts
export type NextContainerProps = HTMLAttributes<HTMLDivElement>;
export type NextStackProps = HTMLAttributes<HTMLDivElement> & { gap?: "1" | "2" | "3" | "4" | "5" | "6" };
export type NextClusterProps = HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end"; justify?: "start" | "between" | "end" };
export type NextGridProps = HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 };
export type NextDividerProps = HTMLAttributes<HTMLHRElement>;
export type NextHeadingProps = HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4"; size?: "page" | "section" | "card" };
export type NextTextProps = HTMLAttributes<HTMLParagraphElement> & { as?: "p" | "span"; tone?: "default" | "muted" };
export type NextCaptionProps = HTMLAttributes<HTMLSpanElement>;
```

- [ ] **Step 1: Write failing semantic tests**

Test that `NextContainer` keeps caller classes, `NextStack` serializes `data-gap="3"`, `NextGrid` serializes `data-columns="3"`, `NextDivider` renders `<hr>`, `NextHeading as="h3" size="card"` renders an `h3`, and `NextText as="span" tone="muted"` renders a span with `data-tone="muted"`.

- [ ] **Step 2: Run the focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/foundations
```

Expected: FAIL because the foundation modules do not exist.

- [ ] **Step 3: Implement boundary-neutral primitives**

Do not add `"use client"`; these components only render HTML and data attributes. Use `clsx` directly so they do not depend on the current Voreal utility layer. Reject arbitrary numeric spacing props; the closed token union is intentional.

Implement `.vrn-container` at `min(100% - 2 * var(--vrn-gutter), 90rem)`, with `--vrn-gutter: 1rem` by default, `1.5rem` from `48rem`, and `2rem` from `75rem`. Implement grid/flex rules without container queries. Avoid default vertical padding in `NextContainer`.

- [ ] **Step 4: Verify unit, type, CSS and legacy behavior**

```bash
pnpm exec vitest run --project unit src/next/foundations
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 5: Commit foundations**

```bash
git add src/next
git commit -m "feat(next): add compact layout and type foundations"
```

---

### Task 3: Add the shared action, form and status language

**Files:**
- Create: `src/next/components/actions/index.ts`
- Create: `src/next/components/actions/actions.tsx`
- Create: `src/next/components/actions/actions.test.tsx`
- Create: `src/next/components/actions/actions.css`
- Create: `src/next/components/forms/index.ts`
- Create: `src/next/components/forms/forms.tsx`
- Create: `src/next/components/forms/forms.test.tsx`
- Create: `src/next/components/forms/forms.css`
- Create: `src/next/components/status/index.ts`
- Create: `src/next/components/status/status.tsx`
- Create: `src/next/components/status/status.test.tsx`
- Create: `src/next/components/status/status.css`
- Create: `src/next/icons/index.ts`
- Create: `src/next/icons/lucide.tsx`
- Create: `src/next/icons/lucide.test.tsx`
- Create: `src/next/icons/LICENSE.lucide.txt`
- Modify: `src/next/index.ts`
- Modify: `src/next/styles.css`

**Interfaces:**

```ts
export type NextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export type NextIconButtonProps = Omit<NextButtonProps, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
};

export type NextFieldProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

export type NextInputProps = InputHTMLAttributes<HTMLInputElement>;
export type NextSelectProps = SelectHTMLAttributes<HTMLSelectElement>;
export type NextCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  count?: number;
};

export type NextTagProps = HTMLAttributes<HTMLSpanElement> & {
  onRemove?: () => void;
  removeLabel?: string;
  tone?: "neutral" | "success";
};

export type NextBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
};
```

- [ ] **Step 1: Vendor the canonical icon source as an isolated adapter**

The package registry is unavailable in this execution environment, so do not add a network dependency or reuse the current `.vr-icon` implementation. Fetch `badge-check.svg`, `chevron-left.svg`, `chevron-right.svg`, `heart.svg`, `image-off.svg`, `loader-circle.svg`, `map-pin.svg`, `menu.svg`, `search.svg`, `sliders-horizontal.svg`, `star.svg`, `triangle-alert.svg`, `user-round.svg`, `x.svg` and the ISC license from the official `lucide-icons/lucide` repository at release tag `1.16.0` using the installed GitHub connector. Preserve their official path/circle/line data verbatim in `src/next/icons/lucide.tsx`, record the upstream repository/tag in a source comment, and store the license in `LICENSE.lucide.txt`.

Expose `BadgeCheck`, `ChevronLeft`, `ChevronRight`, `Heart`, `ImageOff`, `LoaderCircle`, `MapPin`, `Menu`, `Search`, `SlidersHorizontal`, `Star`, `TriangleAlert`, `UserRound`, and `X` through one small `forwardRef` React adapter with the same stroke defaults as Lucide: `24 × 24` viewBox, no fill, currentColor stroke, round cap/join and stroke width `2`. The adapter accepts standard `SVGProps<SVGSVGElement>` and an optional accessible `label`. Decorative icons default to `aria-hidden="true"`; labelled icons receive `role="img"` and `aria-label`.

This is the approved equivalent-adapter path from the design specification and keeps Voreal Next self-contained, tree-shakable and independent from registry availability. Do not hand-draw, approximate or copy icon paths from current Voreal.

- [ ] **Step 2: Write failing component tests**

Cover these exact behaviors:

```tsx
it("disables a loading primary button without replacing its accessible name", () => {
  renderNext(<NextButton loading>Buscar</NextButton>);
  expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("aria-busy", "true");
});

it("requires a text label for an icon-only button", () => {
  renderNext(<NextIconButton label="Guardar en favoritos"><Heart /></NextIconButton>);
  expect(screen.getByRole("button", { name: "Guardar en favoritos" })).toBeVisible();
});

it("connects field error and hint text to the input", () => {
  renderNext(
    <NextField error="Escribe una ciudad" hint="Ciudad o código postal" htmlFor="city" label="Ubicación">
      <NextInput id="city" />
    </NextField>,
  );
  expect(screen.getByLabelText("Ubicación")).toHaveAccessibleDescription("Ciudad o código postal Escribe una ciudad");
  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("aria-invalid", "true");
});

it("uses a real select and checkbox", () => {
  renderNext(<><NextSelect aria-label="Ordenar"><option>Relevancia</option></NextSelect><NextCheckbox label="Verificados" count={31} /></>);
  expect(screen.getByRole("combobox", { name: "Ordenar" })).toBeVisible();
  expect(screen.getByRole("checkbox", { name: /Verificados/ })).toBeVisible();
});

it("gives a removable filter an explicit action name", async () => {
  const user = userEvent.setup();
  const onRemove = vi.fn();
  renderNext(<NextTag onRemove={onRemove} removeLabel="Quitar filtro Restaurantes">Restaurantes</NextTag>);
  await user.click(screen.getByRole("button", { name: "Quitar filtro Restaurantes" }));
  expect(onRemove).toHaveBeenCalledOnce();
});
```

`renderNext` is the helper from `src/next/testing/render-voreal-next.tsx`; it must wrap content in `<VorealNextRoot>`.

- [ ] **Step 3: Run focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/components
```

Expected: FAIL because the components do not exist.

- [ ] **Step 4: Implement one shared geometry**

Use `forwardRef` for all native controls. Import `LoaderCircle` and `X` from `src/next/icons`; normalize icon size through `.vrn-icon` (`1em`, `stroke-width: 2`) rather than per-component coordinates. Keep button/input/select heights at `2.75rem` for default and `2.5rem` for small. Use the same `1px` border, `4–6px` radius, `0.875rem` label size and focus token across all controls.

`NextField` must clone only a valid single input/select child to append `aria-describedby` and `aria-invalid`; document that arbitrary child groups are not accepted. Generate deterministic hint/error ids from `htmlFor`, not `useId`, so SSR output is stable.

`NextSelect` must remain native. Style its arrow with Lucide-compatible CSS mask only if a checked-in icon asset exists; otherwise retain the browser arrow with `appearance: auto`. Do not use a Unicode arrow and do not create a portaled menu.

- [ ] **Step 5: Run focused accessibility and full checks**

Add one `vitest-axe` case covering button, field, select, checkbox, tag and badge together. Then run:

```bash
pnpm exec vitest run --project unit src/next/components
pnpm exec vitest run --project a11y -t "Voreal Next controls"
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 6: Commit the shared component language**

```bash
git add src/next
git commit -m "feat(next): add cohesive controls and status components"
```

---

### Task 4: Create deterministic Storybook assets and the responsive directory header

**Files:**
- Create: `public/voreal-next/brand/voreal-mark.png`
- Create: `public/voreal-next/directory/martinez-tax.webp`
- Create: `public/voreal-next/directory/luna-beauty.webp`
- Create: `public/voreal-next/directory/sabores-mi-tierra.webp`
- Create: `public/voreal-next/directory/centro-integral.webp`
- Create: `public/voreal-next/directory/baltimore-auto.webp`
- Create: `public/voreal-next/directory/panaderia-esperanza.webp`
- Create: `src/next/patterns/directory/directory.types.ts`
- Create: `src/next/patterns/directory/directory-header.tsx`
- Create: `src/next/patterns/directory/directory-mobile-nav.tsx`
- Create: `src/next/patterns/directory/directory-header.test.tsx`
- Create: `src/next/patterns/directory/index.ts`
- Create: `src/next/patterns/directory/directory.css`
- Modify: `src/next/index.ts`
- Modify: `src/next/styles.css`

**Core contracts:**

```ts
import type { AnchorHTMLAttributes, ElementType, ReactNode } from "react";

export type VorealNextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};
export type VorealNextLinkComponent = ElementType<VorealNextLinkProps>;

export type NextDirectoryNavItem = {
  href: string;
  label: string;
};

export type NextDirectoryHeaderProps = {
  accountLabel?: string;
  brand: ReactNode;
  descriptor?: string;
  LinkComponent?: VorealNextLinkComponent;
  navItems: readonly NextDirectoryNavItem[];
  primaryAction: NextDirectoryNavItem;
};
```

- [ ] **Step 1: Generate owned, stable fixtures with the imagegen skill**

Use the `imagegen` skill because these are real visual fixtures, not CSS placeholders. Generate one asset per call; never generate a collage and crop it into sprites.

For `voreal-mark.png`, use:

```text
Create one compact abstract brand mark for Voreal: a precise geometric blue symbol suggesting discovery, location and an open doorway, simple enough for a 32px navigation logo. Transparent background, centered, no wordmark, no letters, no mockup, no shadow, no gradients, no border, one deep accessible blue (#0F5BDE) with optional navy detail (#0B1F3A), modern enterprise design-system quality.
```

For the six directory images, generate separate documentary-style horizontal photographs at a consistent `3:2` composition. Use these subjects in order: bilingual tax professional at a tidy desk; modern Latina-owned beauty studio interior; plated Latin American comfort food; welcoming community services office; Latino-owned auto repair shop; neighborhood Latin bakery counter. Each prompt must include:

```text
Natural editorial business-directory photography, authentic everyday environment, respectful contemporary Latino community context, soft daylight, restrained colors, no flags, no festival props, no text, no logos, no watermark, no split screen, horizontal 3:2 composition with the subject centered safely for responsive cropping.
```

Save outputs to the exact paths above and convert only the six photographs to WebP at quality `82`; keep the transparent mark as PNG. Do not put these files under `src/next` and do not export them from the package.

- [ ] **Step 2: Verify asset integrity**

Run:

```bash
file public/voreal-next/brand/voreal-mark.png public/voreal-next/directory/*
du -ch public/voreal-next/brand/voreal-mark.png public/voreal-next/directory/*
```

Expected: one valid PNG, six valid WebP files, no file larger than `350 KB`, and no combined asset size larger than `1.5 MB`. Inspect every image directly before continuing; reject warped hands, illegible pseudo-text, watermarks, stereotypes or visibly synthetic business signage.

- [ ] **Step 3: Write failing header tests**

Test the server-safe desktop shell and the client mobile menu:

```tsx
const navigation = [
  { href: "/para-negocios", label: "Para negocios" },
  { href: "/recursos", label: "Recursos" },
  { href: "/favoritos", label: "Favoritos" },
] as const;

it("renders injected links and the complete approved navigation", () => {
  renderNext(
    <NextDirectoryHeader
      brand={<span>voreal</span>}
      descriptor="Directorio de negocios latinos"
      LinkComponent={TestLink}
      navItems={navigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />,
  );
  expect(screen.getByRole("banner")).toBeVisible();
  expect(screen.getByRole("link", { name: "Listar mi negocio" })).toHaveAttribute("data-test-link", "true");
  expect(screen.getByText("Directorio de negocios latinos")).toBeVisible();
});

it("opens a labelled mobile menu and restores focus when it closes", async () => {
  const user = userEvent.setup();
  renderNext(<HeaderFixture />);
  const trigger = screen.getByRole("button", { name: "Abrir navegación" });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Navegación" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Cerrar navegación" }));
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 4: Run the focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-header.test.tsx
```

Expected: FAIL because the directory header modules do not exist.

- [ ] **Step 5: Implement header and mobile menu without coupling the brand asset**

`NextDirectoryHeader` is boundary-neutral and requires a `brand` slot; the package does not assume a public asset path. The Storybook fixture will compose the generated mark with the lowercase text `voreal`. Use a real `<header>`, one labelled `<nav>`, and `LinkComponent = "a"` by default.

`NextDirectoryMobileNav` begins with `"use client"` and wraps `@radix-ui/react-dialog`. Apply `vorealNextPortalProps` to both overlay and content. Use Lucide `Menu` and `X`, preserve focus, lock background scrolling through Radix, and render the same navigation data as desktop. The primary “Listar mi negocio” action stays visible beside the mark on mobile; secondary links move into the dialog.

Implement a `64px` desktop header, one bottom border, no floating panel and no decorative background block. At widths below `48rem`, hide the desktop nav/descriptor and reveal the mobile trigger without changing source order.

- [ ] **Step 6: Verify header accessibility and full suite**

Add axe coverage with the dialog open, then run:

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-header.test.tsx
pnpm exec vitest run --project a11y -t "Voreal Next header"
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 7: Commit assets and header**

```bash
git add public/voreal-next src/next
git commit -m "feat(next): add responsive directory identity and navigation"
```

---

### Task 5: Build the server-first compound search and results toolbar

**Files:**
- Create: `src/next/patterns/directory/directory-search-form.tsx`
- Create: `src/next/patterns/directory/directory-search-form.test.tsx`
- Create: `src/next/patterns/directory/directory-results-header.tsx`
- Create: `src/next/patterns/directory/directory-results-header.test.tsx`
- Modify: `src/next/patterns/directory/directory.types.ts`
- Modify: `src/next/patterns/directory/index.ts`
- Modify: `src/next/patterns/directory/directory.css`
- Modify: `scripts/server-boundary.test.mjs`

**Contracts:**

```ts
export type NextDirectorySearchValue = {
  query: string;
  location: string;
};

export type NextDirectorySearchFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "method"> & {
  action: string;
  defaultValue: NextDirectorySearchValue;
  loading?: boolean;
  locationLabel?: string;
  queryLabel?: string;
  submitLabel?: string;
};

export type NextActiveFilter = {
  id: string;
  label: string;
};

export type NextDirectorySort = "relevance" | "rating" | "distance" | "newest";

export type NextDirectoryResultsHeaderProps = {
  activeFilters: readonly NextActiveFilter[];
  locationLabel: string;
  mobileFilterTrigger?: ReactNode;
  onClearAll?: () => void;
  onRemoveFilter?: (id: string) => void;
  onSortChange?: (value: NextDirectorySort) => void;
  queryLabel?: string;
  resultCount: number;
  sort: NextDirectorySort;
};
```

- [ ] **Step 1: Write failing native search tests**

```tsx
it("renders a canonical GET search that works without JavaScript", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "restaurantes", location: "Baltimore, MD" }}
    />,
  );
  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(form).toHaveAttribute("method", "get");
  expect(form).toHaveAttribute("action", "/directorio");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveAttribute("name", "q");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveAttribute("name", "location");
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("type", "submit");
});

it("keeps explicit labels when the initial values are empty", () => {
  renderNext(<NextDirectorySearchForm action="/directorio" defaultValue={{ query: "", location: "" }} />);
  expect(screen.getByLabelText("¿Qué buscas?")).toBeVisible();
  expect(screen.getByLabelText("¿Dónde?")).toBeVisible();
});
```

Add `directory-search-form.tsx` to the server-safe list in `scripts/server-boundary.test.mjs` and assert it contains neither `"use client"`, `@radix-ui`, hooks nor imports from current Voreal components.

- [ ] **Step 2: Write failing result-toolbar tests**

```tsx
it("announces result count and exposes concise filter actions", async () => {
  const user = userEvent.setup();
  const remove = vi.fn();
  const clear = vi.fn();
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[{ id: "food", label: "Restaurantes" }]}
      locationLabel="Baltimore, MD"
      onClearAll={clear}
      onRemoveFilter={remove}
      resultCount={124}
      sort="relevance"
    />,
  );
  expect(screen.getByRole("heading", { name: "Negocios en Baltimore, MD" })).toBeVisible();
  expect(screen.getByText("124 resultados")).toHaveAttribute("aria-live", "polite");
  await user.click(screen.getByRole("button", { name: "Quitar filtro Restaurantes" }));
  expect(remove).toHaveBeenCalledWith("food");
  await user.click(screen.getByRole("button", { name: "Limpiar todos los filtros" }));
  expect(clear).toHaveBeenCalledOnce();
});
```

- [ ] **Step 3: Run focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-search-form.test.tsx src/next/patterns/directory/directory-results-header.test.tsx
node --test scripts/server-boundary.test.mjs
```

Expected: FAIL because the modules are absent and the boundary list is not implemented.

- [ ] **Step 4: Implement the approved search composition**

`NextDirectorySearchForm` remains server-safe and uses native uncontrolled values. It renders one horizontal surface on desktop: query field, internal divider, location field and blue submit button. Labels sit above values; placeholders may supplement but never replace them. It stacks within the same bordered surface below `48rem`. Use Lucide `Search` and `MapPin` as decorative icons with `aria-hidden="true"`.

Preserve unknown `FormHTMLAttributes` so hosts may set `target`, `encType`, `data-*` and native form actions. Force `method="get"`. When `loading`, disable only the submit button and preserve the inputs.

`NextDirectoryResultsHeader` begins with `"use client"` because it attaches controlled callbacks. Use `NextTag` and native `NextSelect`; map select values to the closed `NextDirectorySort` union. Keep sort right-aligned on desktop and render `mobileFilterTrigger` beside it in the same compact toolbar below `64rem`.

- [ ] **Step 5: Verify semantics, boundaries and CSS**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-search-form.test.tsx src/next/patterns/directory/directory-results-header.test.tsx
node --test scripts/server-boundary.test.mjs
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 6: Commit search and toolbar**

```bash
git add src/next scripts/server-boundary.test.mjs
git commit -m "feat(next): add server-first directory search and toolbar"
```

---

### Task 6: Add one filter model for desktop sidebar and mobile drawer

**Files:**
- Create: `src/next/patterns/directory/directory-filter-panel.tsx`
- Create: `src/next/patterns/directory/directory-filter-drawer.tsx`
- Create: `src/next/patterns/directory/directory-filters.test.tsx`
- Modify: `src/next/patterns/directory/directory.types.ts`
- Modify: `src/next/patterns/directory/index.ts`
- Modify: `src/next/patterns/directory/directory.css`

**Contracts:**

```ts
export type NextDirectoryFilterOption = {
  count?: number;
  disabled?: boolean;
  label: string;
  value: string;
};

export type NextDirectoryRadius = "5" | "10" | "25" | "50";

export type NextDirectoryFilterValue = {
  categories: readonly string[];
  languages: readonly string[];
  openNow: boolean;
  postalCode: string;
  radius: NextDirectoryRadius;
  verifiedOnly: boolean;
};

export type NextDirectoryFilterPanelProps = {
  categories: readonly NextDirectoryFilterOption[];
  languages: readonly NextDirectoryFilterOption[];
  onValueChange: (value: NextDirectoryFilterValue) => void;
  value: NextDirectoryFilterValue;
};

export type NextDirectoryFilterDrawerProps = NextDirectoryFilterPanelProps & {
  onApply?: () => void;
  onClear?: () => void;
  resultCount: number;
};
```

- [ ] **Step 1: Write failing shared-state and portal tests**

```tsx
it("updates one immutable filter value from the desktop panel", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  renderNext(<FilterPanelFixture onValueChange={onValueChange} />);
  await user.click(screen.getByRole("checkbox", { name: /Restaurantes/ }));
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ categories: ["food"] }));
});

it("renders the same filters visibly inside a portalled mobile drawer", async () => {
  const user = userEvent.setup();
  renderNext(<FilterDrawerFixture />);
  await user.click(screen.getByRole("button", { name: "Abrir filtros" }));
  const dialog = screen.getByRole("dialog", { name: "Filtros" });
  expect(dialog).toBeVisible();
  expect(dialog).toHaveAttribute("data-vrn-portal");
  expect(within(dialog).getByRole("combobox", { name: "Distancia" })).toBeVisible();
  expect(within(dialog).getByRole("option", { name: "25 millas" })).toBeVisible();
});

it("keeps the user-facing apply label concise", async () => {
  renderNext(<FilterDrawerFixture resultCount={124} />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));
  expect(screen.getByRole("button", { name: "Ver 124 resultados" })).toBeVisible();
  expect(screen.queryByText(/payload|exception|diagnostic|stack/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-filters.test.tsx
```

Expected: FAIL because the panel/drawer do not exist.

- [ ] **Step 3: Implement a single controlled model**

Begin both files with `"use client"`. `NextDirectoryFilterPanel` contains fieldsets for Categoría and Idioma, a postal-code field, a native distance select, and boolean checkboxes for Verificado and Abierto ahora. Clone arrays when updating; never mutate the incoming value.

The desktop panel has no card background, radius or shadow. It uses a `248–272px` column, group headings and dividers. It may be sticky at `top: calc(4rem + 1.5rem)` only from `64rem` upward.

`NextDirectoryFilterDrawer` uses Radix Dialog and renders `NextDirectoryFilterPanel` directly, not a duplicated filter tree. Attach `vorealNextPortalProps` to overlay/content. Use a right drawer from `48–63.99rem` and bottom sheet below `48rem`; constrain content height, set `overflow-y: auto`, and keep a sticky action footer. The native select must remain visible inside it with pointer and keyboard input.

- [ ] **Step 4: Add open-drawer axe and keyboard tests**

Cover Escape close, focus restoration, Tab containment, a visible select option, and no axe violations while the drawer is open.

- [ ] **Step 5: Run full checks**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-filters.test.tsx
pnpm exec vitest run --project a11y -t "Voreal Next filters"
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 6: Commit filter surfaces**

```bash
git add src/next
git commit -m "feat(next): add responsive directory filters"
```

---

### Task 7: Implement the compact business card with Link/Image adapters

**Files:**
- Create: `src/next/patterns/directory/directory-media.tsx`
- Create: `src/next/patterns/directory/directory-business-card.tsx`
- Create: `src/next/patterns/directory/directory-business-card.test.tsx`
- Modify: `src/next/patterns/directory/directory.types.ts`
- Modify: `src/next/patterns/directory/index.ts`
- Modify: `src/next/patterns/directory/directory.css`
- Modify: `scripts/server-boundary.test.mjs`

**Contracts:**

```ts
import type { ElementType, ImgHTMLAttributes, ReactNode } from "react";

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

export type NextDirectoryImage = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export type NextBusinessStatus = {
  kind: "open" | "closing" | "closed";
  label: string;
};

export type NextDirectoryBusiness = {
  category: string;
  description?: string;
  distance?: string;
  href: string;
  id: string;
  image?: NextDirectoryImage;
  location: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  status?: NextBusinessStatus;
  verified?: boolean;
};

export type NextDirectoryMediaProps = {
  ImageComponent?: VorealNextImageComponent;
  image?: NextDirectoryImage;
  name: string;
  sizes?: string;
};

export type NextDirectoryBusinessCardProps = {
  business: NextDirectoryBusiness;
  favoriteControl?: ReactNode;
  ImageComponent?: VorealNextImageComponent;
  LinkComponent?: VorealNextLinkComponent;
};
```

- [ ] **Step 1: Write failing adapter and anatomy tests**

```tsx
it("keeps the approved card anatomy and injected navigation/media adapters", () => {
  renderNext(
    <NextDirectoryBusinessCard
      business={completeBusiness}
      favoriteControl={<button aria-label="Guardar Martínez Tax Services" />}
      ImageComponent={TestImage}
      LinkComponent={TestLink}
    />,
  );
  const article = screen.getByRole("article", { name: "Martínez Tax Services" });
  expect(within(article).getByText("Impuestos y contabilidad")).toBeVisible();
  expect(within(article).getByRole("heading", { level: 3, name: "Martínez Tax Services" })).toBeVisible();
  expect(within(article).getByText("Dundalk, MD · 4.2 mi")).toBeVisible();
  expect(within(article).getByText("4.8 · 96 reseñas")).toBeVisible();
  expect(within(article).getByText("Verificado")).toBeVisible();
  expect(within(article).getByRole("link", { name: "Ver Martínez Tax Services" })).toHaveAttribute("data-test-link", "true");
  expect(within(article).getByRole("img", { name: "Oficina de Martínez Tax Services" })).toHaveAttribute("data-test-image", "true");
});

it("renders a stable neutral fallback and no invented rating", () => {
  renderNext(<NextDirectoryBusinessCard business={partialBusiness} />);
  expect(screen.getByRole("img", { name: "Imagen no disponible para Centro Integral" })).toBeVisible();
  expect(screen.getByText("Sin reseñas")).toBeVisible();
  expect(screen.queryByText(/0\.0/)).not.toBeInTheDocument();
});

it("keeps favorite interaction outside the card link", () => {
  const { container } = renderNext(
    <NextDirectoryBusinessCard business={completeBusiness} favoriteControl={<button aria-label="Guardar negocio" />} />,
  );
  expect(container.querySelector("a button, button a")).toBeNull();
});
```

The test adapters must pass all received props to a native `a`/`img` and stamp `data-test-link`/`data-test-image`; this verifies dimensions, alt, sizes and class propagation without installing Next.js.

- [ ] **Step 2: Run focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-business-card.test.tsx
```

Expected: FAIL because media/card modules do not exist.

- [ ] **Step 3: Implement server-safe media and card**

Do not add `"use client"`, hooks or event handlers. Default `ImageComponent` to native `img` and `LinkComponent` to native `a`. Always provide explicit width/height and default sizes `"(max-width: 47.99rem) calc(100vw - 2rem), (max-width: 74.99rem) calc(50vw - 3rem), 22rem"`.

`NextDirectoryMedia` owns a `3 / 2` frame and sets `overflow: hidden`; its image uses `width/height: 100%` and `object-fit: cover`. Missing media renders a quiet `ImageOff` Lucide icon on `Surface muted`, with a useful accessible label and no giant initials.

`NextDirectoryBusinessCard` renders exactly: media/favorite slot, category, `h3`, two-line description when present, location/distance, rating/reviews or “Sin reseñas”, open/closed status, verified badge, and bottom-aligned “Ver {name}” link. Use CSS grid rows and `margin-block-start: auto` for the CTA. Do not stretch the photo or truncate the name to one line.

Append these modules to the explicit server-safe list in `scripts/server-boundary.test.mjs`.

- [ ] **Step 4: Verify server boundary, adapters and accessibility**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-business-card.test.tsx
node --test scripts/server-boundary.test.mjs
pnpm exec vitest run --project a11y -t "Voreal Next business card"
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 5: Commit the card system**

```bash
git add src/next scripts/server-boundary.test.mjs
git commit -m "feat(next): add compact directory business cards"
```

---

### Task 8: Compose the responsive shell, grid, pagination and data states

**Files:**
- Create: `src/next/patterns/directory/directory-layout.tsx`
- Create: `src/next/patterns/directory/directory-pagination.tsx`
- Create: `src/next/patterns/directory/directory-states.tsx`
- Create: `src/next/patterns/directory/directory-layout.test.tsx`
- Modify: `src/next/patterns/directory/index.ts`
- Modify: `src/next/patterns/directory/directory.css`
- Modify: `scripts/server-boundary.test.mjs`

**Contracts:**

```ts
export type NextDirectoryLayoutProps = {
  children: ReactNode;
  filters: ReactNode;
  header: ReactNode;
  resultsHeader: ReactNode;
  search: ReactNode;
};

export type NextDirectoryCardGridProps = HTMLAttributes<HTMLDivElement>;

export type NextDirectoryPaginationProps = {
  currentPage: number;
  getPageHref: (page: number) => string;
  label?: string;
  LinkComponent?: VorealNextLinkComponent;
  pageCount: number;
};

export type NextDirectoryLoadingProps = { count?: number };
export type NextDirectoryEmptyProps = { action?: ReactNode; description: string; title: string };
export type NextDirectoryErrorProps = { action?: ReactNode; description?: string; title?: string };
```

- [ ] **Step 1: Write failing composition and state tests**

```tsx
it("renders slots in one predictable landmark structure", () => {
  renderNext(
    <NextDirectoryLayout
      filters={<span>Filtros desktop</span>}
      header={<span>Header</span>}
      resultsHeader={<span>Resumen</span>}
      search={<form role="search" />}
    >
      <NextDirectoryCardGrid><article>Negocio</article></NextDirectoryCardGrid>
    </NextDirectoryLayout>,
  );
  expect(screen.getByRole("main")).toBeVisible();
  expect(screen.getByRole("complementary", { name: "Filtros" })).toContainElement(screen.getByText("Filtros desktop"));
  expect(screen.getByRole("region", { name: "Resultados" })).toContainElement(screen.getByText("Negocio"));
});

it("uses crawlable links and marks the current page", () => {
  renderNext(<NextDirectoryPagination currentPage={2} getPageHref={(page) => `/directorio?page=${page}`} pageCount={4} />);
  expect(screen.getByRole("link", { name: "Página 3" })).toHaveAttribute("href", "/directorio?page=3");
  expect(screen.getByRole("link", { name: "Página 2" })).toHaveAttribute("aria-current", "page");
});

it("shows concise recoverable states", () => {
  const { rerender } = renderNext(
    <NextDirectoryEmpty action={<button>Limpiar filtros</button>} description="Prueba otra categoría o distancia." title="No encontramos negocios" />,
  );
  expect(screen.getByRole("heading", { name: "No encontramos negocios" })).toBeVisible();
  rerender(
    <VorealNextRoot><NextDirectoryError action={<button>Intentar de nuevo</button>} /></VorealNextRoot>,
  );
  expect(screen.getByText("No pudimos cargar los negocios.")).toBeVisible();
  expect(screen.queryByText(/stack|exception|500|payload/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run focused tests and verify red**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-layout.test.tsx
```

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Implement the 12/8/4-column composition**

Keep all three modules boundary-neutral. `NextDirectoryLayout` uses a full-width header, then one shared `NextContainer` for search and content. Desktop content uses a `16.5rem` sidebar plus a flexible results column. Below `64rem`, hide the fixed sidebar; `NextDirectoryResultsHeader` exposes its `mobileFilterTrigger`. Render two card columns from `48–74.99rem`, one below `48rem`, and three from `75rem`. Use gaps of `1.5rem` desktop and `1rem` mobile.

Do not wrap the search, results summary, sidebar or grid in unrelated cards. Each section should be separated by alignment, `1.5–2rem` spacing and at most one divider.

`NextDirectoryPagination` clamps impossible page inputs to valid ranges, renders first/previous/current neighborhood/next/last without ellipsis characters used as controls, and exposes accessible text labels. Hide pagination when `pageCount <= 1`.

`NextDirectoryLoading` renders six skeleton cards using the exact card anatomy and a stable `3:2` media box. State components render only the supplied public action slot and concise text.

Append these modules to `scripts/server-boundary.test.mjs`.

- [ ] **Step 4: Verify boundaries, states and a11y**

```bash
pnpm exec vitest run --project unit src/next/patterns/directory/directory-layout.test.tsx
node --test scripts/server-boundary.test.mjs
pnpm exec vitest run --project a11y -t "Voreal Next directory states"
pnpm typecheck
pnpm lint:css
pnpm test
```

Expected: all PASS.

- [ ] **Step 5: Commit the complete server-safe composition**

```bash
git add src/next scripts/server-boundary.test.mjs
git commit -m "feat(next): compose responsive directory result states"
```

---

### Task 9: Assemble the approved full-page Storybook reference

**Files:**
- Create: `src/next/patterns/directory/directory-reference.stories.tsx`
- Modify: `.storybook/preview.tsx`
- Modify: `src/next/patterns/directory/directory.css`

**Story contract:**

- Title: `Next/Patterns/Directory Reference`
- Story exports: `Cards`, `Mobile375`, `Tablet768`, `Loading`, `NoResults`, `Error`, `LongContent`, `MissingImage`
- Canonical review URL: `/?path=/story/next-patterns-directory-reference--cards`

- [ ] **Step 1: Make Storybook understand the isolated root**

Import `VorealNextRoot` and `../src/next/styles.css` in `.storybook/preview.tsx`. Update the decorator with this branch before the current `VorealRoot` return:

```tsx
if (context.title.startsWith("Next/")) {
  return (
    <VorealNextRoot style={{ minHeight: "100vh" }}>
      <Story />
    </VorealNextRoot>
  );
}
```

Do not nest Voreal Next stories inside `VorealRoot`; do not change the wrapper for existing stories.

- [ ] **Step 2: Build the controlled demo fixture**

The story file may use React state because it is demo-only. It must compose the public components instead of duplicating their markup. Use the six exact fixture identities below:

```ts
const businesses: readonly NextDirectoryBusiness[] = [
  { id: "martinez-tax", name: "Martínez Tax Services", category: "Impuestos y contabilidad", location: "Dundalk, MD", distance: "4.2 mi", rating: 4.8, reviewCount: 96, status: { kind: "open", label: "Abierto ahora" }, verified: true },
  { id: "luna-beauty", name: "Luna Beauty Studio", category: "Belleza y bienestar", location: "Essex, MD", distance: "6.1 mi", rating: 4.7, reviewCount: 67, status: { kind: "closing", label: "Cierra a las 6" }, verified: true },
  { id: "sabores-mi-tierra", name: "Sabores de Mi Tierra", category: "Restaurante latino", location: "Highlandtown, Baltimore", distance: "1.8 mi", rating: 4.9, reviewCount: 184, status: { kind: "open", label: "Abierto ahora" }, verified: true },
  { id: "centro-integral", name: "Centro Integral", category: "Servicios profesionales", location: "Silver Spring, MD", distance: "28 mi", status: { kind: "closed", label: "Con cita" }, verified: true },
  { id: "baltimore-auto", name: "Baltimore Auto Latino", category: "Reparación de autos", location: "Rosedale, MD", distance: "7.4 mi", rating: 4.6, reviewCount: 42, status: { kind: "open", label: "Abierto ahora" } },
  { id: "panaderia-esperanza", name: "Panadería La Esperanza", category: "Panadería", location: "Patterson Park, Baltimore", distance: "2.3 mi", rating: 4.9, reviewCount: 121, status: { kind: "closing", label: "Cierra a las 7" }, verified: true },
];
```

Add one natural two-sentence description and the matching `/voreal-next/directory/*.webp` image metadata (`960 × 640`, matching the committed files) to each item. Use hrefs `/negocios/{id}`. Compose the brand from `<img src="/voreal-next/brand/voreal-mark.png" alt="" width="32" height="32">` plus visible text `voreal` and never embed the asset path inside the package component.

Initial UI state: query `restaurantes`, location `Baltimore, MD`, sort `relevance`, active tags `Restaurantes`, `A 25 millas`, `Abierto ahora`; sidebar category counts and languages match the reference hierarchy. Pass the mobile drawer trigger through `NextDirectoryResultsHeader.mobileFilterTrigger`. Search submission, sort, filters, favorite toggles, clear, retry and pagination must visibly update local demo state without network requests.

- [ ] **Step 3: Implement every review state explicitly**

- `Cards`: six cards and desktop sidebar.
- `Mobile375`: same data at Storybook mobile viewport; one column and bottom filter drawer trigger.
- `Tablet768`: two columns and right filter drawer trigger.
- `Loading`: six anatomy-matched skeletons.
- `NoResults`: zero-result copy plus “Limpiar filtros”.
- `Error`: concise failure plus “Intentar de nuevo”.
- `LongContent`: long business/category/location copy and 200% text-compatible layout.
- `MissingImage`: at least two cards with omitted `image` and at least one without rating/status.

Do not create a second visual theme or a list-view alternative in this validation story.

- [ ] **Step 4: Build Storybook and inspect the complete product, not isolated cards**

Run:

```bash
pnpm build-storybook
```

Expected: PASS with no missing asset or React warnings.

Open `next-patterns-directory-reference--cards` at `375`, `768`, `1024` and `1440` widths. Compare header/logo, search, result title/count, active tags, sort, sidebar, cards, pagination, gutters, type scale and color as one composition. Correct visible incoherence before accepting the build; card styling alone is not sufficient.

- [ ] **Step 5: Verify legacy Storybook still renders under its original root**

Open both iframe URLs in the same build:

```text
/iframe.html?id=patterns-directory-reference--mercado-contemporaneo&viewMode=story
/iframe.html?id=next-patterns-directory-reference--cards&viewMode=story
```

Expected: the first has `[data-vr-root]` and no `[data-voreal-ui="next"]`; the second has `[data-voreal-ui="next"]` and no `.vr-root` ancestor.

- [ ] **Step 6: Commit the validation reference**

```bash
git add .storybook/preview.tsx src/next/patterns/directory
git commit -m "feat(next): assemble cohesive directory reference"
```

---

### Task 10: Enforce isolation and CSS budgets in automation

**Files:**
- Create: `scripts/audit-next-css.mjs`
- Create: `scripts/audit-next-css.test.mjs`
- Modify: `scripts/next-isolation.test.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

**Audit contract:**

`audit-next-css.mjs` scans only `src/next` and fails on:

- `.vr-` not immediately followed by `n-`;
- `--vr-` not immediately followed by `n-`;
- `!important`;
- numeric `z-index` values instead of a `--vrn-layer-*` token;
- bare `html`, `body`, `:root`, `button`, `input`, `select`, `a`, heading or universal selectors that are not preceded by `[data-voreal-ui="next"]`, `[data-vrn-portal]` or a `.vrn-*` class in the same compound selector;
- CSS files outside the declared Voreal Next layer order.

- [ ] **Step 1: Write failing audit fixtures as in-memory strings**

`scripts/audit-next-css.test.mjs` imports the pure `findNextCssViolations(source, file)` function and asserts:

```js
assert.deepEqual(findNextCssViolations('.vrn-button { color: var(--vrn-color-ink); }', 'button.css'), []);
assert.equal(findNextCssViolations('.vr-button {}', 'bad.css')[0].id, 'legacy-class');
assert.equal(findNextCssViolations(':root { --vrn-x: 1; }', 'bad.css')[0].id, 'global-selector');
assert.equal(findNextCssViolations('button { color: red; }', 'bad.css')[0].id, 'global-selector');
assert.equal(findNextCssViolations('.vrn-dialog { z-index: 999; }', 'bad.css')[0].id, 'raw-z-index');
assert.deepEqual(findNextCssViolations('[data-voreal-ui="next"] button { font: inherit; }', 'reset.css'), []);
assert.deepEqual(findNextCssViolations('[data-vrn-portal] button { font: inherit; }', 'reset.css'), []);
```

- [ ] **Step 2: Run the audit tests and verify red**

```bash
node --test scripts/audit-next-css.test.mjs
```

Expected: FAIL because the auditor does not exist.

- [ ] **Step 3: Implement the auditor and package scripts**

Keep parsing/reporting pure and exportable; report `file:line:column [rule] match`. Add:

```json
"audit:next-css": "node scripts/audit-next-css.mjs src/next",
"budget:next-css": "node scripts/check-css-budget.mjs src/next 24576",
"budget:next-directory-css": "node scripts/check-css-budget.mjs src/next/patterns/directory 8192"
```

Extend `scripts/next-isolation.test.mjs` to recursively scan `.ts/.tsx/.css` under `src/next` and reject imports containing `/components/`, `/patterns/`, `/primitives/`, `/styles/`, `/themes/` or `/tokens/` unless the resolved path is still inside `src/next`.

- [ ] **Step 4: Add the new gates to CI without replacing legacy gates**

In `.github/workflows/ci.yml`, add after `pnpm audit:css`:

```yaml
- run: pnpm audit:next-css
```

Add after `pnpm budget:search-css`:

```yaml
- run: pnpm budget:next-directory-css
- run: pnpm budget:next-css
```

- [ ] **Step 5: Run audits and budgets against built source**

```bash
node --test scripts/audit-next-css.test.mjs scripts/next-isolation.test.mjs
pnpm audit:next-css
pnpm budget:next-directory-css
pnpm budget:next-css
pnpm lint:css
pnpm test
```

Expected: all PASS; directory CSS `<= 8192` gzip bytes and all Next CSS `<= 24576` gzip bytes.

- [ ] **Step 6: Commit automated guards**

```bash
git add scripts package.json .github/workflows/ci.yml
git commit -m "test(next): enforce isolation and css budgets"
```

---

### Task 11: Verify four viewports, three browser engines and the approval boundary

**Files:**
- Create: `playwright.next.config.ts`
- Create: `e2e/next-directory-reference.spec.ts`
- Create: `e2e/next-directory-reference.spec.ts-snapshots/*-chromium-linux.png`
- Create: `docs/VOREAL_NEXT.md`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Configure an isolated cross-browser suite**

`playwright.next.config.ts` must use only `e2e/next-directory-reference.spec.ts`, the same static Storybook server as the current config, and these projects:

```ts
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
]
```

Add:

```json
"test:e2e:next": "playwright test --config playwright.next.config.ts"
```

This keeps legacy tests on their existing Chromium config and applies the extra browser cost only to Voreal Next.

- [ ] **Step 2: Write failing functional/browser tests**

Use `referenceUrl = "/iframe.html?id=next-patterns-directory-reference--cards&viewMode=story"`. Cover:

1. root isolation and absence of horizontal document overflow;
2. native GET search names and Tab order: query → location → Buscar;
3. mobile menu open/close and focus restoration;
4. desktop sidebar visible at `1440`, absent at `768/375`;
5. mobile/tablet filter drawer, visible native select options, checkbox change, apply and close;
6. cards at exactly 1/2/3 columns for `375/768/1440` using bounding-box row grouping;
7. image frame ratio within `0.02` of `1.5` before and after images load;
8. long content at 200% text zoom without page overflow;
9. loading, no-results, error and missing-image story URLs;
10. full keyboard route through every interactive control;
11. `axe.run` with WCAG 2.2 AA tags on the default page and with each dialog open;
12. `prefers-reduced-motion` and forced colors retain focus and operation.

Install no browser-specific CSS hacks unless the test demonstrates a real rendering defect.

- [ ] **Step 3: Build and run Chromium until functional tests pass**

```bash
pnpm build-storybook
pnpm exec playwright test e2e/next-directory-reference.spec.ts --project=chromium
```

Expected initially: FAIL until responsive, focus or accessibility defects are fixed. After fixes: PASS.

- [ ] **Step 4: Capture reviewed visual baselines at four widths**

In a Chromium-only snapshot test, set reduced motion and wait for `document.fonts.ready` plus all directory images. Capture full-page screenshots for:

```text
voreal-next-directory-375.png   (375 × 812)
voreal-next-directory-768.png   (768 × 1024)
voreal-next-directory-1024.png  (1024 × 900)
voreal-next-directory-1440.png  (1440 × 1100)
```

Before accepting baselines, inspect the actual screenshots beside the approved reference. Verify the whole-system checklist from Task 9. Then run:

```bash
pnpm exec playwright test e2e/next-directory-reference.spec.ts --project=chromium --update-snapshots
pnpm exec playwright test e2e/next-directory-reference.spec.ts --project=chromium
```

Expected: second run PASS with no diff. Do not update snapshots merely to hide an unexplained regression.

- [ ] **Step 5: Run the isolated three-engine suite**

```bash
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e:next
```

Expected: functional/axe tests PASS in Chromium, Firefox and WebKit; visual snapshots execute only in Chromium.

- [ ] **Step 6: Add the cross-browser gate to CI**

Change the Playwright install step to:

```yaml
- run: pnpm exec playwright install --with-deps chromium firefox webkit
```

Add after the existing `pnpm test:e2e`:

```yaml
- run: pnpm test:e2e:next
```

- [ ] **Step 7: Document opt-in consumption and the explicit stop point**

Create `docs/VOREAL_NEXT.md` with:

```tsx
import { VorealNextRoot } from "@voreal/ui/next";
import { NextDirectoryLayout } from "@voreal/ui/next/patterns/directory";
import "@voreal/ui/next/styles.css";
```

Document Link/Image adapter examples using `next/link` and `next/image`, CSS layer ordering, the `data-voreal-ui="next"` root, Storybook story names and the fact that current Voreal remains default. State explicitly: do not migrate other component families until the user approves the completed directory reference.

Add a short “Voreal Next (experimental)” link to README; do not rewrite current setup instructions. Add a “Voreal Next experimental” item under `Próxima versión` in CHANGELOG; do not bump `0.2.0` or mark it released.

- [ ] **Step 8: Run the final verification matrix from a clean build**

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
git status --short
```

Expected: every command PASS. `git status --short` may show only the pre-existing untracked `.superpowers/brainstorm/`; do not add it.

- [ ] **Step 9: Commit the verified review build**

```bash
git add playwright.next.config.ts e2e docs/VOREAL_NEXT.md README.md CHANGELOG.md package.json .github/workflows/ci.yml
git commit -m "test(next): verify directory reference across browsers"
```

- [ ] **Step 10: Stop for visual approval**

Report the Storybook URL and the exact branch/commit. Do not merge to `main`, publish a package, migrate Red Latina or start the deferred Voreal component families. Ask the user to evaluate the full page at mobile and desktop widths. Continue only after explicit visual approval.
