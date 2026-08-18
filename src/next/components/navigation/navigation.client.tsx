"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type NextTabItem = {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type NextTabsProps = Omit<ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, "asChild" | "children"> & {
  label: string;
  items: readonly NextTabItem[];
};

export const NextTabs = forwardRef<HTMLDivElement, NextTabsProps>(function NextTabs(
  { className, defaultValue, items, label, value, ...props },
  ref,
) {
  const firstEnabledValue = items.find((item) => !item.disabled)?.value;
  const uncontrolledDefault = value === undefined ? (defaultValue ?? firstEnabledValue) : undefined;

  return (
    <TabsPrimitive.Root
      {...props}
      ref={ref}
      className={clsx("vrn-tabs", className)}
      defaultValue={uncontrolledDefault}
      value={value}
    >
      <div className="vrn-tabs__scroller">
        <TabsPrimitive.List aria-label={label} className="vrn-tabs__list">
          {items.map((item) => (
            <TabsPrimitive.Trigger
              className="vrn-tabs__trigger"
              disabled={item.disabled}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>
      {items.map((item) => (
        <TabsPrimitive.Content className="vrn-tabs__content" key={item.value} value={item.value}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
});
