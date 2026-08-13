# Voreal UI Design Specification

**Status:** Approved design pending implementation plan  
**Version target:** `0.1.0`  
**Date:** 2026-08-13  
**Primary implementation:** Red Latina 360  
**Form:** Reusable local UI package for Next.js and React

## 1. Executive Summary

Voreal UI is a reusable local design-system package for modern directory products. Its first theme, `red-latina`, will replace the existing visual layer of Red Latina 360 across both the public directory and its administrative interface.

Voreal UI will use:

- Tailwind CSS for constrained layout and utility composition.
- Radix Primitives for accessible interactive behavior.
- Locally owned React components for the visual language and public API.
- CSS custom properties for primitive and semantic design tokens.
- Scoped resets, namespaces, and cascade layers to prevent conflicts.

Bootstrap, Semantic UI, UIkit, and shadcn/ui inform component coverage and theming strategy but are not runtime visual dependencies. Voreal owns its source code, styling, tokens, documentation, and component contracts.

## 2. Goals

1. Replace the legacy Red Latina 360 CSS without recreating a monolithic stylesheet.
2. Establish one coherent visual language for public and administrative experiences.
3. Make Voreal reusable in other projects through independent themes.
4. Preserve or improve accessibility, browser behavior, responsiveness, and speed.
5. Prevent visual values and variants from proliferating inside pages.
6. Provide a complete component and pattern catalog for a modern business directory.
7. Give Voreal a distinctive interaction language without compromising familiar usability.
8. Support incremental migration so old CSS is removed only after its consumers are gone.

## 3. Non-goals

- Publishing Voreal to npm in version `0.1.0`.
- Supporting Internet Explorer.
- Replacing Radix with a custom accessibility implementation.
- Implementing dark mode in the first release.
- Providing business logic, data access, validation rules, maps, analytics, or authentication.
- Preserving arbitrary legacy visuals that conflict with the approved direction.
- Adding component variants without a demonstrated product use case.

## 4. Approved Visual Direction

The Red Latina 360 theme uses only the approved **Mercado contemporáneo** direction.

It must feel:

- Warm without looking rustic.
- Contemporary without looking generically corporate.
- Latino through community, rhythm, language, imagery, and warmth rather than clichés.
- Trustworthy enough for professional services.
- Friendly enough for restaurants, barbershops, beauty, retail, and local events.

The previously considered vibrant purple/orange direction is excluded from the theme. Purple and vivid orange are not brand colors. Functional information, warning, and destructive colors may exist as restrained semantic state tokens.

### 4.1 Red Latina palette

| Role | Initial value | Required use |
| --- | --- | --- |
| Warm canvas | `#FFF9EF` | Public page backgrounds and warm sections |
| Surface | `#FFFFFF` | Cards, forms, dialogs, menus |
| Primary ink | `#071B46` | Text, headings, navigation, dark controls |
| Primary action | `#C83B20` | Buttons that require white text |
| Expressive coral | `#FF5C35` | Decorative accents with navy text or non-text decoration |
| Community green | `#39D353` | Positive accents with navy text, open and verified cues |
| Cream/stone scale | Theme-generated | Secondary surfaces, chips, borders, subtle states |

The primary action uses the darker coral because white on `#C83B20` reaches approximately `5.12:1`, while white on `#FF5C35` reaches only approximately `3.07:1`. Expressive coral therefore cannot be assumed to support normal white text.

### 4.2 Typography

- Theme heading font: Plus Jakarta Sans.
- Theme body and UI font: Inter.
- Fonts load through `next/font` when Voreal is integrated into Next.js.
- Voreal Core exposes `--vr-font-heading`, `--vr-font-body`, and `--vr-font-mono` so another theme can replace them.
- Public body copy normally uses `16–18px`.
- Administrative UI normally uses `14–16px`.
- Metadata may use `12–14px` only when contrast and line height remain sufficient.
- Display sizes use `clamp()` and range approximately from `40px` to `64px`.

### 4.3 Geometry, spacing, and elevation

- Spacing uses a `4px` base scale.
- Public controls default to `48px` height.
- Administrative controls default to `40px` height.
- Radius tokens include `8`, `12`, `16`, and `24px`, plus a pill token.
- Public directory cards normally use `16–20px` radius.
- Administrative cards, forms, and tables normally use `10–12px` radius.
- Voreal defines three shared elevation levels. Pages cannot create local shadow recipes.
- Pointer targets meet a minimum of `24×24 CSS px`; primary touch controls target at least `44×44px` where layout permits.

