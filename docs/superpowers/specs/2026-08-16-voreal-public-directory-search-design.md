# Voreal UI 0.2 — Public Directory Search Design

**Date:** 2026-08-16

**Status:** Approved by the user on 2026-08-16

**Target:** First vertical slice of Voreal UI `0.2.0`

## Purpose

Add a public-directory search experience that is useful without JavaScript, indexable and shareable through its URL, and progressively enhanced with asynchronous suggestions. The feature must remain reusable outside Red Latina and must not couple Voreal to Next.js, Prisma, Supabase, an analytics vendor, or a search backend.

Voreal is complete when it supports coherent product flows, not when it matches the component count of a general-purpose UI framework. This slice therefore finishes one search flow and deliberately excludes unrelated primitives.

## Goals

- Provide a server-safe HTML `GET` search form.
- Make confirmed search state serializable in a canonical URL.
- Add optional grouped asynchronous suggestions without making them required for search.
- Support businesses, categories, and locations through a small serializable contract.
- Keep user-facing status concise while exposing detailed optional diagnostic events to the consuming application.
- Preserve the existing `DirectorySearch` API from Voreal `0.1.x`.
- Work across the `red-latina`, `mercado-nocturno`, and `neutral` themes and comfortable/compact densities.
- Maintain Voreal's accessibility, browser-degradation, CSS-budget, and client/server-boundary guarantees.

## Non-goals

- A global Search Command or Command Palette.
- Search indexing, ranking, geocoding, database access, API routes, or backend caching.
- Product-specific result fetching or analytics transmission.
- Advanced motion choreography.
- Rating, review summaries, Stepper/Wizard, Calendar, or DatePicker in this slice. Those remain later `0.2.x` vertical slices.
- Replacing the existing business-card grid, pagination, or filter panel.

## Design principles

1. **URL first:** a confirmed search is represented by its URL and works through a normal form submission.
2. **Enhancement, not dependency:** suggestions improve discovery but never become the only route to results.
3. **One engine, two surfaces:** the form and suggestion panel share contracts and visual language without duplicating search state.
4. **Minimum information for the user:** show only whether the system is working, found something, failed, and whether the user can continue.
5. **Detailed evidence for maintainers:** expose typed local events, but never send or persist telemetry from Voreal.
6. **Portable boundaries:** server-safe modules must not import client components, Radix portals, or product frameworks.

## Architecture

### Server-safe foundation

`DirectorySearchForm` renders a semantic `role="search"` form using method `GET`. It accepts an action, initial values, labels, placeholders, parameter-name overrides, and composition slots for optional controls. It contains no effects, event interception, provider, router, or `"use client"` directive.

The default confirmed-search contract is:

```ts
export type DirectorySearchState = {
  query: string;
  location: string;
  category?: string;
  sort?: "relevance" | "rating" | "distance" | "newest";
  page: number;
};
```

Pure server-safe helpers provide:

```ts
parseDirectorySearchParams(input)
serializeDirectorySearchParams(value, options?)
normalizeDirectorySearchValue(value, previous?)
```

Normalization trims text, applies supported enum values, and converts invalid or missing page values to `1`. A change to query, location, category, or sort resets the page to `1`; changing only the page preserves the remaining search. Unknown URL parameters are ignored by parsing and may be preserved by serialization when a source `URLSearchParams` instance is supplied.

### Progressive suggestion layer

`DirectorySearchSuggestions` is an explicitly client-only enhancement associated with the search input. The consuming application injects the asynchronous data source:

```ts
loadSuggestions(
  request: DirectorySuggestionRequest,
  signal: AbortSignal,
): Promise<readonly DirectorySuggestionGroup[]>;
```

Voreal owns input coordination, debounce, cancellation, active-option state, keyboard interaction, status presentation, and selection behavior. It does not own backend queries, global state, navigation, or cache invalidation.

Defaults:

- minimum query length: `2`
- debounce: `200ms`
- recommended visible result limit: `8`

The minimum length and debounce are configurable. Submitting the form is immediate and is never debounced.

### Existing API compatibility

