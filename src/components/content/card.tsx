import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
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

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardStyles>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elevation, padding, ...props },
  ref,
) {
  return <div {...props} className={cn(cardStyles({ elevation, padding }), className)} ref={ref} />;
});

export type CardLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof cardStyles>;

export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { className, elevation, padding, ...props },
  ref,
) {
  return <a {...props} className={cn(cardStyles({ elevation, padding }), "vr-card-link", className)} ref={ref} />;
});
