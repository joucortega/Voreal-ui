import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

export type RenderVorealOptions = {
  theme?: "neutral" | "red-latina";
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
