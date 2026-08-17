"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { NextIconButton } from "../../components/actions";
import { Menu, X } from "../../icons";
import { vorealNextPortalProps } from "../../root";

export type NextDirectoryMobileNavProps = {
  children: ReactNode;
};

export function NextDirectoryMobileNav({ children }: NextDirectoryMobileNavProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <NextIconButton className="vrn-directory-mobile-nav__trigger" label="Abrir navegación" variant="secondary">
          <Menu />
        </NextIconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay {...vorealNextPortalProps} className="vrn-directory-mobile-nav__overlay" />
        <Dialog.Content
          {...vorealNextPortalProps}
          aria-describedby={undefined}
          className="vrn-directory-mobile-nav__content"
        >
          <div className="vrn-directory-mobile-nav__heading">
            <Dialog.Title className="vrn-directory-mobile-nav__title">Navegación</Dialog.Title>
            <Dialog.Close asChild>
              <NextIconButton label="Cerrar navegación" variant="ghost">
                <X />
              </NextIconButton>
            </Dialog.Close>
          </div>
          <div className="vrn-directory-mobile-nav__links">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
