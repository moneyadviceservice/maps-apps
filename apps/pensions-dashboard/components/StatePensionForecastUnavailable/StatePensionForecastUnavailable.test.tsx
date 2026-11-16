import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { StatePensionForecastUnavailable } from './StatePensionForecastUnavailable';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('StatePensionForecastUnavailable', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { container, getByText, getByTestId } = render(
      <StatePensionForecastUnavailable data={mockData} locale="en" />,
    );

    expect(container).toMatchSnapshot();

    [
      'pages.pension-details.no-forecast.subheading',
      'pages.pension-details.no-forecast.intro',
      'pages.pension-details.no-forecast.notification-title',
    ].forEach((text) => {
      expect(getByText(text)).toBeInTheDocument();
    });
    expect(
      getByTestId('notification-box-default-state-pension-no-forecast'),
    ).toBeInTheDocument();
    expect(getByTestId('state-pension-no-forecast-icon')).toBeInTheDocument();
  });

  it.each`
    locale       | expectedText
    ${'en'}      | ${'State Pension Message English'}
    ${undefined} | ${'State Pension Message English'}
    ${'cy'}      | ${'State Pension Message Welsh'}
  `(
    'renders $expectedText if locale is $locale',
    ({ locale, expectedText }) => {
      const { getByTestId } = render(
        <StatePensionForecastUnavailable data={mockData} locale={locale} />,
      );

      expect(
        getByTestId('state-pension-no-forecast-message'),
      ).toHaveTextContent(expectedText);
    },
  );

  it('does not render the icon or message when the DWP string is missing', () => {
    const { getByTestId, queryByTestId } = render(
      <StatePensionForecastUnavailable
        data={{} as PensionArrangement}
        locale="en"
      />,
    );

    expect(getByTestId('state-pension-no-forecast-title')).toBeInTheDocument();
    expect(
      queryByTestId('state-pension-no-forecast-icon'),
    ).not.toBeInTheDocument();
    expect(
      queryByTestId('state-pension-no-forecast-message'),
    ).not.toBeInTheDocument();
  });
});
