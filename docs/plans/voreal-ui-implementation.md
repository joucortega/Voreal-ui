# Voreal UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Voreal UI `0.1.0` as a reusable local React design-system package, prove it through public-directory and administrative reference screens, and prepare a measured migration into Red Latina 360.

**Architecture:** Voreal owns semantic React components and scoped CSS while Tailwind CSS v4 supplies token-backed composition utilities and Radix supplies accessible behavior. The canonical source is a standalone repository; Red Latina 360 consumes it initially as a copied local folder under `src/voreal`, with the neutral and `red-latina` themes kept separate from component code.

**Tech Stack:** React, TypeScript, Tailwind CSS v4, Radix Primitives, class-variance-authority, Vitest, React Testing Library, jest-dom, axe-core, Storybook, Playwright, Stylelint, Changesets.

## Global Constraints

- The Red Latina theme follows only the approved **Mercado contemporáneo** direction.
- Public UI is warm and comfortable; administrative UI is compact and operational.
- Voreal must remain portable through a complete neutral theme.
- All Voreal output is scoped beneath `.vr-root` or `[data-vr-root]`.
- CSS variables use `--vr-*`; manual classes use `vr-`.
- Cascade order is `vr-reset, vendor, vr-tokens, vr-base, vr-components, vr-utilities, app`.
- Components consume semantic/component tokens, never raw brand values.
- No global generic classes, ID selectors, deep descendant selectors, or unjustified `!important`.
- Tailwind v4/Next.js browser support is the full-experience target; older browsers receive usable progressive degradation.
- Target WCAG 2.2 AA and visible keyboard focus.
- Server Components are the integration default; `"use client"` is used only for interaction.
- Initial public Voreal CSS target is at or below `30 KB gzip`.
- No runtime CSS-in-JS, animation runtime, or whole-library icon imports.
- Each task must leave tests green and produce an independently reviewable commit.
- Red Latina integration work cannot begin until its actual repository tree and dependency files are available.

---

## Delivery Sequence

The work is divided into four independently testable releases:

| Release | Deliverable | Exit signal |
| --- | --- | --- |
| A | Foundation and common controls | Neutral/Red Latina themes and core controls render/test independently |
| B | Interaction, forms, navigation, and feedback | Full accessible component catalog is usable without product patterns |
| C | Directory and administrative patterns | Reference directory and admin screens pass responsive/a11y tests |
| D | Red Latina migration | Legacy CSS is removed route-by-route with measured parity |

Tasks 1–10 can be executed in the standalone `voreal-ui` repository. Tasks 11–13 require the Red Latina 360 repository.

---

### Task 1: Repository, Build, and Test Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `.changeset/config.json`
- Create: `src/index.ts`
- Create: `src/testing/render-voreal.tsx`
- Create: `src/testing/render-voreal.test.tsx`

**Interfaces:**
- Produces: package scripts `test`, `test:a11y`, `typecheck`, `build`, `storybook`, `build-storybook`, `lint:css`, and `audit:css`.
- Produces: `renderVoreal(ui, options?)` with `{ theme?: "neutral" | "red-latina"; density?: "comfortable" | "compact" }`.
- Consumes: no earlier task.

- [ ] **Step 1: Initialize a clean package manifest**

Create a private workspace package with ESM output and explicit React peer dependencies:

```json
{
  "name": "@voreal/ui",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": "./src/index.ts",
    "./styles.css": "./src/styles/index.css",
    "./theme/neutral.css": "./src/themes/neutral.css",
    "./theme/red-latina.css": "./src/themes/red-latina.css",
    "./theme/admin.css": "./src/themes/admin.css"
  },
  "peerDependencies": {
    "react": ">=18.3 <20",
    "react-dom": ">=18.3 <20"
  },
  "scripts": {
    "test": "vitest run",
    "test:a11y": "vitest run --project a11y",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "build": "tsc -p tsconfig.build.json",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint:css": "stylelint 'src/**/*.css'",
    "audit:css": "node scripts/audit-css.mjs"
  }
}
```

Install the current compatible releases at execution time:

```bash
pnpm add @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip class-variance-authority clsx tailwind-merge
pnpm add -D react react-dom typescript vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event axe-core vitest-axe storybook @storybook/react-vite @storybook/addon-a11y @storybook/addon-essentials playwright stylelint stylelint-config-standard @changesets/cli
```

- [ ] **Step 2: Write the failing root-render test**

```tsx
import { screen } from "@testing-library/react";
import { renderVoreal } from "./render-voreal";

it("applies the selected Voreal theme and density", () => {
  renderVoreal(<button>Buscar</button>, {
    theme: "red-latina",
    density: "compact"
  });

  const root = screen.getByTestId("voreal-root");
  expect(root).toHaveAttribute("data-vr-theme", "red-latina");
  expect(root).toHaveAttribute("data-vr-density", "compact");
});
```

- [ ] **Step 3: Run the test and verify the missing-helper failure**

