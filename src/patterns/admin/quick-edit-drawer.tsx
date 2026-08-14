"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button, IconButton } from "../../components/button";
import { XIcon } from "../../icons";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/overlay";
import { cn } from "../../utilities/cn";

export type QuickEditDrawerProps = ComponentPropsWithoutRef<typeof Drawer> & {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  footer?: ReactNode;
  title: ReactNode;
  trigger: ReactNode;
};

export function QuickEditDrawer({
  children,
  className,
  description,
  footer,
  title,
  trigger,
  ...props
}: QuickEditDrawerProps) {
  return (
    <Drawer {...props}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={cn("vr-quick-edit", className)} side="right">
        <div className="vr-quick-edit__header">
          <div>
            <DrawerTitle>{title}</DrawerTitle>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </div>
          <DrawerClose asChild>
            <IconButton label="Cerrar edición" variant="ghost"><XIcon /></IconButton>
          </DrawerClose>
        </div>
        <div className="vr-quick-edit__body">{children}</div>
        <div className="vr-quick-edit__footer">
          {footer ?? (
            <>
              <DrawerClose asChild><Button variant="outline">Cancelar</Button></DrawerClose>
              <Button>Guardar cambios</Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
