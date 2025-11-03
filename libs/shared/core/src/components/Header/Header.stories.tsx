import { StoryFn } from '@storybook/nextjs';

import { Header } from '.';

const StoryProps = {
  title: 'Components/CORE/Header',
  component: Header,
};

const Template: StoryFn = () => <Header />;

export const Default = Template;

export default StoryProps;
