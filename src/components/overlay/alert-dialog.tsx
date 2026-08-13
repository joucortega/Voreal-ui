"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;

export type AlertDialogContentProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>;

export const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(function AlertDialogContent({ className, ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay {...portalProps} className="vr-overlay" />
      <AlertDialogPrimitive.Content
        {...props}
        {...portalProps}
        className={cn("vr-dialog vr-alert-dialog", className)}
        ref={ref}
      />
    </AlertDialogPrimitive.Portal>
  );
});
