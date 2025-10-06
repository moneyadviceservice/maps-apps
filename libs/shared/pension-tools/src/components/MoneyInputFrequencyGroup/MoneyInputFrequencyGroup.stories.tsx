import { StoryFn } from '@storybook/react';

import MoneyInputFrequencyGroup, {
  MoneyInputFrequencyGroupProps,
} from './MoneyInputFrequencyGroup';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/MoneyInputFrequencyGroup',
  component: MoneyInputFrequencyGroup,
  argTyoes: {},
};

const Template: StoryFn<MoneyInputFrequencyGroupProps> = (args) => (
  <div className="w-[390px]">
    <MoneyInputFrequencyGroup {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  moneyInputname: 'inputName',
  moneyInputValue: '3000',
  frequencySelectName: 'frequencyName',
  frequencySelectDefaultValue: 'monthly',
  frequencySelectOptions: [
    { value: 'monthly', text: 'per month' },
    { value: 'yearly', text: 'per year' },
  ],
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  moneyInputname: 'inputName',
  moneyInputValue: '3000',
  frequencySelectName: 'frequencyName',
  frequencySelectDefaultValue: 'monthly',
  frequencySelectOptions: [
    { value: 'monthly', text: 'per month' },
    { value: 'yearly', text: 'per year' },
  ],
  labelText: 'Retirement income',
};

export const WithLabelInput = Template.bind({});
WithLabelInput.args = {
  moneyInputname: 'inputName',
  moneyInputValue: '3000',
  frequencySelectName: 'frequencyName',
  frequencySelectDefaultValue: 'monthly',
  frequencySelectOptions: [
    { value: 'monthly', text: 'per month' },
    { value: 'yearly', text: 'per year' },
  ],
  labelInputName: 'labelName',
};

export default StoryProps;
