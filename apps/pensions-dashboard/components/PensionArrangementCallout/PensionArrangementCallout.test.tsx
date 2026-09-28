import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import {
  PensionArrangement,
  PhoneNumber,
  PostalAddress,
} from '../../lib/types';
import { PensionArrangementCallout } from './PensionArrangementCallout';

import '@testing-library/jest-dom/extend-expect';

const mockdata = {
  externalAssetId: '1',
  matchType: 'DEFN',
  schemeName: 'State Pension',
  pensionType: 'SP',
  contributionsFromMultipleEmployers: false,
  pensionAdministrator: {
    name: 'DWP',
    contactMethods: [
      {
        preferred: true,
        contactMethodDetails: {
          number: '+123 1111111111',
          usage: ['A', 'M'],
        },
      },
    ],
  },
  externalPensionPolicyId: 'policy123',
  contactReference: 'REF123',
} as PensionArrangement;

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));
const mockUseTranslation = useTranslation as jest.Mock;

describe('PensionArrangementCallout', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    const { container } = render(<PensionArrangementCallout {...mockdata} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the component with scheme name', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === 'State Pension';
      }),
    ).toBeInTheDocument();
  });

  it('renders the pension scheme name as a h4 heading', () => {
    render(<PensionArrangementCallout {...mockdata} />);

    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'State Pension',
      }),
    ).toBeInTheDocument();
  });

  it('renders the contact reference', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(screen.getByText('REF123')).toBeInTheDocument();
  });

  it('does not render the contact reference if undefined', () => {
    render(
      <PensionArrangementCallout
        {...{ ...mockdata, contactReference: undefined }}
      />,
    );
    expect(screen.getByTestId('pension-contact-reference')).toHaveTextContent(
      'common.unavailable',
    );
  });

  it('renders the pension administrator name in the description', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(
      screen.getByText('pages.pensions-that-need-action.card.description'),
    ).toBeInTheDocument();
  });

  it.each([
    PensionType.AVC,
    PensionType.DC,
    PensionType.DB,
    PensionType.HYB,
    PensionType.CDC,
    PensionType.CB,
    PensionType.VAR,
  ])(
    'renders the pension details link form for %s pension type',
    (pensionType) => {
      render(<PensionArrangementCallout {...{ ...mockdata, pensionType }} />);
      expect(screen.getByTestId('details-link')).toBeInTheDocument();
    },
  );

  it('renders sr-only scheme name on the details link for screen readers', () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, vars?: { schemeName?: string }) => {
        if (key === 'common.details-link-sr-only' && vars?.schemeName) {
          return ` for ${vars.schemeName}`;
        }

        return key;
      },
      locale: 'en',
    });

    render(
      <PensionArrangementCallout
        {...{ ...mockdata, pensionType: PensionType.DC }}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: 'pages.pensions-that-need-action.card.details-link for State Pension',
      }),
    ).toBeInTheDocument();
  });

  it('renders sr-only scheme name on the contact information disclosure for screen readers', () => {
    mockUseTranslation.mockReturnValue({
      t: (key: string, vars?: { schemeName?: string }) => {
        if (
          key ===
            'pages.pensions-that-need-action.card.contact-heading-sr-only' &&
          vars?.schemeName
        ) {
          return ` for ${vars.schemeName}`;
        }

        return key;
      },
      locale: 'en',
    });

    render(<PensionArrangementCallout {...mockdata} />);

    expect(screen.getByText('for State Pension')).toHaveClass('sr-only');
  });

  it('renders the preferred contact method', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    // Check that the phone link exists and is clickable
    expect(
      screen.getByRole('link', { name: '+123 1111111111' }),
    ).toHaveAttribute('href', 'tel:+123 1111111111');
  });

  it('renders the telephone contact method', () => {
    const mockdataWithPhone = {
      ...mockdata,
      pensionAdministrator: {
        ...mockdata.pensionAdministrator,
        contactMethods: [
          ...mockdata.pensionAdministrator.contactMethods,
          {
            preferred: false,
            contactMethodDetails: {
              number: '+123 2222222222',
              usage: ['M'],
            } as PhoneNumber,
          },
        ],
      },
    };
    render(<PensionArrangementCallout {...mockdataWithPhone} />);
    // Check that the phone link exists and is clickable
    expect(
      screen.getByRole('link', { name: '+123 2222222222' }),
    ).toHaveAttribute('href', 'tel:+123 2222222222');
  });

  it('renders the email contact method', () => {
    const mockdataWithEmail = {
      ...mockdata,
      pensionAdministrator: {
        ...mockdata.pensionAdministrator,
        contactMethods: [
          ...mockdata.pensionAdministrator.contactMethods,
          {
            preferred: false,
            contactMethodDetails: {
              email: 'admin@example.com',
            },
          },
        ],
      },
    };
    render(<PensionArrangementCallout {...mockdataWithEmail} />);
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('renders the web contact method', () => {
    const mockdataWithWebContact = {
      ...mockdata,
      pensionAdministrator: {
        ...mockdata.pensionAdministrator,
        contactMethods: [
          ...mockdata.pensionAdministrator.contactMethods,
          {
            preferred: false,
            contactMethodDetails: {
              url: 'https://example.com/contact',
            },
          },
        ],
      },
    };
    render(<PensionArrangementCallout {...mockdataWithWebContact} />);
    expect(screen.getByText('https://example.com/contact')).toBeInTheDocument();
  });

  it('renders the postal address contact method', () => {
    const mockdataWithPostalAddress = {
      ...mockdata,
      pensionAdministrator: {
        ...mockdata.pensionAdministrator,
        contactMethods: [
          ...mockdata.pensionAdministrator.contactMethods,
          {
            preferred: false,
            contactMethodDetails: {
              postalName: 'DWP Office',
              line1: 'line1',
              line2: 'line2',
              line3: 'line3',
              line4: 'line4',
              line5: 'line5',
              postcode: '12345',
              countryCode: 'UK',
            } as PostalAddress,
          },
        ],
      },
    };
    render(<PensionArrangementCallout {...mockdataWithPostalAddress} />);
    expect(screen.getByText('DWP Office')).toBeInTheDocument();
    expect(screen.getByText('line1')).toBeInTheDocument();
    expect(screen.getByText('line2')).toBeInTheDocument();
    expect(screen.getByText('line3')).toBeInTheDocument();
    expect(screen.getByText('line4')).toBeInTheDocument();
    expect(screen.getByText('line5')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});
