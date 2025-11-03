import { render, screen } from '@testing-library/react';

import { ProgressBarCurrency } from './ProgressBarCurrency';

import '@testing-library/jest-dom/extend-expect';

describe('ProgressBarCurrency', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ProgressBarCurrency amount={123.45} total={1000} suffix="a month" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('handles zero amount', () => {
    render(<ProgressBarCurrency amount={0} total={1000} suffix="a month" />);
    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      '£0.00 a month',
    );
  });

  it('handles whole number amounts', () => {
    render(<ProgressBarCurrency amount={100} total={1000} suffix="a month" />);
    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      '£100.00 a month',
    );
  });

  it('rounds long decimal amount to currency format', () => {
    render(
      <ProgressBarCurrency amount={123.4567} total={1000} suffix="a month" />,
    );
    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      '£123.46 a month',
    );
  });

  it('handles amounts greater than the total', () => {
    render(<ProgressBarCurrency amount={2000} total={1000} suffix="a month" />);

    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      `£1,000.00 a month`,
    );
  });

  it('handles negative amounts', () => {
    render(
      <ProgressBarCurrency amount={-123.45} total={1000} suffix="a month" />,
    );
    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      '£0.00 a month',
    );
  });

  it('handles when no suffix is provided', () => {
    render(<ProgressBarCurrency amount={123.45} total={1000} />);
    expect(screen.getByTestId('progress-bar-currency')).toHaveTextContent(
      '£123.45',
    );
  });
});
