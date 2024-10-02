import { StoryFn } from '@storybook/react';
import PieChart from '.';

const StoryProps = {
  title: 'Components/TOOLS/PieChart',
  component: PieChart,
};

const data = [
  {
    name: 'Household bills',
    percentage: 50,
    colour: '#007a91',
  },
  {
    name: 'Living costs',
    percentage: 20,
    colour: '#f56727',
  },
  {
    name: 'Finance & Insurance',
    percentage: 15,
    colour: '#bc0061',
  },
  {
    name: 'Family & Friends',
    percentage: 5,
    colour: '#879a24',
  },
  {
    name: 'Travel',
    percentage: 5,
    colour: '#000d3d',
  },
  {
    name: 'Leisure',
    percentage: 5,
    colour: '#0b4a6d',
  },
];

const Template: StoryFn<typeof PieChart> = (args) => <PieChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: data,
};
export const Increase = Template.bind({});
Increase.args = {
  items: data,
  value: 10000,
  title: 'Monthly increase',
  direction: 'increase',
};
export const Decrease = Template.bind({});
Decrease.args = {
  items: data,
  value: 10000,
  title: 'Monthly decrease',
  direction: 'decrease',
};

export default StoryProps;
