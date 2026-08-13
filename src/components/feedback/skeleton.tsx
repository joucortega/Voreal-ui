import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  aspectRatio?: CSSProperties["aspectRatio"];
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
};

export function Skeleton({
  "aria-label": ariaLabel,
  aspectRatio,
  className,
  height,
  style,
  width,
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-live={ariaLabel ? "polite" : undefined}
      className={cn("vr-skeleton", className)}
      role={ariaLabel ? "status" : undefined}
      style={{ ...style, aspectRatio, height, width }}
    />
  );
}
