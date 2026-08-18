import clsx from "clsx";
import type { HTMLAttributes, ReactElement } from "react";

export type NextHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "page" | "section" | "card";
};
export type NextTextProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span";
  tone?: "default" | "muted";
};
export type NextCaptionProps = HTMLAttributes<HTMLSpanElement>;

export function NextHeading({ className, as = "h2", size = "section", ...props }: NextHeadingProps): ReactElement {
  const Element = as;
  return <Element {...props} className={clsx("vrn-heading", className)} data-size={size} />;
}

export function NextText({ className, as = "p", tone = "default", ...props }: NextTextProps): ReactElement {
  const Element = as;
  return <Element {...props} className={clsx("vrn-text", className)} data-tone={tone} />;
}

export function NextCaption({ className, ...props }: NextCaptionProps): ReactElement {
  return <span {...props} className={clsx("vrn-caption", className)} />;
}
