import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import ResumeCard, { type ResumeBriefData } from '../components/ResumeCard.tsx';
import type { ComponentType } from 'react';

const mockResume: ResumeBriefData = {
  id: 101,
  summary: "Experienced Full Stack Developer with 5 years of experience in React, Node.js, and Cloud Architecture. Proven track record of delivering scalable web applications.",
  recommendations_aggregate: {
    aggregate: {
      avg: {
        score: 78,
      },
    },
  },
};

type storyProps = ComponentType<typeof ResumeCard>;

const meta: Meta<storyProps> = {
  title: 'Components/ResumeCard',
  component: ResumeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) =>
    (<MemoryRouter>
      <div>
        <Story />
      </div>
    </MemoryRouter >)
  ]
};

export default meta;
type Story = StoryObj<typeof ResumeCard>;

export const Default: Story = {
  args: {
    resume: mockResume,
  },
};

export const HighScore: Story = {
  args: {
    resume: {
      ...mockResume,
      recommendations_aggregate: {
        aggregate: {
          avg: { score: 95 },
        },
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    resume: {
      id: 202,
      summary: "",
      recommendations_aggregate: {
        aggregate: {
          avg: { score: null },
        },
      },
    },
  },
};
