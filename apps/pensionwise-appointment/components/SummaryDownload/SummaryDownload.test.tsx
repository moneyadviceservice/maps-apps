import { render, screen } from '@testing-library/react';

import { SummaryDownload } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const EN_URL = 'https://en.download.url',
  CY_URL = 'https://cy.download.url';

describe('SummaryDownload component', () => {
  beforeEach(() => {
    jest.resetModules();
    const originalEnv = { ...process.env };
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL: EN_URL,
      NEXT_PUBLIC_DOWNLOAD_SUMMARY_URL_CY: CY_URL,
    };
  });
  it('should link to english standard pdf when user between age 50-54', () => {
    render(<SummaryDownload query={{ age: '2', language: 'en' }} />);

    expect(screen.getByTestId('summary-download').getAttribute('href')).toBe(
      `${EN_URL}/non-standard-db.pdf`,
    );
  });

  it('should link to english non standard pdf when user over 55', () => {
    render(<SummaryDownload query={{ age: '3', language: 'en' }} />);

    expect(screen.getByTestId('summary-download').getAttribute('href')).toBe(
      `${EN_URL}/standard-db.pdf`,
    );
  });

  it('should link to welsh non standard pdf when user over 55', () => {
    render(<SummaryDownload query={{ age: '3', language: 'cy' }} />);

    expect(screen.getByTestId('summary-download').getAttribute('href')).toBe(
      `${CY_URL}/non-standard-db-cy.pdf`,
    );
  });

  it('should link to welsh standard pdf when user between age 50-54', () => {
    render(<SummaryDownload query={{ age: '2', language: 'cy' }} />);

    expect(screen.getByTestId('summary-download').getAttribute('href')).toBe(
      `${CY_URL}/standard-db-cy.pdf`,
    );
  });
});
