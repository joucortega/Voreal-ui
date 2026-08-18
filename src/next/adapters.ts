import type {
  AnchorHTMLAttributes,
  ElementType,
  ForwardRefExoticComponent,
  ImgHTMLAttributes,
  RefAttributes,
} from "react";

export type VorealNextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };
export type VorealNextLinkComponent = ElementType<VorealNextLinkProps>;
export type VorealNextRefLinkComponent =
  | "a"
  | ForwardRefExoticComponent<VorealNextLinkProps & RefAttributes<HTMLAnchorElement>>;
export type VorealNextImageProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "height" | "loading" | "sizes" | "src" | "width"
> & {
  alt: string;
  height: number;
  src: string;
  width: number;
};
export type VorealNextImageComponent = ElementType<VorealNextImageProps>;
