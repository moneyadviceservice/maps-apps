import React from 'react';

import { GetServerSideProps } from 'next';

import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';

import {
  Tab1ChildComponent,
  Tab2ChildComponent,
  Tab3ChildComponent,
} from '../components/TabExample';
import TabContentExample from '../components/TabExample/TabContentExample';
import { TabContainer } from '../components/Tabs/TabContainer/TabContainer';
import { Tab } from '../lib/types/tabs.type';

import '@maps-react/common/styles/globals.scss';

/* This page has been created for testing reusable tab functionality. Will be removed when we start the development*/
export interface HomePageProps {
  initialActiveTabId: string;
  initialEnabledTabCount: number;
}

const tabIds = ['tab1', 'tab2', 'tab3', 'tab4'];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tabFromQuery = context.query.tab as string | undefined;
  let initialActiveTabId = 'tab1',
    initialEnabledTabCount = 1;
  if (tabFromQuery && tabIds.includes(tabFromQuery)) {
    initialActiveTabId = tabFromQuery;
    const tabIndex = tabIds.indexOf(tabFromQuery);
    initialEnabledTabCount = tabIndex + 1;
  }
  return {
    props: {
      initialActiveTabId,
      initialEnabledTabCount,
    },
  };
};

const HomePage: React.FC<HomePageProps> = ({
  initialActiveTabId,
  initialEnabledTabCount,
}) => {
  const tabs: Tab[] = [
    {
      id: 'tab1',
      title: 'About me',
      content: (
        <Tab1ChildComponent
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
      title: 'Retirment Income',
      content: (
        <Tab2ChildComponent
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
      title: 'Pension contributions',
      content: (
        <Tab3ChildComponent
          tabIndex={0}
          onEnableNext={() => {
            /**/
          }}
          isLastTab={true}
        />
      ),
    },
    {
      id: 'tab4',
      title: 'Summary',
      content: (
        <TabContentExample
          tabIndex={0}
          onEnableNext={() => {
            /**/
          }}
          isLastTab={true}
        />
      ),
    },
  ];

  return (
    <main className="min-h-screen">
      <div className={twMerge('container-auto py-8 mb-4')}>
        <Heading
          color={twMerge('text-blue-800 lg:max-w-[840px]')}
          data-testid="toolpage-h1-title"
          level={'h3'}
        >
          Retirement budget planner tab flow
        </Heading>
      </div>
      <TabContainer
        tabs={tabs}
        initialActiveTabId={initialActiveTabId}
        iniitialEnabledTabCount={initialEnabledTabCount}
      />
    </main>
  );
};

export default HomePage;
