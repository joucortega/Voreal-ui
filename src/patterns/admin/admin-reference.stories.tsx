import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdminReference } from "./admin-reference";

const meta = {
  title: "Patterns/Admin Reference",
  component: AdminReference,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AdminReference>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompactDirectory: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { empty: true } };
export const Error: Story = { args: { error: true } };
export const Mobile375: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
export const Tablet768: Story = { parameters: { viewport: { defaultViewport: "tablet" } } };
