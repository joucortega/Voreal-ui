"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const ToastProvider = ToastPrimitive.Provider;

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(function ToastAction({ className, ...props }, ref) {
  return <ToastPrimitive.Action {...props} className={cn("vr-toast__action", className)} ref={ref} />;
});

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(function ToastClose({ className, ...props }, ref) {
  return <ToastPrimitive.Close {...props} className={cn("vr-toast__close", className)} ref={ref} />;
});

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(function ToastTitle({ className, ...props }, ref) {
  return <ToastPrimitive.Title {...props} className={cn("vr-toast__title", className)} ref={ref} />;
});

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(function ToastDescription({ className, ...props }, ref) {
  return <ToastPrimitive.Description {...props} className={cn("vr-toast__description", className)} ref={ref} />;
});

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
