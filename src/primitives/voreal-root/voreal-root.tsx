import type { HTMLAttributes } from "react";
import { cn } from "../../utilities/cn";
import {
  useVorealPortalProps,
  VorealProvider,
  type VorealDensity,
  type VorealTheme,
} from "./voreal-context";

export type VorealRootProps = HTMLAttributes<HTMLDivElement> & {
  theme?: VorealTheme;
  density?: VorealDensity;
};

export function VorealRoot({
  children,
  className,
  density = "comfortable",
  theme = "neutral",
  ...props
}: VorealRootProps) {
  return (
    <VorealProvider density={density} theme={theme}>
      <div
        {...props}
        className={cn("vr-root", className)}
        data-vr-root=""
        data-vr-theme={theme}
        data-vr-density={density}
      >
        {children}
      </div>
    </VorealProvider>
  );
}

export { useVorealPortalProps };
export type { VorealDensity, VorealTheme };
