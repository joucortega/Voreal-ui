import { cva } from "class-variance-authority";

export const buttonVariants = cva("vr-button", {
  variants: {
    variant: {
      primary: "vr-button--primary",
      secondary: "vr-button--secondary",
      outline: "vr-button--outline",
      ghost: "vr-button--ghost",
      danger: "vr-button--danger",
      link: "vr-button--link",
    },
    size: {
      sm: "vr-button--sm",
      md: "vr-button--md",
      lg: "vr-button--lg",
      icon: "vr-button--icon",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
