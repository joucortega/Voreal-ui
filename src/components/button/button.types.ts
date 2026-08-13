import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";
export type ButtonDensity = "comfortable" | "compact";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  density?: ButtonDensity;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export type IconButtonProps = Omit<ButtonProps, "aria-label" | "size"> & {
  label: string;
  size?: Extract<ButtonSize, "sm" | "md" | "lg" | "icon">;
};

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  connected?: boolean;
  orientation?: "horizontal" | "vertical";
};
