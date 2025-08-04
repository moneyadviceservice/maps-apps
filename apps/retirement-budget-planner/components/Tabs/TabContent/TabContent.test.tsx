import React from 'react';

import { render, screen } from '@testing-library/react';

import {
  findNextTabId,
  findTabIndex,
  getTabContent,
  isEndOfTabs,
} from '../../../lib/util/tabs/tabs';
import { TabContent } from './TabContent';

import '@testing-library/jest-dom';
jest.mock('../../../lib/util/tabs/tabs');

const mockGetTabContent = getTabContent as jest.Mock;
const mockFindTabIndex = findTabIndex as jest.Mock;
const mockFindNextTabId = findNextTabId as jest.Mock;
const mockIsEndOfTabs = isEndOfTabs as jest.Mock;

const mockOnEnableNext = jest.fn();

const mockTabs = [
  {
    id: 'tab1',
    title: 'About me',
    content: <div>About me description</div>,
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

describe('test TabContent component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the active tab content correctly', () => {
    mockGetTabContent.mockReturnValue(<div>About me description</div>);
    mockFindTabIndex.mockReturnValue(0);
    mockFindNextTabId.mockReturnValue('tab2');
    mockIsEndOfTabs.mockReturnValue(false);

    render(
      <TabContent
        tabs={mockTabs}
        activeTabId="tab1"
        onEnableNext={mockOnEnableNext}
      />,
    );

    expect(screen.getByText('About me description')).toBeInTheDocument();
  });

  it('should render no component if active tab content is not found', () => {
    mockGetTabContent.mockReturnValue(null);

    const { container } = render(
      <TabContent
        tabs={mockTabs}
        activeTabId="invalid"
        onEnableNext={mockOnEnableNext}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render the last tab content correctly', () => {
    mockGetTabContent.mockReturnValue(<div>Retirement income</div>);
    mockFindTabIndex.mockReturnValue(2);
    mockFindNextTabId.mockReturnValue('');
    mockIsEndOfTabs.mockReturnValue(true);

    render(
      <TabContent
        tabs={mockTabs}
        activeTabId="tab3"
        onEnableNext={mockOnEnableNext}
      />,
    );

    expect(screen.getByText('Retirement income')).toBeInTheDocument();
  });
});
