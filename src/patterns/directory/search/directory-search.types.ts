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
