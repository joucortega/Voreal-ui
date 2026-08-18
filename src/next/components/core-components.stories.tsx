import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import {
  NextActionLink,
  NextButton,
  NextButtonGroup,
  NextIconButton,
} from "./actions";
import { NextAvatar, NextRating, NextReviewSummary } from "./content";
import { NextAlert, NextEmptyState, NextProgress, NextSkeleton } from "./feedback";
import {
  NextCheckbox,
  NextField,
  NextFormSummary,
  NextInput,
  NextInputGroup,
  NextRadioGroup,
  NextSelect,
  NextSwitch,
  NextTextarea,
} from "./forms";
import { NextBreadcrumbs, NextNavigationRail, NextStepper, NextTabs } from "./navigation";
import { NextDialog, NextDialogClose, NextDrawer } from "./overlays";
import { NextBadge, NextTag } from "./status";
import {
  NextCaption,
  NextCluster,
  NextContainer,
  NextDivider,
  NextGrid,
  NextHeading,
  NextSection,
  NextStack,
  NextSurface,
  NextText,
} from "../foundations";
import { Heart, Search, SlidersHorizontal } from "../icons";

const pageStyle: CSSProperties = {
  background: "var(--vrn-color-canvas)",
  minHeight: "100vh",
  paddingBlock: "var(--vrn-space-6)",
};

const atlasGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 25rem), 1fr))",
};

const controlGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
};

function Family({ children, heading, id }: { children: ReactNode; heading: string; id: string }): ReactElement {
  return (
    <NextSection aria-labelledby={id}>
      <NextSurface style={{ height: "100%" }}>
        <NextStack gap="4">
          <NextHeading as="h2" id={id} size="card">{heading}</NextHeading>
          {children}
        </NextStack>
      </NextSurface>
    </NextSection>
  );
}

