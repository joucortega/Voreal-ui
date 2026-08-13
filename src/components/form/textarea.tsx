import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  const fieldProps = useFieldControl(props);
  return <textarea {...props} {...fieldProps} className={cn("vr-textarea", className)} ref={ref} />;
});
