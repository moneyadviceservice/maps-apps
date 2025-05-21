import { StoryFn } from '@storybook/react';

import { Checkbox, CheckboxProps } from './Checkbox';

const StoryProps = {
  title: 'Components/TOOLS/CheckboxButton',
  component: Checkbox,
};

const Template: StoryFn<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Checkbox',
  value: '',
  id: 'id-1',
  name: 'field-name',
};

export default StoryProps;
