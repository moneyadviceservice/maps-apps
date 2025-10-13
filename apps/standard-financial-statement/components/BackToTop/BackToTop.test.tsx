import { fireEvent, render, screen } from '@testing-library/react';

import { BackToTop } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('BackToTop component', () => {
  it('renders correctly', () => {
    render(<BackToTop url="url" />);
    const component = screen.getByTestId('top');
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with click to print action', () => {
    render(<BackToTop url="url" />);
    const component = screen.getByTestId('top');
    const print = screen.getByTestId('print');
    const windowPrintAction = jest.spyOn(window, 'print');
    fireEvent.click(print);
    expect(windowPrintAction).toHaveBeenCalled();
    expect(component).toMatchSnapshot();
  });
});
