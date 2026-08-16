# Final whole-branch fix report — Voreal 0.2 directory search

Date: 2026-08-16

Branch: `agent/voreal-0.2-search`

Scope: final review findings for focus visibility, suggestion-response runtime validation, Storybook history canonicalization, enhanced Next.js examples, and feasible authored browser coverage. No publish, merge, push, or tag operation was performed.

## Integrated fixes

- Every `.vr-directory-search__input` now retains a semantic `:focus-visible` outline. This covers the native query input, native location input, and enhanced combobox. Forced-colors mode explicitly uses `Highlight`.
- `normalizeDirectorySuggestionGroups` now treats its loader payload as `unknown`, rejects every non-array payload, validates nonblank group `id`/`label`, validates item `id`/`title`/`type`, enforces the business `href`, and validates optional `description`, `href`, `metadata`, and `image` fields before returning anything to React. Invalid entries/groups are dropped; a non-empty wholly unusable payload throws `InvalidDirectorySuggestionsError` with `INVALID_DIRECTORY_SUGGESTIONS`, which the hook exposes as the approved `invalid-response` diagnostic and concise error state.
- The Storybook harness uses `getCanonicalConfirmedDirectorySearch` for initialization, submission, and `popstate`. It parses and serializes through the production canonical helpers, excludes Storybook `id`/`viewMode`, omits default-only state, and remounts uncontrolled form fields from canonical history so direct/shared query and location values are restored consistently.
- README and `docs/NEXTJS.md` now show a client wrapper accepting the server-parsed `DirectorySearchState`, passing it to `DirectorySearchForm.defaultValue`, and passing the same `initialSearch.query` to `DirectorySearchSuggestions.defaultValue`.
- Authored Playwright coverage now includes direct/shared URL restoration, native query/location focus, forced-colors focus, a native GET request, compact density including the portal, tablet geometry, 200% text sizing with long content, and deterministic stale-response release. Theme Axe cases wait for a rendered success option before scanning.

## Strict RED evidence

Production change that each test catches:

- restoring `outline: none` on the shared directory input focus selector fails the keyboard-focus CSSOM contract and the authored computed-style browser cases;
- treating a non-array payload as empty, accepting a blank group identity, or omitting optional-field validation fails the state tests;
- allowing an object-valued description reaches React and fails the component test instead of producing `INVALID_DIRECTORY_SUGGESTIONS`;
- returning raw Storybook search strings or treating default `sort=relevance&page=1` as a confirmation fails the canonical helper test;
- removing either enhanced-example default value is exposed by the check-first documentation audit.

Initial focused command (after resolving the worktree-local tool path, before production edits):

```text
../../node_modules/.bin/vitest run --project unit \
  src/patterns/directory/search/directory-search-state.test.ts \
  src/patterns/directory/search/directory-search-form.test.tsx \
  src/patterns/directory/search/directory-search-suggestions.test.tsx \
  src/patterns/directory/search/directory-search.stories.test.tsx
```

Observed RED:

```text
Test Files  4 failed (4)
Tests       8 failed | 23 passed (31)
```

The failures were requirement-specific:

- focus: `expected 'none' to be 'solid'`;
- non-array payload: `expected [Function] to throw an error`;
- invalid group identity: `expected [Function] to throw an error`;
- malformed rendered fields: invalid items remained in the returned group;
- wholly malformed optional fields: no internal validation error was thrown;
- React boundary: `Objects are not valid as a React child` for the object-valued description;
- missing tablet story: `Cannot read properties of undefined (reading 'parameters')`;
- missing canonical helper: `getCanonicalConfirmedDirectorySearch is not a function`.

After the first canonical implementation, the added default-only history case produced a second focused RED:

```text
expected '?q=&location=' to be ''
Test Files  1 failed (1)
Tests       1 failed | 2 passed (3)
```

The check-first docs audit also failed before the examples were changed:

```text
docs/NEXTJS.md:63:export function DirectorySearchWithSuggestions() {
docs/NEXTJS.md:67:      queryControl={<DirectorySearchSuggestions loadSuggestions={loadSuggestions} name="q" />}
README.md:175:export function DirectorySearchWithSuggestions() {
README.md:179:      queryControl={<DirectorySearchSuggestions loadSuggestions={loadSuggestions} name="q" />}
exit 1
```

Focused GREEN after minimal implementation:

```text
Test Files  4 passed (4)
Tests       31 passed (31)
```

The canonical edge-case suite then passed independently: 1 file, 3 tests.

JSDOM does not resolve the custom properties used inside the outline shorthand when calculating `getComputedStyle`. The deterministic unit focus check therefore combines real `userEvent.tab()` focus order on both native controls with the parsed CSSOM semantic rule. The authored Playwright cases perform the computed-style assertion in Chromium.

## Verification evidence for the first final-review pass

Fresh pre-commit checks from this worktree:

- Focused unit suites: 4 files, 31 tests passed.
- Full unit suite: 21 files, 98 tests passed.
- Script contracts: 12/12 passed, including server/client boundaries and directory-search CSS ownership.
- Filtered a11y suite: 9 files and 10 tests passed; 12 files/88 tests were skipped by the required `accessib|violations` filter.
- Typecheck: `tsc -p tsconfig.json --noEmit` exited 0.
- Build: `tsc -p tsconfig.build.json` exited 0.
- Storybook: production build completed successfully. It emitted the existing non-fatal inability to save `/root/.storybook/settings.json` and the bundle-size advisory.
- Stylelint: `stylelint 'src/**/*.css'` exited 0.
- CSS audit: 0 violations across 146 files.
- Search CSS budget after the edit: 4.38 KB raw, 1.11 KB gzip, within 3.00 KB gzip.
- Global CSS budget after the fresh Storybook build: 91.42 KB raw, 14.34 KB gzip, within 30.00 KB gzip.
- Playwright discovery: `playwright test e2e/directory-search.spec.ts --list` listed all 16 deterministic cases and exited 0.
- Documentation check: obsolete zero-prop/uninitialized enhanced examples are absent; both files contain `initialSearch: DirectorySearchState`, `defaultValue={initialSearch}`, and `defaultValue={initialSearch.query}`.
- Diff checks: `git diff --check` and `git diff --check origin/main` emitted no whitespace errors. Whole-branch public-surface inspection confirms the existing `DirectorySearch`, `DirectorySearchProps`, and `DirectorySearchValue` contracts remain present.

## Browser runtime limitation

The Playwright suite was attempted once after the fresh Storybook build. All 16 cases stopped before page/application execution with the same environment error:

```text
browserType.launch: Executable doesn't exist at
/root/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell
```

No browser case is claimed as runtime-passing in this environment.

An explicit JavaScript-disabled end-to-end flow cannot be truthfully exercised by the current Playwright configuration: the configured server is only Python serving the client-rendered Storybook static iframe, so disabling JavaScript prevents the story (and therefore the form) from being rendered, and there is no production `/directorio` application/router endpoint to receive and render the resulting request. The authored native-GET case verifies the browser-generated request and canonical form fields after Storybook has rendered with JavaScript; full JavaScript-disabled navigation remains a production-host/CI integration test.

## React quality review

- New Storybook imports are direct source imports; the server-safe production form/state boundary remains guarded by the passing server-boundary contracts.
- The `popstate` listener is installed once and removed with the identical handler. Existing form listeners and request cleanup remain unchanged and covered.
- Derived confirmed state depends on the primitive canonical search string; the fallback object is hoisted at module scope.
- State setters use direct values only when independent of prior state; existing increment/navigation updates retain functional forms where required.
- The shared loader callback depends only on `loader` and `offline`. No additional global listener, request waterfall, or render-time state mirroring was introduced.

## Follow-up whole-branch re-review

The follow-up review identified two additional integration gaps after commit `a5c2ff3`:

- In the documented `DirectorySearchForm` + `DirectorySearchSuggestions` composition, selecting a category could succeed visually while no named category control existed for the eventual GET.
- Validated public `image` and `metadata` fields were not rendered even though the contract and CSS reserved that presentation.

### Follow-up strict RED evidence

Tests were added first to the real form composition and optional-field rendering surface, then run with:

```text
../../node_modules/.bin/vitest run --project unit \
  src/patterns/directory/search/directory-search-suggestions.test.tsx
```

Observed RED before production edits:

```text
Test Files  1 failed (1)
Tests       5 failed | 14 passed (19)
```

Requirement-specific failures:

- the actual default form contained no category control (`expected [] to deeply equal ['']` in the initial test form, later refined to require a disabled owned control so an empty value is not successful);
- custom `topic` selection produced no successful value (`expected [] to deeply equal ['food']`);
- meaningful image alt could not be found because no image was rendered;
- decorative empty-alt image could not be found because no image was rendered;
- the stable `.vr-directory-suggestions__option-content` region was absent for long optional content.

Focused GREEN after the minimal production changes:

```text
Test Files  1 passed (1)
Tests       19 passed (19)
```

The actual-composition regression now proves:

- a missing category control is created by the client enhancement, starts disabled so an unselected category does not add `category=` to GET data, and becomes the single successful `category=food` control after selection;
- a custom `{ query: "search", category: "topic" }` mapping submits only `topic=food`;
- an existing uncontrolled category input is updated from `services` to `food` without adding a duplicate successful control.

The optional rendering tests prove:

- a nonempty contract alt creates a meaningfully named image;
- an empty alt remains decorative and is excluded from the accessibility tree;
- omitted image/metadata fields create no empty presentation nodes;
- image, title, description, and metadata remain inside one bounded option layout for long content;
- the prior malformed optional-field test still converts invalid provider data to `INVALID_DIRECTORY_SUGGESTIONS` before React render.

### Follow-up implementation notes