The controlled client component `DirectorySearch` remains exported with its existing `value`, `onChange`, and `onSubmit` contract. Shared presentational fields may be extracted internally, but Voreal `0.2.0` will not silently convert the old component into the new server form or remove its client behavior.

New server and client entry points must be independently importable so an application can use the form without including suggestion code in a server graph.

## Suggestion contracts

```ts
export type DirectorySuggestionType =
  | "business"
  | "category"
  | "location";

export type DirectorySuggestion = {
  id: string;
  type: DirectorySuggestionType;
  title: string;
  description?: string;
  href?: string;
  image?: {
    src: string;
    alt: string;
  };
  metadata?: string;
};

export type DirectorySuggestionGroup = {
  id: string;
  label: string;
  items: readonly DirectorySuggestion[];
};

export type DirectorySuggestionRequest = {
  query: string;
  location: string;
  category?: string;
};
```

The initial built-in presentation recognizes business, category, and location types. The group contract permits later result families without requiring a new component, but this slice will not ship promotion or administrative-action behavior.

Selection semantics are deterministic:

- a business with `href` navigates through an injected `LinkComponent` or a normal anchor;
- a category updates the category value;
- a location updates the location value;
- Enter with no active suggestion submits the normal search form.

## Data flow

### Confirmed search

```text
Initial URL
  -> server parses search state
  -> application obtains directory results
  -> DirectorySearchForm renders initial values
  -> user submits GET form
  -> browser/application navigates to canonical URL
  -> server renders confirmed results
```

Typing alone does not modify the URL. Back/Forward navigation and shared links therefore represent searches the user actually confirmed rather than every intermediate keystroke.

### Suggestions

```text
Input changes
  -> minimum-length check
  -> debounce
  -> abort previous request
  -> loadSuggestions(request, signal)
  -> discard stale response
  -> normalize groups
  -> render one concise state
```

Suggestions do not erase, replace, or mark existing page results as stale. Voreal keeps no global suggestion cache; the injected service, browser, or host framework may cache independently.

## Interaction and responsive behavior

- Arrow Down and Arrow Up move the active option.
- Enter selects an active option; otherwise it submits the form.
- Escape closes suggestions and leaves input text intact.
- Tab follows the form's natural focus order.
- Pointer selection must not steal focus before selection is committed.
- Desktop and tablet use a panel anchored to the search field.
- Mobile uses the available width below the field with a bounded internal scroll region.
- The suggestion panel overlays content instead of causing layout shift.
- Portal content receives the current Voreal theme and density attributes.
- The interface uses only functional state transitions in this slice and honors `prefers-reduced-motion`.

## User-facing states

Only one primary state is presented at a time:

- `idle`: no status is shown before the minimum query length.
- `loading`: a small non-blocking indicator is shown; existing results remain visible.
- `success`: grouped suggestions are available.
- `empty`: “No encontramos coincidencias. Prueba otra palabra o ubicación”.
- `error`: “Las sugerencias no están disponibles. Aún puedes buscar”.
- `offline`: “No tienes conexión. Podrás buscar cuando vuelvas a conectarte”.

Cancelled requests are maintenance signals, not user-facing errors. Technical codes, provider names, duration, and request details never appear in the public interface. Suggestion failure preserves the text and normal form submission.

## Observability contract

`DirectorySearchSuggestions` accepts an optional `onSearchEvent` callback. Voreal invokes it locally and never transmits or stores the event.

Event names:

- `suggestions_requested`
- `suggestions_succeeded`
- `suggestions_empty`
- `suggestions_failed`
- `suggestions_cancelled`
- `suggestion_selected`
- `search_submitted`

An event may include duration, result count, result types, action source, online state, normalized error kind/code, query length, and selected category/location. Raw search text is not included automatically in generic diagnostic metadata. Because the host already owns the input and request, it may deliberately attach product-approved search-term analytics outside Voreal.

## Error handling

