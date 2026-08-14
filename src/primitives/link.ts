import type { AnchorHTMLAttributes, ElementType } from "react";

export type VorealLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

export type VorealLinkComponent = ElementType<VorealLinkProps>;
