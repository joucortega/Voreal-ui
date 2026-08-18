import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { NextButton, NextIconButton } from "../../components/actions";
import { Heart, X } from "../../icons";
import {
  NextDirectoryBusinessCard,
  NextDirectoryCardGrid,
  NextDirectoryEmpty,
  NextDirectoryError,
  NextDirectoryFilterDrawer,
  NextDirectoryFilterPanel,
  NextDirectoryHeader,
  NextDirectoryLayout,
  NextDirectoryLoading,
  NextDirectoryPagination,
  NextDirectoryResultsHeader,
  NextDirectorySearchForm,
} from "./index";
import type {
  NextActiveFilter,
  NextDirectoryBusiness,
  NextDirectoryFilterValue,
  NextDirectorySort,
  VorealNextLinkProps,
} from "./directory.types";

const BUSINESS_IMAGES = "./voreal-next/directory";

const mobile375Viewport = {
  name: "Directory reference mobile 375",
  styles: { height: "812px", width: "375px" },
  type: "mobile" as const,
};

const tablet768Viewport = {
  name: "Directory reference tablet 768",
  styles: { height: "1024px", width: "768px" },
  type: "tablet" as const,
};

const businesses: readonly NextDirectoryBusiness[] = [
  {
    id: "martinez-tax",
    name: "Martínez Tax Services",
    category: "Impuestos y contabilidad",
    description: "Atención bilingüe para familias y pequeñas empresas. Declaraciones, contabilidad y asesoría confiable durante todo el año.",
    location: "Dundalk, MD",
    distance: "4.2 mi",
    rating: 4.8,
    reviewCount: 96,
    status: { kind: "open", label: "Abierto ahora" },
    verified: true,
    href: "/negocios/martinez-tax",
    image: { alt: "Preparación de documentos contables en Martínez Tax Services", height: 640, src: `${BUSINESS_IMAGES}/martinez-tax.webp`, width: 960 },
  },
  {
    id: "luna-beauty",
    name: "Luna Beauty Studio",
    category: "Belleza y bienestar",
    description: "Color, cortes y tratamientos personalizados para cada estilo. Atención cálida disponible en español e inglés.",
    location: "Essex, MD",
    distance: "6.1 mi",
    rating: 4.7,
    reviewCount: 67,
    status: { kind: "closing", label: "Cierra a las 6" },
    verified: true,
    href: "/negocios/luna-beauty",
    image: { alt: "Interior luminoso de Luna Beauty Studio", height: 640, src: `${BUSINESS_IMAGES}/luna-beauty.webp`, width: 960 },
  },
  {
    id: "sabores-mi-tierra",
    name: "Sabores de Mi Tierra",
    category: "Restaurante latino",
    description: "Cocina latina auténtica con ingredientes frescos. Recetas familiares servidas en un ambiente acogedor.",
    location: "Highlandtown, Baltimore",
    distance: "1.8 mi",
    rating: 4.9,
    reviewCount: 184,
    status: { kind: "open", label: "Abierto ahora" },
    verified: true,
    href: "/negocios/sabores-mi-tierra",
    image: { alt: "Comedor colorido de Sabores de Mi Tierra", height: 640, src: `${BUSINESS_IMAGES}/sabores-mi-tierra.webp`, width: 960 },
  },
  {
    id: "centro-integral",
    name: "Centro Integral",
    category: "Servicios profesionales",
    description: "Acompañamiento profesional para familias y pequeños negocios. Servicios coordinados con atención clara y cercana.",
    location: "Silver Spring, MD",
    distance: "28 mi",
    status: { kind: "closed", label: "Con cita" },
    verified: true,
    href: "/negocios/centro-integral",
    image: { alt: "Equipo profesional de Centro Integral", height: 640, src: `${BUSINESS_IMAGES}/centro-integral.webp`, width: 960 },
  },
  {
    id: "baltimore-auto",
    name: "Baltimore Auto Latino",
    category: "Reparación de autos",
    description: "Diagnóstico y reparación confiable para tu automóvil. Servicio bilingüe con estimados transparentes.",
    location: "Rosedale, MD",
    distance: "7.4 mi",
    rating: 4.6,
    reviewCount: 42,
    status: { kind: "open", label: "Abierto ahora" },
    href: "/negocios/baltimore-auto",
    image: { alt: "Mecánico trabajando en Baltimore Auto Latino", height: 640, src: `${BUSINESS_IMAGES}/baltimore-auto.webp`, width: 960 },
  },
  {
    id: "panaderia-esperanza",
    name: "Panadería La Esperanza",
    category: "Panadería",
    description: "Pan y pasteles artesanales horneados diariamente. Sabores tradicionales para compartir en familia.",
    location: "Patterson Park, Baltimore",
    distance: "2.3 mi",
    rating: 4.9,
    reviewCount: 121,
    status: { kind: "closing", label: "Cierra a las 7" },
    verified: true,
    href: "/negocios/panaderia-esperanza",
    image: { alt: "Vitrina de panes de Panadería La Esperanza", height: 640, src: `${BUSINESS_IMAGES}/panaderia-esperanza.webp`, width: 960 },
  },
];

