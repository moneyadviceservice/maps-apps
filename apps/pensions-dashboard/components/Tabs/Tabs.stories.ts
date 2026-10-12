import { createElement } from 'react';

import { StoryFn } from '@storybook/nextjs';

import { Tabs } from './Tabs';

const summarySelectedRouter = {
  nextjs: {
    router: {
      pathname: '/en/pension-details/your-pension-summary',
    },
  },
};

const StoryProps = {
  title: 'Components/MHPD/Tabs',
  component: Tabs,
};

const Template: StoryFn<typeof Tabs> = (args) => createElement(Tabs, args);

export const Default = Template.bind({});
Default.parameters = summarySelectedRouter;

export default StoryProps;
