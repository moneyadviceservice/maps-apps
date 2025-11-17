import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailMoreInfo } from './';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPension = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;
const mockData = {
  ...mockPension,
  additionalDataSources: [
    {
      informationType: 'ANR',
      url: 'https://example.com/annual-report',
    },
    {
      informationType: 'C_AND_C',
      url: 'https://example.com/costs-and-charges',
    },
    {
      informationType: 'SIP',
      url: 'https://example.com/investment-principles',
    },
    {
      informationType: 'IMP',
      url: 'https://example.com/implementation-statement',
    },
  ],
} as PensionArrangement;

describe('PensionDetailAbout', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders definition list with correct title and subtext', () => {
    render(<PensionDetailMoreInfo data={mockData} />);
    expect(screen.getByTestId('definition-list')).toBeInTheDocument();
    expect(screen.getByTestId('definition-list-title')).toHaveTextContent(
      'pages.pension-details.headings.more-information',
    );
    expect(screen.getByTestId('definition-list-sub-text')).toHaveTextContent(
      'pages.pension-details.headings.more-information-sub',
    );
  });

  it.each`
    description                            | code         | url
    ${'displays costs and charges'}        | ${'C_AND_C'} | ${'https://example.com/costs-and-charges'}
    ${'displays implementation statement'} | ${'IMP'}     | ${'https://example.com/implementation-statement'}
    ${'displays annual report'}            | ${'ANR'}     | ${'https://example.com/annual-report'}
    ${'displays investment principles'}    | ${'SIP'}     | ${'https://example.com/investment-principles'}
  `('$description', ({ code, url }) => {
    render(<PensionDetailMoreInfo data={mockData} />);
    expect(screen.getByTestId('dd-more-info-' + code)).toHaveTextContent(url);
  });

  it('sorts the data sources by information type', () => {
    render(<PensionDetailMoreInfo data={mockData} />);
    const items = screen.getAllByTestId(/^dd-more-info-/);
    expect(items[0]).toHaveTextContent('https://example.com/costs-and-charges');
    expect(items[1]).toHaveTextContent(
      'https://example.com/investment-principles',
    );
    expect(items[2]).toHaveTextContent(
      'https://example.com/implementation-statement',
    );
    expect(items[3]).toHaveTextContent('https://example.com/annual-report');
  });

  it('handles missing data gracefully', () => {
    const minimalData = {} as PensionArrangement;
    render(<PensionDetailMoreInfo data={minimalData} />);
    expect(screen.queryByTestId('definition-list')).not.toBeInTheDocument();
  });
});
