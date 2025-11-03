import React from 'react';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { UsageType } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { ContactMethod, PensionArrangement } from '../../lib/types';
import { PensionDetailContact } from './PensionDetailContact';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

const createData = (contactMethods: ContactMethod[]): PensionArrangement => ({
  ...mockData,
  pensionAdministrator: {
    ...mockData.pensionAdministrator,
    contactMethods,
  },
});

describe('PensionDetailContact', () => {
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
    render(<PensionDetailContact data={mockData} />);
    expect(screen.getByTestId('definition-list')).toBeInTheDocument();
    expect(screen.getByTestId('definition-list-title')).toHaveTextContent(
      'pages.pension-details.header.contact-provider',
    );
    expect(screen.getByTestId('definition-list-sub-text')).toHaveTextContent(
      'pages.pension-details.headings.contact-sub',
    );
  });

  it('renders email contacts when available', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: { email: 'test@example.com' },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    expect(screen.getByTestId('dd-contact-email')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders telephone contacts when available', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: {
          number: '01234567890',
          usage: [UsageType.W],
        },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    expect(screen.getByTestId('dd-contact-telephone')).toBeInTheDocument();
  });

  it('renders a maximum of 10 telephone contacts', () => {
    const data = createData(
      Array.from({ length: 15 }, (_, i) => ({
        preferred: false,
        contactMethodDetails: {
          number: `0123456789${i}`,
          usage: [UsageType.W],
        },
      })),
    );
    render(<PensionDetailContact data={data} />);
    const telephoneDefinition = screen.getAllByTestId('dd-contact-telephone');
    const telephoneContacts = telephoneDefinition.flatMap((contact) =>
      Array.from(contact.querySelectorAll('p')),
    );
    expect(telephoneContacts).toHaveLength(10);
  });

  it('renders website contacts when available', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: { url: 'https://example.com' },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    expect(screen.getByTestId('dd-contact-website')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('renders postal addresses when available', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: {
          postalName: 'Test Address',
          line1: '123 Test Street',
          postcode: 'TE5T 1NG',
          countryCode: 'GB',
        },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    expect(screen.getByTestId('dd-contact-postal')).toBeInTheDocument();
  });

  it('marks preferred contacts', () => {
    const data = createData([
      {
        preferred: true,
        contactMethodDetails: { email: 'preferred@example.com' },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    expect(screen.getByTestId('dd-contact-email')).toBeInTheDocument();
    expect(
      screen.getByText('(common.contact.preferred) preferred@example.com'),
    ).toBeInTheDocument();
  });

  it('sorts email contacts by preference', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: { email: 'secondary@example.com' },
      },
      {
        preferred: true,
        contactMethodDetails: { email: 'preferred@example.com' },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    const emails = screen.getAllByText(/example\.com/);
    expect(emails[0]).toHaveTextContent('preferred@example.com');
    expect(emails[1]).toHaveTextContent('secondary@example.com');
  });

  it('sorts telephone contacts', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: {
          number: '+44 01234567890',
          usage: [UsageType.W],
        },
      },
      {
        preferred: true,
        contactMethodDetails: {
          number: '+44 09876543210',
          usage: [UsageType.N],
        },
      },
      {
        preferred: false,
        contactMethodDetails: {
          number: '+44 04567890123',
          usage: [UsageType.S],
        },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    const phones = screen.getAllByText(/\+44/);
    expect(phones[0]).toHaveTextContent('+44 09876543210');
    expect(phones[1]).toHaveTextContent('+44 01234567890');
    expect(phones[2]).toHaveTextContent('+44 04567890123');
  });

  it('sorts web contacts', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: {
          url: 'https://secondary.example.com',
        },
      },
      {
        preferred: true,
        contactMethodDetails: {
          url: 'https://preferred.example.com',
        },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    const urls = screen.getAllByText(/example\.com/);
    expect(urls[0]).toHaveTextContent('https://preferred.example.com');
    expect(urls[1]).toHaveTextContent('https://secondary.example.com');
  });

  it('sorts postal contacts', () => {
    const data = createData([
      {
        preferred: false,
        contactMethodDetails: {
          postalName: 'Secondary postalName',
          line1: '123 Secondary Street',
          postcode: 'POST 1AL',
          countryCode: 'GB',
        },
      },
      {
        preferred: true,
        contactMethodDetails: {
          postalName: 'Preferred postalName',
          line1: '123 Preferred Street',
          postcode: 'POST 1AL',
          countryCode: 'GB',
        },
      },
    ]);

    render(<PensionDetailContact data={data} />);

    const postalNames = screen.getAllByText(/postalName/);
    expect(postalNames[0]).toHaveTextContent('Preferred postalName');
    expect(postalNames[1]).toHaveTextContent('Secondary postalName');
  });

  it('renders no data message when no contact methods are available', () => {
    const data = createData([]);

    render(<PensionDetailContact data={data} />);

    expect(screen.queryByTestId('dd-contact-postal')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('dd-contact-telephone'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('dd-contact-email')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dd-contact-web')).not.toBeInTheDocument();
  });
});
