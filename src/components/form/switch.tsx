"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type SwitchProps = Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "children"> & {
  description?: ReactNode;
  label: ReactNode;
};

export function Switch({ className, description, id, label, ...props }: SwitchProps) {
  const reactId = useId().replaceAll(":", "");
  const controlId = id ?? `vr-switch-${reactId}`;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const fieldProps = useFieldControl({
    ...props,
    id: controlId,
    "aria-describedby": descriptionId,
    "aria-labelledby": labelId,
  });

  return (
    <div className={cn("vr-choice vr-choice--switch", className)}>
      <span className="vr-choice__copy">
        <LabelPrimitive.Root className="vr-choice__label" htmlFor={controlId} id={labelId}>
          {label}
        </LabelPrimitive.Root>
        {description ? <span className="vr-choice__description" id={descriptionId}>{description}</span> : null}
      </span>
      <SwitchPrimitive.Root {...props} {...fieldProps} className="vr-switch">
        <SwitchPrimitive.Thumb className="vr-switch__thumb" />
      </SwitchPrimitive.Root>
    </div>
  );
}
