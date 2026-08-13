import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

export type BusinessContactProps = HTMLAttributes<HTMLElement> & {
  address?: string;
  directionsHref?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export function BusinessContact({
  address,
  className,
  directionsHref,
  email,
  phone,
  website,
  ...props
}: BusinessContactProps) {
  return (
    <section {...props} className={cn("vr-business-contact", className)}>
      <h2>Contacto</h2>
      <dl className="vr-business-contact__list">
        {phone ? <div><dt>Teléfono</dt><dd><a href={`tel:${phone}`}>{phone}</a></dd></div> : null}
        {email ? <div><dt>Correo</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div> : null}
        {website ? <div><dt>Sitio web</dt><dd><a href={website}>{website}</a></dd></div> : null}
        {address ? <div><dt>Dirección</dt><dd>{address}</dd></div> : null}
      </dl>
      {directionsHref ? <a className="vr-directory-action" href={directionsHref}>Cómo llegar</a> : null}
    </section>
  );
}
