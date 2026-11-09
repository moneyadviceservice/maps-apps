import { render, screen } from '@testing-library/react';

import { ResultsHeading } from './ResultsHeading';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'results.description':
          'Based on your answers, here are some options that may be suitable for you.',
      };
      return translations[key] || key;
    },
  })),
}));

describe('ResultsHeading', () => {
  it('should render the component', () => {
    const { container } = render(<ResultsHeading />);
    expect(container).toMatchSnapshot();
  });

  it('should render the description paragraph', () => {
    render(<ResultsHeading />);

    expect(
      screen.getByText(
        'Based on your answers, here are some options that may be suitable for you.',
      ),
    ).toBeInTheDocument();
  });
});
