"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: string;
  src?: string;
  fallback?: string;
  size?: AvatarSize;
};

const ignoredNameParts = new Set(["de", "del", "la", "las", "los", "y"]);

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
  const meaningful = parts.filter((part) => !ignoredNameParts.has(part.toLocaleLowerCase("es")));
  const selected = (meaningful.length > 0 ? meaningful : parts).slice(0, 2);

  return selected.map((part) => Array.from(part)[0]?.toLocaleUpperCase("es") ?? "").join("");
}

export function Avatar({
  className,
  fallback,
  name,
  size = "md",
  src,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={cn("vr-avatar", className)}
      data-vr-size={size}
    >
      {src ? <AvatarPrimitive.Image alt={name} className="vr-avatar__image" src={src} /> : null}
      <AvatarPrimitive.Fallback className="vr-avatar__fallback" delayMs={0}>
        {fallback ?? getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export type AvatarPerson = {
  id: string;
  name: string;
  src?: string;
  fallback?: string;
};
