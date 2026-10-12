import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { TabContainerProps } from '../../lib/types/tabs.type';
import { TabContainer } from './TabContainer/TabContainer';
import { PAGES_NAMES } from '../../lib/constants/pageConstants';

const meta: Meta<typeof TabContainer> = {
  title: 'Components/RBP/TabContainer',
  component: TabContainer,
};

export default meta;

type Story = StoryObj<typeof TabContainer>;

const tabs: TabContainerProps['tabs'] = [
  {
    step: 1,
    tabName: PAGES_NAMES.ABOUTYOU,
  },
  {
    step: 2,
    tabName: PAGES_NAMES.INCOME,
  },
  {
    step: 3,
    tabName: PAGES_NAMES.SUMMARY,
  },
];

export const Default: Story = {
  args: {
    tabs,
    activeTabId: 'tab1',
    enabledTabCount: 1,
    children: <div className="my-10 ml-12">{'Tab content details'}</div>,
  },
};
