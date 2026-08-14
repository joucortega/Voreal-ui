"use client";

import { useMemo, useState } from "react";
import { Button, ButtonGroup } from "../../components/button";
import { DataTable, type DataTableColumn, type DataTableSort, StatCard } from "../../components/data";
import { Alert, ErrorState } from "../../components/feedback";
import { Field, Input, Select, Switch, Textarea } from "../../components/form";
import { Breadcrumbs } from "../../components/navigation";
import { BuildingIcon, HomeIcon, ShapesIcon, SparklesIcon } from "../../icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/overlay";
import { ActivityHistory } from "./activity-history";
import { AdminFilters } from "./admin-filters";
import { AdminShell } from "./admin-shell";
import { FormSection } from "./form-section";
import { PageHeader } from "./page-header";
import { PublicationStatus, type PublicationState } from "./publication-status";
import { QuickEditDrawer } from "./quick-edit-drawer";

type AdminBusiness = {
  category: string;
  id: string;
  location: string;
  name: string;
  status: PublicationState;
  updated: string;
};

const businesses: AdminBusiness[] = [
  { category: "Restaurante", id: "sabor", location: "Baltimore", name: "Sabor de Casa", status: "published", updated: "Hace 12 min" },
  { category: "Impuestos", id: "martinez", location: "Dundalk", name: "Martínez Tax Services", status: "pending", updated: "Ayer" },
  { category: "Belleza", id: "luna", location: "Essex", name: "Luna Beauty Studio", status: "draft", updated: "12 ago" },
  { category: "Servicios", id: "centro", location: "Silver Spring", name: "Centro Integral de Servicios Profesionales", status: "archived", updated: "8 ago" },
];

export type AdminReferenceProps = {
  empty?: boolean;
  error?: boolean;
  loading?: boolean;
};

function EditBusiness({ business }: { business: AdminBusiness }) {
  return (
    <QuickEditDrawer
      description="Actualiza los datos esenciales sin salir de la lista."
      title={`Editar ${business.name}`}
      trigger={<Button aria-label={`Editar ${business.name}`} size="sm" variant="ghost">Editar</Button>}
    >
      <FormSection description="Esta información aparece en la tarjeta pública." title="Información principal">
        <Field label="Nombre del negocio" required><Input defaultValue={business.name} /></Field>
        <Field label="Categoría"><Input defaultValue={business.category} /></Field>
        <Field label="Descripción"><Textarea defaultValue="Atención bilingüe para nuestra comunidad." rows={4} /></Field>
      </FormSection>
      <FormSection title="Publicación">
        <Field label="Estado">
          <Select
            defaultValue={business.status}
            options={[
              { label: "Publicado", value: "published" },
              { label: "Pendiente", value: "pending" },
              { label: "Borrador", value: "draft" },
              { label: "Archivado", value: "archived" },
            ]}
          />
        </Field>
        <Switch defaultChecked={business.status === "published"} label="Visible en el directorio" />
      </FormSection>
    </QuickEditDrawer>
  );
}

