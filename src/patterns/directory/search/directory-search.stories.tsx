import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { VorealRoot } from "../../../primitives/voreal-root/voreal-root";
import { DirectorySearchForm } from "./directory-search-form";
import { DirectorySearchSuggestions } from "./directory-search-suggestions";
import { parseDirectorySearchParams, serializeDirectorySearchParams } from "./directory-search-state";
import type { DirectorySearchState, DirectorySuggestionGroup, DirectorySuggestionLoader } from "./directory-search.types";

const suggestionGroups: readonly DirectorySuggestionGroup[] = [
  {
    id: "businesses",
    label: "Negocios",
    items: [
      { id: "sabor-de-casa", type: "business", title: "Sabor de Casa", description: "Restaurante mexicano · Baltimore", href: "/negocios/sabor-de-casa" },
      { id: "tacos-del-barrio", type: "business", title: "Tacos del Barrio", description: "Taquería · Highlandtown", href: "/negocios/tacos-del-barrio" },
    ],
  },
  { id: "categories", label: "Categorías", items: [{ id: "food", type: "category", title: "Restaurantes" }] },
];

const longSuggestionGroups: readonly DirectorySuggestionGroup[] = [{
  id: "businesses",
  label: "Negocios",
  items: [{
    id: "long-business",
    type: "business",
    title: "Centro Comunitario de Servicios Integrales para Familias Latinas, Pequeñas Empresas y Emprendedores del Área Metropolitana de Baltimore",
    description: "East Baltimore, Maryland, Estados Unidos · atención en toda la región metropolitana y comunidades vecinas",
    href: "/negocios/centro-comunitario",
    image: { src: "/centro-comunitario.jpg", alt: "" },
    metadata: "Servicios comunitarios · Español e inglés · Citas y atención sin cita",
  }],
}];

const tacosSuggestionGroups: readonly DirectorySuggestionGroup[] = [{
  ...suggestionGroups[0]!,
  items: [suggestionGroups[0]!.items[1]!],
}];

function waitFor(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    }, { once: true });
  });
}

const loadDemoSuggestions: DirectorySuggestionLoader = async ({ query }, signal) => {
  await waitFor(40, signal);
  if (query === "tacos") return tacosSuggestionGroups;
  return suggestionGroups;
};

const loadEmptySuggestions: DirectorySuggestionLoader = async (_request, signal) => {
  await waitFor(40, signal);
  return [];
};

const loadErrorSuggestions: DirectorySuggestionLoader = async (_request, signal) => {
  await waitFor(40, signal);
  throw { kind: "network", code: "DEMO_NETWORK" };
};

const loadLongSuggestions: DirectorySuggestionLoader = async (_request, signal) => {
  await waitFor(40, signal);
  return longSuggestionGroups;
};

const unconfirmedSearch: DirectorySearchState = {
  query: "",
  location: "Baltimore, MD",
  page: 1,
};

export function getCanonicalConfirmedDirectorySearch(search: string): string {
  const state = parseDirectorySearchParams(new URLSearchParams(search));
  const hasConfirmedCriteria = Boolean(
    state.query || state.location || state.category ||
    (state.sort && state.sort !== "relevance") || state.page !== 1,
  );
  if (!hasConfirmedCriteria) return "";
  const params = serializeDirectorySearchParams(state);
  return `?${params.toString()}`;
}

