import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type BreadcrumbItem = {
  href?: string;
  label: ReactNode;
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href">;
};

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  items: readonly BreadcrumbItem[];
  label?: string;
};

export function Breadcrumbs({
  className,
  items,
  label = "Breadcrumb",
  ...props
}: BreadcrumbsProps) {
  return (
    <nav {...props} aria-label={label} className={cn("vr-breadcrumbs", className)}>
      <ol className="vr-breadcrumbs__list">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li className="vr-breadcrumbs__item" key={`${index}-${String(item.href)}`}>
              {index > 0 ? <span aria-hidden="true" className="vr-breadcrumbs__separator">›</span> : null}
              {item.href && !current ? (
                <a {...item.linkProps} className={cn("vr-breadcrumbs__link", item.linkProps?.className)} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span aria-current={current ? "page" : undefined} className="vr-breadcrumbs__current">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
