import { StoryFn } from '@storybook/react';
import { NumberInput, Props } from './NumberInput';

const StoryProps = {
  title: 'Components/NumberInput',
  component: NumberInput,
};

const Template: StoryFn<Props> = (args) => <NumberInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'id',
  name: 'number input',
  defaultValue: '',
  className: 'rounded-lg',
  onChange: () => {},
};

export default StoryProps;