Run: `pnpm test src/testing/render-voreal.test.tsx`  
Expected: FAIL because `render-voreal.tsx` does not exist.

- [ ] **Step 4: Implement the focused test helper**

```tsx
import type { ReactElement } from "react";
import { render } from "@testing-library/react";

type RenderVorealOptions = {
  theme?: "neutral" | "red-latina";
  density?: "comfortable" | "compact";
};

export function renderVoreal(
  ui: ReactElement,
  { theme = "neutral", density = "comfortable" }: RenderVorealOptions = {}
) {
  return render(
    <div
      className="vr-root"
      data-testid="voreal-root"
      data-vr-theme={theme}
      data-vr-density={density}
    >
      {ui}
    </div>
  );
}
```

- [ ] **Step 5: Add TypeScript, Vite, and Vitest configuration**

Configure strict TypeScript, `jsx: "react-jsx"`, DOM libraries, declaration output to `dist`, jsdom tests, and `vitest.setup.ts` importing `@testing-library/jest-dom/vitest`.

- [ ] **Step 6: Verify foundation commands**

Run: `pnpm test && pnpm typecheck && pnpm build`  
Expected: PASS; `dist` contains declarations and compiled modules.

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json pnpm-lock.yaml tsconfig.json tsconfig.build.json vite.config.ts vitest.setup.ts .gitignore .npmrc .changeset src/index.ts src/testing
git commit -m "chore: establish voreal ui workspace"
```

---

### Task 2: Tokens, Themes, Scoped Reset, and Tailwind Mapping

**Files:**
- Create: `src/styles/index.css`
- Create: `src/styles/reset.css`
- Create: `src/styles/base.css`
- Create: `src/styles/accessibility.css`
- Create: `src/styles/motion.css`
- Create: `src/styles/print.css`
- Create: `src/tokens/primitive.css`
- Create: `src/tokens/semantic.css`
- Create: `src/tokens/typography.css`
- Create: `src/tokens/layout.css`
- Create: `src/tokens/component.css`
- Create: `src/themes/neutral.css`
- Create: `src/themes/red-latina.css`
- Create: `src/themes/admin.css`
- Create: `src/tokens/tokens.test.ts`
- Create: `src/tokens/tokens.stories.tsx`

**Interfaces:**
- Produces: `--vr-color-*` primitives and semantic tokens such as `--vr-canvas`, `--vr-surface`, `--vr-text`, `--vr-action`, `--vr-focus`, `--vr-control-height`, and `--vr-radius-card`.
- Produces: theme selectors `[data-vr-theme="neutral"]` and `[data-vr-theme="red-latina"]`.
- Consumes: `renderVoreal()` from Task 1.

- [ ] **Step 1: Write token contract tests**

```tsx
import { screen } from "@testing-library/react";
import { renderVoreal } from "../testing/render-voreal";
import "../styles/index.css";

it("exposes Red Latina semantic colors", () => {
  renderVoreal(<span data-testid="sample">Texto</span>, { theme: "red-latina" });
  const root = screen.getByTestId("voreal-root");
  const styles = getComputedStyle(root);
  expect(styles.getPropertyValue("--vr-canvas").trim()).toBe("#fff9ef");
  expect(styles.getPropertyValue("--vr-text").trim()).toBe("#071b46");
  expect(styles.getPropertyValue("--vr-action").trim()).toBe("#c83b20");
});
```

- [ ] **Step 2: Run the token test and confirm it fails**

Run: `pnpm test src/tokens/tokens.test.ts`  
Expected: FAIL because the CSS contract is absent.

- [ ] **Step 3: Implement the cascade and primitive scale**

`src/styles/index.css` begins with:

```css
@layer vr-reset, vendor, vr-tokens, vr-base, vr-components, vr-utilities, app;

@import "tailwindcss" layer(vr-utilities);
@import "../tokens/primitive.css" layer(vr-tokens);
@import "../tokens/semantic.css" layer(vr-tokens);
@import "../tokens/typography.css" layer(vr-tokens);
@import "../tokens/layout.css" layer(vr-tokens);
@import "../tokens/component.css" layer(vr-tokens);
@import "../themes/neutral.css" layer(vr-tokens);
@import "../themes/red-latina.css" layer(vr-tokens);
@import "../themes/admin.css" layer(vr-tokens);
@import "./reset.css" layer(vr-reset);
@import "./base.css" layer(vr-base);
@import "./accessibility.css" layer(vr-base);
@import "./motion.css" layer(vr-base);
@import "./print.css" layer(vr-base);
```

Primitive tokens include the approved spacing, radius, duration, typography, and elevation scales. Theme CSS assigns semantic values; component CSS derives density-specific control heights.

- [ ] **Step 4: Implement the scoped reset and focus contract**

```css
@layer vr-reset {
  :where(.vr-root, [data-vr-root]),
  :where(.vr-root, [data-vr-root]) *,
  :where(.vr-root, [data-vr-root]) *::before,
  :where(.vr-root, [data-vr-root]) *::after {
    box-sizing: border-box;
  }

  :where(.vr-root, [data-vr-root]) :where(button, input, textarea, select) {
    font: inherit;
  }
}

