import { StoryFn } from '@storybook/nextjs';

import { Colors } from '.';

const StoryProps = {
  title: 'Storybook/Colors',
  component: Colors,
};

const Template: StoryFn = () => <Colors />;

export const ColorPalette = Template.bind({});

export default StoryProps;
