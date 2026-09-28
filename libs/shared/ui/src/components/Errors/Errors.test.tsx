import { render, screen } from '@testing-library/react';

import { Errors } from '.';

describe('Errors component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Errors errors={['errors']}>This contains errors</Errors>,
    );
    const container = screen.getByTestId('errors');
    expect(getByTestId('errors')).toHaveClass('border-red-600');
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when there are no errors', () => {
    const { getByTestId } = render(
      <Errors errors={[]}>This contains errors</Errors>,
    );
    const container = screen.getByTestId('errors');

    expect(getByTestId('errors')).not.toHaveClass('border-red-600');
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when errors are null', () => {
    const { getByTestId } = render(
      <Errors errors={null}>This contains no errors</Errors>,
    );

    expect(getByTestId('errors')).not.toHaveClass('border-red-600');
  });
});
