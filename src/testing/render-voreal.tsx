import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import type { VorealTheme } from "../primitives";

export type RenderVorealOptions = {
  theme?: VorealTheme;
  density?: "comfortable" | "compact";
};

export function renderVoreal(
  ui: ReactElement,
  {
    theme = "neutral",
    density = "comfortable",
  }: RenderVorealOptions = {},
): RenderResult {
  return render(
    <div
      className="vr-root"
      data-testid="voreal-root"
      data-vr-root=""
      data-vr-theme={theme}
      data-vr-density={density}
    >
      {ui}
    </div>,
  );
}