### 4.4 Motion

- Duration tokens: `120ms`, `180ms`, and `240ms`.
- Hover translation is limited to `-2px`.
- Motion uses `transform` and `opacity` where possible.
- No continuous bounce, decorative loops, or essential information communicated through motion.
- `prefers-reduced-motion: reduce` removes movement and reduces nonessential transitions.

## 5. Core Architecture

```text
src/voreal/
├── styles/
│   ├── index.css
│   ├── reset.css
│   ├── base.css
│   ├── accessibility.css
│   ├── motion.css
│   └── print.css
├── tokens/
│   ├── primitive.css
│   ├── semantic.css
│   ├── typography.css
│   ├── layout.css
│   └── component.css
├── themes/
│   ├── neutral.css
│   ├── red-latina.css
│   └── admin.css
├── primitives/
├── components/
├── patterns/
│   ├── directory/
│   └── admin/
├── icons/
├── utilities/
├── testing/
├── CHANGELOG.md
├── README.md
└── index.ts
```

Each component owns a focused directory:

```text
button/
├── button.tsx
├── button.styles.ts
├── button.types.ts
├── button.test.tsx
├── button.stories.tsx
└── index.ts
```

Implementation may omit a file when it provides no independent value, but it may not combine unrelated components into one large file.

### 5.1 Layers

The canonical order is:

```css
@layer vr-reset, vendor, vr-tokens, vr-base, vr-components, vr-utilities, app;
```

- `vr-reset`: scoped normalization only.
- `vendor`: legacy or third-party CSS whose source Voreal does not own.
- `vr-tokens`: primitive, semantic, theme, and density variables.
- `vr-base`: typography and native element defaults inside a Voreal root.
- `vr-components`: Voreal components and patterns.
- `vr-utilities`: intentionally limited utilities.
- `app`: page-specific composition and the final controlled override point.

### 5.2 Isolation rules

- Voreal renders within `.vr-root` or `[data-vr-root]`.
- Variables use the `--vr-*` namespace.
- Manual classes use the `vr-` prefix.
- Voreal never defines generic global classes such as `.button`, `.card`, `.active`, or `.menu`.
- The reset cannot modify elements outside a Voreal root.
- Radix portals receive `[data-vr-portal]`, the active theme, and a defined layer token.
- Voreal defines one z-index scale for sticky content, dropdowns, popovers, drawers, dialogs, and toasts.
- ID selectors and deep descendant chains are prohibited.
- `!important` is prohibited unless an exception against uncontrollable vendor CSS is documented next to the declaration.
- Temporary migration overrides live only in `legacy-bridge.css` and are deleted with their migrated consumer.

### 5.3 Tokens

Tokens have three levels:

1. **Primitive:** raw colors, sizes, weights, durations, and font families.
2. **Semantic:** canvas, surface, text, muted text, border, action, success, danger, focus, and selection.
3. **Component:** control height, card radius, input border, dialog width, and similar component contracts.

Components consume semantic or component tokens. They must not consume raw brand hex values directly.

Tailwind utilities must map to tokens. Repeated arbitrary values such as `bg-[#...]`, `rounded-[...]`, and `shadow-[...]` are prohibited in application pages.

## 6. Themes and Density

### 6.1 Neutral theme

The neutral theme proves that Voreal is not coupled to Red Latina 360. It supplies a complete, restrained token set suitable as the starting point for another project.

### 6.2 Red Latina theme

The Red Latina theme implements the Mercado contemporáneo palette, typography, imagery treatment, and component geometry.

### 6.3 Admin theme/density

The admin layer uses the same brand identity with:

- More neutral page canvases.
- `40px` standard controls.
- Smaller radii.
- Reduced decorative coral and green.
- Higher information density.
- The same semantic state, focus, typography, and accessibility tokens.

The same component may accept `density="comfortable"` or `density="compact"`; density must not create separate duplicated components.

## 7. Component Coverage

### 7.1 Foundations

- `Container`
- `Stack`
- `Cluster`
- `Grid`
- `Divider`
- `AspectRatio`
- `Heading`
- `Text`
- `Label`
- `Caption`
- `Link`
- Standardized icon wrapper

### 7.2 General controls and components

