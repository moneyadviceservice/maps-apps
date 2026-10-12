import React from 'react';

import { render, screen } from '@testing-library/react';

import { VisibleSection } from './VisibleSection';

import '@testing-library/jest-dom';

describe('test VisibleSection wrapper working', () => {
  it('should render children when visible is true', () => {
    render(
      <VisibleSection visible={true}>
        <div>Results page</div>
      </VisibleSection>,
    );
    expect(screen.getByText('Results page')).toBeInTheDocument();
  });

  it('should not render children when visible flag is false', () => {
    render(
      <VisibleSection visible={false}>
        <div>Results page</div>
      </VisibleSection>,
    );
    expect(screen.queryByText('Results page')).not.toBeInTheDocument();
  });
});
