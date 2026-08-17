import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { VorealNextRoot } from "../root";

export function renderVorealNext(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(<VorealNextRoot data-testid="voreal-next-root">{ui}</VorealNextRoot>, options);
}
