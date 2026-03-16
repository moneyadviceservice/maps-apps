import { render, screen } from '@testing-library/react';

import { UsageType } from '../../lib/constants';
import { PhoneNumber } from '../../lib/types';
import { TelephoneNumber } from './TelephoneNumber';

import '@testing-library/jest-dom';

describe('PhoneNumber', () => {
  const mockPhoneNumber: PhoneNumber = {
    number: '01234567890',
    usage: [UsageType.M],
  };

  it('renders the phone number with usage label', () => {
    render(<TelephoneNumber tel={mockPhoneNumber} />);

    expect(screen.getByText('Main telephone:')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
  });

  it('renders as a clickable tel link', () => {
    render(<TelephoneNumber tel={mockPhoneNumber} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'tel:01234567890');
  });

  it.each`
    usageType      | expectedLabel
    ${UsageType.M} | ${'Main telephone:'}
    ${UsageType.S} | ${'Textphone:'}
    ${UsageType.W} | ${'Welsh language:'}
    ${UsageType.N} | ${'Outside UK:'}
    ${UsageType.A} | ${'WhatsApp:'}
  `(
    'displays $expectedLabel for usage type $usageType',
    ({ usageType, expectedLabel }) => {
      const phoneNumber: PhoneNumber = {
        number: '01234567890',
        usage: [usageType],
      };

      render(<TelephoneNumber tel={phoneNumber} />);

      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    },
  );
});
