import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from "react";
import fn from '@storybook/addon-vitest';
import AddResumeCard from '../components/AddResumeCard.tsx';

type storyProps = ComponentType<typeof AddResumeCard>;

const meta: Meta<storyProps> = {
  title: 'Components/AddResumeCard',
  component: AddResumeCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isLoading: {
      control: 'boolean'
    },
  },
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-64 h-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
