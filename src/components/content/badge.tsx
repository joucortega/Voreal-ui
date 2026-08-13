import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

const badgeStyles = cva("vr-badge", {
  variants: {
    variant: {
      neutral: "vr-badge--neutral",
      accent: "vr-badge--accent",
      success: "vr-badge--success",
      warning: "vr-badge--warning",
      danger: "vr-badge--danger",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeStyles>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span {...props} className={cn(badgeStyles({ variant }), className)} />;
}
