import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";
import { Avatar, type AvatarSize } from "./avatar";

export type IdentityCapsuleProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  action?: ReactNode;
  avatarSize?: AvatarSize;
  fallback?: string;
  name: string;
  src?: string;
  status?: string;
  subtitle?: ReactNode;
};

export function IdentityCapsule({
  action,
  avatarSize = "md",
  className,
  fallback,
  name,
  src,
  status,
  subtitle,
  ...props
}: IdentityCapsuleProps) {
  return (
    <div
      {...props}
      aria-label={`Identidad de ${name}`}
      className={cn("vr-identity-capsule", className)}
      role="group"
    >
      <Avatar fallback={fallback} name={name} size={avatarSize} src={src} />
      <span className="vr-identity-capsule__copy">
        <strong className="vr-identity-capsule__name">{name}</strong>
        {subtitle ? <span className="vr-identity-capsule__subtitle">{subtitle}</span> : null}
        {status ? (
          <span aria-label={`Estado: ${status}`} className="vr-identity-capsule__status">
            <span aria-hidden="true" className="vr-identity-capsule__status-mark" />
            {status}
          </span>
        ) : null}
      </span>
      {action ? <span className="vr-identity-capsule__action">{action}</span> : null}
    </div>
  );
}
