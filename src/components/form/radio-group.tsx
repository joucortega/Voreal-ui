"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type RadioOption = {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
  options: readonly RadioOption[];
};

export function RadioGroup({ className, id, options, ...props }: RadioGroupProps) {
  const reactId = useId().replaceAll(":", "");
  const groupId = id ?? `vr-radio-group-${reactId}`;
  const fieldProps = useFieldControl({ ...props, id: groupId });

  return (
    <RadioGroupPrimitive.Root
      {...props}
      {...fieldProps}
      className={cn("vr-radio-group", className)}
    >
      {options.map((option) => {
        const optionId = `${groupId}-${option.value}`;
        return (
          <label className="vr-choice" key={option.value} htmlFor={optionId}>
            <RadioGroupPrimitive.Item
              className="vr-radio"
              disabled={option.disabled}
              id={optionId}
              value={option.value}
            >
              <RadioGroupPrimitive.Indicator className="vr-radio__indicator" />
            </RadioGroupPrimitive.Item>
            <span className="vr-choice__copy">
              <span className="vr-choice__label">{option.label}</span>
              {option.description ? <span className="vr-choice__description">{option.description}</span> : null}
            </span>
          </label>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}
