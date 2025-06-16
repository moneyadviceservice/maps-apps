import { StoryFn } from '@storybook/react';

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
  name: 'field-name',
};

export default StoryProps;
