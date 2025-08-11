import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { TabContainerProps } from '../../lib/types/tabs.type';
import { TabContainer } from './TabContainer/TabContainer';

const meta: Meta<typeof TabContainer> = {
  title: 'Components/RBP/TabContainer',
  component: TabContainer,
};

export default meta;

type Story = StoryObj<typeof TabContainer>;

const tabs: TabContainerProps['tabs'] = [
  {
    step: 1,
    tabName: 'tab1',
    title: 'About me',
  },
  {
    step: 2,
    tabName: 'tab2',
    title: 'Income',
  },
  {
    step: 3,
    tabName: 'tab3',
    title: 'Summary',
  },
];

export const Default: Story = {
  args: {
    tabs,
    initialActiveTabId: 'tab1',
    iniitialEnabledTabCount: 1,
    tabName: 'tab1',
    children: <div className="ml-12 my-10">{'Tab content details'}</div>,
  },
};
