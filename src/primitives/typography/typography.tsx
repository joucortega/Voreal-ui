import { cva, type VariantProps } from "class-variance-authority";
import { createElement, type HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

const typeVariants = cva("", {
  variants: {
    size: {
      xs: "vr-type-xs",
      sm: "vr-type-sm",
      md: "vr-type-md",
      lg: "vr-type-lg",
      xl: "vr-type-xl",
      "2xl": "vr-type-2xl",
      "3xl": "vr-type-3xl",
      display: "vr-type-display",
    },
    tone: {
      default: "vr-tone-default",
      muted: "vr-tone-muted",
      strong: "vr-tone-strong",
      danger: "vr-tone-danger",
      success: "vr-tone-success",
    },
    weight: {
      regular: "vr-weight-regular",
      medium: "vr-weight-medium",
      semibold: "vr-weight-semibold",
      bold: "vr-weight-bold",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
    weight: "regular",
  },
});

type TypeVariantProps = VariantProps<typeof typeVariants>;
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const defaultHeadingSize: Record<HeadingLevel, NonNullable<TypeVariantProps["size"]>> = {
  1: "display",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "md",
};

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  Pick<TypeVariantProps, "size" | "tone"> & {
    level: HeadingLevel;
  };

export function Heading({ className, level, size, tone = "strong", ...props }: HeadingProps) {
  return createElement(`h${level}`, {
    ...props,
    className: cn(
      "vr-heading",
      typeVariants({ size: size ?? defaultHeadingSize[level], tone, weight: "bold" }),
      className,
    ),
  });
}

export type TextProps = HTMLAttributes<HTMLParagraphElement> & TypeVariantProps;

export function Text({ className, size, tone, weight, ...props }: TextProps) {
  return <p {...props} className={cn("vr-text", typeVariants({ size, tone, weight }), className)} />;
}

export type CaptionProps = HTMLAttributes<HTMLSpanElement> &
  Pick<TypeVariantProps, "tone" | "weight">;

export function Caption({ className, tone = "muted", weight, ...props }: CaptionProps) {
  return (
    <span
      {...props}
      className={cn("vr-caption", typeVariants({ size: "xs", tone, weight }), className)}
    />
  );
}
