"use client";

import { useState } from "react";
import { cn } from "../../utilities/cn";
import { Avatar, type AvatarPerson, type AvatarSize } from "./avatar";

export type AvatarWeaveProps = {
  className?: string;
  label?: string;
  max?: number;
  onOverflowClick?: () => void;
  people: readonly AvatarPerson[];
  size?: AvatarSize;
};

export function AvatarWeave({
  className,
  label = "Personas",
  max = 4,
  onOverflowClick,
  people,
  size = "md",
}: AvatarWeaveProps) {
  const [expanded, setExpanded] = useState(false);
  const safeMax = Math.max(0, max);
  const visible = people.slice(0, safeMax);
  const hidden = people.slice(safeMax);
  const overflowLabel = `${hidden.length} ${hidden.length === 1 ? "persona más" : "personas más"}`;

  function toggleOverflow() {
    setExpanded((current) => !current);
    onOverflowClick?.();
  }

  return (
    <div className={cn("vr-avatar-weave", className)}>
      <ul aria-label={label} className="vr-avatar-weave__list">
        {visible.map((person) => (
          <li aria-label={person.name} className="vr-avatar-weave__person" key={person.id}>
            <Avatar {...person} size={size} />
          </li>
        ))}
      </ul>
      {hidden.length > 0 ? (
        <div className="vr-avatar-weave__overflow-wrap">
          <button
            aria-expanded={expanded}
            aria-label={overflowLabel}
            className="vr-avatar-weave__overflow"
            onClick={toggleOverflow}
            type="button"
          >
            +{hidden.length}
          </button>
          {expanded ? (
            <ul aria-label="Personas adicionales" className="vr-avatar-weave__overflow-list">
              {hidden.map((person) => (
                <li key={person.id}>{person.name}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
