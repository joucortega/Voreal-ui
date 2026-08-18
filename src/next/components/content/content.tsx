import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { VorealNextImageComponent } from "../../adapters";
import { Star } from "../../icons";

export type NextAvatarProps = HTMLAttributes<HTMLSpanElement> & {
  ImageComponent?: VorealNextImageComponent;
  imageAlt?: string;
  imageHeight?: number;
  imageWidth?: number;
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
};
export type NextRatingProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
  max?: 5;
  messages?: Partial<NextRatingMessages>;
  reviewCount?: number;
  value: number;
};
export type NextReviewSummaryProps = HTMLAttributes<HTMLDivElement> & {
  average?: number;
  distribution: readonly { count: number; rating: 1 | 2 | 3 | 4 | 5 }[];
  messages?: Partial<NextReviewSummaryMessages>;
  total: number;
};

export type NextRatingLabelContext = {
  max: number;
  reviewCount?: number;
  value: number;
};

export type NextRatingMessages = {
  formatAccessibleLabel: (context: NextRatingLabelContext) => string;
  formatReviewCount: (count: number) => string;
};

export type NextReviewDistributionLabelContext = {
  count: number;
  rating: number;
  total: number;
};

export type NextReviewSummaryMessages = NextRatingMessages & {
  emptyLabel: ReactNode;
  formatDistributionLabel: (context: NextReviewDistributionLabelContext) => string;
  formatStarLabel: (rating: number) => string;
  formatSummaryLabel: (total: number) => string;
};

const avatarDimensions = { sm: 32, md: 40, lg: 56 } as const;
const ratings = [5, 4, 3, 2, 1] as const;

function clampRating(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const clamped = Math.min(5, Math.max(0, value));
  return Math.round(clamped * 10) / 10 || 0;
}

function normalizeCount(value: number): number {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function normalizeDimension(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

function reviewLabel(count: number): string {
  return `${count} ${count === 1 ? "reseña" : "reseñas"}`;
}

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) return "?";
  const selected = words.length === 1 ? words : [words[0], words.at(-1)!];
  return selected.map((word) => Array.from(word)[0]?.toLocaleUpperCase("es") ?? "").join("");
}

export const NextAvatar = forwardRef<HTMLSpanElement, NextAvatarProps>(function NextAvatar(
  {
    ImageComponent = "img",
    className,
    imageAlt,
    imageHeight,
    imageWidth,
    name,
    size = "md",
    src,
    ...props
  },
  ref,
) {
  const fallbackDimension = avatarDimensions[size];
  const accessibleName = name.trim() || "Avatar";

  return (
    <span {...props} ref={ref} className={clsx("vrn-avatar", className)} data-size={size}>
      {src ? (
        <ImageComponent
          alt={imageAlt ?? accessibleName}
          className="vrn-avatar__image"
          height={normalizeDimension(imageHeight, fallbackDimension)}
          src={src}
          width={normalizeDimension(imageWidth, fallbackDimension)}
        />
      ) : (
        <span aria-label={accessibleName} className="vrn-avatar__fallback" role="img">
          {initialsFor(name)}
        </span>
      )}
    </span>
  );
});

export const NextRating = forwardRef<HTMLSpanElement, NextRatingProps>(function NextRating(
  { "aria-label": ariaLabel, className, label, max: _max = 5, messages, reviewCount, value, ...props },
  ref,
) {
  const safeValue = clampRating(value);
  const safeReviewCount = reviewCount === undefined ? undefined : normalizeCount(reviewCount);
  const formatReviewCount = messages?.formatReviewCount ?? reviewLabel;
  const formatAccessibleLabel = messages?.formatAccessibleLabel ?? ((context: NextRatingLabelContext) =>
    `${context.value} de ${context.max}${context.reviewCount === undefined ? "" : `, ${formatReviewCount(context.reviewCount)}`}`);
  const accessibleName = label ?? formatAccessibleLabel({ max: 5, reviewCount: safeReviewCount, value: safeValue });

  return (
    <span
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? accessibleName}
      className={clsx("vrn-rating", className)}
      role={props.role ?? "img"}
    >
      <span aria-hidden="true" className="vrn-rating__stars">
        {[...ratings].reverse().map((rating) => (
          <Star
            key={rating}
            aria-hidden="true"
            className="vrn-rating__star vrn-icon"
            data-filled={rating <= Math.round(safeValue) || undefined}
          />
        ))}
      </span>
      <span aria-hidden="true" className="vrn-rating__value">{safeValue}</span>
      {safeReviewCount === undefined ? null : <span aria-hidden="true" className="vrn-rating__count">{formatReviewCount(safeReviewCount)}</span>}
    </span>
  );
});