@layer vr-base {
  :where(.vr-root, [data-vr-root]) :focus-visible,
  [data-vr-portal] :focus-visible {
    outline: 2px solid var(--vr-focus);
    outline-offset: 3px;
  }
}
```

- [ ] **Step 5: Map Tailwind theme variables to Voreal semantics**

Use `@theme inline` so utilities such as `bg-vr-surface`, `text-vr-text`, `rounded-vr-card`, and `shadow-vr-1` resolve to Voreal tokens; do not duplicate hex values in the Tailwind mapping.

- [ ] **Step 6: Add reduced-motion, forced-color, and print fallbacks**

Implement `prefers-reduced-motion`, `forced-colors`, and print rules so motion is optional, focus remains visible, and decorative backgrounds do not hide text.

- [ ] **Step 7: Verify tokens and compiled CSS**

Run: `pnpm test src/tokens/tokens.test.ts && pnpm build`  
Expected: PASS.

- [ ] **Step 8: Commit theme foundations**

```bash
git add src/styles src/tokens src/themes
git commit -m "feat: add voreal tokens and themes"
```

---

### Task 3: Utilities, Voreal Root, Typography, and Layout Primitives

**Files:**
- Create: `src/utilities/cn.ts`
- Create: `src/primitives/voreal-root/voreal-root.tsx`
- Create: `src/primitives/voreal-root/voreal-root.test.tsx`
- Create: `src/primitives/layout/layout.tsx`
- Create: `src/primitives/layout/layout.test.tsx`
- Create: `src/primitives/typography/typography.tsx`
- Create: `src/primitives/typography/typography.test.tsx`
- Create: `src/primitives/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `cn(...inputs)`, `VorealRoot`, `Container`, `Stack`, `Cluster`, `Grid`, `Divider`, `Heading`, `Text`, `Caption`.
- Consumes: semantic tokens from Task 2.

- [ ] **Step 1: Test root inheritance and semantic HTML**

```tsx
render(<VorealRoot theme="red-latina"><Heading level={2}>Negocios</Heading></VorealRoot>);
expect(screen.getByTestId("vr-root")).toHaveAttribute("data-vr-theme", "red-latina");
expect(screen.getByRole("heading", { level: 2, name: "Negocios" })).toBeVisible();
```

- [ ] **Step 2: Verify the exports do not exist**

Run: `pnpm test src/primitives`  
Expected: FAIL with missing modules.

- [ ] **Step 3: Implement `cn` and typed polymorphic-free primitives**

Use `clsx` plus `tailwind-merge`. Keep Voreal `0.1.0` primitives explicit (`div`, `section`, headings, paragraphs) instead of adding a generic polymorphic `as` system.

- [ ] **Step 4: Implement root and portal theme propagation contract**

`VorealRoot` renders `.vr-root`, `data-vr-root`, `data-vr-theme`, and `data-vr-density`. Export a `useVorealPortalProps()` helper returning the same theme/density attributes for Radix portal containers.

- [ ] **Step 5: Implement layout and typography primitives**

Every layout primitive accepts `className` for composition, exposes only stable structural props (`gap`, `align`, `justify`, `columns`), and maps them to a finite CVA variant set.

- [ ] **Step 6: Run focused and full checks**

