import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import {
  mockPensionDetailsDBRecurring,
  mockPensionsData,
} from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionDetailIncomeValues } from './PensionDetailIncomeValues';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockPensionData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

const mockDBData = mockPensionDetailsDBRecurring as PensionArrangement;

describe('PensionDetailIncomeValues', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component for DC pension type', () => {
    render(<PensionDetailIncomeValues data={mockPensionData} />);

    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('sub-heading')).toBeInTheDocument();
    expect(screen.getByTestId('bar-charts')).toBeInTheDocument();
    expect(screen.getByTestId('donut-charts')).toBeInTheDocument();
  });

  it('renders component for DB pension type', () => {
    render(<PensionDetailIncomeValues data={mockDBData} />);
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByTestId('sub-heading')).toBeInTheDocument();
    expect(screen.getByTestId('bar-charts')).toBeInTheDocument();
    expect(screen.getByTestId('donut-charts')).toBeInTheDocument();
  });

  it('renders accordions for DC pension type', () => {
    render(<PensionDetailIncomeValues data={mockPensionData} />);
    expect(screen.getByTestId('dc-calculation-accordion')).toBeInTheDocument();
    expect(
      screen.queryByTestId('db-calculation-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it('renders accordions for DB pension type', () => {
    render(
      <PensionDetailIncomeValues
        data={{ ...mockPensionData, pensionType: PensionType.DB }}
      />,
    );
    expect(screen.getByTestId('db-calculation-accordion')).toBeInTheDocument();
    expect(
      screen.queryByTestId('dc-calculation-accordion'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('more-details')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });
});
