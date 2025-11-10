import { StoryFn } from '@storybook/react';

import SummaryTotal, { SUMMARY_TOTAL_STATUS_TYPES } from './SummaryTotal';

const StoryProps = {
  title: 'Components/PENSION-TOOLS/SummaryTotal',
  component: SummaryTotal,
  argTypes: {},
};

const Template: StoryFn<typeof SummaryTotal> = (args) => (
  <SummaryTotal {...args} />
);

export default StoryProps;
export const Default = Template.bind({});
const baseargs = {
  title: 'Summary total',
  income: 2000,
  spending: 1500,
  balance: 500,
  incomeLabel: 'Income',
  spendingLabel: 'Spending',
  balanceLabel: 'Balance',
};
Default.args = {
  ...baseargs,
  status: SUMMARY_TOTAL_STATUS_TYPES.BALANCED,
};

export const Positive = Template.bind({});
Positive.args = {
  ...baseargs,
  status: SUMMARY_TOTAL_STATUS_TYPES.POSITIVE,
};

export const Negative = Template.bind({});
Negative.args = {
  ...baseargs,
  status: SUMMARY_TOTAL_STATUS_TYPES.NEGATIVE,
};
