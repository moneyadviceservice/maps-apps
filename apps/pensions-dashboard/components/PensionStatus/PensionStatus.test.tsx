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

    expect(
      screen.getByText('pages.pension-details.status.active'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render inactive status message', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.I,
    };

    const { container } = render(<PensionStatus data={data} />);

    expect(
      screen.getByText('pages.pension-details.status.inactive'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render short active status message', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.A,
    };

    const { container } = render(
      <PensionStatus data={data} showShortText={true} />,
    );

    expect(screen.getByText('data.pensions.status.active')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render short inactive status message', () => {
    const data: PensionArrangement = {
      ...mockData,
      pensionStatus: Status.I,
    };

    const { container } = render(
      <PensionStatus data={data} showShortText={true} />,
    );

    expect(
      screen.getByText('data.pensions.status.inactive'),
    ).toBeInTheDocument();
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
