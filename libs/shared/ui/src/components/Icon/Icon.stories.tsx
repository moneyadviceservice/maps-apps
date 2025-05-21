import { StoryFn } from '@storybook/react';

import { Icon, IconType } from '.';

const StoryProps = {
  title: 'Components/COMMON/Icon',
  component: Icon,
};

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: IconType.ARROW_CURVED,
  className: 'text-pink-600',
};

export default StoryProps;
