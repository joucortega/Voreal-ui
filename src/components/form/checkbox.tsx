"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { CheckIcon } from "../../icons";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type CheckboxProps = Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "children"> & {
  description?: ReactNode;
  label: ReactNode;
};

export function Checkbox({ className, description, id, label, ...props }: CheckboxProps) {
  const reactId = useId().replaceAll(":", "");
  const controlId = id ?? `vr-checkbox-${reactId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const fieldProps = useFieldControl({
    ...props,
    id: controlId,
    "aria-describedby": descriptionId,
    "aria-labelledby": labelId,
  });

  return (
    <div className={cn("vr-choice", className)}>
      <CheckboxPrimitive.Root {...props} {...fieldProps} className="vr-checkbox">
        <CheckboxPrimitive.Indicator aria-hidden="true" className="vr-checkbox__indicator">
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="vr-choice__copy">
        <LabelPrimitive.Root className="vr-choice__label" htmlFor={controlId} id={labelId}>
          {label}
        </LabelPrimitive.Root>
        {description ? <span className="vr-choice__description" id={descriptionId}>{description}</span> : null}
      </span>
    </div>
  );
}
