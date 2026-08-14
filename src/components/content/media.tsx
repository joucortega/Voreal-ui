"use client";

import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from "react";
import { MediaFrame } from "./media-frame";

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
    <MediaFrame alt={alt} aspectRatio={aspectRatio} className={className} fallback={fallback} fit={fit}>
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
    </MediaFrame>
  );
}