function SearchHistoryFixture({
  debounceMs,
  loader = loadDemoSuggestions,
  offline = false,
}: {
  debounceMs?: number;
  loader?: DirectorySuggestionLoader;
  offline?: boolean;
}) {
  const [confirmed, setConfirmed] = useState(() => getCanonicalConfirmedDirectorySearch(window.location.search));
  const [selectedHref, setSelectedHref] = useState("");
  const confirmedValue = useMemo(
    () => confirmed ? parseDirectorySearchParams(new URLSearchParams(confirmed)) : unconfirmedSearch,
    [confirmed],
  );
  const usableLoader = useCallback<DirectorySuggestionLoader>(async (request, signal) => {
    if (offline) throw { kind: "offline", code: "OFFLINE" };
    return loader(request, signal);
  }, [loader, offline]);

  useEffect(() => {
    const sync = () => {
      setConfirmed(getCanonicalConfirmedDirectorySearch(window.location.search));
      setSelectedHref("");
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [name, value] of data.entries()) {
      params.set(name, String(value).trim());
    }
    const next = getCanonicalConfirmedDirectorySearch(`?${params.toString()}`);
    window.history.pushState({}, "", `${window.location.pathname}${next}`);
    setConfirmed(next);
    setSelectedHref("");
  };

  return (
    <main className="vr-directory-search-story">
      <DirectorySearchForm
        action="/directorio"
        defaultValue={confirmedValue}
        key={confirmed || "unconfirmed"}
        onSubmit={handleSubmit}
        queryControl={(
          <DirectorySearchSuggestions
            aria-label="¿Qué buscas?"
            debounceMs={debounceMs}
            defaultValue={confirmedValue.query}
            loadSuggestions={usableLoader}
            name="q"
            onNavigate={(href) => setSelectedHref(`href=${href}`)}
          />
        )}
      />
      <output data-testid="confirmed-search">{selectedHref || confirmed || "Sin búsqueda confirmada"}</output>
    </main>
  );
}

function OutOfOrderFixture() {
  const lateResponse = useRef<(() => void) | null>(null);
  const [fastRequestObserved, setFastRequestObserved] = useState(false);
  const [slowRequestObserved, setSlowRequestObserved] = useState(false);
  const loadOutOfOrderSuggestions = useCallback<DirectorySuggestionLoader>(({ query }) => {
    if (query === "ta") {
      setSlowRequestObserved(true);
      return new Promise((resolve) => {
        lateResponse.current = () => resolve(suggestionGroups);
      });
    }
    if (query === "tacos") {
      setFastRequestObserved(true);
      return Promise.resolve(tacosSuggestionGroups);
    }
    return Promise.resolve(suggestionGroups);
  }, []);

  return <>
    <SearchHistoryFixture debounceMs={0} loader={loadOutOfOrderSuggestions} />
    <button data-slow-request-observed={slowRequestObserved} data-testid="out-of-order-slow-response" disabled={!fastRequestObserved || !slowRequestObserved} onClick={() => lateResponse.current?.()} type="button">Resolver respuesta lenta</button>
  </>;
}

const mobile375Viewport = {
  name: "Directory mobile 375",
  styles: { height: "812px", width: "375px" },
  type: "mobile" as const,
};

const tablet768Viewport = {
  name: "Directory tablet 768",
  styles: { height: "1024px", width: "768px" },
  type: "tablet" as const,
};

const meta = {
  title: "Patterns/Directory Search",
  component: SearchHistoryFixture,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SearchHistoryFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServerFallback: Story = {
  render: () => <DirectorySearchForm action="/directorio" defaultValue={{ location: "Baltimore, MD", page: 1 }} />,
};

export const ProgressiveSuggestions: Story = {};
export const Empty: Story = { args: { loader: loadEmptySuggestions } };
export const Error: Story = { args: { loader: loadErrorSuggestions } };
export const Offline: Story = { args: { offline: true } };
export const LongContent: Story = { args: { loader: loadLongSuggestions } };
export const OutOfOrderResponses: Story = { render: () => <OutOfOrderFixture /> };
export const Compact: Story = {
  render: () => <VorealRoot density="compact" theme="red-latina"><SearchHistoryFixture /></VorealRoot>,
};
export const Mobile375: Story = {
  parameters: {
    viewport: {
      defaultViewport: "directory-mobile-375",
      viewports: { "directory-mobile-375": mobile375Viewport },
    },
  },
};
export const Tablet768: Story = {
  parameters: {
    viewport: {
      defaultViewport: "directory-tablet-768",
      viewports: { "directory-tablet-768": tablet768Viewport },
    },
  },
};
