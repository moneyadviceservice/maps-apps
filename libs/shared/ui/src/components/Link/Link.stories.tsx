import { StoryFn } from '@storybook/react';
import { Link, LinkComponentProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Link',
  component: Link,
};

const Template: StoryFn<LinkComponentProps> = (args) => <Link {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Some link text',
  href: 'https://www.example.org',
};

export const WhiteText = Template.bind({});
WhiteText.args = {
  children: 'Some link text',
  href: 'https://www.example.org',
  variant: 'whiteText',
};

export const External = Template.bind({});
External.args = {
  children: 'External Some link text',
  href: 'https://www.example.org',
  target: '_blank',
  asInlineText: true,
};

export default StoryProps;
