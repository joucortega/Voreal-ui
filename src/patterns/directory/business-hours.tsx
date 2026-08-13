import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";
import type { BusinessHour } from "./types";

export type BusinessHoursProps = HTMLAttributes<HTMLElement> & {
  days: readonly BusinessHour[];
  title?: string;
};

export function BusinessHours({
  className,
  days,
  title = "Horario",
  ...props
}: BusinessHoursProps) {
  return (
    <section {...props} className={cn("vr-business-hours", className)}>
      <h2>{title}</h2>
      <dl className="vr-business-hours__list">
        {days.map((entry) => (
          <div className="vr-business-hours__day" key={entry.day}>
            <dt>{entry.day}</dt>
            <dd data-closed={entry.closed ? "true" : undefined}>{entry.closed ? "Cerrado" : entry.hours ?? "Horario no disponible"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