| Group | Components |
| --- | --- |
| Actions | Button, IconButton, ButtonGroup, SplitButton |
| Forms | Field, Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Slider |
| Advanced forms | DatePicker, FileUpload, ImageUpload, TagInput, AddressInput |
| Navigation | Tabs, Breadcrumbs, Pagination, DropdownMenu, CommandMenu |
| Layers | Dialog, AlertDialog, Drawer, Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Spinner, Skeleton, EmptyState, ErrorState |
| Content | Card, Badge, Avatar, Media, Accordion, Carousel |
| Data | Table, DataTable, StatCard, DefinitionList |

Components expose the states relevant to their role: default, hover, focus-visible, active/pressed, selected, disabled, readonly, loading, success, warning, error, and empty.

### 7.3 Directory patterns

- Desktop hero search for service and location.
- Full-screen mobile search.
- City/area selector.
- Category chips and category scroller.
- Filter panel, mobile filter drawer, active filters, and clear filters.
- Vertical, horizontal, compact, and featured business cards.
- Verified business indicator.
- Open/closed status.
- Rating and review summary.
- Business gallery.
- Contact actions.
- Hours.
- Location card and map container.
- Promotion/offer.
- Related businesses.
- No-results state.
- Claim-business and register-business calls to action.
- Clearly labeled advertising container.

Listing cards use a stable anatomy. Pages cannot invent additional card types through local CSS.

### 7.4 Administrative patterns

- `AdminShell`, collapsible sidebar, and header.
- `PageHeader` with title, description, breadcrumbs, and actions.
- Compact filters.
- Data tables with selection, sorting, pagination, row actions, and bulk actions.
- Sectioned forms.
- Quick-edit drawer.
- Metric cards.
- Publication and verification states.
- Image and asset administration.
- Activity history.
- Destructive-action confirmation.
- Administrative empty, loading, and error states.

## 8. Distinctive Interaction Language

Voreal includes familiar simple buttons for normal forms and administrative operations. Signature controls appear only where a real relationship or context exists.

### 8.1 Path Button

An icon occupies a visually defined internal path that communicates direction. Only internal content moves; the entire button does not slide or bounce.

### 8.2 Relay Button

The primary action carries a connected contextual capsule, for example `Llamar ahora · Abierto`. Context is supplementary text, not a second hidden action.

### 8.3 Split Bridge

The main action and secondary menu share a curved visual bridge while remaining separate semantic buttons with separate focus targets.

### 8.4 Action Rail

Related actions or views appear as stations along one visual rail. Each station remains independently labeled and keyboard accessible. It is appropriate for `Lista`, `Mapa`, and `Guardados`, but not as a replacement for every tab group.

### 8.5 Linked CTA

An informational prompt, identity cue, and action form one responsive unit. On small screens they stack in document order without losing meaning.

### 8.6 Avatar Weave

Avatars overlap or connect through a subtle community thread. Each person has a keyboard-focusable trigger when details are interactive. Overflow uses `+N`; tooltips cannot contain essential inaccessible information.

### 8.7 Identity Capsule

Avatar, name, role, and presence form one compact actionable identity unit.

### 8.8 Community Hub

A business or organization appears at the center and relevant collaborators around it. It is reserved for relationship-heavy views, not general card decoration.

## 9. Component API Rules

Shared props are predictable and intention-based:

```tsx
<Button
  variant="primary"
  size="md"
  density="comfortable"
  loading={false}
  iconStart={<SearchIcon />}
>
  Explorar negocios
</Button>
```

Use semantic variants such as `primary`, `secondary`, `ghost`, `danger`, `success`, and `compact`. Do not expose arbitrary visual APIs such as `color="red"` or `rounded="very"`.

Signature components have explicit APIs:

```tsx
<RelayButton
  action="Llamar ahora"
  context="Abierto"
  contextTone="success"
/>

<ActionRail
  value="list"
  items={[
    { value: "list", label: "Lista" },
    { value: "map", label: "Mapa" },
    { value: "saved", label: "Guardados" }
  ]}
/>
```

Visual variants are declared with `class-variance-authority` or an equivalent typed variant utility, not repeated conditional class chains in JSX.

## 10. Accessibility

