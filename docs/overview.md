# Voreal UI

Voreal UI is a reusable local React design system for modern business directories. Its first implementation target is Red Latina 360.

The approved visual direction is **Mercado contemporáneo**: warm ivory surfaces, deep navy typography, coral actions, cream supporting surfaces, and community green accents. The alternative purple/orange direction is intentionally excluded from the Red Latina theme.

## Current status

This repository currently contains the approved product/design specification, the complete implementation plan, and visual concept artifacts. Component implementation begins with Tasks 1–10 of the plan. Integration into Red Latina 360 begins only after that repository is available for an evidence-based audit.

## Documents

- [`docs/specs/voreal-ui-design.md`](docs/specs/voreal-ui-design.md) — approved design specification.
- [`docs/plans/voreal-ui-implementation.md`](docs/plans/voreal-ui-implementation.md) — 13-task implementation and migration plan.

## Visual concepts

- [`assets/concepts/01-mercado-contemporaneo.png`](assets/concepts/01-mercado-contemporaneo.png) — approved Red Latina visual direction.
- [`assets/concepts/02-premium-urbano.png`](assets/concepts/02-premium-urbano.png) — explored alternative, retained only as decision history.
- [`assets/concepts/03-comunidad-vibrante.png`](assets/concepts/03-comunidad-vibrante.png) — rejected brand direction, retained only as decision history.
- [`assets/concepts/04-actions-and-identity.png`](assets/concepts/04-actions-and-identity.png) — approved signature buttons and identity components.

## Planned architecture

```text
src/
├── styles/
├── tokens/
├── themes/
├── primitives/
├── components/
├── patterns/
│   ├── directory/
│   └── admin/
├── icons/
├── utilities/
└── testing/
```

The package will use Tailwind CSS v4 for token-backed composition, Radix Primitives for accessible behavior, and locally owned React components for visual identity and API stability.

## Repository visibility

Keep the repository private while Voreal is pre-release and tightly connected to Red Latina 360. A separate licensing decision should be made before any public release.
