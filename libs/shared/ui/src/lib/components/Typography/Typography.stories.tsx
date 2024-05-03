import { StoryFn } from '@storybook/react';
import { Typography } from '.';

const StoryProps = {
  title: 'Tailwind/Typography',
  component: Typography,
};

const Template: StoryFn = () => <Typography />;

export const TypographyStyles = Template.bind({});

export default StoryProps;
