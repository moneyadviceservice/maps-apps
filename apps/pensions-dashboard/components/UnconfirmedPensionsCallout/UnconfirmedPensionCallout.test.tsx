import { useRouter } from 'next/router';

import { render } from '@testing-library/react';

import { UnconfirmedPensionsCallout } from './UnconfirmedPensionsCallout';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('UnconfirmedPensionsCallout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
    });
  });
  it('renders correctly when there are unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(<UnconfirmedPensionsCallout count={3} />);

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when there is only 1 unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(<UnconfirmedPensionsCallout count={1} />);

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('does not render when there are no unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(<UnconfirmedPensionsCallout count={0} />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
