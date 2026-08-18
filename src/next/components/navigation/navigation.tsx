import clsx from "clsx";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { VorealNextLinkComponent } from "../../adapters";

export type NextBreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

type NavigationRootProps = Omit<HTMLAttributes<HTMLElement>, "children">;

export type NextBreadcrumbsProps = NavigationRootProps & {
  items: readonly NextBreadcrumbItem[];
  LinkComponent?: VorealNextLinkComponent;
  label?: string;
};

export type NextNavigationRailItem = {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  current?: boolean;
};

export type NextNavigationRailProps = NavigationRootProps & {
  label: string;
  items: readonly NextNavigationRailItem[];
  LinkComponent?: VorealNextLinkComponent;
};

export type NextStepItem = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  status?: "complete" | "current" | "upcoming" | "error";
};

export type NextStepperProps = NavigationRootProps & {
  label: string;
  steps: readonly NextStepItem[];
  value: string;
  onStepChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  statusLabels?: Partial<Record<NonNullable<NextStepItem["status"]>, string>>;
};

const stepStatusLabels: Record<NonNullable<NextStepItem["status"]>, string> = {
  complete: "Completado",
  current: "Actual",
  upcoming: "Próximo",
  error: "Error",
};

function inferredStepStatus(
  step: NextStepItem,
  index: number,
  currentIndex: number,
  currentValue: string,
): NonNullable<NextStepItem["status"]> {
  if (step.value === currentValue) return step.status === "error" ? "error" : "current";
  if (step.status !== undefined && step.status !== "current") return step.status;
  if (currentIndex < 0) return "upcoming";
  return index < currentIndex ? "complete" : "upcoming";
}

export const NextBreadcrumbs = forwardRef<HTMLElement, NextBreadcrumbsProps>(function NextBreadcrumbs(
  { "aria-label": ariaLabel, className, items, label = "Breadcrumb", LinkComponent, ...props },
  ref,
) {
  const Link = LinkComponent ?? "a";

  return (
    <nav {...props} ref={ref} aria-label={ariaLabel ?? label} className={clsx("vrn-breadcrumbs", className)}>
      <ol className="vrn-breadcrumbs__list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="vrn-breadcrumbs__item" key={item.href ?? index}>
              {item.href === undefined ? (
                <span aria-current={isCurrent ? "page" : undefined} className="vrn-breadcrumbs__current">
                  {item.label}
                </span>
              ) : (
                <Link aria-current={isCurrent ? "page" : undefined} className="vrn-breadcrumbs__link" href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export const NextNavigationRail = forwardRef<HTMLElement, NextNavigationRailProps>(function NextNavigationRail(
  { "aria-label": ariaLabel, className, items, label, LinkComponent, ...props },
  ref,
) {
  const Link = LinkComponent ?? "a";
  const currentIndex = items.findIndex((item) => item.current);

  return (
    <nav {...props} ref={ref} aria-label={ariaLabel ?? label} className={clsx("vrn-navigation-rail", className)}>
      <ul className="vrn-navigation-rail__list">
        {items.map((item, index) => (
          <li className="vrn-navigation-rail__item" key={item.href}>
            <Link
              aria-current={index === currentIndex ? "page" : undefined}
              className="vrn-navigation-rail__link"
              href={item.href}
            >
              {item.icon === undefined ? null : (
                <span aria-hidden="true" className="vrn-navigation-rail__icon">{item.icon}</span>
              )}
              <span className="vrn-navigation-rail__label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

export const NextStepper = forwardRef<HTMLElement, NextStepperProps>(function NextStepper(
  {
    "aria-label": ariaLabel,
    className,
    label,
    onStepChange,
    orientation = "horizontal",
    statusLabels,
    steps,
    value,
    ...props
  },
  ref,
) {
  const currentIndex = steps.findIndex((step) => step.value === value);
  const resolvedStatusLabels = { ...stepStatusLabels, ...statusLabels };

  return (
    <nav {...props} ref={ref} aria-label={ariaLabel ?? label} className={clsx("vrn-stepper", className)}>
      <ol className="vrn-stepper__list" data-orientation={orientation}>
        {steps.map((step, index) => {
          const status = inferredStepStatus(step, index, currentIndex, value);
          const isCurrent = step.value === value;
          const copy = (
            <>
              <span className="vrn-stepper__marker" data-status={status}>
                <span className="vrn-stepper__number">{index + 1}</span>
              </span>
              <span className="vrn-stepper__copy">
                <span className="vrn-stepper__label">{step.label}</span>
                <span className="vrn-stepper__status" data-status={status}>{resolvedStatusLabels[status]}</span>
                {step.description === undefined ? null : (
                  <span className="vrn-stepper__description">{step.description}</span>
                )}
              </span>
            </>
          );

          return (
            <li
              aria-current={isCurrent ? "step" : undefined}
              className="vrn-stepper__item"
              data-status={status}
              key={step.value}
            >
              {onStepChange === undefined ? (
                <div className="vrn-stepper__step">{copy}</div>
              ) : (
                <button
                  className="vrn-stepper__step vrn-stepper__button"
                  disabled={status === "upcoming"}
                  onClick={() => onStepChange(step.value)}
                  type="button"
                >
                  {copy}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