- Target: WCAG 2.2 AA for the component system and representative pages.
- Normal text contrast: at least `4.5:1`.
- Large text contrast: at least `3:1`.
- Focus indicator: visible, at least approximately a `2px` perimeter-equivalent area, and at least `3:1` change of contrast.
- Keyboard navigation follows WAI-ARIA Authoring Practices for dialogs, menus, comboboxes, tabs, and related widgets.
- Radix provides behavior where it is appropriate; Voreal provides the visual layer and accessible composition.
- Color is never the only indication of selection, status, success, warning, or error.
- Loading components expose an accessible name or status.
- Icons used alone require accessible labels; decorative icons are hidden from assistive technologies.
- Form errors use `aria-invalid` and `aria-describedby`.
- Blocking errors receive focus management.
- Toasts never replace persistent critical feedback.
- Forced colors, reduced motion, and high-contrast preferences receive explicit verification.

## 11. Errors and Feedback

Voreal presents errors but does not own business validation.

```tsx
<Field
  label="Nombre del negocio"
  error="Escribe al menos dos caracteres"
  required
>
  <Input aria-invalid />
</Field>
```

```tsx
<ErrorState
  title="No pudimos cargar los negocios"
  description="Revisa tu conexión e inténtalo nuevamente."
  action={<Button>Reintentar</Button>}
/>
```

Rules:

- Messages are human, specific, and actionable.
- Field help and field errors occupy controlled space to minimize layout shift.
- Page errors distinguish empty results, offline/retryable failures, permission failures, and unavailable content.
- Destructive actions use explicit confirmation and state the affected object.
- Image failures use an aspect-ratio-stable fallback with initials or category identity.
- A successful save may use a toast only when no persistent confirmation is necessary.

## 12. Responsive Behavior

- Mobile-first breakpoints: approximately `480`, `768`, `1024`, and `1280px`.
- Public content container maximum: approximately `1240px`.
- Component responsiveness uses container queries only as progressive enhancement.
- Essential layouts have a flex/grid fallback.
- Search, filters, data tables, action rails, dialogs, and signature controls have documented mobile behavior.
- Long Spanish and English content is part of visual testing.
- No component assumes a fixed business name, address, category count, or image availability.

## 13. Browser Compatibility

Voreal follows the browser support of the installed compatible Next.js and Tailwind versions. For Tailwind v4 this means the full experience targets approximately:

- Chrome/Edge 111+
- Safari/iOS 16.4+
- Firefox 128+

Internet Explorer is unsupported.

Progressive enhancement ensures that earlier browsers may lose curved unions, blur, advanced color mixing, container-query refinements, or entry animations, but must retain:

- Readable content.
- Visible and usable actions.
- Keyboard focus.
- A usable single-column fallback.
- Form labels and errors.
- Navigation and core directory functionality.

Advanced CSS uses `@supports` when a well-supported fallback is necessary. Voreal does not add large polyfills merely to preserve decoration.

## 14. Performance Budgets

| Resource or behavior | Budget/requirement |
| --- | --- |
| Initial public Voreal CSS | Target at or below `30 KB gzip` |
| Visual JavaScript for Button | `0` additional runtime JS |
| Icons | Individual/tree-shakeable imports |
| Fonts | Two families with limited required weights |
| Animation | CSS transform/opacity; no animation runtime |
| Complex components | Loaded only on routes or interactions that require them |
| Directory images | `next/image`, declared sizes, stable aspect ratio |

Additional rules:

- React Server Components by default.
- `"use client"` only for real interaction.
- No runtime CSS-in-JS.
- Avoid internal barrel exports that defeat tree-shaking.
- Do not import entire icon libraries.
- Maps, galleries, and carousels outside the initial viewport do not block first rendering.
- Skeletons reserve stable dimensions.
- Storybook and test tools remain development-only dependencies.

## 15. Documentation and Governance

Storybook is the approved development catalog. It includes:

- Foundations and tokens.
- Every component and permitted variant.
- Interactive states.
- Public and administrative examples.
- Good and bad usage.
- Mobile, tablet, and desktop viewports.
- Neutral and Red Latina themes.
- Long Spanish and English copy.
- Missing data and extreme content.

Growth rules:

- No component without a real use case.
- Pages cannot create local visual variants of Voreal components.
- A pattern repeated three times is evaluated for promotion into Voreal; promotion is not automatic.
- A component requires documentation, relevant states, and tests before becoming a public export.
- Component files should normally remain under `250` lines.
- Component-specific manual CSS should normally remain under `150` lines.
- Exceeding a guideline requires a written reason explaining why separation would reduce clarity.
- Reusable visual changes are recorded in `CHANGELOG.md`.
- Voreal begins at version `0.1.0` even while stored locally.

