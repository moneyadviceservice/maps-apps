import React, { ReactNode } from 'react';

import { useRouter } from 'next/router';

import { fireEvent, render, screen } from '@testing-library/react';

import { TabContainer } from './TabContainer';

import { PAGES_NAMES } from '../../../lib/constants/pageConstants';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

const mockEnableTab2 = jest.fn(() => {
  render(
    <TabContainer
      tabs={mockTabs}
      initialActiveTabId="tab2"
      iniitialEnabledTabCount={2}
      tabName={PAGES_NAMES.INCOME}
    >
      <div>Income tab</div>
    </TabContainer>,
  );
});
jest.mock('context/SessionContextProvider', () => ({
  useSessionId: jest.fn(() => 'test-session-id'),
  SessionIdProvider: ({ children }: { children: ReactNode }) => children,
}));

const mockTabs = [
  {
    step: 1,
    tabName: 'tab1',
    title: 'About me',
  },
  {
    step: 2,
    tabName: 'tab2',
    title: 'Income',
    content: <div>Income tab</div>,
  },
  {
    step: 3,
    tabName: 'tab3',
    title: 'Retirement',
    content: <div>Retirement income</div>,
  },
];

describe('test TabContainer component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { language: 'en' },
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('should render all tab headers', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        tabName={PAGES_NAMES.INCOME}
      >
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );
    expect(screen.getByText('About me')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Retirement')).toBeInTheDocument();
  });

  it('should render active tab content', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        tabName={PAGES_NAMES.INCOME}
      >
        <div>About me description</div>
      </TabContainer>,
    );
    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should be able to navigate to next active tab content', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        tabName={PAGES_NAMES.INCOME}
      >
        <>
          <div>About me description</div>
          <button onClick={mockEnableTab2}>Enable Tab 2</button>
        </>
      </TabContainer>,
    );
    expect(screen.getByText('About me description')).toBeInTheDocument();
    const childButton = screen.getByRole('button');
    expect(childButton).toHaveTextContent('Enable Tab 2');
    fireEvent.click(childButton);
    expect(screen.getByText('Income tab')).toBeInTheDocument();
  });

  it('should default to first tab if initialActiveTabId is not provided', () => {
    render(
      <TabContainer tabs={mockTabs} tabName={PAGES_NAMES.INCOME}>
        {' '}
        <div>About me description</div>
      </TabContainer>,
    );
    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should switch to another enabled tab on click', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        iniitialEnabledTabCount={2}
        tabName={PAGES_NAMES.INCOME}
      >
        {' '}
        <div>Income Tab</div>
      </TabContainer>,
    );
    fireEvent.click(screen.getByText('Income'));
    expect(mockPush).toHaveBeenCalledWith('/en/tab2?sessionId=test-session-id');
  });

  it('should not be switch to a disabled tab', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        iniitialEnabledTabCount={1}
        tabName={PAGES_NAMES.INCOME}
      >
        {' '}
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );
    fireEvent.click(screen.getByText('Retirement'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/?tab=tab3',
      expect.anything(),
      expect.anything(),
    );
  });
  it('should update active tab and enabled count from query param', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { tab: 'tab2' },
      push: mockPush,
    });

    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        iniitialEnabledTabCount={1}
        tabName={PAGES_NAMES.INCOME}
      >
        {' '}
        <div>Income tab</div>
      </TabContainer>,
    );

    expect(screen.getByText('Income tab')).toBeInTheDocument();
  });

  it('should default enabledTabCount to 1 if not provided', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        tabName={PAGES_NAMES.INCOME}
      >
        {' '}
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );
    fireEvent.click(screen.getByText('Income'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render nothing if tabs array is empty', () => {
    render(
      <TabContainer tabs={[]} tabName={PAGES_NAMES.INCOME}>
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
