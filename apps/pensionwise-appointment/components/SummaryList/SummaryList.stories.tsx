import { StoryFn } from '@storybook/react';

import { SummaryList, SummaryListProps } from '.';
import mockData from './SummaryList.mock.json';

const StoryProps = {
  title: 'Components/PWD-APPOINTMENT/SummaryList',
  component: SummaryList,
};

const Template: StoryFn<SummaryListProps> = (args) => <SummaryList {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: mockData,
  title: 'Test title',
};

export default StoryProps;
