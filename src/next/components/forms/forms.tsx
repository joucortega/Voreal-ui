import clsx from "clsx";
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
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
export type NextTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
export type NextInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
};
export type NextCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  count?: number;
};
export type NextFormSummaryProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  errors: readonly { id: string; message: string; href?: string }[];
};

export const NextInput = forwardRef<HTMLInputElement, NextInputProps>(function NextInput({ className, ...props }, ref) {
  return <input {...props} ref={ref} className={clsx("vrn-input", className)} />;
});

export const NextSelect = forwardRef<HTMLSelectElement, NextSelectProps>(function NextSelect({ className, ...props }, ref) {
  return <select {...props} ref={ref} className={clsx("vrn-select", className)} />;
});

export const NextTextarea = forwardRef<HTMLTextAreaElement, NextTextareaProps>(function NextTextarea(
  { className, ...props },
  ref,
) {
  return <textarea {...props} ref={ref} className={clsx("vrn-textarea", className)} />;
});

export const NextInputGroup = forwardRef<HTMLDivElement, NextInputGroupProps>(function NextInputGroup(
  { children, className, prefix, suffix, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={clsx("vrn-input-group", className)}>
      {prefix === undefined ? null : <span aria-hidden="true" className="vrn-input-group__affix">{prefix}</span>}
      {children}
      {suffix === undefined ? null : <span aria-hidden="true" className="vrn-input-group__affix">{suffix}</span>}
    </div>
  );
});

function isFieldControl(child: ReactElement): boolean {
  return child.type === "input"
    || child.type === "select"
    || child.type === "textarea"
    || child.type === NextInput
    || child.type === NextSelect
    || child.type === NextTextarea;
}

/**
 * A field accepts exactly one Voreal or native input, textarea, or select.
 * Arbitrary child groups are not accepted because descriptions must target one control.
 */
export const NextField = forwardRef<HTMLDivElement, NextFieldProps>(function NextField(
  { children, className, error, hint, htmlFor, label, required, ...props },
  ref,
) {
  const child = Children.only(children);
  if (!isValidElement(child) || !isFieldControl(child)) {
    throw new Error("NextField accepts exactly one NextInput, NextTextarea, NextSelect, input, textarea, or select child.");
  }

  const controlChild = child as ReactElement<
    InputHTMLAttributes<HTMLInputElement>
    | SelectHTMLAttributes<HTMLSelectElement>
    | TextareaHTMLAttributes<HTMLTextAreaElement>
  >;
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const childProps = controlChild.props;
  const describedBy = [...new Set([childProps["aria-describedby"], hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .flatMap((value) => value!.split(/\s+/u)))]
    .join(" ");
  const control = cloneElement(controlChild, {
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : childProps["aria-invalid"],
    id: htmlFor,
    required: required || controlChild.props.required,
  });

  return (
    <div {...props} ref={ref} className={clsx("vrn-field", className)}>
      <label className="vrn-field__label" htmlFor={htmlFor}>
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {control}
      {hint ? <span className="vrn-field__hint" id={hintId}>{hint}</span> : null}
      {error ? <span className="vrn-field__error" id={errorId}>{error}</span> : null}
    </div>
  );
});

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

export const NextFormSummary = forwardRef<HTMLDivElement, NextFormSummaryProps>(function NextFormSummary(
  { className, errors, title, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={clsx("vrn-form-summary", className)}>
      <h2 className="vrn-form-summary__title">{title}</h2>
      <ul className="vrn-form-summary__list">
        {errors.map((error) => (
          <li key={`${error.id}-${error.href ?? ""}-${error.message}`}>
            <a href={error.href ?? `#${error.id}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});
