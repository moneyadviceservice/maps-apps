import { StoryFn } from '@storybook/react';
import { PercentInput } from './PercentInput';

const StoryProps = {
  title: 'Components/PercentInput',
  component: PercentInput,
};

const Template: StoryFn = (args) => <PercentInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'label',
  id: 'id',
  name: 'name',
  defaultValue: '',
  onChange: () => {},
};

export default StoryProps;
