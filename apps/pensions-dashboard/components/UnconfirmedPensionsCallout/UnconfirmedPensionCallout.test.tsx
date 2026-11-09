import { useRouter } from 'next/router';

import { render, screen } from '@testing-library/react';

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
      <UnconfirmedPensionsCallout count={3} headingLevel="h2" />,
    );

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when there is only 1 unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(
      <UnconfirmedPensionsCallout count={1} headingLevel="h2" />,
    );

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('does not render when there are no unconfirmed pensions', () => {
    // Act & Arrange
    const { container } = render(
      <UnconfirmedPensionsCallout count={0} headingLevel="h2" />,
    );

    // Assert
    expect(container).toMatchSnapshot();
  });

  it('renders the Important heading as h2 when headingLevel is h2', () => {
    render(<UnconfirmedPensionsCallout count={3} headingLevel="h2" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Important' }),
    ).toBeInTheDocument();
  });

  it('renders the Important heading as h3 when headingLevel is h3', () => {
    render(<UnconfirmedPensionsCallout count={3} headingLevel="h3" />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Important' }),
    ).toBeInTheDocument();
  });
});
