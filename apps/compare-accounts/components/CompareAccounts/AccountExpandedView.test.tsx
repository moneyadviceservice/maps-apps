import { render, screen } from '@testing-library/react';

import AccountExpandedView from './AccountExpandedView';
import { mockAccount } from './mocks';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key.en),
  })),
}));

const checkTextExists = (texts: string[]) => {
  texts.forEach((text: string) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
};

describe('AccountExpandedView', () => {
  beforeEach(() => {
    render(<AccountExpandedView account={mockAccount} />);
  });

  it('renders all section titles', () => {
    checkTextExists([
      'Account access options',
      'Account features',
      'Account fees and costs',
    ]);
  });

  it('renders Account access options and its items', () => {
    checkTextExists([
      'Branch banking',
      'Internet banking',
      'Mobile app banking',
      'Post Office banking',
    ]);
  });

  it('renders Account features and its items', () => {
    checkTextExists([
      'Cheque book available',
      'No monthly fee',
      'Open to new customers',
      'Overdraft facilities',
      '7-day switching',
    ]);
  });

  it('renders Account fees and costs with correct fee items', () => {
    checkTextExists([
      'General account fees',
      'Overdraft fees',
      'Debit card fees',
      'Cash withdrawal fees',
      'Payment fees',
      'Other fees',
    ]);
  });
});
