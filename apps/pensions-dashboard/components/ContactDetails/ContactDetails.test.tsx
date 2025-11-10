import { render } from '@testing-library/react';

import { ContactMethod, PensionAdministrator } from '../../lib/types';
import { ContactDetails } from './ContactDetails';

import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.contact.preferred': 'preferred',
        'common.contact.email-address': 'Email address',
        'common.contact.telephone': 'Telephone',
        'common.contact.address': 'Address',
      };
      return translations[key] || key;
    },
  }),
}));

const mockPensionAdministrator: PensionAdministrator = {
  name: 'Test Administrator',
  contactMethods: [],
};

describe('ContactDetails', () => {
  it('returns empty array when no contact methods exist', () => {
    const result = ContactDetails(mockPensionAdministrator);
    expect(result).toEqual([]);
  });

  it('returns empty array when contactMethods is undefined', () => {
    const data = { name: 'Test' } as PensionAdministrator;
    const result = ContactDetails(data);
    expect(result).toEqual([]);
  });

  it('renders website contact methods with preferred sorting', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: false,
          contactMethodDetails: { url: 'https://example2.com' },
        },
        {
          preferred: true,
          contactMethodDetails: { url: 'https://example1.com' },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Website');
    expect(result[0].testId).toBe('contact-website');

    const { container } = render(<div>{result[0].value}</div>);
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('https://example1.com');
    expect(links[1]).toHaveTextContent('https://example2.com');
  });

  it('renders email contact methods with preferred sorting', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: false,
          contactMethodDetails: { email: 'test2@example.com' },
        },
        {
          preferred: true,
          contactMethodDetails: { email: 'test1@example.com' },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Email address');
    expect(result[0].testId).toBe('contact-email');

    const { container } = render(<div>{result[0].value}</div>);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs[0]).toHaveTextContent('(preferred) test1@example.com');
    expect(paragraphs[1]).toHaveTextContent('test2@example.com');
  });

  it('renders phone contact methods with preferred sorting and limits to 10', () => {
    const phoneNumbers = Array.from({ length: 15 }, (_, i) => ({
      preferred: i === 5,
      contactMethodDetails: { number: `123456789${i}`, usage: ['M'] },
    }));

    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: phoneNumbers as ContactMethod[],
    };

    const result = ContactDetails(data);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Telephone');
    expect(result[0].testId).toBe('contact-telephone');

    const { container } = render(<div>{result[0].value}</div>);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(10);
    expect(paragraphs[0]).toHaveTextContent(
      '(preferred) Main telephone: 1234567895',
    );
  });

  it('renders postal address contact methods with preferred styling', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: false,
          contactMethodDetails: {
            postalName: 'Address 2',
            line1: 'Line 1',
            postcode: 'PC1 1PC',
            countryCode: 'GB',
          },
        },
        {
          preferred: true,
          contactMethodDetails: {
            postalName: 'Address 1',
            line1: 'Line 1',
            postcode: 'PC1 1PC',
            countryCode: 'GB',
          },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Address');
    expect(result[0].testId).toBe('contact-postal');

    const { container } = render(<div>{result[0].value}</div>);
    const addresses = container.querySelectorAll(
      '[data-testid="address-component"]',
    );
    expect(addresses).toHaveLength(2);
    expect(addresses[0]).toHaveTextContent('(preferred) Address 1');
    expect(addresses[1]).toHaveTextContent('Address 2');
  });

  it('renders multiple contact method types in correct order', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: { postalName: 'Test Address' },
        },
        {
          preferred: false,
          contactMethodDetails: { email: 'test@example.com' },
        },
        {
          preferred: true,
          contactMethodDetails: { url: 'https://example.com' },
        },
        {
          preferred: false,
          contactMethodDetails: { number: '1234567890', usage: ['M'] },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    expect(result).toHaveLength(4);
    expect(result[0].title).toBe('Website');
    expect(result[1].title).toBe('Email address');
    expect(result[2].title).toBe('Telephone');
    expect(result[3].title).toBe('Address');
  });

  it('handles mixed preferred and non-preferred contacts correctly', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: false,
          contactMethodDetails: { email: 'secondary@example.com' },
        },
        {
          preferred: true,
          contactMethodDetails: { email: 'primary@example.com' },
        },
        {
          preferred: false,
          contactMethodDetails: { email: 'tertiary@example.com' },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    const { container } = render(<div>{result[0].value}</div>);
    const paragraphs = container.querySelectorAll('p');

    expect(paragraphs[0]).toHaveTextContent('(preferred) primary@example.com');
    expect(paragraphs[0]).toHaveClass('font-bold');
    expect(paragraphs[1]).toHaveTextContent('secondary@example.com');
    expect(paragraphs[1]).not.toHaveClass('font-bold');
    expect(paragraphs[2]).toHaveTextContent('tertiary@example.com');
    expect(paragraphs[2]).not.toHaveClass('font-bold');
  });

  it('handles contact methods with no preferred items', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: false,
          contactMethodDetails: { email: 'test1@example.com' },
        },
        {
          preferred: false,
          contactMethodDetails: { email: 'test2@example.com' },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    const { container } = render(<div>{result[0].value}</div>);
    const paragraphs = container.querySelectorAll('p');

    for (const paragraph of Array.from(paragraphs)) {
      expect(paragraph).not.toHaveClass('font-bold');
      expect(paragraph).not.toHaveTextContent('(preferred)');
    }
  });

  it('renders website links with correct attributes', () => {
    const data: PensionAdministrator = {
      ...mockPensionAdministrator,
      contactMethods: [
        {
          preferred: true,
          contactMethodDetails: { url: 'https://example.com' },
        },
      ] as ContactMethod[],
    };

    const result = ContactDetails(data);
    const { container } = render(<div>{result[0].value}</div>);
    const link = container.querySelector('a');

    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('break-words');
  });
});
