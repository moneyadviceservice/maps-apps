import { StoryFn } from '@storybook/react';

import { Props, TextInput } from '.';

const StoryProps = {
  title: 'Components/FORM/TextInput',
  component: TextInput,
};

const Template: StoryFn<Props> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
export const WithLabel = Template.bind({});
WithLabel.args = {
  id: 'text id',
  label: 'Text Input',
  type: 'text',
};
export const NumberInput = Template.bind({});
NumberInput.args = {
  id: 'number id',
  label: 'Numeric Input Only',
  type: 'number',
};
export const WithError = Template.bind({});
WithError.args = {
  id: 'error id',
  label: 'Text Input',
  type: 'text',
  error: 'This is an error message',
};
export const WithHint = Template.bind({});
WithHint.args = {
  id: 'hint id',
  label: 'Text Input',
  type: 'text',
  hint: 'This is a hint message',
};
export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  id: 'error and hint id',
  label: 'Text Input',
  type: 'text',
  error: 'This is an error message',
  hint: 'This is a hint message',
};

export default StoryProps;
