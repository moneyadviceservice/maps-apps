import React from 'react';

import { render, screen } from '@testing-library/react';

import { VisibleSection } from './VisibleSection';

import '@testing-library/jest-dom';

describe('test VisibleSection wrapper working', () => {
  it('should render children when visible is true', () => {
    render(
      <VisibleSection visible={true}>
        <div>About me page</div>
      </VisibleSection>,
    );
    expect(screen.getByText('About me page')).toBeInTheDocument();
  });

  it('should not render children when visible flag is false', () => {
    render(
      <VisibleSection visible={false}>
        <div>Content not displayed</div>
      </VisibleSection>,
    );
    expect(screen.queryByText('Content not displayed')).not.toBeInTheDocument();
  });
});
