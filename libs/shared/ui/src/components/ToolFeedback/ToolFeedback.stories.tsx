import { StoryFn } from '@storybook/nextjs';

import { ToolFeedback, ToolFeedbackProps } from './ToolFeedback';

const StoryProps = {
  title: 'Components/COMMON/ToolFeedback',
  component: ToolFeedback,
};

const Template: StoryFn<ToolFeedbackProps> = (args) => (
  <ToolFeedback {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithCustomClass = Template.bind({});
WithCustomClass.args = {
  className: 'custom-class',
};

export default StoryProps;
