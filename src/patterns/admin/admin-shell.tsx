import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type AdminNavigationItem = {
  href: string;
  icon?: ReactNode;
  label: ReactNode;
  value: string;
};

export type AdminShellProps = HTMLAttributes<HTMLDivElement> & {
  brand?: ReactNode;
  current?: string;
  items: readonly AdminNavigationItem[];
  utility?: ReactNode;
};

export function AdminShell({
  brand = "Voreal",
  children,
  className,
  current,
  items,
  utility,
  ...props
}: AdminShellProps) {
  return (
    <div {...props} className={cn("vr-admin-shell", className)}>
      <aside className="vr-admin-shell__sidebar">
        <div className="vr-admin-shell__brand">{brand}</div>
        <nav aria-label="Administración" className="vr-admin-shell__navigation">
          <ul>
            {items.map((item) => {
              const active = item.value === current;
              return (
                <li key={item.value}>
                  <a
                    aria-current={active ? "page" : undefined}
                    className="vr-admin-shell__link"
                    data-active={active ? "true" : undefined}
                    href={item.href}
                  >
                    {item.icon ? <span aria-hidden="true" className="vr-admin-shell__icon">{item.icon}</span> : null}
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        {utility ? <div className="vr-admin-shell__utility">{utility}</div> : null}
      </aside>
      <div className="vr-admin-shell__workspace">{children}</div>
    </div>
  );
}
