import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Tabs } from './Tabs';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router');
jest.mock('@maps-react/hooks/useTranslation');

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    query: {},
    pathname: '/pension-detail',
  })),
}));

const mockPush = jest.fn();

describe('Tabs', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });

  it.each`
    description               | url                            | aria
    ${'displays summary tab'} | ${'your-pension-summary'}      | ${'true'}
    ${'displays about tab'}   | ${'pension-income-and-values'} | ${'false'}
    ${'displays income tab'}  | ${'about-this-pension'}        | ${'false'}
    ${'displays contact tab'} | ${'contact-pension-provider'}  | ${'false'}
  `('$description', ({ url, aria }) => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/en/pension-details/your-pension-summary',
      push: mockPush,
    });
    const { getByTestId } = render(<Tabs />);
    const tab = getByTestId(`tab-${url}`);
    expect(tab).toHaveAttribute('href', `/en/pension-details/${url}`);
    expect(tab).toHaveAttribute('aria-selected', aria);
  });

  it('applies custom className', () => {
    render(<Tabs className="custom-class" />);

    const tabs = screen.getByTestId('tabs');
    expect(tabs).toHaveClass('custom-class');
  });

  it('applies custom testId', () => {
    render(<Tabs testId="custom-tabs" />);

    expect(screen.getByTestId('custom-tabs')).toBeInTheDocument();
  });
});
