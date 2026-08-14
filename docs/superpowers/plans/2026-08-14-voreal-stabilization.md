# Voreal UI stabilization implementation plan

> Execute each task test-first and preserve the reusable package boundary.

**Goal:** Correct the audited accessibility, responsive, integration, overlay, icon, and toast defects and add the Mercado Nocturno theme.

**Architecture:** Extend the tokenized CSS/Radix foundation with explicit overlay layers, server-safe layout primitives, opt-in Next.js adapters, and stable responsive composition. Keep runtime dependencies small and verify behavior in Storybook with Vitest, Playwright, and axe.

**Tech stack:** React 19, TypeScript, Radix UI, Tailwind CSS 4, Storybook 10, Vitest, Playwright, and a local Lucide-compatible SVG subset.

---

### Task 1: Establish regression coverage

- Add unit tests for link adapters, MediaFrame, StaticDataTable, Toast primitive classes, and IdentityCapsule structure.
- Add browser tests that reproduce the hidden Select and toast overlap.
- Add mobile and desktop overflow/geometry assertions for directory, admin, CommunityHub, and IdentityCapsule.
- Add axe checks for contrast and common accessibility errors.
- Run the focused tests and confirm the intended failures before implementation.

### Task 2: Fix overlay and feedback behavior

- Raise dropdown/popover layers above drawers and dialogs while leaving toast topmost.
- Give ToastTitle, ToastDescription, ToastAction, and ToastClose stable classes and grid areas.
- Style the close control as a full accessible target.
- Re-run focused unit and browser tests.

### Task 3: Add reusable navigation and media adapters

- Add a framework-neutral `VorealLinkComponent` contract.
- Add `LinkComponent` support to AdminShell and BusinessCard.
- Add `asChild` support to CardLink with Radix Slot.
- Add server-safe MediaFrame and a BusinessCard media override.
- Document Next.js usage and re-run focused tests.

### Task 4: Separate server and client table paths

- Extract shared data-table types/rendering.
- Add server-safe StaticDataTable.
- Mark interactive DataTable as a client module.
- Replace sort glyphs with Lucide icons.
- Improve the low-level table scroll region and re-run focused tests.

### Task 5: Stabilize responsive components and references

- Restructure IdentityCapsule so status remains in the copy column.
- Rebuild CommunityHub around a bounded internal stage.
- Remove outer clipping and page-level horizontal overflow from directory/admin references.
- Use responsive desktop spacing while preserving the approved mobile feel.
- Re-run responsive browser tests at defined breakpoints.

### Task 6: Normalize iconography and contrast

- Add the focused Lucide-compatible icon subset.
- Replace glyph icons across package components and reference stories.
- Add a shared icon sizing rule and accessible SVG conventions.
- Adjust semantic foreground tokens and affected component styles until axe passes.

### Task 7: Add Mercado Nocturno

- Add theme tokens and root theme typing/export.
- Add the theme to Storybook's toolbar and theme reference coverage.
- Verify contrast and visual consistency in both Red Latina and Mercado Nocturno.

### Task 8: Documentation and complete verification

- Correct README repository visibility language.
- Update theming and Next.js integration documentation.
- Run typecheck, lint, unit tests, production build, Storybook build, Playwright, audits, and budgets.
- Review React/Next.js best practices and resolve actionable findings.
- Commit intentional changes, publish a feature branch, open a pull request, and verify CI and GitHub Pages.
