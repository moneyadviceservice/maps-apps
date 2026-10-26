import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RealTimeSummary from './RealTimeSummary';
import { defaultProps, negativeProps, neutralProps } from './mocks';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('RealTimeSummary component', () => {
  it('renders correctly', () => {
    const { container } = render(<RealTimeSummary data={defaultProps} />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render summary total column in green background colour when is positive number', () => {
    const { container } = render(<RealTimeSummary data={defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByText('Spare cash')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-700')).toBeVisible();
  });
  it('should render summary total column in red background colour when is negative number', () => {
    const { container } = render(<RealTimeSummary data={negativeProps} />);

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByText('Overspend')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-600')).toBeVisible();
  });
  it('should render summary total column in grey background colour when is balance', () => {
    const { container } = render(<RealTimeSummary data={neutralProps} />);

    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(container.querySelector('.bg-slate-600')).toBeVisible();
  });
});
