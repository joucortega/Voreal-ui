"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utilities/cn";

type FieldContextValue = {
  controlId: string;
  describedBy?: string;
  errorId?: string;
  hintId?: string;
  invalid: boolean;
  labelId: string;
  required: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  label: ReactNode;
  required?: boolean;
};

function appendTokens(...values: Array<string | undefined>): string | undefined {
  const tokens = values.flatMap((value) => value?.split(/\s+/u).filter(Boolean) ?? []);
  return tokens.length > 0 ? Array.from(new Set(tokens)).join(" ") : undefined;
}

export function useFieldControl(props: {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-labelledby"?: string;
  id?: string;
  required?: boolean;
} = {}) {
  const field = useContext(FieldContext);

  return {
    id: props.id ?? field?.controlId,
    "aria-describedby": appendTokens(props["aria-describedby"], field?.describedBy),
    "aria-invalid": props["aria-invalid"] ?? (field?.invalid ? true : undefined),
    "aria-labelledby": appendTokens(props["aria-labelledby"], field?.labelId),
    required: props.required ?? field?.required,
  };
}

export function Field({
  children,
  className,
  error,
  hint,
  label,
  required = false,
  ...props
}: FieldProps) {
  const reactId = useId().replaceAll(":", "");
  const baseId = `vr-field-${reactId}`;
  const controlId = `${baseId}-control`;
  const labelId = `${baseId}-label`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = appendTokens(hintId, errorId);

  return (
    <FieldContext.Provider
      value={{
        controlId,
        describedBy,
        errorId,
        hintId,
        invalid: Boolean(error),
        labelId,
        required,
      }}
    >
      <div {...props} className={cn("vr-field", className)} data-invalid={error ? "true" : undefined}>
        <LabelPrimitive.Root className="vr-field__label" htmlFor={controlId} id={labelId}>
          {label}
          {required ? <span aria-hidden="true" className="vr-field__required"> *</span> : null}
        </LabelPrimitive.Root>
        <div className="vr-field__control">{children}</div>
        <div className="vr-field__messages">
          {hint ? <span className="vr-field__hint" id={hintId}>{hint}</span> : null}
          {error ? <span className="vr-field__error" id={errorId}>{error}</span> : null}
        </div>
      </div>
    </FieldContext.Provider>
  );
}
