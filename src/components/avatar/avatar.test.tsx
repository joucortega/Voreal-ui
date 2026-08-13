import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Avatar } from "./avatar";
import { AvatarWeave } from "./avatar-group";
import { CommunityHub } from "./community-hub";
import { IdentityCapsule } from "./identity-capsule";

const people = [
  { id: "1", name: "Ana Martínez" },
  { id: "2", name: "José Rivera" },
  { id: "3", name: "Luisa Peña" },
  { id: "4", name: "Mateo Cruz" },
  { id: "5", name: "Sofía León" },
];

it("uses accented initials when an avatar image fails", async () => {
  renderVoreal(<Avatar name="Ángel Núñez" src="/missing.jpg" />);

  expect(await screen.findByText("ÁN")).toBeVisible();
});

it("summarizes AvatarWeave overflow without hiding visible identities", async () => {
  const onOverflowClick = vi.fn();
  const user = userEvent.setup();

  renderVoreal(
    <AvatarWeave max={3} onOverflowClick={onOverflowClick} people={people} />,
  );

  expect(screen.getByRole("list", { name: "Personas" })).toBeVisible();
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  const overflow = screen.getByRole("button", { name: "2 personas más" });
  expect(overflow).toHaveTextContent("+2");
  await user.click(overflow);
  expect(onOverflowClick).toHaveBeenCalledOnce();
});

it("communicates IdentityCapsule status with text instead of color alone", () => {
  renderVoreal(
    <IdentityCapsule
      name="Ana Martínez"
      status="Verificada"
      subtitle="Restaurante La Palma"
    />,
  );

  expect(screen.getByRole("group", { name: "Identidad de Ana Martínez" })).toBeVisible();
  expect(screen.getByText("Verificada")).toHaveAccessibleName("Estado: Verificada");
  expect(screen.getByText("Restaurante La Palma")).toBeVisible();
});

it("limits CommunityHub satellites and exposes the remaining community", async () => {
  const { container } = renderVoreal(
    <CommunityHub center={{ id: "host", name: "Mercado Latino" }} people={people} />,
  );

  expect(screen.getByRole("group", { name: "Comunidad de Mercado Latino" })).toBeVisible();
  expect(screen.getByRole("button", { name: "1 persona más" })).toBeVisible();
  const results = await axe(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});
