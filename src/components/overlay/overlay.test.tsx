import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { VorealRoot } from "../../primitives";
import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./drawer";

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Editar</Button></DialogTrigger>
      <DialogContent>
        <DialogTitle>Editar negocio</DialogTitle>
        <DialogDescription>Actualiza la información pública.</DialogDescription>
        <DialogClose asChild><Button>Cerrar</Button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

it("returns focus to the dialog trigger and themes its portal", async () => {
  const user = userEvent.setup();
  render(<VorealRoot density="compact" theme="red-latina"><DialogDemo /></VorealRoot>);
  const trigger = screen.getByRole("button", { name: "Editar" });
  await user.click(trigger);

  const dialog = screen.getByRole("dialog", { name: "Editar negocio" });
  expect(dialog).toHaveAttribute("data-vr-portal");
  expect(dialog).toHaveAttribute("data-vr-theme", "red-latina");
  expect(dialog).toHaveAttribute("data-vr-density", "compact");
  await user.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(trigger).toHaveFocus();
});

it("uses dialog semantics for a bottom drawer", async () => {
  const user = userEvent.setup();
  render(
    <VorealRoot theme="red-latina">
      <Drawer>
        <DrawerTrigger asChild><Button>Filtros</Button></DrawerTrigger>
        <DrawerContent side="bottom">
          <DrawerTitle>Filtrar negocios</DrawerTitle>
          <DrawerDescription>Selecciona categorías y ubicación.</DrawerDescription>
          <DrawerClose asChild><Button>Aplicar</Button></DrawerClose>
        </DrawerContent>
      </Drawer>
    </VorealRoot>,
  );

  await user.click(screen.getByRole("button", { name: "Filtros" }));
  expect(screen.getByRole("dialog", { name: "Filtrar negocios" })).toHaveAttribute("data-side", "bottom");
});