const categories = [
  { count: 86, label: "Restaurantes", value: "restaurants" },
  { count: 42, label: "Impuestos y contabilidad", value: "tax" },
  { count: 28, label: "Belleza y bienestar", value: "beauty" },
  { count: 24, label: "Servicios profesionales", value: "professional" },
  { count: 16, label: "Reparación de autos", value: "auto" },
] as const;

const languages = [
  { count: 72, label: "Español", value: "spanish" },
  { count: 58, label: "Inglés", value: "english" },
  { count: 81, label: "Bilingüe", value: "bilingual" },
] as const;

const INITIAL_FILTER_VALUE: NextDirectoryFilterValue = {
  categories: ["restaurants"],
  languages: [],
  openNow: true,
  postalCode: "",
  radius: "25",
  verifiedOnly: false,
};

type ReferenceMode = "cards" | "loading" | "empty" | "error" | "long" | "missing";
type DirectoryReferenceStoryProps = { mode?: ReferenceMode };

function getFilters(value: NextDirectoryFilterValue, radiusActive: boolean): readonly NextActiveFilter[] {
  const selectedCategories = value.categories.map((category) => ({
    id: `category-${category}`,
    label: categories.find((option) => option.value === category)?.label ?? category,
  }));
  const selectedLanguages = value.languages.map((language) => ({
    id: `language-${language}`,
    label: languages.find((option) => option.value === language)?.label ?? language,
  }));
  return [
    ...selectedCategories,
    ...(radiusActive ? [{ id: "radius", label: `A ${value.radius} millas` }] : []),
    ...selectedLanguages,
    ...(value.verifiedOnly ? [{ id: "verified", label: "Verificados" }] : []),
    ...(value.openNow ? [{ id: "open", label: "Abierto ahora" }] : []),
  ];
}

function capitalize(value: string) {
  const normalized = value.trim();
  return normalized ? normalized.charAt(0).toLocaleUpperCase("es") + normalized.slice(1) : "Negocios";
}

function withLongContent(items: readonly NextDirectoryBusiness[]): readonly NextDirectoryBusiness[] {
  return items.map((business, index) => index === 0 ? {
    ...business,
    category: "Asesoría tributaria, contabilidad y planificación financiera para familias y negocios",
    description: "Acompañamiento bilingüe para declaraciones personales, pequeñas empresas, trabajadores independientes y organizaciones comunitarias. Explicamos cada paso con lenguaje claro para que puedas tomar decisiones con confianza.",
    location: "Distrito histórico de Dundalk, Baltimore County, Maryland",
    name: "Martínez Tax Services y Centro de Orientación Financiera Comunitaria",
  } : business);
}

function withMissingImages(items: readonly NextDirectoryBusiness[]): readonly NextDirectoryBusiness[] {
  return items.map((business, index) => {
    if (index === 0) return { ...business, image: undefined };
    if (index === 3) return { ...business, image: undefined, rating: undefined, reviewCount: undefined, status: undefined };
    return business;
  });
}

function Brand() {
  return (
    <a aria-label="Voreal, inicio" className="vrn-directory-reference__brand" href="/">
      <img alt="" height="32" src="./voreal-next/brand/voreal-mark.png" width="32" />
      <span>voreal</span>
    </a>
  );
}

