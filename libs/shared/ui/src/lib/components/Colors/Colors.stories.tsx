import { StoryFn } from '@storybook/react';
import { Colors } from '.';

const StoryProps = {
  title: 'Tailwind/Colors',
  component: Colors,
};

const Template: StoryFn = () => <Colors />;

export const ColorPalette = Template.bind({});

export default StoryProps;
