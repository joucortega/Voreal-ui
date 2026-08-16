# Voreal UI 0.2 Public Directory Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a server-first, URL-canonical public directory search with optional grouped asynchronous suggestions while preserving Voreal `0.1.x` compatibility.

**Architecture:** Add a pure search-state layer and a native `GET` form that are safe to import from React Server Components. Add the suggestions experience behind one explicit client boundary using an injected loader, Radix Popover, abortable debounced requests, and typed local observability events. Keep the existing controlled `DirectorySearch` unchanged and expose the new server/client modules through separate package subpaths.

**Tech Stack:** React 19, TypeScript 7, Radix Popover, Voreal CSS tokens/layers, Vitest + Testing Library + axe, Storybook 10, Playwright.

## Global Constraints

- Add no production dependency for this slice.
- Add no runtime CSS-in-JS.
- `DirectorySearchForm`, search contracts, and URL helpers must contain no `"use client"`, Radix, or client-component import.
- Keep the existing `DirectorySearch` props and behavior source-compatible.
- Confirmed searches use native `GET` semantics and canonical URL parameters.
- Typing suggestions must not update the confirmed URL.
- Default minimum query length is `2`; default debounce is `200ms`; recommended visible result limit is `8`.
- The public UI displays one concise actionable state at a time; cancelled requests are never user-facing errors.
- Voreal may emit typed events locally but must not send, store, or bind them to an analytics vendor.
- Raw query text is not included automatically in generic diagnostic metadata.
- New search CSS must be `<= 3 KB` gzip and total public CSS must remain `<= 30 KB` gzip.
- Support `red-latina`, `mercado-nocturno`, and `neutral`; comfortable and compact densities; WCAG 2.2 AA; forced colors; reduced motion; 375px mobile through desktop.
- `SearchCommand`, backend search/indexing, Rating/Review Summary, Stepper/Wizard, Calendar, DatePicker, and advanced motion are out of scope.

---

## File map

### New source files

- `src/patterns/directory/search/directory-search.types.ts` — serializable state, suggestion, event, loader, and parameter-name contracts.
- `src/patterns/directory/search/directory-search-state.ts` — pure parse, normalize, serialize, group-normalization, and form-value helpers.
- `src/patterns/directory/search/directory-search-state.test.ts` — pure contract and URL behavior.
- `src/patterns/directory/search/directory-search-form.tsx` — server-safe native GET form and query-control composition slot.
- `src/patterns/directory/search/directory-search-form.test.tsx` — native form semantics and localized markup.
- `src/patterns/directory/search/use-directory-suggestions.ts` — client-only async request state machine.
- `src/patterns/directory/search/directory-search-suggestions.tsx` — client combobox/listbox surface, form coordination, selection, and observability.
- `src/patterns/directory/search/directory-search-suggestions.test.tsx` — async, keyboard, selection, failure, and accessibility coverage.
- `src/patterns/directory/search/directory-search.stories.tsx` — server fallback, enhanced, empty, error, offline, long-content, and mobile references.
- `src/patterns/directory/search/directory-search.css` — isolated responsive search/suggestion styles for a feature-level CSS budget.
- `scripts/server-boundary.test.mjs` — guards server-safe search modules against client imports/directives.
- `scripts/check-css-budget.test.mjs` — verifies file and directory budget measurement.
- `e2e/directory-search.spec.ts` — native/enhanced flow, history, stale work, keyboard, themes, and geometry.

### Modified files

- `src/patterns/directory/types.ts` — re-export or alias the existing two-field value without changing its shape.
- `src/patterns/directory/index.ts` — public exports for new search contracts/components.
- `src/styles/index.css` — import isolated search CSS in `vr-components`.
- `src/index.ts` — remains compatible through the directory barrel; change only if type exports require an explicit export.
- `package.json` — add server/client search subpath exports, feature CSS budget script, and bump to `0.2.0` at release task.
- `scripts/check-css-budget.mjs` — accept either a CSS file or compiled CSS directory and an exact byte budget.
- `.github/workflows/ci.yml` — run the feature-level CSS budget.
- `README.md` — document server form, optional suggestions, URL contract, and pinned consumption.
- `CHANGELOG.md` — record `0.2.0` search slice.

---

### Task 1: Define search contracts and canonical URL state

**Files:**
- Create: `src/patterns/directory/search/directory-search.types.ts`
- Create: `src/patterns/directory/search/directory-search-state.ts`
- Create: `src/patterns/directory/search/directory-search-state.test.ts`
- Modify: `src/patterns/directory/types.ts`

**Interfaces:**
- Consumes: platform `URLSearchParams` only.
- Produces: `DirectorySearchState`, `DirectorySearchParamNames`, `DirectorySuggestion`, `DirectorySuggestionGroup`, `DirectorySuggestionRequest`, `DirectorySearchEvent`, `DirectorySuggestionLoader`, `parseDirectorySearchParams`, `serializeDirectorySearchParams`, `normalizeDirectorySearchValue`, `normalizeDirectorySuggestionGroups`, `normalizeDirectorySearchError`, and `defaultDirectorySearchParamNames`.

