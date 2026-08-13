"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type AccordionItem = {
  content: ReactNode;
  disabled?: boolean;
  title: ReactNode;
  value: string;
};

export type AccordionProps = Omit<AccordionPrimitive.AccordionSingleProps, "children" | "type"> & {
  items: readonly AccordionItem[];
};

export function Accordion({ className, items, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root {...props} className={cn("vr-accordion", className)} collapsible type="single">
      {items.map((item) => (
        <AccordionPrimitive.Item className="vr-accordion__item" disabled={item.disabled} key={item.value} value={item.value}>
          <AccordionPrimitive.Header className="vr-accordion__header">
            <AccordionPrimitive.Trigger className="vr-accordion__trigger">
              <span>{item.title}</span>
              <span aria-hidden="true" className="vr-accordion__icon">⌄</span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="vr-accordion__content">
            <div className="vr-accordion__content-inner">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
