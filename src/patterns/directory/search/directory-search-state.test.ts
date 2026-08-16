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

  it("does not reset page when relevance is omitted versus explicit", () => {
    const previous = { query: "tacos", location: "21222", page: 4 } as const;
    expect(normalizeDirectorySearchValue({ ...previous, sort: "relevance" }, previous).page).toBe(4);
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

  it("rejects malformed suggestion groups with the internal validation error", () => {
    expect(() => normalizeDirectorySuggestionGroups([{} as never])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
    expect(() => normalizeDirectorySuggestionGroups([{ id: "businesses", label: "Negocios", items: "bad" } as never]))
      .toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
  });

  it("rejects non-array suggestion payloads instead of treating them as empty", () => {
    for (const payload of [null, undefined, {}, "", { items: [] }]) {
      expect(() => normalizeDirectorySuggestionGroups(payload as never)).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
    }
  });

  it("drops groups whose id or label is not a nonblank string", () => {
    const validItem = { id: "food", type: "category" as const, title: "Restaurantes" };
    expect(() => normalizeDirectorySuggestionGroups([
      { id: " ", label: "Categorías", items: [validItem] },
      { id: "categories", label: "\t", items: [validItem] },
      { id: 1, label: "Categorías", items: [validItem] } as never,
    ])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
  });

  it("drops malformed entries before returning data to React", () => {
    expect(normalizeDirectorySuggestionGroups([{
      id: "businesses",
      label: "Negocios",
      items: [
        { id: "valid", type: "business", title: "Sabor de Casa", description: "Restaurante", href: "/negocios/sabor" },
        { id: "bad-description", type: "business", title: "Objeto", description: { secret: true }, href: "/negocios/objeto" },
        { id: "bad-metadata", type: "category", title: "Comida", metadata: 42 },
        { id: "bad-image", type: "location", title: "Centro", image: { src: 9, alt: "Centro" } },
        { id: " ", type: "location", title: "Centro" },
        { id: "blank-title", type: "location", title: "  " },
      ],
    } as never])).toEqual([{
      id: "businesses",
      label: "Negocios",
      items: [
        { id: "valid", type: "business", title: "Sabor de Casa", description: "Restaurante", href: "/negocios/sabor" },
      ],
    }]);
  });

  it("rejects a non-empty payload when optional-field validation drops every entry", () => {
    expect(() => normalizeDirectorySuggestionGroups([{
      id: "businesses",
      label: "Negocios",
      items: [{ id: "bad", type: "business", title: "Objeto", description: { secret: true }, href: "/negocios/objeto" }],
    } as never])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
  });

  it("rejects suggestion items with malformed primitive fields", () => {
    expect(() => normalizeDirectorySuggestionGroups([{
      id: "categories", label: "Categorías", items: [{ id: 1, type: "category", title: "Comida" }],
    } as never])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
    expect(() => normalizeDirectorySuggestionGroups([{
      id: "businesses", label: "Negocios", items: [{ id: "one", type: "business", title: "Casa", href: 1 }],
    } as never])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
    expect(() => normalizeDirectorySuggestionGroups([{
      id: "locations", label: "Lugares", items: [{ id: "one", type: "location", title: 1 }],
    } as never])).toThrowError("INVALID_DIRECTORY_SUGGESTIONS");
  });

  it("normalizes offline and unknown failures without exposing messages", () => {
    expect(normalizeDirectorySearchError({ kind: "offline", code: "OFFLINE" })).toEqual({ kind: "offline", code: "OFFLINE" });
    expect(normalizeDirectorySearchError(new Error("private provider detail"))).toEqual({ kind: "unknown" });
  });
});
