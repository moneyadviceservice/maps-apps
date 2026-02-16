import { ReactNode } from 'react';

import { useRouter } from 'next/router';

import { fireEvent, render, screen } from '@testing-library/react';

import { TabContainer } from './TabContainer';

import '@testing-library/jest-dom';
import { mockTabTranslation } from 'lib/mocks/mockTabs';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

const mockEnableTab2 = jest.fn(() => {
  render(
    <TabContainer
      tabs={mockTabs}
      activeTabId="income"
      enabledTabCount={2}
      handleTabClick={mockPush}
    >
      <div>Income tab</div>
    </TabContainer>,
  );
});
jest.mock('context/SessionContextProvider', () => ({
  useSessionId: jest.fn(() => 'test-session-id'),
  SessionIdProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  const mockUseTranslation = () => mockTabTranslation;
  return {
    __esModule: true,
    default: mockUseTranslation,
    useTranslation: mockUseTranslation,
  };
});

const mockTabs = [
  {
    step: 1,
    tabName: 'about-us',
  },
  {
    step: 2,
    tabName: 'income',
    content: <div>Income tab</div>,
  },
  {
    step: 3,
    tabName: 'essential-outgoings',
    content: <div>Retirement income</div>,
  },
];

describe('test TabContainer component', () => {
  it('should render all tab headers', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
      >
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );
    expect(screen.getByText('About you')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Essential Outgoings')).toBeInTheDocument();
  });

  it('should render active tab content', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
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
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
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

  it('should default to first tab if activeTabId is not provided', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
      >
        {' '}
        <div>About me description</div>
      </TabContainer>,
    );
    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should not be switch to a disabled tab', () => {
    render(
      <TabContainer
        tabs={mockTabs}
        activeTabId="about-us"
        enabledTabCount={1}
        handleTabClick={jest.fn()}
      >
        {' '}
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );
    fireEvent.click(screen.getByText('Essential Outgoings'));
    expect(mockPush).not.toHaveBeenCalledWith(
      '/?tab=essential-outgoings',
      expect.anything(),
      expect.anything(),
    );
  });
  it('should update active tab and enabled count from query param', () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { tab: 'income' },
      push: mockPush,
    });

    render(
      <TabContainer
        tabs={mockTabs}
        activeTabId="about-us"
        enabledTabCount={1}
        handleTabClick={jest.fn()}
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
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
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
      <TabContainer
        tabs={[]}
        activeTabId="about-us"
        enabledTabCount={0}
        handleTabClick={jest.fn()}
      >
        <div>
          Lorem Ipsum es simplemente el texto de relleno de las imprentas y
          archivos de texto.
        </div>
      </TabContainer>,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
