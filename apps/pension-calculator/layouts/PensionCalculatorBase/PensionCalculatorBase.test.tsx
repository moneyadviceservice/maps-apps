import { PropsWithChildren } from 'react';

import { render, screen } from '@testing-library/react';

import { ToolPageLayoutProps } from '@maps-react/layouts/ToolPageLayout';

import { PensionCalculatorBase } from './PensionCalculatorBase';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

jest.mock('@maps-react/layouts/ToolPageLayout', () => ({
  ToolPageLayout: ({ children, pageTitle, title }: ToolPageLayoutProps) => (
    <div
      data-testid="tool-page-layout"
      data-page-title={pageTitle}
      data-title={title}
    >
      {children}
    </div>
  ),
}));

jest.mock('@maps-react/core/components/Container', () => ({
  Container: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  Heading: ({ children }: PropsWithChildren) => <h1>{children}</h1>,
}));

jest.mock('@maps-react/common/components/BackLink', () => ({
  BackLink: ({ href, children }: PropsWithChildren<{ href: string }>) => (
    <a href={href} data-testid="tool-nav-prev">
      {children}
    </a>
  ),
}));

describe('PensionCalculatorBase', () => {
  const defaultProps = {
    pageHeading: 'Test Page Heading',
  };

  it('renders the page heading and children correctly', () => {
    render(
      <PensionCalculatorBase {...defaultProps}>
        <p>Test Child Content</p>
      </PensionCalculatorBase>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Test Page Heading',
    );

    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('passes the formatted pageTitle and appTitle to ToolPageLayout', () => {
    render(
      <PensionCalculatorBase {...defaultProps}>
        <div>Content</div>
      </PensionCalculatorBase>,
    );

    const layout = screen.getByTestId('tool-page-layout');
    expect(layout).toHaveAttribute('data-title', 'Pension calculator');
    expect(layout).toHaveAttribute(
      'data-page-title',
      'Test Page Heading - Pension calculator',
    );
  });

  it('prefixes the page title with Error: when hasError is true', () => {
    render(
      <PensionCalculatorBase {...defaultProps} hasError>
        <div>Content</div>
      </PensionCalculatorBase>,
    );

    const layout = screen.getByTestId('tool-page-layout');
    expect(layout).toHaveAttribute(
      'data-page-title',
      'Error: Test Page Heading - Pension calculator',
    );
  });

  it('hides the page heading when showHeading is false', () => {
    render(
      <PensionCalculatorBase {...defaultProps} showHeading={false}>
        <p>Child</p>
      </PensionCalculatorBase>,
    );

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('renders journey chrome when backHref is provided', () => {
    render(
      <PensionCalculatorBase
        {...defaultProps}
        pageHeading="Your income"
        backHref="/en/about-you?sessionId=abc"
        sectionLabel="Section 2 of 8"
        intro="Intro copy"
      >
        <p>Form content</p>
      </PensionCalculatorBase>,
    );

    const back = screen.getByTestId('tool-nav-prev');
    expect(back).toHaveAttribute('href', '/en/about-you?sessionId=abc');
    expect(back).toHaveTextContent('Back');
    expect(screen.getByText('Section 2 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your income',
    );
    expect(screen.getByText('Intro copy')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.getByTestId('tool-page-layout')).toHaveAttribute(
      'data-title',
      'Pension calculator',
    );
  });
});
