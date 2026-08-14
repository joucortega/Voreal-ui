# Voreal UI stabilization and Mercado Nocturno design

**Date:** 2026-08-14  
**Status:** Approved by the user's delegated implementation request

## Goal

Stabilize the existing Voreal UI implementation for Red Latina 360, with special attention to accessibility, responsive behavior, Next.js integration, predictable overlays, and reusable client/server boundaries. Add one additional theme that remains inside the approved “mercado contemporaneo” visual direction.

## Constraints

- Keep `@voreal/ui` reusable outside Next.js and avoid a hard `next` dependency.
- Preserve Radix primitives and the existing token/class architecture.
- Use Lucide for consistent, accessible SVG iconography.
- Prefer CSS and semantic composition over viewport-specific JavaScript.
- Support the browser range already implied by Tailwind CSS 4; no legacy-browser polyfill layer is added.
- Do not mix the discarded visual direction into the approved direction A.

## Architecture

### Accessibility and contrast

Semantic status tokens will be split into vivid decorative colors and darker foreground colors. Badges, publication statuses, promotions, and advertisement links will use foreground tokens that meet WCAG AA on their actual surfaces. Browser-level axe checks will cover the two built-in visual themes.

### Overlay layering

Floating controls opened from another overlay must render above their owner. The global layer order becomes: base/raised/sticky, drawer and dialog, dropdown/popover, toast. Radix portals continue inheriting Voreal theme and density attributes. A regression test will open a Select inside the right-side Quick Edit drawer and verify that the listbox is visible above the drawer.

### Next.js adapters

The package will expose a small link contract and accept a `LinkComponent` in `AdminShell` and `BusinessCard`. Its default is the native anchor; consumers may pass `next/link`. `CardLink` will support Radix Slot's `asChild`, enabling `<CardLink asChild><Link ... /></CardLink>`.

For images, `MediaFrame` will be a server-safe aspect-ratio and fallback container. Existing `Media` remains the convenient native-image client component. Next.js consumers can place `next/image` inside `MediaFrame`, retaining optimization and layout stability. `BusinessCard` will accept a `media` React node override.

### Client and server tables

`StaticDataTable` will be the server-safe rendering path. Interactive `DataTable` will explicitly declare its client boundary and add selection and sorting behavior on top of the same table primitives. The low-level `Table` remains server-safe and owns the horizontal scroll region.

### Responsive layout

Reference layouts and nested panels will consistently use `min-inline-size: 0` and `max-inline-size: 100%`. Horizontal tables retain local scrolling and an accessible region label instead of forcing page-level overflow. Desktop reference layouts will use bounded readable widths and responsive padding, while mobile layouts retain the current compact character.

`IdentityCapsule` will keep status inside its copy column, so it does not jump between grid cells. `CommunityHub` will use a bounded internal stage and an orbit centered on that stage rather than hard-coded page coordinates.

### Toast structure

Toast title, description, action, and close primitives will receive stable component classes. CSS will assign copy to the first grid column and controls to a dedicated second column, with a 44px close target and no content overlap.

### Icons

All UI glyphs used as controls or decoration in components and reference stories will be replaced with a small, tree-shakeable SVG subset following Lucide's 24px stroke language. Keeping the subset local avoids another runtime dependency while preserving visual consistency. Decorative icons will be hidden from assistive technology; button labels and surrounding content remain the accessible names.

### New theme

`mercado-nocturno` is a night-market variant of direction A: deep navy canvas, warm raised surfaces, coral action, maize accent, and mint status details. It reuses all component geometry and motion, and its semantic foreground tokens must pass AA contrast. Storybook will expose theme switching from its toolbar.

### Documentation and repository state

The README will accurately describe the source repository as public while noting that the package remains marked `private` until an npm publishing decision is made. Next.js adapter examples, theme usage, and client/server guidance will be documented. CI and Pages status will be verified after publishing rather than inferred from the workflow file.

## Verification

- Unit tests for adapters, `MediaFrame`, toast classes, stable identity structure, and static versus interactive table exports.
- Playwright coverage for Select-in-drawer layering, toast geometry, responsive page overflow, and component geometry at mobile and desktop widths.
- Axe checks for WCAG AA color contrast and common accessibility violations.
- TypeScript, lint, full unit suite, production library build, Storybook build, Playwright suite, CSS audits, and bundle budgets.
- Publish on a feature branch, open a pull request, and verify the deployed Storybook and GitHub Actions runs.
