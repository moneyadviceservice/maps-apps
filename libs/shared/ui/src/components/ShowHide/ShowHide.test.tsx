import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

  it('shows content when show button is clicked', () => {
    render(<ShowHide>ShowHide</ShowHide>);
    const button = screen.getByTestId('show-hide-view-btn');
    fireEvent.click(button);
    const expandedSection = screen.getByTestId('expanded-content');
    expect(expandedSection).toBeVisible();
  });
});