- [ ] **Step 1: Write failing URL and normalization tests**

Create `directory-search-state.test.ts` with exact cases for parsing, criteria changes, unknown-parameter preservation, and malformed suggestion groups:

```ts
import { describe, expect, it } from "vitest";
import {
  normalizeDirectorySearchValue,
  normalizeDirectorySearchError,
  normalizeDirectorySuggestionGroups,
  parseDirectorySearchParams,
  serializeDirectorySearchParams,
} from "./directory-search-state";

describe("directory search URL state", () => {
  it("parses supported parameters and normalizes an invalid page", () => {
    const params = new URLSearchParams("q=%20tacos%20&location=21222&category=food&sort=rating&page=-3");
    expect(parseDirectorySearchParams(params)).toEqual({
      query: "tacos",
      location: "21222",
      category: "food",
      sort: "rating",
      page: 1,
    });
  });

  it("resets page when confirmed criteria change", () => {
    const previous = { query: "tacos", location: "21222", category: "food", sort: "rating", page: 4 } as const;
    expect(normalizeDirectorySearchValue({ ...previous, query: "panadería" }, previous).page).toBe(1);
    expect(normalizeDirectorySearchValue({ ...previous, page: 5 }, previous).page).toBe(5);
  });

  it("preserves unrelated source parameters while serializing", () => {
    const source = new URLSearchParams("campaign=summer&q=old&page=9");
    const output = serializeDirectorySearchParams(
      { query: "tacos", location: "Baltimore", sort: "relevance", page: 1 },
      { source },
    );
    expect(output.get("campaign")).toBe("summer");
    expect(output.get("q")).toBe("tacos");
    expect(output.has("page")).toBe(false);
  });

  it("drops unusable suggestions while retaining valid groups", () => {
    expect(normalizeDirectorySuggestionGroups([
      { id: "businesses", label: "Negocios", items: [
        { id: "valid", type: "business", title: "Sabor de Casa", href: "/negocios/sabor-de-casa" },
        { id: "missing-href", type: "business", title: "Sin ruta" },
      ] },
    ])).toEqual([
      { id: "businesses", label: "Negocios", items: [
        { id: "valid", type: "business", title: "Sabor de Casa", href: "/negocios/sabor-de-casa" },
      ] },
    ]);
  });

  it("rejects a non-empty payload with no usable suggestion", () => {
    expect(() => normalizeDirectorySuggestionGroups([
      { id: "businesses", label: "Negocios", items: [
        { id: "missing-href", type: "business", title: "Sin ruta" },
      ] },
    ])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
  });

  it("normalizes offline and unknown failures without exposing messages", () => {
    expect(normalizeDirectorySearchError({ kind: "offline", code: "OFFLINE" })).toEqual({ kind: "offline", code: "OFFLINE" });
    expect(normalizeDirectorySearchError(new Error("private provider detail"))).toEqual({ kind: "unknown" });
  });
});
```

- [ ] **Step 2: Run the state test and verify red**

Run:

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-state.test.ts
```

Expected: FAIL because the search state/types modules do not exist.

- [ ] **Step 3: Implement exact contracts**

Define these core contracts in `directory-search.types.ts`:

```ts
import type { VorealLinkComponent } from "../../../primitives";

export type DirectorySearchSort = "relevance" | "rating" | "distance" | "newest";

export type DirectorySearchState = {
  query: string;
  location: string;
  category?: string;
  sort?: DirectorySearchSort;
  page: number;
};

export type DirectorySearchParamNames = {
  query: string;
  location: string;
  category: string;
  sort: string;
  page: string;
};

export type DirectorySuggestionType = "business" | "category" | "location";

export type DirectorySuggestion = {
  id: string;
  type: DirectorySuggestionType;
  title: string;
  description?: string;
  href?: string;
  image?: { src: string; alt: string };
  metadata?: string;
};

export type DirectorySuggestionGroup = {
  id: string;
  label: string;
  items: readonly DirectorySuggestion[];
};

export type DirectorySuggestionRequest = Pick<DirectorySearchState, "query" | "location" | "category">;

export type DirectorySearchError = {
  kind: "offline" | "network" | "invalid-response" | "unknown";
  code?: string;
};

export type DirectorySearchEvent =
  | { type: "suggestions_requested"; queryLength: number; online: boolean }
  | { type: "suggestions_succeeded"; queryLength: number; online: boolean; durationMs: number; resultCount: number; resultTypes: readonly DirectorySuggestionType[] }
  | { type: "suggestions_empty"; queryLength: number; online: boolean; durationMs: number }
  | { type: "suggestions_failed"; queryLength: number; online: boolean; durationMs: number; error: DirectorySearchError }
  | { type: "suggestions_cancelled"; queryLength: number; online: boolean; reason: "below-minimum" | "closed" | "superseded" | "unmounted" }
  | { type: "suggestion_selected"; suggestionId: string; suggestionType: DirectorySuggestionType; source: "keyboard" | "pointer" }
  | { type: "search_submitted"; queryLength: number; online: boolean };

