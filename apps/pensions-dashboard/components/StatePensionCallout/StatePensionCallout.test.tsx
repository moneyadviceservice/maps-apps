import { render } from '@testing-library/react';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import { StatePensionCallout } from './StatePensionCallout';

import '@testing-library/jest-dom/extend-expect';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useTranslation');

describe('StatePensionCallout', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'pages.pension-details.state-pension-callout.heading.keep-contributing':
            'Keep contributing',
          'pages.pension-details.state-pension-callout.heading.already-qualify':
            'Already qualify',
          'pages.pension-details.state-pension-callout.text.partial-accrued':
            'Partially accrued',
          'pages.pension-details.state-pension-callout.text.full-forecast':
            'Full forecast',
          'pages.pension-details.state-pension-callout.text.no-accrued':
            'No accrued',
        };
        return translations[key] || key;
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each`
    accruedAmount | forecastAmount | expectedHeading        | expectedText
    ${300}        | ${954}         | ${'Keep contributing'} | ${'Partially accrued'}
    ${954}        | ${954}         | ${'Already qualify'}   | ${'Full forecast'}
    ${0}          | ${954}         | ${'Keep contributing'} | ${'No accrued'}
  `(
    'renders expected text if accruedAmount is $accruedAmount and forecastAmount is $forecastAmount',
    ({ accruedAmount, forecastAmount, expectedHeading, expectedText }) => {
      const { getByTestId } = render(
        <StatePensionCallout
          accruedAmount={accruedAmount}
          forecastAmount={forecastAmount}
        />,
      );
      expect(getByTestId('state-pension-callout-heading')).toHaveTextContent(
        expectedHeading,
      );
      expect(getByTestId('state-pension-callout-text')).toHaveTextContent(
        expectedText,
      );
    },
  );

  it('does not render anything if accruedAmount is 0 and forecastAmount is 0', () => {
    const { queryByTestId } = render(
      <StatePensionCallout accruedAmount={0} forecastAmount={0} />,
    );
    expect(
      queryByTestId('state-pension-callout-heading'),
    ).not.toBeInTheDocument();
    expect(queryByTestId('state-pension-callout-text')).not.toBeInTheDocument();
  });
});
