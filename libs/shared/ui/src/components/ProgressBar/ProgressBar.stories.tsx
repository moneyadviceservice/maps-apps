import { StoryFn } from '@storybook/react';

import { ProgressBar, ProgressBarProps, VariantType } from '.';

const StoryProps = {
  title: 'Components/COMMON/ProgressBar',
  component: ProgressBar,
};

const Template: StoryFn<ProgressBarProps> = (args) => <ProgressBar {...args} />;

export const Pink = Template.bind({});
Pink.args = {
  value: 2,
  label: '2 of 5 tasks completed',
  max: 5,
};

export const Blue = Template.bind({});
Blue.args = {
  value: 40,
  label: '40% complete',
  max: 100,
  variant: VariantType.BLUE,
};

export default StoryProps;
