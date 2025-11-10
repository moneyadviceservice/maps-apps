import { StoryFn } from '@storybook/nextjs';

import { Props, TextArea } from '.';

const StoryProps = {
  title: 'Components/FORM/TextArea',
  component: TextArea,
};

const Template: StoryFn<Props> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
export const WithLabel = Template.bind({});
WithLabel.args = {
  id: 'text id',
  label: 'Text Area',
};

export const WithError = Template.bind({});
WithError.args = {
  id: 'error id',
  label: 'Text Area',
  error: 'This is an error message',
};
export const WithHint = Template.bind({});
WithHint.args = {
  id: 'hint id',
  label: 'Text Area',
  hint: 'This is a hint message',
};
export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  id: 'error and hint id',
  label: 'Text Area',
  error: 'This is an error message',
  hint: 'This is a hint message',
};
export const WithCharacterCount = Template.bind({});
WithCharacterCount.args = {
  id: 'character count id',
  hasCharacterCounter: true,
  maxLength: 4000,
};

export const WithDefaultValueAndCounter = Template.bind({});
WithDefaultValueAndCounter.args = {
  id: 'default-value-text-area',
  label: 'Text Area with Default Value and Counter',
  hasCharacterCounter: true,
  maxLength: 4000,
  defaultValue: 'This is a default value.',
};
export default StoryProps;
