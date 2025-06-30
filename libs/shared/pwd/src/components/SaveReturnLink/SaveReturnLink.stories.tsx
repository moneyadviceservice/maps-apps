import { StoryFn } from '@storybook/react';

import { SaveReturnLink, SaveReturnLinkProps } from '.';

const StoryProps = {
  title: 'Components/PWD/SaveReturnLink',
  component: SaveReturnLink,
};

const Template: StoryFn<SaveReturnLinkProps> = (args) => (
  <SaveReturnLink {...args} />
);

export const Default = Template.bind({});
Default.args = {
  href: {
    pathname: '/path-to-save-page',
    query: 'language=en',
  },
  testId: 'save-return-story',
};

export default StoryProps;
