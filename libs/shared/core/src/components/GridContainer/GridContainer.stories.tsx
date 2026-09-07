import type { Meta, StoryObj } from '@storybook/react';

import { GridContainer } from './GridContainer';

const meta: Meta<typeof GridContainer> = {
  component: GridContainer,
  title: 'Core/GridContainer',
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof GridContainer> = {
  args: {
    children: (
      <>
        <div className="col-span-8 p-4 bg-gray-200">Col Span 8</div>
        <div className="col-span-4 p-4 bg-gray-300">Col Span 4</div>
      </>
    ),
  },
};
