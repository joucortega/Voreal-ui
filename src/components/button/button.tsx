import { forwardRef } from "react";
import { cn } from "../../utilities/cn";
import { buttonVariants } from "./button.styles";
import type { ButtonGroupProps, ButtonProps, IconButtonProps } from "./button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    density,
    disabled,
    endIcon,
    loading = false,
    size,
    startIcon,
    type = "button",
    variant,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ size, variant }), className)}
      data-vr-density={density}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <span aria-hidden="true" className="vr-button__spinner" /> : null}
      {!loading && startIcon ? (
        <span aria-hidden="true" className="vr-button__icon">
          {startIcon}
        </span>
      ) : null}
      <span className="vr-button__label">{children}</span>
      {!loading && endIcon ? (
        <span aria-hidden="true" className="vr-button__icon">
          {endIcon}
        </span>
      ) : null}
    </button>
  );
});

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, label, size = "icon", ...props },
  ref,
) {
  return (
    <Button {...props} ref={ref} aria-label={label} className={cn("vr-icon-button", props.className)} size={size}>
      <span aria-hidden="true" className="vr-icon-button__glyph">
        {children}
      </span>
    </Button>
  );
});

export function ButtonGroup({
  children,
  className,
  connected = true,
  label,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      aria-label={label}
      className={cn("vr-button-group", className)}
      data-vr-connected={connected ? "true" : "false"}
      data-vr-orientation={orientation}
      role="group"
    >
      {children}
    </div>
  );
}
