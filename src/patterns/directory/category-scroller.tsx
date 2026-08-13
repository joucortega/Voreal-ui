"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../utilities/cn";
import type { DirectoryCategory } from "./types";

export type CategoryScrollerProps = {
  categories: readonly DirectoryCategory[];
  className?: string;
  label?: string;
  onValueChange: (value: string) => void;
  value: string;
};

export function CategoryScroller({
  categories,
  className,
  label = "Categorías",
  onValueChange,
  value,
}: CategoryScrollerProps) {
  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      className={cn("vr-category-scroller", className)}
      onValueChange={onValueChange}
      orientation="horizontal"
      value={value}
    >
      {categories.map((category) => (
        <RadioGroupPrimitive.Item className="vr-category-scroller__item" key={category.value} value={category.value}>
          {category.icon ? <span aria-hidden="true" className="vr-category-scroller__icon">{category.icon}</span> : null}
          <span>{category.label}</span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
