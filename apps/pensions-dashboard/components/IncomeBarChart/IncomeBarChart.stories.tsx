import { StoryFn } from '@storybook/nextjs';

import { IncomeBarChart, IncomeBarChartProps } from '.';
import { PensionType } from '../../lib/constants';

const StoryProps = {
  title: 'Components/MHPD/IncomeBarChart',
  component: IncomeBarChart,
};

const apData = {
  date: '2024-11-01',
  annualAmount: 1210,
  monthlyAmount: 101,
};

const eriData = {
  date: '2036-11-01',
  annualAmount: 4940,
  monthlyAmount: 420,
};

const apNoData = {
  date: undefined,
  annualAmount: 0,
  monthlyAmount: 0,
};

const eriNoData = {
  date: undefined,
  annualAmount: 0,
  monthlyAmount: 0,
};

const Template: StoryFn<IncomeBarChartProps> = (args) => (
  <IncomeBarChart {...args} />
);

export const DC = Template.bind({});
DC.args = {
  ap: apData,
  eri: eriData,
  pensionType: PensionType.DC,
};

export const DB = Template.bind({});
DB.args = {
  ap: apData,
  eri: eriData,
  pensionType: PensionType.DB,
};

export const AVC = Template.bind({});
AVC.args = {
  ap: apData,
  eri: eriData,
  pensionType: PensionType.AVC,
};

export const HYB = Template.bind({});
HYB.args = {
  ap: apData,
  eri: eriData,
  pensionType: PensionType.HYB,
};

export const NoAP = Template.bind({});
NoAP.args = {
  ap: apNoData,
  eri: eriData,
  pensionType: PensionType.DB,
};

export const NoERI = Template.bind({});
NoERI.args = {
  ap: apData,
  eri: eriNoData,
  pensionType: PensionType.DB,
};

export const NoData = Template.bind({});
NoData.args = {
  ap: apNoData,
  eri: eriNoData,
  pensionType: PensionType.DB,
};

export default StoryProps;
