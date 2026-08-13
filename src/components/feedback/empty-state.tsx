import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div {...props} className={cn("vr-state", className)}>
      {icon ? <span aria-hidden="true" className="vr-state__icon">{icon}</span> : null}
      <strong className="vr-state__title">{title}</strong>
      {description ? <p className="vr-state__description">{description}</p> : null}
      {action ? <div className="vr-state__action">{action}</div> : null}
    </div>
  );
}
