import { StoryFn } from '@storybook/nextjs';

import { DonutChart, DonutChartProps } from '.';
import { PensionType } from '../../lib/constants';

const StoryProps = {
  title: 'Components/MHPD/DonutChart',
  component: DonutChart,
};

const apDataDonut = {
  date: '2024-11-01',
  amount: 1210,
};

const eriDataDonut = {
  date: '2036-11-01',
  amount: 4940,
};

const apNoDataDonut = {
  date: undefined,
  amount: 0,
};

const eriNoDataDonut = {
  date: undefined,
  amount: 0,
};

const Template: StoryFn<DonutChartProps> = (args) => <DonutChart {...args} />;

export const DCDonut = Template.bind({});
DCDonut.args = {
  ap: apDataDonut,
  eri: eriDataDonut,
  pensionType: PensionType.DC,
};

export const DBDonut = Template.bind({});
DBDonut.args = {
  ap: apDataDonut,
  eri: eriDataDonut,
  pensionType: PensionType.DB,
};

export const NoAPDonut = Template.bind({});
NoAPDonut.args = {
  ap: apNoDataDonut,
  eri: eriDataDonut,
  pensionType: PensionType.DB,
};

export const NoERIDonut = Template.bind({});
NoERIDonut.args = {
  ap: apDataDonut,
  eri: eriNoDataDonut,
  pensionType: PensionType.DB,
};

export const NoDataDonut = Template.bind({});
NoDataDonut.args = {
  ap: apNoDataDonut,
  eri: eriNoDataDonut,
  pensionType: PensionType.DB,
};

export default StoryProps;
