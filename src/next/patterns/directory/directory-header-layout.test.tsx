import { fireEvent, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryHeader } from "./directory-header";
import "./directory.css";

const navigation = [{ href: "/directorio", label: "Directorio" }] as const;
const longAccountLabel = "Administración de la cuenta comunitaria y preferencias de notificación";

it("truncates a long desktop account name when no avatar is supplied", () => {
  renderNext(
    <NextDirectoryHeader
      accountLabel={longAccountLabel}
      brand={<span>voreal</span>}
      navItems={navigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />,
  );

  const label = screen.getByText(longAccountLabel);
  expect(label).not.toHaveAttribute("data-visually-hidden");
  expect(getComputedStyle(label).whiteSpace).toBe("nowrap");
  expect(getComputedStyle(label).overflow).toBe("hidden");
  expect(getComputedStyle(label).textOverflow).toBe("ellipsis");
  expect(getComputedStyle(label).maxInlineSize).not.toBe("none");
});

it("keeps an avatar account name visually hidden on desktop and complete in the mobile drawer", () => {
  renderNext(
    <NextDirectoryHeader
      accountAvatarLabel="AC"
      accountLabel={longAccountLabel}
      brand={<span>voreal</span>}
      navItems={navigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />,
  );

  const desktopLabel = screen.getByRole("banner").querySelector<HTMLElement>(
    ".vrn-directory-header__desktop-nav .vrn-directory-header__account-label",
  );
  expect(desktopLabel).toHaveTextContent(longAccountLabel);
  expect(desktopLabel).toHaveAttribute("data-visually-hidden", "true");
  expect(getComputedStyle(desktopLabel!).position).toBe("absolute");
  expect(getComputedStyle(desktopLabel!).overflow).toBe("hidden");
  expect(getComputedStyle(desktopLabel!).clipPath).toBe("inset(50%)");

  fireEvent.click(screen.getByRole("button", { hidden: true, name: "Abrir navegación" }));
  const dialog = screen.getByRole("dialog", { name: "Navegación" });
  const mobileLabel = within(dialog).getByText(longAccountLabel);
  expect(within(dialog).getByText("AC")).toHaveClass("vrn-directory-header__avatar");
  expect(mobileLabel).not.toHaveAttribute("data-visually-hidden");
  expect(getComputedStyle(mobileLabel).whiteSpace).toBe("normal");
  expect(getComputedStyle(mobileLabel).overflow).toBe("visible");
  expect(getComputedStyle(mobileLabel).textOverflow).toBe("clip");
  expect(getComputedStyle(mobileLabel).maxInlineSize).toBe("none");
});
