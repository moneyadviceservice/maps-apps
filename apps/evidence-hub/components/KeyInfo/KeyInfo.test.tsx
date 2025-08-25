import { render, screen } from '@testing-library/react';

import { KeyInfo } from './KeyInfo';

import '@testing-library/jest-dom';

describe('KeyInfo', () => {
  beforeEach(() => {
    render(<KeyInfo />);
  });

  it('renders a heading with the correct tag and class', () => {
    const heading = screen.getByTestId('heading');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('mb-4');
  });

  it('renders a bold title in each KeySection', () => {
    const boldTitles = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && el.classList.contains('font-bold'),
    );
    expect(boldTitles).toHaveLength(7);
  });

  it('renders expected number of lists and spans', () => {
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(3);

    const spans = screen.getAllByText(
      (_, el) => el?.tagName === 'SPAN' && !el.classList.contains('font-bold'),
    );
    expect(spans.length).toBeGreaterThanOrEqual(1);
  });
});
