import type { ReactNode } from "react";
import { Badge, Card, Media } from "../../components/content";
import { cn } from "../../utilities/cn";
import type { BusinessSummary } from "./types";

export type BusinessCardVariant = "compact" | "featured" | "horizontal" | "vertical";
export type BusinessCardProps = {
  action?: ReactNode;
  business: BusinessSummary;
  className?: string;
  variant?: BusinessCardVariant;
};

export function BusinessCard({
  action,
  business,
  className,
  variant = "vertical",
}: BusinessCardProps) {
  const headingId = `vr-business-${business.id}-title`;
  return (
    <Card
      aria-labelledby={headingId}
      className={cn("vr-business-card", className)}
      data-variant={variant}
      elevation={variant === "featured" ? "high" : "low"}
      padding="none"
      role="article"
    >
      <div className="vr-business-card__media">
        <Media
          alt={business.image?.alt ?? `Imagen de ${business.name}`}
          aspectRatio={variant === "compact" ? "1 / 1" : variant === "horizontal" ? "4 / 3" : "16 / 10"}
          fallback={business.image?.fallback ?? business.name.slice(0, 2).toLocaleUpperCase("es")}
          src={business.image?.src}
        />
        {business.status ? <Badge className="vr-business-card__status" variant={business.status.tone ?? "neutral"}>{business.status.label}</Badge> : null}
      </div>
      <div className="vr-business-card__body">
        <div className="vr-business-card__heading">
          <div>
            <h3 className="vr-business-card__title" id={headingId}>{business.name}</h3>
            <p className="vr-business-card__category">{business.category}</p>
          </div>
          {business.verified ? <Badge variant="accent">Verificado</Badge> : null}
        </div>
        <p className="vr-business-card__location">{business.location}</p>
        {business.description ? <p className="vr-business-card__description">{business.description}</p> : null}
        {business.rating !== undefined ? (
          <p aria-label={`${business.rating} de 5 estrellas, ${business.reviewCount ?? 0} reseñas`} className="vr-business-card__rating">
            <span aria-hidden="true">★</span> {business.rating.toFixed(1)} <span>({business.reviewCount ?? 0})</span>
          </p>
        ) : null}
        <div className="vr-business-card__actions">
          <a aria-label={`Ver ${business.name}`} className="vr-business-card__link" href={business.href}>Ver perfil <span aria-hidden="true">→</span></a>
          {action}
        </div>
      </div>
    </Card>
  );
}
