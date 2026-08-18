"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactElement, ReactNode } from "react";
import { NextIconButton } from "../actions";
import { X } from "../../icons";
import { vorealNextPortalProps } from "../../root";

export type NextDialogProps = {
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  closeLabel?: string;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  theme?: string;
};

export type NextDrawerProps = NextDialogProps & {
  side?: "left" | "right" | "bottom";
};

export type NextDialogCloseProps = {
  children: ReactElement;
};

type DialogDrawerFrameProps = NextDialogProps & {
  side?: NextDrawerProps["side"];
  variant: "dialog" | "drawer";
};

function getCloseLabel(title: ReactNode): string {
  return typeof title === "string" && title.trim()
    ? `Cerrar ${title.trim().toLocaleLowerCase("es")}`
    : "Cerrar diálogo";
}

function hasRenderableContent(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false;
}

function DialogDrawerFrame({
  children,
  closeLabel,
  defaultOpen,
  description,
  footer,
  onOpenChange,
  open,
  side,
  theme,
  title,
  trigger,
  variant,
}: DialogDrawerFrameProps): ReactElement {
  const hasDescription = hasRenderableContent(description);
  const hasFooter = hasRenderableContent(footer);
  const contentDescriptionProps = hasDescription ? {} : { "aria-describedby": undefined };

  return (
    <Dialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <div {...vorealNextPortalProps} data-vrn-theme={theme || undefined}>
          <Dialog.Overlay className="vrn-dialog__overlay" />
          <Dialog.Content
            {...contentDescriptionProps}
            className="vrn-dialog__content"
            data-side={variant === "drawer" ? side : undefined}
            data-variant={variant}
          >
            <header className="vrn-dialog__header">
              <div className="vrn-dialog__heading">
                <Dialog.Title className="vrn-dialog__title">{title}</Dialog.Title>
                {hasDescription ? (
                  <Dialog.Description className="vrn-dialog__description">{description}</Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close asChild>
                <NextIconButton
                  className="vrn-dialog__close"
                  label={closeLabel ?? getCloseLabel(title)}
                  variant="ghost"
                >
                  <X />
                </NextIconButton>
              </Dialog.Close>
            </header>
            <div className="vrn-dialog__body">{children}</div>
            {hasFooter ? <footer className="vrn-dialog__footer">{footer}</footer> : null}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function NextDialog(props: NextDialogProps): ReactElement {
  return <DialogDrawerFrame {...props} variant="dialog" />;
}

export function NextDrawer({ side = "right", ...props }: NextDrawerProps): ReactElement {
  return <DialogDrawerFrame {...props} side={side} variant="drawer" />;
}

export function NextDialogClose({ children }: NextDialogCloseProps): ReactElement {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
}
