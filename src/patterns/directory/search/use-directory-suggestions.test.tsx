import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { DirectorySearchEvent, DirectorySuggestionGroup, DirectorySuggestionLoader } from "./directory-search.types";
import { useDirectorySuggestions } from "./use-directory-suggestions";

const suggestionGroups: readonly DirectorySuggestionGroup[] = [{
  id: "businesses",
  label: "Negocios",
  items: [{ id: "taco-luz", type: "business", title: "Taco Luz", href: "/negocios/taco-luz" }],
}];

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", { configurable: true, value });
}

beforeEach(() => {
  vi.useFakeTimers();
  setOnline(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it("debounces, aborts the previous request, and ignores stale results", async () => {
  const resolvers: Array<(groups: readonly DirectorySuggestionGroup[]) => void> = [];
  const signals: AbortSignal[] = [];
  const loadSuggestions = vi.fn((_request, signal: AbortSignal) => {
    signals.push(signal);
    return new Promise<readonly DirectorySuggestionGroup[]>((resolve) => resolvers.push(resolve));
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

it("stays idle when the query is shorter than the minimum", async () => {
  const loadSuggestions = vi.fn();
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "t", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current.status).toBe("idle");
  expect(loadSuggestions).not.toHaveBeenCalled();
});

it("reports offline without calling the loader", () => {
  setOnline(false);
  const loadSuggestions = vi.fn();
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  expect(result.current.status).toBe("offline");
  expect(loadSuggestions).not.toHaveBeenCalled();
});

it("reports empty after a normalized empty response", async () => {
  const loadSuggestions = vi.fn().mockResolvedValue([]);
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current).toMatchObject({ status: "empty", groups: [], error: undefined });
});

it("reports a normalized offline rejection", async () => {
  const loadSuggestions = vi.fn().mockRejectedValue({ kind: "offline", code: "OFFLINE" });
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current).toMatchObject({ status: "offline", error: { kind: "offline", code: "OFFLINE" } });
});

it("reports non-offline rejections as errors", async () => {
  const loadSuggestions = vi.fn().mockRejectedValue({ kind: "network", code: "NETWORK" });
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current).toMatchObject({ status: "error", error: { kind: "network", code: "NETWORK" } });
});

it("normalizes a synchronous loader throw as an error", async () => {
  const loadSuggestions: DirectorySuggestionLoader = vi.fn(() => {
    throw new Error("provider failed synchronously");
  });
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current).toMatchObject({ status: "error", error: { kind: "unknown" } });
});

it("aborts in-flight work when closed or unmounted", async () => {
  const signals: AbortSignal[] = [];
  const events: DirectorySearchEvent[] = [];
  const loadSuggestions = vi.fn((_request, signal: AbortSignal) => {
    signals.push(signal);
    return new Promise<readonly DirectorySuggestionGroup[]>(() => undefined);
  });
  const { rerender, result, unmount } = renderHook(
    ({ open }) => useDirectorySuggestions({
      loadSuggestions,
      onSearchEvent: (event) => events.push(event),
      open,
      request: { query: "tacos", location: "21222" },
    }),
    { initialProps: { open: true } },
  );

  await act(() => vi.advanceTimersByTimeAsync(200));
  rerender({ open: false });
  expect(signals[0]?.aborted).toBe(true);
  expect(result.current.status).toBe("idle");
  expect(events).toContainEqual(expect.objectContaining({ type: "suggestions_cancelled", reason: "closed" }));

  rerender({ open: true });
  await act(() => vi.advanceTimersByTimeAsync(200));
  unmount();
  expect(signals[1]?.aborted).toBe(true);
  expect(events).toContainEqual(expect.objectContaining({ type: "suggestions_cancelled", reason: "unmounted" }));
});

it("emits cancellation reasons without exposing cancellation as an error", async () => {
  const events: DirectorySearchEvent[] = [];
  const loadSuggestions = vi.fn(() => new Promise<readonly DirectorySuggestionGroup[]>(() => undefined));
  const { rerender, result } = renderHook(
    ({ query }) => useDirectorySuggestions({
      loadSuggestions,
      onSearchEvent: (event) => events.push(event),
      open: true,
      request: { query, location: "21222" },
    }),
    { initialProps: { query: "tacos" } },
  );

  await act(() => vi.advanceTimersByTimeAsync(200));
  rerender({ query: "arepas" });
  await act(() => vi.advanceTimersByTimeAsync(200));
  rerender({ query: "a" });

  expect(result.current.status).toBe("idle");
  expect(result.current.error).toBeUndefined();
  expect(events).toContainEqual(expect.objectContaining({ type: "suggestions_cancelled", reason: "superseded" }));
  expect(events).toContainEqual(expect.objectContaining({ type: "suggestions_cancelled", reason: "below-minimum" }));
});

it("emits one cancellation event for an aborted request", async () => {
  const events: DirectorySearchEvent[] = [];
  const loadSuggestions = vi.fn(() => new Promise<readonly DirectorySuggestionGroup[]>(() => undefined));
  const { rerender, unmount } = renderHook(
    ({ open }) => useDirectorySuggestions({
      loadSuggestions,
      onSearchEvent: (event) => events.push(event),
      open,
      request: { query: "tacos", location: "21222" },
    }),
    { initialProps: { open: true } },
  );

  await act(() => vi.advanceTimersByTimeAsync(200));
  rerender({ open: false });
  unmount();

  expect(events.filter((event) => event.type === "suggestions_cancelled")).toEqual([
    expect.objectContaining({ reason: "closed" }),
  ]);
});

it("returns normalized groups and success for a non-empty response", async () => {
  const loadSuggestions = vi.fn().mockResolvedValue(suggestionGroups);
  const { result } = renderHook(() => useDirectorySuggestions({
    loadSuggestions,
    open: true,
    request: { query: "tacos", location: "21222" },
  }));

  await act(() => vi.advanceTimersByTimeAsync(200));

  expect(result.current).toMatchObject({ status: "success", groups: suggestionGroups, error: undefined, activeRequestId: 1 });
});

it("does not report a completed request as cancelled when the query changes", async () => {
  const events: DirectorySearchEvent[] = [];
  const loadSuggestions = vi.fn().mockResolvedValue(suggestionGroups);
  const { rerender } = renderHook(
    ({ query }) => useDirectorySuggestions({
      loadSuggestions,
      onSearchEvent: (event) => events.push(event),
      open: true,
      request: { query, location: "21222" },
    }),
    { initialProps: { query: "tacos" } },
  );

  await act(() => vi.advanceTimersByTimeAsync(200));
  rerender({ query: "arepas" });

  expect(events.filter((event) => event.type === "suggestions_cancelled")).toEqual([]);
});
