import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "../../icons";
import type { VorealNextLinkComponent, VorealNextLinkProps } from "./directory.types";

// Keeps labels compact and all neighbor arithmetic inside a predictable safe range.
const MAX_DIRECTORY_PAGE_COUNT = 10_000;

export type NextDirectoryPaginationProps = {
  currentPage: number;
  getPageHref: (page: number) => string;
  label?: string;
  LinkComponent?: VorealNextLinkComponent;
  pageCount: number;
};

function NativeLink({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} href={href} />;
}

function normalizePageCount(value: number) {
  if (!Number.isFinite(value) || value < 1) return 0;
  if (value >= MAX_DIRECTORY_PAGE_COUNT) return MAX_DIRECTORY_PAGE_COUNT;
  return Math.floor(value);
}

function normalizeCurrentPage(value: number, pageCount: number) {
  if (!Number.isFinite(value)) return 1;
  if (value <= 1) return 1;
  if (value >= pageCount) return pageCount;
  return Math.floor(value);
}

function createPageWindow(currentPage: number, pageCount: number) {
  return [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((left, right) => left - right);
}

export function NextDirectoryPagination({
  currentPage,
  getPageHref,
  label = "Paginación",
  LinkComponent = NativeLink,
  pageCount,
}: NextDirectoryPaginationProps) {
  const normalizedPageCount = normalizePageCount(pageCount);
  if (normalizedPageCount <= 1) return null;

  const page = normalizeCurrentPage(currentPage, normalizedPageCount);
  const pages = createPageWindow(page, normalizedPageCount);

  function edgeControl(controlLabel: string, content: ReactNode, destination: number, disabled: boolean): ReactNode {
    const className = "vrn-directory-pagination__control";
    if (disabled) {
      return <span aria-disabled="true" aria-label={controlLabel} className={className} role="link">{content}</span>;
    }
    return <LinkComponent aria-label={controlLabel} className={className} href={getPageHref(destination)}>{content}</LinkComponent>;
  }

  return (
    <nav aria-label={label} className="vrn-directory-pagination">
      <div className="vrn-directory-pagination__edges">
        {edgeControl("Primera página", <><ChevronLeft className="vrn-icon" /><ChevronLeft className="vrn-icon" /></>, 1, page === 1)}
        {edgeControl("Página anterior", <><ChevronLeft className="vrn-icon" /><span>Anterior</span></>, page - 1, page === 1)}
      </div>
      <ol className="vrn-directory-pagination__pages">
        {pages.map((pageNumber, index) => {
          const previousPage = pages[index - 1];
          return (
            <li className="vrn-directory-pagination__page-item" key={pageNumber}>
              {previousPage && pageNumber - previousPage > 1 ? (
                <span aria-hidden="true" className="vrn-directory-pagination__gap">…</span>
              ) : null}
              <LinkComponent
                aria-current={pageNumber === page ? "page" : undefined}
                aria-label={`Página ${pageNumber}`}
                className="vrn-directory-pagination__page"
                href={getPageHref(pageNumber)}
              >
                {pageNumber}
              </LinkComponent>
            </li>
          );
        })}
      </ol>
      <div className="vrn-directory-pagination__edges">
        {edgeControl("Página siguiente", <><span>Siguiente</span><ChevronRight className="vrn-icon" /></>, page + 1, page === normalizedPageCount)}
        {edgeControl("Última página", <><ChevronRight className="vrn-icon" /><ChevronRight className="vrn-icon" /></>, normalizedPageCount, page === normalizedPageCount)}
      </div>
    </nav>
  );
}
