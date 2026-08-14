import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, LayoutGridIcon, ListIcon, LocateFixedIcon, MoreHorizontalIcon } from "../../icons";
import { Button, ButtonGroup, IconButton } from "./button";
import {
  ActionRail,
  LinkedCta,
  PathButton,
  RelayButton,
  SplitBridge,
} from "./signature-actions";

const meta = {
  title: "Actions/Button Language",
  component: Button,
  args: {
    children: "Explorar negocios",
    size: "md",
    variant: "primary",
  },
  argTypes: {
    density: { control: "inline-radio", options: [undefined, "comfortable", "compact"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger", "link"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      <Button>Primario</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="ghost">Discreto</Button>
      <Button variant="danger">Eliminar</Button>
      <Button variant="link">Ver todos</Button>
    </div>
  ),
};

export const LoadingDisabledAndFocus: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
      <Button loading>Guardando negocio</Button>
      <Button disabled>Acción no disponible</Button>
      <Button autoFocus variant="outline">
        Foco visible al abrir
      </Button>
    </div>
  ),
};

export const HoverSimulation: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <span style={{ color: "var(--vr-text-muted)", fontSize: "var(--vr-text-sm)" }}>
        Mueve el cursor para inspeccionar elevación, color y desplazamiento de 2px.
      </span>
      <Button endIcon={<ArrowRightIcon />}>Pasa el cursor aquí</Button>
    </div>
  ),
};

export const ConnectedButtons: Story = {
  render: () => (
    <ButtonGroup label="Herramientas de negocio">
      <Button variant="secondary">Editar</Button>
      <Button variant="secondary">Duplicar</Button>
      <IconButton label="Más opciones" variant="secondary">
        <MoreHorizontalIcon />
      </IconButton>
    </ButtonGroup>
  ),
};

export const SignatureActions: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", justifyItems: "start" }}>
      <PathButton destination="Directorio">Descubrir negocios</PathButton>
      <RelayButton status="12 negocios abiertos">Explorar ahora</RelayButton>
      <SplitBridge
        primary={{ label: "Ver perfil" }}
        secondary={{ label: "Cómo llegar" }}
      />
      <ActionRail
        defaultValue="list"
        items={[
          { value: "list", label: "Lista", icon: <ListIcon /> },
          { value: "map", label: "Mapa", icon: <LocateFixedIcon /> },
          { value: "grid", label: "Cuadrícula", icon: <LayoutGridIcon /> },
        ]}
        label="Vista de resultados"
      />
    </div>
  ),
};

export const LongSpanishCopy: Story = {
  render: () => (
    <LinkedCta
      action={
        <PathButton destination="Comunidad" size="lg">
          Encontrar negocios latinos confiables cerca de mi ubicación
        </PathButton>
      }
      description="Explora restaurantes, servicios profesionales, comercios y experiencias creadas por nuestra comunidad local."
      eyebrow="Hecho cerca de ti"
      title="El directorio que conecta a nuestra comunidad con negocios que sí entiende"
    />
  ),
};

export const CompactAdminDensity: Story = {
  render: () => (
    <div data-vr-density="compact" style={{ display: "flex", gap: "0.5rem" }}>
      <Button density="compact" size="sm">
        Publicar
      </Button>
      <Button density="compact" size="sm" variant="outline">
        Guardar borrador
      </Button>
      <IconButton density="compact" label="Más acciones" variant="ghost">
        <MoreHorizontalIcon />
      </IconButton>
    </div>
  ),
};

export const NarrowMobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => (
    <div style={{ inlineSize: "min(100%, 22rem)" }}>
      <LinkedCta
        action={<PathButton destination="Resultados">Buscar ahora</PathButton>}
        description="Filtros rápidos y resultados útiles sin perder contexto."
        title="Tu ruta local"
      />
    </div>
  ),
};
