import { StoryFn } from '@storybook/nextjs';

import { SupportFaqList, SupportFaqListProps } from './SupportFaqList';
import mockData from './SupportFaqList.mock.json';

const StoryProps = {
  title: 'Components/MHPD/SupportFaqList',
  component: SupportFaqList,
};

const Template: StoryFn<SupportFaqListProps> = (args) => (
  <SupportFaqList {...args} faqs={mockData} />
);

export const SupportFaqListEnglish = Template.bind({});
SupportFaqListEnglish.args = {
  locale: 'en',
};

export const SupportFaqListWelsh = Template.bind({});
SupportFaqListWelsh.args = {
  locale: 'cy',
};

export default StoryProps;
