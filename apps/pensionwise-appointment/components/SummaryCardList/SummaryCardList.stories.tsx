import React from 'react';
import { StoryFn } from '@storybook/react';
import { SummaryCardList, SummaryCardListProps } from '.';
import mockData from './SummaryCardList.mock.json';

const StoryProps = {
  title: 'Components/PWD-APPOINTMENT/SummaryCardList',
  component: SummaryCardList,
};

const Template: StoryFn<SummaryCardListProps> = (args) => (
  <SummaryCardList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  data: mockData,
};

export default StoryProps;
