import { StoryFn } from '@storybook/react';
import { Heading, HeadingProps } from '.';

const StoryProps = {
  title: 'Components/Heading',
  component: Heading,
};

const Template: StoryFn<HeadingProps> = (args) => <Heading {...args} />;

export const H1 = Template.bind({});
H1.args = {
  children: 'H1',
};

export const H1CustomExample = Template.bind({});
H1CustomExample.args = {
  children: 'H1',
  component: 'p',
  fontWeight: 'font-[500]',
  color: 'text-amber-600',
};

export const H2 = Template.bind({});
H2.args = {
  level: 'h2',
  children: 'H2',
};

export const H3 = Template.bind({});
H3.args = {
  level: 'h3',
  children: 'H3',
};

export const H4 = Template.bind({});
H4.args = {
  level: 'h4',
  children: 'H4',
};

export const H5 = Template.bind({});
H5.args = {
  level: 'h5',
  children: 'H5',
};

export const H6 = Template.bind({});
H6.args = {
  level: 'h6',
  children: 'H6',
};
export default StoryProps;
