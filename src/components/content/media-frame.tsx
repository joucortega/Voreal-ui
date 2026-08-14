import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type MediaFrameProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  alt?: string;
  aspectRatio?: CSSProperties["aspectRatio"];
  children?: ReactNode;
  fallback?: ReactNode;
  fit?: CSSProperties["objectFit"];
};

/** Server-safe aspect-ratio frame for optimized images such as `next/image`. */
export function MediaFrame({
  alt,
  aspectRatio = "4 / 3",
  children,
  className,
  fallback,
  fit = "cover",
  style,
  ...props
}: MediaFrameProps) {
  const hasMedia = children !== undefined && children !== null;
  return (
    <span
      {...props}
      className={cn("vr-media", className)}
      data-has-media={hasMedia ? "true" : "false"}
      style={{ ...style, aspectRatio, "--vr-media-fit": fit } as CSSProperties}
    >
      <span
        aria-hidden={hasMedia || !alt ? true : undefined}
        aria-label={!hasMedia && alt ? alt : undefined}
        className="vr-media__fallback"
        role={!hasMedia && alt ? "img" : undefined}
      >
        {fallback ?? "Sin imagen"}
      </span>
      {hasMedia ? <span className="vr-media__content">{children}</span> : null}
    </span>
  );
}
