import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type AlertVariant = "danger" | "info" | "success" | "warning";
export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  variant?: AlertVariant;
};

export function Alert({
  action,
  className,
  description,
  icon,
  role,
  title,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      {...props}
      className={cn("vr-alert", className)}
      data-variant={variant}
      role={role ?? (variant === "danger" ? "alert" : "status")}
    >
      {icon ? <span aria-hidden="true" className="vr-alert__icon">{icon}</span> : null}
      <span className="vr-alert__copy">
        <strong className="vr-alert__title">{title}</strong>
        {description ? <span className="vr-alert__description">{description}</span> : null}
      </span>
      {action ? <span className="vr-alert__action">{action}</span> : null}
    </div>
  );
}