function DirectoryReferenceStory({ mode = "cards" }: DirectoryReferenceStoryProps) {
  const [filterValue, setFilterValue] = useState<NextDirectoryFilterValue>(INITIAL_FILTER_VALUE);
  const [favorites, setFavorites] = useState<readonly string[]>([]);
  const [locationLabel, setLocationLabel] = useState("Baltimore, MD");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [queryLabel, setQueryLabel] = useState("Restaurantes");
  const [radiusActive, setRadiusActive] = useState(true);
  const [sort, setSort] = useState<NextDirectorySort>("relevance");
  const [showError, setShowError] = useState(mode === "error");
  const [showNoResults, setShowNoResults] = useState(mode === "empty");

  const storyBusinesses = useMemo(() => {
    if (mode === "long") return withLongContent(businesses);
    if (mode === "missing") return withMissingImages(businesses);
    return businesses;
  }, [mode]);

  const activeFilters = useMemo(() => getFilters(filterValue, radiusActive), [filterValue, radiusActive]);

  const resultCount = showNoResults || showError ? 0 : Math.max(6, 86 - Math.max(0, activeFilters.length - 1) * 8);

  function updateFilters(nextValue: NextDirectoryFilterValue) {
    if (nextValue.radius !== filterValue.radius) setRadiusActive(true);
    setFilterValue(nextValue);
    setMessage("Resultados actualizados.");
  }

  function clearFilters() {
    setFilterValue({ ...INITIAL_FILTER_VALUE, categories: [], openNow: false });
    setRadiusActive(false);
    setShowNoResults(false);
    setMessage("Filtros eliminados.");
  }

  function removeFilter(id: string) {
    if (id === "radius") setRadiusActive(false);
    setFilterValue((currentValue) => ({
      ...currentValue,
      categories: id.startsWith("category-")
        ? currentValue.categories.filter((category) => `category-${category}` !== id)
        : currentValue.categories,
      languages: id.startsWith("language-")
        ? currentValue.languages.filter((language) => `language-${language}` !== id)
        : currentValue.languages,
      openNow: id === "open" ? false : currentValue.openNow,
      verifiedOnly: id === "verified" ? false : currentValue.verifiedOnly,
    }));
    setMessage("Filtro eliminado.");
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setQueryLabel(capitalize(String(data.get("q") ?? "")));
    setLocationLabel(String(data.get("location") ?? "").trim() || "Tu ubicación");
    setPage(1);
    setMessage("Búsqueda actualizada.");
  }

  function clearSearchField(event: MouseEvent<HTMLButtonElement>, fieldName: "location" | "q") {
    const field = event.currentTarget.form?.elements.namedItem(fieldName);
    if (field instanceof HTMLInputElement) {
      field.value = "";
      field.focus();
      setMessage(fieldName === "q" ? "Búsqueda limpiada." : "Ubicación limpiada.");
    }
  }

  function toggleFavorite(id: string) {
    const isFavorite = favorites.includes(id);
    setFavorites(isFavorite ? favorites.filter((favoriteId) => favoriteId !== id) : [...favorites, id]);
    setMessage(isFavorite ? "Eliminado de favoritos." : "Guardado en favoritos.");
  }

  function PageLink({ href, onClick, ...props }: VorealNextLinkProps) {
    function handleClick(event: MouseEvent<HTMLAnchorElement>) {
      event.preventDefault();
      onClick?.(event);
      const nextPage = Number(new URL(href, "https://voreal.local").searchParams.get("page"));
      if (Number.isSafeInteger(nextPage) && nextPage > 0) {
        setPage(nextPage);
        setMessage(`Página ${nextPage}.`);
      }
    }
    return <a {...props} href={href} onClick={handleClick} />;
  }

  const filters = (
    <NextDirectoryFilterPanel
      categories={categories}
      languages={languages}
      onValueChange={updateFilters}
      value={filterValue}
    />
  );

  const filterDrawer = (
    <NextDirectoryFilterDrawer
      categories={categories}
      languages={languages}
      onApply={() => setMessage("Filtros aplicados.")}
      onClear={clearFilters}
      onValueChange={updateFilters}
      resultCount={resultCount}
      value={filterValue}
    />
  );

  let content;
  if (mode === "loading") {
    content = <NextDirectoryLoading count={6} />;
  } else if (showNoResults) {
    content = (
      <NextDirectoryEmpty
        action={<NextButton onClick={clearFilters}>Limpiar filtros</NextButton>}
        description="Prueba otra categoría, amplía la distancia o cambia la ubicación."
        title="No encontramos negocios"
      />
    );
  } else if (showError) {
    content = (
      <NextDirectoryError
        action={<NextButton onClick={() => { setShowError(false); setMessage("Resultados recuperados."); }}>Intentar de nuevo</NextButton>}
        description="Puedes intentarlo de nuevo sin perder tus filtros."
      />
    );
  } else {
    content = (
      <>
        <NextDirectoryCardGrid>
          {storyBusinesses.map((business) => {
            const favorite = favorites.includes(business.id);
            return (
              <NextDirectoryBusinessCard
                business={business}
                favoriteControl={(
                  <NextIconButton
                    aria-pressed={favorite}
                    className="vrn-directory-reference__favorite"
                    data-favorite={favorite || undefined}
                    label={`${favorite ? "Quitar" : "Guardar"} ${business.name}`}
                    onClick={() => toggleFavorite(business.id)}
                    variant="secondary"
                  >
                    <Heart />
                  </NextIconButton>
                )}
                key={business.id}
              />
            );
          })}
        </NextDirectoryCardGrid>
        <NextDirectoryPagination
          currentPage={page}
          getPageHref={(pageNumber) => `?page=${pageNumber}`}
          LinkComponent={PageLink}
          pageCount={5}
        />
      </>
    );
  }

  return (
    <div className="vrn-directory-reference">
      <NextDirectoryLayout
        filters={filters}
        header={(
          <NextDirectoryHeader
            accountAvatarLabel="MC"
            accountLabel="Mi cuenta"
            brand={<Brand />}
            descriptor="Directorio de negocios latinos"
            navItems={[
              { href: "/para-negocios", label: "Para negocios" },
              { href: "/recursos", label: "Recursos" },
              { href: "/favoritos", icon: <Heart aria-hidden="true" className="vrn-icon" />, label: "Favoritos" },
            ]}
            primaryAction={{ href: "/listar-negocio", label: "Listar mi negocio" }}
          />
        )}
        resultsHeader={(
          <NextDirectoryResultsHeader
            activeFilters={activeFilters}
            locationLabel={locationLabel}
            mobileFilterTrigger={filterDrawer}
            onClearAll={clearFilters}
            onRemoveFilter={removeFilter}
            onSortChange={(value) => { setSort(value); setMessage("Orden actualizado."); }}
            queryLabel={queryLabel}
            resultCount={resultCount}
            sort={sort}
          />
        )}
        search={(
          <NextDirectorySearchForm
            action="/buscar"
            defaultValue={{ location: "Baltimore, MD", query: "restaurantes" }}
            fieldIdPrefix="directory-reference-search"
            locationTrailingAction={(
              <NextIconButton
                className="vrn-directory-search__clear"
                label="Limpiar ubicación"
                onClick={(event) => clearSearchField(event, "location")}
                variant="ghost"
              >
                <X />
              </NextIconButton>
            )}
            onSubmit={submitSearch}
            queryTrailingAction={(
              <NextIconButton
                className="vrn-directory-search__clear"
                label="Limpiar búsqueda"
                onClick={(event) => clearSearchField(event, "q")}
                variant="ghost"
              >
                <X />
              </NextIconButton>
            )}
          />
        )}
      >
        {content}
      </NextDirectoryLayout>
      <p aria-live="polite" className="vrn-directory-reference__message" role="status">{message}</p>
    </div>
  );
}

const meta = {
  title: "Next/Patterns/Directory Reference",
  component: DirectoryReferenceStory,
  globals: { a11y: { manual: true } },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DirectoryReferenceStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = { render: () => <DirectoryReferenceStory /> };
export const Mobile375: Story = {
  globals: { viewport: "directory-reference-mobile-375" },
  parameters: {
    viewport: {
      viewports: { "directory-reference-mobile-375": mobile375Viewport },
    },
  },
  render: () => <DirectoryReferenceStory />,
};
export const Tablet768: Story = {
  globals: { viewport: "directory-reference-tablet-768" },
  parameters: {
    viewport: {
      viewports: { "directory-reference-tablet-768": tablet768Viewport },
    },
  },
  render: () => <DirectoryReferenceStory />,
};
export const Loading: Story = { render: () => <DirectoryReferenceStory mode="loading" /> };
export const NoResults: Story = { render: () => <DirectoryReferenceStory mode="empty" /> };
export const Error: Story = { render: () => <DirectoryReferenceStory mode="error" /> };
export const LongContent: Story = { render: () => <DirectoryReferenceStory mode="long" /> };
export const MissingImage: Story = { render: () => <DirectoryReferenceStory mode="missing" /> };
