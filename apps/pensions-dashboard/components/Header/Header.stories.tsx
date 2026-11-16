import { StoryFn } from '@storybook/nextjs';

import { Header } from '.';

const StoryProps = {
  title: 'Components/MHPD/Header',
  component: Header,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Template: StoryFn = () => <Header handleLogout={() => {}} />;

export const Default = Template;

export default StoryProps;
