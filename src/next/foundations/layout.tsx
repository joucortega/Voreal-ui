import clsx from "clsx";
import type { HTMLAttributes, ReactElement } from "react";

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
