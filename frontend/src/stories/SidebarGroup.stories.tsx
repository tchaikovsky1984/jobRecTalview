import type { Meta, StoryObj } from '@storybook/react';
import SidebarGroup from '../components/SidebarGroup';
import type { ComponentType } from 'react';

type storyProps = ComponentType<typeof SidebarGroup>;

const meta: Meta<storyProps> = {
  title: 'Components/SidebarGroup',
  component: SidebarGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px] bg-gray-400 p-4 rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarGroup>;

export default meta;
type Story = StoryObj<storyProps>;

export const Default: Story = {
  args: {
    title: "Navigation",
    children: (
      <>
        <div className="cursor-pointer hover:underline text-sm">Dashboard</div>
        <div className="cursor-pointer hover:underline text-sm">Analytics</div>
        <div className="cursor-pointer hover:underline text-sm">Reports</div>
      </>
    ),
  },
};
