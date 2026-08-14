"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowRightIcon } from "../../icons";
import { cn } from "../../utilities/cn";
import { Button } from "./button";
import type { ButtonProps } from "./button.types";

export type PathButtonProps = ButtonProps & {
  destination?: string;
};

export function PathButton({ children, className, destination, endIcon = <ArrowRightIcon />, ...props }: PathButtonProps) {
  return (
    <Button
      {...props}
      className={cn("vr-path-button", className)}
      endIcon={endIcon}
      variant={props.variant ?? "primary"}
    >
      {children}
      {destination ? (
        <span aria-hidden="true" className="vr-path-button__destination">
          {destination}
        </span>
      ) : null}
    </Button>
  );
}

export type RelayButtonProps = ButtonProps & {
  status: ReactNode;
};

export function RelayButton({ className, status, ...props }: RelayButtonProps) {
  return (
    <div className={cn("vr-relay", className)}>
      <Button {...props} className="vr-relay__button" />
      <span className="vr-relay__status" role="status">
        <span aria-hidden="true" className="vr-relay__signal" />
        {status}
      </span>
    </div>
  );
}

export type SplitBridgeAction = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "disabled" | "onClick"
> & {
  label: ReactNode;
  icon?: ReactNode;
};

export type SplitBridgeProps = {
  className?: string;
  label?: string;
  primary: SplitBridgeAction;
  secondary: SplitBridgeAction;
};

export function SplitBridge({
  className,
  label = "Acciones relacionadas",
  primary,
  secondary,
}: SplitBridgeProps) {
  return (
    <div aria-label={label} className={cn("vr-split-bridge", className)} role="group">
      <Button
        aria-label={primary["aria-label"]}
        className="vr-split-bridge__primary"
        disabled={primary.disabled}
        onClick={primary.onClick}
        startIcon={primary.icon}
      >
        {primary.label}
      </Button>
      <span aria-hidden="true" className="vr-split-bridge__join" />
      <Button
        aria-label={secondary["aria-label"]}
        className="vr-split-bridge__secondary"
        disabled={secondary.disabled}
        onClick={secondary.onClick}
        startIcon={secondary.icon}
        variant="secondary"
      >
        {secondary.label}
      </Button>
    </div>
  );
}

export type ActionRailItem = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type ActionRailProps = {
  className?: string;
  label: string;
  items: readonly ActionRailItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
};

export function ActionRail({
  className,
  defaultValue,
  items,
  label,
  onValueChange,
  orientation = "horizontal",
  value,
}: ActionRailProps) {
  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const selectedValue = value ?? internalValue;

  function select(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    if (nextValue !== selectedValue) {
      onValueChange?.(nextValue);
    }
  }

  return (
    <RadioGroup.Root
      aria-label={label}
      className={cn("vr-action-rail", className)}
      loop
      onValueChange={select}
      orientation={orientation}
      value={selectedValue}
    >
      {items.map((item) => (
        <RadioGroup.Item
          aria-label={item.label}
          className="vr-action-rail__item"
          disabled={item.disabled}
          key={item.value}
          onFocus={() => select(item.value)}
          value={item.value}
        >
          {item.icon ? (
            <span aria-hidden="true" className="vr-action-rail__icon">
              {item.icon}
            </span>
          ) : null}
          <span className="vr-action-rail__label">{item.label}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

export type LinkedCtaProps = {
  action: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export function LinkedCta({ action, className, description, eyebrow, title }: LinkedCtaProps) {
  return (
    <section className={cn("vr-linked-cta", className)}>
      <div className="vr-linked-cta__copy">
        {eyebrow ? <span className="vr-linked-cta__eyebrow">{eyebrow}</span> : null}
        <h2 className="vr-linked-cta__title">{title}</h2>
        <p className="vr-linked-cta__description">{description}</p>
      </div>
      <div className="vr-linked-cta__action">{action}</div>
    </section>
  );
}
