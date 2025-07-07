import { render, screen } from '@testing-library/react';

import {
  PensionArrangement,
  PhoneNumber,
  PostalAddress,
} from '../../lib/types';
import { PensionArrangementCallout } from './PensionArrangementCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
  }),
}));

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

describe('PensionArrangementCallout', () => {
  it('renders correctly', () => {
    const { container } = render(<PensionArrangementCallout {...mockdata} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the component with scheme name', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(screen.getByText('State Pension')).toBeInTheDocument();
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
    expect(
      screen.queryByTestId('pension-contact-reference'),
    ).not.toBeInTheDocument();
  });

  it('renders the pension administrator name in the description', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(
      screen.getByText('pages.pensions-that-need-action.card.description'),
    ).toBeInTheDocument();
  });

  it('renders the preferred contact method', () => {
    render(<PensionArrangementCallout {...mockdata} />);
    expect(screen.getByText('common.contact.preferred')).toBeInTheDocument();
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
    expect(
      screen.getByText('Main telephone: +123 2222222222'),
    ).toBeInTheDocument();
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
    expect(screen.getByText('Contact DWP online')).toBeInTheDocument();
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
