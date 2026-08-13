import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  const fieldProps = useFieldControl(props);
  return <input {...props} {...fieldProps} className={cn("vr-input", className)} ref={ref} />;
});
