import clsx from "clsx";
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

export type NextAlertProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  title: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
};
export type NextProgressProps = HTMLAttributes<HTMLDivElement> & {
  indeterminateLabel?: string;
  label: string;
  max?: number;
  value?: number;
};
export type NextSkeletonProps = HTMLAttributes<HTMLDivElement> & {
  height?: string;
  width?: string;
};
export type NextEmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
};

type SkeletonStyle = CSSProperties & {
  "--vrn-skeleton-height": string;
  "--vrn-skeleton-width": string;
};

function normalizeMax(max: number | undefined): number {
  return typeof max === "number" && Number.isFinite(max) && max > 0 ? max : 100;
}

export const NextAlert = forwardRef<HTMLDivElement, NextAlertProps>(function NextAlert(
  { action, children, className, title, tone = "info", ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={clsx("vrn-alert", className)} data-tone={tone}>
      <div className="vrn-alert__body">
        <div className="vrn-alert__title">{title}</div>
        {children !== undefined && children !== null ? <div className="vrn-alert__description">{children}</div> : null}
      </div>
      {action !== undefined && action !== null ? <div className="vrn-alert__action">{action}</div> : null}
    </div>
  );
});

export const NextProgress = forwardRef<HTMLDivElement, NextProgressProps>(function NextProgress(
  { className, indeterminateLabel = "En progreso", label, max, value, ...props },
  ref,
) {
  const safeMax = normalizeMax(max);
  const isDeterminate = typeof value === "number" && Number.isFinite(value);
  const safeValue = isDeterminate ? Math.min(safeMax, Math.max(0, value)) : undefined;

  return (
    <div {...props} ref={ref} className={clsx("vrn-progress", className)}>
      <span className="vrn-progress__label">{label}</span>
      {safeValue === undefined ? (
        <div
          aria-label={label}
          aria-valuetext={indeterminateLabel}
          className="vrn-progress__track"
          role="progressbar"
        >
          <span className="vrn-progress__indeterminate" />
        </div>
      ) : (
        <progress aria-label={label} className="vrn-progress__native" max={safeMax} value={safeValue} />
      )}
    </div>
  );
});

export const NextSkeleton = forwardRef<HTMLDivElement, NextSkeletonProps>(function NextSkeleton(
  { "aria-hidden": ariaHidden, className, height = "1rem", style, width = "100%", ...props },
  ref,
) {
  const skeletonStyle: SkeletonStyle = {
    ...style,
    "--vrn-skeleton-height": height,
    "--vrn-skeleton-width": width,
  };

  return (
    <div
      {...props}
      ref={ref}
      aria-hidden={ariaHidden ?? true}
      className={clsx("vrn-skeleton", className)}
      style={skeletonStyle}
    />
  );
});

export const NextEmptyState = forwardRef<HTMLDivElement, NextEmptyStateProps>(function NextEmptyState(
  { action, className, description, icon, title, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={clsx("vrn-empty-state", className)}>
      {icon !== undefined && icon !== null ? <div aria-hidden="true" className="vrn-empty-state__icon">{icon}</div> : null}
      <div className="vrn-empty-state__title">{title}</div>
      {description !== undefined && description !== null ? <div className="vrn-empty-state__description">{description}</div> : null}
      {action !== undefined && action !== null ? <div className="vrn-empty-state__action">{action}</div> : null}
    </div>
  );
});
