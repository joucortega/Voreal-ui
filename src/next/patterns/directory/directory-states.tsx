import type { ReactNode } from "react";
import { NextDirectoryCardGrid } from "./directory-layout";

// One result page never needs more placeholders than this bounded preview batch.
const MAX_DIRECTORY_SKELETON_COUNT = 24;

export type NextDirectoryLoadingProps = { count?: number };
export type NextDirectoryEmptyProps = { action?: ReactNode; description: string; title: string };
export type NextDirectoryErrorProps = { action?: ReactNode; description?: string; title?: string };

function normalizeSkeletonCount(count: number) {
  if (!Number.isFinite(count) || count <= 0) return 0;
  return Math.min(MAX_DIRECTORY_SKELETON_COUNT, Math.floor(count));
}

function SkeletonCard() {
  return (
    <div aria-hidden="true" className="vrn-directory-card vrn-directory-card--skeleton">
      <div className="vrn-directory-card__media-wrap">
        <div className="vrn-directory-card__media vrn-directory-skeleton" />
      </div>
      <div className="vrn-directory-card__body">
        <div className="vrn-directory-card__category vrn-directory-skeleton" />
        <div className="vrn-directory-card__name vrn-directory-skeleton" />
        <div className="vrn-directory-card__description vrn-directory-skeleton" />
        <div className="vrn-directory-card__location vrn-directory-skeleton" />
        <div className="vrn-directory-card__facts">
          <span className="vrn-directory-skeleton" />
          <span className="vrn-directory-skeleton" />
        </div>
        <div className="vrn-directory-card__cta vrn-directory-skeleton" />
      </div>
    </div>
  );
}

export function NextDirectoryLoading({ count = 6 }: NextDirectoryLoadingProps) {
  const skeletonCount = normalizeSkeletonCount(count);
  return (
    <div aria-label="Cargando negocios" className="vrn-directory-loading" role="status">
      <span className="vrn-directory-loading__label">Cargando negocios…</span>
      <NextDirectoryCardGrid>
        {Array.from({ length: skeletonCount }, (_, index) => <SkeletonCard key={index} />)}
      </NextDirectoryCardGrid>
    </div>
  );
}

type DirectoryStateProps = {
  action?: ReactNode;
  description: string;
  title: string;
};

function DirectoryState({ action, description, title }: DirectoryStateProps) {
  return (
    <section aria-label={title} className="vrn-directory-state">
      <h2 className="vrn-directory-state__title">{title}</h2>
      <p className="vrn-directory-state__description">{description}</p>
      {action ? <div className="vrn-directory-state__action">{action}</div> : null}
    </section>
  );
}

export function NextDirectoryEmpty({ action, description, title }: NextDirectoryEmptyProps) {
  return <DirectoryState action={action} description={description} title={title} />;
}

export function NextDirectoryError({
  action,
  description = "Vuelve a intentarlo en un momento.",
  title = "No pudimos cargar los negocios.",
}: NextDirectoryErrorProps) {
  return <DirectoryState action={action} description={description} title={title} />;
}
