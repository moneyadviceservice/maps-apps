import { render, screen } from '@testing-library/react';
import TabContent from './TabContent';
import { PAGES_NAMES } from '../../../lib/constants/pageConstants';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
  }),
}));
jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    t: (key: string) => key,
    z: (obj: { en: string }) => obj.en,
    tList: (key: string) => [],
    locale: 'en',
  })),
}));
const errorSummaryRef = React.createRef<HTMLDivElement>();
describe('TabContent component', () => {
  it('should display the component with title', () => {
    const { container } = render(
      <TabContent
        title={'About us'}
        tabName={PAGES_NAMES.ABOUTYOU}
        hasError={false}
        errorSummaryRef={errorSummaryRef}
      >
        Tab content
      </TabContent>,
    );

    expect(container.getElementsByTagName('h1')).toBeTruthy();
    expect(container.getElementsByTagName('h1')[0]?.innerHTML).toBe('About us');
  });

  it('should display the component with description', () => {
    const { container } = render(
      <TabContent
        title={'Retirement'}
        tabName={PAGES_NAMES.INCOME}
        description="Tab specific description"
        hasError={false}
        errorSummaryRef={errorSummaryRef}
      >
        Tab content
      </TabContent>,
    );

    expect(container.getElementsByTagName('p')).toBeTruthy();
    expect(container.getElementsByTagName('p')[0]?.innerHTML).toBe(
      'Tab specific description',
    );
  });
  it('should display summary total with values', () => {
    render(
      <TabContent
        title={'Retirement'}
        tabName={PAGES_NAMES.INCOME}
        hasError={false}
        summaryData={{ income: 300, spending: 100 }}
        errorSummaryRef={errorSummaryRef}
      >
        Tab content
      </TabContent>,
    );

    expect(screen.getAllByText('£300')).toBeTruthy();
    expect(screen.getAllByText('£100')).toBeTruthy();
  });

  it('should display error message', () => {
    render(
      <TabContent
        title={'Retirement'}
        tabName={PAGES_NAMES.INCOME}
        hasError={true}
        errorSummaryRef={errorSummaryRef}
        summaryData={{ income: 300, spending: 100 }}
      >
        Tab content
      </TabContent>,
    );

    expect(screen.getAllByTestId('error-summary-container')).toBeTruthy();
  });
});

describe('TabContent additional cases', () => {
  it('does not render RealTimeSummary for ABOUTYOU even when summaryData is provided', () => {
    render(
      <TabContent
        title="About"
        tabName={PAGES_NAMES.ABOUTYOU}
        hasError={false}
        errorSummaryRef={errorSummaryRef}
        summaryData={{ income: 300, spending: 100 }}
      >
        Content
      </TabContent>,
    );

    expect(screen.queryByText('£300')).toBeNull();
    expect(screen.queryByText('£100')).toBeNull();
  });

  it('renders generic error-summary text when hasError is true and tab is not ABOUTYOU', () => {
    render(
      <TabContent
        title="Income"
        tabName={PAGES_NAMES.INCOME}
        hasError={true}
        errorSummaryRef={errorSummaryRef}
      >
        Content
      </TabContent>,
    );

    expect(screen.getAllByTestId('error-summary-container')).toBeTruthy();
    expect(screen.getByText('errorSummary.text')).toBeTruthy();
  });
  it('does not render RealTimeSummary for SUMMARY even when summaryData is provided', () => {
    render(
      <TabContent
        title={'Summary'}
        tabName={PAGES_NAMES.SUMMARY}
        hasError={false}
        errorSummaryRef={errorSummaryRef}
        summaryData={{ income: 300, spending: 100 }}
      >
        Summary content
      </TabContent>,
    );

    expect(screen.queryByText('£300')).toBeNull();
    expect(screen.queryByText('£100')).toBeNull();
  });

  it('builds and displays aboutYou specific error messages when errorDetails provided for ABOUTYOU', () => {
    render(
      <TabContent
        title="About"
        tabName={PAGES_NAMES.ABOUTYOU}
        hasError={true}
        errorSummaryRef={errorSummaryRef}
        errorDetails={{
          field1: ['required'],
          field2: ['invalid'],
        }}
      >
        Content
      </TabContent>,
    );

    expect(screen.getByText('aboutYou.errors.required')).toBeTruthy();
    expect(screen.getByText('aboutYou.errors.invalid')).toBeTruthy();
  });
});
