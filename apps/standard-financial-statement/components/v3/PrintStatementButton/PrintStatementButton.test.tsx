import { render, screen } from '@testing-library/react';

import { PrintStatementButton } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('PrintStatementButton component', () => {
  it('renders correctly', () => {
    render(<PrintStatementButton onClick={jest.fn()} />);
    const button = screen.getByTestId('print-statement-button');
    expect(button).toMatchSnapshot();
  });
});
