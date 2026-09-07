import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { Markdown } from './Markdown';

import '@testing-library/jest-dom/extend-expect'; // Import jest-dom matchers

type MockTooltipProps = {
  children: React.ReactNode;
  accessibilityLabelOpen?: string;
  buttonCloseText?: string;
};

const mockTooltip = jest.fn((props: MockTooltipProps) => (
  <div
    data-testid="mock-tooltip"
    data-open-label={props.accessibilityLabelOpen ?? ''}
    data-close-label={props.buttonCloseText ?? ''}
  >
    {props.children}
  </div>
));

jest.mock('@maps-react/common/components/Tooltip', () => ({
  __esModule: true,
  Tooltip: (props: MockTooltipProps) => mockTooltip(props),
}));

describe('Markdown Component', () => {
  beforeEach(() => {
    mockTooltip.mockClear();
  });

  it('renders correctly', async () => {
    const { getByText } = render(<Markdown content="Hello World!" />);
    await waitFor(() => {
      expect(getByText('Hello World!')).toBeInTheDocument();
    });
  });

  it('renders correctly with className and testId', async () => {
    const { getByText, container } = render(
      <Markdown content="Hello World!" className="test" testId="test" />,
    );
    await waitFor(() => {
      expect(getByText('Hello World!')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('test');
      expect(container.firstChild).toHaveAttribute('data-testid', 'test');
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

  it('applies tooltip label overrides to markdown tooltips', async () => {
    render(
      <Markdown
        content="`tooltip::Tooltip content::`"
        tooltipProps={{
          accessibilityLabelOpen: 'More info',
          buttonCloseText: 'Close tooltip',
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    });

    const tooltip = screen.getByTestId('mock-tooltip');
    expect(tooltip).toHaveAttribute('data-open-label', 'More info');
    expect(tooltip).toHaveAttribute('data-close-label', 'Close tooltip');
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    expect(mockTooltip).toHaveBeenCalled();
  });
});
