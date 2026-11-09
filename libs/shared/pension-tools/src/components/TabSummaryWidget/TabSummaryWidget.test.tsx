import React from 'react';

import { render, screen } from '@testing-library/react';

import { SummaryItem, TabSummaryWidget } from './TabSummaryWidget';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => require('next-router-mock'));

describe('TabSummaryWidget', () => {
  const testTitle = 'Test Summary';
  const testItems: SummaryItem[] = [
    { label: 'Item 1', value: 10, unit: 'pounds', hasUserData: true },
    { label: 'Item 2', value: 2, unit: 'months', hasUserData: true },
    { label: 'Item 3', value: 1, unit: 'months', hasUserData: false },
  ];

  it('renders with title and items when displayDefaults is true', () => {
    render(
      <TabSummaryWidget
        title={testTitle}
        items={testItems}
        displayDefaults={true}
      />,
    );

    expect(screen.getByText(testTitle)).toBeInTheDocument();
    const expectedLabel = ['Item 1', 'Item 2', 'Item 3'];
    const expectedValueText = ['£10.00', '2 months', '1 month'];

    testItems.forEach((item, i) => {
      expect(screen.getByText(expectedLabel[i])).toBeInTheDocument();
      expect(screen.getByText(expectedValueText[i])).toBeInTheDocument();
    });
  });

  it('renders with title and items only where hasUserData when displayDefaults is false', () => {
    render(
      <TabSummaryWidget
        title={testTitle}
        items={testItems}
        displayDefaults={false}
      />,
    );

    expect(screen.getByText(testTitle)).toBeInTheDocument();
    const expectedLabel = ['Item 1', 'Item 2', 'Item 3'];
    const expectedValueText = ['£10.00', '2 months', '1 month'];

    testItems.forEach((item, i) => {
      if (item.hasUserData) {
        expect(screen.getByText(expectedLabel[i])).toBeInTheDocument();
        expect(screen.getByText(expectedValueText[i])).toBeInTheDocument();
      } else {
        expect(screen.queryByText(expectedLabel[i])).not.toBeInTheDocument();
        expect(
          screen.queryByText(expectedValueText[i]),
        ).not.toBeInTheDocument();
      }
    });
  });
});
