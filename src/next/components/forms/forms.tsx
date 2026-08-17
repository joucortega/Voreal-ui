import clsx from "clsx";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type SelectHTMLAttributes,
} from "react";

export type NextFieldProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
};
export type NextInputProps = InputHTMLAttributes<HTMLInputElement>;
export type NextSelectProps = SelectHTMLAttributes<HTMLSelectElement>;
export type NextCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  count?: number;
};

export const NextInput = forwardRef<HTMLInputElement, NextInputProps>(function NextInput({ className, ...props }, ref) {
  return <input {...props} ref={ref} className={clsx("vrn-input", className)} />;
});

export const NextSelect = forwardRef<HTMLSelectElement, NextSelectProps>(function NextSelect({ className, ...props }, ref) {
  return <select {...props} ref={ref} className={clsx("vrn-select", className)} />;
});

function isFieldControl(child: ReactElement): boolean {
  return child.type === "input" || child.type === "select" || child.type === NextInput || child.type === NextSelect;
}

/**
 * A field accepts exactly one NextInput, NextSelect, native input, or native select.
 * Arbitrary child groups are not accepted because descriptions must target one control.
 */
export function NextField({ children, className, error, hint, htmlFor, label, required, ...props }: NextFieldProps) {
  const child = Children.only(children);
  if (!isValidElement(child) || !isFieldControl(child)) {
    throw new Error("NextField accepts exactly one NextInput, NextSelect, input, or select child.");
  }

  const controlChild = child as ReactElement<InputHTMLAttributes<HTMLInputElement> | SelectHTMLAttributes<HTMLSelectElement>>;
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const childProps = controlChild.props;
  const describedBy = [childProps["aria-describedby"], hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");
  const control = cloneElement(controlChild, {
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : childProps["aria-invalid"],
    id: htmlFor,
    required: required || controlChild.props.required,
  });

  return (
    <div {...props} className={clsx("vrn-field", className)}>
      <label className="vrn-field__label" htmlFor={htmlFor}>
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {control}
      {hint ? <span className="vrn-field__hint" id={hintId}>{hint}</span> : null}
      {error ? <span className="vrn-field__error" id={errorId}>{error}</span> : null}
    </div>
  );
}

export const NextCheckbox = forwardRef<HTMLInputElement, NextCheckboxProps>(function NextCheckbox(
  { className, count, label, ...props },
  ref,
) {
  return (
    <label className={clsx("vrn-checkbox", className)}>
      <input {...props} ref={ref} className="vrn-checkbox__control" type="checkbox" />
      <span>{label}</span>
      {count === undefined ? null : <span className="vrn-checkbox__count">({count})</span>}
    </label>
  );
});
