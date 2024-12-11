import { render } from '@testing-library/react';

import {
  EmployerStatus,
  MatchType,
  PensionType,
  UsageType,
} from '../../lib/constants';
import { ConfirmedPensionsCallout } from './ConfirmedPensionsCallout';

import '@testing-library/jest-dom/extend-expect';

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
  benefitIllustrations: [],
  retirementDate: '2025-01-01',
  dateOfBirth: '1965-01-01',
  externalPensionPolicyId: 'policy123',
  matchType: MatchType.DEFN,
  contactReference: 'contact123',
  contributionsFromMultipleEmployers: false,
};

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

describe('ConfirmedPensionsCallout', () => {
  it('renders correctly', () => {
    const { container } = render(<ConfirmedPensionsCallout data={mockData} />);

    expect(container).toMatchSnapshot();
  });

  it.each([
    ['state pension type', mockData],
    ['non-state pension type', { ...mockData, pensionType: PensionType.DC }],
  ])('renders correctly with %s', (_, data) => {
    const { getByText } = render(<ConfirmedPensionsCallout data={data} />);

    expect(getByText('Test Scheme')).toBeInTheDocument();
    expect(getByText('Admin Name')).toBeInTheDocument();
    expect(getByText('common.retirement-age')).toBeInTheDocument();
    expect(getByText('common.estimated-income')).toBeInTheDocument();
    expect(getByText('common.details-link')).toBeInTheDocument();
  });

  it('renders employment membership periods', () => {
    const { getByText } = render(<ConfirmedPensionsCallout data={mockData} />);

    expect(getByText('Employer 1')).toBeInTheDocument();
    expect(getByText('Employer 2')).toBeInTheDocument();
  });

  it.each([
    ['state pension', mockData, '67'],
    ['non-state pension', { ...mockData, pensionType: PensionType.DC }, '60'],
  ])('renders the correct retirement age for %s', (_, data, expectedAge) => {
    const { getByText } = render(<ConfirmedPensionsCallout data={data} />);

    expect(getByText('common.retirement-age')).toBeInTheDocument();
    expect(getByText(expectedAge)).toBeInTheDocument();
  });

  it.each([
    ['estimated income', 'common.estimated-income', 'common.a-month'],
    ['details link', 'common.details-link'],
    ['scheme name', 'Test Scheme'],
    ['pension type', 'Admin Name'],
    ['retirement date', 'common.retirement-age', '67'],
    ['employer name', 'Employer 1', 'Employer 2'],
  ])('renders the correct %s', (_, ...expectedTexts) => {
    const { getByText } = render(<ConfirmedPensionsCallout data={mockData} />);

    expectedTexts.forEach((text) => {
      expect(getByText(text)).toBeInTheDocument();
    });
  });
});
