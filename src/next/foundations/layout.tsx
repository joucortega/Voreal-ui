import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactElement, type Ref } from "react";

export type NextContainerProps = HTMLAttributes<HTMLDivElement>;
export type NextStackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "1" | "2" | "3" | "4" | "5" | "6";
};
export type NextClusterProps = HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end";
  justify?: "start" | "between" | "end";
};
export type NextGridProps = HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 };
export type NextDividerProps = HTMLAttributes<HTMLHRElement>;
export type NextSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "raised";
  padding?: "none" | "sm" | "md" | "lg";
};
export type NextSectionProps = HTMLAttributes<HTMLElement> & { as?: "section" | "div" };

export function NextContainer({ className, ...props }: NextContainerProps): ReactElement {
  return <div {...props} className={clsx("vrn-container", className)} />;
}

export function NextStack({ className, gap = "4", ...props }: NextStackProps): ReactElement {
  return <div {...props} className={clsx("vrn-stack", className)} data-gap={gap} />;
}

export function NextCluster({ className, align, justify, ...props }: NextClusterProps): ReactElement {
  return (
    <div
      {...props}
      className={clsx("vrn-cluster", className)}
      data-align={align}
      data-justify={justify}
    />
  );
}

export function NextGrid({ className, columns = 1, ...props }: NextGridProps): ReactElement {
  return <div {...props} className={clsx("vrn-grid", className)} data-columns={columns} />;
}

export function NextDivider({ className, ...props }: NextDividerProps): ReactElement {
  return <hr {...props} className={clsx("vrn-divider", className)} />;
}

export const NextSurface = forwardRef<HTMLDivElement, NextSurfaceProps>(function NextSurface(
  {
  className,
  padding = "md",
  tone = "default",
  ...props
  },
  ref,
): ReactElement {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx("vrn-surface", className)}
      data-padding={padding}
      data-tone={tone}
    />
  );
});

export const NextSection = forwardRef<HTMLElement, NextSectionProps>(function NextSection(
  { as: Component = "section", className, ...props },
  ref,
): ReactElement {
  if (Component === "div") {
    return <div {...props} ref={ref as Ref<HTMLDivElement>} className={clsx("vrn-section", className)} />;
  }

  return <section {...props} ref={ref} className={clsx("vrn-section", className)} />;
});