export function AdminReference({ empty = false, error = false, loading = false }: AdminReferenceProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<DataTableSort>({ direction: "asc", key: "name" });
  const rows = empty ? [] : businesses;
  const columns = useMemo<readonly DataTableColumn<AdminBusiness>[]>(() => [
    {
      cell: (business) => (
        <div className="vr-admin-reference__business">
          <strong>{business.name}</strong>
          <span>{business.location}</span>
        </div>
      ),
      header: "Negocio",
      key: "name",
      sortable: true,
    },
    { cell: (business) => business.category, header: "Categoría", key: "category", sortable: true },
    { cell: (business) => <PublicationStatus status={business.status} />, header: "Estado", key: "status" },
    { cell: (business) => business.updated, header: "Actualizado", key: "updated" },
    { align: "end", cell: (business) => <EditBusiness business={business} />, header: "Acciones", key: "actions" },
  ], []);

  return (
    <AdminShell
      brand={<span><strong>Voreal</strong><small>Administración</small></span>}
      current="businesses"
      items={[
        { href: "/admin", icon: <HomeIcon />, label: "Resumen", value: "overview" },
        { href: "/admin/negocios", icon: <BuildingIcon />, label: "Negocios", value: "businesses" },
        { href: "/admin/categorias", icon: <ShapesIcon />, label: "Categorías", value: "categories" },
        { href: "/admin/promociones", icon: <SparklesIcon />, label: "Promociones", value: "promotions" },
      ]}
      utility={<a href="/">Ver directorio público</a>}
    >
      <main className="vr-admin-reference">
        <PageHeader
          actions={(
            <ButtonGroup label="Acciones de página">
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline">Archivar selección</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>¿Archivar los negocios seleccionados?</AlertDialogTitle>
                  <AlertDialogDescription>Dejarán de aparecer en el directorio público, pero podrás restaurarlos.</AlertDialogDescription>
                  <div className="vr-admin-reference__dialog-actions">
                    <AlertDialogCancel asChild><Button variant="outline">Cancelar</Button></AlertDialogCancel>
                    <AlertDialogAction asChild><Button variant="danger">Archivar</Button></AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
              <Button>Agregar negocio</Button>
            </ButtonGroup>
          )}
          breadcrumbs={<Breadcrumbs items={[{ href: "/admin", label: "Administración" }, { label: "Negocios" }]} label="Ruta administrativa" />}
          description="Revisa, publica y actualiza los perfiles de la comunidad desde un solo lugar."
          eyebrow="Directorio Latino"
          title="Negocios"
        />

        <section aria-label="Resumen de negocios" className="vr-admin-reference__stats">
          <StatCard change="+12% este mes" label="Publicados" supportingText="82% del directorio" value="248" />
          <StatCard change="7 nuevos" label="Pendientes" supportingText="Requieren revisión" value="14" />
          <StatCard change="93% completos" label="Perfiles verificados" supportingText="Meta: 95%" value="186" />
        </section>

        <Alert
          description="Hay perfiles sin horario o teléfono. Completar estos datos mejora su descubrimiento."
          title="9 perfiles necesitan atención"
          variant="warning"
        />

        <AdminFilters actions={<><Button size="sm" variant="ghost">Limpiar</Button><Button size="sm" type="submit">Aplicar</Button></>}>
          <Field label="Buscar"><Input placeholder="Nombre o ubicación" type="search" /></Field>
          <Field label="Estado">
            <Select options={[{ label: "Todos", value: "all" }, { label: "Publicados", value: "published" }, { label: "Pendientes", value: "pending" }]} placeholder="Todos" />
          </Field>
          <Field label="Categoría">
            <Select options={[{ label: "Todas", value: "all" }, { label: "Restaurantes", value: "food" }, { label: "Servicios", value: "services" }]} placeholder="Todas" />
          </Field>
        </AdminFilters>

        {error ? (
          <ErrorState
            action={<Button variant="outline">Reintentar</Button>}
            description="No pudimos cargar los negocios. Tus cambios guardados siguen seguros."
            title="Error al cargar"
          />
        ) : (
          <section aria-label="Listado de negocios" className="vr-admin-reference__table-panel">
            <div className="vr-admin-reference__table-heading">
              <div><h2>Todos los negocios</h2><p>{rows.length} resultados visibles</p></div>
              {selected.size > 0 ? <span aria-live="polite">{selected.size} seleccionados</span> : null}
            </div>
            <DataTable
              columns={columns}
              emptyDescription="Cambia los filtros o agrega el primer perfil del directorio."
              getRowKey={(business) => business.id}
              getRowLabel={(business) => business.name}
              label="Negocios del directorio"
              loading={loading}
              onSelectionChange={setSelected}
              onSortChange={(next) => setSort({ direction: next.direction, key: next.key })}
              rows={rows}
              selectedKeys={selected}
              sort={sort}
            />
          </section>
        )}

        <section className="vr-admin-reference__activity">
          <div><h2>Actividad reciente</h2><p>Cambios importantes en el directorio.</p></div>
          <ActivityHistory items={[
            { actor: "Ana Martínez", at: "Hoy, 10:24 a. m.", dateTime: "2026-08-13T10:24:00", description: "Publicó Sabor de Casa", id: "publish" },
            { actor: "Carlos Rivera", at: "Ayer, 4:12 p. m.", dateTime: "2026-08-12T16:12:00", description: "Actualizó Luna Beauty Studio", id: "update" },
            { actor: "Sistema", at: "11 ago", dateTime: "2026-08-11", description: "Marcó 3 perfiles para revisión", id: "review" },
          ]} />
        </section>
      </main>
    </AdminShell>
  );
}
