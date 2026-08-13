"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastAction = ToastPrimitive.Action;
export const ToastClose = ToastPrimitive.Close;
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;

export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Root>;
export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(function Toast(
  { className, ...props },
  ref,
) {
  return <ToastPrimitive.Root {...props} className={cn("vr-toast", className)} ref={ref} />;
});

export type ToastViewportProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;
export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(function ToastViewport({ className, ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <ToastPrimitive.Viewport
      {...props}
      {...portalProps}
      className={cn("vr-toast-viewport", className)}
      ref={ref}
    />
  );
});
