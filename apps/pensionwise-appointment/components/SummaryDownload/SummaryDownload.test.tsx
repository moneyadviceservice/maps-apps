import { render, screen } from '@testing-library/react';

import { SummaryDownload } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const yesAnswersQuery = {
  t1q2: '1',
  t2q3: '1',
  t3q1: '1',
  age: '3',
};

const notSureAnswersQuery = {
  t1q2: '3',
  t2q3: '3',
  t3q1: '3',
  age: '3',
};

const minimalOptionsQuery = {
  t1q2: '2',
  t2q3: '2',
  t3q1: '2',
  age: '2',
};

describe('SummaryDownload component', () => {
  beforeEach(() => {
    jest.resetModules();
    const originalEnv = { ...process.env };
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL:
        'https://staging-embedded-journeys.moneyhelper.org.uk/en/summary-document/download',
      NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL_CY:
        'https://staging-embedded-journeys.moneyhelper.org.uk/cy/explore-your-options/welsh-summary',
    };
  });
  it('renders yes answers correctly in English', () => {
    render(<SummaryDownload query={{ ...yesAnswersQuery, language: 'en' }} />);
    const container = screen.getByTestId('summary-download-form');
    expect(container).toMatchSnapshot();
  });

  it('renders not sure answers correctly in English', () => {
    render(
      <SummaryDownload query={{ ...notSureAnswersQuery, language: 'en' }} />,
    );
    const container = screen.getByTestId('summary-download-form');
    expect(container).toMatchSnapshot();
  });

  it('renders minimal options correctly in English', () => {
    render(
      <SummaryDownload query={{ ...minimalOptionsQuery, language: 'en' }} />,
    );
    const container = screen.getByTestId('summary-download-form');
    expect(container).toMatchSnapshot();
  });

  it('renders yes answers correctly in Welsh', () => {
    render(
      <SummaryDownload
        testId="summary-download-form-welsh"
        query={{ ...yesAnswersQuery, language: 'cy' }}
      />,
    );
    const container = screen.getByTestId('summary-download-form-welsh');
    expect(container).toMatchSnapshot();
  });

  it('renders not sure answers correctly in Welsh', () => {
    render(
      <SummaryDownload
        testId="summary-download-form-welsh"
        query={{ ...notSureAnswersQuery, language: 'cy' }}
      />,
    );
    const container = screen.getByTestId('summary-download-form-welsh');
    expect(container).toMatchSnapshot();
  });

  it('renders minimal options correctly in Welsh', () => {
    render(
      <SummaryDownload
        testId="summary-download-form-welsh"
        query={{ ...minimalOptionsQuery, language: 'cy' }}
      />,
    );
    const container = screen.getByTestId('summary-download-form-welsh');
    expect(container).toMatchSnapshot();
  });
});
