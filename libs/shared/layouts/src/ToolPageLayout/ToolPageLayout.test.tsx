import React from 'react';

import { render, screen } from '@testing-library/react';

import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { CookieConsent } from '@maps-react/vendor/components/CookieConsent';

import { ToolPageLayout } from '.';

import '@testing-library/jest-dom';

declare global {
  // eslint-disable-next-line no-var
  var CookieControl: { load: () => void; open: () => void };
  // eslint-disable-next-line no-var
  var gtag: ((...args: unknown[]) => void) | undefined;
}

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('@maps-react/vendor/components/CookieConsent', () => ({
  CookieConsent: jest.fn(() => <div data-testid="cookie-consent" />),
}));

globalThis.gtag = jest.fn();
globalThis.CookieControl = {
  load: jest.fn(),
  open: jest.fn(),
};

describe('ToolPageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ToolPageLayout title={'test title'}>Test content</ToolPageLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a phase banner when selected', () => {
    render(
      <ToolPageLayout phase={PhaseType.BETA} title={'test title'}>
        Test content
      </ToolPageLayout>,
    );
    const phaseBanner = screen.getByTestId('phase-banner');
    expect(phaseBanner).toBeVisible();
  });

  it('renders without a language switcher', () => {
    const { queryByTestId } = render(
      <ToolPageLayout
        showLanguageSwitcher={false}
        title={'no language switcher'}
      >
        No language switcher
      </ToolPageLayout>,
    );
    const languageSwitcher = queryByTestId('language-switcher');
    expect(languageSwitcher).not.toBeInTheDocument();
  });

  it('hides search and renders headerEndSlot in the header', () => {
    render(
      <ToolPageLayout
        title="t"
        showSearch={false}
        headerEndSlot={<span>End</span>}
      >
        c
      </ToolPageLayout>,
    );
    expect(screen.queryByTestId('search-toggle')).not.toBeInTheDocument();
    expect(screen.getByTestId('header-end-slot')).toBeInTheDocument();
  });

  it('sets aria-hidden TRUE when cookie preferences is clicked', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, () => null]);

    const container = render(
      <ToolPageLayout title={'test title'}>Test content</ToolPageLayout>,
    );

    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('main-content')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders the title as a span when selected', () => {
    render(
      <ToolPageLayout
        phase={PhaseType.BETA}
        titleTag="span"
        title={'test title'}
      >
        Test content
      </ToolPageLayout>,
    );
    const spanTitle = screen.getByTestId('toolpage-span-title');
    expect(spanTitle).toBeVisible();
  });

  it('renders the component with mainClassName class and noMargin', () => {
    const { getByTestId } = render(
      <ToolPageLayout
        title={'test title'}
        mainClassName="testClassName"
        noMargin={true}
      >
        Test content
      </ToolPageLayout>,
    );

    expect(getByTestId('main')).toHaveClass('testClassName');
    expect(getByTestId('main')).toHaveClass('my-2');
  });

  it('renders title as <span> with grid layout', () => {
    render(
      <ToolPageLayout title="Grid Span Title" titleTag="span" layout="grid">
        Test content
      </ToolPageLayout>,
    );

    const spanTitle = screen.getByTestId('toolpage-span-title');
    expect(spanTitle).toBeVisible();
    expect(spanTitle.tagName).toBe('SPAN');
    expect(spanTitle).toHaveTextContent('Grid Span Title');
  });

  it('renders title as <Heading> with grid layout', () => {
    render(
      <ToolPageLayout
        title="Grid Heading Title"
        titleTag="default"
        layout="grid"
        headingClassName="custom-heading"
        headingLevel="h2"
      >
        Test content
      </ToolPageLayout>,
    );
    const heading = screen.getByTestId('toolpage-h1-title');
    expect(heading).toBeVisible();
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveTextContent('Grid Heading Title');
    expect(heading).toHaveClass('custom-heading');
  });

  it('renders topInfoSection inside grid wrapper when layout is grid', () => {
    render(
      <ToolPageLayout
        title="Grid layout"
        layout="grid"
        topInfoSection={<div data-testid="top-info">Top info content</div>}
      >
        Test content
      </ToolPageLayout>,
    );

    const topInfo = screen.getByTestId('top-info');
    expect(topInfo).toBeVisible();
    expect(topInfo.closest('.col-span-12')).toBeInTheDocument();
  });

  it('renders topInfoSection without grid wrapper when layout is default', () => {
    render(
      <ToolPageLayout
        title="Default layout"
        topInfoSection={<div data-testid="top-info">Top info content</div>}
      >
        Test content
      </ToolPageLayout>,
    );

    const topInfo = screen.getByTestId('top-info');
    expect(topInfo).toBeVisible();
    expect(topInfo.closest('.col-span-12')).not.toBeInTheDocument();
  });

  it('does not render the Trustpilot widget by default', () => {
    render(<ToolPageLayout title="test title">Test content</ToolPageLayout>);

    expect(screen.queryByTestId('trustpilot-widget')).not.toBeInTheDocument();
  });

  it('renders the Trustpilot widget when showTrustpilot is true', () => {
    render(
      <ToolPageLayout title="test title" showTrustpilot>
        Test content
      </ToolPageLayout>,
    );

    expect(screen.getAllByTestId('trustpilot-widget')).toHaveLength(1);
  });

  it('passes cookieConfig to CookieConsent when provided', () => {
    const mockConfig = {
      locales: ['en', 'cy'],
      text: 'Test cookie text',
    };

    render(
      <ToolPageLayout title="Cookie Test" cookieConfig={mockConfig}>
        Test content
      </ToolPageLayout>,
    );

    expect(screen.getByTestId('cookie-consent')).toBeInTheDocument();

    expect(CookieConsent).toHaveBeenCalledWith(
      expect.objectContaining({
        config: mockConfig,
      }),
      undefined,
    );
  });
});
