import { render, screen } from '@testing-library/react';

import { RegisterResultPage } from './RegisterResultPage';

describe('RegisterResultPage', () => {
  const mockCopy = [
    {
      content: 'This is a standard paragraph.',
      style: 'font-bold',
    },
    {
      content: 'Contact us at {email}.',
      style: 'italic',
      placeholder: {
        ref: '{email}',
        value: 'support@example.com',
      },
    },
  ];

  it('renders the correct number of paragraphs', () => {
    render(<RegisterResultPage copy={mockCopy} />);
    const paragraphs = screen.getAllByTestId(/copyItemContent-/);
    expect(paragraphs).toHaveLength(2);
  });

  it('renders plain text content correctly without placeholders', () => {
    render(<RegisterResultPage copy={[mockCopy[0]]} />);
    const p = screen.getByTestId('copyItemContent-0');

    expect(p).toHaveTextContent('This is a standard paragraph.');
  });

  it('replaces placeholders with a mailto link', () => {
    render(<RegisterResultPage copy={[mockCopy[1]]} />);

    const p = screen.getByTestId('copyItemContent-0');
    const link = screen.getByRole('link', { name: /support@example\.com/i });

    expect(p).toContainElement(link);
    expect(link).toHaveAttribute('href', 'mailto:support@example.com');
  });

  it('handles empty copy arrays gracefully', () => {
    const { container } = render(<RegisterResultPage copy={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
