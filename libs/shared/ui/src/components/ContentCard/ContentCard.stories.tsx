import { StoryFn } from '@storybook/react';
import { ContentCard, ContentCardProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/ContentCard',
  component: ContentCard,
};

const Template: StoryFn<ContentCardProps> = (args) => <ContentCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Make sure you're ready...",
  title: 'Save your money',
  image: {
    src: '/images/next-steps-control.png',
    alt: 'money on the worktop',
  },
};

export const NoImage = Template.bind({});
NoImage.args = {
  children: "Make sure you're ready...",
  title: 'Save your money',
};

export default StoryProps;
