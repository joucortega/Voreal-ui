# Decision Log

## 2026-08-13 — Visual direction

Use Mercado contemporáneo exclusively for the Red Latina 360 theme. The visual system uses warm ivory, navy, coral, cream/stone, and community green. Purple and vivid orange are not Red Latina brand colors.

## 2026-08-13 — Architecture

Use a hybrid architecture: Tailwind CSS v4 for constrained utilities, Radix Primitives for accessible behavior, and Voreal-owned React components with CSS custom-property tokens.

## 2026-08-13 — Reuse model

Maintain Voreal as a reusable local folder/package with a neutral core and project themes. Keep the canonical source in its own repository; copy the verified source into a host project's `src/voreal` during initial adoption.

## 2026-08-13 — Product surfaces

Support both the public directory and administrative interface from the first complete release. They share tokens and components while using comfortable and compact densities respectively.

## 2026-08-13 — Compatibility

Follow the installed compatible Tailwind/Next.js browser matrix for the full experience. Older browsers receive progressive degradation without losing content, focus, navigation, or actions. Internet Explorer is unsupported.

## 2026-08-13 — Signature interaction language

Include Path Button, Relay Button, Split Bridge, Action Rail, Linked CTA, Avatar Weave, Identity Capsule, and Community Hub. Use them only when they communicate a real relationship or context; retain ordinary controls for routine forms and administration.
