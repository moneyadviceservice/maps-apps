import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import jest-dom matchers
import { Markdown } from './Markdown';

describe('Markdown Component', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<Markdown content="Hello World!" />);
    await waitFor(() => {
      expect(getByText('Hello World!')).toBeInTheDocument();
    });
  });

  it('renders correctly with className', async () => {
    const { getByText, container } = render(
      <Markdown content="Hello World!" className="test" />,
    );
    await waitFor(() => {
      expect(getByText('Hello World!')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('test');
    });
  });

  it('renders correctly with link', async () => {
    const { getByText } = render(
      <Markdown content="[Hello World!](https://example.com)" />,
    );
    await waitFor(() => {
      const linkElement = getByText('Hello World!');
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute(
        'href',
        'https://example.com',
      );
    });
  });

  it('renders correctly with paragraph', async () => {
    const { getByText } = render(<Markdown content="Hello World!" />);
    await waitFor(() => {
      expect(getByText('Hello World!')).toBeInTheDocument();
    });
  });

  it('renders correctly with paragraph and link', async () => {
    const { getByText } = render(
      <Markdown content="[Hello World!](https://example.com)" />,
    );
    await waitFor(() => {
      const linkElement = getByText('Hello World!');
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute(
        'href',
        'https://example.com',
      );
    });
  });
});
