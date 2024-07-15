import { StoryFn } from '@storybook/react';
import { MoneyInput } from './MoneyInput';

const StoryProps = {
  title: 'Components/MoneyInput',
  component: MoneyInput,
};

const Template: StoryFn = (args) => <MoneyInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'label',
  id: 'id',
  name: 'name',
  defaultValue: '',
  onChange: () => {},
};

export default StoryProps;
