import { StoryFn } from '@storybook/react';

import { EmbedPageLayout, EmbedPageLayoutProps } from '.';

const StoryProps = {
  title: 'Layouts/COMMON/EmbedPageLayout',
  component: EmbedPageLayout,
};

const Template: StoryFn<EmbedPageLayoutProps> = (args) => (
  <EmbedPageLayout {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: 'Embedded Tool Title',
  children: 'EmbedPageLayout contents',
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  children: 'EmbedPageLayout contents - no title',
};

export default StoryProps;
