import { mock } from 'layouts/DocumentLayout/mock';
import { render, screen } from '@testing-library/react';

import { KeyInfo } from './KeyInfo';

import '@testing-library/jest-dom';

describe('KeyInfo', () => {
  beforeEach(() => {
    render(<KeyInfo page={mock} />);
  });

  it('renders a heading with the correct tag and class', () => {
    const heading = screen.getByTestId('heading');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('mb-4');
  });
});
