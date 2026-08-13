import type { HTMLAttributes } from "react";
import { Media } from "../../components/content";
import { cn } from "../../utilities/cn";
import type { DirectoryImage } from "./types";

export type BusinessGalleryProps = HTMLAttributes<HTMLDivElement> & {
  images: readonly DirectoryImage[];
  label?: string;
};

export function BusinessGallery({
  className,
  images,
  label = "Galería del negocio",
  ...props
}: BusinessGalleryProps) {
  const slots = images.length > 0 ? images.slice(0, 5) : [{ alt: "Imagen no disponible", fallback: "RL" }];
  return (
    <div {...props} aria-label={label} className={cn("vr-business-gallery", className)} role="region">
      {slots.map((image, index) => (
        <Media
          {...image}
          aspectRatio={index === 0 ? "16 / 10" : "4 / 3"}
          className="vr-business-gallery__item"
          key={`${image.src ?? image.alt}-${index}`}
        />
      ))}
      {images.length > 5 ? <span className="vr-business-gallery__more">+{images.length - 5} fotos</span> : null}
    </div>
  );
}
