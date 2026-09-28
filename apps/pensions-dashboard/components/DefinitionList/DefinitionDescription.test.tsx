import { render, screen } from '@testing-library/react';

import { DefinitionDescription } from './DefinitionDescription';

import '@testing-library/jest-dom/extend-expect';

describe('DefinitionDescription', () => {
  it('renders children correctly', () => {
    render(<DefinitionDescription>Test content</DefinitionDescription>);

    expect(screen.getByTestId('dd')).toHaveTextContent('Test content');
  });

  it('merges custom className with default classes', () => {
    render(
      <DefinitionDescription className="custom-class">
        Test content
      </DefinitionDescription>,
    );

    expect(screen.getByTestId('dd')).toHaveClass('custom-class');
  });

  it('sets default data-testId when testId is not provided', () => {
    render(<DefinitionDescription>Test content</DefinitionDescription>);

    expect(screen.getByTestId('dd')).toBeInTheDocument();
  });

  it('sets custom data-testId when testId is provided', () => {
    render(
      <DefinitionDescription testId="custom">
        Test content
      </DefinitionDescription>,
    );

    expect(screen.getByTestId('dd-custom')).toBeInTheDocument();
  });
});
