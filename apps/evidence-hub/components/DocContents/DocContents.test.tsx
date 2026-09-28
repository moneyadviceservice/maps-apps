import { render, screen } from '@testing-library/react';

import { DocContents } from './DocContents';

import '@testing-library/jest-dom';

describe('DocContents', () => {
  beforeEach(() => {
    render(<DocContents />);
  });

  it('renders the section heading', () => {
    const heading = screen.getByRole('heading', { name: /on this page/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('renders all list links with correct text and href', () => {
    const expectedLinks = [
      { href: '#context', text: 'Context' },
      { href: '#the-study', text: 'The study' },
      { href: '#key-findings', text: 'Key findings' },
      { href: '#points-to-consider', text: 'Points to consider' },
    ];

    expectedLinks.forEach(({ href, text }) => {
      const link = screen.getByRole('link', { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('wraps each link in a <li> element', () => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });
});
