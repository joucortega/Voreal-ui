import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  max?: number;
  showValue?: boolean;
  value?: number;
};

export function Progress({
  className,
  label,
  max = 100,
  showValue = false,
  value,
  ...props
}: ProgressProps) {
  const determinate = typeof value === "number";
  const safeValue = determinate ? Math.min(Math.max(0, value), max) : undefined;
  const percentage = determinate && max > 0 ? `${(safeValue! / max) * 100}%` : undefined;
  return (
    <div className={cn("vr-progress-wrap", className)}>
      <div
        {...props}
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="vr-progress"
        role="progressbar"
      >
        <span className="vr-progress__bar" data-indeterminate={!determinate ? "true" : undefined} style={{ inlineSize: percentage }} />
      </div>
      {showValue && determinate ? <span className="vr-progress__value">{Math.round((safeValue! / max) * 100)}%</span> : null}
    </div>
  );
}
