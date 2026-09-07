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
    expect(layout).toHaveAttribute('data-title', 'Pension Calculator');
    expect(layout).toHaveAttribute(
      'data-page-title',
      'Test Page Heading - Pension Calculator',
    );
  });
});
