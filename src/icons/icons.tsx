import type { ReactNode, SVGProps } from "react";
import { cn } from "../utilities/cn";

// A small Lucide-compatible stroke set keeps the local package fast and
// dependency-free while preserving one consistent 24px icon language.
export type VorealIconProps = SVGProps<SVGSVGElement> & { label?: string };

function Icon({ children, className, label, ...props }: VorealIconProps & { children: ReactNode }) {
  return (
    <svg
      {...props}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("vr-icon", className)}
      fill="none"
      focusable="false"
      role={label ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export function ArrowDownIcon(props: VorealIconProps) { return <Icon {...props}><path d="M12 5v14M19 12l-7 7-7-7" /></Icon>; }
export function ArrowRightIcon(props: VorealIconProps) { return <Icon {...props}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>; }
export function ArrowUpIcon(props: VorealIconProps) { return <Icon {...props}><path d="M12 19V5M5 12l7-7 7 7" /></Icon>; }
export function ArrowUpDownIcon(props: VorealIconProps) { return <Icon {...props}><path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" /></Icon>; }
export function BuildingIcon(props: VorealIconProps) { return <Icon {...props}><path d="M3 21h18M6 21V3h12v18M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /></Icon>; }
export function CheckIcon(props: VorealIconProps) { return <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>; }
export function ChevronDownIcon(props: VorealIconProps) { return <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon>; }
export function ChevronUpIcon(props: VorealIconProps) { return <Icon {...props}><path d="m18 15-6-6-6 6" /></Icon>; }
export function FlameIcon(props: VorealIconProps) { return <Icon {...props}><path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-2 5-4 6 0-3-1-5-2-7-2 3-3 6-3 10 0 4 3 7 7 7Z" /><path d="M9 18c0 2 1 3 3 3s3-1 3-3c0-1-1-3-3-4 0 2-1 3-3 4Z" /></Icon>; }
export function HeartIcon(props: VorealIconProps) { return <Icon {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></Icon>; }
export function HomeIcon(props: VorealIconProps) { return <Icon {...props}><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-6h6v6" /></Icon>; }
export function LayoutGridIcon(props: VorealIconProps) { return <Icon {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>; }
export function ListIcon(props: VorealIconProps) { return <Icon {...props}><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="3" cy="18" r="1" fill="currentColor" stroke="none" /></Icon>; }
export function LocateFixedIcon(props: VorealIconProps) { return <Icon {...props}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="7" /></Icon>; }
export function MapPinIcon(props: VorealIconProps) { return <Icon {...props}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>; }
export function MoreHorizontalIcon(props: VorealIconProps) { return <Icon {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></Icon>; }
export function ShapesIcon(props: VorealIconProps) { return <Icon {...props}><circle cx="7" cy="7" r="4" /><path d="M14 3h7v7h-7zM14.5 14.5 18 21l3.5-6.5Z" /></Icon>; }
export function SlidersIcon(props: VorealIconProps) { return <Icon {...props}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></Icon>; }
export function SparklesIcon(props: VorealIconProps) { return <Icon {...props}><path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4ZM5 15l-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8ZM19 14l-.7 1.8-1.8.7 1.8.7L19 19l.7-1.8 1.8-.7-1.8-.7Z" /></Icon>; }
export function StarIcon(props: VorealIconProps) { return <Icon {...props}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1Z" /></Icon>; }
export function UtensilsIcon(props: VorealIconProps) { return <Icon {...props}><path d="M3 2v8a4 4 0 0 0 8 0V2M7 2v20M17 2v8M21 2v8a4 4 0 0 1-4 4v8" /></Icon>; }
export function XIcon(props: VorealIconProps) { return <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon>; }
