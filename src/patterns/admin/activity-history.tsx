import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type ActivityHistoryItem = {
  actor?: ReactNode;
  at: ReactNode;
  dateTime?: string;
  description: ReactNode;
  id: string;
};

export type ActivityHistoryProps = HTMLAttributes<HTMLOListElement> & {
  items: readonly ActivityHistoryItem[];
  label?: string;
};

export function ActivityHistory({
  className,
  items,
  label = "Historial de actividad",
  ...props
}: ActivityHistoryProps) {
  return (
    <ol {...props} aria-label={label} className={cn("vr-activity-history", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <span aria-hidden="true" className="vr-activity-history__marker" />
          <div>
            <p>{item.description}</p>
            <span className="vr-activity-history__meta">
              {item.actor ? <strong>{item.actor}</strong> : null}
              {item.actor ? <span aria-hidden="true"> · </span> : null}
              <time dateTime={item.dateTime}>{item.at}</time>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
