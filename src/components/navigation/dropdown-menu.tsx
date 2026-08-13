"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";

export type DropdownMenuItem = {
  danger?: boolean;
  disabled?: boolean;
  label: ReactNode;
  onSelect?: () => void;
  separatorBefore?: boolean;
};

export type DropdownMenuProps = {
  align?: "center" | "end" | "start";
  className?: string;
  items: readonly DropdownMenuItem[];
  label: string;
  trigger: ReactNode;
};

export function DropdownMenu({
  align = "end",
  className,
  items,
  label,
  trigger,
}: DropdownMenuProps) {
  const portalProps = useVorealPortalProps();
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger aria-label={label} className={cn("vr-dropdown-trigger", className)}>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          {...portalProps}
          align={align}
          className="vr-dropdown-content"
          sideOffset={6}
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.separatorBefore ? <DropdownMenuPrimitive.Separator className="vr-dropdown-separator" /> : null}
              <DropdownMenuPrimitive.Item
                className="vr-dropdown-item"
                data-danger={item.danger ? "true" : undefined}
                disabled={item.disabled}
                onSelect={item.onSelect}
              >
                {item.label}
              </DropdownMenuPrimitive.Item>
            </div>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
