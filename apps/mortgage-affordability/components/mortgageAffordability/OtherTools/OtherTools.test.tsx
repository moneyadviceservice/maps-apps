import { render, screen } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { OtherTools } from './OtherTools';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock(
  'public/images/teaser-card-images/man-holding-mobile-laughing.jpg',
  () => ({
    src: '/images/teaser-card-images/man-holding-mobile-laughing.jpg',
    width: 100,
    height: 100,
  }),
);
jest.mock(
  'public/images/teaser-card-images/two-children-with-bubbles.jpg',
  () => ({
    src: '/images/teaser-card-images/two-children-with-bubbles.jpg',
    width: 100,
    height: 100,
  }),
);

describe('OtherTools', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      z: (value: { en: string; cy: string }) => value.en,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the heading', () => {
    render(<OtherTools />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Other tools to try' }),
    ).toBeInTheDocument();
  });

  it('renders the mortgage repayment calculator card', () => {
    render(<OtherTools />);
    expect(
      screen.getByRole('link', { name: /Mortgage repayment calculator/ }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
    );
    expect(
      screen.getByText(
        "This gives you a guide to how much you'd pay each month on a mortgage.",
      ),
    ).toBeInTheDocument();
  });

  it('renders the stamp duty calculator card', () => {
    render(<OtherTools />);
    expect(
      screen.getByRole('link', { name: /Stamp Duty Calculator/ }),
    ).toHaveAttribute(
      'href',
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
    );
    expect(
      screen.getByText('Calculate the Stamp Duty on your new property.'),
    ).toBeInTheDocument();
  });

  it('opens both tools in a new window', () => {
    render(<OtherTools />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('renders the card titles as h3 headings under the h2', () => {
    render(<OtherTools />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
});
