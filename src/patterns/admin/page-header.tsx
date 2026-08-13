import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export function PageHeader({
  actions,
  breadcrumbs,
  className,
  description,
  eyebrow,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header {...props} className={cn("vr-page-header", className)}>
      <div className="vr-page-header__copy">
        {breadcrumbs}
        {eyebrow ? <span className="vr-page-header__eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="vr-page-header__actions">{actions}</div> : null}
    </header>
  );
}
