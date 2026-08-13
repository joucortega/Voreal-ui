import type { FormHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type AdminFiltersProps = FormHTMLAttributes<HTMLFormElement> & {
  actions?: ReactNode;
  label?: string;
};

export function AdminFilters({
  actions,
  children,
  className,
  label = "Filtros administrativos",
  onSubmit,
  ...props
}: AdminFiltersProps) {
  return (
    <form
      {...props}
      aria-label={label}
      className={cn("vr-admin-filters", className)}
      onSubmit={(event) => {
        if (!onSubmit) event.preventDefault();
        onSubmit?.(event);
      }}
      role="search"
    >
      <div className="vr-admin-filters__fields">{children}</div>
      {actions ? <div className="vr-admin-filters__actions">{actions}</div> : null}
    </form>
  );
}
