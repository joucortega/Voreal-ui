import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button/button";
import { Checkbox } from "./checkbox";
import { Combobox } from "./combobox";
import { Field } from "./field";
import { FileUpload } from "./file-upload";
import { Input } from "./input";
import { RadioGroup } from "./radio-group";
import { Select } from "./select";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

const categories = [
  { label: "Restaurantes y comida", value: "food" },
  { label: "Servicios profesionales", value: "professional" },
  { label: "Belleza y bienestar", value: "beauty" },
  { disabled: true, label: "Categoría no disponible", value: "unavailable" },
];

const cities = [
  { label: "Baltimore, Maryland", value: "baltimore" },
  { label: "Towson, Maryland", value: "towson" },
  { label: "Silver Spring, Maryland", value: "silver-spring" },
];

function InteractiveCombobox({ loading = false }: { loading?: boolean }) {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string>();
  const filtered = cities.filter((city) => city.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));

  return (
    <Field hint="Puedes buscar por ciudad o condado" label="Ubicación">
      <Combobox
        items={loading ? [] : filtered}
        loading={loading}
        onQueryChange={setQuery}
        onValueChange={setValue}
        query={query}
        statusText={`${filtered.length} ubicaciones encontradas`}
        value={value}
      />
    </Field>
  );
}

function FormGallery() {
  return (
    <form style={{ display: "grid", gap: "1.5rem", inlineSize: "min(100%, 42rem)" }}>
      <Field hint="Así aparecerá en las búsquedas" label="Nombre del negocio" required>
        <Input placeholder="Ej. Sabor de Casa" />
      </Field>
      <Field label="Categoría">
        <Select options={categories} placeholder="Selecciona una categoría" />
      </Field>
      <InteractiveCombobox />
      <Field hint="Describe qué hace especial a tu negocio" label="Descripción">
        <Textarea placeholder="Cuéntale a la comunidad sobre tus servicios…" />
      </Field>
      <Checkbox
        description="Permite mostrar el negocio cuando alguien filtra por disponibilidad."
        label="Abierto ahora"
      />
      <RadioGroup
        aria-label="Modalidad de servicio"
        options={[
          { description: "Las personas visitan tu ubicación", label: "En persona", value: "local" },
          { description: "Atención por internet o teléfono", label: "A distancia", value: "remote" },
          { label: "Ambas modalidades", value: "both" },
        ]}
      />
      <Switch
        description="La información seguirá guardada aunque ocultes el perfil."
        label="Perfil visible en el directorio"
      />
      <FileUpload accept="image/png,image/jpeg" label="Logo o foto principal" maxFiles={3} maxSize={5_000_000} />
      <Button type="submit">Guardar perfil</Button>
    </form>
  );
}

const meta = {
  title: "Forms/Form System",
  component: FormGallery,
} satisfies Meta<typeof FormGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CompleteProfile: Story = {};

export const ErrorsAndDisabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", inlineSize: "min(100%, 38rem)" }}>
      <Field error="Escribe al menos dos caracteres" label="Nombre del negocio" required>
        <Input defaultValue="A" />
      </Field>
      <Field label="Correo administrativo">
        <Input disabled value="administracion@redlatina360.com" />
      </Field>
      <Checkbox disabled label="Opción temporalmente no disponible" />
      <Switch disabled label="Publicación automática" />
    </div>
  ),
};

export const AsyncSearch: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", inlineSize: "min(100%, 38rem)" }}>
      <InteractiveCombobox />
      <InteractiveCombobox loading />
    </div>
  ),
};

export const LongSpanishContent: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", inlineSize: "min(100%, 44rem)" }}>
      <Field
        hint="Incluye servicios, zonas atendidas y cualquier información relevante para las familias de la comunidad."
        label="Descripción pública completa del negocio y de los servicios profesionales que ofrece"
      >
        <Textarea defaultValue="Ayudamos a pequeñas empresas y familias latinas con asesoría personalizada, atención bilingüe y horarios flexibles durante toda la semana." />
      </Field>
      <Switch
        description="Al activar esta opción, las personas podrán escribirte usando el formulario público sin que tu correo electrónico quede expuesto."
        label="Permitir que los visitantes del directorio envíen solicitudes de información y cotizaciones"
      />
    </div>
  ),
};

export const CompactAdmin: Story = {
  render: () => (
    <div data-vr-density="compact" style={{ inlineSize: "min(100%, 36rem)" }}>
      <FormGallery />
    </div>
  ),
};
