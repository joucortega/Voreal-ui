# Task 1 report: directory search state contracts

## Implementation

- Added the server-safe directory search contracts, including URL state, suggestion data, loader, navigation, error, and event types.
- Added canonical URL parsing and serialization with parameter allowlisting, trimming, sort validation, page normalization, criteria-change page reset, and unrelated-source parameter preservation.
- Added suggestion-group normalization and safe search-error normalization, including the `INVALID_DIRECTORY_SUGGESTIONS` internal error mapping.
- Kept `DirectorySearchValue` in `src/patterns/directory/types.ts` unchanged.

## TDD evidence

- RED: `pnpm exec vitest ...` could not run because package-manager network approval was unavailable; the existing binary was then invoked and failed as expected because `directory-search-state` did not exist.
- GREEN: focused state suite passed: 1 file, 6 tests.

## Tests and results

- `../../node_modules/.bin/vitest run --project unit src/patterns/directory/search/directory-search-state.test.ts` — PASS (1 file, 6 tests).
- `../../node_modules/.bin/tsc -p tsconfig.json --noEmit` — PASS.
- `../../node_modules/.bin/vitest run --project unit && node --test scripts/*.test.mjs` — PASS (17 Vitest files, 61 tests; 3 Node tests).

## Files changed

- `src/patterns/directory/search/directory-search.types.ts`
- `src/patterns/directory/search/directory-search-state.ts`
- `src/patterns/directory/search/directory-search-state.test.ts`
- `.superpowers/sdd/2026-08-16-voreal-public-directory-search/task-1-report.md`

## Self-review and concerns

The implementation is limited to the requested contracts and state helpers, uses only `URLSearchParams`, and passes typecheck and the full existing suite. No known concerns remain. The package-manager invocation required the pre-existing local Vitest binary because network setup approval was unavailable.

## Review follow-up

- Added malformed-group regression coverage and canonical relevance page-reset coverage.
- Hardened runtime group/item validation so malformed non-empty payloads produce `INVALID_DIRECTORY_SUGGESTIONS`, and compared effective sort defaults during criteria-change detection.
- Follow-up commit: `4a10593 fix: harden directory search state normalization`.
- Follow-up verification: focused suite PASS (1 file, 8 tests); `tsc -p tsconfig.json --noEmit` PASS; full suite PASS (17 Vitest files, 63 tests; 3 Node tests).

## Review follow-up 2

- Added regression coverage for wrong primitive types in required and type-specific suggestion fields.
- Added runtime string validation before trimming IDs, titles, or business hrefs.
- Commit: `0406d00 fix: validate directory suggestion field types`.
- Verification: focused suite PASS (1 file, 9 tests); typecheck PASS; full suite PASS (17 Vitest files, 64 tests; 3 Node tests).
