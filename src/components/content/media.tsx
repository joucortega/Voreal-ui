"use client";

import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type MediaProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "children"> & {
  aspectRatio?: CSSProperties["aspectRatio"];
  fallback?: ReactNode;
  fit?: CSSProperties["objectFit"];
};

export function Media({
  alt,
  aspectRatio = "4 / 3",
  className,
  fallback,
  fit = "cover",
  onError,
  src,
  style,
  ...props
}: MediaProps) {
  const [failed, setFailed] = useState(!src);
  return (
    <span className={cn("vr-media", className)} style={{ aspectRatio }}>
      <span
        aria-hidden={!failed}
        aria-label={failed ? alt : undefined}
        className="vr-media__fallback"
        role={failed && alt ? "img" : undefined}
      >
        {fallback ?? "Sin imagen"}
      </span>
      {!failed ? (
        <img
          {...props}
          alt={alt}
          className="vr-media__image"
          onError={(event) => {
            setFailed(true);
            onError?.(event);
          }}
          src={src}
          style={{ ...style, objectFit: fit }}
        />
      ) : null}
    </span>
  );
}
