import type { ReactNode } from "react";
import { NextIconButton } from "../../components/actions";
import { NextDrawer } from "../../components/overlays";
import { Menu } from "../../icons";

export type NextDirectoryMobileNavProps = {
  children: ReactNode;
  theme?: string;
};

export function NextDirectoryMobileNav({ children, theme }: NextDirectoryMobileNavProps) {
  return (
    <NextDrawer
      side="right"
      theme={theme}
      title="Navegación"
      trigger={
        <NextIconButton className="vrn-directory-mobile-nav__trigger" label="Abrir navegación" variant="secondary">
          <Menu />
        </NextIconButton>
      }
    >
      <div className="vrn-directory-mobile-nav__links">{children}</div>
    </NextDrawer>
  );
}
