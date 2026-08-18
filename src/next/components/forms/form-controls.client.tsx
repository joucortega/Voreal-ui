"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import clsx from "clsx";
import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type NextRadioOption = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export type NextRadioGroupProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "asChild" | "children" | "className" | "name"
> & {
  className?: string;
  label: string;
  name: string;
  options: readonly NextRadioOption[];
};

export type NextSwitchProps = Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "asChild" | "children" | "className"
> & {
  className?: string;
  label: string;
};

export const NextRadioGroup = forwardRef<HTMLDivElement, NextRadioGroupProps>(function NextRadioGroup({
  "aria-labelledby": ariaLabelledBy,
  className,
  defaultValue,
  disabled,
  label,
  name,
  onValueChange,
  options,
  value,
  ...props
}, ref) {
  const reactId = useId();
  const legendId = `${reactId}-legend`;

  return (
    <fieldset className="vrn-radio-fieldset" disabled={disabled}>
      <legend className="vrn-radio-group__legend" id={legendId}>{label}</legend>
      <RadioGroupPrimitive.Root
        {...props}
        ref={ref}
        aria-labelledby={ariaLabelledBy ?? legendId}
        className={clsx("vrn-radio-group", className)}
        defaultValue={defaultValue}
        disabled={disabled}
        name={name}
        onValueChange={onValueChange}
        value={value}
      >
        {options.map((option, index) => {
          const optionId = `${reactId}-option-${index}`;
          const labelId = `${optionId}-label`;
          const descriptionId = option.description === undefined ? undefined : `${optionId}-description`;

          return (
            <label className="vrn-radio-card" data-disabled={option.disabled ? "true" : undefined} htmlFor={optionId} key={option.value}>
              <RadioGroupPrimitive.Item
                aria-describedby={descriptionId}
                aria-labelledby={labelId}
                className="vrn-radio"
                disabled={option.disabled}
                id={optionId}
                value={option.value}
              >
                <RadioGroupPrimitive.Indicator className="vrn-radio__indicator" />
              </RadioGroupPrimitive.Item>
              <span className="vrn-radio-card__copy">
                <span className="vrn-radio-card__label" id={labelId}>{option.label}</span>
                {option.description === undefined ? null : (
                  <span className="vrn-radio-card__description" id={descriptionId}>{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
});

export const NextSwitch = forwardRef<HTMLButtonElement, NextSwitchProps>(function NextSwitch({
  "aria-labelledby": ariaLabelledBy,
  className,
  disabled,
  id,
  label,
  ...props
}, ref) {
  const reactId = useId();
  const controlId = id ?? `${reactId}-control`;
  const labelId = `${reactId}-label`;

  return (
    <label className="vrn-switch-row" data-disabled={disabled ? "true" : undefined} htmlFor={controlId}>
      <span className="vrn-switch-row__label" id={labelId}>{label}</span>
      <SwitchPrimitive.Root
        {...props}
        ref={ref}
        aria-labelledby={ariaLabelledBy ?? labelId}
        className={clsx("vrn-switch", className)}
        disabled={disabled}
        id={controlId}
      >
        <span aria-hidden="true" className="vrn-switch__track" />
        <SwitchPrimitive.Thumb className="vrn-switch__thumb" />
      </SwitchPrimitive.Root>
    </label>
  );
});
