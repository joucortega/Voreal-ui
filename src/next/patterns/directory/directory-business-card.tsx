import { NextBadge } from "../../components/status";
import { BadgeCheck, ChevronRight, MapPin, Star } from "../../icons";
import { NextDirectoryMedia } from "./directory-media";
import type { NextDirectoryBusinessCardProps, VorealNextLinkProps } from "./directory.types";

function NativeLink({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} href={href} />;
}

export function NextDirectoryBusinessCard({
  business,
  favoriteControl,
  ImageComponent,
  LinkComponent = NativeLink,
}: NextDirectoryBusinessCardProps) {
  const hasReviews =
    typeof business.rating === "number" &&
    Number.isFinite(business.rating) &&
    business.rating >= 0 &&
    business.rating <= 5 &&
    typeof business.reviewCount === "number" &&
    Number.isSafeInteger(business.reviewCount) &&
    business.reviewCount > 0;
  const reviewLabel = hasReviews
    ? `${business.rating!.toFixed(1)} · ${business.reviewCount!.toLocaleString("es-US")} ${business.reviewCount === 1 ? "reseña" : "reseñas"}`
    : "Sin reseñas";
  const locationLabel = business.distance ? `${business.location} · ${business.distance}` : business.location;

  return (
    <article aria-label={business.name} className="vrn-directory-card">
      <div className="vrn-directory-card__media-wrap">
        <NextDirectoryMedia ImageComponent={ImageComponent} image={business.image} name={business.name} />
        {favoriteControl ? <div className="vrn-directory-card__favorite">{favoriteControl}</div> : null}
      </div>

      <div className="vrn-directory-card__body">
        <p className="vrn-directory-card__category">{business.category}</p>
        <h3 className="vrn-directory-card__name">{business.name}</h3>
        <p aria-hidden={business.description ? undefined : true} className="vrn-directory-card__description">
          {business.description ?? ""}
        </p>

        <p className="vrn-directory-card__location">
          <MapPin aria-hidden="true" className="vrn-directory-card__meta-icon vrn-icon" />
          <span>{locationLabel}</span>
        </p>

        <div className="vrn-directory-card__facts">
          <span className="vrn-directory-card__rating">
            {hasReviews ? <Star aria-hidden="true" className="vrn-directory-card__rating-icon vrn-icon" /> : null}
            <span>{reviewLabel}</span>
          </span>
          {business.status ? (
            <NextBadge className="vrn-directory-card__badge" data-kind={business.status.kind} tone={business.status.kind === "open" ? "success" : business.status.kind === "closing" ? "warning" : "danger"}>
              {business.status.label}
            </NextBadge>
          ) : null}
          {business.verified ? (
            <NextBadge className="vrn-directory-card__badge" tone="success">
              <BadgeCheck aria-hidden="true" className="vrn-icon" />
              Verificado
            </NextBadge>
          ) : null}
        </div>

        <LinkComponent aria-label={`Ver ${business.name}`} className="vrn-directory-card__cta" href={business.href}>
          <span>Ver negocio</span>
          <ChevronRight aria-hidden="true" className="vrn-icon" />
        </LinkComponent>
      </div>
    </article>
  );
}
