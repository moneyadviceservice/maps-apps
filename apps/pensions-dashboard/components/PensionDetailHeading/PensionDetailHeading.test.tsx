import { render, screen } from '@testing-library/react';

import { PensionDetailHeading } from './PensionDetailHeading';

import '@testing-library/jest-dom/extend-expect';

describe('PensionDetailHeading', () => {
  it('renders title correctly', () => {
    render(<PensionDetailHeading title="Test Title" />);

    const heading = screen.getByTestId('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders subheading when provided', () => {
    render(
      <PensionDetailHeading title="Test Title" subHeading="Test Subheading" />,
    );

    const subHeading = screen.getByTestId('sub-heading');
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent('Test Subheading');
  });

  it('does not render subheading when not provided', () => {
    render(<PensionDetailHeading title="Test Title" />);

    expect(screen.queryByTestId('sub-heading')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to heading with subheading', () => {
    render(
      <PensionDetailHeading title="Test Title" subHeading="Test Subheading" />,
    );

    expect(screen.getByTestId('heading')).toHaveClass('md:mb-4');
  });

  it('applies correct CSS classes to heading without subheading', () => {
    render(<PensionDetailHeading title="Test Title" />);

    expect(screen.getByTestId('heading')).toHaveClass('md:mb-12');
  });
});
