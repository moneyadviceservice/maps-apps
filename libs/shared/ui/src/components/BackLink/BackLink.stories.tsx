import { StoryFn } from '@storybook/nextjs';

import { BackLink } from './BackLink';

const StoryProps = {
  title: 'Components/COMMON/BackLink',
  component: BackLink,
  parameters: {
    controls: {
      include: ['children', 'href', 'title', 'target', 'rel'],
    },
    docs: {
      controls: {
        include: ['children', 'href', 'title', 'target', 'rel'],
      },
    },
  },
};

const Template: StoryFn<typeof BackLink> = (args) => (
  <div className="text-base leading-6 w-fit">
    <BackLink {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Back',
  href: '/en',
  title: 'Back to previous page',
  scroll: true,
};

export const External = Template.bind({});
External.args = {
  children: 'Back to example.org',
  href: 'https://www.example.org',
  target: '_blank',
  rel: 'noopener noreferrer',
  scroll: false,
};

export default StoryProps;
