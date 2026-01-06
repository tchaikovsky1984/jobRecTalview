import type { Meta, StoryObj } from '@storybook/react';
import ScoreRing from '../components/ScoreRing.tsx';
import type { ComponentType } from 'react';

type storyProps = ComponentType<typeof ScoreRing>;

const meta: Meta<storyProps> = {
  title: 'Components/ScoreRing',
  component: ScoreRing,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: {
        type: "range",
        min: 10,
        max: 1000
      }
    },
    maxScore: {
      control: {
        type: "number",
        min: 10
      }
    },
    score: {
      control: {
        type: "range",
        min: 0,
        max: 100
      }
    }
  }
};

export default meta;
type Story = StoryObj<storyProps>;

export const low: Story = {
  args: {
    score: 30
  }
};

export const medium: Story = {
  args: {
    score: 60
  }
};

export const high: Story = {
  args: {
    score: 90
  }
};

