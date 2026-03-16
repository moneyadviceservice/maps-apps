import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionStatus as Status } from '../../lib/constants';
import { mockPensionsData } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
import { PensionStatus } from './PensionStatus';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockData = mockPensionsData.pensionPolicies[0]
  .pensionArrangements[0] as PensionArrangement;

describe('Pension Status component', () => {
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render active status message', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.A,
    };

    const { container } = render(<PensionStatus data={data} />);

    expect(screen.getByText('data.pensions.status.active')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render inactive status message', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.I,
    };

    const { container } = render(<PensionStatus data={data} />);

    expect(
      screen.getByText('data.pensions.status.inactive'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render classes for details', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.A,
    };

    const { container } = render(
      <PensionStatus data={data} detailStatus={true} />,
    );

    const pensionStatus = screen.getByTestId('pension-status');
    const icon = screen.getByTestId('pension-status-icon');

    expect(pensionStatus).toHaveClass('gap-7 px-5 items-center');
    expect(icon).toHaveClass('w-[18px] h-[18px]');
    expect(container).toMatchSnapshot();
  });

  it('should render active tooltip for details', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.A,
    };

    const { container } = render(
      <PensionStatus data={data} detailStatus={true} />,
    );

    expect(screen.getByText('tooltips.status-active')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render inactive tooltip for details', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.I,
    };

    const { container } = render(
      <PensionStatus data={data} detailStatus={true} />,
    );

    expect(screen.getByText('tooltips.status-inactive')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should return null if pensionStatus is undefined', () => {
    const data: PensionArrangement = { ...mockData, pensionStatus: undefined };

    const { container } = render(<PensionStatus data={data} />);

    expect(container.firstChild).toBeNull();
  });

  it('should return null if pensionStatus is not provided', () => {
    delete mockData.pensionStatus;
    const data: PensionArrangement = { ...mockData };

    const { container } = render(<PensionStatus data={data} />);

    expect(container.firstChild).toBeNull();
  });
});
