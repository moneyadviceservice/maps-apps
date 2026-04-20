import { render, screen } from '@testing-library/react';

import { ProgressBar } from './ProgressBar';

import '@testing-library/jest-dom/extend-expect';

describe('ProgressBar', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ProgressBar amount={123.45} total={1000} text="£123.45 a month" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays the text', () => {
    render(<ProgressBar amount={123.45} total={1000} text="£123.45 a month" />);
    expect(screen.getByTestId('progress-bar')).toHaveTextContent(
      '£123.45 a month',
    );
  });

  it('calculates progress width correctly', () => {
    const { container } = render(
      <ProgressBar amount={250} total={1000} text="25%" />,
    );
    const progressFill = container.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '25%' });
  });

  it('handles zero amount', () => {
    render(<ProgressBar amount={0} total={1000} text="£0.00 a month" />);
    expect(screen.getByTestId('progress-bar')).toHaveTextContent(
      '£0.00 a month',
    );
  });

  it('handles amounts greater than the total', () => {
    const { container } = render(
      <ProgressBar amount={2000} total={1000} text="Capped" />,
    );
    const progressFill = container.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  it('handles negative amounts', () => {
    const { container } = render(
      <ProgressBar amount={-123.45} total={1000} text="£0.00" />,
    );
    const progressFill = container.querySelector('[style*="width"]');
    expect(progressFill).toHaveStyle({ width: '0%' });
  });

  it('uses custom testId when provided', () => {
    render(
      <ProgressBar
        amount={100}
        total={1000}
        text="Custom"
        testId="custom-progress-bar"
      />,
    );
    expect(screen.getByTestId('custom-progress-bar')).toHaveTextContent(
      'Custom',
    );
  });
});
