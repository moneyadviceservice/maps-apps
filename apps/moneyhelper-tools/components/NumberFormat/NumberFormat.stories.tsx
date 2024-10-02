import { StoryFn } from '@storybook/react';
import NumberFormat, { Props } from '.';

const StoryProps = {
  title: 'Components/TOOLS/NumberFormat',
  component: NumberFormat,
};

const Template: StoryFn<Props> = (args) => <NumberFormat {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 1000,
};

export const DirectionIncrease = Template.bind({});
DirectionIncrease.args = {
  value: 1000,
  direction: 'increase',
};

export const DirectionIncreaseWithIconRight = Template.bind({});
DirectionIncreaseWithIconRight.args = {
  value: 1000,
  direction: 'increase',
  position: 'right',
};

export const DirectionDecrease = Template.bind({});
DirectionDecrease.args = {
  value: 1000,
  direction: 'decrease',
};

export const DirectionDecreaseWithIconRight = Template.bind({});
DirectionDecreaseWithIconRight.args = {
  value: 1000,
  direction: 'decrease',
  position: 'right',
};

export default StoryProps;
