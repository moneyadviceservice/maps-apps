import { StoryFn } from '@storybook/react';
import { Header } from '.';

const StoryProps = {
  title: 'Components/MHPD/Header',
  component: Header,
};

const Template: StoryFn = () => <Header />;

export const Default = Template;

export default StoryProps;