- Every new request aborts the previous request.
- An aborted request cannot transition the interface to `error`.
- Responses carry a request identity and are ignored when they no longer match the active request.
- A failed suggestion request leaves the form usable and the input unchanged.
- An unmounted or closed suggestion surface aborts pending work and performs no later state update.
- Invalid suggestion items are skipped without invalidating valid groups; an entirely unusable payload becomes the single `error` state.
- The injected loader's exception is normalized for UI and passed with diagnostic detail to `onSearchEvent`.

## Accessibility

- The form has a localized accessible search name and visible field labels.
- Suggestions follow the WAI-ARIA editable combobox/listbox interaction model.
- `aria-expanded`, `aria-controls`, `aria-activedescendant`, option selection, group labels, and live status remain synchronized.
- Loading and result counts are announced once, without duplicating visible option text.
- Focus is visible in every theme and returns predictably when the panel closes.
- Pointer targets remain usable at mobile sizes.
- Long Spanish/English labels, zoom, forced colors, reduced motion, and WCAG 2.2 AA contrast are test requirements.

## Performance and compatibility

- Add no production dependency for this slice.
- Add no runtime CSS-in-JS.
- Keep the server-safe form free of Radix and client-only imports.
- Cancel work on new input, close, and unmount.
- Keep new public CSS at or below `3 KB` gzip while preserving the existing global `30 KB` gzip gate.
- Reuse semantic tokens and established layer values; add no arbitrary brand colors or numeric z-indexes.
- Reserve stable dimensions for optional media and render suggestions as an overlay to prevent layout shift.
- Preserve full search submission under progressive degradation. Older supported browsers may receive reduced visual effects but retain content, focus, navigation, and actions.

## Next.js integration

Voreal does not import Next.js. A Next.js application may:

- render `DirectorySearchForm` from a Server Component;
- parse `searchParams` with the server-safe helpers;
- provide a route handler or server-backed client endpoint to `loadSuggestions`;
- inject `next/link` through the existing `LinkComponent` convention;
- compose `next/image` through the existing stable media-frame convention;
- choose `router.push`, normal anchor navigation, or native GET submission at the product boundary.

## Verification strategy

### Unit and component tests

- URL parse/serialize round trips.
- Normalization and page reset rules.
- Unknown/invalid parameter handling.
- Minimum query length and configurable debounce.
- Cancellation on new input, close, and unmount.
- Stale-response rejection and out-of-order responses.
- Mouse and keyboard selection behavior.
- Business/category/location selection semantics.
- Loading, success, empty, error, and offline states.
- Observability event payloads and cancellation classification.
- Existing `DirectorySearch` API regression coverage.

### Browser tests

- Native GET search without the suggestion enhancement.
- Progressively enhanced search with grouped suggestions.
- Shareable URL and Back/Forward restoration.
- Slow API and out-of-order responses.
- Suggestion failure with the form still usable.
- Keyboard-only completion of the flow.
- 375px mobile, tablet, and desktop layout.
- `red-latina`, `mercado-nocturno`, and `neutral` themes.
- Axe checks over primary states and keyboard/focus assertions that Axe cannot cover.

### Required gates

The slice is complete only when these pass:

```bash
pnpm test
pnpm test:a11y
pnpm typecheck
pnpm lint:css
pnpm audit:css
pnpm build
pnpm build-storybook
pnpm test:e2e
pnpm budget:css
```

## Release and consumption

Development occurs toward `0.2.0` without changing the already published `0.1.x` contract. Consuming applications must pin an exact tag, package version, or verified commit and must not follow Voreal `main` automatically. Product-specific fields, ranking logic, analytics policy, and search infrastructure remain in the consuming application.

## Acceptance criteria

1. A user can submit and revisit a canonical directory search with JavaScript unavailable.
2. Enabling suggestions adds grouped, keyboard-accessible discovery without changing confirmed URL state while typing.
3. Failed, cancelled, stale, or offline suggestion work cannot corrupt the input or disable normal search.
4. The public UI shows one concise actionable state while the host may receive detailed typed diagnostics.
5. Server consumers can import the form and URL helpers without pulling a client boundary.
6. Existing Voreal `0.1.x` directory-search consumers remain source-compatible.
7. All themes, responsive targets, accessibility checks, build gates, and CSS budgets pass.
