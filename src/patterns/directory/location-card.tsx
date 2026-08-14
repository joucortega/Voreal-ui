import type { HTMLAttributes } from "react";
import { Card } from "../../components/content";
import { MapPinIcon } from "../../icons";
import { cn } from "../../utilities/cn";

export type LocationCardProps = HTMLAttributes<HTMLDivElement> & {
  address: string;
  directionsHref?: string;
  mapLabel?: string;
};

export function LocationCard({
  address,
  className,
  directionsHref,
  mapLabel = "Vista aproximada de la ubicación",
  ...props
}: LocationCardProps) {
  return (
    <Card {...props} className={cn("vr-location-card", className)} padding="none">
      <div aria-label={mapLabel} className="vr-location-card__map" role="img">
        <MapPinIcon />
      </div>
      <div className="vr-location-card__body">
        <strong>Ubicación</strong>
        <address>{address}</address>
        {directionsHref ? <a href={directionsHref}>Abrir indicaciones</a> : null}
      </div>
    </Card>
  );
}
