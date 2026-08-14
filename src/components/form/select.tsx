"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "../../icons";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type SelectOption = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type SelectProps = Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, "children"> & {
  "aria-label"?: string;
  className?: string;
  id?: string;
  options: readonly SelectOption[];
  placeholder?: string;
};

export function Select({
  "aria-label": ariaLabel,
  className,
  id,
  options,
  placeholder = "Selecciona una opción",
  required,
  ...props
}: SelectProps) {
  const { required: fieldRequired, ...fieldProps } = useFieldControl({ id, required });
  const portalProps = useVorealPortalProps();

  return (
    <SelectPrimitive.Root {...props} required={fieldRequired}>
      <SelectPrimitive.Trigger
        {...fieldProps}
        aria-label={ariaLabel}
        className={cn("vr-select", className)}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon aria-hidden="true" className="vr-select__icon"><ChevronDownIcon /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          {...portalProps}
          className="vr-select-content"
          position="popper"
          sideOffset={6}
        >
          <SelectPrimitive.ScrollUpButton className="vr-select-content__scroll"><ChevronUpIcon /></SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="vr-select-content__viewport">
            {options.map((option) => (
              <SelectPrimitive.Item
                className="vr-select-item"
                disabled={option.disabled}
                key={option.value}
                value={option.value}
              >
                <SelectPrimitive.ItemIndicator aria-hidden="true" className="vr-select-item__indicator"><CheckIcon /></SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="vr-select-content__scroll"><ChevronDownIcon /></SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