export type DirectorySuggestionLoader = (
  request: DirectorySuggestionRequest,
  signal: AbortSignal,
) => Promise<readonly DirectorySuggestionGroup[]>;

export type DirectorySearchNavigation = {
  LinkComponent?: VorealLinkComponent;
  onNavigate?: (href: string) => void;
};
```

Implement state rules in `directory-search-state.ts`. Use an allowlist for sort values, `Math.trunc` for pages, and copy an optional `source` before setting known parameters. Omit empty `category`, default `sort="relevance"`, and `page=1` from serialized output. Normalize suggestion data so a business requires `href`, a category uses `id` as its submitted value, a location uses `title` as its visible/submitted value, and empty groups disappear. A genuinely empty array is a valid empty response; a non-empty payload with no usable item throws an internal error carrying code `INVALID_DIRECTORY_SUGGESTIONS`. `normalizeDirectorySearchError` accepts `unknown`, preserves only the approved `kind` and optional string `code`, maps that internal payload error to `{ kind: "invalid-response", code: "INVALID_DIRECTORY_SUGGESTIONS" }`, maps an offline-shaped failure to `offline`, and maps unrecognized exceptions to `{ kind: "unknown" }` without copying exception messages.

Keep the existing shape stable in `types.ts`:

```ts
export type DirectorySearchValue = {
  location: string;
  query: string;
};
```

Do not replace it with `DirectorySearchState`; existing consumers must not acquire required fields.

- [ ] **Step 4: Run focused and full unit tests**

Run:

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-state.test.ts
pnpm test
```

Expected: state tests PASS; all existing tests PASS.

- [ ] **Step 5: Commit the state foundation**

```bash
git add src/patterns/directory/search src/patterns/directory/types.ts
git commit -m "feat: add directory search state contracts"
```

---

### Task 2: Add the server-safe native GET form and export boundaries

**Files:**
- Create: `src/patterns/directory/search/directory-search-form.tsx`
- Create: `src/patterns/directory/search/directory-search-form.test.tsx`
- Create: `scripts/server-boundary.test.mjs`
- Modify: `src/patterns/directory/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `DirectorySearchState`, `DirectorySearchParamNames`, `defaultDirectorySearchParamNames`, `cn`, and server-safe `Button`.
- Produces: `DirectorySearchForm`, `DirectorySearchFormProps`, and package subpaths `@voreal/ui/patterns/directory/search-form` and `@voreal/ui/patterns/directory/search-state`.

- [ ] **Step 1: Write failing native-form and boundary tests**

Create a component test:

```tsx
import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVoreal } from "../../../testing/render-voreal";
import { DirectorySearchForm } from "./directory-search-form";

it("renders a native GET search with canonical names and initial values", () => {
  const { container } = renderVoreal(
    <DirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "tacos", location: "21222", category: "food", sort: "rating", page: 3 }}
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(form).toHaveAttribute("method", "get");
  expect(form).toHaveAttribute("action", "/directorio");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveAttribute("name", "q");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveValue("tacos");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveAttribute("name", "location");
  expect(container.querySelector('input[name="page"]')).toHaveValue("1");
});
```

Create `scripts/server-boundary.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const serverFiles = [
  "src/patterns/directory/search/directory-search-form.tsx",
  "src/patterns/directory/search/directory-search-state.ts",
  "src/patterns/directory/search/directory-search.types.ts",
];

test("keeps public directory search server modules free of client dependencies", async () => {
  for (const file of serverFiles) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /^\s*["']use client["']/mu, file);
    assert.doesNotMatch(source, /@radix-ui|use-directory-suggestions|directory-search-suggestions/u, file);
    assert.doesNotMatch(source, /components\/form/u, file);
  }
});
```

- [ ] **Step 2: Run tests and verify red**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-form.test.tsx
node --test scripts/server-boundary.test.mjs
```

Expected: FAIL because `DirectorySearchForm` does not exist.

- [ ] **Step 3: Implement the server-safe form without importing client form primitives**

Use native inputs styled with Voreal classes because the existing `Input` imports the client-only `Field` context:

