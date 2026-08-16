"use client";

import { useEffect, useRef, useState } from "react";
import {
  normalizeDirectorySearchError,
  normalizeDirectorySuggestionGroups,
} from "./directory-search-state";
import type {
  DirectorySearchError,
  DirectorySearchEvent,
  DirectorySuggestionGroup,
  DirectorySuggestionLoader,
  DirectorySuggestionRequest,
  DirectorySuggestionType,
} from "./directory-search.types";

export type DirectorySuggestionStatus = "idle" | "loading" | "success" | "empty" | "error" | "offline";

export type UseDirectorySuggestionsOptions = {
  request: DirectorySuggestionRequest;
  loadSuggestions: DirectorySuggestionLoader;
  open: boolean;
  minQueryLength?: number;
  debounceMs?: number;
  onSearchEvent?: (event: DirectorySearchEvent) => void;
};

export type DirectorySuggestionsState = {
  groups: readonly DirectorySuggestionGroup[];
  status: DirectorySuggestionStatus;
  error?: DirectorySearchError;
  activeRequestId?: number;
};

type ActiveRequest = {
  controller: AbortController;
  requestId: number;
  queryLength: number;
};

type CancellationReason = Extract<DirectorySearchEvent, { type: "suggestions_cancelled" }>["reason"];

const initialState: DirectorySuggestionsState = {
  groups: [],
  status: "idle",
  error: undefined,
  activeRequestId: undefined,
};

function isOnline() {
  return typeof navigator === "undefined" || navigator.onLine;
}

function normalizeRequest(request: DirectorySuggestionRequest): DirectorySuggestionRequest {
  const query = request.query.trim();
  const location = request.location.trim();
  const category = request.category?.trim();
  return { query, location, ...(category ? { category } : {}) };
}

export function useDirectorySuggestions({
  request,
  loadSuggestions,
  open,
  minQueryLength = 2,
  debounceMs = 200,
  onSearchEvent,
}: UseDirectorySuggestionsOptions): DirectorySuggestionsState {
  const normalizedRequest = normalizeRequest(request);
  const [state, setState] = useState<DirectorySuggestionsState>(initialState);
  const controllerRef = useRef<AbortController | undefined>(undefined);
  const activeRequestRef = useRef<ActiveRequest | undefined>(undefined);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  const startTimeRef = useRef(0);
  const onSearchEventRef = useRef(onSearchEvent);
  const cancellationReasonRef = useRef<CancellationReason>("superseded");

  onSearchEventRef.current = onSearchEvent;
  cancellationReasonRef.current = !open
    ? "closed"
    : normalizedRequest.query.length < minQueryLength
      ? "below-minimum"
      : "superseded";

  function emit(event: DirectorySearchEvent) {
    onSearchEventRef.current?.(event);
  }

  function cancelActiveRequest(reason: CancellationReason) {
    const activeRequest = activeRequestRef.current;
    if (!activeRequest || activeRequest.controller.signal.aborted) return;

    activeRequest.controller.abort(reason);
    emit({
      type: "suggestions_cancelled",
      queryLength: activeRequest.queryLength,
      online: isOnline(),
      reason,
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancellationReasonRef.current = "unmounted";
      cancelActiveRequest("unmounted");
    };
  }, []);

  useEffect(() => {
    const { query, location, category } = normalizedRequest;
    let controller: AbortController | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!open || query.length < minQueryLength) {
      if (mountedRef.current) setState(initialState);
      return undefined;
    }

    if (!isOnline()) {
      if (mountedRef.current) {
        setState({ groups: [], status: "offline", error: { kind: "offline" }, activeRequestId: undefined });
      }
      return undefined;
    }

    timeout = setTimeout(() => {
      if (!isOnline()) {
        if (mountedRef.current) {
          setState({ groups: [], status: "offline", error: { kind: "offline" }, activeRequestId: undefined });
        }
        return;
      }

      const requestId = ++requestIdRef.current;
      const previousRequest = activeRequestRef.current;
      if (previousRequest && !previousRequest.controller.signal.aborted) {
        cancelActiveRequest("superseded");
      }
      controllerRef.current?.abort("superseded");

      const requestController = new AbortController();
      controller = requestController;
      controllerRef.current = requestController;
      activeRequestRef.current = { controller: requestController, requestId, queryLength: query.length };
      startTimeRef.current = Date.now();
      setState({ status: "loading", groups: [], error: undefined, activeRequestId: requestId });
      emit({ type: "suggestions_requested", queryLength: query.length, online: isOnline() });

      const completeRequest = () => {
        if (activeRequestRef.current?.requestId === requestId) activeRequestRef.current = undefined;
        if (controllerRef.current === requestController) controllerRef.current = undefined;
      };

      Promise.resolve().then(() => loadSuggestions(
        { query, location, ...(category ? { category } : {}) },
        requestController.signal,
      )).then(
        (rawGroups) => {
          if (requestController.signal.aborted || requestId !== requestIdRef.current || !mountedRef.current) return;
          completeRequest();
          try {
            const groups = normalizeDirectorySuggestionGroups(rawGroups);
            const resultCount = groups.reduce((total, group) => total + group.items.length, 0);
            const durationMs = Math.max(0, Date.now() - startTimeRef.current);
            setState({
              status: resultCount > 0 ? "success" : "empty",
              groups,
              error: undefined,
              activeRequestId: requestId,
            });
            if (resultCount > 0) {
              const resultTypes = Array.from(new Set<DirectorySuggestionType>(
                groups.flatMap((group) => group.items.map((item) => item.type)),
              ));
              emit({ type: "suggestions_succeeded", queryLength: query.length, online: isOnline(), durationMs, resultCount, resultTypes });
            } else {
              emit({ type: "suggestions_empty", queryLength: query.length, online: isOnline(), durationMs });
            }
          } catch (cause: unknown) {
            const error = normalizeDirectorySearchError(cause);
            setState({ status: "error", groups: [], error, activeRequestId: requestId });
            emit({
              type: "suggestions_failed",
              queryLength: query.length,
              online: isOnline(),
              durationMs: Math.max(0, Date.now() - startTimeRef.current),
              error,
            });
          }
        },
        (cause: unknown) => {
          if (requestController.signal.aborted || requestId !== requestIdRef.current || !mountedRef.current) return;
          completeRequest();
          const error = normalizeDirectorySearchError(cause);
          setState({ status: error.kind === "offline" ? "offline" : "error", groups: [], error, activeRequestId: requestId });
          emit({
            type: "suggestions_failed",
            queryLength: query.length,
            online: isOnline(),
            durationMs: Math.max(0, Date.now() - startTimeRef.current),
            error,
          });
        },
      );
    }, debounceMs);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (controller && controllerRef.current === controller && !controller.signal.aborted) {
        cancelActiveRequest(cancellationReasonRef.current);
      }
    };
  }, [
    debounceMs,
    loadSuggestions,
    minQueryLength,
    normalizedRequest.category,
    normalizedRequest.location,
    normalizedRequest.query,
    open,
  ]);

  return state;
}
