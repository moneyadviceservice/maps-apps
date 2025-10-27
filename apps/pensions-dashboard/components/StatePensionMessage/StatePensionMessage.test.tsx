import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionType } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { StatePensionMessage } from './StatePensionMessage';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = {
  ...(mockPensionsData.pensionPolicies[0]
    .pensionArrangements[0] as PensionArrangement),
  pensionType: PensionType.SP,
};

describe('StatePensionMessage', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });
  it('renders correctly', () => {
    const { container } = render(<StatePensionMessage data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders English when no locale is provided', () => {
    const { container } = render(
      <StatePensionMessage data={mockData} locale={undefined} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not render if pension type is not state pension', () => {
    const { container } = render(
      <StatePensionMessage
        data={{ ...mockData, pensionType: PensionType.DB }}
      />,
    );

    expect(container).toMatchSnapshot();
    expect(container).toBeEmptyDOMElement();
  });

  it.each`
    locale  | expectedText
    ${'cy'} | ${'State Pension Message Welsh'}
    ${'en'} | ${'State Pension Message English'}
  `(
    'renders $expectedText if locale is $locale',
    ({ locale, expectedText }) => {
      const { getByText } = render(
        <StatePensionMessage data={mockData} locale={locale} />,
      );
      expect(getByText(expectedText)).toBeInTheDocument();
    },
  );
});
