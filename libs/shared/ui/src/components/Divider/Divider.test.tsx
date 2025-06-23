import { render, screen } from '@testing-library/react';
import { Divider } from '.';

describe('Divider component', () => {
  it('renders correctly', () => {
    render(<Divider />);
    const divider = screen.getByTestId('divider');
    expect(divider).toMatchSnapshot();
  });
});
