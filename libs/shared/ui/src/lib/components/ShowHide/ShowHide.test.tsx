import React from 'react';
import { render, screen } from '@testing-library/react';
import { ShowHide } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

describe('ShowHide component', () => {
  it('renders correctly', () => {
    render(<ShowHide testId="test-component">ShowHide</ShowHide>);
    const container = screen.getByTestId('test-component');
    expect(container).toMatchSnapshot();
  });
});
