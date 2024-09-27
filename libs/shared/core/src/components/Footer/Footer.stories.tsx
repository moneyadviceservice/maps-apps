import { StoryFn } from '@storybook/react';
import { Footer } from '.';

const StoryProps = {
  title: 'Components/CORE/Footer',
  component: Footer,
};

const Template: StoryFn = (args) => <Footer {...args} />;

export const Default = Template;

export default StoryProps;
