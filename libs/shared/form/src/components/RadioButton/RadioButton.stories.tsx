import { StoryFn } from '@storybook/nextjs';

import { RadioButton, RadioButtonProps } from '.';

const StoryProps = {
  title: 'Components/FORM/RadioButton',
  component: RadioButton,
};

const Template: StoryFn<RadioButtonProps> = (args) => <RadioButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Radio Name',
  value: '',
  id: 'id-1',
  name: 'field-name-1',
};

export const Checked = Template.bind({});
Checked.args = {
  ...Default.args,
  id: 'id-2',
  name: 'field-name-2',
  defaultChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  id: 'id-3',
  name: 'field-name-3',
  disabled: true,
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  id: 'id-4',
  name: 'field-name-4',
  hasError: true,
};

export default StoryProps;
