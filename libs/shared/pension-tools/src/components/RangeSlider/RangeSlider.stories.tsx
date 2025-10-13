import { StoryFn } from '@storybook/nextjs';

import { RangeSlider, RangeSliderProps } from '.';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/RangeSlider',
  component: RangeSlider,
};

const Template: StoryFn<RangeSliderProps> = (args) => (
  <RangeSlider value={6} {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  onChange: (value) => {
    /* intentionally empty */
  },
};

export default StoryProps;
