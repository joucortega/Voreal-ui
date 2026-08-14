import { Badge, Card } from "../../components/content";
import { ArrowRightIcon } from "../../icons";

export type AdSlotProps = {
  advertiser: string;
  description?: string;
  href: string;
  title: string;
};

export function AdSlot({ advertiser, description, href, title }: AdSlotProps) {
  return (
    <Card aria-label={`Anuncio de ${advertiser}`} className="vr-ad-slot" elevation="none" role="complementary">
      <div className="vr-ad-slot__copy">
        <Badge>Patrocinado</Badge>
        <span className="vr-ad-slot__advertiser">{advertiser}</span>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
      </div>
      <a aria-label={`Ver anuncio de ${advertiser}`} className="vr-ad-slot__link" href={href}>Conocer más <ArrowRightIcon /></a>
    </Card>
  );
}
