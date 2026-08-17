import clsx from "clsx";
import { cloneElement, forwardRef, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { LoaderCircle } from "../../icons";

export type NextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export type NextIconButtonProps = Omit<NextButtonProps, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
};

function normalizeIcon(icon: ReactNode): ReactNode {
  if (!isValidElement(icon)) return icon;
  const element = icon as ReactElement<{ className?: string }>;
  return cloneElement(element, { className: clsx("vrn-icon", element.props.className) });
}

export const NextButton = forwardRef<HTMLButtonElement, NextButtonProps>(function NextButton(
  { className, disabled, endIcon, loading = false, size = "md", startIcon, type = "button", variant = "primary", children, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      className={clsx("vrn-button", className)}
      data-size={size}
      data-variant={variant}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="vrn-icon vrn-button__loader" /> : null}
      {startIcon ? <span className="vrn-button__icon">{normalizeIcon(startIcon)}</span> : null}
      <span className="vrn-button__label">{children}</span>
      {endIcon ? <span className="vrn-button__icon">{normalizeIcon(endIcon)}</span> : null}
    </button>
  );
});

export const NextIconButton = forwardRef<HTMLButtonElement, NextIconButtonProps>(function NextIconButton(
  { children, className, label, ...props },
  ref,
) {
  return (
    <NextButton {...props} ref={ref} aria-label={label} className={clsx("vrn-icon-button", className)}>
      {normalizeIcon(children)}
    </NextButton>
  );
});
