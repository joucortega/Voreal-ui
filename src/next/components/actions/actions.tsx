import clsx from "clsx";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import type { VorealNextRefLinkComponent } from "../../adapters";
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
export type NextButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  attached?: boolean;
  label: string;
};
export type NextActionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  LinkComponent?: VorealNextRefLinkComponent;
  variant?: NextButtonProps["variant"];
  size?: NextButtonProps["size"];
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

export const NextButtonGroup = forwardRef<HTMLDivElement, NextButtonGroupProps>(function NextButtonGroup(
  { attached = false, className, label, ...props },
  ref,
): ReactElement {
  return (
    <div
      {...props}
      ref={ref}
      aria-label={label}
      className={clsx("vrn-button-group", className)}
      data-attached={attached || undefined}
      role="group"
    />
  );
});

export const NextActionLink = forwardRef<HTMLAnchorElement, NextActionLinkProps>(function NextActionLink(
  { LinkComponent, className, size = "md", variant = "primary", href, ...props },
  ref,
): ReactElement {
  const linkClassName = clsx("vrn-button", "vrn-action-link", className);

  if (LinkComponent) {
    const Link = LinkComponent;

    return (
      <Link
        {...props}
        ref={ref}
        className={linkClassName}
        data-size={size}
        data-variant={variant}
        href={href}
      />
    );
  }

  return (
    <a
      {...props}
      ref={ref}
      className={linkClassName}
      data-size={size}
      data-variant={variant}
      href={href}
    />
  );
});
