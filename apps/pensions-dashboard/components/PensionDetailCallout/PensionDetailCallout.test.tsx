import { render, screen } from '@testing-library/react';

import { PensionDetailCallout } from './PensionDetailCallout';

import '@testing-library/jest-dom/extend-expect';

describe('PensionDetailCallout', () => {
  it('renders default content', () => {
    const testContent = 'Test pension content';

    render(<PensionDetailCallout>{testContent}</PensionDetailCallout>);

    expect(screen.getByTestId('pension-detail-callout')).toBeInTheDocument();
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('applies custom testId when provided', () => {
    const customTestId = 'custom-pension-callout';

    render(
      <PensionDetailCallout testId={customTestId}>
        Test content
      </PensionDetailCallout>,
    );

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
  });

  it('merges custom className with default classes', () => {
    const customClass = 'bg-red-500 text-white';

    render(
      <PensionDetailCallout className={customClass}>
        Test content
      </PensionDetailCallout>,
    );

    const element = screen.getByTestId('pension-detail-callout');
    expect(element).toHaveClass('bg-red-500');
    expect(element).toHaveClass('text-white');
    expect(element).toHaveClass('border-2'); // Default class preserved
  });
});
