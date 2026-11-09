import { render, screen } from '@testing-library/react';

import { LandingHeading } from './LandingHeading';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mockTranslationDataEn[key] ?? key,
      locale: 'en',
    }),
  };
});

describe('test LandingHeading component', () => {
  it('should render the component', () => {
    const { container } = render(
      <LandingHeading nextPageLink="/en/about-you" />,
    );
    expect(container).toMatchSnapshot();

    expect(
      screen.getByRole('heading', { name: 'Retirement budget planner' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Find out if your estimated retirement income will cover all your essential costs with our free online tool.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('5 minutes to complete')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Start my retirement budget' }),
    ).toBeInTheDocument();
  });
});
