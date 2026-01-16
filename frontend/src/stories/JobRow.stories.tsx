import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import JobRow from '../components/JobRow';
import type { ComponentType } from 'react';

const mockRec = {
  id: "rec-123",
  score: 85,
  reasoning: "This role strongly aligns with your background in TypeScript and Cloud Architecture. The company specifically values your experience with Serverless concepts.",
  skill_matches: ["React", "TypeScript", "Node.js", "AWS Lambda"],
  skill_misses: ["Kubernetes", "Go"],
  resume: {
    id: 42
  },
  job: {
    title: "Senior Full Stack Engineer",
    company: "TechNova Systems",
    location: "Remote (San Francisco)",
    description: "We are seeking a talented Full Stack Engineer to join our platform team. You will be responsible for building scalable APIs using Node.js and crafting intuitive UIs with React. Experience with AWS is a must. You should be comfortable working in an agile environment and mentoring junior developers."
  }
};

type storyProps = ComponentType<typeof JobRow>;

const meta: Meta<storyProps> = {
  title: 'Components/JobRow',
  component: JobRow,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-[800px]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<storyProps>;

export const Default: Story = {
  args: {
    rec: {
      "id": "rec-123",
      "score": 35,
      "reasoning": "This role strongly aligns with your background in TypeScript and Cloud Architecture. The company specifically values your experience with Serverless concepts.",
      "skill_matches": ["React", "TypeScript", "Node.js", "AWS Lambda"],
      "skill_misses": ["Kubernetes", "Go"],

      "resume": {
        "id": 42
      },

      "job": {
        "title": "Senior Full Stack Engineer",
        "company": "TechNova Systems",
        "location": "Remote (San Francisco)",
        "description": "We are seeking a talented Full Stack Engineer to join our platform team. You will be responsible for building scalable APIs using Node.js and crafting intuitive UIs with React. Experience with AWS is a must. You should be comfortable working in an agile environment and mentoring junior developers."
      }
    },
  },
};

export const PerfectMatch: Story = {
  args: {
    rec: {
      ...mockRec,
      score: 98,
      skill_matches: [...mockRec.skill_matches, "Kubernetes", "Go"],
      skill_misses: [],
      reasoning: "An exceptional match. Your resume hits every single keyword in the job description.",
    },
  },
};
