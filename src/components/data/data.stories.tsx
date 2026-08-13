import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../content/badge";
import { Card, CardLink } from "../content/card";
import { Media } from "../content/media";
import { DataTable, type DataTableColumn, type DataTableSort } from "./data-table";
import { DefinitionList } from "./definition-list";
import { StatCard } from "./stat-card";

type Business = {
  category: string;
  id: string;
  name: string;
  status: "Pendiente" | "Publicado";
};

const businesses: Business[] = [
  { category: "Restaurante", id: "1", name: "Sabor de Casa", status: "Publicado" },
  { category: "Servicios profesionales", id: "2", name: "Martínez Tax Services", status: "Publicado" },
  { category: "Belleza y bienestar", id: "3", name: "Luna Beauty Studio", status: "Pendiente" },
];

const columns: DataTableColumn<Business>[] = [
  { cell: (row) => <strong>{row.name}</strong>, header: "Negocio", key: "name", sortable: true },
  { cell: (row) => row.category, header: "Categoría", key: "category", sortable: true },
  {
    cell: (row) => <Badge variant={row.status === "Publicado" ? "success" : "warning"}>{row.status}</Badge>,
    header: "Estado",
    key: "status",
  },
];

function ControlledBusinessTable({ loading = false }: { loading?: boolean }) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(["1"]));
  const [sort, setSort] = useState<DataTableSort>({ direction: "asc", key: "name" });
  return (
    <DataTable
      columns={columns}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      label="Negocios administrados"
      loading={loading}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSort}
      rows={businesses}
      selectedKeys={selectedKeys}
      sort={sort}
    />
  );
}

const meta = {
  title: "Content/Content and Data",
  component: ControlledBusinessTable,
} satisfies Meta<typeof ControlledBusinessTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BusinessTable: Story = {};

export const LoadingTable: Story = { args: { loading: true } };

export const EmptyTable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      emptyDescription="Prueba otra categoría o amplía la distancia."
      emptyTitle="No encontramos negocios cerca"
      getRowKey={(row) => row.id}
      label="Resultados filtrados"
      rows={[]}
    />
  ),
};

export const DirectoryCards: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "1rem" }}>
      <CardLink href="/negocios/sabor-de-casa" padding="none">
        <Media alt="Sabor de Casa" fallback="SC" src="/missing-sabor.jpg" />
        <div style={{ display: "grid", gap: "0.5rem", padding: "1.25rem" }}>
          <Badge variant="success">Abierto ahora</Badge>
          <strong>Sabor de Casa</strong>
          <span>Restaurante mexicano · Baltimore</span>
        </div>
      </CardLink>
      <Card padding="none">
        <Media alt="Martínez Tax Services" fallback="MT" />
        <div style={{ display: "grid", gap: "0.5rem", padding: "1.25rem" }}>
          <Badge variant="accent">Verificado</Badge>
          <strong>Martínez Tax Services</strong>
          <span>Impuestos y contabilidad · Dundalk</span>
        </div>
      </Card>
    </div>
  ),
};

export const AdminMetrics: Story = {
  render: () => (
    <div data-vr-density="compact" style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1rem" }}>
        <StatCard change="+12%" label="Perfiles activos" supportingText="Frente al mes anterior" value="1,248" />
        <StatCard change="+8%" label="Búsquedas semanales" supportingText="Últimos 7 días" value="18,420" />
        <StatCard label="Pendientes de revisión" supportingText="Requieren atención" value="37" />
      </div>
      <DefinitionList
        items={[
          { description: "Jou Ortega", term: "Administrador" },
          { description: "13 de agosto de 2026", term: "Última actualización" },
          { description: "Red Latina 360", term: "Tema activo" },
        ]}
      />
    </div>
  ),
};
