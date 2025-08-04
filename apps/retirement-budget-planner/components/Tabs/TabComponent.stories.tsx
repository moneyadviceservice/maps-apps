import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@maps-react/common/components/Button';

import { buttonClassName } from '../../lib/constants/styles/tabs.const';
import { TabContainerProps } from '../../lib/types/tabs.type';
import { TabContainer } from './TabContainer/TabContainer';

const meta: Meta<typeof TabContainer> = {
  title: 'Components/RBP/TabContainer',
  component: TabContainer,
};

export default meta;

type Story = StoryObj<typeof TabContainer>;

const MockTabContent = ({
  onEnableNext,
  isLastTab,
  tabIndex,
  nextTabId,
}: {
  onEnableNext: (id: string) => void;
  isLastTab: boolean;
  tabIndex: number;
  nextTabId?: string;
}) => (
  <div>
    <p>Tab {tabIndex + 1} content</p>
    {!isLastTab && nextTabId && (
      <Button
        className={buttonClassName}
        onClick={() => onEnableNext(nextTabId)}
      >
        Enable Next
      </Button>
    )}
  </div>
);

// Instead of passing <MockTabContent /> directly, wrap it in a function
const tabs: TabContainerProps['tabs'] = [
  {
    id: 'tab1',
    title: 'About me',
    content: (
      <MockTabContent
        tabIndex={0}
        onEnableNext={() => {
          /**/
        }}
        isLastTab={false}
      />
    ),
  },
  {
    id: 'tab2',
    title: 'Income',
    content: (
      <MockTabContent
        tabIndex={0}
        onEnableNext={() => {
          /**/
        }}
        isLastTab={false}
      />
    ),
  },
  {
    id: 'tab3',
    title: 'Summary',
    content: (
      <MockTabContent
        tabIndex={0}
        onEnableNext={() => {
          /**/
        }}
        isLastTab={true}
      />
    ),
  },
];

export const Default: Story = {
  args: {
    tabs,
    initialActiveTabId: 'tab1',
    iniitialEnabledTabCount: 1,
  },
};
