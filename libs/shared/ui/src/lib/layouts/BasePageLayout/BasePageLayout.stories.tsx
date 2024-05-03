import { StoryFn } from '@storybook/react';
import { BasePageLayout, BasePageLayoutProps } from '.';

const StoryProps = {
  title: 'Layouts/BasePageLayout',
  component: BasePageLayout,
};

const Template: StoryFn<BasePageLayoutProps> = (args) => (
  <BasePageLayout {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'BasePageLayout contents',
};

export default StoryProps;
