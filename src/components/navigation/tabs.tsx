"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type TabsItem = {
  content: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type TabsProps = Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "children"> & {
  "aria-label": string;
  items: readonly TabsItem[];
};

export function Tabs({ "aria-label": ariaLabel, className, items, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root {...props} className={cn("vr-tabs", className)}>
      <TabsPrimitive.List aria-label={ariaLabel} className="vr-tabs__list">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            className="vr-tabs__trigger"
            disabled={item.disabled}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content className="vr-tabs__content" key={item.value} value={item.value}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
