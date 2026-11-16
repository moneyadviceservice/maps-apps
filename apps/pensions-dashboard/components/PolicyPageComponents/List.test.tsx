import { render, screen } from '@testing-library/react';

import { List } from './List';

import '@testing-library/jest-dom/extend-expect';

describe('List', () => {
  const mockItems = ['First item', 'Second item', 'Third item'];

  it('renders unordered list by default', () => {
    render(<List items={mockItems} />);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
    expect(listElement.tagName).toBe('UL');
  });

  it('renders ordered list when variant is ordered', () => {
    render(<List items={mockItems} variant="ordered" />);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeInTheDocument();
    expect(listElement.tagName).toBe('OL');
  });

  it('renders all items with markdown content', () => {
    render(<List items={mockItems} />);

    mockItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('applies start attribute to ordered list', () => {
    render(<List items={mockItems} variant="ordered" start={5} />);

    const listElement = screen.getByRole('list');
    expect(listElement).toHaveAttribute('start', '5');
  });

  it('applies custom className', () => {
    const customClass = 'custom-list-class';
    render(<List items={mockItems} className={customClass} />);

    const listElement = screen.getByRole('list');
    expect(listElement).toHaveClass(customClass);
  });

  it('applies unordered list specific classes', () => {
    render(<List items={mockItems} variant="unordered" />);

    const listElement = screen.getByRole('list');
    expect(listElement).toHaveClass('marker:text-2xl', 'marker:leading-[1]');
  });

  it('does not render list when no items provided', () => {
    render(<List items={[]} />);

    const listElement = screen.queryByRole('list');
    expect(listElement).not.toBeInTheDocument();
  });
});
