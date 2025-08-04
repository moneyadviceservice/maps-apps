import React from 'react';

import { useRouter } from 'next/router';

import { fireEvent, render, screen } from '@testing-library/react';

import { TabContainer } from './TabContainer';

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
    />,
  );
});

const mockTabs = [
  {
    id: 'tab1',
    title: 'About me',
    content: (
      <div>
        <div>About me description</div>
        <button onClick={mockEnableTab2}>Enable Tab 2</button>
      </div>
    ),
  },
  {
    id: 'tab2',
    title: 'Income',
    content: <div>Income tab</div>,
  },
  {
    id: 'tab3',
    title: 'Retirement',
    content: <div>Retirement income</div>,
  },
];

describe('test TabContainer component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('should render all tab headers', () => {
    render(<TabContainer tabs={mockTabs} initialActiveTabId="tab1" />);
    expect(screen.getByText('About me')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Retirement')).toBeInTheDocument();
  });

  it('should render active tab content', () => {
    render(<TabContainer tabs={mockTabs} initialActiveTabId="tab1" />);
    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should be able to navigate to next active tab content', () => {
    render(<TabContainer tabs={mockTabs} initialActiveTabId="tab1" />);
    expect(screen.getByText('About me description')).toBeInTheDocument();
    const childButton = screen.getByRole('button');
    expect(childButton).toHaveTextContent('Enable Tab 2');
    fireEvent.click(childButton);
    expect(screen.getByText('Income tab')).toBeInTheDocument();
  });

  it('should default to first tab if initialActiveTabId is not provided', () => {
    render(<TabContainer tabs={mockTabs} />);
    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should switch to another enabled tab on click', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        iniitialEnabledTabCount={2}
      />,
    );
    fireEvent.click(screen.getByText('Income'));
    expect(mockPush).toHaveBeenCalledWith('/?tab=tab2', undefined, {
      shallow: true,
    });
  });

  it('should not be switch to a disabled tab', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        initialActiveTabId="tab1"
        iniitialEnabledTabCount={1}
      />,
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
      />,
    );

    expect(screen.getByText('Income tab')).toBeInTheDocument();
  });

  it('should default enabledTabCount to 1 if not provided', () => {
    render(<TabContainer tabs={mockTabs} initialActiveTabId="tab1" />);
    fireEvent.click(screen.getByText('Income'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should render nothing if tabs array is empty', () => {
    render(<TabContainer tabs={[]} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
