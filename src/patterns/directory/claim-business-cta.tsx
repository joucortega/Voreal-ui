import { LinkedCta } from "../../components/button";

export type ClaimBusinessCtaProps = {
  businessName: string;
  href: string;
};

export function ClaimBusinessCta({ businessName, href }: ClaimBusinessCtaProps) {
  return (
    <LinkedCta
      action={<a className="vr-directory-action" href={href}>Reclamar perfil</a>}
      description={`Confirma que representas a ${businessName}, actualiza sus datos y conecta con más clientes.`}
      eyebrow="Para propietarios"
      title="¿Este es tu negocio?"
    />
  );
}
