import { NextDirectoryMobileNav } from "./directory-mobile-nav";
import { ChevronRight } from "../../icons";
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
  accountAvatarLabel,
  accountLabel,
  brand,
  descriptor,
  LinkComponent = "a",
  navItems,
  primaryAction,
  theme,
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
          {accountLabel ? <AccountIdentity avatarLabel={accountAvatarLabel} label={accountLabel} /> : null}
        </nav>

        <div className="vrn-directory-header__mobile-actions">
          <NextDirectoryMobileNav theme={theme}>
            {navItems.map((item) => (
              <DirectoryLink key={item.href} LinkComponent={LinkComponent} item={item} mobile />
            ))}
            {accountLabel ? <AccountIdentity avatarLabel={accountAvatarLabel} label={accountLabel} mobile /> : null}
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
      {item.icon ? <span className="vrn-directory-header__nav-icon">{item.icon}</span> : null}
      <span>{item.label}</span>
    </LinkComponent>
  );
}

function AccountIdentity({ avatarLabel, label, mobile = false }: { avatarLabel?: string; label: string; mobile?: boolean }) {
  const visuallyHiddenLabel = Boolean(avatarLabel) && !mobile;

  return (
    <span className={mobile ? "vrn-directory-mobile-nav__account" : "vrn-directory-header__account"}>
      {avatarLabel ? <span aria-hidden="true" className="vrn-directory-header__avatar">{avatarLabel}</span> : null}
      <span
        className="vrn-directory-header__account-label"
        data-visually-hidden={visuallyHiddenLabel || undefined}
      >
        {label}
      </span>
      <ChevronRight aria-hidden="true" className="vrn-directory-header__account-chevron vrn-icon" />
    </span>
  );
}
