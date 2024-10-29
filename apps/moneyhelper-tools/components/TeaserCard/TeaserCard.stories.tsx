import { StoryFn } from '@storybook/react';
import { TeaserCard, TeaserCardProps } from './TeaserCard';
import image1 from '../../public/images/bubbles.jpg';

const StoryProps = {
  title: 'Components/TOOLS/TeaserCard',
  component: TeaserCard,
};

const Template: StoryFn<TeaserCardProps> = (args) => <TeaserCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Teaser Card',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta',
  href: 'https://www.google.com',
};

export const WithImage = Template.bind({});
WithImage.args = {
  title: 'Teaser Card',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta',
  href: 'https://www.google.com',
  image: image1,
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  title: 'Teaser Card',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta',
  href: 'https://www.google.com',
};

export default StoryProps;
