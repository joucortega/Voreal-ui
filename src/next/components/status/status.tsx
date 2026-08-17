import clsx from "clsx";
import { forwardRef, type HTMLAttributes } from "react";
import { X } from "../../icons";

export type NextTagProps = HTMLAttributes<HTMLSpanElement> & {
  onRemove?: () => void;
  removeLabel?: string;
  tone?: "neutral" | "success";
};
export type NextBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger";
};

export const NextTag = forwardRef<HTMLSpanElement, NextTagProps>(function NextTag(
  { children, className, onRemove, removeLabel = "Quitar etiqueta", tone = "neutral", ...props },
  ref,
) {
  return (
    <span {...props} ref={ref} className={clsx("vrn-tag", className)} data-tone={tone}>
      <span>{children}</span>
      {onRemove ? (
        <button aria-label={removeLabel} className="vrn-tag__remove" onClick={onRemove} type="button">
          <X aria-hidden="true" className="vrn-icon" />
        </button>
      ) : null}
    </span>
  );
});

export const NextBadge = forwardRef<HTMLSpanElement, NextBadgeProps>(function NextBadge(
  { className, tone = "neutral", ...props },
  ref,
) {
  return <span {...props} ref={ref} className={clsx("vrn-badge", className)} data-tone={tone} />;
});
