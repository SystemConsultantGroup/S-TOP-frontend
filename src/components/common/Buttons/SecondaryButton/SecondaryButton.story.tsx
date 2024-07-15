import type { Meta, StoryObj } from "@storybook/react";
import { SecondaryButton } from "./SecondaryButton";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "SecondaryButton",
  component: SecondaryButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // More on Action Args : https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof SecondaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Usage: Story = {
  args: {
    label: "Button",
  },
};

export const Disabled: Story = {
  args: {
    label: "Button",
    disabled: true,
  },
};
