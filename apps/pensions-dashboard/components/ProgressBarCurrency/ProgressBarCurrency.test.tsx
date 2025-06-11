import { render } from '@testing-library/react';

import { ProgressBarCurrency } from './ProgressBarCurrency';

describe('ProgressBarCurrency', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ProgressBarCurrency amount={123.45} total={1000} suffix="a month" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('handles zero amount', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={0} total={1000} suffix="a month" />,
    );
    expect(getAllByText('£0.00 a month')).toHaveLength(2);
  });

  it('handles whole number amounts', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={100} total={1000} suffix="a month" />,
    );
    expect(getAllByText('£100.00 a month')).toHaveLength(2);
  });

  it('rounds long decimal amount to currency format', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={123.4567} total={1000} suffix="a month" />,
    );
    expect(getAllByText('£123.46 a month')).toHaveLength(2);
  });

  it('handles amounts greater than the total', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={2000} total={1000} suffix="a month" />,
    );

    expect(getAllByText(`£1,000.00 a month`)).toHaveLength(2);
  });

  it('handles negative amounts', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={-123.45} total={1000} suffix="a month" />,
    );
    expect(getAllByText('£0.00 a month')).toHaveLength(2);
  });

  it('handles when no suffix is provided', () => {
    const { getAllByText } = render(
      <ProgressBarCurrency amount={123.45} total={1000} />,
    );
    expect(getAllByText('£123.45')).toHaveLength(2);
  });
});
