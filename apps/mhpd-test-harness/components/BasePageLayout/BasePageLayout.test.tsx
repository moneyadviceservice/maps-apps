import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BasePageLayout } from './BasePageLayout';

describe('BasePageLayout Component', () => {
  it('should render default BasePageLayout correctly', () => {
    render(<BasePageLayout title="Test Title">Content</BasePageLayout>);

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('base-page-layout-title')).toHaveTextContent(
      'Test Title',
    );
    expect(screen.queryByTestId('nav')).not.toBeInTheDocument();
  });

  it('should render BasePageLayout with composer navigation correctly', () => {
    render(
      <BasePageLayout title="Test Title" isComposer>
        Content
      </BasePageLayout>,
    );
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });
});
