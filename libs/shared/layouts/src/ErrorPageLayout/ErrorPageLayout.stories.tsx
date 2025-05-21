import { StoryFn } from '@storybook/react';

import { ErrorPageLayout, ErrorPageLayoutProps } from '.';

const StoryProps = {
  title: 'Layouts/COMMON/ErrorPageLayout',
  component: ErrorPageLayout,
};

const Template: StoryFn<ErrorPageLayoutProps> = (args) => (
  <ErrorPageLayout {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isEmbedded: false,
};

export const Embedded = Template.bind({});

Embedded.args = {
  isEmbedded: true,
};

export default StoryProps;
