import { StoryFn } from '@storybook/nextjs';

import { RadioButton, RadioButtonProps } from '.';

const StoryProps = {
  title: 'Components/FORM/RadioButton',
  component: RadioButton,
  tags: ['atom'],
};

const Template: StoryFn<RadioButtonProps> = (args) => <RadioButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Radio Name',
  value: '',
  id: 'id-1',
  name: 'field-name-1',
};

export const WithHint = Template.bind({});
WithHint.args = {
  ...Default.args,
  id: 'id-2',
  name: 'field-name-2',
  hint: 'Hint label',
};

export const Checked = Template.bind({});
Checked.args = {
  ...Default.args,
  id: 'id-3',
  name: 'field-name-3',
  defaultChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  id: 'id-4',
  name: 'field-name-4',
  disabled: true,
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  id: 'id-5',
  name: 'field-name-5',
  hasError: true,
};

export default StoryProps;
