import { StoryFn } from '@storybook/nextjs';

import { MoneyInput } from './MoneyInput';

const StoryProps = {
  title: 'Components/TOOLS/MoneyInput',
  component: MoneyInput,
};

const Template: StoryFn = (args) => <MoneyInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'label',
  id: 'id',
  name: 'name',
  defaultValue: '',
};

export default StoryProps;
