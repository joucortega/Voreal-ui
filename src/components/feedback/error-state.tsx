"use client";

import { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utilities/cn";

export type ErrorStateProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  autoFocus?: boolean;
  description?: ReactNode;
  title: ReactNode;
};

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  { action, autoFocus = false, className, description, title, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoFocus) localRef.current?.focus();
  }, [autoFocus]);

  function assignRef(node: HTMLDivElement | null) {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }

  return (
    <div
      {...props}
      className={cn("vr-state vr-state--error", className)}
      ref={assignRef}
      role="alert"
      tabIndex={-1}
    >
      <span aria-hidden="true" className="vr-state__icon">!</span>
      <strong className="vr-state__title">{title}</strong>
      {description ? <p className="vr-state__description">{description}</p> : null}
      {action ? <div className="vr-state__action">{action}</div> : null}
    </div>
  );
});