Run: `pnpm test src/primitives && pnpm typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit primitives**

```bash
git add src/utilities src/primitives src/index.ts
git commit -m "feat: add voreal layout and typography primitives"
```

---

### Task 4: Standard Buttons and Signature Action Family

**Files:**
- Create: `src/components/button/button.types.ts`
- Create: `src/components/button/button.styles.ts`
- Create: `src/components/button/button.tsx`
- Create: `src/components/button/button.test.tsx`
- Create: `src/components/button/button.stories.tsx`
- Create: `src/components/button/signature-actions.tsx`
- Create: `src/components/button/signature-actions.test.tsx`
- Create: `src/components/button/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Button`, `IconButton`, `ButtonGroup`, `PathButton`, `RelayButton`, `SplitBridge`, `ActionRail`, and `LinkedCta`.
- Consumes: `cn`, tokens, and `VorealRoot` from Tasks 2–3.

- [ ] **Step 1: Write keyboard, loading, and rail-selection tests**

```tsx
it("blocks activation and labels a loading button", async () => {
  const onClick = vi.fn();
  renderVoreal(<Button loading onClick={onClick}>Guardar</Button>);
  const button = screen.getByRole("button", { name: /guardar/i });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
  await userEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

it("changes ActionRail selection with arrow keys", async () => {
  const user = userEvent.setup();
  renderVoreal(<ActionRail defaultValue="list" items={railItems} />);
  await user.tab();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "Mapa" })).toBeChecked();
});
```

- [ ] **Step 2: Run tests and verify the component imports fail**

Run: `pnpm test src/components/button`  
Expected: FAIL.

- [ ] **Step 3: Implement the standard button API with CVA**

Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, and `link`. Sizes: `sm`, `md`, `lg`, and `icon`. Densities inherit from the root unless explicitly overridden. Native `<button>` behavior remains the default.

- [ ] **Step 4: Implement signature actions with semantic internals**

- `RelayButton` is one action plus noninteractive status text.
- `SplitBridge` renders two real buttons with independent labels and focus.
- `ActionRail` uses radio-group semantics for exclusive view selection.
- `LinkedCta` preserves reading order when stacked.
- Decorative paths use pseudo-elements and disappear under forced colors.

- [ ] **Step 5: Add axe coverage and all state stories**

Stories include default, hover simulation, focus-visible, loading, disabled, long Spanish copy, compact density, and narrow mobile width.

- [ ] **Step 6: Verify**

Run: `pnpm test src/components/button && pnpm typecheck && pnpm build-storybook`  
Expected: PASS.

- [ ] **Step 7: Commit actions**

```bash
git add src/components/button src/index.ts
git commit -m "feat: add voreal action language"
```

---

### Task 5: Avatar and Identity Family

**Files:**
- Create: `src/components/avatar/avatar.tsx`
- Create: `src/components/avatar/avatar-group.tsx`
- Create: `src/components/avatar/identity-capsule.tsx`
- Create: `src/components/avatar/community-hub.tsx`
- Create: `src/components/avatar/avatar.test.tsx`
- Create: `src/components/avatar/avatar.stories.tsx`
- Create: `src/components/avatar/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Avatar`, `AvatarWeave`, `IdentityCapsule`, `CommunityHub`.
- Consumes: Radix Avatar and Tooltip, semantic tokens, and portal attributes.

- [ ] **Step 1: Write fallback, overflow, and accessible-name tests**

```tsx
it("uses initials when the image fails", () => {
  renderVoreal(<Avatar name="Ana Martínez" src="/missing.jpg" />);
  expect(screen.getByText("AM")).toBeVisible();
});

