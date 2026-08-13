import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type PublicationState = "archived" | "draft" | "pending" | "published";

const statusContent: Record<PublicationState, { accessible: string; label: string }> = {
  archived: { accessible: "Estado archivado", label: "Archivado" },
  draft: { accessible: "Estado borrador", label: "Borrador" },
  pending: { accessible: "Estado pendiente de revisión", label: "Pendiente" },
  published: { accessible: "Estado publicado", label: "Publicado" },
};

export type PublicationStatusProps = HTMLAttributes<HTMLSpanElement> & {
  status: PublicationState;
};

export function PublicationStatus({ className, status, ...props }: PublicationStatusProps) {
  const content = statusContent[status];
  return (
    <span
      {...props}
      aria-label={content.accessible}
      className={cn("vr-publication-status", className)}
      data-status={status}
    >
      <span aria-hidden="true" className="vr-publication-status__dot" />
      {content.label}
    </span>
  );
}
