import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type DefinitionItem = {
  description: ReactNode;
  term: ReactNode;
};

export type DefinitionListProps = HTMLAttributes<HTMLDListElement> & {
  items: readonly DefinitionItem[];
};

export function DefinitionList({ className, items, ...props }: DefinitionListProps) {
  return (
    <dl {...props} className={cn("vr-definition-list", className)}>
      {items.map((item, index) => (
        <div className="vr-definition-list__item" key={index}>
          <dt className="vr-definition-list__term">{item.term}</dt>
          <dd className="vr-definition-list__description">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
