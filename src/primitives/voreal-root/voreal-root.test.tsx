import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { useVorealPortalProps, VorealRoot } from "./voreal-root";

function PortalProbe() {
  const portalProps = useVorealPortalProps();
  return <div data-testid="portal" {...portalProps} />;
}

it("propagates the selected theme and density to roots and portals", () => {
  render(
    <VorealRoot
      className="host-shell"
      data-testid="vr-root"
      density="compact"
      theme="red-latina"
    >
      <PortalProbe />
    </VorealRoot>,
  );

  const root = screen.getByTestId("vr-root");
  expect(root).toHaveClass("vr-root", "host-shell");
  expect(root).toHaveAttribute("data-vr-root");
  expect(root).toHaveAttribute("data-vr-theme", "red-latina");
  expect(root).toHaveAttribute("data-vr-density", "compact");

  const portal = screen.getByTestId("portal");
  expect(portal).toHaveAttribute("data-vr-portal");
  expect(portal).toHaveAttribute("data-vr-theme", "red-latina");
  expect(portal).toHaveAttribute("data-vr-density", "compact");
});
