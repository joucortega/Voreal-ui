import { createElement, forwardRef, type ReactElement, type SVGProps } from "react";

/**
 * Official Lucide SVG node data from https://github.com/lucide-icons/lucide
 * at release tag 1.16.0. See LICENSE.lucide.txt for licensing information.
 */
type IconNode = readonly ["path" | "circle" | "line", Record<string, string>][];

export type NextIconProps = SVGProps<SVGSVGElement> & { label?: string };

function createLucideIcon(name: string, nodes: IconNode) {
  return forwardRef<SVGSVGElement, NextIconProps>(function LucideIcon({ label, ...props }, ref): ReactElement {
    return (
      <svg
        ref={ref}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
      >
        {nodes.map(([element, attributes], index) => createElement(element, { ...attributes, key: `${name}-${index}` }))}
      </svg>
    );
  });
}

export const BadgeCheck = createLucideIcon("badge-check", [
  ["path", { d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" }],
  ["path", { d: "m9 12 2 2 4-4" }],
]);
export const ChevronLeft = createLucideIcon("chevron-left", [["path", { d: "m15 18-6-6 6-6" }]]);
export const ChevronRight = createLucideIcon("chevron-right", [["path", { d: "m9 18 6-6-6-6" }]]);
export const Heart = createLucideIcon("heart", [["path", { d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" }]]);
export const ImageOff = createLucideIcon("image-off", [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15" }],
  ["path", { d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" }],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9" }],
]);
export const LoaderCircle = createLucideIcon("loader-circle", [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]]);
export const MapPin = createLucideIcon("map-pin", [
  ["path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }],
  ["circle", { cx: "12", cy: "10", r: "3" }],
]);
export const Menu = createLucideIcon("menu", [["path", { d: "M4 5h16" }], ["path", { d: "M4 12h16" }], ["path", { d: "M4 19h16" }]]);
export const Search = createLucideIcon("search", [["path", { d: "m21 21-4.34-4.34" }], ["circle", { cx: "11", cy: "11", r: "8" }]]);
export const SlidersHorizontal = createLucideIcon("sliders-horizontal", [
  ["path", { d: "M10 5H3" }], ["path", { d: "M12 19H3" }], ["path", { d: "M14 3v4" }], ["path", { d: "M16 17v4" }], ["path", { d: "M21 12h-9" }], ["path", { d: "M21 19h-5" }], ["path", { d: "M21 5h-7" }], ["path", { d: "M8 10v4" }], ["path", { d: "M8 12H3" }],
]);
export const Star = createLucideIcon("star", [["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" }]]);
export const TriangleAlert = createLucideIcon("triangle-alert", [["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { d: "M12 9v4" }], ["path", { d: "M12 17h.01" }]]);
export const UserRound = createLucideIcon("user-round", [["circle", { cx: "12", cy: "8", r: "5" }], ["path", { d: "M20 21a8 8 0 0 0-16 0" }]]);
export const X = createLucideIcon("x", [["path", { d: "M18 6 6 18" }], ["path", { d: "m6 6 12 12" }]]);
