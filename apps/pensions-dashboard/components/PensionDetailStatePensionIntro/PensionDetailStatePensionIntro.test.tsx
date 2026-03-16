import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionDetailsSP } from '../../lib/mocks';
import { DetailData, PensionArrangement } from '../../lib/types';
import { PensionDetailStatePensionIntro } from './PensionDetailStatePensionIntro';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

const mockStatePensionData = mockPensionDetailsSP as PensionArrangement;

describe('PensionDetailStatePensionIntro', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (
        key: string,
        params?: {
          monthly?: string;
          date?: string;
        },
      ) => {
        if (key === 'pages.pension-details.toolIntro.estimate-SP') {
          return `You will reach State Pension age on ${params?.date}. Your forecast is ${params?.monthly} a month.`;
        } else return key;
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<PensionDetailStatePensionIntro data={mockStatePensionData} />);
    expect(
      screen.getByText(
        'You will reach State Pension age on 23 February 2042. Your forecast is £958.50 a month.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('tool-intro')).toBeInTheDocument();
  });

  it('does not render summary content if no ERI or retirement date', () => {
    render(
      <PensionDetailStatePensionIntro
        data={{
          ...mockStatePensionData,
          detailData: {
            retirementDate: undefined,
            monthlyAmount: undefined,
          } as DetailData,
        }}
      />,
    );
    expect(screen.queryByTestId('tool-intro')).not.toBeInTheDocument();
  });

  it('renders null when no data is provided', () => {
    render(<PensionDetailStatePensionIntro data={null} />);
    expect(screen.queryByTestId('tool-intro')).not.toBeInTheDocument();
  });
});
