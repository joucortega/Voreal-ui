import { Badge, Card } from "../../components/content";
import type { BusinessPromotion } from "./types";

export type PromotionCardProps = { promotion: BusinessPromotion };

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card className="vr-promotion-card" elevation="none">
      <Badge variant="accent">{promotion.eyebrow ?? "Promoción"}</Badge>
      <h3>{promotion.title}</h3>
      {promotion.description ? <p>{promotion.description}</p> : null}
      {promotion.href ? <a href={promotion.href}>Ver promoción <span aria-hidden="true">→</span></a> : null}
    </Card>
  );
}
