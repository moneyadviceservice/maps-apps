import { StoryFn } from '@storybook/react';

import { Container, ContainerProps } from '.';

const StoryProps = {
  title: 'Components/CORE/Container',
  component: Container,
};

const Template: StoryFn<ContainerProps> = (args) => <Container {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Container contents',
};

export default StoryProps;
