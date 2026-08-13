"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay {...portalProps} className="vr-overlay" />
      <DialogPrimitive.Content
        {...props}
        {...portalProps}
        className={cn("vr-dialog", className)}
        ref={ref}
      />
    </DialogPrimitive.Portal>
  );
});
