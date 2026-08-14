import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Accordion } from "../content/accordion";
import { Card, CardLink } from "../content/card";
import { Media } from "../content/media";
import { MediaFrame } from "../content/media-frame";
import { DataTable, type DataTableColumn } from "./data-table";
import { StaticDataTable } from "./static-data-table";
import { DefinitionList } from "./definition-list";
import { StatCard } from "./stat-card";

type Business = {
  category: string;
  id: string;
  name: string;
};

const rows: Business[] = [
  { category: "Restaurante", id: "1", name: "Sabor de Casa" },
  { category: "Servicios", id: "2", name: "Martínez Tax Services" },
];

const columns: DataTableColumn<Business>[] = [
  { cell: (row) => row.name, header: "Negocio", key: "name", sortable: true },
  { cell: (row) => row.category, header: "Categoría", key: "category" },
];

it("renders sortable headers as labeled buttons", async () => {
  const onSortChange = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <DataTable
      columns={columns}
      getRowKey={(row) => row.id}
      label="Negocios"
      onSortChange={onSortChange}
      rows={rows}
    />,
  );

  expect(screen.getByRole("table", { name: "Negocios" })).toBeVisible();
  const sort = screen.getByRole("button", { name: /ordenar por negocio/i });
  await user.click(sort);
  expect(onSortChange).toHaveBeenCalledWith({ direction: "asc", key: "name" });
});

it("keeps table selection controlled by the host", async () => {
  const onSelectionChange = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <DataTable
      columns={columns}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      label="Negocios"
      onSelectionChange={onSelectionChange}
      rows={rows}
      selectedKeys={new Set(["1"])}
    />,
  );

  expect(screen.getByRole("checkbox", { name: "Seleccionar Sabor de Casa" })).toBeChecked();
  await user.click(screen.getByRole("checkbox", { name: "Seleccionar Martínez Tax Services" }));
  expect(onSelectionChange).toHaveBeenCalledWith(new Set(["1", "2"]));
});

it("renders empty tables without losing their accessible name", () => {
  renderVoreal(
    <DataTable
      columns={columns}
      emptyDescription="Prueba otra categoría."
      emptyTitle="No encontramos negocios"
      getRowKey={(row) => row.id}
      label="Resultados filtrados"
      rows={[]}
    />,
  );

  expect(screen.getByRole("table", { name: "Resultados filtrados" })).toBeVisible();
  expect(screen.getByText("No encontramos negocios")).toBeVisible();
});

it("renders a server-safe static data table without interactive controls", () => {
  renderVoreal(
    <StaticDataTable columns={columns} getRowKey={(row) => row.id} label="Directorio estático" rows={rows} />,
  );

  expect(screen.getByRole("table", { name: "Directorio estático" })).toBeVisible();
  expect(screen.getByText("Sabor de Casa")).toBeVisible();
  expect(screen.queryByRole("button", { name: /ordenar/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("provides robust media fallback and content primitives", async () => {
  const user = userEvent.setup();
  renderVoreal(
    <div>
      <Card><Media alt="Foto de Sabor de Casa" fallback="SC" src="/missing.jpg" /></Card>
      <CardLink href="/negocios/sabor-de-casa">Abrir Sabor de Casa</CardLink>
      <Accordion
        items={[
          { content: "De lunes a sábado", title: "Horario", value: "hours" },
          { content: "Baltimore y alrededores", title: "Área de servicio", value: "area" },
        ]}
      />
      <StatCard label="Perfiles activos" value="1,248" />
      <DefinitionList items={[{ description: "Baltimore, MD", term: "Ubicación" }]} />
    </div>,
  );

  expect(await screen.findByText("SC")).toBeVisible();
  expect(screen.getByRole("link", { name: "Abrir Sabor de Casa" })).toHaveAttribute("href", "/negocios/sabor-de-casa");
  await user.click(screen.getByRole("button", { name: "Horario" }));
  expect(screen.getByText("De lunes a sábado")).toBeVisible();
  expect(screen.getByText("1,248")).toBeVisible();
  expect(screen.getByText("Baltimore, MD")).toBeVisible();
});

it("lets optimized framework images render inside a stable MediaFrame", () => {
  renderVoreal(
    <MediaFrame alt="Foto optimizada" aspectRatio="16 / 9" fallback="FO">
      <span data-testid="next-image-adapter">Imagen optimizada por Next</span>
    </MediaFrame>,
  );

  const frame = screen.getByTestId("next-image-adapter").closest(".vr-media");
  expect(frame).toHaveStyle({ aspectRatio: "16 / 9" });
  expect(frame).toContainElement(screen.getByTestId("next-image-adapter"));
});

it("composes CardLink with a framework router link", () => {
  function RouterLink({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a {...props} data-router-link="true" href={href}>{children}</a>;
  }

  renderVoreal(
    <CardLink asChild>
      <RouterLink href="/negocios/sabor-de-casa">Abrir perfil</RouterLink>
    </CardLink>,
  );

  expect(screen.getByRole("link", { name: "Abrir perfil" })).toHaveAttribute("data-router-link", "true");
});

it("has no detectable accessibility violations in representative data", async () => {
  const { container } = renderVoreal(
    <DataTable columns={columns} getRowKey={(row) => row.id} label="Negocios" rows={rows} />,
  );
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