## 16. Testing Strategy

| Level | Tool and purpose |
| --- | --- |
| Unit | Vitest for variants, utility behavior, and pure logic |
| Interaction | React Testing Library for keyboard, pointer, and state behavior |
| Automated accessibility | axe against component stories and representative pages |
| End-to-end | Playwright for public and admin user journeys |
| Visual catalog | Storybook |
| Visual regression | Stable captures of critical components and representative pages |
| Performance | Lighthouse and bundle/CSS budget checks |
| CSS quality | Stylelint plus Voreal token and legacy audit scripts |

Browser verification covers:

- Current Chromium and the minimum supported Chromium family.
- Current Safari/iOS and Safari 16.4.
- Current Firefox and the minimum supported Firefox.
- One progressive-enhancement run in which optional advanced treatments are unavailable.

## 17. CSS Audit Rules

The project includes an automated audit that reports:

- Legacy selectors still referenced by migrated routes.
- Raw brand colors inside components or pages.
- Local radius and shadow recipes.
- Repeated arbitrary Tailwind values.
- `!important` declarations.
- CSS files over the agreed guideline.
- Components consuming primitive brand values instead of semantic tokens.
- Generic unprefixed manual class names.
- Undocumented z-index values.

The audit starts in report-only mode during migration and becomes a blocking CI check for migrated Voreal paths.

## 18. Migration Strategy

Migration occurs by representative route and shared component, not by deleting all CSS at once.

1. Inspect the actual repository, versions, CSS imports, Radix usage, and legacy selector graph.
2. Install or align Tailwind and supporting development dependencies only when absent or incompatible.
3. Add Voreal tokens, scoped root, layers, neutral theme, and Red Latina theme without changing pages.
4. Create the catalog and foundation components.
5. Migrate one representative public directory route and verify it at target breakpoints.
6. Promote its shared directory patterns into Voreal.
7. Migrate public navigation, search, listing, profile, categories, filters, and shared states.
8. Migrate one representative administrative route.
9. Promote administrative shell, forms, data tables, filters, and states.
10. Migrate remaining administrative modules.
11. Run the selector/reference audit and remove legacy CSS only when it has no consumers.
12. Remove `legacy-bridge.css` rules alongside their final consumers.
13. Complete performance, accessibility, cross-browser, visual, and responsive verification.

Every migration slice must leave the application runnable and independently verifiable.

## 19. Completion Criteria

Voreal UI `0.1.0` is complete when:

- Public directory and administrative experiences can be built without legacy styles.
- Required controls and patterns are implemented and documented.
- The Red Latina theme follows only Mercado contemporáneo.
- The neutral theme demonstrates portability.
- Representative public and admin routes pass keyboard, accessibility, responsive, and visual checks.
- Radix portals, focus, and layering work correctly.
- Vendor and remaining legacy CSS do not leak into Voreal roots in tested routes.
- CSS and JavaScript remain within defined budgets or any exception is documented with measurements.
- No unjustified `!important` remains.
- Repeated arbitrary visual values are eliminated from migrated routes.
- The Storybook catalog documents allowed usage.
- The CSS audit passes for migrated paths.
- `README.md` explains how to copy Voreal into another project and create a new theme.

## 20. Research Basis

- [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS compatibility](https://tailwindcss.com/docs/compatibility)
- [Radix Primitives introduction and accessibility](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [shadcn/ui CSS-variable theming](https://ui.shadcn.com/docs/theming)
- [Bootstrap CSS variables](https://getbootstrap.com/docs/5.3/customize/css-variables/)
- [Semantic UI theming](https://semantic-ui.com/usage/theming.html)
- [Semantic UI button groups and attached controls](https://semantic-ui.com/elements/button.html)
- [UIkit Sass theming](https://getuikit.com/docs/sass)
- [MDN cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer)
- [MDN feature queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40supports)
- [WAI WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WAI WCAG 2.2 focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [WAI-ARIA Authoring Practices patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Design Tokens Community Group](https://www.designtokens.org/)

## 21. Implementation Preconditions

The Red Latina 360 repository is not present in the current workspace. Before implementation planning can name existing files or dependency versions, the repository or at minimum its `package.json`, application tree, global CSS entry points, Tailwind configuration, and current Radix component paths must be made available.

This precondition does not change any approved design decision. It prevents the implementation plan from inventing paths, versions, or migration steps that do not match the real project.