it("summarizes overflow without hiding the visible identities", () => {
  renderVoreal(<AvatarWeave people={people} max={3} />);
  expect(screen.getByText("+2")).toHaveAccessibleName("2 personas más");
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `pnpm test src/components/avatar`  
Expected: FAIL.

- [ ] **Step 3: Implement image fallback and identity variants**

Use Radix Avatar only where its image fallback behavior adds value. Derive initials from up to two meaningful words, preserve accented characters, and allow an explicit `fallback` override.

- [ ] **Step 4: Implement relationship visuals as progressive enhancement**

Avatar connections are decorative CSS/SVG hidden from assistive technologies. The DOM remains a list of people. `CommunityHub` limits satellites to four and moves additional people into a labeled overflow control.

- [ ] **Step 5: Verify keyboard, axe, and long-name behavior**

Run: `pnpm test src/components/avatar && pnpm test:a11y`  
Expected: PASS.

- [ ] **Step 6: Commit identity components**

```bash
git add src/components/avatar src/index.ts
git commit -m "feat: add voreal identity components"
```

---

### Task 6: Form Foundation and Input Controls

**Files:**
- Create: `src/components/form/field.tsx`
- Create: `src/components/form/input.tsx`
- Create: `src/components/form/textarea.tsx`
- Create: `src/components/form/checkbox.tsx`
- Create: `src/components/form/radio-group.tsx`
- Create: `src/components/form/switch.tsx`
- Create: `src/components/form/select.tsx`
- Create: `src/components/form/combobox.tsx`
- Create: `src/components/form/file-upload.tsx`
- Create: `src/components/form/form.test.tsx`
- Create: `src/components/form/form.stories.tsx`
- Create: `src/components/form/index.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: `Field`, `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Select`, `Combobox`, and `FileUpload`.
- Consumes: Radix Label, Checkbox, RadioGroup, Switch, Select, Popover, and portal theme props.

- [ ] **Step 1: Write association and error tests**

```tsx
it("associates label, help, and error with the control", () => {
  renderVoreal(
    <Field label="Nombre" hint="Nombre público" error="Campo obligatorio">
      <Input name="name" />
    </Field>
  );
  const input = screen.getByRole("textbox", { name: "Nombre" });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input.getAttribute("aria-describedby")).toContain("hint");
  expect(input.getAttribute("aria-describedby")).toContain("error");
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm test src/components/form`  
Expected: FAIL.

- [ ] **Step 3: Implement Field context and native-first controls**

`Field` creates stable IDs with `useId` and passes them through context. Input and Textarea remain native. Use Radix only for controls whose behavior benefits from it.

- [ ] **Step 4: Implement Select and Combobox keyboard behavior**

Select follows the Radix contract. Combobox follows the WAI-ARIA combobox pattern, supports async status text without owning fetch logic, and exposes `items`, `value`, `onValueChange`, `query`, and `onQueryChange`.

- [ ] **Step 5: Implement FileUpload without automatic network transfer**

It validates MIME type, count, and size locally and returns accepted/rejected files through callbacks. Uploading is owned by the host application.

- [ ] **Step 6: Verify forms**

Run: `pnpm test src/components/form && pnpm test:a11y && pnpm typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit form controls**

```bash
git add src/components/form src/index.ts
git commit -m "feat: add voreal form controls"
```

---

### Task 7: Navigation, Overlays, and Feedback

**Files:**
- Create: `src/components/navigation/tabs.tsx`
- Create: `src/components/navigation/breadcrumbs.tsx`
- Create: `src/components/navigation/pagination.tsx`
- Create: `src/components/navigation/dropdown-menu.tsx`
- Create: `src/components/overlay/dialog.tsx`
- Create: `src/components/overlay/alert-dialog.tsx`
- Create: `src/components/overlay/drawer.tsx`
- Create: `src/components/overlay/popover.tsx`
- Create: `src/components/overlay/tooltip.tsx`
- Create: `src/components/feedback/alert.tsx`
- Create: `src/components/feedback/toast.tsx`
- Create: `src/components/feedback/progress.tsx`
- Create: `src/components/feedback/skeleton.tsx`
- Create: `src/components/feedback/empty-state.tsx`
- Create: `src/components/feedback/error-state.tsx`
- Create: `src/components/navigation/navigation.test.tsx`
- Create: `src/components/overlay/overlay.test.tsx`
- Create: `src/components/feedback/feedback.test.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: accessible navigation, layer, and feedback components.
- Consumes: Radix primitives, `useVorealPortalProps()`, buttons, typography, and tokens.

- [ ] **Step 1: Write portal-theme, focus-return, and live-region tests**

```tsx
it("returns focus to the dialog trigger", async () => {
  const user = userEvent.setup();
  renderVoreal(<DialogDemo />);
  const trigger = screen.getByRole("button", { name: "Editar" });
  await user.click(trigger);
  await user.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(trigger).toHaveFocus();
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `pnpm test src/components/navigation src/components/overlay src/components/feedback`  
Expected: FAIL.

- [ ] **Step 3: Implement navigation components**

Pagination uses real links when URLs exist. Breadcrumbs use `<nav aria-label="Breadcrumb">`. Tabs and menus preserve Radix keyboard behavior and expose Voreal visual variants only.

- [ ] **Step 4: Implement overlay layer contract**

Every portal includes `data-vr-portal`, active theme/density attributes, and one of the fixed z-index layer tokens. Drawer uses Dialog semantics and changes only visual placement.

- [ ] **Step 5: Implement persistent and transient feedback rules**

Errors blocking a task use `ErrorState` or `Alert`; Toast is for transient noncritical confirmation. Skeletons accept explicit dimensions or an aspect ratio.

- [ ] **Step 6: Verify**

Run: `pnpm test src/components && pnpm test:a11y && pnpm typecheck`  
Expected: PASS.

- [ ] **Step 7: Commit interaction infrastructure**

```bash
git add src/components/navigation src/components/overlay src/components/feedback src/index.ts
git commit -m "feat: add navigation overlays and feedback"
```

---

### Task 8: Content and Data Components

**Files:**
- Create: `src/components/content/card.tsx`
- Create: `src/components/content/badge.tsx`
- Create: `src/components/content/media.tsx`
- Create: `src/components/content/accordion.tsx`
- Create: `src/components/data/table.tsx`
- Create: `src/components/data/data-table.tsx`
- Create: `src/components/data/stat-card.tsx`
- Create: `src/components/data/definition-list.tsx`
- Create: `src/components/data/data.test.tsx`
- Create: `src/components/data/data.stories.tsx`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: content containers and typed data display primitives.
- Consumes: typography, actions, feedback, Radix Accordion, and tokens.

- [ ] **Step 1: Test table semantics and empty states**

```tsx
it("renders sortable headers as labeled buttons", async () => {
  renderVoreal(<BusinessTable rows={rows} />);
  expect(screen.getByRole("button", { name: /ordenar por negocio/i })).toBeVisible();
  expect(screen.getByRole("table")).toHaveAccessibleName("Negocios");
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm test src/components/data`  
Expected: FAIL.

- [ ] **Step 3: Implement composable content primitives**

Card owns surface, border, radius, and elevation variants. It does not own page spacing or clickable behavior unless rendered through a dedicated `CardLink`.

- [ ] **Step 4: Implement DataTable as controlled presentation**

DataTable owns selection UI, sort triggers, loading, empty display, and responsive overflow. Filtering, pagination requests, and data mutation remain host responsibilities.

- [ ] **Step 5: Verify and commit**

Run: `pnpm test src/components/data && pnpm test:a11y && pnpm typecheck`  
Expected: PASS.

```bash
git add src/components/content src/components/data src/index.ts
git commit -m "feat: add voreal content and data components"
```

---

### Task 9: Public Directory Patterns and Reference Screen

**Files:**
- Create: `src/patterns/directory/directory-search.tsx`
- Create: `src/patterns/directory/category-scroller.tsx`
- Create: `src/patterns/directory/filter-panel.tsx`
- Create: `src/patterns/directory/business-card.tsx`
- Create: `src/patterns/directory/business-gallery.tsx`
- Create: `src/patterns/directory/business-contact.tsx`
- Create: `src/patterns/directory/business-hours.tsx`
- Create: `src/patterns/directory/location-card.tsx`
- Create: `src/patterns/directory/promotion-card.tsx`
- Create: `src/patterns/directory/claim-business-cta.tsx`
- Create: `src/patterns/directory/ad-slot.tsx`
- Create: `src/patterns/directory/directory-patterns.test.tsx`
- Create: `src/patterns/directory/directory-reference.stories.tsx`
- Create: `e2e/directory-reference.spec.ts`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: stable public pattern APIs and one complete Mercado contemporáneo reference screen.
- Consumes: all prior Voreal layers.

- [ ] **Step 1: Write business-card anatomy tests**

```tsx
it("keeps status, name, category, location, and actions in every card variant", () => {
  for (const variant of ["vertical", "horizontal", "compact", "featured"] as const) {
    const { unmount } = renderVoreal(<BusinessCard business={business} variant={variant} />);
    expect(screen.getByRole("heading", { name: business.name })).toBeVisible();
    expect(screen.getByText(business.category)).toBeVisible();
    expect(screen.getByText(business.location)).toBeVisible();
    unmount();
  }
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm test src/patterns/directory`  
Expected: FAIL.

- [ ] **Step 3: Define serializable pattern data types**

Create explicit `BusinessSummary`, `BusinessHours`, `BusinessPromotion`, `DirectoryFilter`, and `DirectorySearchValue` types. Do not import Red Latina database or Prisma types into Voreal.

- [ ] **Step 4: Implement search, categories, filters, and cards**

Desktop and mobile search share one data contract. Filter drawer and desktop panel share fields rather than separate logic. Card variants share one anatomy and subcomponents.

- [ ] **Step 5: Implement profile-support patterns and safe fallbacks**

Gallery, hours, contact, promotion, location, claim CTA, related-card composition, and ad slot handle missing images/data while reserving stable dimensions.

- [ ] **Step 6: Build the reference Storybook page**

Reproduce the approved A direction with realistic Spanish business data at `375`, `768`, and `1440px`. Include loading, no-results, missing-image, closed-business, and long-name stories.

- [ ] **Step 7: Add Playwright journeys**

Test search entry, filter opening/closing, list/map ActionRail selection, business-card navigation, keyboard-only traversal, and mobile overflow.

- [ ] **Step 8: Verify and commit**

Run: `pnpm test src/patterns/directory && pnpm build-storybook && pnpm playwright test e2e/directory-reference.spec.ts`  
Expected: PASS.

```bash
git add src/patterns/directory e2e/directory-reference.spec.ts src/index.ts
git commit -m "feat: add voreal directory patterns"
```

---

### Task 10: Administrative Patterns, Audits, and Package Documentation

**Files:**
- Create: `src/patterns/admin/admin-shell.tsx`
- Create: `src/patterns/admin/page-header.tsx`
- Create: `src/patterns/admin/admin-filters.tsx`
- Create: `src/patterns/admin/form-section.tsx`
- Create: `src/patterns/admin/quick-edit-drawer.tsx`
- Create: `src/patterns/admin/publication-status.tsx`
- Create: `src/patterns/admin/activity-history.tsx`
- Create: `src/patterns/admin/admin-patterns.test.tsx`
- Create: `src/patterns/admin/admin-reference.stories.tsx`
- Create: `e2e/admin-reference.spec.ts`
- Create: `scripts/audit-css.mjs`
- Create: `scripts/check-css-budget.mjs`
- Create: `stylelint.config.mjs`
- Create: `README.md`
- Create: `CHANGELOG.md`
- Create: `docs/THEMING.md`
- Create: `docs/MIGRATION.md`
- Modify: `src/index.ts`

**Interfaces:**
- Produces: compact administrative patterns, audit commands, copy/install instructions, and new-theme instructions.
- Consumes: Voreal components and directory-independent tokens.

- [ ] **Step 1: Test responsive shell and labeled status**

```tsx
it("exposes admin navigation and status without relying on color", () => {
  renderVoreal(<AdminReference />, { theme: "red-latina", density: "compact" });
  expect(screen.getByRole("navigation", { name: "Administración" })).toBeVisible();
  expect(screen.getByText("Publicado")).toHaveAccessibleName(/estado publicado/i);
});
```

- [ ] **Step 2: Verify failure**

Run: `pnpm test src/patterns/admin`  
Expected: FAIL.

- [ ] **Step 3: Implement shell and task patterns**

AdminShell owns navigation slots and responsive collapse behavior but not routing. PageHeader owns title, description, breadcrumbs, and actions. FormSection and QuickEditDrawer use existing form/overlay contracts.

- [ ] **Step 4: Build and test the admin reference screen**

The screen includes metrics, filters, selectable DataTable, publication status, edit drawer, destructive confirmation, loading, empty, and error states at desktop and mobile widths.

- [ ] **Step 5: Implement CSS audit rules**

`audit-css.mjs` scans `src` and a caller-supplied host path for:

```js
const violations = [
  { id: "raw-brand-color", pattern: /#(?:fff9ef|071b46|c83b20|ff5c35|39d353)\b/gi },
  { id: "important", pattern: /!important\b/g },
  { id: "arbitrary-color", pattern: /(?:bg|text|border)-\[#[0-9a-f]{3,8}\]/gi },
  { id: "raw-z-index", pattern: /z-index\s*:\s*\d+/gi }
];
```

Token and theme files are allowlisted for raw palette values. During migration, legacy paths run in report mode; `src/voreal` violations fail.

- [ ] **Step 6: Implement the CSS budget check**

Build the public reference CSS, gzip it with Node `zlib.gzipSync`, print raw/gzip sizes, and exit nonzero above `30 * 1024` bytes.

- [ ] **Step 7: Document copy-based integration and theme creation**

README includes exact import order, root/theme setup, Radix portal setup, tree-shakeable imports, verification commands, and how to copy `src` to a host's `src/voreal`. `THEMING.md` walks through a complete second theme without modifying components.

- [ ] **Step 8: Run the complete standalone gate**

Run:

```bash
pnpm test
pnpm test:a11y
pnpm typecheck
pnpm lint:css
pnpm audit:css
pnpm build
pnpm build-storybook
pnpm playwright test
node scripts/check-css-budget.mjs
```

Expected: every command passes and gzip CSS is at or below `30 KB`.

- [ ] **Step 9: Commit standalone Voreal UI `0.1.0`**

```bash
git add src e2e scripts stylelint.config.mjs README.md CHANGELOG.md docs package.json pnpm-lock.yaml
git commit -m "feat: complete voreal ui 0.1.0"
```

---

### Task 11: Audit the Actual Red Latina 360 Repository

**Precondition:** The GitHub app or local workspace can read the Red Latina 360 repository.

**Files:**
- Create in Red Latina repository: `docs/voreal/current-ui-audit.md`
- Create in Red Latina repository: `scripts/voreal-inventory.mjs`
- Inspect: `package.json`, lockfile, Next config, Tailwind config/CSS entry, `src/app/**`, `src/components/**`, and all CSS files.

**Interfaces:**
- Produces: exact dependency compatibility decision, route inventory, selector/import graph, component reuse map, and migration order.
- Consumes: standalone Voreal `0.1.0` and the actual host repository.

- [ ] **Step 1: Capture repository truth**

Run:

```bash
node --version
pnpm --version || npm --version
git status --short
find src -type f \( -name '*.css' -o -name '*.scss' -o -name '*.tsx' \) -print
```

Record installed Next, React, Tailwind, and Radix versions from the package manager, not memory.

- [ ] **Step 2: Inventory CSS imports and selector consumers**

`voreal-inventory.mjs` walks CSS/TSX files, records CSS imports, manual class strings, CSS module references, `!important`, raw colors, and estimated selector consumers. Its JSON output is stable and committed beside the Markdown summary.

- [ ] **Step 3: Identify one representative route per surface**

Select the public route containing the most common listing/search primitives and the admin route containing the most common form/table primitives. Selection is based on inventory counts documented in the audit.

- [ ] **Step 4: Decide dependency alignment**

- If the host already uses compatible Tailwind v4 and Radix packages, reuse them.
- If it uses Tailwind v3, keep Voreal's compiled/scoped CSS for the first migration slice and create a separately reviewed Tailwind v4 upgrade plan.
- If a Radix package differs, use the host-compatible package version unless a tested Voreal API requires a newer behavior.

- [ ] **Step 5: Verify audit reproducibility and commit**

Run the inventory twice and compare outputs after removing timestamps. Expected: identical output.

```bash
git add docs/voreal scripts/voreal-inventory.mjs
git commit -m "docs: audit red latina ui migration"
```

---

### Task 12: Integrate Voreal and Migrate Representative Public/Admin Routes

**Files:**
- Create in Red Latina repository: `src/voreal/**` copied from the verified `0.1.0` source.
- Create in Red Latina repository: `src/styles/legacy-bridge.css`
- Modify: exact global CSS/layout files identified by Task 11.
- Modify: exact representative public and admin route files identified by Task 11.
- Create: route-specific tests beside those routes.

**Interfaces:**
- Produces: one production-shaped public route and one production-shaped admin route using Voreal.
- Consumes: Task 11's exact inventory and Voreal `0.1.0`.

- [ ] **Step 1: Write route characterization tests before visual changes**

Tests capture existing URLs, headings, search/filter actions, form submissions, admin row actions, and permission behavior. These tests protect functionality rather than old CSS.

- [ ] **Step 2: Verify characterization tests pass against legacy UI**

Run the two route test suites. Expected: PASS before migration.

- [ ] **Step 3: Copy Voreal and establish import order**

Import Voreal once at the app style entry; place legacy/third-party imports into the `vendor` layer when syntactically possible. Wrap only migrated route trees with `VorealRoot` initially.

- [ ] **Step 4: Migrate the representative public route**

Replace page-local buttons, inputs, search, category chips, cards, filters, loading, empty, and error displays with Voreal components. Preserve data fetching, URLs, analytics, and server/client boundaries.

- [ ] **Step 5: Migrate the representative admin route**

Replace shell slots, header, filters, form sections, table presentation, statuses, dialogs, loading, and errors. Preserve authorization, mutations, and validation.

- [ ] **Step 6: Add only isolated bridge rules**

Every `legacy-bridge.css` rule includes a comment naming its remaining legacy consumer. No bridge rule may restyle a Voreal component.

- [ ] **Step 7: Verify the migration slice**

Run unit, route, Playwright, axe, typecheck, build, visual capture, CSS audit, and Lighthouse checks at mobile/desktop widths. Compare critical behavior with characterization tests.

- [ ] **Step 8: Commit representative routes**

```bash
git add src/voreal src/styles/legacy-bridge.css src/app src/components
git commit -m "feat: introduce voreal ui to red latina"
```

---

### Task 13: Complete Route-by-Route Migration and Remove Legacy CSS

**Files:**
- Modify: route and component files in the exact order produced by Task 11.
- Modify/Delete: legacy CSS only after zero-consumer verification.
- Modify: `docs/voreal/current-ui-audit.md` with completed migration ledger.
- Modify: `src/styles/legacy-bridge.css` until empty, then delete it.

**Interfaces:**
- Produces: Red Latina public/admin UI fully served by Voreal with no legacy visual dependency.
- Consumes: representative migration patterns from Task 12.

- [ ] **Step 1: Migrate public shared layout and navigation**

Move header, footer, containers, typography, search, categories, listing/results, business profile, contact, hours, promotion, location, and related-business patterns in inventory order.

- [ ] **Step 2: Verify public surface before deleting CSS**

Run public route tests, visual comparisons, axe, keyboard traversal, mobile widths, and CSS inventory. Delete only selectors with zero imports and zero class consumers.

- [ ] **Step 3: Migrate administrative modules**

Move shell, users, businesses/clients, assets, settings, analytics, tables, forms, drawers, dialogs, activity, and states using the shared patterns established in Task 12.

- [ ] **Step 4: Verify admin surface before deleting CSS**

Run admin authorization/functionality tests, form error tests, data-table tests, keyboard checks, and responsive captures. Delete only zero-consumer rules.

- [ ] **Step 5: Remove the final bridge and legacy entry points**

Require inventory output with zero legacy consumers. Delete `legacy-bridge.css`, old stylesheet imports, and empty style directories in the same commit as their final consumers.

- [ ] **Step 6: Run the release gate**

Run the host's complete test/build suite plus Voreal audit, CSS budget, Storybook build, Playwright journeys, axe, Lighthouse, and the supported-browser matrix.

- [ ] **Step 7: Record final measurements**

Update the audit with before/after CSS lines, gzip CSS, route JS, Core Web Vitals laboratory measurements, removed files, remaining exceptions, and exact verification commands.

- [ ] **Step 8: Commit completed migration**

```bash
git add -A
git commit -m "refactor: complete red latina voreal migration"
```

---

## Final Verification Checklist

- [ ] Neutral and Red Latina themes render the same components without component edits.
- [ ] Red Latina contains no purple/vivid-orange brand direction.
- [ ] Public and admin references work at `375`, `768`, `1024`, and `1440px`.
- [ ] Keyboard, focus return, forced colors, reduced motion, and axe checks pass.
- [ ] All Radix portals carry Voreal theme/density attributes and approved layer tokens.
- [ ] Signature actions retain familiar semantics and degrade to ordinary shapes.
- [ ] CSS audit finds no forbidden values in Voreal source.
- [ ] Public CSS is at or below `30 KB gzip`, or a measured exception has explicit approval.
- [ ] Storybook contains permitted variants, extreme content, missing data, and public/admin examples.
- [ ] Red Latina inventory reports zero legacy CSS consumers before final deletion.
- [ ] README documents local-folder copying and new-theme creation.
- [ ] `CHANGELOG.md` records `0.1.0`.

## Execution Handoff

Execute Tasks 1–10 in the standalone Voreal repository first. Pause before Task 11 until the Red Latina 360 repository is accessible and its repository truth can replace any host-specific assumptions. Use a fresh review after each task and do not combine the representative migration with the final legacy deletion.
