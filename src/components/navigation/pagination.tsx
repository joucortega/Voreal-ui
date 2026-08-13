import type { HTMLAttributes, MouseEvent } from "react";
import { cn } from "../../utilities/cn";

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  getHref?: (page: number) => string;
  label?: string;
  onPageChange?: (page: number) => void;
  page: number;
  siblingCount?: number;
  totalPages: number;
};

function visiblePages(page: number, totalPages: number, siblingCount: number): number[] {
  const pages = new Set([1, totalPages]);
  for (let current = page - siblingCount; current <= page + siblingCount; current += 1) {
    if (current >= 1 && current <= totalPages) pages.add(current);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function Pagination({
  className,
  getHref,
  label = "Paginación",
  onPageChange,
  page,
  siblingCount = 1,
  totalPages,
  ...props
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);
  const pages = visiblePages(safePage, safeTotal, Math.max(0, siblingCount));

  function handleClick(event: MouseEvent, targetPage: number) {
    if (!getHref) event.preventDefault();
    onPageChange?.(targetPage);
  }

  function control(targetPage: number, accessibleLabel: string, text: string, disabled: boolean) {
    if (disabled) return <span aria-disabled="true" className="vr-pagination__control">{text}</span>;
    if (getHref) {
      return <a aria-label={accessibleLabel} className="vr-pagination__control" href={getHref(targetPage)} onClick={(event) => handleClick(event, targetPage)}>{text}</a>;
    }
    return <button aria-label={accessibleLabel} className="vr-pagination__control" onClick={(event) => handleClick(event, targetPage)} type="button">{text}</button>;
  }

  return (
    <nav {...props} aria-label={label} className={cn("vr-pagination", className)}>
      {control(safePage - 1, "Página anterior", "‹", safePage === 1)}
      <ol className="vr-pagination__pages">
        {pages.map((targetPage, index) => {
          const previousPage = pages[index - 1];
          const gap = previousPage !== undefined && targetPage - previousPage > 1;
          const current = targetPage === safePage;
          return (
            <li className="vr-pagination__item" key={targetPage}>
              {gap ? <span aria-hidden="true" className="vr-pagination__ellipsis">…</span> : null}
              {current ? (
                <span aria-current="page" className="vr-pagination__control vr-pagination__control--current">{targetPage}</span>
              ) : getHref ? (
                <a aria-label={`Página ${targetPage}`} className="vr-pagination__control" href={getHref(targetPage)} onClick={(event) => handleClick(event, targetPage)}>{targetPage}</a>
              ) : (
                <button aria-label={`Página ${targetPage}`} className="vr-pagination__control" onClick={(event) => handleClick(event, targetPage)} type="button">{targetPage}</button>
              )}
            </li>
          );
        })}
      </ol>
      {control(safePage + 1, "Página siguiente", "›", safePage === safeTotal)}
    </nav>
  );
}
