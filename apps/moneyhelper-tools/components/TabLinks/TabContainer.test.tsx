import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TabContainer } from './TabContainer';

jest.mock('@maps-react/core/components/Container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

describe('TabContainer', () => {
  it('renders children within a Container with correct class', () => {
    render(<TabContainer>Test Content</TabContainer>);
    const container = screen.getByTestId('container');
    const mainContainer = screen.getByTestId('tab-container-div');
    expect(container).toBeInTheDocument();
    expect(mainContainer).toHaveClass('max-w-[980px]');
    expect(mainContainer).toHaveTextContent('Test Content');
  });
});
