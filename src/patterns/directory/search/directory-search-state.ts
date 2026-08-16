import type {
  DirectorySearchError,
  DirectorySearchParamNames,
  DirectorySearchSort,
  DirectorySearchState,
  DirectorySuggestion,
  DirectorySuggestionGroup,
} from "./directory-search.types";

export const defaultDirectorySearchParamNames: DirectorySearchParamNames = {
  query: "q",
  location: "location",
  category: "category",
  sort: "sort",
  page: "page",
};

const sorts: readonly DirectorySearchSort[] = ["relevance", "rating", "distance", "newest"];
const isSort = (value: string): value is DirectorySearchSort => sorts.includes(value as DirectorySearchSort);

const positivePage = (value: number): number => Number.isFinite(value) && Math.trunc(value) >= 1 ? Math.trunc(value) : 1;

export function parseDirectorySearchParams(
  params: URLSearchParams,
  names: DirectorySearchParamNames = defaultDirectorySearchParamNames,
): DirectorySearchState {
  const query = params.get(names.query)?.trim() ?? "";
  const location = params.get(names.location)?.trim() ?? "";
  const category = params.get(names.category)?.trim() || undefined;
  const sortValue = params.get(names.sort)?.trim() ?? "";
  const pageValue = Number(params.get(names.page));
  return {
    query,
    location,
    ...(category ? { category } : {}),
    ...(isSort(sortValue) ? { sort: sortValue } : {}),
    page: positivePage(pageValue),
  };
}

export function normalizeDirectorySearchValue(
  value: DirectorySearchState,
  previous?: DirectorySearchState,
): DirectorySearchState {
  const normalized: DirectorySearchState = {
    query: value.query.trim(),
    location: value.location.trim(),
    ...(value.category?.trim() ? { category: value.category.trim() } : {}),
    ...(value.sort && isSort(value.sort) ? { sort: value.sort } : {}),
    page: positivePage(value.page),
  };
  if (previous && (normalized.query !== previous.query.trim() || normalized.location !== previous.location.trim() ||
    normalized.category !== (previous.category?.trim() || undefined) ||
    (normalized.sort ?? "relevance") !== (previous.sort ?? "relevance"))) {
    normalized.page = 1;
  }
  return normalized;
}

export function serializeDirectorySearchParams(
  value: DirectorySearchState,
  options: { source?: URLSearchParams; names?: DirectorySearchParamNames } = {},
): URLSearchParams {
  const names = options.names ?? defaultDirectorySearchParamNames;
  const output = new URLSearchParams(options.source);
  output.set(names.query, value.query.trim());
  output.set(names.location, value.location.trim());
  if (value.category?.trim()) output.set(names.category, value.category.trim());
  else output.delete(names.category);
  const sort = value.sort && isSort(value.sort) ? value.sort : "relevance";
  if (sort === "relevance") output.delete(names.sort);
  else output.set(names.sort, sort);
  const page = positivePage(value.page);
  if (page === 1) output.delete(names.page);
  else output.set(names.page, String(page));
  return output;
}

class InvalidDirectorySuggestionsError extends Error {
  readonly code = "INVALID_DIRECTORY_SUGGESTIONS";
  constructor() {
    super("INVALID_DIRECTORY_SUGGESTIONS");
    this.name = "InvalidDirectorySuggestionsError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonblankString(value: unknown): value is string {
  return typeof value === "string" && Boolean(value.trim());
}

function isValidSuggestion(value: unknown): value is DirectorySuggestion {
  if (!isRecord(value) || !isNonblankString(value.id) || !isNonblankString(value.title)) return false;
  if (value.type !== "business" && value.type !== "category" && value.type !== "location") return false;
  if (value.description !== undefined && typeof value.description !== "string") return false;
  if (value.href !== undefined && typeof value.href !== "string") return false;
  if (value.metadata !== undefined && typeof value.metadata !== "string") return false;
  if (value.image !== undefined && (
    !isRecord(value.image) || !isNonblankString(value.image.src) || typeof value.image.alt !== "string"
  )) return false;
  return value.type !== "business" || isNonblankString(value.href);
}

export function normalizeDirectorySuggestionGroups(payload: unknown): DirectorySuggestionGroup[] {
  if (!Array.isArray(payload)) throw new InvalidDirectorySuggestionsError();
  if (payload.length === 0) return [];
  const groups = payload.flatMap((group) => {
    if (!isRecord(group) || !isNonblankString(group.id) || !isNonblankString(group.label) || !Array.isArray(group.items)) return [];
    const items = group.items.filter(isValidSuggestion);
    return items.length ? [{ id: group.id, label: group.label, items }] : [];
  });
  if (groups.length === 0) throw new InvalidDirectorySuggestionsError();
  return groups;
}

export function normalizeDirectorySearchError(error: unknown): DirectorySearchError {
  if (error instanceof InvalidDirectorySuggestionsError || (error && typeof error === "object" && "code" in error && error.code === "INVALID_DIRECTORY_SUGGESTIONS")) {
    return { kind: "invalid-response", code: "INVALID_DIRECTORY_SUGGESTIONS" };
  }
  if (error && typeof error === "object" && "kind" in error &&
    (error.kind === "offline" || error.kind === "network" || error.kind === "invalid-response" || error.kind === "unknown")) {
    const code = "code" in error && typeof error.code === "string" ? error.code : undefined;
    return code ? { kind: error.kind, code } : { kind: error.kind };
  }
  return { kind: "unknown" };
}
