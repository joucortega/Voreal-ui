import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { NextContainer } from "../../foundations";

export type NextDirectoryLayoutProps = {
  children: ReactNode;
  filters: ReactNode;
  header: ReactNode;
  resultsHeader: ReactNode;
  search: ReactNode;
};

export type NextDirectoryCardGridProps = HTMLAttributes<HTMLDivElement>;

export function NextDirectoryLayout({
  children,
  filters,
  header,
  resultsHeader,
  search,
}: NextDirectoryLayoutProps) {
  return (
    <>
      {header}
      <main className="vrn-directory-layout">
        <NextContainer className="vrn-directory-layout__container">
          <div className="vrn-directory-layout__search">{search}</div>
          <div className="vrn-directory-layout__results-header">{resultsHeader}</div>
          <div className="vrn-directory-layout__content">
            <aside aria-label="Filtros" className="vrn-directory-layout__sidebar">
              {filters}
            </aside>
            <section aria-label="Resultados" className="vrn-directory-layout__results">
              {children}
            </section>
          </div>
        </NextContainer>
      </main>
    </>
  );
}

export function NextDirectoryCardGrid({ className, ...props }: NextDirectoryCardGridProps) {
  return <div {...props} className={clsx("vrn-directory-card-grid", className)} />;
}
