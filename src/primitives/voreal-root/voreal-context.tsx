"use client";

import { createContext, useContext, type ReactNode } from "react";

export type VorealTheme = "neutral" | "red-latina";
export type VorealDensity = "comfortable" | "compact";

type VorealContextValue = {
  theme: VorealTheme;
  density: VorealDensity;
};

const VorealContext = createContext<VorealContextValue>({
  theme: "neutral",
  density: "comfortable",
});

type VorealProviderProps = VorealContextValue & {
  children: ReactNode;
};

export function VorealProvider({ children, density, theme }: VorealProviderProps) {
  return <VorealContext.Provider value={{ density, theme }}>{children}</VorealContext.Provider>;
}

export function useVorealPortalProps() {
  const { density, theme } = useContext(VorealContext);

  return {
    "data-vr-portal": "",
    "data-vr-theme": theme,
    "data-vr-density": density,
  } as const;
}