- The owned category input is created only after the client control is associated with a form, is cleaned up by its effect, reacts to the primitive custom category name, and is skipped when any host category control already exists.
- Selection now emits/closes only after the category/location form update succeeds.
- Suggestion images render through the existing direct `Media` implementation. This preserves its stable `MediaFrame`, native-image failure fallback, and exact meaningful/decorative alt behavior without importing Next.js, adding an adapter prop, or changing the public serializable contract.
- Metadata and description remain informative option text. Semantic classes use `min-inline-size: 0` and `overflow-wrap: anywhere`; the media frame stays a fixed `2.5rem` square.
- The long-content story and authored 200% text-sizing browser case now include metadata and assert a square media frame.

### Follow-up verification evidence

Fresh checks after the follow-up changes:

- Focused suggestion integration/render suite: 1 file, 19/19 tests passed.
- Full unit suite: 21 files, 104/104 tests passed.
- Script contracts: 12/12 passed, including server/client boundaries and CSS ownership.
- Filtered a11y suite: 9 files and 10 tests passed; 12 files/94 tests were skipped by the required `accessib|violations` filter.
- Typecheck: `tsc -p tsconfig.json --noEmit` exited 0.
- Build: `tsc -p tsconfig.build.json` exited 0.
- Storybook production build completed successfully with the same non-fatal settings-file and bundle-size warnings already documented.
- Stylelint exited 0.
- CSS audit: 0 violations across 146 files.
- Search CSS: 5.11 KB raw, 1.22 KB gzip, within the 3.00 KB gzip budget.
- Global CSS after the fresh Storybook build: 92.08 KB raw, 14.41 KB gzip, within the 30.00 KB gzip budget.
- Playwright discovery listed all 16 directory-search cases and exited 0. Runtime was not retried; the previously confirmed missing-Chromium blocker is unchanged, and no browser pass is claimed.
- `git diff --check` and `git diff --check origin/main` emitted no whitespace errors.
- Public compatibility inspection found no change to `DirectorySearch`, `DirectorySearchProps`, `DirectorySearchValue`, `DirectorySearchForm`, package exports, or the server-safe state/form files.

React quality review for the follow-up: the new media import is a direct file import; the category effect depends on the primitive `names.category`, installs no listener, and removes only the node it owns; existing form listeners retain symmetric cleanup; no new render-time state mirroring, callback dependency, production dependency, or server/client boundary crossing was introduced.

## Final integration rerender correction

The last re-review found that the form-rendered initial category used React's controlled `value`. `DirectorySearchSuggestions` could update the DOM value, but an unrelated parent rerender reconciled the original value back into that successful control.

### RED and hypothesis evidence

An actual composed-form test starts at `category=food`, selects the `services` suggestion, triggers an unrelated parent state update, and reads the same form through `FormData`.

Focused command:

```text
../../node_modules/.bin/vitest run --project unit \
  src/patterns/directory/search/directory-search-form.test.tsx \
  src/patterns/directory/search/directory-search-suggestions.test.tsx
```

Observed RED before the fix:

```text
Test Files  1 failed | 1 passed (2)
Tests       1 failed | 21 passed (22)
expected ['food'] to deeply equal ['services']
```

The first minimal hypothesis—changing the hidden input from `value` to `defaultValue` while retaining `type="hidden"`—was run and produced the same failure. Native hidden inputs do not retain a dirty live value when React updates their default value. This failed attempt was not retained.

The successful minimal implementation uses an uncontrolled text input with the HTML `hidden` attribute. It remains absent from layout, focus order, and the accessibility tree; remains a successful named native-GET control; and uses standard uncontrolled text-input dirty-value semantics so subsequent default-value reconciliation does not replace the selected live value.

Focused GREEN:

```text
Test Files  2 passed (2)
Tests       22 passed (22)
```

The focused run also re-proves that the no-initial-category owned control, custom `search`/`topic` names, and existing-control no-duplicate behavior remain passing.

### Final integration verification

- Full unit suite: 21 files, 105/105 tests passed.
- Script contracts: 12/12 passed.
- Filtered a11y suite: 9 files and 10 tests passed; 12 files/95 tests were skipped by the required filter.
- Typecheck and declaration build exited 0.
- Storybook production build completed successfully with the previously documented non-fatal settings and bundle-size warnings.
- Stylelint exited 0; CSS audit reported 0 violations across 146 files.
- Search CSS remains 5.11 KB raw / 1.22 KB gzip against 3.00 KB; global CSS remains 92.08 KB raw / 14.41 KB gzip against 30.00 KB.
- Playwright discovery listed all 16 cases and exited 0. Runtime remains blocked by the previously confirmed missing Chromium executable and was not represented as passing.
- Server-boundary contracts: 2/2 passed; the form remains server-safe and imports the submit button directly.
- `git diff --check` and `git diff --check origin/main` emitted no errors. The implementation delta is one form attribute change plus its actual-component regression; public props, names, exports, and client coordination remain unchanged.

React review: the fix adds no state, effect, callback, listener, import, or client directive to `DirectorySearchForm`. The initial value remains server-renderable and the mutable selected value stays owned by the native form control, matching the existing uncontrolled query/location behavior.
