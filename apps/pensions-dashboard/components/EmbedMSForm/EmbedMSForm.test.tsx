import React from 'react';

import { render } from '@testing-library/react';

jest.mock('@maps-react/layouts/EmbedPageLayout', () => ({
  EmbedPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="embed-layout">{children}</div>
  ),
}));

import { EmbedMSForm } from './EmbedMSForm';

describe('EmbedMSForm', () => {
  it('renders iframe with default props and is wrapped by EmbedPageLayout', () => {
    const { container } = render(
      <EmbedMSForm src="https://example.com" title="Test embed" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('applies custom props correctly', () => {
    const { container } = render(
      <EmbedMSForm
        src="https://another.example"
        title="Custom"
        testId="frame-1"
        id="frame-id"
        classNames="custom-class"
        minHeight={600}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
