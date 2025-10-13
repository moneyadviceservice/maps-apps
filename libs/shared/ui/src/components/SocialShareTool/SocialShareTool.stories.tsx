import { StoryFn } from '@storybook/nextjs';

import { SocialShareTool, SocialShareToolProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/SocialShareTool',
  component: SocialShareTool,
};

const Template: StoryFn<SocialShareToolProps> = (args) => (
  <SocialShareTool {...args} />
);

export const Default = Template.bind({});
Default.args = {
  url: 'https://example.com',
  title: 'Share this tool',
};

export default StoryProps;
