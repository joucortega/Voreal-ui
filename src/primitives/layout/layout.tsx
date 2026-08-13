import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";

const gapVariants = cva("", {
  variants: {
    gap: {
      "0": "vr-gap-0",
      "1": "vr-gap-1",
      "2": "vr-gap-2",
      "3": "vr-gap-3",
      "4": "vr-gap-4",
      "6": "vr-gap-6",
      "8": "vr-gap-8",
      "12": "vr-gap-12",
    },
  },
  defaultVariants: { gap: "4" },
});

const alignmentVariants = cva("", {
  variants: {
    align: {
      start: "vr-align-start",
      center: "vr-align-center",
      end: "vr-align-end",
      stretch: "vr-align-stretch",
    },
    justify: {
      start: "vr-justify-start",
      center: "vr-justify-center",
      end: "vr-justify-end",
      between: "vr-justify-between",
    },
  },
  defaultVariants: { align: "stretch", justify: "start" },
});

type GapProps = VariantProps<typeof gapVariants>;
type AlignmentProps = VariantProps<typeof alignmentVariants>;

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "wide" | "reading" | "full";
};

export function Container({ className, size = "wide", ...props }: ContainerProps) {
  return <div {...props} className={cn("vr-container", className)} data-vr-size={size} />;
}

export type StackProps = HTMLAttributes<HTMLDivElement> & GapProps & AlignmentProps;

export function Stack({ align, className, gap, justify, ...props }: StackProps) {
  return (
    <div
      {...props}
      className={cn("vr-stack", gapVariants({ gap }), alignmentVariants({ align, justify }), className)}
    />
  );
}

export type ClusterProps = HTMLAttributes<HTMLDivElement> & GapProps & AlignmentProps;

export function Cluster({ align = "center", className, gap, justify, ...props }: ClusterProps) {
  return (
    <div
      {...props}
      className={cn("vr-cluster", gapVariants({ gap }), alignmentVariants({ align, justify }), className)}
    />
  );
}

export type GridProps = HTMLAttributes<HTMLDivElement> &
  GapProps & {
    columns?: 1 | 2 | 3 | 4 | "auto";
  };

export function Grid({ className, columns = 1, gap, ...props }: GridProps) {
  return (
    <div
      {...props}
      className={cn("vr-grid", gapVariants({ gap }), className)}
      data-vr-columns={columns}
    />
  );
}

export type DividerProps = Omit<HTMLAttributes<HTMLHRElement>, "aria-orientation"> & {
  orientation?: "horizontal" | "vertical";
};

export function Divider({ className, orientation = "horizontal", ...props }: DividerProps) {
  return (
    <hr
      {...props}
      aria-orientation={orientation}
      className={cn("vr-divider", className)}
      data-vr-orientation={orientation}
    />
  );
}