```tsx
import type { FormHTMLAttributes, ReactNode } from "react";
import { Button } from "../../../components/button";
import { cn } from "../../../utilities/cn";
import { defaultDirectorySearchParamNames, normalizeDirectorySearchValue } from "./directory-search-state";
import type { DirectorySearchParamNames, DirectorySearchState } from "./directory-search.types";

export type DirectorySearchFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "children" | "method"> & {
  categoryControl?: ReactNode;
  children?: ReactNode;
  defaultValue?: Partial<DirectorySearchState>;
  locationLabel?: string;
  locationPlaceholder?: string;
  parameterNames?: Partial<DirectorySearchParamNames>;
  queryControl?: ReactNode;
  queryLabel?: string;
  queryPlaceholder?: string;
  searchLabel?: string;
  sortControl?: ReactNode;
  submitLabel?: string;
};

export function DirectorySearchForm({
  action,
  categoryControl,
  children,
  className,
  defaultValue,
  locationLabel = "¿Dónde?",
  locationPlaceholder = "Ciudad o código postal",
  parameterNames,
  queryControl,
  queryLabel = "¿Qué buscas?",
  queryPlaceholder = "Tacos, abogado, salón…",
  searchLabel = "Buscar en el directorio",
  sortControl,
  submitLabel = "Buscar",
  ...props
}: DirectorySearchFormProps) {
  const names = { ...defaultDirectorySearchParamNames, ...parameterNames };
  const value = normalizeDirectorySearchValue(defaultValue ?? {});

  return (
    <form {...props} action={action} aria-label={searchLabel} className={cn("vr-directory-search", className)} method="get" role="search">
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{queryLabel}</span>
        {queryControl ?? <input className="vr-input vr-directory-search__input" defaultValue={value.query} name={names.query} placeholder={queryPlaceholder} type="search" />}
      </label>
      <span aria-hidden="true" className="vr-directory-search__divider" />
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{locationLabel}</span>
        <input className="vr-input vr-directory-search__input" defaultValue={value.location} name={names.location} placeholder={locationPlaceholder} />
      </label>
      {categoryControl ?? (value.category ? <input name={names.category} type="hidden" value={value.category} /> : null)}
      {sortControl ?? (value.sort && value.sort !== "relevance" ? <input name={names.sort} type="hidden" value={value.sort} /> : null)}
      <input name={names.page} type="hidden" value="1" />
      {children}
      <Button className="vr-directory-search__submit" type="submit">{submitLabel}</Button>
    </form>
  );
}
```

Add direct package exports:

```json
"./patterns/directory/search-form": "./src/patterns/directory/search/directory-search-form.tsx",
"./patterns/directory/search-state": "./src/patterns/directory/search/directory-search-state.ts"
```

Export the new types, state helpers, and form from `src/patterns/directory/index.ts` without altering existing exports.

- [ ] **Step 4: Run form, boundary, type, and regression tests**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-form.test.tsx
node --test scripts/server-boundary.test.mjs
pnpm typecheck
pnpm test
```

Expected: all PASS, including the existing controlled `DirectorySearch` test.

- [ ] **Step 5: Commit the server form**

```bash
git add package.json scripts/server-boundary.test.mjs src/patterns/directory
git commit -m "feat: add server-safe directory search form"
```

---

### Task 3: Build the abortable suggestion request state machine

**Files:**
- Create: `src/patterns/directory/search/use-directory-suggestions.ts`
- Create: `src/patterns/directory/search/use-directory-suggestions.test.tsx`

**Interfaces:**
- Consumes: `DirectorySuggestionLoader`, `DirectorySuggestionRequest`, `DirectorySuggestionGroup`, `DirectorySearchEvent`, and `normalizeDirectorySuggestionGroups`.
- Produces: internal `useDirectorySuggestions(options)` returning `{ groups, status, error, activeRequestId }`, where status is `idle | loading | success | empty | error | offline`.

- [ ] **Step 1: Write failing fake-timer tests for debounce, abort, stale data, and offline**

Use `renderHook`, `act`, and deferred promises:

```tsx
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useDirectorySuggestions } from "./use-directory-suggestions";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("debounces, aborts the previous request, and ignores stale results", async () => {
  const resolvers: Array<(groups: readonly never[]) => void> = [];
  const signals: AbortSignal[] = [];
  const loadSuggestions = vi.fn((_request, signal: AbortSignal) => {
    signals.push(signal);
    return new Promise<readonly never[]>((resolve) => resolvers.push(resolve));
  });

  const { rerender, result } = renderHook(
    ({ query }) => useDirectorySuggestions({
      debounceMs: 200,
      loadSuggestions,
      minQueryLength: 2,
      open: true,
      request: { query, location: "21222" },
    }),
    { initialProps: { query: "ta" } },
  );

  await act(() => vi.advanceTimersByTimeAsync(200));
  expect(loadSuggestions).toHaveBeenCalledTimes(1);
  rerender({ query: "tacos" });
  await act(() => vi.advanceTimersByTimeAsync(200));
  expect(signals[0]?.aborted).toBe(true);
  expect(loadSuggestions).toHaveBeenCalledTimes(2);
  await act(async () => resolvers[0]?.([]));
  expect(result.current.status).toBe("loading");
});
```

Add separate cases verifying: one character remains `idle`; `navigator.onLine=false` produces `offline` without calling the loader; an empty normalized response produces `empty`; a normalized offline rejection produces `offline`; another rejection produces `error`; closing/unmounting aborts work; cancellation events are emitted with a reason and never become `error`.

- [ ] **Step 2: Run hook tests and verify red**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/use-directory-suggestions.test.tsx
```

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement the minimal request controller**

