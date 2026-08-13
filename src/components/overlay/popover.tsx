"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(function PopoverContent({ className, sideOffset = 6, ...props }, ref) {
  const portalProps = useVorealPortalProps();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        {...props}
        {...portalProps}
        className={cn("vr-popover", className)}
        ref={ref}
        sideOffset={sideOffset}
      />
    </PopoverPrimitive.Portal>
  );
});
