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
  children: 'EmbedPageLayout contents',
};

export default StoryProps;
