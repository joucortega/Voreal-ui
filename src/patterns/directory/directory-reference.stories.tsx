import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { ActionRail, Button } from "../../components/button";
import { EmptyState, Skeleton } from "../../components/feedback";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "../../components/overlay";
import { BuildingIcon, HeartIcon, LocateFixedIcon, SparklesIcon, UtensilsIcon } from "../../icons";
import { AdSlot } from "./ad-slot";
import { BusinessCard } from "./business-card";
import { BusinessContact } from "./business-contact";
import { BusinessGallery } from "./business-gallery";
import { BusinessHours } from "./business-hours";
import { CategoryScroller } from "./category-scroller";
import { ClaimBusinessCta } from "./claim-business-cta";
import { DirectorySearch } from "./directory-search";
import { FilterPanel } from "./filter-panel";
import { LocationCard } from "./location-card";
import { PromotionCard } from "./promotion-card";
import type { BusinessSummary, DirectoryFilter, DirectorySearchValue } from "./types";

const businesses: BusinessSummary[] = [
  {
    category: "Restaurante mexicano",
    description: "Recetas familiares, tortillas hechas a mano y un ambiente donde toda la comunidad se siente en casa.",
    href: "/negocios/sabor-de-casa",
    id: "sabor-de-casa",
    image: { alt: "Comida mexicana de Sabor de Casa", fallback: "SC", src: "/missing-sabor.jpg" },
    location: "Highlandtown · Baltimore",
    name: "Sabor de Casa",
    rating: 4.9,
    reviewCount: 184,
    status: { label: "Abierto ahora", tone: "success" },
    verified: true,
  },
  {
    category: "Impuestos y contabilidad",
    description: "Atención bilingüe para familias, trabajadores independientes y pequeños negocios.",
    href: "/negocios/martinez-tax-services",
    id: "martinez-tax",
    image: { alt: "Oficina de Martínez Tax Services", fallback: "MT" },
    location: "Dundalk · Maryland",
    name: "Martínez Tax Services",
    rating: 4.8,
    reviewCount: 96,
    status: { label: "Cierra a las 6", tone: "warning" },
  },
  {
    category: "Belleza y bienestar",
    description: "Color, cortes y tratamientos personalizados en español e inglés.",
    href: "/negocios/luna-beauty-studio",
    id: "luna-beauty",
    image: { alt: "Interior de Luna Beauty Studio", fallback: "LB" },
    location: "Essex · Maryland",
    name: "Luna Beauty Studio",
    rating: 4.7,
    reviewCount: 67,
    status: { label: "Cerrado", tone: "danger" },
    verified: true,
  },
  {
    category: "Servicios legales y asesoría comunitaria",
    href: "/negocios/centro-integral",
    id: "centro-integral",
    image: { alt: "Equipo del Centro Integral", fallback: "CI" },
    location: "Silver Spring · Maryland",
    name: "Centro Integral de Servicios Profesionales para Familias y Pequeñas Empresas Latinas",
    status: { label: "Con cita", tone: "neutral" },
  },
];

const filters: DirectoryFilter[] = [
  { count: 24, label: "Abierto ahora", value: "open" },
  { count: 31, label: "Verificados", value: "verified" },
  { count: 18, label: "4.5 estrellas o más", value: "top-rated" },
  { count: 9, label: "Con promoción", value: "promotion" },
];

export type DirectoryReferenceProps = {
  loading?: boolean;
  noResults?: boolean;
};

