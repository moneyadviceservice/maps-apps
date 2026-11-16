import type { ComponentProps } from 'react';

import { StoryFn } from '@storybook/nextjs';

import { SkipLink } from '.';

const StoryProps = {
  title: 'Components/COMMON/SkipLink',
  component: SkipLink,
  parameters: {
    docs: {
      description: {
        component:
          'Use Tab to focus the skip link and make it visible, then activate it to jump to the Results section.',
      },
    },
  },
};

const Template: StoryFn<ComponentProps<typeof SkipLink>> = (args) => (
  <div className="relative min-h-40 p-4">
    <SkipLink {...args} className="top-4 left-4 bottom-auto right-auto" />
    <main
      id="results"
      tabIndex={-1}
      className="mt-12 border border-gray-300 p-4 focus:outline focus:outline-2 focus:outline-blue-700"
    >
      Results
    </main>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Skip to results',
  href: '#results',
};

export default StoryProps;
