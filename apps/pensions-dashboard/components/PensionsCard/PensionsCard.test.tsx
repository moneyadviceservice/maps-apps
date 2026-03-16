import { render, screen } from '@testing-library/react';

import {
  BenefitType,
  CalculationMethod,
  EmployerStatus,
  IllustrationType,
  MatchType,
  PensionsCardType,
  PensionType,
  RecurringAmountType,
  UnavailableReason,
  UsageType,
} from '../../lib/constants';
import { CardData, LinkedPension } from '../../lib/types';
import { PensionsCard } from './PensionsCard';

import '@testing-library/jest-dom/extend-expect';

const cardData = {
  monthlyAmount: 412,
  retirementDate: '2025-01-01',
  unavailableReason: undefined,
} as CardData;

const mockData = {
  schemeName: 'Test Scheme',
  employmentMembershipPeriods: [
    {
      employerName: 'Employer 1',
      employerStatus: EmployerStatus.C,
      membershipStartDate: '2010-01-01',
      membershipEndDate: '2020-01-01',
    },
    {
      employerName: 'Employer 2',
      employerStatus: EmployerStatus.H,
      membershipStartDate: '2000-01-01',
      membershipEndDate: '2010-01-01',
    },
  ],
  pensionAdministrator: {
    name: 'Admin Name',
    preferred: false,
    contactMethods: [
      {
        preferred: true,
        contactMethodDetails: {
          number: '+123 1111111111',
          usage: ['M' as UsageType],
        },
      },
    ],
  },
  externalAssetId: '12345',
  pensionType: PensionType.SP,
  benefitIllustrations: [
    {
      illustrationComponents: [
        {
          illustrationType: IllustrationType.ERI,
          benefitType: BenefitType.SP,
          calculationMethod: CalculationMethod.SMPI,
          payableDetails: {
            amountType: RecurringAmountType.INC,
            annualAmount: 4940,
            monthlyAmount: 412,
            payableDate: '2025-01-01',
            increasing: false,
          },
        },
      ],
      illustrationDate: '2024-07-25',
    },
  ],
  retirementDate: '2025-01-01',
  dateOfBirth: '1965-01-01',
  externalPensionPolicyId: 'policy123',
  matchType: MatchType.DEFN,
  contactReference: 'contact123',
  contributionsFromMultipleEmployers: false,
  cardData: { ...cardData },
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

jest.mock('../../public/images/hm-gov-logo.png', () => ({
  src: '/images/hm-gov-logo.png',
  width: 188,
  height: 28,
}));

describe('PensionsCard', () => {
  it('renders confirmed card correctly', () => {
    const { container } = render(<PensionsCard data={mockData} />);

    expect(container).toMatchSnapshot();
  });

  it('renders confirmed no income card correctly', () => {
    const { container } = render(
      <PensionsCard
        data={{
          ...mockData,
          pensionType: PensionType.DC,
          benefitIllustrations: [
            {
              illustrationComponents: [
                {
                  illustrationType: IllustrationType.ERI,
                  unavailableReason: UnavailableReason.DCHA,
                  benefitType: BenefitType.DB,
                  calculationMethod: CalculationMethod.SMPI,
                  payableDetails: {
                    amountType: RecurringAmountType.INC,
                    annualAmount: 4940,
                    monthlyAmount: 412,
                    payableDate: '2051-03-27',
                    increasing: false,
                  },
                },
              ],
              illustrationDate: '2024-07-25',
            },
          ],
          cardData: {
            retirementDate: '2051-03-27',
            unavailableReason: 'DCHA',
          },
        }}
        type={PensionsCardType.CONFIRMED_NO_INCOME}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders pending card for SYS correctly', () => {
    const { container } = render(
      <PensionsCard
        data={{
          ...mockData,
          matchType: MatchType.SYS,
          pensionType: PensionType.DC,
          cardData: { ...cardData },
        }}
        type={PensionsCardType.PENDING}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders pending card for NEW correctly', () => {
    const { container } = render(
      <PensionsCard
        data={{
          ...mockData,
          matchType: MatchType.NEW,
          pensionType: PensionType.DC,
        }}
        type={PensionsCardType.PENDING}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it.each([
    ['state pension type', mockData, 'state-pension-date'],
    [
      'non-state pension type',
      { ...mockData, pensionType: PensionType.DC },
      'retirement-date',
    ],
  ])('renders correctly with %s', (_, data, date_text) => {
    const { getByText } = render(<PensionsCard data={data} />);

    expect(getByText('Test Scheme')).toBeInTheDocument();
    expect(getByText(`common.${date_text}:`)).toBeInTheDocument();
    expect(getByText('common.estimated-income:')).toBeInTheDocument();
    expect(getByText('common.details-link')).toBeInTheDocument();
  });

  it('renders employment membership periods', () => {
    const { getByText } = render(<PensionsCard data={mockData} />);

    expect(getByText('Employer 1')).toBeInTheDocument();
  });

  it('renders the retirement date correctly', () => {
    const { getByText } = render(<PensionsCard data={mockData} />);
    expect(getByText('common.state-pension-date:')).toBeInTheDocument();
    expect(
      screen.getByTestId('pension-card-retirement-date').textContent,
    ).toContain('1 January 2025');
  });

  it('does not render the retirement date if it is not available', () => {
    const { queryByText } = render(
      <PensionsCard data={{ ...mockData, retirementDate: '' }} />,
    );
    expect(queryByText('common.retirement-date:')).not.toBeInTheDocument();
  });

  it.each([
    ['estimated income', 'common.estimated-income:', 'common.a-month'],
    ['details link', 'common.details-link'],
    ['scheme name', 'Test Scheme'],
    ['retirement date', 'common.state-pension-date:', '1 January 2025'],
    ['employer name', 'Employer 1'],
  ])('renders the correct %s', (_, ...expectedTexts) => {
    const { getByText } = render(<PensionsCard data={mockData} />);

    expectedTexts.forEach((text) => {
      expect(getByText(text)).toBeInTheDocument();
    });
  });

  it.each([
    ['single linked pension', 1, 'common.linked-pension'],
    ['multiple linked pensions', 2, 'common.linked-pensions'],
  ])('renders %s correctly', (_, count, expectedLabel) => {
    const linkedPensions = Array.from({ length: count }, (_, i) => ({
      schemeName: `Example Linked Pension ${i + 1}`,
      externalAssetId: `LP${i + 1}`,
    })) as LinkedPension[];

    const { getByTestId, queryAllByTestId } = render(
      <PensionsCard data={{ ...mockData, linkedPensions }} />,
    );

    expect(getByTestId('pension-card-linked-pensions')).toBeInTheDocument();
    expect(
      getByTestId('pension-card-linked-pensions-label').textContent,
    ).toContain(expectedLabel);
    expect(queryAllByTestId('pension-card-linked-pension')).toHaveLength(count);
  });

  it('does not render linked pensions when there are none', () => {
    const { queryByTestId } = render(<PensionsCard data={{ ...mockData }} />);

    expect(
      queryByTestId('pension-card-linked-pensions'),
    ).not.toBeInTheDocument();
  });

  it('does not display employer when employmentMembershipPeriods contains only empty objects', () => {
    const mockDataWithEmptyPeriods = {
      ...mockData,
      employmentMembershipPeriods: [{}],
    } as typeof mockData;

    render(<PensionsCard data={mockDataWithEmptyPeriods} />);
    expect(screen.queryByText('common.employer:')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('pension-card-employer-name'),
    ).not.toBeInTheDocument();
  });

  it('does not display employer when employmentMembershipPeriods contains multiple empty objects', () => {
    const mockDataWithMultipleEmptyPeriods = {
      ...mockData,
      employmentMembershipPeriods: [{}, {}, {}],
    } as typeof mockData;

    render(<PensionsCard data={mockDataWithMultipleEmptyPeriods} />);
    expect(screen.queryByText('common.employer:')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('pension-card-employer-name'),
    ).not.toBeInTheDocument();
  });

  it('displays employer when employmentMembershipPeriods has mix of empty and valid objects', () => {
    const mockDataWithMixedPeriods = {
      ...mockData,
      employmentMembershipPeriods: [
        {},
        {
          employerName: 'Valid Employer',
          employerStatus: EmployerStatus.C,
          membershipStartDate: '2020-01-01',
          membershipEndDate: '2025-01-01',
        },
        {},
      ],
    } as typeof mockData;

    render(<PensionsCard data={mockDataWithMixedPeriods} />);
    expect(screen.getByText('common.employer:')).toBeInTheDocument();
    expect(screen.getByTestId('pension-card-employer-name')).toHaveTextContent(
      'Valid Employer',
    );
  });

  it('does not display employer when employmentMembershipPeriods is an empty array', () => {
    const mockDataWithEmptyArray = {
      ...mockData,
      employmentMembershipPeriods: [],
    };

    render(<PensionsCard data={mockDataWithEmptyArray} />);
    expect(screen.queryByText('common.employer:')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('pension-card-employer-name'),
    ).not.toBeInTheDocument();
  });
});