export const NextReviewSummary = forwardRef<HTMLDivElement, NextReviewSummaryProps>(function NextReviewSummary(
  { "aria-label": ariaLabel, average, className, distribution, messages, role, total, ...props },
  ref,
) {
  const safeTotal = normalizeCount(total);
  const countByRating = new Map<number, number>(ratings.map((rating) => [rating, 0]));

  for (const entry of distribution) {
    if (!ratings.includes(entry.rating)) continue;
    const current = countByRating.get(entry.rating) ?? 0;
    countByRating.set(entry.rating, Math.min(Number.MAX_SAFE_INTEGER, current + normalizeCount(entry.count)));
  }

  const distributionTotal = ratings.reduce(
    (sum, rating) => Math.min(Number.MAX_SAFE_INTEGER, sum + (countByRating.get(rating) ?? 0)),
    0,
  );
  const denominator = distributionTotal > 0 ? distributionTotal : safeTotal;
  const derivedAverage = distributionTotal > 0
    ? ratings.reduce((sum, rating) => sum + rating * (countByRating.get(rating) ?? 0), 0) / distributionTotal
    : 0;
  const safeAverage = clampRating(typeof average === "number" && Number.isFinite(average) ? average : derivedAverage);
  const formatReviewCount = messages?.formatReviewCount ?? reviewLabel;
  const formatAccessibleLabel = messages?.formatAccessibleLabel ?? ((context: NextRatingLabelContext) =>
    `${context.value} de ${context.max}${context.reviewCount === undefined ? "" : `, ${formatReviewCount(context.reviewCount)}`}`);
  const formatStarLabel = messages?.formatStarLabel
    ?? ((rating: number) => `${rating} ${rating === 1 ? "estrella" : "estrellas"}`);
  const formatDistributionLabel = messages?.formatDistributionLabel
    ?? ((context: NextReviewDistributionLabelContext) =>
      `${formatStarLabel(context.rating)}: ${context.count} de ${context.total}`);
  const formatSummaryLabel = messages?.formatSummaryLabel
    ?? ((reviewTotal: number) => `Resumen de ${formatReviewCount(reviewTotal)}`);
  const emptyLabel = messages?.emptyLabel ?? "Sin reseñas todavía";
  const summaryLabel = formatSummaryLabel(safeTotal);

  return (
    <div
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? summaryLabel}
      className={clsx("vrn-review-summary", className)}
      role={role ?? "group"}
    >
      {safeTotal === 0 ? (
        <p className="vrn-review-summary__empty">{emptyLabel}</p>
      ) : (
        <>
          <NextRating
            className="vrn-review-summary__rating"
            messages={{ formatAccessibleLabel, formatReviewCount }}
            reviewCount={safeTotal}
            value={safeAverage}
          />
          <div className="vrn-review-summary__distribution">
            {ratings.map((rating) => {
              const count = countByRating.get(rating) ?? 0;
              const starLabel = formatStarLabel(rating);
              return (
                <div className="vrn-review-summary__row" key={rating}>
                  <span className="vrn-review-summary__label">{starLabel}</span>
                  <progress
                    aria-label={formatDistributionLabel({ count, rating, total: denominator })}
                    className="vrn-review-summary__bar"
                    max={denominator}
                    value={count}
                  />
                  <span className="vrn-review-summary__count">{count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});
