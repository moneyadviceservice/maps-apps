import { StoryFn } from '@storybook/react';

import MoneuInputFrequencyGroup, {
  MoneyInputFrequencyGroupProps,
} from './MoneyInputFrequencyGroup';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/MoneuInputFrequencyGroup',
  component: MoneuInputFrequencyGroup,
  argTyoes: {},
};

const Template: StoryFn<MoneyInputFrequencyGroupProps> = (args) => (
  <div className="w-[390px]">
    <MoneuInputFrequencyGroup {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  moneyInputname: 'inputName',
  moneyInputDefaultValue: '3000',
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
  moneyInputDefaultValue: '3000',
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
  moneyInputDefaultValue: '3000',
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
