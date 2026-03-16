import { render, screen } from '@testing-library/react';

import { DefinitionTerm } from './DefinitionTerm';

import '@testing-library/jest-dom/extend-expect';

describe('DefinitionTerm', () => {
  it('renders children correctly', () => {
    render(<DefinitionTerm>Test content</DefinitionTerm>);

    expect(screen.getByTestId('dt')).toBeInTheDocument();
  });

  it('merges custom className with default classes', () => {
    render(
      <DefinitionTerm className="custom-class">Test content</DefinitionTerm>,
    );

    expect(screen.getByTestId('dt')).toHaveClass('custom-class');
  });

  it('applies default testId when no testId prop provided', () => {
    render(<DefinitionTerm>Test content</DefinitionTerm>);

    expect(screen.getByTestId('dt')).toBeInTheDocument();
  });

  it('applies custom testId with dt- prefix', () => {
    render(<DefinitionTerm testId="custom">Test content</DefinitionTerm>);

    expect(screen.getByTestId('dt-custom')).toBeInTheDocument();
  });
});