export function DirectoryReference({ loading = false, noResults = false }: DirectoryReferenceProps) {
  const [search, setSearch] = useState<DirectorySearchValue>({ location: "Baltimore, MD", query: "" });
  const [category, setCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [view, setView] = useState("list");
  const visibleBusinesses = useMemo(() => noResults ? [] : businesses, [noResults]);
  const filterFields = <FilterPanel filters={filters} onValueChange={setActiveFilters} value={activeFilters} />;

  return (
    <main className="vr-directory-reference">
      <section className="vr-directory-reference__hero">
        <div className="vr-container">
          <p className="vr-directory-reference__eyebrow">Baltimore habla español</p>
          <h1>Lo mejor de nuestra comunidad, cerca de ti.</h1>
          <p>Descubre restaurantes, profesionales y servicios latinos recomendados por tu comunidad.</p>
          <DirectorySearch onChange={setSearch} onSubmit={() => undefined} value={search} />
        </div>
      </section>

      <div className="vr-container vr-directory-reference__main">
        <CategoryScroller
          categories={[
            { icon: <LocateFixedIcon />, label: "Cerca de mí", value: "all" },
            { icon: <UtensilsIcon />, label: "Restaurantes", value: "food" },
            { icon: <SparklesIcon />, label: "Belleza", value: "beauty" },
            { icon: <BuildingIcon />, label: "Servicios", value: "services" },
            { icon: <HeartIcon />, label: "Salud", value: "health" },
          ]}
          onValueChange={setCategory}
          value={category}
        />

        <div className="vr-directory-reference__toolbar">
          <div>
            <h2>Negocios para ti</h2>
            <p>{visibleBusinesses.length} resultados en Baltimore y alrededores</p>
          </div>
          <div className="vr-directory-reference__toolbar-actions">
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="vr-directory-reference__mobile-filter" variant="outline">Filtros</Button>
              </DrawerTrigger>
              <DrawerContent side="bottom">
                <DrawerTitle>Filtrar negocios</DrawerTitle>
                <DrawerDescription>Combina disponibilidad, verificación y calificación.</DrawerDescription>
                {filterFields}
                <DrawerClose asChild><Button>Ver resultados</Button></DrawerClose>
              </DrawerContent>
            </Drawer>
            <ActionRail
              items={[{ label: "Lista", value: "list" }, { label: "Mapa", value: "map" }]}
              label="Vista de resultados"
              onValueChange={setView}
              value={view}
            />
          </div>
        </div>

        <div className="vr-directory-reference__content">
          <aside className="vr-directory-reference__filters">{filterFields}</aside>
          <section aria-label="Resultados" className="vr-directory-reference__results">
            {loading ? (
              <div className="vr-directory-reference__grid">
                {Array.from({ length: 4 }, (_, index) => <Skeleton aria-label={`Cargando negocio ${index + 1}`} aspectRatio="4 / 5" key={index} width="100%" />)}
              </div>
            ) : visibleBusinesses.length === 0 ? (
              <EmptyState action={<Button>Limpiar filtros</Button>} description="Prueba otra categoría, cambia la ubicación o amplía la distancia." title="No encontramos negocios" />
            ) : view === "map" ? (
              <LocationCard address="Baltimore, Maryland y zonas cercanas" mapLabel="Mapa de resultados en Baltimore" />
            ) : (
              <>
                <div className="vr-directory-reference__grid">
                  {visibleBusinesses.slice(0, 2).map((business, index) => <BusinessCard business={business} key={business.id} variant={index === 0 ? "featured" : "vertical"} />)}
                </div>
                <AdSlot advertiser="Mercado Sol" description="Ingredientes, panadería y productos de nuestros países todos los días." href="/anuncios/mercado-sol" title="Productos latinos cerca de ti" />
                <div className="vr-directory-reference__grid">
                  {visibleBusinesses.slice(2).map((business) => <BusinessCard business={business} key={business.id} variant="vertical" />)}
                </div>
              </>
            )}
          </section>
        </div>

        <PromotionCard promotion={{ description: "Presenta esta oferta antes de ordenar.", eyebrow: "Oferta de la semana", id: "promo-1", title: "10% de descuento en tu primera visita" }} />
        <ClaimBusinessCta businessName="uno de estos negocios" href="/reclamar" />
      </div>
    </main>
  );
}

function BusinessProfileReference() {
  return (
    <main className="vr-container vr-directory-profile-reference">
      <BusinessGallery images={[
        { alt: "Fachada del restaurante", fallback: "SC" },
        { alt: "Tacos preparados", fallback: "T" },
        { alt: "Interior del restaurante", fallback: "I" },
        { alt: "Familia propietaria", fallback: "F" },
      ]} />
      <div className="vr-directory-profile-reference__grid">
        <BusinessHours days={[
          { day: "Lunes", hours: "9:00 a. m. – 8:00 p. m." },
          { day: "Martes", hours: "9:00 a. m. – 8:00 p. m." },
          { day: "Domingo", closed: true },
        ]} />
        <div>
          <BusinessContact
            address="1220 Eastern Avenue, Baltimore, MD 21224"
            directionsHref="/direcciones"
            email="hola@sabordecasa.example"
            phone="410-555-0142"
            website="https://example.com"
          />
          <LocationCard address="1220 Eastern Avenue, Baltimore, MD 21224" directionsHref="/direcciones" />
        </div>
      </div>
      <ClaimBusinessCta businessName="Sabor de Casa" href="/reclamar/sabor-de-casa" />
    </main>
  );
}

const meta = {
  title: "Patterns/Directory Reference",
  component: DirectoryReference,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DirectoryReference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MercadoContemporaneo: Story = {};
export const Loading: Story = { args: { loading: true } };
export const NoResults: Story = { args: { noResults: true } };
export const Mobile375: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
export const Tablet768: Story = { parameters: { viewport: { defaultViewport: "tablet" } } };
export const BusinessProfile: Story = { render: () => <BusinessProfileReference /> };
export const EdgeCases: Story = {
  render: () => (
    <main className="vr-container vr-directory-reference__edge-cases">
      {businesses.slice(1).map((business) => <BusinessCard business={business} key={business.id} variant="vertical" />)}
    </main>
  ),
};
