import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  change?: ReactNode;
  label: ReactNode;
  supportingText?: ReactNode;
  value: ReactNode;
};

export function StatCard({
  change,
  className,
  label,
  supportingText,
  value,
  ...props
}: StatCardProps) {
  return (
    <div {...props} className={cn("vr-stat-card", className)}>
      <span className="vr-stat-card__label">{label}</span>
      <strong className="vr-stat-card__value">{value}</strong>
      {change ? <span className="vr-stat-card__change">{change}</span> : null}
      {supportingText ? <span className="vr-stat-card__supporting">{supportingText}</span> : null}
    </div>
  );
}