Start the file with `"use client"`. Use refs for the current `AbortController`, request sequence, mounted state, and start time. Use an effect keyed by `open`, normalized request fields, loader, `debounceMs`, and `minQueryLength`.

Required algorithm:

```ts
const requestId = ++requestIdRef.current;
const controller = new AbortController();
controllerRef.current?.abort("superseded");
controllerRef.current = controller;
setState({ status: "loading", groups: [], error: undefined, activeRequestId: requestId });
onSearchEvent?.({ type: "suggestions_requested", queryLength: query.length, online: navigator.onLine });

loadSuggestions(request, controller.signal).then(
  (rawGroups) => {
    if (controller.signal.aborted || requestId !== requestIdRef.current) return;
    try {
      const groups = normalizeDirectorySuggestionGroups(rawGroups);
      const resultCount = groups.reduce((total, group) => total + group.items.length, 0);
      setState({ status: resultCount > 0 ? "success" : "empty", groups, error: undefined, activeRequestId: requestId });
    } catch (cause: unknown) {
      const error = normalizeDirectorySearchError(cause);
      setState({ status: "error", groups: [], error, activeRequestId: requestId });
    }
  },
  (cause: unknown) => {
    if (controller.signal.aborted || requestId !== requestIdRef.current) return;
    const error = normalizeDirectorySearchError(cause);
    setState({ status: error.kind === "offline" ? "offline" : "error", groups: [], error, activeRequestId: requestId });
  },
);
```

The debounce timeout cleanup aborts only the request it owns. Unmount emits `unmounted`; a new eligible query emits `superseded`; closing emits `closed`; falling below the minimum emits `below-minimum`. Guard duplicate cancellation events with the request ID.

- [ ] **Step 4: Run hook and full unit tests**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/use-directory-suggestions.test.tsx
pnpm test
```

Expected: all PASS with no unhandled promise or state-update warnings.

- [ ] **Step 5: Commit the async state machine**

```bash
git add src/patterns/directory/search/use-directory-suggestions.ts src/patterns/directory/search/use-directory-suggestions.test.tsx
git commit -m "feat: add abortable directory suggestions state"
```

---

### Task 4: Implement the accessible grouped suggestions surface

**Files:**
- Create: `src/patterns/directory/search/directory-search-suggestions.tsx`
- Create: `src/patterns/directory/search/directory-search-suggestions.test.tsx`
- Modify: `src/patterns/directory/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `useDirectorySuggestions`, `DirectorySuggestionLoader`, `DirectorySearchParamNames`, `DirectorySearchNavigation`, `DirectorySearchEvent`, Voreal portal props/icons, and Radix Popover.
- Produces: `DirectorySearchSuggestions`, `DirectorySearchSuggestionsProps`, and `@voreal/ui/patterns/directory/search-suggestions`.

- [ ] **Step 1: Write failing interaction and accessibility tests**

Create a test helper that renders the enhancement inside a native form with `location`, `category`, and `page` controls. Test grouped rendering and keyboard behavior:

```tsx
it("selects grouped suggestions with the keyboard and keeps plain Enter for form submit", async () => {
  const user = userEvent.setup();
  const onNavigate = vi.fn();
  const onSearchEvent = vi.fn();
  const loadSuggestions = vi.fn().mockResolvedValue([
    { id: "businesses", label: "Negocios", items: [
      { id: "sabor", type: "business", title: "Sabor de Casa", href: "/negocios/sabor" },
    ] },
    { id: "categories", label: "Categorías", items: [
      { id: "food", type: "category", title: "Restaurantes" },
    ] },
  ]);

  renderSearchFixture({ loadSuggestions, onNavigate, onSearchEvent });
  const input = screen.getByRole("combobox", { name: "¿Qué buscas?" });
  await user.type(input, "ta");
  await screen.findByRole("option", { name: /Sabor de Casa/ });
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onNavigate).toHaveBeenCalledWith("/negocios/sabor");
  expect(onSearchEvent).toHaveBeenCalledWith(expect.objectContaining({
    type: "suggestion_selected",
    suggestionType: "business",
    source: "keyboard",
  }));
});
```

Add exact cases for:

- category selection sets the nearest form control named `category` to the suggestion `id`;
- location selection sets the nearest form control named `location` to the suggestion `title`;
- Escape closes without clearing input;
- pointer selection emits `source: "pointer"`;
- Enter with no active option dispatches the native form submit once;
- form submit emits `search_submitted` without raw query text;
- loading, empty, error, and offline states show only their one approved message;
- cancelled work never displays an error;
- the `aria-live` region does not duplicate option titles;
- a test named `has no accessibility violations in directory suggestions` runs `axe(container)`.

