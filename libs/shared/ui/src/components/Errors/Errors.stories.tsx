import { StoryFn } from '@storybook/nextjs';

import { Errors, ErrorsProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Errors',
  component: Errors,
};

const Template: StoryFn<ErrorsProps> = (args) => <Errors {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Errors contents',
  errors: ['You should correct this error'],
};

export const NoErrors = Template.bind({});
NoErrors.args = {
  children: 'There are no errors',
  errors: [],
};

export default StoryProps;
