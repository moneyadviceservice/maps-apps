import { StoryFn } from '@storybook/nextjs';

import { Hero, HeroProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Hero',
  component: Hero,
};

const Template: StoryFn<HeroProps> = (args) => <Hero {...args} />;

export const Default = Template.bind({});
Default.args = {
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ipsa quo veniam laborum ex iure.',
  title: 'An example title that breaks over multiple lines',
};

export default StoryProps;