- [ ] **Step 2: Run the component test and verify red**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-suggestions.test.tsx
```

Expected: FAIL because the public component does not exist.

- [ ] **Step 3: Implement the explicit client boundary and form coordination**

Begin with `"use client"`. Props must include:

```ts
export type DirectorySearchSuggestionsProps = DirectorySearchNavigation & {
  "aria-label"?: string;
  className?: string;
  debounceMs?: number;
  defaultValue?: string;
  disabled?: boolean;
  emptyText?: string;
  errorText?: string;
  loadSuggestions: DirectorySuggestionLoader;
  loadingText?: string;
  minQueryLength?: number;
  name?: string;
  offlineText?: string;
  onSearchEvent?: (event: DirectorySearchEvent) => void;
  parameterNames?: Partial<DirectorySearchParamNames>;
  placeholder?: string;
};
```

Use `inputRef.current.form` and `new FormData(form)` to read current location/category at request time. Implement one form-control setter that supports `HTMLInputElement`, `HTMLSelectElement`, and `HTMLTextAreaElement`, assigns the value, and dispatches bubbling `input` and `change` events.

Flatten valid groups for keyboard indices while preserving grouped visual markup. Synchronize:

```tsx
<input
  aria-activedescendant={active ? optionId(active) : undefined}
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-expanded={open}
  aria-label={ariaLabel}
  autoComplete="off"
  className="vr-input vr-directory-search__input vr-directory-suggestions__input"
  name={name}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  ref={inputRef}
  role="combobox"
  type="search"
  value={query}
/>
```

Render group labels with `role="group"` and `aria-labelledby`, options with stable IDs and `role="option"`, and one separate polite status node containing only loading/count/empty/error/offline status. Do not copy option titles into the live region.

Selection rules:

```ts
if (suggestion.type === "business" && suggestion.href) {
  if (onNavigate) onNavigate(suggestion.href);
  else window.location.assign(suggestion.href);
} else if (suggestion.type === "category") {
  setNamedFormValue(inputRef.current?.form, names.category, suggestion.id);
} else if (suggestion.type === "location") {
  setNamedFormValue(inputRef.current?.form, names.location, suggestion.title);
}
```

Use an injected `LinkComponent` for pointer-operable business rows when supplied; default to `<a>`. Keyboard activation uses `onNavigate` or the browser fallback. Close the panel and reset the active index after a successful selection.

Add the direct package export:

```json
"./patterns/directory/search-suggestions": "./src/patterns/directory/search/directory-search-suggestions.tsx"
```

- [ ] **Step 4: Run component, accessibility, type, and boundary tests**

```bash
pnpm exec vitest run --project unit src/patterns/directory/search/directory-search-suggestions.test.tsx
pnpm test:a11y
pnpm typecheck
node --test scripts/server-boundary.test.mjs
```

Expected: all PASS; no server-safe file imports the new client component.

- [ ] **Step 5: Commit the suggestion surface**

```bash
git add package.json src/patterns/directory
git commit -m "feat: add accessible directory search suggestions"
```

---

### Task 5: Add responsive styling, Storybook states, and browser flow coverage

**Files:**
- Create: `src/patterns/directory/search/directory-search.css`
- Create: `src/patterns/directory/search/directory-search.stories.tsx`
- Create: `e2e/directory-search.spec.ts`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: public search form/suggestions APIs and three built-in themes.
- Produces: Storybook stories `ServerFallback`, `ProgressiveSuggestions`, `Empty`, `Error`, `Offline`, `LongContent`, and `Mobile375`, plus stable E2E story IDs.

- [ ] **Step 1: Write browser tests against the not-yet-created progressive story**

Create `e2e/directory-search.spec.ts` with:

```ts
import { expect, test } from "@playwright/test";
import axe from "axe-core";

const progressiveUrl = "/iframe.html?id=patterns-directory-search--progressive-suggestions&viewMode=story";

test("uses suggestions but keeps native submit and history canonical", async ({ page }) => {
  await page.goto(progressiveUrl);
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(query).toHaveValue("ta");
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByTestId("confirmed-search")).toContainText("q=ta");
  await page.goBack();
  await expect(page.getByTestId("confirmed-search")).toContainText("Sin búsqueda confirmada");
  await page.goForward();
  await expect(page.getByTestId("confirmed-search")).toContainText("q=ta");
});

