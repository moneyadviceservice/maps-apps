import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { DetailData, PensionArrangement } from '../../lib/types';
import { PensionDetailIllustrationDate } from './PensionDetailIllustrationDate';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = {
  ...mockPensionsData.pensionPolicies[0].pensionArrangements[0],
  detailData: { illustrationDate: '2024-01-01' },
} as PensionArrangement;

describe('PensionDetailIllustrationDate', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders content when illustration exists', () => {
    render(<PensionDetailIllustrationDate data={mockData} />);

    expect(
      screen.getByText('pages.pension-details.details.last-updated:'),
    ).toBeInTheDocument();
    expect(screen.getByText('1 January 2024')).toBeInTheDocument();
    expect(screen.getByText('tooltips.illustration-date')).toBeInTheDocument();
  });

  it('renders no data message when no illustration exists', () => {
    render(
      <PensionDetailIllustrationDate
        data={{
          ...mockData,
          detailData: { illustrationDate: undefined } as DetailData,
        }}
      />,
    );
    expect(screen.getByText('common.unavailable')).toBeInTheDocument();
  });

  it('renders no data message when illustration date is invalid', () => {
    render(
      <PensionDetailIllustrationDate
        data={{
          ...mockData,
          detailData: { illustrationDate: 's' } as DetailData,
        }}
      />,
    );
    expect(screen.getByText('common.unavailable')).toBeInTheDocument();
  });
});
