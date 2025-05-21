import { StoryFn } from '@storybook/react';

import { Props, Select } from './Select';

const StoryProps = {
  title: 'Components/FORM/Select',
  component: Select,
  argTypes: {},
};

const Template: StoryFn<Props> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'name1',
  options: [{ text: 'Some text', value: 'Some value' }],
};

export const EmptyItemText = Template.bind({});
EmptyItemText.args = {
  name: 'name1',
  emptyItemText: 'Please choose an item',
  options: [{ text: 'Some text', value: 'Some value' }],
};

export const HideEmptyItem = Template.bind({});
HideEmptyItem.args = {
  name: 'name1',
  hideEmptyItem: true,
  options: [{ text: 'Some text', value: 'Some value' }],
};

export const HidePlaceholder = Template.bind({});
HidePlaceholder.args = {
  name: 'name1',
  hidePlaceholder: true,
  options: [{ text: 'Some text', value: 'Some value' }],
};

export default StoryProps;
