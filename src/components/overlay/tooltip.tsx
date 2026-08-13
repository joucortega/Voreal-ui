"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        {...portalProps}
        className={cn("vr-tooltip", className)}
        ref={ref}
        sideOffset={sideOffset}
      />
    </TooltipPrimitive.Portal>
  );
});
