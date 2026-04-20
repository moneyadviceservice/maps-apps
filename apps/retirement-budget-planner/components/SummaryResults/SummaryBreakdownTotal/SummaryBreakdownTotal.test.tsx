import { fireEvent, render, screen } from '@testing-library/react';
import { SummaryBreakdownTotal } from './SummaryBreakdownTotal';
import { mockSubmittedData } from 'lib/mocks/mockRetirementIncome';
import { mockPageData } from 'lib/mocks/mockEssentialOutgoings';
import { mockTranslationDataEn } from 'lib/mocks/mockUseTranslations';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => {
  return {
    __esModule: true,
    default: () => ({
      t: (key: string) => mockTranslationDataEn[key] ?? key,
      locale: 'en',
    }),
  };
});

const renderComponent = () =>
  render(
    <SummaryBreakdownTotal
      income={mockSubmittedData}
      costs={mockPageData()}
      divider={'month'}
      tabName="summary"
    />,
  );

describe('Summary breakdown & summary total component', () => {
  it('should render component correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should display total income / spending / balance when frequency is the monthly, defualt option', () => {
    renderComponent();

    expect(screen.getByText('£442.26')).toBeTruthy();
    expect(screen.getByText('£1,080.00')).toBeTruthy();
  });

  it('should update total income / spending / balance when update the frequency dropdown', () => {
    renderComponent();

    const dropdown = screen.getByTestId('t-summary-options');

    fireEvent.change(dropdown, { target: { value: 'year' } });

    expect(screen.getByText('£5,307.14')).toBeTruthy();
    expect(screen.getByText('£12,960.00')).toBeTruthy();
  });
});
