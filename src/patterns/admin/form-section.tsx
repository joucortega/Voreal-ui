import type { FieldsetHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type FormSectionProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "title"> & {
  description?: ReactNode;
  title: ReactNode;
};

export function FormSection({ children, className, description, title, ...props }: FormSectionProps) {
  return (
    <fieldset {...props} className={cn("vr-form-section", className)}>
      <legend>{title}</legend>
      {description ? <p className="vr-form-section__description">{description}</p> : null}
      <div className="vr-form-section__fields">{children}</div>
    </fieldset>
  );
}
