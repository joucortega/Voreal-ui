"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export const DrawerTitle = DialogPrimitive.Title;
export const DrawerDescription = DialogPrimitive.Description;

export type DrawerSide = "bottom" | "left" | "right";
export type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: DrawerSide;
};

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, side = "right", ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay {...portalProps} className="vr-overlay" />
      <DialogPrimitive.Content
        {...props}
        {...portalProps}
        className={cn("vr-drawer", className)}
        data-side={side}
        ref={ref}
      />
    </DialogPrimitive.Portal>
  );
});
