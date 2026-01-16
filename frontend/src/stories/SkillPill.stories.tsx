import type { Meta, StoryObj } from '@storybook/react';
import SkillPill from '../components/SkillPill';
import type { ComponentType } from 'react';

type storyProps = ComponentType<typeof SkillPill>;

const meta: Meta<storyProps> = {
  title: 'Components/SkillPill',
  component: SkillPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['neutral', 'match', 'miss'],
      description: 'The visual style indicating the status of the skill',
    },
    name: {
      control: 'text',
      description: 'The name of the skill',
    },
  },
};

export default meta;
type Story = StoryObj<storyProps>;

export const Neutral: Story = {
  args: {
    name: 'TypeScript',
    variant: 'neutral',
  },
};

export const Match: Story = {
  args: {
    name: 'React.js',
    variant: 'match',
  },
};

export const Miss: Story = {
  args: {
    name: 'Kubernetes',
    variant: 'miss',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <SkillPill name="Docker" variant="neutral" />
      <SkillPill name="AWS Lambda" variant="match" />
      <SkillPill name="Fortran" variant="miss" />
    </div>
  ),
};
