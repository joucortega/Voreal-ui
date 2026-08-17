import { ImageOff } from "../../icons";
import type { NextDirectoryMediaProps } from "./directory.types";

const DEFAULT_SIZES =
  "(max-width: 47.99rem) calc(100vw - 2rem), (max-width: 74.99rem) calc(50vw - 3rem), 22rem";

export function NextDirectoryMedia({ ImageComponent = "img", image, name, sizes = DEFAULT_SIZES }: NextDirectoryMediaProps) {
  return (
    <div className="vrn-directory-card__media">
      {image ? (
        <ImageComponent
          alt={image.alt}
          className="vrn-directory-card__image"
          height={image.height}
          loading="lazy"
          sizes={sizes}
          src={image.src}
          width={image.width}
        />
      ) : (
        <div aria-label={`Imagen no disponible para ${name}`} className="vrn-directory-card__fallback" role="img">
          <ImageOff aria-hidden="true" className="vrn-directory-card__fallback-icon vrn-icon" />
        </div>
      )}
    </div>
  );
}
