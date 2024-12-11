import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import {
  BenefitIllustrationComponent,
  PensionArrangement,
} from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { PensionDetailIntro } from './PensionDetailIntro';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('../../lib/utils');

const mockUseTranslation = useTranslation as jest.Mock;
const mockFormatDate = formatDate as jest.Mock;

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('PensionDetailIntro', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (
        key: string,
        params?: {
          name?: string;
          date?: string;
          age?: number;
          monthly?: string;
          yearly?: string;
        },
      ) => {
        switch (key) {
          case 'pages.pension-details.description':
            return `Description with name: ${params?.name}, date: ${params?.date}, age: ${params?.age}, monthly: ${params?.monthly}, yearly: ${params?.yearly}`;
          case 'common.date-unavailable':
            return 'Date unavailable';
          case 'common.amount-unavailable':
            return 'Amount unavailable';
          default:
            return key;
        }
      },
    });
    mockFormatDate.mockImplementation((date: string) => `Formatted ${date}`);
  });

  it('renders correctly', () => {
    const { container } = render(<PensionDetailIntro data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it.each([
    [
      'renders correctly with data and benefitIllustration',
      mockData,
      mockPensionsData.pensionPolicies[0].pensionArrangements[0]
        .benefitIllustrations[0]
        .illustrationComponents[0] as BenefitIllustrationComponent,
    ],
    [
      'renders correctly with data and without benefitIllustration',
      mockData,
      undefined,
    ],
  ])('%s', (_, data, benefitIllustration) => {
    const { getByText } = render(
      <PensionDetailIntro
        data={data}
        benefitIllustration={benefitIllustration}
      />,
    );

    expect(
      getByText(
        /Description with name: Master Trust Workplace 0887, date: Date unavailable, age: undefined, monthly: Amount unavailable, yearly: Amount unavailable/,
      ),
    ).toBeInTheDocument();
  });

  it('renders null when no data is provided', () => {
    const { container } = render(
      <PensionDetailIntro
        data={
          mockPensionsData.pensionPolicies[0]
            .pensionArrangements[0] as PensionArrangement
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
