import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDownIcon, MoreHorizontalIcon } from "../../icons";
import { IconButton } from "../button/button";
import { Avatar } from "./avatar";
import { AvatarWeave } from "./avatar-group";
import { CommunityHub } from "./community-hub";
import { IdentityCapsule } from "./identity-capsule";

const people = [
  { id: "1", name: "Ana Martínez" },
  { id: "2", name: "José Rivera" },
  { id: "3", name: "Luisa Peña" },
  { id: "4", name: "Mateo Cruz" },
  { id: "5", name: "Sofía León" },
  { id: "6", name: "Ángel Núñez" },
];

const meta = {
  title: "Identity/Avatar Language",
  component: Avatar,
  args: {
    name: "Ana Martínez",
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SizesAndFallbacks: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
      <Avatar name="Ana Martínez" size="xs" />
      <Avatar name="José Rivera" size="sm" />
      <Avatar name="Luisa Peña" size="md" />
      <Avatar name="Mateo Cruz" size="lg" />
      <Avatar name="Ángel Núñez" size="xl" />
      <Avatar fallback="RL" name="Red Latina 360" size="xl" />
    </div>
  ),
};

export const AvatarWeaveConnections: Story = {
  render: () => <AvatarWeave max={4} people={people} size="lg" />,
};

export const IdentityCapsules: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", justifyItems: "start", maxInlineSize: "32rem" }}>
      <IdentityCapsule
        action={
          <IconButton label="Abrir opciones" size="sm" variant="ghost">
            <MoreHorizontalIcon />
          </IconButton>
        }
        name="Ana Martínez"
        status="Verificada"
        subtitle="Restaurante La Palma"
      />
      <IdentityCapsule
        name="María Fernanda de los Ángeles Rodríguez"
        status="Abierto ahora"
        subtitle="Servicios profesionales y asesoría para pequeños negocios"
      />
    </div>
  ),
};

export const CommunityOrbit: Story = {
  render: () => (
    <CommunityHub center={{ id: "host", name: "Mercado Latino" }} people={people} />
  ),
};

export const CompactAdminIdentity: Story = {
  render: () => (
    <div data-vr-density="compact">
      <IdentityCapsule
        action={
          <IconButton density="compact" label="Cuenta" size="sm" variant="ghost">
            <ChevronDownIcon />
          </IconButton>
        }
        avatarSize="sm"
        name="Jou Ortega"
        status="Administrador"
        subtitle="Super admin"
      />
    </div>
  ),
};