test("keeps the suggestion panel inside a 375px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(progressiveUrl);
  await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
  const panel = page.getByRole("listbox", { name: "Sugerencias" });
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});
```

Add tests for Arrow navigation, out-of-order mocked responses, suggestion error with form usable, and Axe WCAG AA across all three themes. Add one reduced-motion assertion that the panel remains functional when animations are disabled.

- [ ] **Step 2: Build Storybook and run the new E2E file to verify red**

```bash
pnpm build-storybook
pnpm exec playwright test e2e/directory-search.spec.ts
```

Expected: FAIL because the story ID does not exist.

- [ ] **Step 3: Implement stories with a deterministic browser fixture**

In the story module, create fixed suggestion groups and a loader whose delay depends on the query (`"ta"` slower than `"tacos"`) so stale-response behavior is deterministic. Create a `SearchHistoryFixture` that captures form submission at the story boundary, calls `history.pushState`, listens for `popstate`, and renders the current confirmed query in `<output data-testid="confirmed-search">`. This history simulation belongs only to Storybook; production Voreal remains router-neutral.

The `ProgressiveSuggestions` story composes:

```tsx
<DirectorySearchForm
  action="/directorio"
  defaultValue={{ query: "", location: "Baltimore, MD", page: 1 }}
  queryControl={
    <DirectorySearchSuggestions
      aria-label="¿Qué buscas?"
      loadSuggestions={loadDemoSuggestions}
      name="q"
      onNavigate={(href) => setConfirmed(`href=${href}`)}
    />
  }
/>
```

Use explicit loaders for empty and error stories. For offline, add a story-only boolean prop that makes the loader throw a normalized offline error; do not globally mutate browser connectivity in the story. Long-content must include a business title over 100 characters and a long location label.

- [ ] **Step 4: Add isolated responsive CSS**

Import the new file after the existing directory CSS in `src/styles/index.css` under `vr-components`. Required layout rules:

- `.vr-directory-suggestions` is positioned relative and has `min-inline-size: 0`.
- Popover content uses `--vr-layer-popover`, `--vr-surface-overlay`, `--vr-border`, `--vr-shadow-2`, and existing radius/spacing tokens.
- Width is `var(--radix-popover-trigger-width)` with `max-inline-size: calc(100vw - 2 * var(--vr-space-3))`.
- Max height is bounded by `min(24rem, var(--radix-popover-content-available-height))` with internal `overflow-y: auto` and `overscroll-behavior: contain`.
- Active/hover options use semantic action-soft/text tokens; focus remains on the input.
- Group labels are sticky only when that does not overlap content; otherwise render normal block labels.
- Empty/error/offline states use the same fixed content region so text does not stack.
- Optional images reserve fixed `2.5rem` square dimensions.
- At `max-width: 48rem`, the panel spans the available search width and the native form retains its existing stacked/mobile layout.
- Reduced motion sets entrance duration to `0.01ms`; forced-colors keeps borders and active-option indication visible.

Use opacity and translate only for the existing functional open/close transition; do not add spring, stagger, glow, or decorative choreography.

- [ ] **Step 5: Rebuild and run browser/a11y checks**

```bash
pnpm build-storybook
pnpm exec playwright test e2e/directory-search.spec.ts
pnpm test:a11y
pnpm lint:css
pnpm audit:css
```

Expected: all PASS at mobile/tablet/desktop with no Axe, overflow, raw-color, z-index, or stylelint failures.

- [ ] **Step 6: Commit visual and browser coverage**

```bash
git add e2e/directory-search.spec.ts src/patterns/directory/search src/styles/index.css
git commit -m "feat: document and verify directory search states"
```

---

### Task 6: Enforce the feature CSS budget in local and CI verification

**Files:**
- Create: `scripts/check-css-budget.test.mjs`
- Modify: `scripts/check-css-budget.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: a CSS file or directory path plus budget bytes.
- Produces: `readCssSource(path)`, existing `measureCss`, `evaluateBudget`, `pnpm budget:search-css`, and a CI gate.

- [ ] **Step 1: Write failing file/directory budget tests**

```js
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { readCssSource } from "./check-css-budget.mjs";

test("reads one CSS file for a feature-level budget", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-css-"));
  const file = path.join(root, "feature.css");
  await writeFile(file, ".feature{display:grid}", "utf8");
  assert.equal(await readCssSource(file), ".feature{display:grid}");
});

test("joins CSS files from a directory in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "voreal-css-"));
  await writeFile(path.join(root, "b.css"), ".b{}", "utf8");
  await writeFile(path.join(root, "a.css"), ".a{}", "utf8");
  assert.equal(await readCssSource(root), ".a{}\n.b{}");
});
```

- [ ] **Step 2: Run the script test and verify red**

```bash
node --test scripts/check-css-budget.test.mjs
```

Expected: FAIL because `readCssSource` is not exported.

- [ ] **Step 3: Extend the existing script without changing the default global gate**

Use `stat()` to distinguish file and directory. Preserve default path `storybook-static/assets` and default budget `30 * 1024`. Accept an optional second CLI argument as integer bytes:

```js
const inputPath = path.resolve(process.argv[2] ?? "storybook-static/assets");
const budgetBytes = Number.parseInt(process.argv[3] ?? String(30 * 1024), 10);
if (!Number.isFinite(budgetBytes) || budgetBytes <= 0) {
  throw new Error("El presupuesto CSS debe ser un número positivo de bytes.");
}
const source = await readCssSource(inputPath);
const result = evaluateBudget({ ...measureCss(source), budgetBytes });
```

