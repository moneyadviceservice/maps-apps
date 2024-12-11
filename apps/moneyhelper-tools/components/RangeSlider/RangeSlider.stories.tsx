import { StoryFn } from '@storybook/react';
import { RangeSlider, RangeSliderProps } from '../RangeSlider';

const StoryProps = {
  title: 'Components/TOOLS/RangeSlider',
  component: RangeSlider,
};

const Template: StoryFn<RangeSliderProps> = (args) => (
  <RangeSlider value={6} {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  onChange: () => {},
};

export default StoryProps;
