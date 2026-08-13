import { cn } from "../../utilities/cn";
import { Avatar, type AvatarPerson } from "./avatar";
import { AvatarWeave } from "./avatar-group";

export type CommunityHubProps = {
  center: AvatarPerson;
  className?: string;
  onOverflowClick?: () => void;
  people: readonly AvatarPerson[];
};

export function CommunityHub({
  center,
  className,
  onOverflowClick,
  people,
}: CommunityHubProps) {
  return (
    <div
      aria-label={`Comunidad de ${center.name}`}
      className={cn("vr-community-hub", className)}
      role="group"
    >
      <span aria-hidden="true" className="vr-community-hub__orbit" />
      <div className="vr-community-hub__center">
        <Avatar {...center} size="xl" />
        <strong>{center.name}</strong>
      </div>
      <AvatarWeave
        className="vr-community-hub__people"
        label={`Personas conectadas con ${center.name}`}
        max={4}
        onOverflowClick={onOverflowClick}
        people={people}
        size="sm"
      />
    </div>
  );
}