Add to `package.json`:

```json
"budget:search-css": "node scripts/check-css-budget.mjs src/patterns/directory/search/directory-search.css 3072"
```

Add after the existing global budget step in CI:

```yaml
- run: pnpm budget:search-css
```

- [ ] **Step 4: Run script and both budget gates**

```bash
node --test scripts/check-css-budget.test.mjs
pnpm build-storybook
pnpm budget:search-css
pnpm budget:css
```

Expected: all PASS; feature gzip `<= 3.00 KB`; total gzip `<= 30.00 KB`.

- [ ] **Step 5: Commit budget enforcement**

```bash
git add .github/workflows/ci.yml package.json scripts/check-css-budget.mjs scripts/check-css-budget.test.mjs
git commit -m "chore: enforce directory search CSS budget"
```

---

### Task 7: Document, version, and run the complete release gate

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Modify: `docs/NEXTJS.md`

**Interfaces:**
- Consumes: all public APIs from Tasks 1–6.
- Produces: documented Voreal `0.2.0` search integration and exact pinned-consumption guidance.

- [ ] **Step 1: Add copy-pasteable server-first documentation**

Document this server example in README and expand it in `docs/NEXTJS.md`:

```tsx
import {
  parseDirectorySearchParams,
} from "@voreal/ui/patterns/directory/search-state";
import {
  DirectorySearchForm,
} from "@voreal/ui/patterns/directory/search-form";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") params.set(key, value);
  }
  const search = parseDirectorySearchParams(params);

  return (
    <>
      <DirectorySearchForm action="/directorio" defaultValue={search} />
      <p>{search.query ? `Resultados para ${search.query}` : "Explora negocios"}</p>
    </>
  );
}
```

Add a separate client example composing `DirectorySearchSuggestions` through `queryControl`, with `loadSuggestions(request, signal)` forwarding the `AbortSignal` to `fetch`. State explicitly that the host chooses analytics and that Voreal does not include raw query text in diagnostics.

- [ ] **Step 2: Record version and changelog**

Set `package.json` version to `0.2.0`. Add a `0.2.0` changelog entry listing:

- server-safe GET search form and URL state helpers;
- optional abortable grouped suggestions;
- concise user states plus typed local diagnostics;
- dedicated server/client package entry points;
- Storybook and Playwright coverage;
- no breaking change to `DirectorySearch`.

Retain `private: true`; do not publish to npm. Explain that consuming applications pin tag/version/verified commit and do not follow `main`.

- [ ] **Step 3: Run the complete required verification gate fresh**

```bash
pnpm test
pnpm test:a11y
pnpm typecheck
pnpm lint:css
pnpm audit:css
pnpm build
pnpm build-storybook
pnpm test:e2e
pnpm budget:search-css
pnpm budget:css
git diff --check
```

Expected:

- all unit/script/a11y tests pass;
- all Playwright tests pass in Chromium;
- TypeScript, build, Storybook, Stylelint, and CSS audit exit `0`;
- feature CSS is `<= 3 KB` gzip and total CSS is `<= 30 KB` gzip;
- `git diff --check` prints nothing.

- [ ] **Step 4: Inspect the final public surface and compatibility diff**

```bash
git diff origin/main...HEAD -- package.json src/patterns/directory src/styles/index.css README.md docs/NEXTJS.md CHANGELOG.md
git status --short
```

Expected: only planned search/version/docs changes; no removal or incompatible signature change for `DirectorySearch`, `DirectorySearchProps`, or `DirectorySearchValue`; no unrelated files.

- [ ] **Step 5: Commit the release documentation**

```bash
git add README.md CHANGELOG.md docs/NEXTJS.md package.json
git commit -m "docs: release Voreal 0.2 directory search"
```

- [ ] **Step 6: Re-run the short post-commit proof**

```bash
git status --short --branch
git log --oneline --decorate -8
pnpm test
pnpm typecheck
```

Expected: clean feature branch; seven implementation commits after the approved design/plan commits; tests and typecheck pass from committed state.

---

## Final acceptance checklist

- [ ] Native `GET` search works without the client enhancement.
- [ ] Confirmed state round-trips through canonical URL parameters and browser history.
- [ ] Suggestions are grouped, debounced, abortable, stale-safe, keyboard accessible, and optional.
- [ ] Business/category/location selections follow the approved deterministic behavior.
- [ ] Failed/offline suggestions show one actionable message and leave the form usable when connectivity permits.
- [ ] Diagnostic events are typed, local-only, and exclude raw query text by default.
- [ ] Server-safe imports contain no client/Radix graph.
- [ ] Existing controlled `DirectorySearch` remains source-compatible.
- [ ] Three themes, responsive layouts, reduced motion, forced colors, WCAG AA, CSS audits, and both CSS budgets pass.
- [ ] README, Next.js guide, changelog, package exports, and version `0.2.0` match the implemented API.