function ComponentAtlas(): ReactElement {
  const [step, setStep] = useState("review");

  return (
    <main style={pageStyle}>
      <NextContainer data-atlas-foundation="container">
        <NextStack gap="6">
          <header>
            <NextStack gap="2">
              <NextBadge>Entrega 1</NextBadge>
              <NextHeading as="h1" size="page">Atlas del núcleo reusable</NextHeading>
              <NextText tone="muted">Familias públicas reunidas en una composición densa para revisar consistencia y límites responsive.</NextText>
              <NextCaption data-atlas-foundation="caption">Cobertura de fundamentos y siete familias públicas.</NextCaption>
            </NextStack>
          </header>

          <NextDivider data-atlas-foundation="divider" />

          <NextGrid columns={2} style={atlasGridStyle}>
            <Family heading="Acciones" id="atlas-actions">
              <NextButtonGroup label="Acciones de publicación">
                <NextButton>Guardar</NextButton>
                <NextButton variant="secondary">Vista previa</NextButton>
              </NextButtonGroup>
              <NextButtonGroup attached label="Formato">
                <NextButton size="sm" variant="secondary">Breve</NextButton>
                <NextButton size="sm" variant="secondary">Completo</NextButton>
              </NextButtonGroup>
              <NextCluster data-atlas-foundation="cluster">
                <NextIconButton label="Guardar favorito" variant="ghost"><Heart /></NextIconButton>
                <NextActionLink href="#atlas-feedback" variant="secondary">Ver feedback</NextActionLink>
                <NextButton loading>Guardando</NextButton>
              </NextCluster>
            </Family>

            <Family heading="Formularios" id="atlas-forms">
              <NextGrid columns={2} style={controlGridStyle}>
                <NextField htmlFor="atlas-name" label="Nombre" required>
                  <NextInput defaultValue="Mercado Central" />
                </NextField>
                <NextField htmlFor="atlas-category" label="Categoría">
                  <NextSelect defaultValue="market">
                    <option value="market">Mercado</option>
                    <option value="services">Servicios</option>
                  </NextSelect>
                </NextField>
              </NextGrid>
              <NextField htmlFor="atlas-description" label="Descripción" hint="Resume la propuesta de valor.">
                <NextTextarea defaultValue="Productos locales y atención bilingüe para la comunidad." />
              </NextField>
              <NextStack gap="2">
                <label className="vrn-field__label" htmlFor="atlas-search">Buscar</label>
                <NextInputGroup prefix="Buscar" suffix="⌘K">
                  <NextInput aria-label="Buscar" defaultValue="restaurantes" id="atlas-search" />
                </NextInputGroup>
              </NextStack>
              <NextCheckbox defaultChecked count={12} label="Abierto ahora" />
              <NextRadioGroup
                defaultValue="public"
                label="Visibilidad"
                name="atlas-visibility"
                options={[
                  { value: "public", label: "Público", description: "Visible en el directorio" },
                  { value: "draft", label: "Borrador", description: "Solo para el equipo" },
                ]}
              />
              <NextSwitch defaultChecked label="Aceptar mensajes" name="atlas-messages" />
              <NextFormSummary
                errors={[{ id: "atlas-name", message: "Revisa el nombre del negocio" }]}
                title="Hay un dato pendiente"
              />
            </Family>

            <Family heading="Navegación" id="atlas-navigation">
              <NextBreadcrumbs items={[{ href: "#", label: "Inicio" }, { label: "Componentes" }]} />
              <NextTabs
                defaultValue="details"
                items={[
                  { value: "details", label: "Detalles", content: <NextText>Información principal.</NextText> },
                  { value: "hours", label: "Horarios", content: <NextText>Horario semanal.</NextText> },
                  { value: "disabled", label: "Estadísticas", content: null, disabled: true },
                ]}
                label="Secciones del negocio"
              />
              <NextStepper
                label="Progreso de ejemplo"
                onStepChange={setStep}
                steps={[
                  { value: "details", label: "Datos" },
                  { value: "review", label: "Revisión" },
                  { value: "publish", label: "Publicar" },
                ]}
                value={step}
              />
              <NextNavigationRail
                items={[
                  { current: true, href: "#atlas-navigation", icon: <Search />, label: "Explorar" },
                  { href: "#atlas-forms", icon: <SlidersHorizontal />, label: "Preferencias" },
                ]}
                label="Navegación del atlas"
              />
            </Family>

            <Family heading="Estado" id="atlas-status">
              <NextCluster>
                <NextBadge>Neutral</NextBadge>
                <NextBadge tone="success">Verificado</NextBadge>
                <NextBadge tone="warning">Pendiente</NextBadge>
                <NextBadge tone="danger">Requiere atención</NextBadge>
              </NextCluster>
              <NextCluster>
                <NextTag>Restaurante</NextTag>
                <NextTag onRemove={() => undefined} removeLabel="Quitar filtro abierto" tone="success">Abierto</NextTag>
              </NextCluster>
            </Family>

            <Family heading="Feedback" id="atlas-feedback">
              <NextAlert action={<NextActionLink href="#atlas-forms" size="sm" variant="ghost">Revisar</NextActionLink>} title="Perfil casi listo" tone="success">
                Completa un dato para publicar.
              </NextAlert>
              <NextProgress label="Completitud" value={72} />
              <NextSkeleton height="2.75rem" width="70%" />
              <NextEmptyState
                action={<NextButton size="sm" variant="secondary">Agregar dato</NextButton>}
                description="Añade información para continuar."
                icon={<Search />}
                title="Sin resultados"
              />
            </Family>

            <Family heading="Contenido" id="atlas-content">
              <NextCluster>
                <NextAvatar name="María Contreras" size="lg" />
                <NextRating reviewCount={96} value={4.8} />
              </NextCluster>
              <NextReviewSummary
                average={4.8}
                distribution={[
                  { count: 74, rating: 5 },
                  { count: 15, rating: 4 },
                  { count: 5, rating: 3 },
                  { count: 1, rating: 2 },
                  { count: 1, rating: 1 },
                ]}
                total={96}
              />
            </Family>

            <Family heading="Overlays" id="atlas-overlays">
              <NextCluster>
                <NextDialog
                  description="Comprueba el resumen antes de continuar."
                  footer={<NextDialogClose><NextButton>Cerrar y continuar</NextButton></NextDialogClose>}
                  title="Confirmar publicación"
                  trigger={<NextButton variant="secondary">Abrir diálogo</NextButton>}
                >
                  <NextText>El consumidor controla la mutación y la persistencia.</NextText>
                </NextDialog>
                <NextDrawer
                  description="Controles compactos en un portal tematizable."
                  side="right"
                  title="Filtros rápidos"
                  trigger={<NextButton startIcon={<SlidersHorizontal />} variant="secondary">Abrir panel</NextButton>}
                >
                  <NextCheckbox label="Solo verificados" />
                </NextDrawer>
              </NextCluster>
            </Family>
          </NextGrid>
        </NextStack>
      </NextContainer>
    </main>
  );
}

const meta = {
  title: "Next/Components/Core Atlas",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atlas: Story = {
  render: () => <ComponentAtlas />,
};
