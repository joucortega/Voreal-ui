import { NextDirectoryMobileNav } from "./directory-mobile-nav";
import type {
  NextDirectoryHeaderProps,
  NextDirectoryNavItem,
  VorealNextLinkComponent,
  VorealNextLinkProps,
} from "./directory.types";

export type {
  NextDirectoryHeaderProps,
  NextDirectoryNavItem,
  VorealNextLinkComponent,
  VorealNextLinkProps,
} from "./directory.types";

export function NextDirectoryHeader({
  accountLabel,
  brand,
  descriptor,
  LinkComponent = "a",
  navItems,
  primaryAction,
}: NextDirectoryHeaderProps) {
  const [firstNavItem, ...remainingNavItems] = navItems;

  return (
    <header className="vrn-directory-header">
      <div className="vrn-directory-header__inner">
        <div className="vrn-directory-header__identity">
          <div className="vrn-directory-header__brand">{brand}</div>
          {descriptor ? <span className="vrn-directory-header__descriptor">{descriptor}</span> : null}
        </div>

        <nav aria-label="Navegación principal" className="vrn-directory-header__desktop-nav">
          {firstNavItem ? <DirectoryLink LinkComponent={LinkComponent} item={firstNavItem} /> : null}
          <DirectoryLink LinkComponent={LinkComponent} item={primaryAction} primary />
          {remainingNavItems.map((item) => (
            <DirectoryLink key={item.href} LinkComponent={LinkComponent} item={item} />
          ))}
          {accountLabel ? <span className="vrn-directory-header__account">{accountLabel}</span> : null}
        </nav>

        <div className="vrn-directory-header__mobile-actions">
          <NextDirectoryMobileNav>
            {navItems.map((item) => (
              <DirectoryLink key={item.href} LinkComponent={LinkComponent} item={item} mobile />
            ))}
            {accountLabel ? <span className="vrn-directory-mobile-nav__account">{accountLabel}</span> : null}
          </NextDirectoryMobileNav>
        </div>
      </div>
    </header>
  );
}

type DirectoryLinkProps = {
  item: NextDirectoryNavItem;
  LinkComponent: VorealNextLinkComponent;
  mobile?: boolean;
  primary?: boolean;
};

function DirectoryLink({ item, LinkComponent, mobile = false, primary = false }: DirectoryLinkProps) {
  const className = primary
    ? "vrn-directory-header__primary"
    : mobile
      ? "vrn-directory-mobile-nav__link"
      : "vrn-directory-header__link";

  return (
    <LinkComponent className={className} href={item.href}>
      {item.label}
    </LinkComponent>
  );
}
