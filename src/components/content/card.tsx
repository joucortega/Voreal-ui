import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
  type RefAttributes,
} from "react";
import { cn } from "../../utilities/cn";

const cardStyles = cva("vr-card", {
  variants: {
    elevation: {
      none: "vr-card--flat",
      low: "vr-card--low",
      high: "vr-card--high",
    },
    padding: {
      none: "vr-card--padding-none",
      sm: "vr-card--padding-sm",
      md: "vr-card--padding-md",
      lg: "vr-card--padding-lg",
    },
  },
  defaultVariants: { elevation: "low", padding: "md" },
});

function setRef<Value>(ref: Ref<Value> | undefined, value: Value | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

function composeRefs<Value>(first: Ref<Value> | undefined, second: Ref<Value> | undefined) {
  if (!first) return second;
  if (!second) return first;
  return (value: Value | null) => {
    setRef(first, value);
    setRef(second, value);
  };
}

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardStyles>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elevation, padding, ...props },
  ref,
) {
  return <div {...props} className={cn(cardStyles({ elevation, padding }), className)} ref={ref} />;
});

export type CardLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof cardStyles> & {
  asChild?: boolean;
};

export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { asChild = false, children, className, elevation, padding, ...props },
  ref,
) {
  const mergedClassName = cn(cardStyles({ elevation, padding }), "vr-card-link", className);
  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) throw new Error("CardLink with asChild requires one valid element.");
    const element = child as ReactElement<AnchorHTMLAttributes<HTMLAnchorElement> & RefAttributes<HTMLAnchorElement>>;
    return cloneElement(element, {
      ...props,
      ...element.props,
      className: cn(mergedClassName, element.props.className),
      ref: composeRefs(element.props.ref, ref),
    });
  }
  return <a {...props} className={mergedClassName} ref={ref}>{children}</a>;
});
