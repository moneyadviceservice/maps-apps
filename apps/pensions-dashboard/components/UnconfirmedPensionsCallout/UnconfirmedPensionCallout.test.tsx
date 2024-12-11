import { useRouter } from 'next/router';

import { render } from '@testing-library/react';

import { mockUnconfirmedPensions } from '../../lib/mocks';
import { PensionArrangement } from '../../lib/types';
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
    const { container } = render(
      <UnconfirmedPensionsCallout
        data={mockUnconfirmedPensions as PensionArrangement[]}
      />,
    );

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('does not render when there are no unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(<UnconfirmedPensionsCallout data={[]} />);

    // Assert
    expect(container).toMatchSnapshot();
  });
});
