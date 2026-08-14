import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { Alert, EmptyState, ErrorState, Progress, Skeleton } from "../feedback";
import { Breadcrumbs, DropdownMenu, Pagination, Tabs } from "../navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "../feedback/toast";
import { XIcon } from "../../icons";

function InteractionShowcase() {
  return (
    <div style={{ display: "grid", gap: "2rem", inlineSize: "min(100%, 64rem)" }}>
      <Breadcrumbs
        items={[
          { href: "/", label: "Inicio" },
          { href: "/negocios", label: "Negocios" },
          { label: "Sabor de Casa" },
        ]}
      />
      <Tabs
        aria-label="Vista del directorio"
        defaultValue="list"
        items={[
          { content: <EmptyState description="Ajusta los filtros para ampliar la búsqueda." title="12 negocios en la lista" />, label: "Lista", value: "list" },
          { content: <Skeleton aria-label="Cargando mapa" aspectRatio="16 / 7" width="100%" />, label: "Mapa", value: "map" },
          { content: <EmptyState description="Guarda un negocio para encontrarlo aquí." title="Todavía no tienes guardados" />, label: "Guardados", value: "saved" },
        ]}
      />
      <Pagination getHref={(page) => `?page=${page}`} page={3} totalPages={9} />
    </div>
  );
}

function ToastDemo() {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider swipeDirection="right">
      <Button onClick={() => setOpen(true)}>Guardar cambios</Button>
      <Toast onOpenChange={setOpen} open={open}>
        <ToastTitle>Perfil guardado</ToastTitle>
        <ToastDescription>Los cambios ya están disponibles en el directorio.</ToastDescription>
        <ToastClose aria-label="Cerrar"><XIcon /></ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

const meta = {
  title: "Interaction/Navigation, Overlays and Feedback",
  component: InteractionShowcase,
} satisfies Meta<typeof InteractionShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Navigation: Story = {};

export const OverlayGallery: Story = {
  render: () => (
    <TooltipProvider>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <Dialog>
          <DialogTrigger asChild><Button>Editar negocio</Button></DialogTrigger>
          <DialogContent>
            <DialogTitle>Editar información</DialogTitle>
            <DialogDescription>Actualiza los datos que verá la comunidad.</DialogDescription>
            <Alert description="Puedes revisar los cambios antes de publicarlos." title="Guardado como borrador" />
            <DialogClose asChild><Button>Cerrar</Button></DialogClose>
          </DialogContent>
        </Dialog>

        <Drawer>
          <DrawerTrigger asChild><Button variant="outline">Abrir filtros</Button></DrawerTrigger>
          <DrawerContent side="right">
            <DrawerTitle>Filtrar negocios</DrawerTitle>
            <DrawerDescription>Combina categorías, ubicación y disponibilidad.</DrawerDescription>
            <DrawerClose asChild><Button>Aplicar filtros</Button></DrawerClose>
          </DrawerContent>
        </Drawer>

        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="danger">Eliminar perfil</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>¿Eliminar Sabor de Casa?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción retirará el perfil y sus fotografías del directorio.</AlertDialogDescription>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <AlertDialogCancel asChild><Button variant="ghost">Cancelar</Button></AlertDialogCancel>
              <AlertDialogAction asChild><Button variant="danger">Sí, eliminar</Button></AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <Popover>
          <PopoverTrigger asChild><Button variant="secondary">Ver horario</Button></PopoverTrigger>
          <PopoverContent><strong>Abierto hoy</strong><p>9:00 a. m. – 8:00 p. m.</p></PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild><Button variant="ghost">¿Verificado?</Button></TooltipTrigger>
          <TooltipContent>La identidad del negocio fue confirmada.</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const FeedbackStates: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", inlineSize: "min(100%, 44rem)" }}>
      <Alert description="Tu perfil ya aparece en la búsqueda." title="Publicado correctamente" variant="success" />
      <Alert description="Falta confirmar el número de teléfono." title="Información pendiente" variant="warning" />
      <Alert description="Revisa los campos marcados e inténtalo de nuevo." title="No se pudo guardar" variant="danger" />
      <Progress label="Perfil completado" showValue value={72} />
      <Skeleton aria-label="Cargando tarjeta de negocio" height="9rem" width="100%" />
      <ErrorState action={<Button>Reintentar</Button>} description="Revisa tu conexión e inténtalo nuevamente." title="No pudimos cargar los negocios" />
    </div>
  ),
};

export const TransientToast: Story = {
  render: () => <ToastDemo />,
};

export const CompactAdmin: Story = {
  render: () => (
    <div data-vr-density="compact" style={{ display: "grid", gap: "1rem", inlineSize: "min(100%, 48rem)" }}>
      <Tabs
        aria-label="Sección administrativa"
        defaultValue="profile"
        items={[
          { content: <Alert title="Datos sincronizados" variant="success" />, label: "Perfil", value: "profile" },
          { content: "Usuarios administradores", label: "Equipo", value: "team" },
        ]}
      />
      <DropdownMenu
        items={[
          { label: "Editar" },
          { label: "Duplicar" },
          { danger: true, label: "Eliminar", separatorBefore: true },
        ]}
        label="Acciones administrativas"
        trigger="Acciones"
      />
    </div>
  ),
};
